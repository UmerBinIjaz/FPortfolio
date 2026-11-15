import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedAchievements, getPublishedSkills, getPublishedTrainings } from '@/lib/data';
import { AchievementsBrowser } from '@/components/achievements/AchievementsBrowser';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Achievements & Certifications',
  description:
    'Verified academic achievements, DigiSkills.pk professional training records, and uploaded certificates.',
};

export default async function AchievementsPage() {
  const [achievements, trainings, skills] = await Promise.all([
    getPublishedAchievements(),
    getPublishedTrainings(),
    getPublishedSkills(),
  ]);

  const certCount = achievements.reduce((sum, a) => sum + a.certificates.length, 0);

  return (
    <div>
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Verified Credentials
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Achievements &amp; <span className="italic text-[#BE185D]">Certifications</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed mb-8">
            Only genuine academic achievements, DigiSkills.pk training credentials, awards, and participation certificates uploaded through the Admin Panel are published here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white border border-[#BE185D]/20 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#BE185D]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Published Achievements</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{achievements.length}</p>
              </div>
            </div>
            <div className="bg-white border border-[#F59E0B]/30 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#F59E0B]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Uploaded Certificates</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{certCount}</p>
              </div>
            </div>
            <div className="bg-white border border-[#0F766E]/25 rounded-xl overflow-hidden shadow-xs">
              <div className="h-1 bg-[#0F766E]" />
              <div className="p-4">
                <p className="text-xs font-medium text-[#6E5A64]">Verified Trainings</p>
                <p className="font-serif text-2xl font-bold text-[#4C0519] tabular-nums">{trainings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        <AchievementsBrowser items={achievements} />

        {/* Skills & Training Foundation */}
        <div className="pt-10 border-t border-[#4C0519]/10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl text-[#4C0519] mb-4">
              Documented Professional Training
            </h2>
            <div className="space-y-4">
              {trainings.map((t, idx) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className={`h-1.5 w-full ${idx % 2 === 0 ? 'bg-[#BE185D]' : 'bg-[#F59E0B]'}`} />
                  <div className="p-6">
                    <p className="text-xs font-semibold text-[#BE185D] mb-1">
                      {t.provider} · {t.duration}
                    </p>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2">{t.title}</h3>
                    <p className="text-sm text-[#6E5A64] leading-relaxed">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-white to-[#FCE7F3]/50 border border-[#BE185D]/15 rounded-2xl p-6 shadow-xs">
              <h2 className="font-serif text-2xl text-[#4C0519] mb-4">
                Skills Development
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#271C22]/85">
                {skills.map((s) => (
                  <div key={s.id} className="py-1.5 border-b border-[#4C0519]/10">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5B061E] via-[#4C0519] to-[#BE185D] text-[#FFFBF7] rounded-2xl p-6 shadow-md">
              <h3 className="font-serif text-xl text-white mb-2">Professional Growth</h3>
              <p className="text-sm text-[#FDE8EF]/90 leading-relaxed mb-4">
                Continuing to pursue excellence in English studies, creative expression, and educator readiness.
              </p>
              <Link
                href="/contact"
                className="inline-block px-5 py-2.5 text-sm font-semibold bg-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FBBF24] transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
