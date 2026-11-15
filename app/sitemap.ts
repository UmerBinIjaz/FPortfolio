import type { MetadataRoute } from 'next';
import {
  getPublishedBlogPosts,
  getPublishedPortfolioProjects,
  getPublishedSymposiums,
  getPublishedWebinars,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    'http://localhost:3000';

  const staticRoutes = [
    '',
    '/about',
    '/portfolio',
    '/webinars',
    '/symposium',
    '/teaching-practicum',
    '/resume',
    '/achievements',
    '/reflections',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const [projects, webinars, symposiums, posts] = await Promise.all([
    getPublishedPortfolioProjects(),
    getPublishedWebinars(),
    getPublishedSymposiums(),
    getPublishedBlogPosts(),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...projects.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...webinars.map((w) => ({
      url: `${baseUrl}/webinars/${w.slug}`,
      lastModified: w.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...symposiums.map((s) => ({
      url: `${baseUrl}/symposium/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((b) => ({
      url: `${baseUrl}/reflections/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
