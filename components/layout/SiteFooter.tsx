import Link from 'next/link';
import { Github, Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { ALL_PUBLIC_LINKS } from '@/lib/constants';

interface SiteFooterProps {
  settings: {
    siteTitle: string;
    tagline: string;
    footerText: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
  };
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const firstCol = ALL_PUBLIC_LINKS.slice(0, 5);
  const secondCol = ALL_PUBLIC_LINKS.slice(5);

  return (
    <footer className="bg-gradient-to-b from-[#5B061E] via-[#4C0519] to-[#3B0313] text-[#FFFBF7] border-t border-[#F59E0B]/30 no-print">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="inline-flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl font-bold text-white">
              Faryal
            </Link>
            <span aria-hidden="true" className="h-5 w-px bg-[#F59E0B]/50" />
            <span className="font-serif italic text-xs text-[#FDE8EF]/85">
              Academic &amp; Professional Portfolio
            </span>
          </div>
          <p className="text-sm text-[#F59E0B] mt-3 font-medium">{settings.tagline}</p>
          <p className="text-sm text-[#FDE8EF]/85 mt-3 max-w-sm leading-relaxed">
            Bachelor of English student at Air University and aspiring English Language Educator
            building communicative, creative, and reflective educational practice.
          </p>
          <div className="mt-6 space-y-2 text-sm text-[#FDE8EF]/85">
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
              <span>{settings.location}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:text-[#F59E0B] transition-colors"
              >
                {settings.contactEmail}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
              <span>{settings.contactPhone}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-4">
          <h3 className="font-serif text-base text-[#F59E0B] mb-4">Portfolio Sections</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[#FDE8EF]/85">
            <div className="space-y-2.5">
              {firstCol.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} className="hover:text-[#F59E0B] transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-2.5">
              {secondCol.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} className="hover:text-[#F59E0B] transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-serif text-base text-[#F59E0B] mb-4">Academic Resources</h3>
          <ul className="space-y-2.5 text-sm text-[#FDE8EF]/85">
            <li>
              <Link href="/resume" className="hover:text-[#F59E0B] transition-colors">
                Online Resume / CV
              </Link>
            </li>
            <li>
              <a
                href="/api/resume/pdf"
                className="hover:text-[#F59E0B] transition-colors"
              >
                Download CV (PDF)
              </a>
            </li>
            <li>
              <Link href="/achievements" className="hover:text-[#F59E0B] transition-colors">
                Achievements &amp; Certificates
              </Link>
            </li>
            <li>
              <Link href="/reflections" className="hover:text-[#F59E0B] transition-colors">
                Reflections &amp; Articles
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-[#F59E0B] transition-colors">
                Administrator Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FDE8EF]/80">
          <p>{settings.footerText}</p>

          {/* Circular Saffron Icon Links matching mockup */}
          <div className="flex items-center gap-2.5">
            {settings.linkedinUrl ? (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href="/about"
                aria-label="Academic Profile"
                className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            {settings.githubUrl ? (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href="/portfolio"
                aria-label="Portfolio Showcase"
                className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            <Link
              href="/webinars"
              aria-label="Webinars and Events"
              className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={`mailto:${settings.contactEmail}`}
              aria-label="Send Email to Faryal"
              className="w-9 h-9 rounded-full border border-[#F59E0B]/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#4C0519] flex items-center justify-center transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
