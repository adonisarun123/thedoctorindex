import type { Block } from "@/lib/blog/types";
import { words } from "@/lib/content/text";

/**
 * Doctor articles: the pure half (no database, no React), so the rules below
 * are unit-tested in tests/unit/articles.test.ts.
 *
 * A doctor writes the body as plain text in the same small syntax the
 * editorial pages use, and it is parsed into the blog's Block list so the
 * public page reuses ArticleBody:
 *
 *   ## Heading            section heading (listed in the contents)
 *   ### Subheading
 *   - item / * item       bulleted list (consecutive lines)
 *   1. item               numbered list (consecutive lines)
 *   blank line            ends a paragraph
 *   **bold** *italic* [label](https://…)   inline, rendered by lib/content/rich
 *
 * There is no HTML. React escapes everything, and an external link renders
 * with rel="nofollow".
 */

export const ARTICLE_LIMITS = {
  slugMin: 8,
  slugMax: 80,
  titleMin: 15,
  titleMax: 110,
  descriptionMin: 50,
  descriptionMax: 200,
  /** Below this an article is too thin to publish (and to index). */
  bodyMinWords: 300,
  bodyMaxWords: 6000,
} as const;

export interface ArticleInput {
  slug: string;
  title: string;
  description: string;
  body: string;
  sourceUrl: string | null;
}

/** Lower-case, hyphenated, ASCII; what the doctor types in the URL box is run through this. */
export function normaliseSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+\/articles\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ARTICLE_LIMITS.slugMax)
    .replace(/-+$/, "");
}

/** Returns the cleaned source URL, or throws when it is not a usable public link. */
export function normaliseSourceUrl(input: string | null | undefined, siteHost = "thedoctorindex"): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("The original publication link must be a full web address starting with https://");
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("The original publication link must start with https://");
  if (u.hostname.includes(siteHost)) throw new Error("The original publication link should point to where the article first appeared, not to this site. Leave it empty if this is the first publication.");
  u.hash = "";
  return u.toString();
}

/** Every validation problem with an article, in reading order. Empty when it may be saved (or submitted). */
export function articleProblems(a: ArticleInput, opts: { forSubmit: boolean }): string[] {
  const L = ARTICLE_LIMITS;
  const out: string[] = [];
  if (a.slug.length < L.slugMin) out.push(`The URL needs at least ${L.slugMin} characters (letters, numbers and hyphens).`);
  if (a.title.trim().length < (opts.forSubmit ? L.titleMin : 3)) out.push(opts.forSubmit ? `The title needs at least ${L.titleMin} characters.` : "Give the article a working title.");
  if (a.title.length > L.titleMax) out.push(`Keep the title under ${L.titleMax} characters.`);
  if (a.description.length > L.descriptionMax) out.push(`Keep the description under ${L.descriptionMax} characters.`);
  const n = words(a.body);
  if (n > L.bodyMaxWords) out.push(`The article is ${n.toLocaleString("en-IN")} words; the limit is ${L.bodyMaxWords.toLocaleString("en-IN")}.`);
  if (opts.forSubmit) {
    if (a.description.trim().length < L.descriptionMin) out.push(`The description needs at least ${L.descriptionMin} characters — one or two sentences on what the reader will learn.`);
    if (n < L.bodyMinWords) out.push(`The article is ${n} words; it needs at least ${L.bodyMinWords} to be published.`);
    if (/^\s*#\s/m.test(a.body)) out.push("Use ## for headings — the title is already the page's main heading.");
  }
  return out;
}

const UL = /^\s*[-*•]\s+(.*)$/;
const OL = /^\s*\d+[.)]\s+(.*)$/;

/** Parse the doctor's plain-text body into editorial blocks. */
export function parseArticleBody(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  // Cast, not an annotation: closures reassign it, so it must not narrow to null.
  let list = null as { k: "ul" | "ol"; items: string[] } | null;

  const flushPara = () => {
    if (para.length) blocks.push({ k: "p", text: para.join(" ").replace(/\s+/g, " ").trim() });
    para = [];
  };
  const flushList = () => {
    if (list && list.items.length) blocks.push({ k: list.k, items: list.items });
    list = null;
  };

  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const h = /^\s*(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      flushPara();
      flushList();
      blocks.push({ k: h[1].length === 3 ? "h3" : "h2", text: h[2].trim() });
      continue;
    }
    const ul = UL.exec(line);
    const ol = ul ? null : OL.exec(line);
    if (ul || ol) {
      flushPara();
      const k = ul ? "ul" : "ol";
      if (!list || list.k !== k) {
        flushList();
        list = { k, items: [] };
      }
      list.items.push((ul ?? ol)![1].trim());
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

/** Words across title, description and body. */
export function articleWordCount(a: Pick<ArticleInput, "title" | "description" | "body">): number {
  return words(a.title) + words(a.description) + words(a.body);
}

export function articleReadingMinutes(a: Pick<ArticleInput, "title" | "description" | "body">): number {
  return Math.max(1, Math.ceil(articleWordCount(a) / 220));
}

/** "Karnataka Medical Council · 12345". The one place the printed registration line is spelled. */
export function registrationLine(council: string | null | undefined, number: string | null | undefined): string | null {
  if (!number) return null;
  return council ? `${council} · ${number}` : number;
}
