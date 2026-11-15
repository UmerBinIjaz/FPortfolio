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
    <div className="bg-white border border-[#172554]/12 rounded-lg p-10 md:p-14 text-center max-w-2xl mx-auto">
      <div className="w-12 h-12 rounded-md bg-[#EDE9FE] text-[#172554] flex items-center justify-center mx-auto mb-5">
        <BookOpen className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-2xl text-[#172554] mb-3">{title}</h3>
      <p className="text-sm text-[#64748B] leading-relaxed max-w-lg mx-auto mb-6">
        {description}
      </p>
      {(actionHref || secondaryHref) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="px-5 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors whitespace-nowrap"
            >
              {actionLabel}
            </Link>
          )}
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="px-5 py-2.5 text-sm font-medium border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50 transition-colors whitespace-nowrap"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
