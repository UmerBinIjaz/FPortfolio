import { getSiteSettings } from '@/lib/data';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#4C0519]">Website Settings &amp; Security</h1>
        <p className="text-sm text-[#6E5A64] mt-1">
          Configure site metadata, social links, contact info, and administrator password.
        </p>
      </div>
      <SettingsEditor initialSettings={settings} />
    </div>
  );
}
