import { prisma } from '@/lib/prisma';
import { AchievementsManager } from '@/components/admin/AchievementsManager';

export const dynamic = 'force-dynamic';

export default async function AdminAchievementsPage() {
  const items = await prisma.achievement.findMany({
    where: { deletedAt: null },
    include: { certificates: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Achievements &amp; Certificates</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Upload genuine academic honors, DigiSkills.pk certificates, awards, and participation credentials.
        </p>
      </div>
      <AchievementsManager items={items} />
    </div>
  );
}
