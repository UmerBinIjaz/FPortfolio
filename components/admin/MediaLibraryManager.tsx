'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaType } from '@prisma/client';
import { Copy, ExternalLink, FileText, Search, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatBytes, formatDate } from '@/lib/utils';

export interface MediaAssetRow {
  id: string;
  title: string;
  fileName: string;
  url: string;
  publicId: string;
  mediaType: MediaType;
  mimeType: string;
  bytes: number;
  category: string;
  createdAt: Date | string;
}

export function MediaLibraryManager({ assets }: { assets: MediaAssetRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('General');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | MediaType>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<MediaAssetRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      const matchType = filterType === 'ALL' || a.mediaType === filterType;
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.fileName.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchType && matchQ;
    });
  }, [assets, search, filterType]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name.replace(/\.[^/.]+$/, ''));
      fd.append('category', category);
      fd.append('folder', 'faryal-portfolio');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: 'Upload failed', description: json.error, variant: 'error' });
        return;
      }
      toast({ title: 'Uploaded to Cloudinary', description: file.name, variant: 'success' });
      router.refresh();
    } catch {
      toast({ title: 'Upload error', variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: 'URL copied', variant: 'success' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    setDeleteTarget(null);
    if (!res.ok) {
      toast({ title: 'Cannot delete asset', description: json.error, variant: 'error' });
      return;
    }
    toast({ title: 'Media asset deleted', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Upload Bar */}
      <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-[#4C0519]">Upload to Cloudinary</h2>
          <p className="text-xs text-[#6E5A64] mt-1">
            Supports images (JPG, PNG, WEBP, GIF), PDFs, Word (.doc/.docx), PowerPoint (.ppt/.pptx), and Video (.mp4/.webm).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md"
          >
            <option value="General">General</option>
            <option value="Profile">Profile</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Certificates">Certificates</option>
            <option value="Webinars">Webinars</option>
            <option value="Symposium">Symposium</option>
            <option value="Practicum">Practicum</option>
            <option value="Reflections">Reflections</option>
          </select>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.mp4,.webm"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Select & Upload File'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#6E5A64] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#4C0519]/15 rounded-md focus:border-[#F59E0B] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['ALL', MediaType.IMAGE, MediaType.PDF, MediaType.DOCUMENT, MediaType.PRESENTATION, MediaType.VIDEO] as const).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  filterType === t
                    ? 'bg-[#BE185D] text-white'
                    : 'bg-white border border-[#4C0519]/15 text-[#271C22] hover:bg-[#FCE7F3]/50'
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#4C0519]/10 rounded-lg p-10 text-center text-sm text-[#6E5A64]">
          No media assets uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-[#4C0519]/10 rounded-lg overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-[#FCE7F3]/40 border-b border-[#4C0519]/10 flex items-center justify-center overflow-hidden">
                  {asset.mediaType === MediaType.IMAGE ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FileText className="w-8 h-8 text-[#BE185D] mx-auto mb-1" />
                      <p className="text-xs text-[#6E5A64]">{asset.mediaType}</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm text-[#4C0519] truncate">{asset.title}</p>
                  <p className="text-xs text-[#6E5A64] mt-1 tabular-nums">
                    {asset.category} · {formatBytes(asset.bytes)} · {formatDate(asset.createdAt)}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-[#4C0519]/10 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(asset.url)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#4C0519]/15 rounded text-[#4C0519] hover:bg-[#FCE7F3]/50"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#4C0519]/15 rounded text-[#4C0519] hover:bg-[#FCE7F3]/50"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(asset)}
                  className="p-1.5 text-rose-700 hover:bg-rose-50 rounded"
                  aria-label="Delete media asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Media Asset"
        description={`Delete "${deleteTarget?.fileName}" from Cloudinary and PostgreSQL? Deletion is blocked automatically if the file is referenced by any active record.`}
        confirmLabel="Delete Asset"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
