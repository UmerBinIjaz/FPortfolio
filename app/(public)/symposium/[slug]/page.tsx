import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, ExternalLink, Presentation } from 'lucide-react';
import { getSymposiumBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { MediaFrame } from '@/components/ui/media-frame';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getSymposiumBySlug(slug);
  if (!item) return { title: 'Symposium Not Found' };
  return { title: item.presentationTitle, description: item.description.slice(0, 155) };
}

export default async function SymposiumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getSymposiumBySlug(slug);
  if (!item) notFound();

  return (
    <article className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <Link
        href="/symposium"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6E5A64] hover:text-[#4C0519] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Symposiums</span>
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-3">
          <span>{item.participationRole}</span>
          <span aria-hidden="true">·</span>
          <span>{item.organizer}</span>
          <span aria-hidden="true">·</span>
          <span>{item.formatOrLocation}</span>
          {item.eventDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(item.eventDate)}</span>
            </>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-[#4C0519] mb-3">
          {item.presentationTitle}
        </h1>
        <p className="text-base font-medium text-[#BE185D]">
          {item.eventTitle} — Topic: {item.presentationTopic}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
            <h2 className="font-serif text-2xl text-[#4C0519] mb-3">Presentation Description</h2>
            <p className="text-base text-[#271C22]/90 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </section>

          {item.learningOutcomes.length > 0 && (
            <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
              <h2 className="font-serif text-2xl text-[#4C0519] mb-3">Learning Outcomes</h2>
              <ul className="space-y-2 text-sm text-[#271C22]/85">
                {item.learningOutcomes.map((lo) => (
                  <li key={lo} className="flex items-start gap-2">
                    <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                    <span>{lo}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {item.feedback && (
            <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
              <h2 className="font-serif text-2xl text-[#4C0519] mb-3">Academic Feedback</h2>
              <p className="text-sm text-[#271C22]/85 leading-relaxed whitespace-pre-line">
                {item.feedback}
              </p>
            </section>
          )}

          {item.personalReflection && (
            <section className="bg-[#FCE7F3]/50 border border-[#4C0519]/10 rounded-lg p-7">
              <h2 className="font-serif text-2xl text-[#4C0519] mb-3">Personal Reflection</h2>
              <p className="text-sm text-[#271C22]/85 leading-relaxed whitespace-pre-line">
                {item.personalReflection}
              </p>
            </section>
          )}

          {item.media.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#4C0519]">Media Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.media.map((m) => (
                  <div key={m.id} className="bg-white border border-[#4C0519]/10 rounded-lg p-3">
                    <MediaFrame src={m.mediaUrl} alt={m.title || item.presentationTitle} />
                    {m.caption && <p className="text-xs text-[#6E5A64] mt-2">{m.caption}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-5">
          {(item.slidesUrl || item.externalVideoUrl || item.certificateUrl) && (
            <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6 space-y-3">
              <h3 className="font-serif text-lg text-[#4C0519] mb-2">Slides, Media &amp; Certificate</h3>
              {item.slidesUrl && (
                <a
                  href={item.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors"
                >
                  <Presentation className="w-4 h-4" aria-hidden="true" />
                  <span>{item.slidesName || 'Download Presentation Slides'}</span>
                </a>
              )}
              {item.externalVideoUrl && (
                <a
                  href={item.externalVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#4C0519]/20 text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>Watch Presentation Video</span>
                </a>
              )}
              {item.certificateUrl && (
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#F59E0B] text-[#4C0519] rounded-md hover:bg-[#FEF3C7]/40 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  <span>Download Certificate</span>
                </a>
              )}
            </div>
          )}

          <div className="bg-white border border-[#4C0519]/10 rounded-lg p-6">
            <h3 className="font-serif text-lg text-[#4C0519] mb-3">Related Activities</h3>
            <div className="space-y-2 text-sm">
              <Link href="/webinars" className="block text-[#6E5A64] hover:text-[#BE185D]">
                Webinars &amp; Workshops →
              </Link>
              <Link href="/teaching-practicum" className="block text-[#6E5A64] hover:text-[#BE185D]">
                Teaching Practicum →
              </Link>
              <Link href="/achievements" className="block text-[#6E5A64] hover:text-[#BE185D]">
                Achievements &amp; Certificates →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
