import type { Metadata } from 'next';
import { getBlogCategories, getPublishedBlogPosts } from '@/lib/data';
import { ReflectionsBrowser } from '@/components/reflections/ReflectionsBrowser';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reflections & Blog',
  description:
    'Academic reflections, English literature essays, language teaching methodologies, and educational technology insights by Faryal.',
};

export default async function ReflectionsPage() {
  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCategories(),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Writing &amp; Inquiry
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Reflections &amp; <span className="italic text-[#BE185D]">Articles</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed">
            Academic reflections on English language, literature, pedagogy, digital learning, and personal growth.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <ReflectionsBrowser posts={posts} categories={categories} />
      </section>
    </div>
  );
}
