import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
}: EmptyStateProps) {
  return (
    <div className="bg-gradient-to-br from-white via-[#FCE7F3]/40 to-[#FEF3C7]/45 border border-[#BE185D]/20 rounded-2xl overflow-hidden max-w-2xl mx-auto shadow-xs">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#BE185D] via-[#F59E0B] to-[#7E22CE]" />
      <div className="p-10 md:p-14 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FCE7F3] to-[#FEF3C7] text-[#BE185D] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <BookOpen className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-2xl text-[#4C0519] mb-3">{title}</h3>
        <p className="text-sm text-[#271C22]/75 leading-relaxed max-w-lg mx-auto mb-6">
          {description}
        </p>
        {(actionHref || secondaryHref) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actionHref && actionLabel && (
              <Link
                href={actionHref}
                className="px-5 py-2.5 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] transition-colors whitespace-nowrap shadow-xs"
              >
                {actionLabel}
              </Link>
            )}
            {secondaryHref && secondaryLabel && (
              <Link
                href={secondaryHref}
                className="px-5 py-2.5 text-sm font-semibold bg-white border border-[#4C0519]/20 text-[#4C0519] rounded-full hover:bg-[#FCE7F3]/60 transition-colors whitespace-nowrap"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
