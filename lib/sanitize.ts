const ALLOWED_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'br',
  'hr',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'code',
  'pre',
  'span',
]);

export function isValidSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // Remove script, style, iframe, object, embed, form, svg blocks completely
  let cleaned = dirty
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*\/?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Filter tags and attributes
  cleaned = cleaned.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (fullMatch, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }
    if (fullMatch.startsWith('</')) {
      return `</${tag}>`;
    }

    if (tag === 'br' || tag === 'hr') {
      return `<${tag} />`;
    }

    if (tag === 'a') {
      const hrefMatch = rawAttrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch ? (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '').trim() : '';
      if (!isValidSafeUrl(href)) {
        return '<a>';
      }
      const escapedHref = href.replace(/"/g, '&quot;');
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      return isExternal
        ? `<a href="${escapedHref}" target="_blank" rel="noopener noreferrer">`
        : `<a href="${escapedHref}">`;
    }

    if (tag === 'img') {
      const srcMatch = rawAttrs.match(/src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const altMatch = rawAttrs.match(/alt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const src = srcMatch ? (srcMatch[1] ?? srcMatch[2] ?? srcMatch[3] ?? '').trim() : '';
      if (!isValidSafeUrl(src)) {
        return '';
      }
      const escapedSrc = src.replace(/"/g, '&quot;');
      const escapedAlt = (altMatch ? (altMatch[1] ?? altMatch[2] ?? '') : '').replace(/"/g, '&quot;');
      return `<img src="${escapedSrc}" alt="${escapedAlt}" loading="lazy" referrerpolicy="no-referrer" />`;
    }

    return `<${tag}>`;
  });

  return cleaned.trim();
}
