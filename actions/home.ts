'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { homeContentSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';

export async function updateHomeContentAction(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = homeContentSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid home content.' };
    }

    const existing = await prisma.homeContent.findFirst();
    const record = existing
      ? await prisma.homeContent.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.homeContent.create({
          data: parsed.data,
        });

    await logContentActivity({
      entityType: 'HomeContent',
      entityId: record.id,
      entityTitle: record.heroHeadline,
      action: 'UPDATED',
      summary: 'Updated homepage hero, preview, and areas of interest.',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/admin/home');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}
