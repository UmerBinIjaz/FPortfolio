'use client';

import React, { useMemo, useState } from 'react';
import { Award, Download, ExternalLink, Eye, X } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES } from '@/lib/constants';
import { EmptyState } from '@/components/ui/empty-state';
import { MediaFrame } from '@/components/ui/media-frame';
import { formatDate } from '@/lib/utils';

export interface AchievementItem {
  id: string;
  title: string;
  slug: string;
  issuingOrg: string;
  category: string;
  issueDate: Date | string | null;
  description: string;
  verificationUrl: string | null;
  featured: boolean;
  certificates: Array<{
    id: string;
    fileUrl: string;
    fileType: string;
    verificationUrl: string | null;
  }>;
}

export function AchievementsBrowser({ items }: { items: AchievementItem[] }) {
  const [category, setCategory] = useState('All');
  const [previewItem, setPreviewItem] = useState<AchievementItem | null>(null);

  const filtered = useMemo(() => {
    if (category === 'All') return items;
    return items.filter((i) => i.category === category);
  }, [items, category]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Certificates or Awards Published Yet"
        description="Only verified academic achievements, DigiSkills.pk certificates, awards, and participation recognitions uploaded via the Admin Panel are displayed here."
        actionHref="/resume"
        actionLabel="View Academic & Training Summary"
        secondaryHref="/admin/achievements"
        secondaryLabel="Upload Certificate in Admin"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {['All', ...ACHIEVEMENT_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
              category === cat
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-white border border-[#4C0519]/15 text-[#4C0519] hover:bg-[#FCE7F3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Records in This Category"
          description="Select another category to view uploaded certificates and recognitions."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item) => {
            const cert = item.certificates[0];
            const isImage = cert && cert.fileType !== 'PDF';
            return (
              <article
                key={item.id}
                className="bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden flex flex-col justify-between p-6 hover:border-[#BE185D] hover:shadow-md transition-all"
              >
                <div>
                  {cert && isImage && (
                    <div className="mb-4">
                      <MediaFrame src={cert.fileUrl} alt={item.title} />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-2">
                    <span>{item.category}</span>
                    {item.issueDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(item.issueDate)}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-xl text-[#4C0519] mb-1">{item.title}</h2>
                  <p className="text-xs font-medium text-[#BE185D] mb-3">{item.issuingOrg}</p>
                  <p className="text-sm text-[#6E5A64] leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#4C0519]/10 text-xs font-medium">
                  {cert && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="inline-flex items-center gap-1.5 text-[#BE185D] hover:text-[#4C0519]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
                        <span>Preview</span>
                      </button>
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#BE185D] hover:text-[#4C0519]"
                      >
                        <Download className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
                        <span>Download</span>
                      </a>
                    </>
                  )}
                  {item.verificationUrl && (
                    <a
                      href={item.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#6E5A64] hover:text-[#4C0519]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verify</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && previewItem.certificates[0] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C0519]/60 p-4"
        >
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-xl text-[#4C0519]">{previewItem.title}</h3>
                  <p className="text-xs text-[#6E5A64]">{previewItem.issuingOrg}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview"
                className="p-1.5 rounded text-[#6E5A64] hover:text-[#4C0519]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {previewItem.certificates[0].fileType === 'PDF' ? (
              <iframe
                src={previewItem.certificates[0].fileUrl}
                title={previewItem.title}
                className="w-full h-[65vh] border border-[#4C0519]/10 rounded"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewItem.certificates[0].fileUrl}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="w-full rounded border border-[#4C0519]/10"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
