'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicationStatus } from '@prisma/client';
import { Edit3, Plus, Star, Trash2 } from 'lucide-react';
import {
  deleteBlogPostAction,
  toggleBlogPostStatusAction,
  upsertBlogPostAction,
} from '@/actions/reflections';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileUploadField } from './FileUploadField';
import { RichTextEditor } from './RichTextEditor';
import { parseCsvOrLines, slugify } from '@/lib/utils';

export interface AdminBlogPostRow {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl: string | null;
  featuredImageId: string | null;
  summary: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  authorName: string;
  publishedAt: Date | string | null;
  featured: boolean;
  status: PublicationStatus;
  category: { id: string; name: string } | null;
}

export function ReflectionsManager({
  posts,
  categories,
}: {
  posts: AdminBlogPostRow[];
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPostRow | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    featuredImageUrl: '',
    featuredImageId: '',
    summary: '',
    content: '<p></p>',
    categoryId: categories[0]?.id || '',
    tagsText: '',
    authorName: 'Faryal',
    featured: false,
    status: PublicationStatus.DRAFT as PublicationStatus,
  });

  const startCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      featuredImageUrl: '',
      featuredImageId: '',
      summary: '',
      content: '<p></p>',
      categoryId: categories[0]?.id || '',
      tagsText: '',
      authorName: 'Faryal',
      featured: false,
      status: PublicationStatus.DRAFT,
    });
    setShowForm(true);
  };

  const startEdit = (post: AdminBlogPostRow) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      featuredImageUrl: post.featuredImageUrl || '',
      featuredImageId: post.featuredImageId || '',
      summary: post.summary,
      content: post.content,
      categoryId: post.categoryId || categories[0]?.id || '',
      tagsText: post.tags.join(', '),
      authorName: post.authorName,
      featured: post.featured,
      status: post.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertBlogPostAction(
      {
        title: form.title,
        slug: form.slug || slugify(form.title),
        featuredImageUrl: form.featuredImageUrl || null,
        featuredImageId: form.featuredImageId || null,
        summary: form.summary,
        content: form.content,
        categoryId: form.categoryId || null,
        tags: parseCsvOrLines(form.tagsText),
        authorName: form.authorName,
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
    toast({ title: editingId ? 'Article updated' : 'Article created', variant: 'success' });
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteBlogPostAction(deleteTarget.id);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Article archived', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#172554] text-white rounded-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Reflection</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#172554]/15 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#172554]">
              {editingId ? 'Edit Reflection' : 'New Reflection / Article'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[#64748B]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Article Title"
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
              placeholder="URL Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={form.tagsText}
              onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
              className="px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
            />
          </div>

          <FileUploadField
            label="Featured Image"
            value={form.featuredImageUrl}
            onChange={(url, id) =>
              setForm({ ...form, featuredImageUrl: url, featuredImageId: id || '' })
            }
            accept="image/*"
            category="Reflections"
          />

          <textarea
            rows={2}
            required
            placeholder="Concise article summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md"
          />

          <div>
            <label className="block text-xs font-medium text-[#172554] mb-1.5">
              Full Article Content (Sanitized Rich Text)
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
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
            <label className="inline-flex items-center gap-2 text-sm text-[#172554]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <span>Featured Article</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-[#172554] text-white rounded-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#172554]/10 rounded-lg divide-y divide-[#172554]/10">
        {posts.length === 0 ? (
          <p className="p-8 text-sm text-center text-[#64748B]">No reflections written yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#172554]">{p.title}</p>
                <p className="text-xs text-[#64748B]">
                  {p.category?.name || 'Uncategorized'} · {p.status}
                  {p.featured ? ' · Featured' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await toggleBlogPostStatusAction(p.id, {
                      status:
                        p.status === PublicationStatus.PUBLISHED
                          ? PublicationStatus.DRAFT
                          : PublicationStatus.PUBLISHED,
                    });
                    router.refresh();
                  }}
                  className="px-3 py-1.5 text-xs border border-[#172554]/15 rounded"
                >
                  {p.status === PublicationStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await toggleBlogPostStatusAction(p.id, { featured: !p.featured });
                    router.refresh();
                  }}
                  className={`p-1.5 rounded border ${
                    p.featured
                      ? 'border-[#C5A46D] text-[#C5A46D]'
                      : 'border-[#172554]/15 text-[#64748B]'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="p-1.5 rounded border border-[#172554]/15 text-[#172554]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
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
        title="Delete Article"
        description={`Archive "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
