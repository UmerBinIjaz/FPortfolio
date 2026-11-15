'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { WEBINAR_CATEGORIES } from '@/lib/constants';
import {
  deleteWebinarAction,
  toggleWebinarStatusAction,
  upsertWebinarAction,
} from '@/actions/webinars';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { parseLinesOnly, slugify } from '@/lib/utils';

export interface AdminWebinarRow {
  id: string;
  title: string;
  slug: string;
  organizer: string;
  speaker: string | null;
  eventDate: Date | string | null;
  duration: string | null;
  category: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailId: string | null;
  topicsDiscussed: string[];
  knowledgeGained: string[];
  certificateUrl: string | null;
  certificateId: string | null;
  featured: boolean;
  status: PublicationStatus;
  reflection: {
    whatText: string;
    soWhatText: string;
    nowWhatText: string;
  } | null;
}

const emptyForm = {
  title: '',
  slug: '',
  organizer: '',
  speaker: '',
  eventDate: '',
  duration: '',
  category: WEBINAR_CATEGORIES[0] as string,
  description: '',
  thumbnailUrl: '',
  thumbnailId: '',
  topicsText: '',
  knowledgeText: '',
  certificateUrl: '',
  certificateId: '',
  whatText: '',
  soWhatText: '',
  nowWhatText: '',
  featured: false,
  status: PublicationStatus.DRAFT as PublicationStatus,
};

export function WebinarsManager({ webinars }: { webinars: AdminWebinarRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminWebinarRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return webinars.filter(
      (w) => !q || w.title.toLowerCase().includes(q) || w.organizer.toLowerCase().includes(q)
    );
  }, [webinars, search]);

  const startEdit = (w: AdminWebinarRow) => {
    setEditingId(w.id);
    setForm({
      title: w.title,
      slug: w.slug,
      organizer: w.organizer,
      speaker: w.speaker || '',
      eventDate: w.eventDate ? new Date(w.eventDate).toISOString().slice(0, 10) : '',
      duration: w.duration || '',
      category: w.category,
      description: w.description,
      thumbnailUrl: w.thumbnailUrl || '',
      thumbnailId: w.thumbnailId || '',
      topicsText: w.topicsDiscussed.join('\n'),
      knowledgeText: w.knowledgeGained.join('\n'),
      certificateUrl: w.certificateUrl || '',
      certificateId: w.certificateId || '',
      whatText: w.reflection?.whatText || '',
      soWhatText: w.reflection?.soWhatText || '',
      nowWhatText: w.reflection?.nowWhatText || '',
      featured: w.featured,
      status: w.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertWebinarAction(
      {
        title: form.title,
        slug: form.slug || slugify(form.title),
        organizer: form.organizer,
        speaker: form.speaker || null,
        eventDate: form.eventDate || null,
        duration: form.duration || null,
        category: form.category,
        description: form.description,
        thumbnailUrl: form.thumbnailUrl || null,
        thumbnailId: form.thumbnailId || null,
        topicsDiscussed: parseLinesOnly(form.topicsText),
        knowledgeGained: parseLinesOnly(form.knowledgeText),
        certificateUrl: form.certificateUrl || null,
        certificateId: form.certificateId || null,
        whatText: form.whatText,
        soWhatText: form.soWhatText,
        nowWhatText: form.nowWhatText,
        featured: form.featured,
        status: form.status,
      },
      editingId ?? undefined
    );
    setSaving(false);
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: editingId ? 'Webinar updated' : 'Webinar added', variant: 'success' });
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  };

  const handleToggle = async (w: AdminWebinarRow) => {
    const next =
      w.status === PublicationStatus.PUBLISHED
        ? PublicationStatus.DRAFT
        : PublicationStatus.PUBLISHED;
    const res = await toggleWebinarStatusAction(w.id, { status: next });
    if (!res.success) {
      toast({ title: 'Update failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: `Webinar ${next.toLowerCase()}`, variant: 'success' });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteWebinarAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Webinar deleted', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search webinars..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#172554]/15 rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#172554] text-white rounded-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Webinar</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#172554]/15 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#172554]">
              {editingId ? 'Edit Webinar' : 'Record New Webinar'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[#64748B]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Webinar Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: editingId ? form.slug : slugify(e.target.value),
                })
              }
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Organizer"
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <input
              type="text"
              placeholder="Speaker (optional)"
              value={form.speaker}
              onChange={(e) => setForm({ ...form, speaker: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            >
              {WEBINAR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 90 mins)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
              />
            </div>
          </div>

          <textarea
            rows={3}
            required
            placeholder="Webinar description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              label="Thumbnail Image"
              value={form.thumbnailUrl}
              onChange={(url, id) => setForm({ ...form, thumbnailUrl: url, thumbnailId: id || '' })}
              accept="image/*"
              category="Webinars"
            />
            <FileUploadField
              label="Certificate Upload (Image or PDF)"
              value={form.certificateUrl}
              onChange={(url, id) => setForm({ ...form, certificateUrl: url, certificateId: id || '' })}
              accept="image/*,.pdf"
              category="Certificates"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={3}
              placeholder="Topics Discussed (one per line)"
              value={form.topicsText}
              onChange={(e) => setForm({ ...form, topicsText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <textarea
              rows={3}
              placeholder="Knowledge Gained (one per line)"
              value={form.knowledgeText}
              onChange={(e) => setForm({ ...form, knowledgeText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>

          <div className="pt-3 border-t border-[#172554]/10 space-y-3">
            <h3 className="font-serif text-base text-[#172554]">
              Personal Reflection (What? · So What? · Now What?)
            </h3>
            <textarea
              rows={2}
              placeholder="What? — What was the webinar about?"
              value={form.whatText}
              onChange={(e) => setForm({ ...form, whatText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <textarea
              rows={2}
              placeholder="So What? — What did I learn and why was it important?"
              value={form.soWhatText}
              onChange={(e) => setForm({ ...form, soWhatText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <textarea
              rows={2}
              placeholder="Now What? — How can I apply this knowledge?"
              value={form.nowWhatText}
              onChange={(e) => setForm({ ...form, nowWhatText: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublicationStatus })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            >
              <option value={PublicationStatus.DRAFT}>Draft</option>
              <option value={PublicationStatus.PUBLISHED}>Published</option>
              <option value={PublicationStatus.ARCHIVED}>Archived</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-[#172554] text-white rounded-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Webinar'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#172554]/10 rounded-lg divide-y divide-[#172554]/10">
        {filtered.length === 0 ? (
          <p className="p-8 text-sm text-center text-[#64748B]">No webinars recorded yet.</p>
        ) : (
          filtered.map((w) => (
            <div key={w.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#172554]">{w.title}</p>
                <p className="text-xs text-[#64748B]">
                  {w.organizer} · {w.category} · {w.status}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(w)}
                  className="px-3 py-1.5 text-xs border border-[#172554]/15 rounded"
                >
                  {w.status === PublicationStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(w)}
                  className="p-1.5 rounded border border-[#172554]/15 text-[#172554]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(w)}
                  className="p-1.5 rounded border border-rose-200 text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Webinar"
        description={`Remove "${deleteTarget?.title}" from the portfolio?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
