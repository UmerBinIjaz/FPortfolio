import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';
import { ContactForm } from '@/components/contact/ContactForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Faryal for academic correspondence, educational collaboration, or English language education inquiries.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/85 to-[#FEF3C7]/75 border-b border-[#BE185D]/15 py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
            Correspondence
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4C0519] mb-4">
            Contact <span className="italic text-[#BE185D]">Me</span>
          </h1>
          <p className="text-base text-[#271C22]/85 max-w-2xl leading-relaxed">
            Welcome academic inquiries, educational collaborations, teaching practicum conversations, and professional correspondence.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#BE185D]/20 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#BE185D] via-[#F59E0B] to-[#7E22CE]" />
            <div className="p-7 space-y-5">
              <h2 className="font-serif text-2xl text-[#4C0519]">Direct Information</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FCE7F3] text-[#BE185D] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5A64]">Email</p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="font-semibold text-[#4C0519] hover:text-[#BE185D]"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5A64]">Phone</p>
                    <p className="font-semibold text-[#4C0519]">{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6E5A64]">Location</p>
                    <p className="font-semibold text-[#4C0519]">{settings.location}</p>
                  </div>
                </div>
              </div>

              {(settings.linkedinUrl || settings.githubUrl || settings.twitterUrl || settings.instagramUrl) && (
                <div className="pt-4 border-t border-[#4C0519]/10">
                  <p className="text-xs font-medium text-[#6E5A64] mb-2">Social &amp; Academic Profiles</p>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-[#4C0519]">
                    {settings.linkedinUrl && (
                      <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#BE185D]">
                        LinkedIn
                      </a>
                    )}
                    {settings.githubUrl && (
                      <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#BE185D]">
                        GitHub
                      </a>
                    )}
                    {settings.twitterUrl && (
                      <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#BE185D]">
                        X / Twitter
                      </a>
                    )}
                    {settings.instagramUrl && (
                      <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#BE185D]">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#5B061E] via-[#4C0519] to-[#BE185D] text-[#FFFBF7] rounded-2xl p-7 shadow-md">
            <h3 className="font-serif text-xl text-white mb-2">
              Learning Through Language, Growing Through Creativity
            </h3>
            <p className="text-sm text-[#FDE8EF]/90 leading-relaxed">
              Thank you for visiting my academic e-portfolio. Every message sent here goes directly to my administrative inbox.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
