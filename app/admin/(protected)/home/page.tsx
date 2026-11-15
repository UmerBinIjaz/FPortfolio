import { getHomeContent } from '@/lib/data';
import { HomeEditor } from '@/components/admin/HomeEditor';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const home = await getHomeContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Home Page Content</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Edit hero introduction, about preview, areas of interest, and contact CTA.
        </p>
      </div>
      <HomeEditor initialData={home} />
    </div>
  );
}
