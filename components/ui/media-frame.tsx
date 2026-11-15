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
        className={`${aspectClass} w-full rounded-md bg-gradient-to-br from-[#EDE9FE] via-[#FAF9F6] to-[#EDE9FE]/60 border border-[#172554]/10 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <BookOpen className="w-6 h-6 text-[#172554]/60 mb-2" aria-hidden="true" />
        <p className="font-serif text-sm text-[#172554]/80 line-clamp-2">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden rounded-md bg-[#EDE9FE]/40 border border-[#172554]/10 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}
