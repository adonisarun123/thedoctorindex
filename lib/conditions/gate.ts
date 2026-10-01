import { ARTICLES, articleBySlug } from "@/lib/conditions/articles";
import type { ConditionArticle } from "@/lib/conditions/article";

/**
 * Which condition pages may enter the index.
 *
 * A condition page is indexable only when an original article exists for it
 * AND a named clinician has signed that article off. Compiled source drafts
 * are never indexable however long they are: 61% of their words are shared
 * across 5+ drafts and the rest is verbatim MedlinePlus / Orphanet text that
 * those sites will always outrank. Indexing them would be the scaled-content
 * pattern on a YMYL domain.
 *
 * Hubs follow their contents: a hub is indexable once it links to enough
 * indexable condition pages to be a useful page in its own right. Until then
 * it is served (people can browse every draft) but carries noindex.
 */

export const HUB_MIN_INDEXABLE = 5;
export const DEPARTMENT_MIN_INDEXABLE = 3;

export function articleIndexable(a: ConditionArticle | null): boolean {
  return Boolean(a && a.reviewer && a.reviewer.name.trim() && a.reviewer.registration.trim() && a.reviewedOn.trim());
}

export function conditionIndexable(slug: string): boolean {
  return articleIndexable(articleBySlug(slug));
}

export function indexableSlugs(): string[] {
  return ARTICLES.filter(articleIndexable).map((a) => a.slug);
}
