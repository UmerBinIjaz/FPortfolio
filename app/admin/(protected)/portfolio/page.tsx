import { prisma } from '@/lib/prisma';
import { PortfolioManager } from '@/components/admin/PortfolioManager';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { deletedAt: null },
    include: { media: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">Portfolio Projects</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Create, edit, publish, feature, and manage portfolio work and supporting files.
        </p>
      </div>
      <PortfolioManager projects={projects} />
    </div>
  );
}
