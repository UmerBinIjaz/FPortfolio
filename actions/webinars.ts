'use server';

import { revalidatePath } from 'next/cache';
import { PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { webinarSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { slugify } from '@/lib/utils';

export async function upsertWebinarAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = webinarSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid webinar data.' };
    }

    const { whatText, soWhatText, nowWhatText, eventDate, slug: rawSlug, ...rest } = parsed.data;
    const cleanSlug = slugify(rawSlug || rest.title);
    const parsedDate = eventDate ? new Date(eventDate) : null;
    const hasReflection = Boolean(whatText || soWhatText || nowWhatText);

    const record = id
      ? await prisma.webinar.update({
          where: { id },
          data: {
            ...rest,
            slug: cleanSlug,
            eventDate: parsedDate,
            ...(hasReflection
              ? {
                  reflection: {
                    upsert: {
                      create: { whatText, soWhatText, nowWhatText },
                      update: { whatText, soWhatText, nowWhatText },
                    },
                  },
                }
              : {}),
          },
        })
      : await prisma.webinar.create({
          data: {
            ...rest,
            slug: cleanSlug,
            eventDate: parsedDate,
            ...(hasReflection
              ? {
                  reflection: {
                    create: { whatText, soWhatText, nowWhatText },
                  },
                }
              : {}),
          },
        });

    await logContentActivity({
      entityType: 'Webinar',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/webinars');
    revalidatePath(`/webinars/${record.slug}`);
    revalidatePath('/admin/webinars');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function toggleWebinarStatusAction(
  id: string,
  updates: { status?: PublicationStatus; featured?: boolean }
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const record = await prisma.webinar.update({ where: { id }, data: updates });

    await logContentActivity({
      entityType: 'Webinar',
      entityId: record.id,
      entityTitle: record.title,
      action: 'UPDATED',
      adminId: session.adminId,
    });

    revalidatePath('/webinars');
    revalidatePath(`/webinars/${record.slug}`);
    revalidatePath('/admin/webinars');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteWebinarAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.webinar.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'Webinar',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/webinars');
    revalidatePath('/admin/webinars');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
