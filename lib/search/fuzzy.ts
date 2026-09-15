/**
 * Typo-tolerant matching for as-you-type search. Pure and isomorphic: the
 * speciality registry is matched in the browser, places and doctor names on
 * the server. Scores are 0 (no match) to 100 (exact), so callers can rank
 * candidates from several sources on one scale.
 *
 * Order of preference: exact → prefix → word prefix → substring → one or two
 * typos (Damerau–Levenshtein against the whole string, its prefix, or any
 * word) → bigram overlap for longer queries. A query shorter than three
 * characters only ever matches by prefix, so "ca" does not fan out to
 * everything within an edit of it.
 */

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Damerau–Levenshtein (optimal string alignment) distance, capped at `max + 1` for speed. */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

/** How many typos a query of this length may carry. */
export function allowedTypos(len: number): number {
  if (len < 4) return 0;
  if (len < 8) return 1;
  return 2;
}

/**
 * Score one candidate string against a query. `q` and `c` may be raw; both
 * are normalised here.
 */
export function matchScore(query: string, candidate: string): number {
  const q = normalize(query);
  const c = normalize(candidate);
  if (!q || !c) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 90 - Math.min(9, (c.length - q.length) / 4);
  const words = c.split(" ");
  if (words.some((w) => w.startsWith(q))) return 80;
  if (q.length >= 3 && c.includes(q)) return 70;
  const typos = allowedTypos(q.length);
  if (typos === 0) return 0;
  // Typos: against the whole string, the same-length prefix (the person is
  // still typing), and each word.
  let best = typos + 1;
  best = Math.min(best, editDistance(q, c, typos));
  best = Math.min(best, editDistance(q, c.slice(0, q.length), typos));
  for (const w of words) best = Math.min(best, editDistance(q, w, typos), editDistance(q, w.slice(0, q.length), typos));
  if (best <= typos) return 62 - 11 * best;
  if (q.length >= 5) {
    const d = dice(q, c);
    if (d >= 0.55) return Math.round(20 + 25 * d);
  }
  return 0;
}

/** Best score across several strings for the same thing (name, aliases…). */
export function bestScore(query: string, candidates: readonly string[]): number {
  let best = 0;
  for (const c of candidates) {
    const s = matchScore(query, c);
    if (s > best) best = s;
    if (best === 100) break;
  }
  return best;
}

/** Rank items by a scorer, dropping non-matches; ties keep input order. */
export function rank<T>(query: string, items: readonly T[], strings: (item: T) => readonly string[], limit = 8): Array<{ item: T; score: number }> {
  const out: Array<{ item: T; score: number; i: number }> = [];
  items.forEach((item, i) => {
    const score = bestScore(query, strings(item));
    if (score > 0) out.push({ item, score, i });
  });
  return out
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map(({ item, score }) => ({ item, score }));
}

function dice(a: string, b: string): number {
  const grams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) ?? 0) + 1);
    return m;
  };
  const ga = grams(a);
  const gb = grams(b);
  let inter = 0;
  for (const [g, n] of ga) inter += Math.min(n, gb.get(g) ?? 0);
  const total = a.length - 1 + (b.length - 1);
  return total > 0 ? (2 * inter) / total : 0;
}
