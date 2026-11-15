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
      <section className="bg-[#EDE9FE]/55 border-b border-[#172554]/10 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
            Correspondence
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#172554] mb-4">
            Contact Me
          </h1>
          <p className="text-base text-[#252525]/85 max-w-2xl leading-relaxed">
            Welcome academic inquiries, educational collaborations, teaching practicum conversations, and professional correspondence.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#172554]/10 rounded-lg p-7 space-y-5">
            <h2 className="font-serif text-2xl text-[#172554]">Direct Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#64748B]">Email</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="font-medium text-[#172554] hover:text-[#C5A46D]"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#64748B]">Phone</p>
                  <p className="font-medium text-[#172554]">{settings.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#64748B]">Location</p>
                  <p className="font-medium text-[#172554]">{settings.location}</p>
                </div>
              </div>
            </div>

            {(settings.linkedinUrl || settings.githubUrl || settings.twitterUrl || settings.instagramUrl) && (
              <div className="pt-4 border-t border-[#172554]/10">
                <p className="text-xs font-medium text-[#64748B] mb-2">Social &amp; Academic Profiles</p>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-[#172554]">
                  {settings.linkedinUrl && (
                    <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                      LinkedIn
                    </a>
                  )}
                  {settings.githubUrl && (
                    <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                      GitHub
                    </a>
                  )}
                  {settings.twitterUrl && (
                    <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                      X / Twitter
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#172554] text-[#FAF9F6] rounded-lg p-7">
            <h3 className="font-serif text-xl text-white mb-2">
              Learning Through Language, Growing Through Creativity
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
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
