import type { Metadata } from "next";

import { SITE, absoluteUrl } from "@/lib/site";

/**
 * One builder for every public page's <head>.
 *
 * Next does not deep-merge `openGraph` or `twitter` across layouts: a page
 * that sets `openGraph.title` silently drops the root layout's siteName,
 * locale and type. Every public page therefore goes through `pageMeta`, which
 * emits the whole block each time, and which also enforces the two length
 * budgets search snippets are cut at: titles at ~60 characters and
 * descriptions at ~155. Long values are trimmed on a word boundary rather than
 * mid-word, and the brand suffix shrinks or drops before the page title does.
 *
 * Open Graph images: Next drops a parent segment's file-based image the moment
 * a page defines its own `openGraph`, so the helper points at the site-wide
 * card by default; segments with their own `opengraph-image.tsx` pass
 * `image: "segment"` and listings pass an explicit URL.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

type OgType = "website" | "article" | "profile";

export interface PageMetaInput {
  /** Page title without the brand suffix; the suffix is added when it fits. */
  title: string;
  description: string;
  /** Canonical path, e.g. `/doctor/ananya-rao-d1`. */
  path: string;
  index?: boolean;
  follow?: boolean;
  type?: OgType;
  /** Optional longer/friendlier Open Graph title (social cards allow more room). */
  ogTitle?: string;
  /**
   * Social image. Omit for the site-wide default card; pass "segment" when the
   * route folder has its own `opengraph-image.tsx` (setting `images` here
   * would override that file); pass an object for a custom image URL.
   */
  image?: { url: string; width?: number; height?: number; alt?: string } | "segment";
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[]; section?: string; tags?: string[] };
  profile?: { firstName?: string; lastName?: string; gender?: string };
}

/** Trim on a word boundary and add an ellipsis when something was cut. */
export function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const atWord = cut.lastIndexOf(" ");
  return `${(atWord > max * 0.6 ? cut.slice(0, atWord) : cut).replace(/[\s,;:–—-]+$/, "")}…`;
}

/** Full document title: page + brand where the pair fits the snippet budget. */
export function fullTitle(page: string): string {
  const p = page.replace(/\s+/g, " ").trim();
  const long = `${p} | ${SITE.name}`;
  if (long.length <= TITLE_MAX) return long;
  const short = `${p} | ${SITE.shortName}`;
  if (short.length <= TITLE_MAX) return short;
  return clamp(p, TITLE_MAX);
}

export function pageMeta(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const title = fullTitle(input.title);
  const description = clamp(input.description, DESCRIPTION_MAX);
  const type = input.type ?? "website";
  const ogTitle = clamp(input.ogTitle ?? input.title, 90);
  const images =
    input.image === "segment"
      ? undefined
      : input.image
        ? [{ url: input.image.url, width: input.image.width ?? 1200, height: input.image.height ?? 630, alt: input.image.alt ?? ogTitle }]
        : [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }];

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: input.index ?? true, follow: input.follow ?? true },
    openGraph: {
      type,
      siteName: SITE.name,
      locale: "en_IN",
      url,
      title: ogTitle,
      description,
      ...(images ? { images } : {}),
      ...(type === "article" && input.article ? input.article : {}),
      ...(type === "profile" && input.profile ? input.profile : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}

/** Metadata for pages that must never appear in results (auth, flows, admin). */
export function privateMeta(title: string, description?: string, path?: string): Metadata {
  return {
    title,
    ...(description ? { description: clamp(description, DESCRIPTION_MAX) } : {}),
    robots: { index: false, follow: false, nocache: true },
    openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", ...(path ? { url: absoluteUrl(path) } : {}), title: `${title} | ${SITE.name}`, images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }] },
    twitter: { card: "summary_large_image" },
  };
}
