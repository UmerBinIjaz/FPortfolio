'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, PlayCircle, Sparkles, X } from 'lucide-react';

interface HeroIntroModalProps {
  fullName: string;
  title: string;
  location: string;
  bio: string;
  teachingPhilosophy: string;
  languages: string[];
}

export function HeroIntroModal({
  fullName,
  title,
  location,
  bio,
  teachingPhilosophy,
  languages,
}: HeroIntroModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold bg-white/90 border-2 border-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FEF3C7]/70 transition-colors whitespace-nowrap shadow-sm"
      >
        <PlayCircle className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
        <span>Academic Intro</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C0519]/65 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FFFBF7] border-2 border-[#F59E0B]/50 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#4C0519] via-[#700B2A] to-[#BE185D] text-white p-6 sm:p-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-1">
                  Academic Overview
                </p>
                <h2 id="intro-modal-title" className="font-serif text-2xl sm:text-3xl text-white">
                  {fullName} — {title}
                </h2>
                <p className="text-xs text-[#FDE8EF]/90 mt-1.5">
                  {location} · Languages: {languages.join(' · ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close introduction dialog"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-6">
              <div className="bg-[#FCE7F3]/50 border border-[#BE185D]/15 rounded-xl p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#BE185D] mb-2">
                  <GraduationCap className="w-4 h-4" aria-hidden="true" />
                  <span>Academic &amp; Creative Journey</span>
                </div>
                <p className="text-sm text-[#271C22]/90 leading-relaxed">{bio}</p>
              </div>

              <div className="bg-[#FEF3C7]/45 border border-[#F59E0B]/30 rounded-xl p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#B45309] mb-2">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Developing Teaching Philosophy</span>
                </div>
                <p className="text-sm text-[#271C22]/90 leading-relaxed">{teachingPhilosophy}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#4C0519]/10">
                <div className="flex items-center gap-2 text-xs text-[#6E5A64]">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  <span>BS English (2023–Present) · DigiSkills.pk Certified</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] transition-colors"
                  >
                    <span>Full Biography</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/teaching-practicum"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-[#4C0519]/20 text-[#4C0519] rounded-full hover:bg-[#FCE7F3]/60 transition-colors"
                  >
                    <span>Teaching Practicum</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
