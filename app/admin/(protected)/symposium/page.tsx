import { prisma } from '@/lib/prisma';
import { SymposiumManager } from '@/components/admin/SymposiumManager';

export const dynamic = 'force-dynamic';

export default async function AdminSymposiumPage() {
  const symposiums = await prisma.symposium.findMany({
    where: { deletedAt: null },
    include: { media: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">Symposium &amp; Presentations</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Manage academic symposium records, presentation slides, feedback, and certificates.
        </p>
      </div>
      <SymposiumManager symposiums={symposiums} />
    </div>
  );
}
