import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { getWebinarBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { MediaFrame } from '@/components/ui/media-frame';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const webinar = await getWebinarBySlug(slug);
  if (!webinar) return { title: 'Webinar Not Found' };
  return { title: webinar.title, description: webinar.description.slice(0, 155) };
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const webinar = await getWebinarBySlug(slug);
  if (!webinar) notFound();

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <Link
        href="/webinars"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6E5A64] hover:text-[#4C0519] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Webinars</span>
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A64] mb-3">
          <span>{webinar.category}</span>
          <span aria-hidden="true">·</span>
          <span>{webinar.organizer}</span>
          {webinar.eventDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(webinar.eventDate)}</span>
            </>
          )}
          {webinar.duration && (
            <>
              <span aria-hidden="true">·</span>
              <span>{webinar.duration}</span>
            </>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-[#4C0519] mb-3">
          {webinar.title}
        </h1>
        {webinar.speaker && (
          <p className="text-sm font-medium text-[#271C22]/80">
            Speaker / Facilitator: {webinar.speaker}
          </p>
        )}
      </header>

      {webinar.thumbnailUrl && (
        <div className="mb-10">
          <MediaFrame src={webinar.thumbnailUrl} alt={webinar.title} aspectClass="aspect-[16/9]" />
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white border border-[#4C0519]/10 rounded-lg p-7">
          <h2 className="font-serif text-2xl text-[#4C0519] mb-3">Overview</h2>
          <p className="text-base text-[#271C22]/90 leading-relaxed whitespace-pre-line">
            {webinar.description}
          </p>
        </section>

        {(webinar.topicsDiscussed.length > 0 || webinar.knowledgeGained.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webinar.topicsDiscussed.length > 0 && (
              <section className="bg-white border border-[#4C0519]/10 rounded-lg p-6">
                <h3 className="font-serif text-xl text-[#4C0519] mb-3">Topics Discussed</h3>
                <ul className="space-y-2 text-sm text-[#6E5A64]">
                  {webinar.topicsDiscussed.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {webinar.knowledgeGained.length > 0 && (
              <section className="bg-white border border-[#4C0519]/10 rounded-lg p-6">
                <h3 className="font-serif text-xl text-[#4C0519] mb-3">Knowledge Gained</h3>
                <ul className="space-y-2 text-sm text-[#6E5A64]">
                  {webinar.knowledgeGained.map((k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {webinar.reflection && (
          <section className="bg-[#FCE7F3]/50 border border-[#4C0519]/10 rounded-lg p-7 space-y-6">
            <h2 className="font-serif text-2xl text-[#4C0519]">Personal Learning Reflection</h2>
            {webinar.reflection.whatText && (
              <div>
                <h3 className="font-serif text-lg text-[#4C0519] mb-1">
                  What? — What was the webinar about?
                </h3>
                <p className="text-sm text-[#271C22]/85 leading-relaxed whitespace-pre-line">
                  {webinar.reflection.whatText}
                </p>
              </div>
            )}
            {webinar.reflection.soWhatText && (
              <div>
                <h3 className="font-serif text-lg text-[#4C0519] mb-1">
                  So What? — What did I learn and why was it important?
                </h3>
                <p className="text-sm text-[#271C22]/85 leading-relaxed whitespace-pre-line">
                  {webinar.reflection.soWhatText}
                </p>
              </div>
            )}
            {webinar.reflection.nowWhatText && (
              <div>
                <h3 className="font-serif text-lg text-[#4C0519] mb-1">
                  Now What? — How can I apply this knowledge?
                </h3>
                <p className="text-sm text-[#271C22]/85 leading-relaxed whitespace-pre-line">
                  {webinar.reflection.nowWhatText}
                </p>
              </div>
            )}
          </section>
        )}

        {webinar.certificateUrl && (
          <section className="bg-white border border-[#4C0519]/10 rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-[#4C0519]">Certificate of Participation</h3>
              <p className="text-sm text-[#6E5A64]">Issued by {webinar.organizer}</p>
            </div>
            <a
              href={webinar.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Preview / Download Certificate</span>
            </a>
          </section>
        )}
      </div>
    </article>
  );
}
