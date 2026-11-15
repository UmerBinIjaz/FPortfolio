'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import {
  educationSchema,
  profileSchema,
  skillSchema,
  trainingSchema,
} from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid profile data.' };
    }

    const existing = await prisma.profile.findFirst();
    const record = existing
      ? await prisma.profile.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.profile.create({
          data: parsed.data,
        });

    await logContentActivity({
      entityType: 'Profile',
      entityId: record.id,
      entityTitle: record.fullName,
      action: 'UPDATED',
      summary: 'Updated profile, biography, and teaching philosophy.',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/contact');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertEducationAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = educationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid education record.' };
    }

    const record = id
      ? await prisma.education.update({ where: { id }, data: parsed.data })
      : await prisma.education.create({ data: parsed.data });

    await logContentActivity({
      entityType: 'Education',
      entityId: record.id,
      entityTitle: `${record.degree} — ${record.institution}`,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteEducationAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.education.delete({ where: { id } });

    await logContentActivity({
      entityType: 'Education',
      entityId: deleted.id,
      entityTitle: `${deleted.degree} — ${deleted.institution}`,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertSkillAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid skill data.' };
    }

    const record = id
      ? await prisma.skill.update({ where: { id }, data: parsed.data })
      : await prisma.skill.create({ data: parsed.data });

    await logContentActivity({
      entityType: 'Skill',
      entityId: record.id,
      entityTitle: record.name,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteSkillAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.skill.delete({ where: { id } });

    await logContentActivity({
      entityType: 'Skill',
      entityId: deleted.id,
      entityTitle: deleted.name,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertTrainingAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = trainingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid training data.' };
    }

    const record = id
      ? await prisma.training.update({ where: { id }, data: parsed.data })
      : await prisma.training.create({ data: parsed.data });

    await logContentActivity({
      entityType: 'Training',
      entityId: record.id,
      entityTitle: `${record.title} — ${record.provider}`,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTrainingAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.training.delete({ where: { id } });

    await logContentActivity({
      entityType: 'Training',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/resume');
    revalidatePath('/admin/about');
    revalidatePath('/admin/resume');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
