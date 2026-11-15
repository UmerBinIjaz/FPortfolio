'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { messageUpdateSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';

export async function updateMessageStatusAction(id: string, input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = messageUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid message update.' };
    }

    const record = await prisma.contactMessage.update({
      where: { id },
      data: parsed.data,
    });

    await logContentActivity({
      entityType: 'ContactMessage',
      entityId: record.id,
      entityTitle: `${record.fullName}: ${record.subject}`,
      action: 'UPDATED',
      summary: `Marked message as ${record.status}`,
      adminId: session.adminId,
    });

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.contactMessage.delete({ where: { id } });

    await logContentActivity({
      entityType: 'ContactMessage',
      entityId: deleted.id,
      entityTitle: `${deleted.fullName}: ${deleted.subject}`,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
