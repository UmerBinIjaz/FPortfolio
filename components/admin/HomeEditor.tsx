'use client';

import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { updateHomeContentAction } from '@/actions/home';
import { useToast } from '@/components/ui/toast';
import type { AreaOfInterestItem } from '@/lib/fallback-data';

interface HomeEditorProps {
  initialData: {
    heroHeadline: string;
    heroTitle: string;
    heroTagline: string;
    heroIntro: string;
    aboutPreviewTitle: string;
    aboutPreviewText: string;
    areasOfInterest: AreaOfInterestItem[];
    academicActivitiesTitle: string;
    academicActivitiesText: string;
    contactCtaTitle: string;
    contactCtaText: string;
  };
}

export function HomeEditor({ initialData }: HomeEditorProps) {
  const { toast } = useToast();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateHomeContentAction(form);
    setSaving(false);
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Homepage updated', description: 'Changes are live.', variant: 'success' });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#4C0519]">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Hero Headline</label>
            <input
              type="text"
              value={form.heroHeadline}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Professional Title</label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">Tagline</label>
          <input
            type="text"
            value={form.heroTagline}
            onChange={(e) => setForm({ ...form, heroTagline: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">Hero Introduction</label>
          <textarea
            rows={3}
            value={form.heroIntro}
            onChange={(e) => setForm({ ...form, heroIntro: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#4C0519]">About &amp; Activities Previews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">About Preview Title</label>
            <input
              type="text"
              value={form.aboutPreviewTitle}
              onChange={(e) => setForm({ ...form, aboutPreviewTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Academic Activities Title</label>
            <input
              type="text"
              value={form.academicActivitiesTitle}
              onChange={(e) => setForm({ ...form, academicActivitiesTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">About Preview Text</label>
            <textarea
              rows={3}
              value={form.aboutPreviewText}
              onChange={(e) => setForm({ ...form, aboutPreviewText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4C0519] mb-1">Academic Activities Text</label>
            <textarea
              rows={3}
              value={form.academicActivitiesText}
              onChange={(e) => setForm({ ...form, academicActivitiesText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#4C0519]">Areas of Interest</h2>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                areasOfInterest: [...form.areasOfInterest, { title: '', description: '' }],
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FCE7F3] text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/80"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Area</span>
          </button>
        </div>
        <div className="space-y-4">
          {form.areasOfInterest.map((area, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start pb-4 border-b border-[#4C0519]/10 last:border-b-0">
              <div className="md:col-span-4">
                <input
                  type="text"
                  placeholder="Area title"
                  value={area.title}
                  onChange={(e) => {
                    const next = [...form.areasOfInterest];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setForm({ ...form, areasOfInterest: next });
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
                />
              </div>
              <div className="md:col-span-7">
                <input
                  type="text"
                  placeholder="Short description"
                  value={area.description}
                  onChange={(e) => {
                    const next = [...form.areasOfInterest];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setForm({ ...form, areasOfInterest: next });
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
                />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      areasOfInterest: form.areasOfInterest.filter((_, i) => i !== idx),
                    })
                  }
                  aria-label="Remove area"
                  className="p-2 text-rose-700 hover:bg-rose-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#4C0519]">Contact Call-to-Action</h2>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">CTA Title</label>
          <input
            type="text"
            value={form.contactCtaTitle}
            onChange={(e) => setForm({ ...form, contactCtaTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#4C0519] mb-1">CTA Description</label>
          <textarea
            rows={2}
            value={form.contactCtaText}
            onChange={(e) => setForm({ ...form, contactCtaText: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'Saving...' : 'Save Homepage Content'}</span>
      </button>
    </form>
  );
}
