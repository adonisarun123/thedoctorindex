import { env } from "@/lib/env";
import type { DoctorView, LocalityKey, RankingBreakdown, SpecialtyKey } from "@/lib/types";

/**
 * Organic ranking (project plan §8.3).
 *
 * Payment is not an input and there is no field in this function for one. The
 * weights are published at /policies/ranking and every result on a listing page
 * can show its own breakdown, so the order is auditable by anyone.
 */

export const WEIGHTS = {
  relevance: env.ranking.relevance,
  location: env.ranking.location,
  verification: env.ranking.verification,
  completeness: env.ranking.completeness,
  freshness: env.ranking.freshness,
  reviewConfidence: env.ranking.reviewConfidence,
} as const;

export interface RankingContext {
  specialty?: SpecialtyKey;
  locality?: LocalityKey;
  query?: string;
}

export function rank(d: DoctorView, ctx: RankingContext): RankingBreakdown {
  const relevance = scoreRelevance(d, ctx);
  const location = scoreLocation(d, ctx);
  const verification = scoreVerification(d);
  const completeness = Math.round(d.qualityScore / 10);
  const freshness = scoreFreshness(d);
  const reviewConfidence = scoreReviewConfidence(d);

  return {
    relevance,
    location,
    verification,
    completeness,
    freshness,
    reviewConfidence,
    total: relevance + location + verification + completeness + freshness + reviewConfidence,
  };
}

function scoreRelevance(d: DoctorView, ctx: RankingContext): number {
  if (ctx.specialty) return d.specialty === ctx.specialty ? WEIGHTS.relevance : 14;
  if (ctx.query) {
    const q = ctx.query.toLowerCase();
    return d.name.toLowerCase().includes(q) ? WEIGHTS.relevance : 14;
  }
  return 28;
}

function scoreLocation(d: DoctorView, ctx: RankingContext): number {
  if (!ctx.locality) return 17;
  return d.localities.includes(ctx.locality) ? WEIGHTS.location : 8;
}

function scoreVerification(d: DoctorView): number {
  const practice = d.status === "active" ? 10 : 3;
  const quals = d.qualifications.every((q) => q.state === "verified") ? 5 : 2;
  return practice + quals;
}

function scoreFreshness(d: DoctorView): number {
  if (d.status === "stale") return 2;
  return d.practices[0]?.feeInr !== null ? 10 : 6;
}

/**
 * Minimum-confidence review score. A single five-star review must not outrank a
 * doctor with sustained consistent feedback, so the average is discounted by
 * how little evidence sits behind it.
 */
function scoreReviewConfidence(d: DoctorView): number {
  if (d.rating.count === 0) return 3;
  const confidence = Math.min(1, d.rating.count / env.ranking.reviewConfidenceFullAt + 0.4);
  return Math.round(Math.min(WEIGHTS.reviewConfidence, (d.rating.average / 5) * 10 * confidence));
}

export function sortByRank(doctors: DoctorView[], ctx: RankingContext): DoctorView[] {
  return [...doctors]
    .map((d) => ({ d, score: rank(d, ctx).total }))
    .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name))
    .map((x) => x.d);
}

export function sortBy(
  doctors: DoctorView[],
  mode: "relevance" | "experience" | "reviews",
  ctx: RankingContext,
): DoctorView[] {
  if (mode === "experience") {
    return [...doctors].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
  }
  if (mode === "reviews") {
    return [...doctors].sort(
      (a, b) => rank(b, ctx).reviewConfidence - rank(a, ctx).reviewConfidence,
    );
  }
  return sortByRank(doctors, ctx);
}
