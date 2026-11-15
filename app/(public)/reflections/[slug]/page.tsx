import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize';
import { MediaFrame } from '@/components/ui/media-frame';
import { ShareArticleBar } from '@/components/reflections/ShareArticleBar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };
  return { title: post.title, description: post.summary };
}

export default async function ReflectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getPublishedBlogPosts({ limit: 4 }),
  ]);

  if (!post) notFound();

  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const safeHtml = sanitizeHtml(post.content);

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <Link
        href="/reflections"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#172554] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Reflections</span>
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-3">
          <span>{post.category?.name || 'Academic Reflection'}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
          {post.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-[#172554] mb-4">
          {post.title}
        </h1>
        <p className="text-base text-[#64748B] leading-relaxed mb-6">{post.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#172554]/10">
          <p className="text-sm font-medium text-[#172554]">By {post.authorName}</p>
          <ShareArticleBar title={post.title} />
        </div>
      </header>

      {post.featuredImageUrl && (
        <div className="mb-10">
          <MediaFrame src={post.featuredImageUrl} alt={post.title} aspectClass="aspect-[16/9]" />
        </div>
      )}

      <div
        className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#172554] prose-a:text-[#172554] prose-blockquote:border-[#C5A46D] bg-white border border-[#172554]/10 rounded-lg p-7 md:p-10"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <span className="font-medium text-[#172554]">Topics:</span>
          <span>{post.tags.join(' · ')}</span>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-[#172554]/10">
          <h2 className="font-serif text-2xl text-[#172554] mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/reflections/${r.slug}`}
                className="bg-white border border-[#172554]/10 rounded-lg p-5 hover:border-[#C5A46D] transition-colors"
              >
                <p className="text-xs text-[#64748B] mb-1.5">
                  {r.readingTimeMinutes} min read
                </p>
                <h3 className="font-serif text-lg text-[#172554] mb-2">{r.title}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2">{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
