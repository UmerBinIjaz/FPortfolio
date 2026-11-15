import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createAdminSession, verifyCsrfOrigin } from '@/lib/session';
import { loginSchema } from '@/lib/validations/schemas';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const ip = getClientIp(request.headers);
    const rate = checkRateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rate.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            'Neon PostgreSQL database is not configured yet. Set DATABASE_URL, DIRECT_URL, ADMIN_EMAIL, and ADMIN_PASSWORD, then run prisma migrate and npm run db:seed.',
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid credentials format.' },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await createAdminSession({
      adminId: admin.id,
      role: admin.role,
      userAgent: request.headers.get('user-agent'),
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: 'Unable to complete sign in. Please check server logs.' },
      { status: 500 }
    );
  }
}
