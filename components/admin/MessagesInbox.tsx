'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageStatus } from '@prisma/client';
import { Archive, Check, MailOpen, Search, Trash2 } from 'lucide-react';
import { deleteMessageAction, updateMessageStatusAction } from '@/actions/messages';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatDate } from '@/lib/utils';

export interface AdminMessageRow {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  adminNotes: string | null;
  createdAt: Date | string;
}

export function MessagesInbox({ messages }: { messages: AdminMessageRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MessageStatus>('ALL');
  const [selected, setSelected] = useState<AdminMessageRow | null>(messages[0] ?? null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMessageRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
      const matchQ =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q);
      return matchStatus && matchQ;
    });
  }, [messages, search, statusFilter]);

  const changeStatus = async (msg: AdminMessageRow, status: MessageStatus) => {
    const res = await updateMessageStatusAction(msg.id, { status, adminNotes: msg.adminNotes });
    if (!res.success) {
      toast({ title: 'Update failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: `Message marked ${status.toLowerCase()}`, variant: 'success' });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteMessageAction(deleteTarget.id);
    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
    if (!res.success) {
      toast({ title: 'Delete failed', description: res.error, variant: 'error' });
      return;
    }
    toast({ title: 'Message deleted', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, email, or subject..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#172554]/15 rounded-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['ALL', MessageStatus.UNREAD, MessageStatus.READ, MessageStatus.ARCHIVED] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  statusFilter === st
                    ? 'bg-[#172554] text-white'
                    : 'bg-white border border-[#172554]/15 text-[#252525]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-[#172554]/10 rounded-lg divide-y divide-[#172554]/10 max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-8 text-sm text-center text-[#64748B]">No messages found.</p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className={`w-full text-left p-4 hover:bg-[#EDE9FE]/40 transition-colors ${
                  selected?.id === m.id ? 'bg-[#EDE9FE]/60' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] mb-1">
                  <span className={m.status === MessageStatus.UNREAD ? 'text-[#172554] font-semibold' : ''}>
                    {m.status}
                  </span>
                  <span className="tabular-nums">{formatDate(m.createdAt)}</span>
                </div>
                <p className="font-medium text-sm text-[#172554] truncate">{m.subject}</p>
                <p className="text-xs text-[#64748B] truncate">
                  {m.fullName} ({m.email})
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-7 bg-white border border-[#172554]/10 rounded-lg p-6">
          {!selected ? (
            <p className="text-sm text-[#64748B]">Select a message to read details.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#172554]/10">
                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    From {selected.fullName} · {selected.email} · {formatDate(selected.createdAt)}
                  </p>
                  <h2 className="font-serif text-2xl text-[#172554]">{selected.subject}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        selected,
                        selected.status === MessageStatus.READ
                          ? MessageStatus.UNREAD
                          : MessageStatus.READ
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-[#172554]/15 rounded-md"
                  >
                    {selected.status === MessageStatus.READ ? (
                      <>
                        <MailOpen className="w-3.5 h-3.5" />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(selected, MessageStatus.ARCHIVED)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-[#172554]/15 rounded-md"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-rose-200 text-rose-700 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="text-sm text-[#252525]/90 leading-relaxed whitespace-pre-line">
                {selected.message}
              </div>

              <div className="pt-4 border-t border-[#172554]/10">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-block px-4 py-2 text-xs font-medium bg-[#172554] text-white rounded-md"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Message"
        description={`Permanently delete the message from "${deleteTarget?.fullName}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
