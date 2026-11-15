import { v2 as cloudinary } from 'cloudinary';
import { MediaType } from '@prisma/client';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')
  );
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary environment variables are not configured.');
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const ALLOWED_UPLOAD_MIME_TYPES: Record<
  string,
  { mediaType: MediaType; resourceType: 'image' | 'video' | 'raw'; maxBytes: number }
> = {
  'image/jpeg': { mediaType: MediaType.IMAGE, resourceType: 'image', maxBytes: 10 * 1024 * 1024 },
  'image/png': { mediaType: MediaType.IMAGE, resourceType: 'image', maxBytes: 10 * 1024 * 1024 },
  'image/webp': { mediaType: MediaType.IMAGE, resourceType: 'image', maxBytes: 10 * 1024 * 1024 },
  'image/gif': { mediaType: MediaType.IMAGE, resourceType: 'image', maxBytes: 10 * 1024 * 1024 },
  'application/pdf': { mediaType: MediaType.PDF, resourceType: 'raw', maxBytes: 20 * 1024 * 1024 },
  'application/msword': { mediaType: MediaType.DOCUMENT, resourceType: 'raw', maxBytes: 20 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    mediaType: MediaType.DOCUMENT,
    resourceType: 'raw',
    maxBytes: 20 * 1024 * 1024,
  },
  'application/vnd.ms-powerpoint': {
    mediaType: MediaType.PRESENTATION,
    resourceType: 'raw',
    maxBytes: 30 * 1024 * 1024,
  },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    mediaType: MediaType.PRESENTATION,
    resourceType: 'raw',
    maxBytes: 30 * 1024 * 1024,
  },
  'video/mp4': { mediaType: MediaType.VIDEO, resourceType: 'video', maxBytes: 50 * 1024 * 1024 },
  'video/webm': { mediaType: MediaType.VIDEO, resourceType: 'video', maxBytes: 50 * 1024 * 1024 },
};

export const ALLOWED_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'mp4',
  'webm',
]);

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
}

export async function uploadBufferToCloudinary(params: {
  buffer: Buffer;
  fileName: string;
  folder: string;
  resourceType: 'image' | 'video' | 'raw';
}): Promise<CloudinaryUploadResult> {
  configureCloudinary();

  const sanitizedBaseName = params.fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .slice(0, 60);

  const ext = params.fileName.split('.').pop()?.toLowerCase() || '';
  const publicId =
    params.resourceType === 'raw' && ext
      ? `${sanitizedBaseName}-${Date.now()}.${ext}`
      : `${sanitizedBaseName}-${Date.now()}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: params.folder,
        public_id: publicId,
        resource_type: params.resourceType,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(params.buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: string = 'image'
): Promise<void> {
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType as 'image' | 'video' | 'raw',
  });
}
