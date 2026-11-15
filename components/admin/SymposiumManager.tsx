'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import {
  deleteSymposiumAction,
  toggleSymposiumStatusAction,
  upsertSymposiumAction,
} from '@/actions/symposium';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { parseLinesOnly, slugify } from '@/lib/utils';

export interface AdminSymposiumRow {
  id: string;
  eventTitle: string;
  slug: string;
  organizer: string;
  eventDate: Date | string | null;
  formatOrLocation: string;
  presentationTitle: string;
  presentationTopic: string;
  description: string;
  participationRole: string;
  slidesUrl: string | null;
  slidesName: string | null;
  externalVideoUrl: string | null;
  feedback: string | null;
  learningOutcomes: string[];
  personalReflection: string | null;
  certificateUrl: string | null;
  certificateId: string | null;
  featured: boolean;
  status: PublicationStatus;
  media: Array<{ mediaUrl: string }>;
}

const emptyForm = {
  eventTitle: '',
  slug: '',
  organizer: '',
  eventDate: '',
  formatOrLocation: '',
  presentationTitle: '',
  presentationTopic: '',
  description: '',
  participationRole: '',
  slidesUrl: '',
  slidesName: '',
  externalVideoUrl: '',
  feedback: '',
  outcomesText: '',
  personalReflection: '',
  certificateUrl: '',
  certificateId: '',
  mediaUrlsText: '',
  featured: false,
  status: PublicationStatus.DRAFT as PublicationStatus,
};

export function SymposiumManager({ symposiums }: { symposiums: AdminSymposiumRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminSymposiumRow | null>(null);

  const startEdit = (s: AdminSymposiumRow) => {
    setEditingId(s.id);
    setForm({
      eventTitle: s.eventTitle,
      slug: s.slug,
      organizer: s.organizer,
      eventDate: s.eventDate ? new Date(s.eventDate).toISOString().slice(0, 10) : '',
      formatOrLocation: s.formatOrLocation,
      presentationTitle: s.presentationTitle,
      presentationTopic: s.presentationTopic,
      description: s.description,
      participationRole: s.participationRole,
      slidesUrl: s.slidesUrl || '',
      slidesName: s.slidesName || '',
      externalVideoUrl: s.externalVideoUrl || '',
      feedback: s.feedback || '',
      outcomesText: s.learningOutcomes.join('\n'),
      personalReflection: s.personalReflection || '',
      certificateUrl: s.certificateUrl || '',
      certificateId: s.certificateId || '',
      mediaUrlsText: s.media.map((m) => m.mediaUrl).join('\n'),
      featured: s.featured,
      status: s.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertSymposiumAction(
      {
        eventTitle: form.eventTitle,
        slug: form.slug || slugify(form.presentationTitle || form.eventTitle),
        organizer: form.organizer,
        eventDate: form.eventDate || null,
        formatOrLocation: form.formatOrLocation,
        presentationTitle: form.presentationTitle,
        presentationTopic: form.presentationTopic,
        description: form.description,
        participationRole: form.participationRole,
        slidesUrl: form.slidesUrl || null,
        slidesName: form.slidesName || null,
        externalVideoUrl: form.externalVideoUrl || null,
        feedback: form.feedback || null,
        learningOutcomes: parseLinesOnly(form.outcomesText),
        personalReflection: form.personalReflection || null,
        certificateUrl: form.certificateUrl || null,
        certificateId: form.certificateId || null,
        mediaUrls: parseLinesOnly(form.mediaUrlsText),
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
    toast({ title: editingId ? 'Symposium updated' : 'Symposium added', variant: 'success' });
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteSymposiumAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Symposium deleted', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Symposium Record</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#4C0519]/15 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#4C0519]">
              {editingId ? 'Edit Symposium' : 'New Symposium Record'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[#6E5A64]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Event Title"
              value={form.eventTitle}
              onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Organizer"
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Presentation Title"
              value={form.presentationTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  presentationTitle: e.target.value,
                  slug: editingId ? form.slug : slugify(e.target.value),
                })
              }
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="URL Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Presentation Topic"
              value={form.presentationTopic}
              onChange={(e) => setForm({ ...form, presentationTopic: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Participation Role (e.g. Presenter, Participant)"
              value={form.participationRole}
              onChange={(e) => setForm({ ...form, participationRole: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Location or Online Format"
              value={form.formatOrLocation}
              onChange={(e) => setForm({ ...form, formatOrLocation: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <textarea
            rows={4}
            required
            placeholder="Presentation Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              label="Presentation Slides (PDF/PPT/PPTX)"
              value={form.slidesUrl}
              onChange={(url) => setForm({ ...form, slidesUrl: url })}
              accept=".pdf,.ppt,.pptx"
              category="Symposium"
            />
            <FileUploadField
              label="Certificate Upload"
              value={form.certificateUrl}
              onChange={(url, id) => setForm({ ...form, certificateUrl: url, certificateId: id || '' })}
              accept="image/*,.pdf"
              category="Certificates"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              placeholder="External Video URL (optional)"
              value={form.externalVideoUrl}
              onChange={(e) => setForm({ ...form, externalVideoUrl: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              placeholder="Slides File Label (optional)"
              value={form.slidesName}
              onChange={(e) => setForm({ ...form, slidesName: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={3}
              placeholder="Learning Outcomes (one per line)"
              value={form.outcomesText}
              onChange={(e) => setForm({ ...form, outcomesText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <textarea
              rows={3}
              placeholder="Gallery Image/Media URLs (one per line)"
              value={form.mediaUrlsText}
              onChange={(e) => setForm({ ...form, mediaUrlsText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Feedback Received (optional)"
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <textarea
            rows={3}
            placeholder="Personal Reflection"
            value={form.personalReflection}
            onChange={(e) => setForm({ ...form, personalReflection: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <div className="flex items-center gap-4">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublicationStatus })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            >
              <option value={PublicationStatus.DRAFT}>Draft</option>
              <option value={PublicationStatus.PUBLISHED}>Published</option>
              <option value={PublicationStatus.ARCHIVED}>Archived</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Symposium'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
        {symposiums.length === 0 ? (
          <p className="p-8 text-sm text-center text-[#6E5A64]">No symposium records yet.</p>
        ) : (
          symposiums.map((s) => (
            <div key={s.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#4C0519]">{s.presentationTitle}</p>
                <p className="text-xs text-[#6E5A64]">
                  {s.eventTitle} · {s.organizer} · {s.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await toggleSymposiumStatusAction(s.id, {
                      status:
                        s.status === PublicationStatus.PUBLISHED
                          ? PublicationStatus.DRAFT
                          : PublicationStatus.PUBLISHED,
                    });
                    router.refresh();
                  }}
                  className="px-3 py-1.5 text-xs border border-[#4C0519]/15 rounded"
                >
                  {s.status === PublicationStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className="p-1.5 rounded border border-[#4C0519]/15 text-[#4C0519]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(s)}
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
        title="Delete Symposium"
        description={`Remove "${deleteTarget?.presentationTitle}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
