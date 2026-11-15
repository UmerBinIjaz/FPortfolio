import React from 'react';
import { NextResponse } from 'next/server';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import {
  getProfile,
  getPublishedEducation,
  getPublishedSkills,
  getPublishedTrainings,
} from '@/lib/data';
import { CvPdfDocument } from '@/lib/pdf/cv-document';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [profile, educations, skills, trainings] = await Promise.all([
      getProfile(),
      getPublishedEducation(),
      getPublishedSkills(),
      getPublishedTrainings(),
    ]);

    const pdfElement = React.createElement(CvPdfDocument, {
      profile: {
        fullName: profile.fullName,
        title: profile.title,
        tagline: profile.tagline,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        summary: profile.summary,
        languages: profile.languages,
      },
      educations,
      skills,
      trainings,
    });

    const buffer = await renderToBuffer(
      pdfElement as unknown as React.ReactElement<DocumentProps>
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Faryal_CV.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[CV PDF Generation Error]:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Unable to generate CV PDF right now.' }, { status: 500 });
  }
}
