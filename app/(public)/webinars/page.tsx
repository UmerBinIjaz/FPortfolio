import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedWebinars } from '@/lib/data';
import { WebinarsBrowser } from '@/components/webinars/WebinarsBrowser';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webinars',
  description:
    'Professional learning webinars, structured What / So What / Now What reflections, and certificates documented by Faryal.',
};

export default async function WebinarsPage() {
  const webinars = await getPublishedWebinars();
  const reflectionCount = webinars.filter((w) => w.reflection).length;
  const certCount = webinars.filter((w) => Boolean(w.certificateUrl)).length;

  return (
    <div>
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Professional Learning Activities
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Webinars &amp; <span className="italic text-[#BE185D]">Workshops</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed mb-8">
            Documented webinars in English Language Teaching, literature, educational technology, and communication—accompanied by reflective notes and verified certificates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white border border-[#BE185D]/20 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#BE185D]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Webinars Recorded</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{webinars.length}</p>
              </div>
            </div>
            <div className="bg-white border border-[#F59E0B]/30 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#F59E0B]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Learning Reflections</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{reflectionCount}</p>
              </div>
            </div>
            <div className="bg-white border border-[#7E22CE]/20 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#7E22CE]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Certificates Uploaded</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{certCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <WebinarsBrowser webinars={webinars} />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-[#5B061E] via-[#4C0519] to-[#BE185D] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
          <div>
            <h2 className="font-serif text-2xl text-white mb-2">
              Continuing Professional Development
            </h2>
            <p className="text-sm text-[#FDE8EF]/85">
              Explore related academic presentations and developing classroom materials.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/symposium"
              className="px-5 py-2.5 text-sm font-semibold bg-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FBBF24] transition-colors whitespace-nowrap"
            >
              View Symposiums
            </Link>
            <Link
              href="/teaching-practicum"
              className="px-5 py-2.5 text-sm font-semibold border border-white/35 text-white rounded-full hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              Teaching Practicum
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
