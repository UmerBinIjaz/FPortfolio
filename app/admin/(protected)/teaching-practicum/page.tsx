import { prisma } from '@/lib/prisma';
import { PracticumManager } from '@/components/admin/PracticumManager';

export const dynamic = 'force-dynamic';

export default async function AdminPracticumPage() {
  const [lessonPlans, demonstrations, resources, reflections] = await Promise.all([
    prisma.teachingLessonPlan.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
    prisma.teachingDemonstration.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
    prisma.teachingResource.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
    prisma.teachingReflection.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">Teaching Practicum Management</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Manage lesson plans, demonstrations, teaching materials, and reflective teaching notes.
        </p>
      </div>
      <PracticumManager
        lessonPlans={lessonPlans}
        demonstrations={demonstrations}
        resources={resources}
        reflections={reflections}
      />
    </div>
  );
}
