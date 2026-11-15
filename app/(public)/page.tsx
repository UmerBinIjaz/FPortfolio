import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Feather,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  PenTool,
  Presentation,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import {
  getHomeContent,
  getProfile,
  getPublishedAchievements,
  getPublishedBlogPosts,
  getPublishedEducation,
  getPublishedPortfolioProjects,
  getPublishedPracticumData,
  getPublishedSymposiums,
  getPublishedTrainings,
  getPublishedWebinars,
} from '@/lib/data';
import { Reveal } from '@/components/ui/reveal';
import { MediaFrame } from '@/components/ui/media-frame';
import { EmptyState } from '@/components/ui/empty-state';
import { HeroIntroModal } from '@/components/home/HeroIntroModal';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const INTEREST_PALETTES = [
  {
    card: 'bg-gradient-to-br from-white to-[#FCE7F3]/75 border-[#BE185D]/20 hover:border-[#BE185D]',
    bar: 'bg-[#BE185D]',
    iconBg: 'bg-[#FCE7F3] text-[#BE185D]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#FEF3C7]/75 border-[#D97706]/25 hover:border-[#F59E0B]',
    bar: 'bg-[#F59E0B]',
    iconBg: 'bg-[#FEF3C7] text-[#B45309]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#F3E8FF]/75 border-[#7E22CE]/20 hover:border-[#7E22CE]',
    bar: 'bg-[#7E22CE]',
    iconBg: 'bg-[#F3E8FF] text-[#7E22CE]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#CCFBF1]/75 border-[#0F766E]/20 hover:border-[#0F766E]',
    bar: 'bg-[#0F766E]',
    iconBg: 'bg-[#CCFBF1] text-[#0F766E]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#FFE4E6]/80 border-[#E11D48]/20 hover:border-[#E11D48]',
    bar: 'bg-[#E11D48]',
    iconBg: 'bg-[#FFE4E6] text-[#BE123C]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#E0E7FF]/75 border-[#4338CA]/20 hover:border-[#4338CA]',
    bar: 'bg-[#4338CA]',
    iconBg: 'bg-[#E0E7FF] text-[#4338CA]',
  },
  {
    card: 'bg-gradient-to-br from-white to-[#FFEDD5]/80 border-[#C2410C]/20 hover:border-[#EA580C]',
    bar: 'bg-[#EA580C]',
    iconBg: 'bg-[#FFEDD5] text-[#C2410C]',
  },
] as const;

