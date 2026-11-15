import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { verifyCsrfOrigin } from '@/lib/session';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_UPLOAD_MIME_TYPES,
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from '@/lib/cloudinary';
import { logContentActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const session = await requireAdmin();

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: 'Neon PostgreSQL database must be configured before uploading media.' },
        { status: 503 }
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.',
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const titleInput = (formData.get('title') as string | null)?.trim();
    const categoryInput = (formData.get('category') as string | null)?.trim() || 'General';
    const folderInput = (formData.get('folder') as string | null)?.trim() || 'faryal-portfolio';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Please select a file to upload.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error:
            'Unsupported file extension. Allowed: jpg, jpeg, png, webp, gif, pdf, doc, docx, ppt, pptx, mp4, webm.',
        },
        { status: 400 }
      );
    }

    const mimeRule = ALLOWED_UPLOAD_MIME_TYPES[file.type];
    if (!mimeRule) {
      return NextResponse.json(
        { error: `Unsupported MIME type: ${file.type || 'unknown'}` },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > mimeRule.maxBytes) {
      return NextResponse.json(
        {
          error: `File size exceeds the ${Math.round(mimeRule.maxBytes / (1024 * 1024))}MB limit for this file type.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFolder = folderInput.replace(/[^a-zA-Z0-9/_-]/g, '') || 'faryal-portfolio';
    const uploaded = await uploadBufferToCloudinary({
      buffer,
      fileName: file.name,
      folder: safeFolder,
      resourceType: mimeRule.resourceType,
    });

    const asset = await prisma.mediaAsset.create({
      data: {
        title: titleInput || file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        mediaType: mimeRule.mediaType,
        mimeType: file.type,
        format: uploaded.format || ext,
        bytes: uploaded.bytes,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        folder: safeFolder,
        category: categoryInput,
        uploadedById: session.adminId,
      },
    });

    await logContentActivity({
      entityType: 'MediaAsset',
      entityId: asset.id,
      entityTitle: asset.title,
      action: 'UPLOADED',
      summary: `Uploaded ${asset.mediaType} (${asset.fileName})`,
      adminId: session.adminId,
    });

    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.';
    const status = message.startsWith('Unauthorized') ? 401 : message.startsWith('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
