import Link from 'next/link';
import { Download, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getProfile } from '@/lib/data';
import { AboutEditor } from '@/components/admin/AboutEditor';

export const dynamic = 'force-dynamic';

export default async function AdminResumePage() {
  const [profile, educations, skills, trainings] = await Promise.all([
    getProfile(),
    prisma.education.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.training.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#172554]">Resume / CV Management</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Any edits to summary, education, skills, languages, or training dynamically regenerate the public CV and PDF download.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/resume/pdf"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#172554] text-white rounded-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Test Generated PDF</span>
          </a>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#172554]/20 text-[#172554] rounded-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public CV</span>
          </Link>
        </div>
      </div>

      <AboutEditor
        profile={profile}
        educations={educations}
        skills={skills}
        trainings={trainings}
      />
    </div>
  );
}
