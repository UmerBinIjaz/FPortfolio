import { isDatabaseConfigured } from './prisma';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function handleActionError(error: unknown): ActionResult {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return { success: false, error: message };
}

export function assertDatabaseReady() {
  if (!isDatabaseConfigured()) {
    throw new Error(
      'Neon PostgreSQL DATABASE_URL is not configured. Configure .env and run database migrations before saving changes.'
    );
  }
}
