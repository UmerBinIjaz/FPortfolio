'use server';

import { revalidatePath } from 'next/cache';
import { PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { blogPostSchema } from '@/lib/validations/schemas';
import { ActionResult, assertDatabaseReady, handleActionError } from '@/lib/action-utils';
import { logContentActivity } from '@/lib/activity';
import { sanitizeHtml } from '@/lib/sanitize';
import { estimateReadingTime, slugify } from '@/lib/utils';

export async function upsertBlogPostAction(input: unknown, id?: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const parsed = blogPostSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid article data.' };
    }

    const { content, publishedAt, slug: rawSlug, categoryId, ...rest } = parsed.data;
    const sanitizedContent = sanitizeHtml(content);
    const readingTimeMinutes = estimateReadingTime(sanitizedContent);
    const cleanSlug = slugify(rawSlug || rest.title);

    const resolvedPublishedAt =
      publishedAt && publishedAt.trim()
        ? new Date(publishedAt)
        : rest.status === PublicationStatus.PUBLISHED
          ? new Date()
          : null;

    const record = id
      ? await prisma.blogPost.update({
          where: { id },
          data: {
            ...rest,
            slug: cleanSlug,
            content: sanitizedContent,
            readingTimeMinutes,
            categoryId: categoryId || null,
            publishedAt: resolvedPublishedAt,
          },
        })
      : await prisma.blogPost.create({
          data: {
            ...rest,
            slug: cleanSlug,
            content: sanitizedContent,
            readingTimeMinutes,
            categoryId: categoryId || null,
            publishedAt: resolvedPublishedAt,
          },
        });

    await logContentActivity({
      entityType: 'BlogPost',
      entityId: record.id,
      entityTitle: record.title,
      action: id ? 'UPDATED' : 'CREATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/reflections');
    revalidatePath(`/reflections/${record.slug}`);
    revalidatePath('/admin/reflections');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function toggleBlogPostStatusAction(
  id: string,
  updates: { status?: PublicationStatus; featured?: boolean }
): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Article not found.' };
    }

    const record = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updates,
        ...(updates.status === PublicationStatus.PUBLISHED && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    });

    await logContentActivity({
      entityType: 'BlogPost',
      entityId: record.id,
      entityTitle: record.title,
      action: 'UPDATED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/reflections');
    revalidatePath(`/reflections/${record.slug}`);
    revalidatePath('/admin/reflections');
    revalidatePath('/admin/dashboard');
    return { success: true, data: record };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  try {
    assertDatabaseReady();
    const session = await requireAdmin();
    const deleted = await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date(), status: PublicationStatus.ARCHIVED },
    });

    await logContentActivity({
      entityType: 'BlogPost',
      entityId: deleted.id,
      entityTitle: deleted.title,
      action: 'DELETED',
      adminId: session.adminId,
    });

    revalidatePath('/');
    revalidatePath('/reflections');
    revalidatePath('/admin/reflections');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
