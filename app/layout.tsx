import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { getSiteSettings } from '@/lib/data';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    'http://localhost:3000';

  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(baseUrl);
  } catch {
    metadataBase = undefined;
  }

  return {
    metadataBase,
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`,
    },
    description: settings.metaDescription,
    openGraph: {
      title: settings.siteTitle,
      description: settings.metaDescription,
      type: 'website',
      siteName: 'Faryal Academic E-Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.metaDescription,
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Faryal',
    jobTitle: 'BS English Student & Aspiring English Language Educator',
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Air University',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rawalpindi',
      addressCountry: 'PK',
    },
    knowsLanguage: ['English', 'Urdu', 'Pashto'],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#FFFBF7] text-[#271C22] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
