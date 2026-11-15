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
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-[#FFFBF7]">
      <div className="max-w-lg w-full bg-white border border-[#4C0519]/15 rounded-lg p-10 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#BE185D] mb-3">
          Unexpected Error
        </p>
        <h1 className="font-serif text-3xl text-[#4C0519] mb-4">
          Unable to load this section
        </h1>
        <p className="text-sm text-[#6E5A64] mb-8 leading-relaxed">
          {error.message || 'A temporary error occurred while retrieving this page.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium border border-[#4C0519]/20 text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
