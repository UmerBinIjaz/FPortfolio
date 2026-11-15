import Link from 'next/link';
import { MessageStatus, PublicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    publishedProjects,
    totalProjects,
    publishedWebinars,
    totalWebinars,
    publishedSymposiums,
    totalSymposiums,
    publishedLessonPlans,
    totalLessonPlans,
    totalCertificates,
    publishedPosts,
    totalPosts,
    unreadMessages,
    totalMessages,
    recentActivities,
    recentMessages,
  ] = await Promise.all([
    prisma.portfolioProject.count({ where: { status: PublicationStatus.PUBLISHED, deletedAt: null } }),
    prisma.portfolioProject.count({ where: { deletedAt: null } }),
    prisma.webinar.count({ where: { status: PublicationStatus.PUBLISHED, deletedAt: null } }),
    prisma.webinar.count({ where: { deletedAt: null } }),
    prisma.symposium.count({ where: { status: PublicationStatus.PUBLISHED, deletedAt: null } }),
    prisma.symposium.count({ where: { deletedAt: null } }),
    prisma.teachingLessonPlan.count({ where: { status: PublicationStatus.PUBLISHED, deletedAt: null } }),
    prisma.teachingLessonPlan.count({ where: { deletedAt: null } }),
    prisma.certificate.count(),
    prisma.blogPost.count({ where: { status: PublicationStatus.PUBLISHED, deletedAt: null } }),
    prisma.blogPost.count({ where: { deletedAt: null } }),
    prisma.contactMessage.count({ where: { status: MessageStatus.UNREAD } }),
    prisma.contactMessage.count(),
    prisma.contentActivity.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const totalPublishedContent =
    publishedProjects +
    publishedWebinars +
    publishedSymposiums +
    publishedLessonPlans +
    publishedPosts;

  const stats = [
    { label: 'Published Items', value: totalPublishedContent, sub: 'Across dynamic modules', href: '/admin/home' },
    { label: 'Portfolio Projects', value: totalProjects, sub: `${publishedProjects} published`, href: '/admin/portfolio' },
    { label: 'Webinars', value: totalWebinars, sub: `${publishedWebinars} published`, href: '/admin/webinars' },
    { label: 'Symposiums', value: totalSymposiums, sub: `${publishedSymposiums} published`, href: '/admin/symposium' },
    { label: 'Lesson Plans', value: totalLessonPlans, sub: `${publishedLessonPlans} published`, href: '/admin/teaching-practicum' },
    { label: 'Certificates', value: totalCertificates, sub: 'Uploaded credentials', href: '/admin/achievements' },
    { label: 'Reflections / Blog', value: totalPosts, sub: `${publishedPosts} published`, href: '/admin/reflections' },
    { label: 'Unread Messages', value: unreadMessages, sub: `${totalMessages} total inquiries`, href: '/admin/messages' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Dashboard Overview</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Live content statistics and recent activity from Neon PostgreSQL.
        </p>
      </div>

      {/* Real Database Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-[#172554]/10 rounded-lg p-5 hover:border-[#C5A46D] transition-colors"
          >
            <p className="text-xs text-[#64748B] mb-1">{stat.label}</p>
            <p className="font-serif text-3xl text-[#172554] tabular-nums">{stat.value}</p>
            <p className="text-xs text-[#64748B] mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
        <h2 className="font-serif text-xl text-[#172554] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2 text-xs font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170]"
          >
            Add Portfolio Project
          </Link>
          <Link
            href="/admin/webinars"
            className="px-4 py-2 text-xs font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50"
          >
            Record Webinar
          </Link>
          <Link
            href="/admin/teaching-practicum"
            className="px-4 py-2 text-xs font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50"
          >
            Create Lesson Plan
          </Link>
          <Link
            href="/admin/reflections"
            className="px-4 py-2 text-xs font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50"
          >
            Write Reflection
          </Link>
          <Link
            href="/admin/media"
            className="px-4 py-2 text-xs font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50"
          >
            Open Media Library
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content Activity */}
        <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl text-[#172554] mb-4">Recent Content Activity</h2>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-[#64748B]">No recent edits logged yet.</p>
          ) : (
            <div className="divide-y divide-[#172554]/10">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#172554] truncate">{act.entityTitle}</p>
                    <p className="text-xs text-[#64748B]">
                      {act.entityType} · {act.action}
                    </p>
                  </div>
                  <span className="text-xs text-[#64748B] shrink-0 tabular-nums">
                    {formatDate(act.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white border border-[#172554]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[#172554]">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs font-medium text-[#172554] hover:text-[#C5A46D]">
              View Inbox →
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-[#64748B]">No contact messages received yet.</p>
          ) : (
            <div className="divide-y divide-[#172554]/10">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#172554] truncate">
                      {msg.fullName} — {msg.subject}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">
                      {msg.status} · {msg.email}
                    </p>
                  </div>
                  <span className="text-xs text-[#64748B] shrink-0 tabular-nums">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
