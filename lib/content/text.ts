/**
 * The string half of the inline editorial syntax (lib/content/rich.tsx renders
 * the other half). Kept free of JSX and of any React import so that word
 * counts, link extraction and the unit tests can run against editorial content
 * without pulling a renderer — which is the whole reason bodies are stored as
 * data in the first place.
 */

/** Inline markup removed — for word counts, meta descriptions and JSON-LD. */
export function plain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every href referenced by a string of inline copy, in order. */
export function hrefs(text: string): string[] {
  const out: string[] = [];
  const re = /\[[^\]]+\]\(([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
}

/** Word count of plain prose. Used to hold editorial to a stated minimum. */
export function words(text: string): number {
  const t = plain(text);
  return t ? t.split(/\s+/).length : 0;
}
