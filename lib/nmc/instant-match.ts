import { nameTokens, similarity } from "@/lib/enrich/names";

/**
 * Instant onboarding: does the name on the signed-in account plausibly belong
 * to this register entry? Pure, unit-tested (tests/unit/instant-match.test.ts).
 *
 * The register spells names its own way — surname first, initials for middle
 * names, an extra middle or maiden name — so this compares token sets, not
 * strings. A pass publishes the profile without a person looking at it, so the
 * rule leans strict; anything it refuses goes to a verification officer, never
 * to a dead end.
 *
 *   1. Every token of the account name lines up with a different register
 *      token: the same word, a near spelling of a long word (Mohammed /
 *      Mohammad), or an initial against a word starting with that letter.
 *   2. At least two full words agree exactly or near-exactly — one if the
 *      register itself carries only one full word ("RAMESH K").
 *   3. The register has at most one full word the account leaves out (a middle
 *      or maiden name the doctor does not use day to day).
 */

const NEAR = 0.7;
const isInitial = (t: string) => t.length < 3;

function strong(a: string, b: string): boolean {
  if (a === b) return true;
  return a.length >= 5 && b.length >= 5 && a[0] === b[0] && similarity(a, b) >= NEAR;
}

function weak(a: string, b: string): boolean {
  return (isInitial(a) || isInitial(b)) && a[0] === b[0];
}

export interface NameMatch {
  ok: boolean;
  /** Full words that agreed. */
  agreed: number;
  /** Why it failed, for the audit log and the officer's queue. Never shown to the public. */
  reason?: "too_short" | "unmatched_account_word" | "too_few_full_words" | "register_words_left_out";
}

export function accountNameMatches(registerName: string, accountName: string): NameMatch {
  const reg = nameTokens(registerName);
  const acc = nameTokens(accountName);
  const accCore = acc.filter((t) => !isInitial(t));
  if (!accCore.length || !reg.length) return { ok: false, agreed: 0, reason: "too_short" };

  const used = new Set<number>();
  let agreed = 0;
  // Full words first, so an initial cannot take the slot a full word needs.
  const order = [...accCore, ...acc.filter(isInitial)];
  for (const t of order) {
    let at = reg.findIndex((r, i) => !used.has(i) && strong(t, r));
    if (at >= 0) {
      if (!isInitial(t)) agreed++;
    } else {
      at = reg.findIndex((r, i) => !used.has(i) && weak(t, r));
    }
    if (at < 0) return { ok: false, agreed, reason: "unmatched_account_word" };
    used.add(at);
  }
  const regCore = reg.filter((t) => !isInitial(t));
  const need = Math.min(2, regCore.length);
  if (agreed < need) return { ok: false, agreed, reason: "too_few_full_words" };
  const leftOut = reg.filter((t, i) => !used.has(i) && !isInitial(t)).length;
  if (leftOut > 1) return { ok: false, agreed, reason: "register_words_left_out" };
  return { ok: true, agreed };
}
