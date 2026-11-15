import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Languages, Sparkles } from 'lucide-react';
import {
  getHomeContent,
  getProfile,
  getPublishedEducation,
  getPublishedSkills,
  getPublishedTrainings,
} from '@/lib/data';
import { Reveal } from '@/components/ui/reveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Academic journey, developing teaching philosophy, skills, and DigiSkills.pk professional training of Faryal, BS English student at Air University.',
};

const SKILL_CARD_COLORS = [
  'bg-gradient-to-r from-[#FCE7F3]/75 to-white border-[#BE185D]/20',
  'bg-gradient-to-r from-[#FEF3C7]/75 to-white border-[#F59E0B]/25',
  'bg-gradient-to-r from-[#F3E8FF]/75 to-white border-[#7E22CE]/20',
  'bg-gradient-to-r from-[#CCFBF1]/75 to-white border-[#0F766E]/20',
] as const;

export default async function AboutPage() {
  const [profile, home, educations, skills, trainings] = await Promise.all([
    getProfile(),
    getHomeContent(),
    getPublishedEducation(),
    getPublishedSkills(),
    getPublishedTrainings(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-3">
              About Me
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
              {profile.fullName} — <span className="italic text-[#BE185D]">{profile.title}</span>
            </h1>
            <p className="font-serif italic text-lg text-[#4C0519]/85 mb-5">
              &ldquo;{profile.tagline}&rdquo;
            </p>
            <p className="text-base text-[#271C22]/85 leading-relaxed max-w-2xl">
              {profile.summary}
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#BE185D]/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-2 w-full bg-gradient-to-r from-[#BE185D] via-[#F59E0B] to-[#7E22CE]" />
              <div className="p-6 space-y-4">
                {profile.profileImageUrl && (
                  <div className="aspect-square rounded-xl overflow-hidden border border-[#4C0519]/10 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-[#BE185D]">Institution</p>
                  <p className="text-sm font-semibold text-[#4C0519]">Air University (2023–Present)</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#B45309]">Location</p>
                  <p className="text-sm font-semibold text-[#4C0519]">{profile.location}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#7E22CE]">Languages</p>
                  <p className="text-sm font-semibold text-[#4C0519]">{profile.languages.join(' · ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography & Developing Teaching Philosophy */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Biography
            </p>
            <h2 className="font-serif text-3xl text-[#4C0519] mb-4">
              Academic Journey &amp; Growth
            </h2>
            <p className="text-base text-[#271C22]/85 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>

          <div className="pt-6 border-t border-[#4C0519]/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
              Developing Teaching Philosophy
            </p>
            <h2 className="font-serif text-2xl text-[#4C0519] mb-3">
              Student-Centred &amp; Communicative Interests
            </h2>
            <p className="text-base text-[#271C22]/85 leading-relaxed whitespace-pre-line mb-4">
              {profile.teachingPhilosophy}
            </p>
            <p className="text-xs text-[#4C0519]/85 bg-gradient-to-r from-[#FCE7F3]/70 to-[#FEF3C7]/60 border border-[#BE185D]/15 rounded-xl p-4">
              Note: These pedagogical approaches represent developing academic interests and future teaching goals as an undergraduate BS English student rather than prior professional teaching employment.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#BE185D]/15 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-1.5 w-full bg-[#BE185D]" />
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <GraduationCap className="w-5 h-5 text-[#BE185D]" aria-hidden="true" />
                <h3 className="font-serif text-xl text-[#4C0519]">Education History</h3>
              </div>
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="pb-4 border-b border-[#4C0519]/10 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold text-[#BE185D] tabular-nums">
                      {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                    </p>
                    <p className="font-serif text-lg text-[#4C0519]">{edu.degree}</p>
                    <p className="text-sm text-[#271C22]">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-xs text-[#6E5A64] mt-1 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#F59E0B]/30 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-1.5 w-full bg-[#F59E0B]" />
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Languages className="w-5 h-5 text-[#B45309]" aria-hidden="true" />
                <h3 className="font-serif text-xl text-[#4C0519]">Languages</h3>
              </div>
              <ul className="space-y-2 text-sm text-[#271C22]">
                {profile.languages.map((lang) => (
                  <li key={lang} className="flex items-center justify-between py-1.5 border-b border-[#4C0519]/10 last:border-b-0">
                    <span className="font-medium text-[#4C0519]">{lang}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Skills & Training */}
      <section className="bg-gradient-to-r from-[#FEF3C7]/65 via-[#FFFBF7] to-[#FCE7F3]/75 border-y border-[#BE185D]/15 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Core Competencies
            </p>
            <h2 className="font-serif text-3xl text-[#4C0519] mb-6">
              Skills &amp; Strengths
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, idx) => (
                <div
                  key={skill.id}
                  className={`border rounded-xl p-4 flex items-center justify-between gap-4 shadow-xs ${SKILL_CARD_COLORS[idx % SKILL_CARD_COLORS.length]}`}
                >
                  <span className="font-semibold text-sm text-[#4C0519]">{skill.name}</span>
                  <span className="text-xs font-medium text-[#6E5A64]">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
              Certifications &amp; Workshops
            </p>
            <h2 className="font-serif text-3xl text-[#4C0519] mb-6">
              Professional Training
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trainings.map((tr, idx) => (
                <div
                  key={tr.id}
                  className="bg-white border border-[#4C0519]/12 rounded-2xl overflow-hidden shadow-xs"
                >
                  <div
                    className={`h-2 w-full ${
                      idx % 2 === 0
                        ? 'bg-gradient-to-r from-[#BE185D] to-[#E11D48]'
                        : 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C]'
                    }`}
                  />
                  <div className="p-7">
                    <p className="text-xs font-semibold text-[#BE185D] mb-1">
                      {tr.provider} · {tr.duration}
                    </p>
                    <h3 className="font-serif text-2xl text-[#4C0519] mb-3">{tr.title}</h3>
                    <p className="text-sm text-[#271C22]/85 leading-relaxed mb-4">
                      {tr.description}
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#6E5A64]">
                      {tr.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Interest, Values, Future Goals & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Academic &amp; Pedagogical Focus
          </p>
          <h2 className="font-serif text-3xl text-[#4C0519] mb-6">Areas of Interest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {home.areasOfInterest.map((area, idx) => {
              const barColors = ['bg-[#BE185D]', 'bg-[#F59E0B]', 'bg-[#7E22CE]', 'bg-[#0F766E]'];
              return (
                <div
                  key={area.title}
                  className="bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className={`h-1.5 w-full ${barColors[idx % barColors.length]}`} />
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-[#4C0519] mb-1.5">{area.title}</h3>
                    <p className="text-sm text-[#6E5A64] leading-relaxed">{area.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-white to-[#FCE7F3]/60 border border-[#BE185D]/20 rounded-2xl p-6">
            <h3 className="font-serif text-xl text-[#4C0519] mb-4">Personal Values</h3>
            <ul className="space-y-2.5 text-sm text-[#271C22]/85">
              {profile.personalValues.map((val) => (
                <li key={val} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-white to-[#FEF3C7]/60 border border-[#F59E0B]/25 rounded-2xl p-6">
            <h3 className="font-serif text-xl text-[#4C0519] mb-4">Future Goals</h3>
            <ul className="space-y-2.5 text-sm text-[#271C22]/85">
              {profile.futureGoals.map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="text-[#BE185D] font-semibold" aria-hidden="true">→</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#5B061E] via-[#4C0519] to-[#700B2A] text-[#FFFBF7] rounded-2xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-2">
                Vision Statement
              </p>
              <h3 className="font-serif text-xl text-white mb-3">Professional Vision</h3>
              <p className="text-sm text-[#FDE8EF]/90 leading-relaxed">
                {profile.professionalVision}
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F59E0B] hover:text-white transition-colors"
            >
              <span>Connect with Faryal</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
