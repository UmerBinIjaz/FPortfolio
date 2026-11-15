'use server';

import { revalidatePath } from 'next/cache';
import { MediaType, PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { portfolioProjectSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { slugify } from '@/lib/utils';

export async function upsertPortfolioProjectAction(
  input: unknown,
  id?: string
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = portfolioProjectSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid project data.' };
    }

    const { galleryUrls, projectDate, slug: rawSlug, ...rest } = parsed.data;
    const cleanSlug = slugify(rawSlug || rest.title);

    const parsedDate = projectDate ? new Date(projectDate) : null;

    const record = id
      ? await prisma.$transaction(async (tx) => {
          await tx.projectMedia.deleteMany({ where: { projectId: id } });
          return tx.portfolioProject.update({
            where: { id },
            data: {
              ...rest,
              slug: cleanSlug,
              projectDate: parsedDate,
              media: {
                create: galleryUrls.map((url, idx) => ({
                  mediaUrl: url,
                  mediaType: MediaType.IMAGE,
                  sortOrder: idx,
                })),
              },
            },
          });
        })
      : await prisma.portfolioProject.create({
          data: {
            ...rest,
            slug: cleanSlug,
            projectDate: parsedDate,
            media: {
              create: galleryUrls.map((url, idx) => ({
                mediaUrl: url,
                mediaType: MediaType.IMAGE,
                sortOrder: idx,
              })),
            },
          },
        });

    await logContentActivity({
      entityType: 'PortfolioProject',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${record.slug}`);
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function togglePortfolioStatusAction(
  id: string,
  updates: { status?: PublicationStatus; featured?: boolean }
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const record = await prisma.portfolioProject.update({
      where: { id },
      data: updates,
    });

    await logContentActivity({
      entityType: 'PortfolioProject',
      entityId: record.id,
      entityTitle: record.title,
      action: 'UPDATED',
      summary: `Status updated (${record.status}, featured=${record.featured})`,
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${record.slug}`);
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deletePortfolioProjectAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.portfolioProject.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'PortfolioProject',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
