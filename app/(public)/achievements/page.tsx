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
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Verified Credentials
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Achievements &amp; Certifications
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed mb-8">
            Only genuine academic achievements, DigiSkills.pk training credentials, awards, and participation certificates uploaded through the Admin Panel are published here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#172554]/10 border border-[#172554]/10 rounded-lg overflow-hidden max-w-2xl">
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Published Achievements</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{achievements.length}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Uploaded Certificates</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{certCount}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#64748B]">Verified Trainings</p>
              <p className="font-serif text-2xl text-[#172554] tabular-nums">{trainings.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16">
        <AchievementsBrowser items={achievements} />

        {/* Skills & Training Foundation */}
        <div className="pt-10 border-t border-[#172554]/10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl text-[#172554] mb-4">
              Documented Professional Training
            </h2>
            <div className="space-y-4">
              {trainings.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#172554]/10 rounded-lg p-6"
                >
                  <p className="text-xs text-[#64748B] mb-1">
                    {t.provider} · {t.duration}
                  </p>
                  <h3 className="font-serif text-xl text-[#172554] mb-2">{t.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
              <h2 className="font-serif text-2xl text-[#172554] mb-4">
                Skills Development
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#252525]/85">
                {skills.map((s) => (
                  <div key={s.id} className="py-1.5 border-b border-[#172554]/10">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#172554] text-white rounded-lg p-6">
              <h3 className="font-serif text-xl text-white mb-2">Professional Growth</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Continuing to pursue excellence in English studies, creative expression, and educator readiness.
              </p>
              <Link
                href="/contact"
                className="inline-block px-4 py-2 text-sm font-medium bg-[#C5A46D] text-[#172554] rounded-md hover:bg-[#d3b684] transition-colors"
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
