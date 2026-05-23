const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'EM',
  'H2',
  'H3',
  'HR',
  'IMG',
  'LI',
  'OL',
  'P',
  'STRONG',
  'UL',
]);

const BLOCKED_CONTENT_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math'];

export function sanitizeRichText(html: string) {
  if (!html) {
    return '';
  }

  let sanitized = html.replace(/<!--[\s\S]*?-->/g, '');

  for (const tag of BLOCKED_CONTENT_TAGS) {
    const blockPattern = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosingPattern = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(blockPattern, '').replace(selfClosingPattern, '');
  }

  sanitized = sanitized.replace(/<[^>]+>/g, (rawTag) => sanitizeTag(rawTag));
  return sanitized;
}

export function formatLongDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function calculateReadTimeFromHtml(html: string) {
  const plainText = html.replace(/<[^>]+>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function sanitizeTag(rawTag: string) {
  const tagMatch = rawTag.match(/^<\s*(\/?)\s*([a-z0-9]+)([^>]*)>$/i);
  if (!tagMatch) {
    return '';
  }

  const [, closingSlash, rawName, rawAttributes] = tagMatch;
  const tagName = rawName.toUpperCase();
  if (!ALLOWED_TAGS.has(tagName)) {
    return '';
  }

  if (closingSlash) {
    return `</${tagName.toLowerCase()}>`;
  }

  const attributes = sanitizeAttributes(tagName, rawAttributes || '');
  return `<${tagName.toLowerCase()}${attributes}>`;
}

function sanitizeAttributes(tagName: string, rawAttributes: string) {
  const attributes: string[] = [];
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi;
  let hasTargetBlank = false;
  let hasRel = false;

  for (const match of rawAttributes.matchAll(attributePattern)) {
    const attributeName = match[1]?.toLowerCase();
    const rawValue = match[3] ?? match[4] ?? match[5] ?? '';

    if (!attributeName || attributeName.startsWith('on') || attributeName === 'style') {
      continue;
    }

    if (tagName === 'A') {
      if (attributeName === 'href' && isSafeHref(rawValue)) {
        attributes.push(` href="${escapeHtmlAttribute(rawValue)}"`);
      } else if (attributeName === 'target' && ['_blank', '_self'].includes(rawValue)) {
        hasTargetBlank = rawValue === '_blank';
        attributes.push(` target="${rawValue}"`);
      } else if (attributeName === 'rel') {
        hasRel = true;
        attributes.push(` rel="${escapeHtmlAttribute(rawValue)}"`);
      }
      continue;
    }

    if (tagName === 'IMG') {
      if (attributeName === 'src' && isSafeImageSource(rawValue)) {
        attributes.push(` src="${escapeHtmlAttribute(rawValue)}"`);
      } else if (attributeName === 'alt' || attributeName === 'title') {
        attributes.push(` ${attributeName}="${escapeHtmlAttribute(rawValue)}"`);
      }
    }
  }

  if (tagName === 'A' && hasTargetBlank && !hasRel) {
    attributes.push(' rel="noopener noreferrer"');
  }

  return attributes.join('');
}

function isSafeHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /^\s*javascript:/i.test(trimmed)) {
    return false;
  }

  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    /^https?:\/\//i.test(trimmed)
  );
}

function isSafeImageSource(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /^\s*javascript:/i.test(trimmed)) {
    return false;
  }

  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/src/assets/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:image/') ||
    /^https?:\/\//i.test(trimmed)
  );
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
