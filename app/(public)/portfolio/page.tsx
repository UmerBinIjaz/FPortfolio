import type { Metadata } from 'next';
import { getPublishedPortfolioProjects } from '@/lib/data';
import { PortfolioBrowser } from '@/components/portfolio/PortfolioBrowser';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Academic assignments, creative writing, English literature studies, graphic design, and educational resources by Faryal.',
};

export default async function PortfolioPage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <div>
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Academic &amp; Creative Work
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Portfolio
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed">
            A curated collection of academic assignments, creative writing, English language &amp; literature essays, graphic design pieces, and teaching resources.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <PortfolioBrowser projects={projects} />
      </section>
    </div>
  );
}
