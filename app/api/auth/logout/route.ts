import { NextRequest, NextResponse } from 'next/server';
import { destroyAdminSession, verifyCsrfOrigin } from '@/lib/session';

export async function POST(request: NextRequest) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
