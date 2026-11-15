'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const updated = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div className="border border-[#172554]/15 rounded-md overflow-hidden bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#FAF9F6] border-b border-[#172554]/10">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => wrapSelection('<h2>', '</h2>\n', 'Section Heading')}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<h3>', '</h3>\n', 'Subheading')}
            title="Heading 3"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<strong>', '</strong>', 'bold text')}
            title="Bold"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<em>', '</em>', 'italic text')}
            title="Italic"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<ul>\n  <li>', '</li>\n</ul>\n', 'List item')}
            title="Bulleted List"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<ol>\n  <li>', '</li>\n</ol>\n', 'Numbered item')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<blockquote>', '</blockquote>\n', 'Quoted reflection')}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<a href="https://">', '</a>', 'link text')}
            title="Insert Link"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              wrapSelection('<img src="https://', '" alt="Article figure" />\n', '')
            }
            title="Insert Image URL"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('<p>', '</p>\n', 'Paragraph text')}
            title="Paragraph"
            className="p-1.5 rounded hover:bg-[#EDE9FE] text-[#172554]"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPreviewMode((v) => !v)}
          className="px-2.5 py-1 text-xs font-medium text-[#172554] bg-white border border-[#172554]/15 rounded hover:bg-[#EDE9FE]/50"
        >
          {previewMode ? 'Edit HTML' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        <div
          className="prose prose-slate max-w-none p-5 min-h-[240px]"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Write your academic reflection here...</p>"
          className="w-full p-4 text-sm font-mono text-[#252525] focus:outline-none resize-y"
        />
      )}
    </div>
  );
}
