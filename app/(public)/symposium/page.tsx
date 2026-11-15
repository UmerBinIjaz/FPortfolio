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
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FEF3C7]/70 to-[#FCE7F3]/85 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
            Academic Presentations
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Symposiums &amp; <span className="italic text-[#BE185D]">Conferences</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed mb-8">
            Academic symposium participation, seminar presentations, slide decks, media documentation, and reflective learning outcomes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white border border-[#BE185D]/20 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#BE185D]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Symposiums Recorded</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{symposiums.length}</p>
              </div>
            </div>
            <div className="bg-white border border-[#F59E0B]/30 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#F59E0B]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Slide Decks</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{slidesCount}</p>
              </div>
            </div>
            <div className="bg-white border border-[#0F766E]/25 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#0F766E]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Certificates</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{certCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
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
            {symposiums.map((item, idx) => {
              const barColors = ['bg-[#BE185D]', 'bg-[#F59E0B]', 'bg-[#7E22CE]', 'bg-[#0F766E]'];
              return (
                <Link
                  key={item.id}
                  href={`/symposium/${item.slug}`}
                  className="group bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden hover:border-[#BE185D] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-1.5 w-full ${barColors[idx % barColors.length]}`} />
                    <div className="p-7">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#BE185D] mb-2">
                        <span>{item.participationRole}</span>
                        <span aria-hidden="true" className="text-[#6E5A64]">·</span>
                        <span className="text-[#6E5A64]">{item.formatOrLocation}</span>
                        {item.eventDate && (
                          <>
                            <span aria-hidden="true" className="text-[#6E5A64]">·</span>
                            <span className="text-[#6E5A64]">{formatDate(item.eventDate)}</span>
                          </>
                        )}
                      </div>
                      <h2 className="font-serif text-2xl text-[#4C0519] mb-2 group-hover:text-[#BE185D] transition-colors">
                        {item.presentationTitle}
                      </h2>
                      <p className="text-sm font-medium text-[#271C22]/80 mb-3">
                        {item.eventTitle} — {item.organizer}
                      </p>
                      <p className="text-sm text-[#6E5A64] line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-7 pb-6">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#BE185D]">
                      <span>View Presentation Details</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
