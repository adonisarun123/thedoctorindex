import { ARTICLES, articleBySlug } from "@/lib/conditions/articles";
import type { ConditionArticle } from "@/lib/conditions/article";

/**
 * Which condition pages may enter the index.
 *
 * Original articles (lib/conditions/articles) are indexable. Decision of
 * 3 Oct 2026 (Arun): index them before clinical sign-off, each carrying a
 * visible "not yet reviewed by a doctor" disclaimer (ConditionDisclaimer),
 * rather than wait for a reviewer. Set INDEX_UNREVIEWED_ARTICLES to false to
 * return to review-gated indexing.
 *
 * Review is a separate claim and stays strict: `articleReviewed` is true only
 * for a named reviewer with a registration number and a date. Only that turns
 * on the "Medically reviewed" row and reviewedBy / lastReviewed in markup.
 *
 * Compiled source drafts are never indexable: 61% of their words are shared
 * across 5+ drafts and the rest is verbatim MedlinePlus / Orphanet text.
 *
 * Hubs follow their contents: indexable once they link to enough indexable
 * condition pages to be useful pages in their own right.
 */

export const INDEX_UNREVIEWED_ARTICLES = true;
export const HUB_MIN_INDEXABLE = 5;
export const DEPARTMENT_MIN_INDEXABLE = 3;

export function articleReviewed(a: ConditionArticle | null): boolean {
  return Boolean(a && a.reviewer && a.reviewer.name.trim() && a.reviewer.registration.trim() && a.reviewedOn.trim());
}

export function articleIndexable(a: ConditionArticle | null): boolean {
  if (!a) return false;
  return articleReviewed(a) || INDEX_UNREVIEWED_ARTICLES;
}

export function conditionIndexable(slug: string): boolean {
  return articleIndexable(articleBySlug(slug));
}

export function indexableSlugs(): string[] {
  return ARTICLES.filter(articleIndexable).map((a) => a.slug);
}
