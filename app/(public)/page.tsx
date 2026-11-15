import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Download,
  GraduationCap,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  PenTool,
  Presentation,
  Sparkles,
} from 'lucide-react';
import {
  getHomeContent,
  getProfile,
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
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    home,
    profile,
    educations,
    trainings,
    featuredProjects,
    webinars,
    symposiums,
    practicum,
    recentPosts,
  ] = await Promise.all([
    getHomeContent(),
    getProfile(),
    getPublishedEducation(),
    getPublishedTrainings(),
    getPublishedPortfolioProjects({ featuredOnly: true }),
    getPublishedWebinars(),
    getPublishedSymposiums(),
    getPublishedPracticumData(),
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

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-14 md:pt-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#C5A46D] tracking-wide mb-3">
              {home.heroTitle}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] font-semibold text-[#172554] mb-4">
              {home.heroHeadline}
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#172554]/85 mb-5">
              &ldquo;{home.heroTagline}&rdquo;
            </p>
            <p className="text-base text-[#252525]/85 leading-relaxed max-w-2xl mb-8">
              {home.heroIntro}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors whitespace-nowrap"
              >
                <span>Explore My Portfolio</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="/api/resume/pdf"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-white border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download My CV</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Contact Me</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            {profile.profileImageUrl ? (
              <div className="w-full rounded-lg overflow-hidden border border-[#172554]/12 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full min-h-[320px] object-cover"
                />
              </div>
            ) : (
              <div className="w-full rounded-lg border border-[#172554]/12 bg-gradient-to-br from-[#172554] via-[#1e3170] to-[#172554] text-[#FAF9F6] p-8 sm:p-10 flex flex-col justify-between min-h-[320px]">
                <div className="flex items-center justify-between text-xs text-[#C5A46D] tracking-wider uppercase">
                  <span>Academic Folio</span>
                  <span>Air University</span>
                </div>
                <div className="my-8">
                  <div className="w-16 h-16 rounded-full border border-[#C5A46D]/60 flex items-center justify-center font-serif text-2xl text-[#C5A46D] mb-6">
                    F
                  </div>
                  <p className="font-serif text-2xl sm:text-3xl text-white leading-snug">
                    {profile.fullName}
                  </p>
                  <p className="text-sm text-slate-300 mt-2">{profile.location}</p>
                </div>
                <div className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <span>BS English (2023–Present)</span>
                  <span aria-hidden="true">·</span>
                  <span>DigiSkills.pk Alumni</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Academic & Professional Highlights Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#172554]/10 border border-[#172554]/10 rounded-lg overflow-hidden">
          <div className="bg-white p-5">
            <p className="text-xs text-[#64748B] mb-1">Academic Degree</p>
            <p className="font-serif text-base font-medium text-[#172554]">
              Bachelor of English – Air University
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs text-[#64748B] mb-1">Professional Training</p>
            <p className="font-serif text-base font-medium text-[#172554]">
              Digital Marketing – DigiSkills.pk
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs text-[#64748B] mb-1">Creative Training</p>
            <p className="font-serif text-base font-medium text-[#172554]">
              Graphic Design – DigiSkills.pk
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs text-[#64748B] mb-1">Languages</p>
            <p className="font-serif text-base font-medium text-[#172554]">
              {profile.languages.join(', ')}
            </p>
          </div>
        </div>
      </section>

      {/* About Preview & Education Timeline */}
      <section className="bg-[#EDE9FE]/55 border-y border-[#172554]/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              About Me
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-4">
              {home.aboutPreviewTitle}
            </h2>
            <p className="text-base text-[#252525]/85 leading-relaxed mb-5">
              {home.aboutPreviewText}
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed mb-7">
              {profile.summary}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors"
            >
              <span>Read full biography &amp; teaching philosophy</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Education Timeline
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-6">
              Academic Qualifications
            </h2>
            <div className="space-y-5">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white border border-[#172554]/10 rounded-lg p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg font-medium text-[#172554]">
                      {edu.degree}
                    </h3>
                    <span className="text-xs font-medium text-[#C5A46D] tabular-nums">
                      {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear || ''}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#252525]">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Areas of Interest */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <Reveal>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Academic Focus
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-3">
              Areas of Interest
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Core fields guiding my undergraduate study, creative expression, and preparation as an aspiring English Language Educator.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {home.areasOfInterest.map((area, idx) => {
            const Icon = interestIcons[idx % interestIcons.length];
            return (
              <Reveal key={area.title} delay={idx * 0.04}>
                <div className="h-full bg-white border border-[#172554]/10 rounded-lg p-6 hover:border-[#C5A46D]/60 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-[#EDE9FE] text-[#172554] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#172554] mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Professional Training Preview */}
      <section className="bg-white border-y border-[#172554]/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
                Skill Development
              </p>
              <h2 className="font-serif text-3xl text-[#172554]">
                Professional Training — DigiSkills.pk
              </h2>
            </div>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors"
            >
              <span>View full Resume &amp; Skills</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainings.map((training) => (
              <div
                key={training.id}
                className="bg-[#FAF9F6] border border-[#172554]/10 rounded-lg p-7"
              >
                <div className="flex items-center justify-between gap-4 text-xs text-[#64748B] mb-2">
                  <span>{training.provider}</span>
                  <span>{training.duration}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#172554] mb-3">
                  {training.title}
                </h3>
                <p className="text-sm text-[#252525]/85 leading-relaxed mb-5">
                  {training.description}
                </p>
                <ul className="space-y-2 text-sm text-[#64748B]">
                  {training.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-[#C5A46D] mt-1" aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Selected Works
            </p>
            <h2 className="font-serif text-3xl text-[#172554]">Featured Portfolio</h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors"
          >
            <span>Explore all portfolio items</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredProjects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group bg-white border border-[#172554]/10 rounded-lg overflow-hidden hover:border-[#C5A46D] transition-colors flex flex-col"
              >
                <div className="p-3 pb-0">
                  <MediaFrame
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fallbackTitle={project.title}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                    <span>{project.category}</span>
                    {project.projectDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(project.projectDate)}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
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

      {/* Academic Activities Preview */}
      <section className="bg-[#EDE9FE]/55 border-y border-[#172554]/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Professional Learning
            </p>
            <h2 className="font-serif text-3xl text-[#172554] mb-3">
              {home.academicActivitiesTitle}
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {home.academicActivitiesText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/webinars"
              className="group bg-white border border-[#172554]/10 rounded-lg p-6 hover:border-[#C5A46D] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-4">
                <span>Webinars</span>
                <span className="tabular-nums">{webinars.length} published</span>
              </div>
              <h3 className="font-serif text-xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                Webinars &amp; Workshops
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Documented webinars with structured learning reflections (What? So What? Now What?) and verified certificates.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172554]">
                <span>Explore Webinars</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/symposium"
              className="group bg-white border border-[#172554]/10 rounded-lg p-6 hover:border-[#C5A46D] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-4">
                <span>Symposiums</span>
                <span className="tabular-nums">{symposiums.length} published</span>
              </div>
              <h3 className="font-serif text-xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                Symposium &amp; Presentations
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Academic seminar participation, presentation slides, media galleries, and scholarly reflections.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172554]">
                <span>Explore Symposiums</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/teaching-practicum"
              className="group bg-white border border-[#172554]/10 rounded-lg p-6 hover:border-[#C5A46D] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-4">
                <span>Teaching Practicum</span>
                <span className="tabular-nums">
                  {practicum.lessonPlans.length} lesson plans
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#172554] mb-2 group-hover:text-[#C5A46D] transition-colors">
                Teaching Practicum Folio
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Lesson plans, ELT methodologies under study, classroom materials, and reflective teaching notes.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172554]">
                <span>Explore Practicum</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reflections Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Writing &amp; Inquiry
            </p>
            <h2 className="font-serif text-3xl text-[#172554]">Recent Reflections</h2>
          </div>
          <Link
            href="/reflections"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors"
          >
            <span>All articles &amp; reflections</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/reflections/${post.slug}`}
                className="group bg-white border border-[#172554]/10 rounded-lg p-6 hover:border-[#C5A46D] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
                    <span>{post.category?.name || 'Academic Reflection'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#172554] mb-3 group-hover:text-[#C5A46D] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <p className="text-xs text-[#64748B] mt-5 pt-4 border-t border-[#172554]/10">
                  {post.publishedAt ? formatDate(post.publishedAt) : 'Published'}
                </p>
              </Link>
            ))}
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

      {/* Contact CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#172554] text-[#FAF9F6] rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C5A46D] mb-2">
              Get in Touch
            </p>
            <h2 className="font-serif text-3xl text-white mb-3">
              {home.contactCtaTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {home.contactCtaText}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#C5A46D] text-[#172554] rounded-md hover:bg-[#d3b684] transition-colors whitespace-nowrap"
            >
              <Presentation className="w-4 h-4" aria-hidden="true" />
              <span>Send a Message</span>
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-white/25 text-white rounded-md hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <span>View Resume</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
