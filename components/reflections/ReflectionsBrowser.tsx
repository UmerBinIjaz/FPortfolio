'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { MediaFrame } from '@/components/ui/media-frame';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImageUrl: string | null;
  tags: string[];
  authorName: string;
  readingTimeMinutes: number;
  publishedAt: Date | string | null;
  featured: boolean;
  category: { id: string; name: string; slug: string } | null;
}

export interface BlogCategoryItem {
  id: string;
  name: string;
  slug: string;
}

const PAGE_SIZE = 6;

export function ReflectionsBrowser({
  posts,
  categories,
}: {
  posts: BlogPostListItem[];
  categories: BlogCategoryItem[];
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  const featuredPost = posts.find((p) => p.featured) || posts[0] || null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const catMatch =
        selectedCategory === 'All' || post.category?.slug === selectedCategory;
      const qMatch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return catMatch && qMatch;
    });
  }, [posts, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No Reflections Published Yet"
        description="Authentic academic articles, reflections on English Language Teaching, literature commentary, and educational technology insights will appear here once published in the Admin Panel."
        actionHref="/about"
        actionLabel="Read Biography & Philosophy"
        secondaryHref="/admin/reflections"
        secondaryLabel="Write Reflection in Admin"
      />
    );
  }

  return (
    <div className="space-y-12">
      {featuredPost && selectedCategory === 'All' && !search && (
        <Link
          href={`/reflections/${featuredPost.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#4C0519]/12 rounded-lg overflow-hidden p-6 md:p-8 hover:border-[#F59E0B] transition-colors"
        >
          <div className="lg:col-span-5">
            <MediaFrame
              src={featuredPost.featuredImageUrl}
              alt={featuredPost.title}
              fallbackTitle={featuredPost.title}
            />
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-3">
              <span className="text-[#BE185D] font-medium">Featured Article</span>
              <span aria-hidden="true">·</span>
              <span>{featuredPost.category?.name || 'Academic Reflection'}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredPost.readingTimeMinutes} min read</span>
            </div>
            <h2 className="font-serif text-3xl text-[#4C0519] mb-3 group-hover:text-[#BE185D] transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-sm text-[#6E5A64] leading-relaxed mb-4">
              {featuredPost.summary}
            </p>
            <p className="text-xs text-[#6E5A64]">
              By {featuredPost.authorName}
              {featuredPost.publishedAt ? ` · ${formatDate(featuredPost.publishedAt)}` : ''}
            </p>
          </div>
        </Link>
      )}

      {/* Search & Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles, topics, or tags..."
              aria-label="Search reflections"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#4C0519]/15 rounded-md focus:border-[#F59E0B] focus:outline-none"
            />
          </div>
          <p className="text-xs text-[#6E5A64] tabular-nums">
            Showing {filtered.length} of {posts.length} article{posts.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setPage(1);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-white border border-[#4C0519]/15 text-[#4C0519] hover:bg-[#FCE7F3]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#BE185D] text-white shadow-xs'
                  : 'bg-white border border-[#4C0519]/15 text-[#4C0519] hover:bg-[#FCE7F3]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          title="No Matching Articles"
          description="Try clearing your search filter or choosing another category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {paginated.map((post, idx) => {
            const accents = ['bg-[#BE185D]', 'bg-[#F59E0B]', 'bg-[#7E22CE]', 'bg-[#0F766E]'];
            return (
              <Link
                key={post.id}
                href={`/reflections/${post.slug}`}
                className="group bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden hover:border-[#BE185D] hover:shadow-md transition-all flex flex-col"
              >
                <div className={`h-1.5 w-full ${accents[idx % accents.length]}`} />
                <div className="p-3 pb-0">
                  <MediaFrame
                    src={post.featuredImageUrl}
                    alt={post.title}
                    fallbackTitle={post.title}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#BE185D] mb-2">
                      <span>{post.category?.name || 'Reflection'}</span>
                      <span aria-hidden="true" className="text-[#6E5A64]">·</span>
                      <span className="text-[#6E5A64]">{post.readingTimeMinutes} min read</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2 group-hover:text-[#BE185D] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#6E5A64] line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                  <p className="text-xs text-[#6E5A64] mt-4 pt-3 border-t border-[#4C0519]/10">
                    {post.publishedAt ? formatDate(post.publishedAt) : 'Published'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#4C0519]/15 text-[#4C0519] rounded-md disabled:opacity-40 hover:bg-[#FCE7F3]/50"
          >
            Previous
          </button>
          <span className="text-xs text-[#6E5A64] px-3 tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#4C0519]/15 text-[#4C0519] rounded-md disabled:opacity-40 hover:bg-[#FCE7F3]/50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
