'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Edit3, Plus, Search, Star, Trash2 } from 'lucide-react';
import { PORTFOLIO_CATEGORIES } from '@/lib/constants';
import {
  deletePortfolioProjectAction,
  togglePortfolioStatusAction,
  upsertPortfolioProjectAction,
} from '@/actions/portfolio';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { parseLinesOnly, slugify } from '@/lib/utils';

export interface AdminProjectRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  projectDate: Date | string | null;
  thumbnailUrl: string | null;
  thumbnailId: string | null;
  tools: string[];
  learningOutcomes: string[];
  externalUrl: string | null;
  documentUrl: string | null;
  documentName: string | null;
  featured: boolean;
  sortOrder: number;
  status: PublicationStatus;
  media: Array<{ mediaUrl: string }>;
}

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  category: PORTFOLIO_CATEGORIES[0] as string,
  projectDate: '',
  thumbnailUrl: '',
  thumbnailId: '',
  toolsText: '',
  outcomesText: '',
  externalUrl: '',
  documentUrl: '',
  documentName: '',
  galleryText: '',
  featured: false,
  sortOrder: 0,
  status: PublicationStatus.DRAFT as PublicationStatus,
};

export function PortfolioManager({ projects }: { projects: AdminProjectRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(
      (p) => !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (p: AdminProjectRow) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      category: p.category,
      projectDate: p.projectDate ? new Date(p.projectDate).toISOString().slice(0, 10) : '',
      thumbnailUrl: p.thumbnailUrl || '',
      thumbnailId: p.thumbnailId || '',
      toolsText: p.tools.join('\n'),
      outcomesText: p.learningOutcomes.join('\n'),
      externalUrl: p.externalUrl || '',
      documentUrl: p.documentUrl || '',
      documentName: p.documentName || '',
      galleryText: p.media.map((m) => m.mediaUrl).join('\n'),
      featured: p.featured,
      sortOrder: p.sortOrder,
      status: p.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertPortfolioProjectAction(
      {
        title: form.title,
        slug: form.slug || slugify(form.title),
        summary: form.summary,
        description: form.description,
        category: form.category,
        projectDate: form.projectDate || null,
        thumbnailUrl: form.thumbnailUrl || null,
        thumbnailId: form.thumbnailId || null,
        tools: parseLinesOnly(form.toolsText),
        learningOutcomes: parseLinesOnly(form.outcomesText),
        externalUrl: form.externalUrl || null,
        documentUrl: form.documentUrl || null,
        documentName: form.documentName || null,
        galleryUrls: parseLinesOnly(form.galleryText),
        featured: form.featured,
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status,
      },
      editingId ?? undefined
    );
    setSaving(false);
    if (!res.success) {
      toast({ title: 'Save failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: editingId ? 'Project updated' : 'Project created', variant: 'success' });
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  };

  const handleToggle = async (p: AdminProjectRow, updates: { status?: PublicationStatus; featured?: boolean }) => {
    const res = await togglePortfolioStatusAction(p.id, updates);
    if (!res.success) {
      toast({ title: 'Update failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Project updated', variant: 'success' });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deletePortfolioProjectAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Project archived', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#6E5A64] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#4C0519]/15 rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D]"
        >
          <Plus className="w-4 h-4" />
          <span>New Portfolio Project</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#4C0519]/15 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#4C0519]">
              {editingId ? 'Edit Portfolio Project' : 'Create Portfolio Project'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-[#6E5A64] hover:text-[#4C0519]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Project Title"
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
              placeholder="URL Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.projectDate}
              onChange={(e) => setForm({ ...form, projectDate: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <textarea
            rows={2}
            required
            placeholder="Concise project summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <textarea
            rows={5}
            required
            placeholder="Full project description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              label="Thumbnail Image"
              value={form.thumbnailUrl}
              onChange={(url, publicId) =>
                setForm({ ...form, thumbnailUrl: url, thumbnailId: publicId || '' })
              }
              accept="image/*"
              category="Portfolio"
            />
            <FileUploadField
              label="Supporting Document (PDF/Word/PPT)"
              value={form.documentUrl}
              onChange={(url) => setForm({ ...form, documentUrl: url })}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              category="Portfolio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Document Display Name (optional)"
              value={form.documentName}
              onChange={(e) => setForm({ ...form, documentName: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <input
              type="url"
              placeholder="External Link URL (optional)"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              rows={3}
              placeholder="Tools & Resources (one per line)"
              value={form.toolsText}
              onChange={(e) => setForm({ ...form, toolsText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <textarea
              rows={3}
              placeholder="Learning Outcomes (one per line)"
              value={form.outcomesText}
              onChange={(e) => setForm({ ...form, outcomesText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
            <textarea
              rows={3}
              placeholder="Gallery Image URLs (one per line)"
              value={form.galleryText}
              onChange={(e) => setForm({ ...form, galleryText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublicationStatus })}
              className="px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
            >
              <option value={PublicationStatus.DRAFT}>Draft</option>
              <option value={PublicationStatus.PUBLISHED}>Published</option>
              <option value={PublicationStatus.ARCHIVED}>Archived</option>
            </select>
            <label className="inline-flex items-center gap-2 text-sm text-[#4C0519]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <span>Featured on Homepage</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white border border-[#4C0519]/10 rounded-lg divide-y divide-[#4C0519]/10">
        {filtered.length === 0 ? (
          <p className="p-8 text-sm text-center text-[#6E5A64]">
            No portfolio projects yet. Click &ldquo;New Portfolio Project&rdquo; to create one.
          </p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-[#4C0519] truncate">{p.title}</p>
                <p className="text-xs text-[#6E5A64]">
                  {p.category} · {p.status}
                  {p.featured ? ' · Featured' : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleToggle(p, {
                      status:
                        p.status === PublicationStatus.PUBLISHED
                          ? PublicationStatus.DRAFT
                          : PublicationStatus.PUBLISHED,
                    })
                  }
                  className="px-3 py-1.5 text-xs border border-[#4C0519]/15 rounded hover:bg-[#FCE7F3]/50"
                >
                  {p.status === PublicationStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(p, { featured: !p.featured })}
                  title="Toggle Featured"
                  className={`p-1.5 rounded border ${
                    p.featured
                      ? 'border-[#F59E0B] text-[#F59E0B]'
                      : 'border-[#4C0519]/15 text-[#6E5A64]'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="p-1.5 rounded border border-[#4C0519]/15 text-[#4C0519] hover:bg-[#FCE7F3]/50"
                  aria-label="Edit project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  className="p-1.5 rounded border border-rose-200 text-rose-700 hover:bg-rose-50"
                  aria-label="Delete project"
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
        title="Delete Portfolio Project"
        description={`Archive "${deleteTarget?.title}"? It will be removed from the public portfolio.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
