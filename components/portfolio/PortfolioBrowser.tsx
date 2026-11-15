'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PORTFOLIO_CATEGORIES } from '@/lib/constants';
import { MediaFrame } from '@/components/ui/media-frame';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export interface PortfolioListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  projectDate: Date | string | null;
  thumbnailUrl: string | null;
  tools: string[];
  featured: boolean;
}

const PAGE_SIZE = 9;

export function PortfolioBrowser({ projects }: { projects: PortfolioListItem[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tools.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [projects, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No Portfolio Projects Published Yet"
        description="Authentic academic assignments, creative writing samples, English literature analyses, graphic design work, and teaching materials will be displayed here as they are uploaded through the Admin Panel."
        actionHref="/about"
        actionLabel="Explore Academic Profile"
        secondaryHref="/admin/portfolio"
        secondaryLabel="Add Project in Admin"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects, topics, or tools..."
            aria-label="Search portfolio projects"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none"
          />
        </div>
        <p className="text-xs text-[#64748B] tabular-nums">
          Showing {filtered.length} of {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {['All', ...PORTFOLIO_CATEGORIES].map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#172554] text-white'
                  : 'bg-white border border-[#172554]/15 text-[#252525] hover:bg-[#EDE9FE]/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          title="No Matching Portfolio Items"
          description="Try clearing your search query or selecting a different category filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {paginated.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group bg-white border border-[#172554]/10 rounded-lg overflow-hidden hover:border-[#C5A46D] transition-colors flex flex-col"
            >
              <div className="p-3 pb-0">
                <MediaFrame
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fallbackTitle={project.title}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                  <span>{project.category}</span>
                  {project.projectDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(project.projectDate)}</span>
                    </>
                  )}
                  {project.featured && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#C5A46D] font-medium">Featured</span>
                    </>
                  )}
                </div>
                <h2 className="font-serif text-xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#172554]/15 rounded-md disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-[#64748B] px-3 tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#172554]/15 rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
