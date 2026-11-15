import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPracticumData } from '@/lib/data';
import { PracticumBrowser } from '@/components/practicum/PracticumBrowser';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Teaching Practicum',
  description:
    'Lesson plans, ELT methodologies under study, classroom activities, teaching materials, and reflective teaching practice.',
};

export default async function TeachingPracticumPage() {
  const data = await getPublishedPracticumData();

  return (
    <div>
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Aspiring English Language Educator
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Teaching Practicum
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed">
            A structured academic practicum space documenting lesson planning, studied English Language Teaching (ELT) methodologies, classroom activities, technology integration, and reflective practice.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-14">
        <PracticumBrowser
          lessonPlans={data.lessonPlans}
          demonstrations={data.demonstrations}
          resources={data.resources}
          reflections={data.reflections}
        />

        {/* Classroom Activities & Technology in ELT Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#172554]/10">
          <div className="bg-white border border-[#172554]/10 rounded-lg p-7">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Pedagogical Design
            </p>
            <h2 className="font-serif text-2xl text-[#172554] mb-3">
              Classroom Activities Focus
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Designing interactive pair discussions, guided reading circles, structured writing prompts, and vocabulary building exercises aimed at encouraging confident English communication.
            </p>
          </div>
          <div className="bg-white border border-[#172554]/10 rounded-lg p-7">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Digital Literacy
            </p>
            <h2 className="font-serif text-2xl text-[#172554] mb-3">
              Technology in English Language Teaching
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Applying visual communication principles from Graphic Design and audience engagement insights from Digital Marketing to create clear slides, digital handouts, and accessible learning resources.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#172554] text-white rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-white mb-2">
              Interested in Educational Collaboration?
            </h2>
            <p className="text-sm text-slate-300">
              Reach out regarding academic mentorship, teaching practicum opportunities, or curriculum resources.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 text-sm font-medium bg-[#C5A46D] text-[#172554] rounded-md hover:bg-[#d3b684] transition-colors whitespace-nowrap"
          >
            Contact Faryal
          </Link>
        </div>
      </section>
    </div>
  );
}
