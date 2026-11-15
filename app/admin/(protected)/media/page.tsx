import { prisma } from '@/lib/prisma';
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Media Library</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Centralized Cloudinary asset storage synchronized with Neon PostgreSQL metadata.
        </p>
      </div>
      <MediaLibraryManager assets={assets} />
    </div>
  );
}
