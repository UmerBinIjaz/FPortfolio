'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C0519]/40 backdrop-blur-[1px] p-4"
    >
      <div className="bg-white border border-[#4C0519]/15 rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                destructive ? 'bg-rose-50 text-rose-700' : 'bg-[#FCE7F3] text-[#4C0519]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 id="confirm-dialog-title" className="font-serif text-xl text-[#4C0519]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close dialog"
            className="text-[#6E5A64] hover:text-[#4C0519] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#6E5A64] leading-relaxed mb-6">{description}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#271C22] border border-[#4C0519]/20 rounded-md hover:bg-[#FFFBF7] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 whitespace-nowrap ${
              destructive
                ? 'bg-rose-700 hover:bg-rose-800'
                : 'bg-[#BE185D] hover:bg-[#9D174D]'
            }`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
