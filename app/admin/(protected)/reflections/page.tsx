import { prisma } from '@/lib/prisma';
import { ReflectionsManager } from '@/components/admin/ReflectionsManager';

export const dynamic = 'force-dynamic';

export default async function AdminReflectionsPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { deletedAt: null },
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ createdAt: 'desc' }],
    }),
    prisma.blogCategory.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">Reflections &amp; Blog</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Write, format, categorize, and publish academic reflections and essays.
        </p>
      </div>
      <ReflectionsManager posts={posts} categories={categories} />
    </div>
  );
}
