import { hrefs, plain, words } from "@/lib/content/text";

/**
 * The blog's content model.
 *
 * Posts are data, not JSX (see lib/content/rich.tsx for why). Every block
 * holds plain strings carrying the small inline syntax, which means a post's
 * length, headings, links and questions are all computable — and therefore
 * testable. `tests/unit/blog.test.ts` uses exactly these helpers to hold each
 * published post to its stated minimum length and to check that every
 * internal link it makes actually resolves to a route.
 */

export type Block =
  /** A paragraph. */
  | { k: "p"; text: string }
  /** A section heading. These become the contents list and the anchor targets. */
  | { k: "h2"; text: string }
  /** A subheading inside a section. Not listed in the contents. */
  | { k: "h3"; text: string }
  | { k: "ul"; items: string[] }
  | { k: "ol"; items: string[] }
  /** A bordered aside. `alert` for something that can go wrong, `good` for a confirmation. */
  | { k: "note"; tone?: "info" | "alert" | "good"; title?: string; text: string }
  | { k: "table"; caption?: string; head: string[]; rows: string[][] }
  /** A numbered procedure where each step has a title and a paragraph. */
  | { k: "steps"; items: Array<{ title: string; text: string }> }
  /** A pull quote from a named instrument or document. */
  | { k: "quote"; text: string; source?: string };

export interface Faq {
  q: string;
  a: string;
}

export type CategoryKey = "checking" | "choosing" | "rights";

export interface Category {
  key: CategoryKey;
  name: string;
  /** Shown under the heading on the category listing and in the index. */
  blurb: string;
}

export interface BlogPost {
  slug: string;
  /** The H1 and the headline in structured data. */
  title: string;
  /** Title tag when the H1 is too long or reads badly in a result. Optional. */
  metaTitle?: string;
  /** Standfirst under the H1; also the meta description, so keep it under 155. */
  standfirst: string;
  category: CategoryKey;
  /**
   * The query this post is written to answer. Recorded so the editorial plan
   * is visible in the source and two posts cannot quietly target the same one;
   * it is never rendered as a keyword line on the page.
   */
  targetQuery: string;
  author: string;
  publishedOn: string;
  updatedOn: string;
  body: Block[];
  /** Questions answered on the page and emitted as FAQPage for answer engines. */
  faqs: Faq[];
  /** Slugs of two or three posts worth reading next. */
  related: string[];
}

/* ---------------------------------------------------------------------------
   Derived values. Nothing below is stored on the post; all of it is computed
   so it cannot drift from what the page actually says.
--------------------------------------------------------------------------- */

/** Every string of prose in a block, in reading order. */
export function blockStrings(block: Block): string[] {
  switch (block.k) {
    case "p":
    case "h2":
    case "h3":
      return [block.text];
    case "ul":
    case "ol":
      return block.items;
    case "note":
      return [block.title ?? "", block.text];
    case "quote":
      return [block.text, block.source ?? ""];
    case "steps":
      return block.items.flatMap((s) => [s.title, s.text]);
    case "table":
      return [block.caption ?? "", ...block.head, ...block.rows.flat()];
  }
}

export function postStrings(post: BlogPost): string[] {
  return [
    post.title,
    post.standfirst,
    ...post.body.flatMap(blockStrings),
    ...post.faqs.flatMap((f) => [f.q, f.a]),
  ].filter(Boolean);
}

/** Total words on the page, questions and answers included. */
export function wordCount(post: BlogPost): number {
  return postStrings(post).reduce((n, s) => n + words(s), 0);
}

/** Reading time at 220 words a minute, rounded up, floored at one minute. */
export function readingMinutes(post: BlogPost): number {
  return Math.max(1, Math.ceil(wordCount(post) / 220));
}

/** Stable anchor id for a heading, used by the contents list. */
export function anchorId(text: string): string {
  return plain(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** The h2 headings, in order, for the contents list. */
export function contents(post: BlogPost): Array<{ id: string; text: string }> {
  return post.body
    .filter((b): b is Extract<Block, { k: "h2" }> => b.k === "h2")
    .map((b) => ({ id: anchorId(b.text), text: plain(b.text) }));
}

/** Every href the post links to, deduplicated. */
export function postLinks(post: BlogPost): string[] {
  return [...new Set(postStrings(post).flatMap(hrefs))];
}

/** The first paragraph, plain — used as the article abstract. */
export function abstract(post: BlogPost): string {
  const first = post.body.find((b) => b.k === "p");
  return first && first.k === "p" ? plain(first.text) : plain(post.standfirst);
}
