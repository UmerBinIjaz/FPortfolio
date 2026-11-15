import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublishedSymposiums } from '@/lib/data';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Symposium',
  description:
    'Academic symposiums, seminar presentations, slides, feedback, and scholarly reflections documented by Faryal.',
};

export default async function SymposiumPage() {
  const symposiums = await getPublishedSymposiums();
  const slidesCount = symposiums.filter((s) => Boolean(s.slidesUrl)).length;
  const certCount = symposiums.filter((s) => Boolean(s.certificateUrl)).length;

  return (
    <div>
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Academic Presentations
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Symposiums &amp; Conferences
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed mb-8">
            Academic symposium participation, seminar presentations, slide decks, media documentation, and reflective learning outcomes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#172554]/10 border border-[#172554]/10 rounded-lg overflow-hidden max-w-2xl">
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Symposiums Recorded</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{symposiums.length}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Slide Decks</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{slidesCount}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Certificates</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{certCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {symposiums.length === 0 ? (
          <EmptyState
            title="No Symposium Records Published Yet"
            description="Genuine symposium participation, presentation slides, academic feedback, and certificates will appear here once added through the Admin Panel."
            actionHref="/webinars"
            actionLabel="Explore Webinars"
            secondaryHref="/admin/symposium"
            secondaryLabel="Add Symposium in Admin"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {symposiums.map((item) => (
              <Link
                key={item.id}
                href={`/symposium/${item.slug}`}
                className="group bg-white border border-[#172554]/10 rounded-lg p-7 hover:border-[#C5A46D] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-2">
                    <span>{item.participationRole}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.formatOrLocation}</span>
                    {item.eventDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(item.eventDate)}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                    {item.presentationTitle}
                  </h2>
                  <p className="text-sm font-medium text-[#252525]/80 mb-3">
                    {item.eventTitle} — {item.organizer}
                  </p>
                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#172554]">
                  <span>View Presentation Details</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
