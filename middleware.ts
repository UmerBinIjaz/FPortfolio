import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'faryal_admin_session';

async function verifyEdgeSignature(cookieValue: string): Promise<boolean> {
  try {
    const secret =
      process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16
        ? process.env.AUTH_SECRET
        : process.env.NODE_ENV === 'production'
          ? ''
          : 'dev-only-insecure-fallback-secret-change-me';

    if (!secret) return false;

    const parts = cookieValue.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, sigHex] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
    const expectedHex = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedHex.length !== sigHex.length) return false;
    let mismatch = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      mismatch |= expectedHex.charCodeAt(i) ^ sigHex.charCodeAt(i);
    }
    if (mismatch !== 0) return false;

    const normalizedB64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(normalizedB64);
    const parsed = JSON.parse(jsonStr) as { exp?: number; adminId?: string };
    return Boolean(parsed.adminId && parsed.exp && parsed.exp > Date.now());
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const cookieVal = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const hasValidSignature = cookieVal ? await verifyEdgeSignature(cookieVal) : false;

    if (!isLoginPage && !hasValidSignature) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && hasValidSignature) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
