import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { verifyCsrfOrigin } from '@/lib/session';
import { changePasswordSchema } from '@/lib/validations/schemas';
import { logContentActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const session = await requireAdmin();
    const body = await request.json().catch(() => null);
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid password input.' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
    if (!admin) {
      return NextResponse.json({ error: 'Administrator account not found.' }, { status: 404 });
    }

    const isCurrentValid = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = await hashPassword(parsed.data.newPassword);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    await logContentActivity({
      entityType: 'Admin',
      entityId: admin.id,
      entityTitle: admin.email,
      action: 'PASSWORD_UPDATED',
      summary: 'Administrator password updated.',
      adminId: admin.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update password.';
    const status = message.startsWith('Unauthorized') ? 401 : message.startsWith('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
