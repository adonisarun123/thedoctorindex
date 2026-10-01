import type { ConditionArticle } from "@/lib/conditions/article";

/**
 * Original condition articles, one module per slug. Phase B of the condition
 * library adds these in batches; the registry is the only place a condition
 * can become eligible for indexing (see lib/conditions/gate.ts).
 */
export const ARTICLES: ConditionArticle[] = [];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): ConditionArticle | null {
  return BY_SLUG.get(slug) ?? null;
}
