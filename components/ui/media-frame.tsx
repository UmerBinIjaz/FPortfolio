'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface MediaFrameProps {
  src?: string | null;
  alt: string;
  fallbackTitle?: string;
  aspectClass?: string;
  className?: string;
}

export function MediaFrame({
  src,
  alt,
  fallbackTitle,
  aspectClass = 'aspect-[4/3]',
  className = '',
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${aspectClass} w-full rounded-lg bg-gradient-to-br from-[#FCE7F3] via-[#FEF3C7]/70 to-[#EDE9FE] border border-[#BE185D]/15 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-white/85 text-[#BE185D] flex items-center justify-center shadow-xs mb-2.5">
          <BookOpen className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="font-serif text-sm font-medium text-[#4C0519] line-clamp-2">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden rounded-lg bg-[#FCE7F3]/50 border border-[#BE185D]/15 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}
