import { AdminRole } from '@prisma/client';
import { getAdminSession, VerifiedAdminSession } from './session';

export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export async function requireAdmin(
  allowedRoles: AdminRole[] = [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]
): Promise<VerifiedAdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new UnauthorizedError('Unauthorized: Administrator login required.');
  }
  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError('Forbidden: Insufficient role permissions.');
  }
  return session;
}
