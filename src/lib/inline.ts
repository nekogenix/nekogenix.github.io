export interface InlinePart {
  text: string;
  target?: string;
}

// Content links support wiki paths, page anchors and HTTPS; other text stays literal.
export function inlineParts(value: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const links =
    /\[([^\]\n]+)\]\((wiki(?:\/[a-z0-9-]+)?(?:#[a-z0-9-]+)?|#[a-z0-9-]+|https:\/\/[^\s)]+)\)/g;
  let offset = 0;
  for (const match of value.matchAll(links)) {
    if (match.index > offset)
      parts.push({ text: value.slice(offset, match.index) });
    parts.push({ text: match[1]!, target: match[2]! });
    offset = match.index + match[0].length;
  }
  if (offset < value.length) parts.push({ text: value.slice(offset) });
  return parts;
}

export function inlineText(value: string): string {
  return inlineParts(value)
    .map((part) => part.text)
    .join('');
}
