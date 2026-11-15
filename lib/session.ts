import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { AdminRole } from '@prisma/client';
import { prisma, isDatabaseConfigured } from './prisma';

export const SESSION_COOKIE_NAME = 'faryal_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET environment variable must be configured in production.');
  }
  return 'dev-only-insecure-fallback-secret-change-me';
}

export interface SignedTokenPayload {
  token: string;
  adminId: string;
  role: AdminRole;
  exp: number;
}

function signPayload(payloadB64: string): string {
  return crypto
    .createHmac('sha256', getAuthSecret())
    .update(payloadB64)
    .digest('hex');
}

export function encodeSessionCookie(payload: SignedTokenPayload): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = signPayload(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function decodeAndVerifyCookieSignature(cookieValue: string): SignedTokenPayload | null {
  try {
    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sig] = parts;
    const expectedSig = signPayload(payloadB64);
    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SignedTokenPayload;
    if (!decoded.token || !decoded.adminId || !decoded.exp || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function hashSessionToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function createAdminSession(params: {
  adminId: string;
  role: AdminRole;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      tokenHash,
      adminId: params.adminId,
      expiresAt,
      userAgent: params.userAgent ?? null,
      ipAddress: params.ipAddress ?? null,
    },
  });

  const cookieValue = encodeSessionCookie({
    token: rawToken,
    adminId: params.adminId,
    role: params.role,
    exp: expiresAt.getTime(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return { expiresAt };
}

export interface VerifiedAdminSession {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  sessionId: string;
}

export async function getAdminSession(): Promise<VerifiedAdminSession | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!cookieValue) return null;

    const payload = decodeAndVerifyCookieSignature(cookieValue);
    if (!payload) return null;

    const tokenHash = hashSessionToken(payload.token);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date() || session.admin.id !== payload.adminId) {
      return null;
    }

    return {
      adminId: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role,
      sessionId: session.id,
    };
  } catch {
    return null;
  }
}

export async function destroyAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieValue && isDatabaseConfigured()) {
      const payload = decodeAndVerifyCookieSignature(cookieValue);
      if (payload) {
        const tokenHash = hashSessionToken(payload.token);
        await prisma.session.deleteMany({ where: { tokenHash } });
      }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore cookie deletion errors outside request scope
  }
}

export function verifyCsrfOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
