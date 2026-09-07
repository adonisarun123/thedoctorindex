/**
 * Name handling for register and listing matches. Pure functions, unit-tested.
 *
 * Indian professional names arrive in every order ("AGRAWAL ASHOK", "Dr. Ashok
 * Kumar Agrawal", "Agrawal (Smt.) Neena"), with honorifics, initials and
 * bracketed notes. Matching is therefore done on token sets, never on
 * string equality.
 */

const HONORIFICS = new Set(["dr", "dr.", "prof", "prof.", "mr", "mrs", "ms", "smt", "smt.", "shri", "sri", "kumari", "ku", "ku.", "late", "sr", "jr"]);

/** Lower-case ASCII tokens with honorifics, punctuation and bracketed notes removed. */
export function nameTokens(raw: string): string[] {
  // "Kaur (Ku) Harjeet Now Bansal (Smt.) Harjeet Kaur": both the maiden and the
  // married name are kept, so either form on a profile is covered.
  const seen = new Set<string>();
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(now|alias|nee|née|w\/o|d\/o|s\/o)\b/gi, " ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !HONORIFICS.has(t) && !seen.has(t) && seen.add(t));
}

/** Tokens of at least three letters — the ones that carry identity; initials are kept separately. */
export function coreTokens(raw: string): string[] {
  return nameTokens(raw).filter((t) => t.length >= 3);
}

export function initials(raw: string): string[] {
  return nameTokens(raw).filter((t) => t.length < 3);
}

/**
 * Does the register name plausibly denote the same person as the profile name?
 * Every core token of the profile must appear in the register name (order-free),
 * and the register name may carry extra tokens (a middle name, a maiden name).
 * Initials in the profile must not contradict the register's tokens.
 */
export function nameCovers(registerName: string, profileName: string): boolean {
  const reg = nameTokens(registerName);
  const regCore = new Set(reg.filter((t) => t.length >= 3));
  const core = coreTokens(profileName);
  if (core.length === 0) return false;
  if (!core.every((t) => regCore.has(t))) return false;
  for (const i of initials(profileName)) {
    if (!reg.some((t) => t.startsWith(i))) return false;
  }
  return true;
}

/**
 * Strictness for a unique match: after coverage, the register name should not
 * carry more than one extra core token, otherwise "Agrawal Ashok" would claim
 * "Agrawal Ashok Kumar Prasad" as readily as "Agrawal Ashok".
 */
export function nameTight(registerName: string, profileName: string): boolean {
  if (!nameCovers(registerName, profileName)) return false;
  const extra = coreTokens(registerName).length - coreTokens(profileName).length;
  return extra <= 1;
}

/** Dice coefficient on character bigrams; 0..1. Used for facility-name similarity against Google. */
export function similarity(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const grams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const gx = grams(x);
  const gy = grams(y);
  let inter = 0;
  for (const [g, n] of gx) inter += Math.min(n, gy.get(g) ?? 0);
  const total = [...gx.values()].reduce((a, b) => a + b, 0) + [...gy.values()].reduce((a, b) => a + b, 0);
  return total ? (2 * inter) / total : 0;
}

/** The surname-ish token to query a register by: the longest core token. */
export function queryToken(raw: string): string | null {
  const core = coreTokens(raw);
  if (!core.length) return null;
  return [...core].sort((a, b) => b.length - a.length)[0];
}

/** Keep only digits; used for phone comparison. */
export function phoneDigits(raw: string | null | undefined): string {
  return (raw ?? "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}
