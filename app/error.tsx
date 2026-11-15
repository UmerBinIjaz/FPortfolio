'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-[#FAF9F6]">
      <div className="max-w-lg w-full bg-white border border-[#172554]/15 rounded-lg p-10 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#C5A46D] mb-3">
          Unexpected Error
        </p>
        <h1 className="font-serif text-3xl text-[#172554] mb-4">
          Unable to load this section
        </h1>
        <p className="text-sm text-[#64748B] mb-8 leading-relaxed">
          {error.message || 'A temporary error occurred while retrieving this page.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
