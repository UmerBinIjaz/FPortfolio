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
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Professional Learning Activities
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Webinars &amp; Workshops
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed mb-8">
            Documented webinars in English Language Teaching, literature, educational technology, and communication—accompanied by reflective notes and verified certificates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#172554]/10 border border-[#172554]/10 rounded-lg overflow-hidden max-w-2xl">
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Webinars Recorded</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{webinars.length}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Learning Reflections</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{reflectionCount}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Certificates Uploaded</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{certCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <WebinarsBrowser webinars={webinars} />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[#172554]/10 rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-[#172554] mb-2">
              Continuing Professional Development
            </h2>
            <p className="text-sm text-[#64748B]">
              Explore related academic presentations and developing classroom materials.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/symposium"
              className="px-4 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors whitespace-nowrap"
            >
              View Symposiums
            </Link>
            <Link
              href="/teaching-practicum"
              className="px-4 py-2.5 text-sm font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50 transition-colors whitespace-nowrap"
            >
              Teaching Practicum
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
