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
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-3">
              About Me
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
              {profile.fullName} — {profile.title}
            </h1>
            <p className="font-serif italic text-lg text-[#172554]/80 mb-5">
              &ldquo;{profile.tagline}&rdquo;
            </p>
            <p className="text-base text-[#252525]/85 leading-relaxed max-w-2xl">
              {profile.summary}
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#172554]/12 rounded-lg p-6 space-y-4">
              {profile.profileImageUrl && (
                <div className="aspect-square rounded-md overflow-hidden border border-[#172554]/10 mb-4">
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
                <p className="text-xs text-[#64748B]">Institution</p>
                <p className="text-sm font-medium text-[#172554]">Air University (2023–Present)</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Location</p>
                <p className="text-sm font-medium text-[#172554]">{profile.location}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Languages</p>
                <p className="text-sm font-medium text-[#172554]">{profile.languages.join(' · ')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography & Developing Teaching Philosophy */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Biography
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-4">
              Academic Journey &amp; Growth
            </h2>
            <p className="text-base text-[#252525]/85 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>

          <div className="pt-6 border-t border-[#172554]/10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Developing Teaching Philosophy
            </p>
            <h2 className="font-serif text-2xl text-[#172554] mb-3">
              Student-Centred &amp; Communicative Interests
            </h2>
            <p className="text-base text-[#252525]/85 leading-relaxed whitespace-pre-line mb-4">
              {profile.teachingPhilosophy}
            </p>
            <p className="text-xs text-[#64748B] bg-[#EDE9FE]/60 border border-[#172554]/10 rounded-md p-3.5">
              Note: These pedagogical approaches represent developing academic interests and future teaching goals as an undergraduate BS English student rather than prior professional teaching employment.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <GraduationCap className="w-5 h-5 text-[#172554]" aria-hidden="true" />
              <h3 className="font-serif text-xl text-[#172554]">Education History</h3>
            </div>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="pb-4 border-b border-[#172554]/10 last:border-b-0 last:pb-0">
                  <p className="text-xs font-medium text-[#C5A46D] tabular-nums">
                    {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                  </p>
                  <p className="font-serif text-lg text-[#172554]">{edu.degree}</p>
                  <p className="text-sm text-[#252525]">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Languages className="w-5 h-5 text-[#172554]" aria-hidden="true" />
              <h3 className="font-serif text-xl text-[#172554]">Languages</h3>
            </div>
            <ul className="space-y-2 text-sm text-[#252525]">
              {profile.languages.map((lang) => (
                <li key={lang} className="flex items-center justify-between py-1.5 border-b border-[#172554]/10 last:border-b-0">
                  <span>{lang}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Skills & Training */}
      <section className="bg-white border-y border-[#172554]/10 py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Core Competencies
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-6">
              Skills &amp; Strengths
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-[#FAF9F6] border border-[#172554]/10 rounded-md p-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-sm text-[#172554]">{skill.name}</span>
                  <span className="text-xs text-[#64748B]">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Certifications &amp; Workshops
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-6">
              Professional Training
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trainings.map((tr) => (
                <div
                  key={tr.id}
                  className="bg-[#FAF9F6] border border-[#172554]/10 rounded-lg p-7"
                >
                  <p className="text-xs text-[#64748B] mb-1">
                    {tr.provider} · {tr.duration}
                  </p>
                  <h3 className="font-serif text-2xl text-[#172554] mb-3">{tr.title}</h3>
                  <p className="text-sm text-[#252525]/85 leading-relaxed mb-4">
                    {tr.description}
                  </p>
                  <ul className="space-y-1.5 text-sm text-[#64748B]">
                    {tr.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-[#C5A46D]" aria-hidden="true">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Interest, Values, Future Goals & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Academic &amp; Pedagogical Focus
          </p>
          <h2 className="font-serif text-3xl text-[#172554] mb-6">Areas of Interest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {home.areasOfInterest.map((area) => (
              <div
                key={area.title}
                className="bg-white border border-[#172554]/10 rounded-lg p-5"
              >
                <h3 className="font-serif text-lg text-[#172554] mb-1.5">{area.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
            <h3 className="font-serif text-xl text-[#172554] mb-4">Personal Values</h3>
            <ul className="space-y-2.5 text-sm text-[#252525]/85">
              {profile.personalValues.map((val) => (
                <li key={val} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
            <h3 className="font-serif text-xl text-[#172554] mb-4">Future Goals</h3>
            <ul className="space-y-2.5 text-sm text-[#252525]/85">
              {profile.futureGoals.map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="text-[#C5A46D] font-semibold" aria-hidden="true">→</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#172554] text-[#FAF9F6] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C5A46D] mb-2">
                Vision Statement
              </p>
              <h3 className="font-serif text-xl text-white mb-3">Professional Vision</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {profile.professionalVision}
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#C5A46D] hover:text-white transition-colors"
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
