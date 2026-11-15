'use server';

import { revalidatePath } from 'next/cache';
import { MediaType, PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { symposiumSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { slugify } from '@/lib/utils';

export async function upsertSymposiumAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = symposiumSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid symposium data.' };
    }

    const { mediaUrls, eventDate, slug: rawSlug, ...rest } = parsed.data;
    const cleanSlug = slugify(rawSlug || rest.presentationTitle || rest.eventTitle);
    const parsedDate = eventDate ? new Date(eventDate) : null;

    const record = id
      ? await prisma.$transaction(async (tx) => {
          await tx.symposiumMedia.deleteMany({ where: { symposiumId: id } });
          return tx.symposium.update({
            where: { id },
            data: {
              ...rest,
              slug: cleanSlug,
              eventDate: parsedDate,
              media: {
                create: mediaUrls.map((url, idx) => ({
                  mediaUrl: url,
                  mediaType: MediaType.IMAGE,
                  sortOrder: idx,
                })),
              },
            },
          });
        })
      : await prisma.symposium.create({
          data: {
            ...rest,
            slug: cleanSlug,
            eventDate: parsedDate,
            media: {
              create: mediaUrls.map((url, idx) => ({
                mediaUrl: url,
                mediaType: MediaType.IMAGE,
                sortOrder: idx,
              })),
            },
          },
        });

    await logContentActivity({
      entityType: 'Symposium',
      entityId: record.id,
      entityTitle: record.eventTitle,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/symposium');
    revalidatePath(`/symposium/${record.slug}`);
    revalidatePath('/admin/symposium');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function toggleSymposiumStatusAction(
  id: string,
  updates: { status?: PublicationStatus; featured?: boolean }
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const record = await prisma.symposium.update({ where: { id }, data: updates });

    await logContentActivity({
      entityType: 'Symposium',
      entityId: record.id,
      entityTitle: record.eventTitle,
      action: 'UPDATED',
      adminId: session.adminId,
    });

    revalidatePath('/symposium');
    revalidatePath(`/symposium/${record.slug}`);
    revalidatePath('/admin/symposium');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteSymposiumAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.symposium.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'Symposium',
      entityId: deleted.id,
      entityTitle: deleted.eventTitle,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/symposium');
    revalidatePath('/admin/symposium');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
