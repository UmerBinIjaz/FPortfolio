'use client';

import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';

export function ResumeActions({ originalCvUrl }: { originalCvUrl?: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <a
        href="/api/resume/pdf"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#BE185D] text-white rounded-full hover:bg-[#9D174D] shadow-sm transition-colors whitespace-nowrap"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>Download CV (PDF)</span>
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border border-[#F59E0B] text-[#4C0519] rounded-full hover:bg-[#FEF3C7]/60 transition-colors whitespace-nowrap"
      >
        <Printer className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
        <span>Print CV</span>
      </button>
      {originalCvUrl && (
        <a
          href={originalCvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#4C0519] hover:text-[#BE185D] transition-colors whitespace-nowrap"
        >
          <FileText className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
          <span>View Original PDF</span>
        </a>
      )}
    </div>
  );
}
