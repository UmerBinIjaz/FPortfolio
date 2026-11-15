import { prisma } from '@/lib/prisma';
import { MessagesInbox } from '@/components/admin/MessagesInbox';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#172554]">Contact Messages Inbox</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Review, organize, archive, and respond to public contact form submissions.
        </p>
      </div>
      <MessagesInbox messages={messages} />
    </div>
  );
}
