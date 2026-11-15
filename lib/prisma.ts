import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.trim().length > 0 && !url.includes('USER:PASSWORD@ep-example'));
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isDatabaseConfigured()) {
    return fallback;
  }
  try {
    return await queryFn();
  } catch (error) {
    console.error('[Database Query Warning]:', error instanceof Error ? error.message : 'Unknown error');
    return fallback;
  }
}
