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
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Aspiring English Language Educator
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Teaching <span className="italic text-[#BE185D]">Practicum</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed">
            A structured academic practicum space documenting lesson planning, studied English Language Teaching (ELT) methodologies, classroom activities, technology integration, and reflective practice.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-14">
        <PracticumBrowser
          lessonPlans={data.lessonPlans}
          demonstrations={data.demonstrations}
          resources={data.resources}
          reflections={data.reflections}
        />

        {/* Classroom Activities & Technology in ELT Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#4C0519]/10">
          <div className="bg-gradient-to-br from-white to-[#FCE7F3]/50 border border-[#BE185D]/20 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-1.5 w-full bg-[#BE185D]" />
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
                Pedagogical Design
              </p>
              <h2 className="font-serif text-2xl text-[#4C0519] mb-3">
                Classroom Activities Focus
              </h2>
              <p className="text-sm text-[#271C22]/80 leading-relaxed">
                Designing interactive pair discussions, guided reading circles, structured writing prompts, and vocabulary building exercises aimed at encouraging confident English communication.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#FEF3C7]/60 border border-[#F59E0B]/30 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-1.5 w-full bg-[#F59E0B]" />
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
                Digital Literacy
              </p>
              <h2 className="font-serif text-2xl text-[#4C0519] mb-3">
                Technology in English Language Teaching
              </h2>
              <p className="text-sm text-[#271C22]/80 leading-relaxed">
                Applying visual communication principles from Graphic Design and audience engagement insights from Digital Marketing to create clear slides, digital handouts, and accessible learning resources.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#5B061E] via-[#4C0519] to-[#BE185D] text-[#FFFBF7] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
          <div>
            <h2 className="font-serif text-2xl text-white mb-2">
              Interested in Educational Collaboration?
            </h2>
            <p className="text-sm text-[#FDE8EF]/85">
              Reach out regarding academic mentorship, teaching practicum opportunities, or curriculum resources.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 text-sm font-semibold bg-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FBBF24] transition-colors whitespace-nowrap shadow-sm"
          >
            Contact Faryal
          </Link>
        </div>
      </section>
    </div>
  );
}
