import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import {
  getProfile,
  getPublishedEducation,
  getPublishedSkills,
  getPublishedTrainings,
} from '@/lib/data';
import { ResumeActions } from '@/components/resume/ResumeActions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resume / CV',
  description:
    'Curriculum Vitae of Faryal — BS English student at Air University with DigiSkills.pk training in Digital Marketing and Graphic Design.',
};

export default async function ResumePage() {
  const [profile, educations, skills, trainings] = await Promise.all([
    getProfile(),
    getPublishedEducation(),
    getPublishedSkills(),
    getPublishedTrainings(),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/80 to-[#FEF3C7]/70 border-b border-[#BE185D]/15 py-12 md:py-14 no-print">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Curriculum Vitae
            </p>
            <h1 className="font-serif text-4xl text-[#4C0519]">
              Resume / <span className="italic text-[#BE185D]">CV</span>
            </h1>
          </div>
          <ResumeActions originalCvUrl={profile.cvDocumentUrl} />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        {/* Printable Editorial CV Sheet */}
        <div className="bg-white border border-[#BE185D]/20 rounded-2xl overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-12">
          {/* Left Deep Plum Sidebar */}
          <aside className="md:col-span-4 bg-gradient-to-b from-[#5B061E] via-[#4C0519] to-[#3B0313] text-[#FFFBF7] p-8 space-y-8">
            <div>
              <h2 className="font-serif text-3xl text-white mb-1">{profile.fullName}</h2>
              <p className="text-sm text-[#F59E0B] leading-snug">{profile.title}</p>
            </div>

            <div className="space-y-2.5 text-xs text-[#FDE8EF]/90 pt-5 border-t border-white/15">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
                <span>{profile.location}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
                <span className="break-all">{profile.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
                <span>{profile.phone}</span>
              </p>
            </div>

            <div className="pt-5 border-t border-white/15">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-sm font-semibold text-white">{edu.institution}</p>
                    <p className="text-xs text-[#F59E0B] tabular-nums">
                      {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                    </p>
                    <p className="text-xs text-[#FDE8EF]/85 mt-0.5">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/15">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-3">
                Skills
              </h3>
              <ul className="space-y-1.5 text-xs text-[#FDE8EF]/90">
                {skills.map((skill) => (
                  <li key={skill.id}>• {skill.name}</li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/15">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-3">
                Languages
              </h3>
              <ul className="space-y-1.5 text-xs text-[#FDE8EF]/90">
                {profile.languages.map((lang) => (
                  <li key={lang}>• {lang}</li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Main CV Content */}
          <div className="md:col-span-8 p-8 md:p-10 space-y-9 bg-gradient-to-br from-white via-[#FFFBF7] to-[#FCE7F3]/25">
            <section>
              <h3 className="font-serif text-xl text-[#4C0519] pb-2 border-b-2 border-[#BE185D]/40 mb-4">
                Professional Summary
              </h3>
              <p className="text-sm text-[#271C22]/90 leading-relaxed whitespace-pre-line">
                {profile.summary}
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-[#4C0519] pb-2 border-b-2 border-[#F59E0B]/50 mb-5">
                Professional Training
              </h3>
              <div className="space-y-7">
                {trainings.map((training) => (
                  <div key={training.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-serif text-lg text-[#4C0519] font-semibold">
                        {training.title}
                      </h4>
                      <span className="text-xs font-medium text-[#BE185D]">
                        {training.provider} · {training.duration}
                      </span>
                    </div>
                    <p className="text-sm text-[#6E5A64] mb-3 leading-relaxed">
                      {training.description}
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#271C22]/85">
                      {training.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span className="text-[#F59E0B] font-bold" aria-hidden="true">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-4 border-t border-[#4C0519]/10 text-xs italic text-[#BE185D]">
              {profile.tagline}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
