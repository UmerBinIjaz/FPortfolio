
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Menu, X, ChevronDown } from 'lucide-react';
import { ALL_PUBLIC_LINKS } from '@/lib/constants';

export function SiteHeader() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);

  const academicItem = ALL_PUBLIC_LINKS.find(
    (item) => 'children' in item
  );

  const academicActive =
    academicItem &&
    'children' in academicItem &&
    academicItem.children.some(
      (child) =>
        pathname === child.href ||
        pathname.startsWith(`${child.href}/`)
    );

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF7]/95 backdrop-blur-md border-b border-[#BE185D]/20 no-print">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-[4.25rem] flex items-center justify-between gap-4">

        {/* Logo / Brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 whitespace-nowrap shrink-0 group"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-[#4C0519] group-hover:text-[#BE185D] transition-colors">
            Faryal
          </span>

          <span
            aria-hidden="true"
            className="hidden xl:inline-block h-7 w-px bg-[#4C0519]/30"
          />

          <span className="hidden xl:inline-block font-serif italic text-xs leading-tight text-[#6E5A64]">
            Academic &amp; Professional
            <br />
            Portfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#4C0519]/80"
        >
          {ALL_PUBLIC_LINKS.map((item) => {

            {/* Academic Dropdown */}
            if ('children' in item) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setAcademicOpen(true)}
                  onMouseLeave={() => setAcademicOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setAcademicOpen((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setAcademicOpen(false);
                      }
                    }}
                    aria-expanded={academicOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 py-2 border-b-2 transition-colors ${
                      academicActive || academicOpen
                        ? 'text-[#4C0519] font-semibold border-[#BE185D]'
                        : 'border-transparent hover:text-[#BE185D] hover:border-[#F59E0B]'
                    }`}
                  >
                    {item.label}

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        academicOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 pt-3 w-64 transition-all duration-200 ${
                      academicOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="bg-[#FFFBF7] rounded-xl shadow-xl border border-[#4C0519]/10 p-2">

                      {item.children.map((child) => {
                        const active = isActive(child.href);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setAcademicOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                              active
                                ? 'bg-[#FCE7F3] text-[#4C0519] font-semibold'
                                : 'text-[#6E5A64] hover:bg-[#FCE7F3]/70 hover:text-[#BE185D]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}

                    </div>
                  </div>
                </div>
              );
            }

            {/* Normal Navigation Links */}
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap py-2 border-b-2 transition-colors ${
                  active
                    ? 'text-[#4C0519] font-semibold border-[#BE185D]'
                    : 'border-transparent hover:text-[#BE185D] hover:border-[#F59E0B]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Download CV + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">

          <a
            href="/api/resume/pdf"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] shadow-sm transition-all hover:shadow-md whitespace-nowrap"
          >
            <span>Download CV</span>
            <Download className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#BE185D]/25 bg-[#FCE7F3]/50 text-[#4C0519] hover:bg-[#FCE7F3] transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#BE185D]/15 bg-gradient-to-b from-[#FFFBF7] to-[#FCE7F3]/40 px-5 py-4">

          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-1"
          >
            {ALL_PUBLIC_LINKS.map((item) => {

              {/* Mobile Academic Dropdown */}
              if ('children' in item) {
                return (
                  <div key={item.label}>

                    <button
                      type="button"
                      onClick={() =>
                        setMobileAcademicOpen((v) => !v)
                      }
                      aria-expanded={mobileAcademicOpen}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        academicActive
                          ? 'text-[#4C0519] bg-[#FCE7F3]'
                          : 'text-[#4C0519] hover:bg-[#FCE7F3]/70'
                      }`}
                    >
                      {item.label}

                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileAcademicOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAcademicOpen && (
                      <div className="ml-4 mt-1 pl-3 border-l-2 border-[#F59E0B] flex flex-col">

                        {item.children.map((child) => {
                          const active = isActive(child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileAcademicOpen(false);
                              }}
                              className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                                active
                                  ? 'text-[#BE185D] font-semibold'
                                  : 'text-[#6E5A64] hover:text-[#BE185D]'
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}

                      </div>
                    )}

                  </div>
                );
              }

              {/* Mobile Normal Links */}
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#BE185D] text-white'
                      : 'text-[#4C0519] hover:bg-[#FCE7F3]/70'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Download CV */}
            <div className="mt-3 pt-3 border-t border-[#4C0519]/10 sm:hidden">

              <a
                href="/api/resume/pdf"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] transition-colors"
              >
                Download CV
                <Download className="w-4 h-4" aria-hidden="true" />
              </a>

            </div>

          </nav>
        </div>
      )}
    </header>
  );
}


