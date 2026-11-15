import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
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
    <footer className="bg-[#172554] text-[#FAF9F6] border-t border-[#172554] no-print">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-white">
            Faryal
          </Link>
          <p className="text-sm text-[#C5A46D] mt-2 font-medium">{settings.tagline}</p>
          <p className="text-sm text-slate-300 mt-4 max-w-sm leading-relaxed">
            Bachelor of English student at Air University and aspiring English Language Educator
            building communicative, creative, and reflective educational practice.
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-300">
            <p className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <span>{settings.location}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hover:text-white transition-colors"
              >
                {settings.contactEmail}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
              <span>{settings.contactPhone}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-4">
          <h3 className="font-serif text-base text-[#C5A46D] mb-4">Portfolio Sections</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-slate-300">
            <div className="space-y-2.5">
              {firstCol.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-2.5">
              {secondCol.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-serif text-base text-[#C5A46D] mb-4">Academic Resources</h3>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li>
              <Link href="/resume" className="hover:text-white transition-colors">
                Online Resume / CV
              </Link>
            </li>
            <li>
              <a
                href="/api/resume/pdf"
                className="hover:text-white transition-colors"
              >
                Download CV (PDF)
              </a>
            </li>
            <li>
              <Link href="/teaching-practicum" className="hover:text-white transition-colors">
                Teaching Practicum
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white transition-colors">
                Administrator Portal
              </Link>
            </li>
          </ul>
          {(settings.linkedinUrl || settings.githubUrl || settings.twitterUrl || settings.instagramUrl) && (
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-300">
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
              )}
              {settings.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GitHub
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  X / Twitter
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <p>{settings.footerText}</p>
          <p>&copy; {new Date().getFullYear()} Faryal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
