'use client';

import React from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function ShareArticleBar({ title }: { title: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: 'Link copied', description: 'Article URL copied to clipboard.', variant: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Please copy the URL from your browser.', variant: 'error' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await handleCopy();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white border border-[#172554]/15 rounded-md text-[#172554] hover:bg-[#EDE9FE]/50 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy Link'}</span>
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
