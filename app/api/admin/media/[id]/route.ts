import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { verifyCsrfOrigin } from '@/lib/session';
import { deleteFromCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import { logContentActivity } from '@/lib/activity';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const session = await requireAdmin();
    const { id } = await context.params;

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: 'Media asset not found.' }, { status: 404 });
    }

    // Check database relationships across all entities before removing from Cloudinary
    const url = asset.url;
    const publicId = asset.publicId;

    const [
      profileUsed,
      projectThumbUsed,
      projectMediaUsed,
      webinarUsed,
      symposiumUsed,
      symposiumMediaUsed,
      lessonPlanUsed,
      demoUsed,
      resourceUsed,
      certificateUsed,
      blogUsed,
    ] = await Promise.all([
      prisma.profile.count({ where: { OR: [{ profileImageUrl: url }, { profileImageId: publicId }, { cvDocumentUrl: url }] } }),
      prisma.portfolioProject.count({ where: { OR: [{ thumbnailUrl: url }, { thumbnailId: publicId }, { documentUrl: url }] } }),
      prisma.projectMedia.count({ where: { OR: [{ mediaUrl: url }, { publicId }] } }),
      prisma.webinar.count({ where: { OR: [{ thumbnailUrl: url }, { thumbnailId: publicId }, { certificateUrl: url }, { certificateId: publicId }] } }),
      prisma.symposium.count({ where: { OR: [{ slidesUrl: url }, { certificateUrl: url }, { certificateId: publicId }] } }),
      prisma.symposiumMedia.count({ where: { OR: [{ mediaUrl: url }, { publicId }] } }),
      prisma.teachingLessonPlan.count({ where: { documentUrl: url } }),
      prisma.teachingDemonstration.count({ where: { OR: [{ thumbnailUrl: url }, { thumbnailId: publicId }, { videoUrl: url }] } }),
      prisma.teachingResource.count({ where: { OR: [{ fileUrl: url }, { fileId: publicId }] } }),
      prisma.certificate.count({ where: { OR: [{ fileUrl: url }, { publicId }] } }),
      prisma.blogPost.count({ where: { OR: [{ featuredImageUrl: url }, { featuredImageId: publicId }] } }),
    ]);

    const totalUsages =
      profileUsed +
      projectThumbUsed +
      projectMediaUsed +
      webinarUsed +
      symposiumUsed +
      symposiumMediaUsed +
      lessonPlanUsed +
      demoUsed +
      resourceUsed +
      certificateUsed +
      blogUsed;

    if (totalUsages > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete media asset: it is currently referenced in ${totalUsages} portfolio/content record(s). Remove those references first.`,
        },
        { status: 409 }
      );
    }

    if (isCloudinaryConfigured()) {
      await deleteFromCloudinary(asset.publicId, asset.resourceType);
    }

    await prisma.mediaAsset.delete({ where: { id: asset.id } });

    await logContentActivity({
      entityType: 'MediaAsset',
      entityId: asset.id,
      entityTitle: asset.title,
      action: 'DELETED',
      summary: `Deleted unused media asset (${asset.fileName})`,
      adminId: session.adminId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete media asset.';
    const status = message.startsWith('Unauthorized') ? 401 : message.startsWith('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
