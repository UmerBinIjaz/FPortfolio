'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Download, Search } from 'lucide-react';
import { WEBINAR_CATEGORIES } from '@/lib/constants';
import { MediaFrame } from '@/components/ui/media-frame';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export interface WebinarListItem {
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
  certificateUrl: string | null;
  reflection: {
    whatText: string;
    soWhatText: string;
    nowWhatText: string;
  } | null;
}

export function WebinarsBrowser({ webinars }: { webinars: WebinarListItem[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return webinars.filter((w) => {
      const matchCat = category === 'All' || w.category === category;
      const matchQ =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.organizer.toLowerCase().includes(q) ||
        (w.speaker || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [webinars, search, category]);

  const certificates = webinars.filter((w) => Boolean(w.certificateUrl));

  if (webinars.length === 0) {
    return (
      <EmptyState
        title="No Webinars Recorded Yet"
        description="Verified webinars attended, speaker sessions, structured learning reflections (What? So What? Now What?), and completion certificates will appear here once added through the Admin Panel."
        actionHref="/teaching-practicum"
        actionLabel="Explore Teaching Practicum"
        secondaryHref="/admin/webinars"
        secondaryLabel="Add Webinar in Admin"
      />
    );
  }

  return (
    <div className="space-y-14">
      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search webinars, organizers, or speakers..."
              aria-label="Search webinars"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none"
            />
          </div>
          <p className="text-xs text-[#64748B] tabular-nums">
            Showing {filtered.length} of {webinars.length} webinar{webinars.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...WEBINAR_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                category === cat
                  ? 'bg-[#172554] text-white'
                  : 'bg-white border border-[#172554]/15 text-[#252525] hover:bg-[#EDE9FE]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Webinar Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Matching Webinars"
          description="Try selecting another category or clearing your search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((webinar) => (
            <Link
              key={webinar.id}
              href={`/webinars/${webinar.slug}`}
              className="group bg-white border border-[#172554]/10 rounded-lg overflow-hidden hover:border-[#C5A46D] transition-colors flex flex-col"
            >
              <div className="p-3 pb-0">
                <MediaFrame
                  src={webinar.thumbnailUrl}
                  alt={webinar.title}
                  fallbackTitle={webinar.title}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-2">
                  <span>{webinar.category}</span>
                  {webinar.eventDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(webinar.eventDate)}</span>
                    </>
                  )}
                </div>
                <h2 className="font-serif text-xl text-[#172554] mb-1.5 group-hover:text-[#C5A46D] transition-colors">
                  {webinar.title}
                </h2>
                <p className="text-xs font-medium text-[#252525]/75 mb-3">
                  {webinar.organizer}
                  {webinar.speaker ? ` · Speaker: ${webinar.speaker}` : ''}
                </p>
                <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                  {webinar.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Certificate Gallery */}
      {certificates.length > 0 && (
        <section className="pt-10 border-t border-[#172554]/10">
          <div className="flex items-center gap-2.5 mb-6">
            <Award className="w-5 h-5 text-[#C5A46D]" aria-hidden="true" />
            <h2 className="font-serif text-2xl text-[#172554]">Webinar Certificates</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((w) => (
              <div
                key={`cert-${w.id}`}
                className="bg-white border border-[#172554]/10 rounded-lg p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-[#64748B] mb-1">{w.organizer}</p>
                  <h3 className="font-serif text-lg text-[#172554]">{w.title}</h3>
                </div>
                {w.certificateUrl && (
                  <a
                    href={w.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#172554] hover:text-[#C5A46D]"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>View / Download Certificate</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
