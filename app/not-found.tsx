import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-20 bg-[#FFFBF7]">
      <div className="max-w-lg w-full text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#BE185D] mb-3">
          404 · Page Not Found
        </p>
        <h1 className="font-serif text-4xl text-[#4C0519] mb-4">
          This page could not be found
        </h1>
        <p className="text-sm text-[#6E5A64] mb-8 leading-relaxed">
          The academic record or page you requested may have been moved, unpublished, or does not exist.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium bg-[#BE185D] text-white rounded-md hover:bg-[#9D174D] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/portfolio"
            className="px-5 py-2.5 text-sm font-medium border border-[#4C0519]/20 text-[#4C0519] rounded-md hover:bg-[#FCE7F3]/50 transition-colors"
          >
            Explore Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
