import { PublicationStatus } from '@prisma/client';
import { prisma, safeDbQuery } from './prisma';
import {
  AUTHENTIC_FALLBACK_BLOG_CATEGORIES,
  AUTHENTIC_FALLBACK_EDUCATION,
  AUTHENTIC_FALLBACK_HOME,
  AUTHENTIC_FALLBACK_PROFILE,
  AUTHENTIC_FALLBACK_SETTINGS,
  AUTHENTIC_FALLBACK_SKILLS,
  AUTHENTIC_FALLBACK_TRAINING,
  AreaOfInterestItem,
} from './fallback-data';

export async function getSiteSettings() {
  return safeDbQuery(async () => {
    const row = await prisma.siteSettings.findFirst();
    return row ?? AUTHENTIC_FALLBACK_SETTINGS;
  }, AUTHENTIC_FALLBACK_SETTINGS);
}

export async function getProfile() {
  return safeDbQuery(async () => {
    const row = await prisma.profile.findFirst();
    return row ?? AUTHENTIC_FALLBACK_PROFILE;
  }, AUTHENTIC_FALLBACK_PROFILE);
}

export async function getHomeContent() {
  return safeDbQuery(async () => {
    const row = await prisma.homeContent.findFirst();
    if (!row) return AUTHENTIC_FALLBACK_HOME;
    const areas = Array.isArray(row.areasOfInterest)
      ? (row.areasOfInterest as unknown as AreaOfInterestItem[])
      : AUTHENTIC_FALLBACK_HOME.areasOfInterest;
    return {
      ...row,
      areasOfInterest: areas,
    };
  }, AUTHENTIC_FALLBACK_HOME);
}

export async function getPublishedEducation() {
  return safeDbQuery(async () => {
    const rows = await prisma.education.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.length > 0 ? rows : AUTHENTIC_FALLBACK_EDUCATION;
  }, AUTHENTIC_FALLBACK_EDUCATION);
}

export async function getPublishedSkills() {
  return safeDbQuery(async () => {
    const rows = await prisma.skill.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.length > 0 ? rows : AUTHENTIC_FALLBACK_SKILLS;
  }, AUTHENTIC_FALLBACK_SKILLS);
}

export async function getPublishedTrainings() {
  return safeDbQuery(async () => {
    const rows = await prisma.training.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.length > 0 ? rows : AUTHENTIC_FALLBACK_TRAINING;
  }, AUTHENTIC_FALLBACK_TRAINING);
}

export async function getPublishedPortfolioProjects(options?: { featuredOnly?: boolean }) {
  return safeDbQuery(async () => {
    return prisma.portfolioProject.findMany({
      where: {
        status: PublicationStatus.PUBLISHED,
        deletedAt: null,
        ...(options?.featuredOnly ? { featured: true } : {}),
      },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }, []);
}

export async function getPortfolioProjectBySlug(slug: string) {
  return safeDbQuery(async () => {
    return prisma.portfolioProject.findFirst({
      where: {
        slug,
        status: PublicationStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }, null);
}

export async function getPublishedWebinars() {
  return safeDbQuery(async () => {
    return prisma.webinar.findMany({
      where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { reflection: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { eventDate: 'desc' }],
    });
  }, []);
}

export async function getWebinarBySlug(slug: string) {
  return safeDbQuery(async () => {
    return prisma.webinar.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { reflection: true },
    });
  }, null);
}

export async function getPublishedSymposiums() {
  return safeDbQuery(async () => {
    return prisma.symposium.findMany({
      where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { eventDate: 'desc' }],
    });
  }, []);
}

export async function getSymposiumBySlug(slug: string) {
  return safeDbQuery(async () => {
    return prisma.symposium.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
    });
  }, null);
}

export async function getPublishedPracticumData() {
  return safeDbQuery(
    async () => {
      const [lessonPlans, demonstrations, resources, reflections] = await Promise.all([
        prisma.teachingLessonPlan.findMany({
          where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
        prisma.teachingDemonstration.findMany({
          where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
        prisma.teachingResource.findMany({
          where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
        prisma.teachingReflection.findMany({
          where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
      ]);
      return { lessonPlans, demonstrations, resources, reflections };
    },
    { lessonPlans: [], demonstrations: [], resources: [], reflections: [] }
  );
}

export async function getPublishedAchievements() {
  return safeDbQuery(async () => {
    return prisma.achievement.findMany({
      where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: {
        certificates: {
          where: { status: PublicationStatus.PUBLISHED },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { issueDate: 'desc' }],
    });
  }, []);
}

export async function getBlogCategories() {
  return safeDbQuery(async () => {
    const rows = await prisma.blogCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.length > 0 ? rows : AUTHENTIC_FALLBACK_BLOG_CATEGORIES;
  }, AUTHENTIC_FALLBACK_BLOG_CATEGORIES);
}

export async function getPublishedBlogPosts(options?: { limit?: number }) {
  return safeDbQuery(async () => {
    return prisma.blogPost.findMany({
      where: { status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { category: true },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      ...(options?.limit ? { take: options.limit } : {}),
    });
  }, []);
}

export async function getBlogPostBySlug(slug: string) {
  return safeDbQuery(async () => {
    return prisma.blogPost.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED, deletedAt: null },
      include: { category: true },
    });
  }, null);
}
