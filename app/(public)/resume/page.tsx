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
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 no-print">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Curriculum Vitae
          </p>
          <h1 className="font-serif text-4xl text-[#172554]">Resume / CV</h1>
        </div>
        <ResumeActions originalCvUrl={profile.cvDocumentUrl} />
      </div>

      {/* Printable Editorial CV Sheet */}
      <div className="bg-white border border-[#172554]/12 rounded-lg overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12">
        {/* Left Navy Sidebar */}
        <aside className="md:col-span-4 bg-[#172554] text-[#FAF9F6] p-8 space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-white mb-1">{profile.fullName}</h2>
            <p className="text-sm text-[#C5A46D] leading-snug">{profile.title}</p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-200 pt-5 border-t border-white/15">
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <span>{profile.location}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <span className="break-all">{profile.email}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <span>{profile.phone}</span>
            </p>
          </div>

          <div className="pt-5 border-t border-white/15">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D] mb-4">
              Education
            </h3>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-semibold text-white">{edu.institution}</p>
                  <p className="text-xs text-[#C5A46D] tabular-nums">
                    {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                  </p>
                  <p className="text-xs text-slate-200 mt-0.5">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-white/15">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D] mb-3">
              Skills
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {skills.map((skill) => (
                <li key={skill.id}>• {skill.name}</li>
              ))}
            </ul>
          </div>

          <div className="pt-5 border-t border-white/15">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D] mb-3">
              Languages
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {profile.languages.map((lang) => (
                <li key={lang}>• {lang}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Main CV Content */}
        <div className="md:col-span-8 p-8 md:p-10 space-y-9">
          <section>
            <h3 className="font-serif text-xl text-[#172554] pb-2 border-b border-[#C5A46D]/60 mb-4">
              Professional Summary
            </h3>
            <p className="text-sm text-[#252525]/90 leading-relaxed whitespace-pre-line">
              {profile.summary}
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl text-[#172554] pb-2 border-b border-[#C5A46D]/60 mb-5">
              Professional Training
            </h3>
            <div className="space-y-7">
              {trainings.map((training) => (
                <div key={training.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h4 className="font-serif text-lg text-[#172554] font-medium">
                      {training.title}
                    </h4>
                    <span className="text-xs text-[#64748B]">
                      {training.provider} · {training.duration}
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B] mb-3 leading-relaxed">
                    {training.description}
                  </p>
                  <ul className="space-y-1.5 text-sm text-[#252525]/85">
                    {training.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-[#C5A46D]" aria-hidden="true">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-4 border-t border-[#172554]/10 text-xs text-[#64748B]">
            {profile.tagline}
          </section>
        </div>
      </div>
    </div>
  );
}
