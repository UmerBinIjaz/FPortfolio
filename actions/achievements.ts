'use server';

import { revalidatePath } from 'next/cache';
import { PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { achievementSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { slugify } from '@/lib/utils';

export async function upsertAchievementAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = achievementSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid achievement data.' };
    }

    const {
      issueDate,
      slug: rawSlug,
      certificateFileUrl,
      certificateFileType,
      ...rest
    } = parsed.data;
    const cleanSlug = slugify(rawSlug || rest.title);
    const parsedDate = issueDate ? new Date(issueDate) : null;

    const record = id
      ? await prisma.$transaction(async (tx) => {
          const updated = await tx.achievement.update({
            where: { id },
            data: {
              ...rest,
              slug: cleanSlug,
              issueDate: parsedDate,
            },
          });

          await tx.certificate.deleteMany({ where: { achievementId: id } });
          if (certificateFileUrl) {
            await tx.certificate.create({
              data: {
                title: updated.title,
                issuingOrg: updated.issuingOrg,
                issueDate: parsedDate,
                fileUrl: certificateFileUrl,
                fileType: certificateFileType || 'IMAGE',
                verificationUrl: updated.verificationUrl,
                category: updated.category,
                featured: updated.featured,
                status: updated.status,
                achievementId: updated.id,
              },
            });
          }
          return updated;
        })
      : await prisma.achievement.create({
          data: {
            ...rest,
            slug: cleanSlug,
            issueDate: parsedDate,
            ...(certificateFileUrl
              ? {
                  certificates: {
                    create: {
                      title: rest.title,
                      issuingOrg: rest.issuingOrg,
                      issueDate: parsedDate,
                      fileUrl: certificateFileUrl,
                      fileType: certificateFileType || 'IMAGE',
                      verificationUrl: rest.verificationUrl,
                      category: rest.category,
                      featured: rest.featured,
                      status: rest.status,
                    },
                  },
                }
              : {}),
          },
        });

    await logContentActivity({
      entityType: 'Achievement',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/achievements');
    revalidatePath('/admin/achievements');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function toggleAchievementStatusAction(
  id: string,
  updates: { status?: PublicationStatus; featured?: boolean }
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const record = await prisma.achievement.update({ where: { id }, data: updates });

    if (updates.status) {
      await prisma.certificate.updateMany({
        where: { achievementId: id },
        data: { status: updates.status },
      });
    }

    await logContentActivity({
      entityType: 'Achievement',
      entityId: record.id,
      entityTitle: record.title,
      action: 'UPDATED',
      adminId: session.adminId,
    });

    revalidatePath('/achievements');
    revalidatePath('/admin/achievements');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteAchievementAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.achievement.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'Achievement',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/achievements');
    revalidatePath('/admin/achievements');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
