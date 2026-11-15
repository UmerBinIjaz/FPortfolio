'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { siteSettingsSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';

export async function updateSiteSettingsAction(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = siteSettingsSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid settings data.' };
    }

    const existing = await prisma.siteSettings.findFirst();
    const record = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.siteSettings.create({
          data: parsed.data,
        });

    await logContentActivity({
      entityType: 'SiteSettings',
      entityId: record.id,
      entityTitle: record.siteTitle,
      action: 'UPDATED',
      summary: 'Updated website metadata, footer, and contact settings.',
      adminId: session.adminId,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}
