'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ALL_PUBLIC_LINKS, PUBLIC_NAV_LINKS } from '@/lib/constants';

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


  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#172554]/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-tight text-[#172554] shrink-0"
        >
          Faryal
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#64748B]"
        >
          {ALL_PUBLIC_LINKS.map((item) => {
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
                    className={`flex items-center gap-1.5 py-2 transition-colors ${
                      academicActive || academicOpen
                        ? 'text-[#172554]'
                        : 'hover:text-[#172554]'
                    }`}
                  >
                    {item.label}

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        academicOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 pt-3 w-60 transition-all duration-200 ${
                      academicOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-[#172554]/10 p-2">
                      {item.children.map((child) => {
                        const active = pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setAcademicOpen(false)}
                            className={`block px-4 py-3 rounded-md text-sm transition-colors ${
                              active
                                ? 'bg-[#EDE9FE] text-[#172554]'
                                : 'text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#172554]'
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

            const isActive =
              pathname === item.href ||
              (item.href !== '/' &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap py-2 border-b-2 transition-colors ${
                  isActive
                    ? 'text-[#172554] border-[#C5A46D]'
                    : 'border-transparent hover:text-[#172554] hover:border-[#172554]/20'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Contact + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center px-5 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors"
          >
            Contact
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md border border-[#172554]/15 text-[#172554] hover:bg-[#EDE9FE]/50 transition-colors"
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
        <div className="lg:hidden border-t border-[#172554]/10 bg-[#FAF9F6] px-5 py-4">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-1"
          >
            {ALL_PUBLIC_LINKS.map((item) => {
              if ('children' in item) {
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileAcademicOpen((v) => !v)
                      }
                      aria-expanded={mobileAcademicOpen}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium ${
                        academicActive
                          ? 'text-[#172554] bg-[#EDE9FE]'
                          : 'text-[#252525] hover:bg-[#EDE9FE]/50'
                      }`}
                    >
                      {item.label}

                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileAcademicOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAcademicOpen && (
                      <div className="ml-4 mt-1 pl-3 border-l-2 border-[#C5A46D] flex flex-col">
                        {item.children.map((child) => {
                          const active =
                            pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileAcademicOpen(false);
                              }}
                              className={`px-3 py-2.5 rounded-md text-sm ${
                                active
                                  ? 'text-[#172554] font-semibold'
                                  : 'text-[#64748B] hover:text-[#172554]'
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

              const active =
                pathname === item.href ||
                (item.href !== '/' &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 rounded-md text-sm font-medium ${
                    active
                      ? 'bg-[#EDE9FE] text-[#172554]'
                      : 'text-[#252525] hover:bg-[#EDE9FE]/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center px-4 py-3 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
