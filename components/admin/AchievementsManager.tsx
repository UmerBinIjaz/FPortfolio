'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES } from '@/lib/constants';
import {
  deleteAchievementAction,
  toggleAchievementStatusAction,
  upsertAchievementAction,
} from '@/actions/achievements';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { slugify } from '@/lib/utils';

export interface AdminAchievementRow {
  id: string;
  title: string;
  slug: string;
  issuingOrg: string;
  category: string;
  issueDate: Date | string | null;
  description: string;
  verificationUrl: string | null;
  featured: boolean;
  status: PublicationStatus;
  certificates: Array<{ fileUrl: string; fileType: string }>;
}

const emptyForm = {
  title: '',
  slug: '',
  issuingOrg: '',
  category: ACHIEVEMENT_CATEGORIES[0] as string,
  issueDate: '',
  description: '',
  verificationUrl: '',
  certificateFileUrl: '',
  certificateFileType: 'IMAGE',
  featured: false,
  status: PublicationStatus.DRAFT as PublicationStatus,
};

export function AchievementsManager({ items }: { items: AdminAchievementRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAchievementRow | null>(null);

  const startEdit = (a: AdminAchievementRow) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      slug: a.slug,
      issuingOrg: a.issuingOrg,
      category: a.category,
      issueDate: a.issueDate ? new Date(a.issueDate).toISOString().slice(0, 10) : '',
      description: a.description,
      verificationUrl: a.verificationUrl || '',
      certificateFileUrl: a.certificates[0]?.fileUrl || '',
      certificateFileType: a.certificates[0]?.fileType || 'IMAGE',
      featured: a.featured,
      status: a.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const inferredType = form.certificateFileUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : form.certificateFileType;
    const res = await upsertAchievementAction(
      {
        title: form.title,
        slug: form.slug || slugify(form.title),
        issuingOrg: form.issuingOrg,
        category: form.category,
        issueDate: form.issueDate || null,
        description: form.description,
        verificationUrl: form.verificationUrl || null,
        certificateFileUrl: form.certificateFileUrl || null,
        certificateFileType: inferredType,
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
    toast({ title: editingId ? 'Achievement updated' : 'Achievement added', variant: 'success' });
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteAchievementAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Achievement deleted', variant: 'success' });
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
          <span>Add Achievement / Certificate</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#4C0519]/15 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#4C0519]">
              {editingId ? 'Edit Achievement' : 'New Achievement & Certificate'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[#6E5A64]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Achievement / Certificate Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: editingId ? form.slug : slugify(e.target.value),
                })
              }
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="text"
              required
              placeholder="Issuing Organization (e.g. DigiSkills.pk, Air University)"
              value={form.issuingOrg}
              onChange={(e) => setForm({ ...form, issuingOrg: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            >
              {ACHIEVEMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <textarea
            rows={3}
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              label="Certificate Image or PDF"
              value={form.certificateFileUrl}
              onChange={(url) =>
                setForm({
                  ...form,
                  certificateFileUrl: url,
                  certificateFileType: url.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMAGE',
                })
              }
              accept="image/*,.pdf"
              category="Certificates"
            />
            <div>
              <label className="block text-xs font-medium text-[#4C0519] mb-1.5">
                Verification URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.verificationUrl}
                onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
              />
            </div>
          </div>

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
              {saving ? 'Saving...' : 'Save Achievement'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
        {items.length === 0 ? (
          <p className="p-8 text-sm text-center text-[#6E5A64]">No achievements uploaded yet.</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#4C0519]">{a.title}</p>
                <p className="text-xs text-[#6E5A64]">
                  {a.issuingOrg} · {a.category} · {a.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await toggleAchievementStatusAction(a.id, {
                      status:
                        a.status === PublicationStatus.PUBLISHED
                          ? PublicationStatus.DRAFT
                          : PublicationStatus.PUBLISHED,
                    });
                    router.refresh();
                  }}
                  className="px-3 py-1.5 text-xs border border-[#4C0519]/15 rounded"
                >
                  {a.status === PublicationStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="p-1.5 rounded border border-[#4C0519]/15 text-[#4C0519]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(a)}
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
        title="Delete Achievement"
        description={`Remove "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
