import { prisma } from '@/lib/prisma';
import { getProfile } from '@/lib/data';
import { AboutEditor } from '@/components/admin/AboutEditor';

export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  const [profile, educations, skills, trainings] = await Promise.all([
    getProfile(),
    prisma.education.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.training.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">About Me &amp; Academic Profile</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Manage biography, developing teaching philosophy, education timeline, skills, and DigiSkills.pk training.
        </p>
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
