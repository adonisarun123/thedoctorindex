/**
 * Review questionnaire scoring. Pure: no database, so the rules are unit-tested.
 *
 * Each question is rated 1–5 stars or skipped ("not applicable"). A review
 * must rate at least MIN_CORE_RATED of the core questions; speciality
 * questions are always optional. The overall score is the mean of what was
 * rated — a skipped question neither helps nor hurts.
 */

export interface ReviewQuestion {
  key: string;
  label: string;
  help: string;
  /** null for a core question asked of every doctor. */
  specialtyKey: string | null;
}

export const MIN_CORE_RATED = 3;

/** Form value for one question: "1".."5", or "na"/empty for skipped. */
export function parseRatings(questions: ReviewQuestion[], read: (key: string) => string | null | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const q of questions) {
    const raw = (read(q.key) ?? "").trim();
    if (!raw || raw === "na") continue;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`Rate "${q.label}" from 1 to 5 stars, or mark it not applicable.`);
    out[q.key] = n;
  }
  return out;
}

export function validateRatings(questions: ReviewQuestion[], ratings: Record<string, number>): void {
  const known = new Set(questions.map((q) => q.key));
  for (const k of Object.keys(ratings)) if (!known.has(k)) throw new Error("That question is not part of this review form. Reload the page and try again.");
  const core = questions.filter((q) => q.specialtyKey === null);
  const need = Math.min(MIN_CORE_RATED, core.length);
  const rated = core.filter((q) => ratings[q.key] !== undefined).length;
  if (rated < need) throw new Error(`Rate at least ${need} of the ${core.length} main questions. Mark the rest not applicable only if they truly do not apply.`);
}

export function overallScore(ratings: Record<string, number>): number | null {
  const v = Object.values(ratings);
  if (!v.length) return null;
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100;
}

/** Ratings as labelled rows in question order, for display. Unknown (retired) keys keep their key as label. */
export function labelledRatings(ratings: Record<string, number>, labels: Map<string, { label: string; sort: number }>): Array<{ key: string; label: string; value: number }> {
  return Object.entries(ratings)
    .map(([key, value]) => ({ key, value, label: labels.get(key)?.label ?? key, sort: labels.get(key)?.sort ?? 999 }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ key, label, value }) => ({ key, label, value }));
}
