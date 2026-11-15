'use client';

import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { updateSiteSettingsAction } from '@/actions/settings';
import { useToast } from '@/components/ui/toast';

interface SettingsEditorProps {
  initialSettings: {
    siteTitle: string;
    tagline: string;
    metaDescription: string;
    footerText: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    linkedinUrl: string | null;
    githubUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    showResumeDownload: boolean;
  };
}

export function SettingsEditor({ initialSettings }: SettingsEditorProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    ...initialSettings,
    linkedinUrl: initialSettings.linkedinUrl || '',
    githubUrl: initialSettings.githubUrl || '',
    twitterUrl: initialSettings.twitterUrl || '',
    instagramUrl: initialSettings.instagramUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateSiteSettingsAction({
      ...form,
      linkedinUrl: form.linkedinUrl || null,
      githubUrl: form.githubUrl || null,
      twitterUrl: form.twitterUrl || null,
      instagramUrl: form.instagramUrl || null,
    });
    setSaving(false);
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Website settings updated', variant: 'success' });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwForm),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: 'Password update failed', description: json.error, variant: 'error' });
        return;
      }
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({ title: 'Password updated', description: 'Use your new password on next sign in.', variant: 'success' });
    } catch {
      toast({ title: 'Network error', variant: 'error' });
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSaveSettings}
        className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-5"
      >
        <h2 className="font-serif text-2xl text-[#4C0519]">General &amp; SEO Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Site Title</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">SEO Meta Description</label>
          <textarea
            rows={2}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Contact Phone</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            placeholder="LinkedIn URL (optional)"
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
          <input
            type="url"
            placeholder="X / Twitter URL (optional)"
            value={form.twitterUrl}
            onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
          <input
            type="url"
            placeholder="Instagram URL (optional)"
            value={form.instagramUrl}
            onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
            className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">Footer Text</label>
          <input
            type="text"
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Website Settings'}</span>
        </button>
      </form>

      {/* Change Admin Password */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4 max-w-xl"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#4C0519]" />
          <h2 className="font-serif text-xl text-[#4C0519]">Change Administrator Password</h2>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">Current Password</label>
          <input
            type="password"
            required
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">New Password (min 8 chars)</label>
          <input
            type="password"
            required
            minLength={8}
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={changingPw}
          className="px-5 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
        >
          {changingPw ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
