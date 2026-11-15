'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.error || 'Sign in failed.';
        setError(msg);
        toast({ title: 'Authentication failed', description: msg, variant: 'error' });
        return;
      }

      toast({ title: 'Welcome back', description: 'Signed in to Admin Panel.', variant: 'success' });
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Network error while signing in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#4C0519]/12 rounded-lg p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-[#4C0519] text-[#F59E0B] flex items-center justify-center">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#BE185D]">
              Protected Portal
            </p>
            <h1 className="font-serif text-2xl text-[#4C0519]">Administrator Sign In</h1>
          </div>
        </div>

        <p className="text-xs text-[#6E5A64] leading-relaxed mb-6">
          Sign in with the administrator credentials configured via environment variables and seeded into Neon PostgreSQL (<code className="text-[#4C0519]">npm run db:seed</code>).
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-[#4C0519] mb-1.5">
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="faryalgull042@hotmail.com"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md focus:border-[#F59E0B] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-[#4C0519] mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md focus:border-[#F59E0B] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#4C0519]/10 text-center">
          <Link href="/" className="text-xs text-[#6E5A64] hover:text-[#BE185D]">
            ← Return to Public E-Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