export default async function HomePage() {
  const [
    home,
    profile,
    educations,
    trainings,
    allProjects,
    featuredProjects,
    webinars,
    symposiums,
    practicum,
    achievements,
    recentPosts,
  ] = await Promise.all([
    getHomeContent(),
    getProfile(),
    getPublishedEducation(),
    getPublishedTrainings(),
    getPublishedPortfolioProjects(),
    getPublishedPortfolioProjects({ featuredOnly: true }),
    getPublishedWebinars(),
    getPublishedSymposiums(),
    getPublishedPracticumData(),
    getPublishedAchievements(),
    getPublishedBlogPosts({ limit: 3 }),
  ]);

  const interestIcons = [
    BookOpen,
    GraduationCap,
    PenTool,
    MessageSquare,
    Monitor,
    Layers,
    Sparkles,
  ];

  const taglineParts = home.heroTagline.includes(',')
    ? [
        `${home.heroTagline.slice(0, home.heroTagline.indexOf(',') + 1)}`,
        home.heroTagline.slice(home.heroTagline.indexOf(',') + 1).trim(),
      ]
    : ['Learning Through Language,', 'Growing Through Creativity.'];

  const totalShowcaseCount = allProjects.length + webinars.length + symposiums.length;
  const totalCredentialsCount = achievements.length + trainings.length;

  return (
    <div>
      {/* Hero Section — Colorful Gradient & Editorial Showcase matching mockup */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBF7] via-[#FCE7F3]/75 to-[#FEF3C7]/70 border-b border-[#BE185D]/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FCE7F3] blur-3xl opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#FEF3C7] blur-3xl opacity-70"
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-14 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#BE185D] tracking-wide mb-4">
                <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
                <span>{home.heroTitle}</span>
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] font-bold text-[#4C0519] mb-5">
                <span className="block">{taglineParts[0]}</span>
                <span className="block italic text-[#BE185D] mt-1">{taglineParts[1]}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#271C22]/85 leading-relaxed max-w-2xl mb-8">
                {home.heroIntro}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] shadow-md transition-colors whitespace-nowrap"
                >
                  <span>Explore My Work</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <HeroIntroModal
                  fullName={profile.fullName}
                  title={profile.title}
                  location={profile.location}
                  bio={profile.bio}
                  teachingPhilosophy={profile.teachingPhilosophy}
                  languages={profile.languages}
                />
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 flex justify-center">
              {profile.profileImageUrl ? (
                <div className="relative w-full max-w-md">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#BE185D]/20 via-[#F59E0B]/25 to-[#7E22CE]/20 blur-md"
                  />
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#F59E0B]/50 bg-white shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-[360px] object-cover"
                    />
                    <div className="bg-gradient-to-r from-[#4C0519] to-[#9D174D] px-5 py-3.5 text-white flex items-center justify-between gap-3">
                      <div>
                        <p className="font-serif text-base font-semibold">{profile.fullName}</p>
                        <p className="text-xs text-[#FDE8EF]/85">BS English · Air University</p>
                      </div>
                      <span className="text-xs font-medium text-[#F59E0B]">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-md">
                  {/* Soft Rose & Amber Decorative Backdrop */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#FCE7F3] via-[#FEF3C7]/80 to-[#F3E8FF]/70 border border-[#BE185D]/15"
                  />
                  <div className="relative rounded-2xl bg-gradient-to-br from-[#5B061E] via-[#4C0519] to-[#700B2A] text-[#FFFBF7] p-7 sm:p-8 shadow-xl border border-[#F59E0B]/35 overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-medium text-[#F59E0B] tracking-wider uppercase mb-6">
                      <span>Academic Folio</span>
                      <span>Air University</span>
                    </div>

                    {/* Stylized Hardcover Book & Feather Motif matching mockup */}
                    <div className="flex items-center gap-5 my-4">
                      <div className="w-28 h-36 rounded-lg bg-gradient-to-br from-[#2B0612] to-[#4C0519] border-2 border-[#F59E0B]/70 shadow-lg p-3 flex flex-col justify-between shrink-0">
                        <div className="w-full h-0.5 bg-[#F59E0B]/60" />
                        <div className="text-center">
                          <p className="font-serif text-xs leading-snug text-[#F59E0B] font-semibold">
                            English
                            <br />
                            Language &amp;
                            <br />
                            Literature
                          </p>
                        </div>
                        <div className="w-full h-0.5 bg-[#F59E0B]/60" />
                      </div>

                      <div className="space-y-2.5">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#BE185D] text-white shadow-sm">
                          <Feather className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <p className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                          {profile.fullName}
                        </p>
                        <p className="text-xs text-[#FDE8EF]/90 leading-relaxed">
                          Aspiring English Language Educator &amp; Creative Communicator
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/10 rounded-lg px-3 py-2.5">
                        <p className="text-[#F59E0B] font-semibold">BS English</p>
                        <p className="text-[#FDE8EF]/85 mt-0.5">2023 – Present</p>
                      </div>
                      <div className="bg-white/10 rounded-lg px-3 py-2.5">
                        <p className="text-[#F59E0B] font-semibold">DigiSkills.pk</p>
                        <p className="text-[#FDE8EF]/85 mt-0.5">Design &amp; Marketing</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Colorful KPI Stats Strip matching mockup */}
      <section className="bg-white border-b border-[#BE185D]/15">
        <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#4C0519]/12">
          <div className="flex items-center gap-4 lg:px-6 first:lg:pl-0">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7F3] text-[#BE185D] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#4C0519] tabular-nums leading-none">
                {educations.length}
              </p>
              <p className="text-xs font-medium text-[#6E5A64] mt-1">
                Academic Milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:px-6">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#4C0519] tabular-nums leading-none">
                {totalShowcaseCount > 0 ? `${totalShowcaseCount}` : '7'}
              </p>
              <p className="text-xs font-medium text-[#6E5A64] mt-1">
                {totalShowcaseCount > 0
                  ? 'Published Works & Events'
                  : 'Areas of Academic Focus'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:px-6">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#4C0519] tabular-nums leading-none">
                {totalCredentialsCount}+
              </p>
              <p className="text-xs font-medium text-[#6E5A64] mt-1">
                Trainings &amp; Credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:px-6 last:lg:pr-0">
            <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#4C0519] tabular-nums leading-none">
                100%
              </p>
              <p className="text-xs font-medium text-[#6E5A64] mt-1">
                Dedication to Learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Burgundy Showcase Band: My Portfolio Highlights matching mockup */}
      <section className="bg-gradient-to-br from-[#5B061E] via-[#4C0519] to-[#3A0413] text-[#FFFBF7] py-14 md:py-16 border-b border-[#F59E0B]/25">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="lg:w-[30%] shrink-0">
              <div className="w-10 h-1 bg-[#F59E0B] rounded-full mb-4" />
              <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-3">
                <span className="block">My Portfolio</span>
                <span className="block italic text-[#F59E0B]">Highlights</span>
              </h2>
              <p className="text-sm text-[#FDE8EF]/85 leading-relaxed mb-6">
                Explore my academic studies, developing ELT teaching materials, webinars, and creative projects in language and design.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FBBF24] transition-colors whitespace-nowrap shadow-sm"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div aria-hidden="true" className="hidden lg:block w-px self-stretch bg-white/15" />

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Link
                href="/portfolio"
                className="group rounded-xl bg-white/[0.06] border border-white/15 hover:border-[#F59E0B] hover:bg-white/[0.12] p-6 text-center flex flex-col items-center justify-between transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#BE185D]/40 text-[#FDE8EF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-1.5">
                    Academic Research
                  </h3>
                  <p className="text-xs text-[#FDE8EF]/80 leading-relaxed">
                    In-depth English studies &amp; coursework
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-[#F59E0B] rounded-full mt-5" />
              </Link>

              <Link
                href="/teaching-practicum"
                className="group rounded-xl bg-white/[0.06] border border-white/15 hover:border-[#F59E0B] hover:bg-white/[0.12] p-6 text-center flex flex-col items-center justify-between transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/25 text-[#FDE68A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Presentation className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-1.5">
                    Teaching Practicum
                  </h3>
                  <p className="text-xs text-[#FDE8EF]/80 leading-relaxed">
                    Lesson plans &amp; ELT methodologies
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-[#F59E0B] rounded-full mt-5" />
              </Link>

              <Link
                href="/webinars"
                className="group rounded-xl bg-white/[0.06] border border-white/15 hover:border-[#F59E0B] hover:bg-white/[0.12] p-6 text-center flex flex-col items-center justify-between transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#7E22CE]/40 text-[#E9D5FF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-1.5">
                    Webinars &amp; Events
                  </h3>
                  <p className="text-xs text-[#FDE8EF]/80 leading-relaxed">
                    Seminars, symposiums &amp; certificates
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-[#F59E0B] rounded-full mt-5" />
              </Link>

              <Link
                href="/reflections"
                className="group rounded-xl bg-white/[0.06] border border-white/15 hover:border-[#F59E0B] hover:bg-white/[0.12] p-6 text-center flex flex-col items-center justify-between transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0F766E]/45 text-[#99F6E4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white mb-1.5">
                    Creative Projects
                  </h3>
                  <p className="text-xs text-[#FDE8EF]/80 leading-relaxed">
                    Design work &amp; reflective writing
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-[#F59E0B] rounded-full mt-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview & Education Timeline — Warm Rose-Saffron Gradient */}
      <section className="bg-gradient-to-br from-[#FCE7F3]/80 via-[#FFFBF7] to-[#FEF3C7]/70 border-b border-[#BE185D]/15 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              About Me
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519] mb-4">
              {home.aboutPreviewTitle}
            </h2>
            <p className="text-base text-[#271C22]/90 leading-relaxed mb-4">
              {home.aboutPreviewText}
            </p>
            <p className="text-sm text-[#6E5A64] leading-relaxed mb-7">
              {profile.summary}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] transition-colors"
              >
                <span>Read Biography &amp; Philosophy</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border border-[#4C0519]/20 text-[#4C0519] rounded-full hover:bg-[#FEF3C7]/60 transition-colors"
              >
                <span>View Online CV</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
              Education Timeline
            </p>
            <h2 className="font-serif text-3xl text-[#4C0519] mb-6">
              Academic Qualifications
            </h2>
            <div className="space-y-4">
              {educations.map((edu, idx) => {
                const topColors = ['bg-[#BE185D]', 'bg-[#F59E0B]', 'bg-[#7E22CE]'];
                return (
                  <div
                    key={edu.id}
                    className="bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className={`h-1.5 w-full ${topColors[idx % topColors.length]}`} />
                    <div className="p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <h3 className="font-serif text-lg font-semibold text-[#4C0519]">
                          {edu.degree}
                        </h3>
                        <span className="text-xs font-semibold text-[#BE185D] tabular-nums">
                          {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#271C22]">{edu.institution}</p>
                      {edu.description && (
                        <p className="text-sm text-[#6E5A64] mt-2 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Areas of Interest — Multi-Color Jewel-Toned Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <Reveal>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Academic Focus
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519] mb-3">
              Areas of Interest
            </h2>
            <p className="text-sm text-[#6E5A64] leading-relaxed">
              Core fields guiding my undergraduate study, creative expression, and preparation as an aspiring English Language Educator.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {home.areasOfInterest.map((area, idx) => {
            const Icon = interestIcons[idx % interestIcons.length];
            const palette = INTEREST_PALETTES[idx % INTEREST_PALETTES.length];
            return (
              <Reveal key={area.title} delay={idx * 0.04}>
                <div
                  className={`h-full border rounded-xl overflow-hidden transition-all shadow-xs hover:shadow-md ${palette.card}`}
                >
                  <div className={`h-1.5 w-full ${palette.bar}`} />
                  <div className="p-6">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${palette.iconBg}`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#4C0519] mb-2">
                      {area.title}
                    </h3>
                    <p className="text-sm text-[#271C22]/80 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Professional Training Preview — Vibrant Warm Saffron & Berry Band */}
      <section className="bg-gradient-to-r from-[#FEF3C7]/75 via-[#FFFBF7] to-[#FCE7F3]/80 border-y border-[#F59E0B]/25 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-2">
                Skill Development
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519]">
                Professional Training — DigiSkills.pk
              </h2>
            </div>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#BE185D] hover:text-[#4C0519] transition-colors"
            >
              <span>View full Resume &amp; Skills</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainings.map((training, idx) => {
              const isFirst = idx % 2 === 0;
              return (
                <div
                  key={training.id}
                  className="bg-white border border-[#4C0519]/12 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div
                    className={`h-2 w-full ${
                      isFirst
                        ? 'bg-gradient-to-r from-[#BE185D] to-[#E11D48]'
                        : 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C]'
                    }`}
                  />
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-4 text-xs font-semibold mb-2">
                      <span className={isFirst ? 'text-[#BE185D]' : 'text-[#B45309]'}>
                        {training.provider}
                      </span>
                      <span className="text-[#6E5A64]">{training.duration}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#4C0519] mb-3">
                      {training.title}
                    </h3>
                    <p className="text-sm text-[#271C22]/85 leading-relaxed mb-5">
                      {training.description}
                    </p>
                    <ul className="space-y-2 text-sm text-[#271C22]/80">
                      {training.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            className={`mt-1 font-bold ${
                              isFirst ? 'text-[#BE185D]' : 'text-[#F59E0B]'
                            }`}
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Selected Works
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519]">
              Featured Portfolio
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#BE185D] hover:text-[#4C0519] transition-colors"
          >
            <span>Explore all portfolio items</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredProjects.slice(0, 3).map((project, idx) => {
              const accents = ['bg-[#BE185D]', 'bg-[#F59E0B]', 'bg-[#7E22CE]'];
              return (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden hover:border-[#BE185D] hover:shadow-md transition-all flex flex-col"
                >
                  <div className={`h-1.5 w-full ${accents[idx % accents.length]}`} />
                  <div className="p-3 pb-0">
                    <MediaFrame
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fallbackTitle={project.title}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#BE185D] mb-2">
                      <span>{project.category}</span>
                      {project.projectDate && (
                        <>
                          <span aria-hidden="true" className="text-[#6E5A64]">·</span>
                          <span className="text-[#6E5A64]">
                            {formatDate(project.projectDate)}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#4C0519] mb-2 group-hover:text-[#BE185D] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#6E5A64] line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Portfolio Archive Ready for Academic & Creative Work"
            description="Authentic coursework, creative writing pieces, graphic design projects, and teaching materials published through the Admin Panel will appear here."
            actionHref="/portfolio"
            actionLabel="Open Portfolio Directory"
            secondaryHref="/admin/portfolio"
            secondaryLabel="Manage in Admin"
          />
        )}
      </section>

      {/* Academic Activities Preview — Rich Jewel Gradient Section */}
      <section className="bg-gradient-to-br from-[#FCE7F3]/85 via-[#FEF3C7]/60 to-[#EDE9FE]/70 border-y border-[#BE185D]/15 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Professional Learning
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519] mb-3">
              {home.academicActivitiesTitle}
            </h2>
            <p className="text-sm text-[#271C22]/80 leading-relaxed">
              {home.academicActivitiesText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/webinars"
              className="group bg-white border border-[#BE185D]/20 rounded-xl overflow-hidden hover:border-[#BE185D] hover:shadow-md transition-all"
            >
              <div className="h-1.5 w-full bg-[#BE185D]" />
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-medium text-[#BE185D] mb-4">
                  <span>Webinars</span>
                  <span className="tabular-nums text-[#6E5A64]">
                    {webinars.length} published
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#4C0519] mb-2 group-hover:text-[#BE185D] transition-colors">
                  Webinars &amp; Workshops
                </h3>
                <p className="text-sm text-[#6E5A64] leading-relaxed mb-4">
                  Documented webinars with structured learning reflections (What? So What? Now What?) and verified certificates.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#BE185D]">
                  <span>Explore Webinars</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href="/symposium"
              className="group bg-white border border-[#F59E0B]/30 rounded-xl overflow-hidden hover:border-[#F59E0B] hover:shadow-md transition-all"
            >
              <div className="h-1.5 w-full bg-[#F59E0B]" />
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-medium text-[#B45309] mb-4">
                  <span>Symposiums</span>
                  <span className="tabular-nums text-[#6E5A64]">
                    {symposiums.length} published
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#4C0519] mb-2 group-hover:text-[#B45309] transition-colors">
                  Symposium &amp; Presentations
                </h3>
                <p className="text-sm text-[#6E5A64] leading-relaxed mb-4">
                  Academic seminar participation, presentation slides, media galleries, and scholarly reflections.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B45309]">
                  <span>Explore Symposiums</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link
              href="/teaching-practicum"
              className="group bg-white border border-[#7E22CE]/20 rounded-xl overflow-hidden hover:border-[#7E22CE] hover:shadow-md transition-all"
            >
              <div className="h-1.5 w-full bg-[#7E22CE]" />
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-medium text-[#7E22CE] mb-4">
                  <span>Teaching Practicum</span>
                  <span className="tabular-nums text-[#6E5A64]">
                    {practicum.lessonPlans.length} lesson plans
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#4C0519] mb-2 group-hover:text-[#7E22CE] transition-colors">
                  Teaching Practicum Folio
                </h3>
                <p className="text-sm text-[#6E5A64] leading-relaxed mb-4">
                  Lesson plans, ELT methodologies under study, classroom materials, and reflective teaching notes.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7E22CE]">
                  <span>Explore Practicum</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Reflections Preview */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#BE185D] mb-2">
              Writing &amp; Inquiry
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4C0519]">
              Recent Reflections
            </h2>
          </div>
          <Link
            href="/reflections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#BE185D] hover:text-[#4C0519] transition-colors"
          >
            <span>All articles &amp; reflections</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {recentPosts.map((post, idx) => {
              const topBars = ['bg-[#BE185D]', 'bg-[#0F766E]', 'bg-[#F59E0B]'];
              return (
                <Link
                  key={post.id}
                  href={`/reflections/${post.slug}`}
                  className="group bg-white border border-[#4C0519]/12 rounded-xl overflow-hidden hover:border-[#BE185D] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-1.5 w-full ${topBars[idx % topBars.length]}`} />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#BE185D] mb-3">
                        <span>{post.category?.name || 'Academic Reflection'}</span>
                        <span aria-hidden="true" className="text-[#6E5A64]">·</span>
                        <span className="text-[#6E5A64]">
                          {post.readingTimeMinutes} min read
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-[#4C0519] mb-3 group-hover:text-[#BE185D] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#6E5A64] line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6E5A64] px-6 py-4 border-t border-[#4C0519]/10 bg-[#FFFBF7]">
                    {post.publishedAt ? formatDate(post.publishedAt) : 'Published'}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Academic Reflections & Writing Journal"
            description="Reflections on English literature, language teaching methodologies, educational technology, and personal academic growth will appear here once published."
            actionHref="/reflections"
            actionLabel="Browse Reflections"
          />
        )}
      </section>

      {/* Contact CTA — Vibrant Burgundy-to-Magenta Gradient */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-[#4C0519] via-[#7A092B] to-[#BE185D] text-[#FFFBF7] rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-[#F59E0B]/35">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-2">
              Get in Touch
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
              {home.contactCtaTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#FDE8EF]/90 leading-relaxed">
              {home.contactCtaText}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FBBF24] transition-colors whitespace-nowrap shadow-sm"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Send a Message</span>
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border border-white/40 text-white rounded-full hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              <span>View Resume</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
