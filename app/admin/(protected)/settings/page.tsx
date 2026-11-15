import { getSiteSettings } from '@/lib/data';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Website Settings &amp; Security</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Configure site metadata, social links, contact info, and administrator password.
        </p>
      </div>
      <SettingsEditor initialSettings={settings} />
    </div>
  );
}
