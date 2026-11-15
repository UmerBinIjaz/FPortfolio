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
        <h1 className="font-serif text-3xl text-[#4C0519]">Media Library</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Centralized Cloudinary asset storage synchronized with Neon PostgreSQL metadata.
        </p>
      </div>
      <MediaLibraryManager assets={assets} />
    </div>
  );
}
