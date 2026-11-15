'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';
import { useToast } from '@/components/ui/toast';

interface AdminShellProps {
  admin: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({ title: 'Signed out', description: 'Your session has been closed.', variant: 'info' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast({ title: 'Sign out failed', variant: 'error' });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#4C0519] text-[#FFFBF7] shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="font-serif text-xl font-semibold text-white">
            Faryal Admin
          </Link>
          <p className="text-xs text-[#F59E0B] mt-0.5 truncate">{admin.email}</p>
        </div>

        <nav aria-label="Admin Navigation" className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3.5 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-[#BE185D] text-white font-medium'
                    : 'text-[#FDE8EF]/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-[#FDE8EF]/85 hover:text-[#F59E0B] rounded-md hover:bg-white/10 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-rose-200 hover:text-white rounded-md hover:bg-rose-900/40 transition-colors disabled:opacity-50"
          >
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-[#4C0519]/10 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle admin menu"
              className="lg:hidden p-2 rounded-md border border-[#4C0519]/15 text-[#4C0519]"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-medium text-[#4C0519]">
              {ADMIN_NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Administration'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6E5A64]">
            <span className="hidden sm:inline">
              {admin.name} · {admin.role}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#4C0519]/15 rounded-md text-[#4C0519] hover:bg-[#FCE7F3]/50 transition-colors whitespace-nowrap"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {mobileNavOpen && (
          <div className="lg:hidden bg-[#4C0519] text-white p-4 space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`block px-3.5 py-2 rounded-md text-sm ${
                  pathname === item.href ? 'bg-[#BE185D] text-white font-medium' : 'text-[#FDE8EF]/85'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3.5 py-2 text-sm text-rose-200"
            >
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
