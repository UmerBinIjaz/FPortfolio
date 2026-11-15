import { prisma } from '@/lib/prisma';
import { WebinarsManager } from '@/components/admin/WebinarsManager';

export const dynamic = 'force-dynamic';

export default async function AdminWebinarsPage() {
  const webinars = await prisma.webinar.findMany({
    where: { deletedAt: null },
    include: { reflection: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Webinars &amp; Reflections</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Document attended webinars, structured learning reflections, and completion certificates.
        </p>
      </div>
      <WebinarsManager webinars={webinars} />
    </div>
  );
}
