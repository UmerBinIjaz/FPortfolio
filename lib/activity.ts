import { prisma, isDatabaseConfigured } from './prisma';

export async function logContentActivity(params: {
  entityType: string;
  entityId: string;
  entityTitle: string;
  action: string;
  summary?: string;
  adminId?: string;
}) {
  if (!isDatabaseConfigured()) return;
  try {
    await prisma.contentActivity.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        entityTitle: params.entityTitle,
        action: params.action,
        summary: params.summary ?? null,
        adminId: params.adminId ?? null,
      },
    });
  } catch {
    // Non-critical activity logging should never break primary mutation
  }
}
