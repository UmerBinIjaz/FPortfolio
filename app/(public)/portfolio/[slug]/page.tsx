import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import { getPortfolioProjectBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { MediaFrame } from '@/components/ui/media-frame';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPortfolioProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6E5A64] hover:text-[#4C0519] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Portfolio</span>
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-3">
          <span>{project.category}</span>
          {project.projectDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(project.projectDate)}</span>
            </>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-[#4C0519] mb-4">
          {project.title}
        </h1>
        <p className="text-lg text-[#271C22]/85 leading-relaxed max-w-3xl">
          {project.summary}
        </p>
      </header>

      {project.thumbnailUrl && (
        <div className="mb-10">
          <MediaFrame
            src={project.thumbnailUrl}
            alt={project.title}
            aspectClass="aspect-[16/9]"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
            <h2 className="font-serif text-2xl text-[#4C0519] mb-4">Project Overview</h2>
            <div className="text-base text-[#271C22]/90 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </section>

          {project.learningOutcomes.length > 0 && (
            <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
              <h2 className="font-serif text-2xl text-[#4C0519] mb-4">Learning Outcomes</h2>
              <ul className="space-y-2.5 text-sm text-[#271C22]/85">
                {project.learningOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5">
                    <span className="text-[#F59E0B] mt-0.5 font-bold" aria-hidden="true">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.media.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#4C0519]">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.media.map((item) => (
                  <div key={item.id} className="bg-white border border-[#4C0519]/10 rounded-lg p-3">
                    <MediaFrame src={item.mediaUrl} alt={item.caption || project.title} />
                    {item.caption && (
                      <p className="text-xs text-[#6E5A64] mt-2">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-6">
          {project.tools.length > 0 && (
            <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6">
              <h3 className="font-serif text-lg text-[#4C0519] mb-3">Tools &amp; Resources</h3>
              <ul className="space-y-1.5 text-sm text-[#6E5A64]">
                {project.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          )}

          {(project.documentUrl || project.externalUrl) && (
            <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-3">
              <h3 className="font-serif text-lg text-[#4C0519] mb-2">Supporting Files &amp; Links</h3>
              {project.documentUrl && (
                <a
                  href={project.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>{project.documentName || 'Preview / Download Document'}</span>
                  <Download className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#4C0519]/20 text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>Open External Resource</span>
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
