/**
 * Picks one register person out of several same-name candidates, using the
 * degrees and years a hospital prints for the doctor.
 *
 * A wrong pick gives a stranger's council number to a published profile, so the
 * rule is deliberately narrow: one candidate must share an exact postgraduate
 * degree and year (or two exact degree+year pairs) with the roster, and every
 * other candidate must share none.
 */

export type DegreeFamily = "mbbs" | "md" | "ms" | "dnb" | "dm" | "mch" | "diploma" | "other";

const POSTGRAD = new Set<DegreeFamily>(["md", "ms", "dnb", "dm", "mch"]);

const DEGREE_WORD = /\b(m\.?\s?b\.?\s?b\.?\s?s|m\.?\s?ch|d\.?\s?n\.?\s?b|f\.?\s?n\.?\s?b|d\.?\s?m|m\.?\s?d|m\.?\s?s|d\.?\s?g\.?\s?o|d\.?\s?c\.?\s?h|d\.?\s?l\.?\s?o|d\.?\s?p\.?\s?m|d\.?\s?c\.?\s?p|d\.?\s?m\.?\s?r\.?\s?d|d\.?\s?ortho|d\.?\s?v\.?\s?d|d\.?\s?d\.?\s?v\.?\s?l)(?![a-z])/gi;
const YEAR = /\b(19[5-9]\d|20[0-2]\d)\b/g;

/** "M.D.", "MD", "m.s." → family. Exact words only, so "DMRD" is a diploma and not a DM. */
export function degreeFamily(raw: string): DegreeFamily {
  const t = raw.toLowerCase().replace(/[.\s]/g, "");
  if (t.startsWith("mbbs")) return "mbbs";
  if (t.startsWith("mch")) return "mch";
  if (t === "dnb" || t === "fnb") return "dnb";
  if (t === "dm") return "dm";
  if (t === "md") return "md";
  if (t === "ms") return "ms";
  if (/^(dgo|dch|dlo|dpm|dcp|dmrd|dortho|dvd|ddvl)$/.test(t)) return "diploma";
  return "other";
}

export interface Credential { family: DegreeFamily; year: number }

/**
 * Credentials read from one roster string at a time. The degree and its year must
 * sit in the same string ("MS Surgery – 1989 (AIIMS", "MD 1981 MAMC"); a year
 * only counts before the degree when it sits right against it ("Jan 1989 MD").
 */
export function credentialsFromRoster(lines: string[]): Credential[] {
  const out: Credential[] = [];
  for (const line of lines) {
    const degrees = [...line.matchAll(DEGREE_WORD)].map((m) => ({ family: degreeFamily(m[1]), start: m.index!, end: m.index! + m[0].length }));
    const years = [...line.matchAll(YEAR)].map((m) => ({ year: Number(m[1]), start: m.index!, end: m.index! + m[0].length }));
    degrees.forEach((d, i) => {
      const nextStart = degrees[i + 1]?.start ?? Infinity;
      const after = years.find((y) => y.start >= d.end && y.start < nextStart && y.start - d.end <= 60);
      const before = years.filter((y) => y.end <= d.start && d.start - y.end <= 12 && !degrees.some((o) => o !== d && o.end > y.end && o.start < d.start)).pop();
      const y = after ?? before;
      if (y && d.family !== "other") out.push({ family: d.family, year: y.year });
    });
  }
  const seen = new Set<string>();
  return out.filter((c) => {
    const k = `${c.family}${c.year}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export interface Candidate { key: string; quals: Array<{ degree: string | null; year: number | null }> }

/** Register degrees read "MD(General Medicine)", "M.S. (ORTHO)", "DNB - Cardiology". */
function firstDegreeWord(degree: string): string {
  const m = [...degree.matchAll(DEGREE_WORD)][0];
  return m ? m[1] : degree;
}

/** How many of the roster's credentials the candidate holds exactly (same family, same year). */
export function sharedCredentials(roster: Credential[], quals: Candidate["quals"]): { total: number; postgrad: number } {
  let total = 0;
  let postgrad = 0;
  const held = quals.filter((q) => q.degree && q.year).map((q) => ({ family: degreeFamily(firstDegreeWord(q.degree!)), year: q.year! }));
  for (const r of roster) {
    if (held.some((h) => h.family === r.family && h.year === r.year)) {
      total++;
      if (POSTGRAD.has(r.family)) postgrad++;
    }
  }
  return { total, postgrad };
}

/** The one candidate key the roster's credentials single out, or null when the evidence does not. */
export function pickByCredentials(rosterLines: string[], candidates: Candidate[]): string | null {
  const roster = credentialsFromRoster(rosterLines);
  if (roster.length === 0 || candidates.length < 2) return null;
  const scored = candidates.map((c) => ({ key: c.key, ...sharedCredentials(roster, c.quals) }));
  const strong = scored.filter((c) => c.postgrad >= 1 || c.total >= 2);
  if (strong.length !== 1) return null;
  // Every other candidate must share nothing: a second partial match means the evidence is not decisive.
  if (scored.some((c) => c.key !== strong[0].key && c.total > 0)) return null;
  return strong[0].key;
}
