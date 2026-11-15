'use client';

import React, { useRef, useState } from 'react';
import { ExternalLink, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
  accept?: string;
  category?: string;
  folder?: string;
  hint?: string;
}

export function FileUploadField({
  label,
  value,
  onChange,
  accept = 'image/*,.pdf,.doc,.docx,.ppt,.pptx,.mp4,.webm',
  category = 'General',
  folder = 'faryal-portfolio',
  hint,
}: FileUploadFieldProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('category', category);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        toast({
          title: 'Upload failed',
          description: json.error || 'Could not upload file.',
          variant: 'error',
        });
        return;
      }

      onChange(json.asset.url, json.asset.publicId);
      toast({
        title: 'File uploaded',
        description: `${file.name} saved to Cloudinary & Media Library.`,
        variant: 'success',
      });
    } catch {
      toast({ title: 'Upload error', description: 'Network error during upload.', variant: 'error' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#4C0519]">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/... or upload a file"
          className="flex-1 px-3 py-2 text-sm bg-[#FFFBF7] border border-[#4C0519]/15 rounded-md focus:border-[#F59E0B] focus:outline-none"
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#FCE7F3] text-[#4C0519] border border-[#4C0519]/15 rounded-md hover:bg-[#FCE7F3]/80 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5 text-[#BE185D]" aria-hidden="true" />
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            aria-label="Clear file URL"
            className="inline-flex items-center justify-center px-2.5 py-2 text-xs border border-[#4C0519]/15 rounded-md text-[#6E5A64] hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-[#6E5A64]">{hint}</p>}
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#BE185D] hover:text-[#4C0519]"
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          <span>Open current file</span>
        </a>
      )}
    </div>
  );
}
