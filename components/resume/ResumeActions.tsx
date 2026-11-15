'use client';

import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';

export function ResumeActions({ originalCvUrl }: { originalCvUrl?: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <a
        href="/api/resume/pdf"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors whitespace-nowrap"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>Download CV (PDF)</span>
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white border border-[#172554]/20 text-[#172554] rounded-md hover:bg-[#EDE9FE]/50 transition-colors whitespace-nowrap"
      >
        <Printer className="w-4 h-4" aria-hidden="true" />
        <span>Print CV</span>
      </button>
      {originalCvUrl && (
        <a
          href={originalCvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#172554] hover:text-[#C5A46D] transition-colors whitespace-nowrap"
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>View Original PDF</span>
        </a>
      )}
    </div>
  );
}
