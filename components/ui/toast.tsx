'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (params: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (params: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const variant = params.variant ?? 'info';
      setItems((prev) => [...prev, { id, title: params.title, description: params.description, variant }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto bg-white border border-[#172554]/15 rounded-lg shadow-lg p-4 flex items-start gap-3 text-sm"
          >
            {item.variant === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            {item.variant === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            {item.variant === 'info' && (
              <Info className="w-5 h-5 text-[#172554] shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#172554]">{item.title}</p>
              {item.description && (
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="text-[#64748B] hover:text-[#172554] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
