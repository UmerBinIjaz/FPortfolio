'use server';

import { revalidatePath } from 'next/cache';
import { PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import {
  lessonPlanSchema,
  teachingDemoSchema,
  teachingReflectionSchema,
  teachingResourceSchema,
} from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { slugify } from '@/lib/utils';

export async function upsertLessonPlanAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = lessonPlanSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid lesson plan data.' };
    }

    const cleanSlug = slugify(parsed.data.slug || parsed.data.title);
    const data = { ...parsed.data, slug: cleanSlug };

    const record = id
      ? await prisma.teachingLessonPlan.update({ where: { id }, data })
      : await prisma.teachingLessonPlan.create({ data });

    await logContentActivity({
      entityType: 'TeachingLessonPlan',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteLessonPlanAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.teachingLessonPlan.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'TeachingLessonPlan',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertTeachingDemoAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = teachingDemoSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid demonstration data.' };
    }

    const { demonstrationDate, slug: rawSlug, ...rest } = parsed.data;
    const data = {
      ...rest,
      slug: slugify(rawSlug || rest.title),
      demonstrationDate: demonstrationDate ? new Date(demonstrationDate) : null,
    };

    const record = id
      ? await prisma.teachingDemonstration.update({ where: { id }, data })
      : await prisma.teachingDemonstration.create({ data });

    await logContentActivity({
      entityType: 'TeachingDemonstration',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTeachingDemoAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.teachingDemonstration.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });
    await logContentActivity({
      entityType: 'TeachingDemonstration',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });
    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertTeachingResourceAction(
  input: unknown,
  id?: string
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = teachingResourceSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid resource data.' };
    }

    const data = { ...parsed.data, slug: slugify(parsed.data.slug || parsed.data.title) };
    const record = id
      ? await prisma.teachingResource.update({ where: { id }, data })
      : await prisma.teachingResource.create({ data });

    await logContentActivity({
      entityType: 'TeachingResource',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTeachingResourceAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.teachingResource.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });
    await logContentActivity({
      entityType: 'TeachingResource',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });
    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function upsertTeachingReflectionAction(
  input: unknown,
  id?: string
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = teachingReflectionSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid reflection data.' };
    }

    const { reflectionDate, slug: rawSlug, ...rest } = parsed.data;
    const data = {
      ...rest,
      slug: slugify(rawSlug || rest.title),
      reflectionDate: reflectionDate ? new Date(reflectionDate) : null,
    };

    const record = id
      ? await prisma.teachingReflection.update({ where: { id }, data })
      : await prisma.teachingReflection.create({ data });

    await logContentActivity({
      entityType: 'TeachingReflection',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTeachingReflectionAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.teachingReflection.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });
    await logContentActivity({
      entityType: 'TeachingReflection',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });
    revalidatePath('/teaching-practicum');
    revalidatePath('/admin/teaching-practicum');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
