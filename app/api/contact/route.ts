import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validations/schemas';
import { checkRateLimit, getClientIp, hashIp } from '@/lib/rate-limit';
import { verifyCsrfOrigin } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const ip = getClientIp(request.headers);
    const rate = checkRateLimit(`contact-submit:${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many messages sent. Please wait ${rate.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Please check your form details.' },
        { status: 400 }
      );
    }

    // Honeypot anti-spam check
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // Minimum human completion timing check (1.2 seconds)
    if (parsed.data.startedAt && Date.now() - parsed.data.startedAt < 1200) {
      return NextResponse.json(
        { error: 'Please take a moment to review your message before submitting.' },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            'The contact inbox database is not configured yet. Please reach out directly at faryalgull042@hotmail.com.',
        },
        { status: 503 }
      );
    }

    const created = await prisma.contactMessage.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        ipHash: hashIp(ip),
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: created.id,
        message: 'Thank you for your message. Faryal will respond as soon as possible.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Contact Submission Error]:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Unable to send your message right now. Please try again later.' },
      { status: 500 }
    );
  }
}
