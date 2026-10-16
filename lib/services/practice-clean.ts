/**
 * Guards for practice data typed by doctors (or filled by browser autofill).
 *
 * Incident 16 Oct 2026: a submission arrived with the phone number in facility
 * name, days, hours and fee (917715871080). The fee overflowed the integer
 * column and approval failed with a raw SQL error. These helpers reject such
 * values at submission and neutralise them at write time.
 */

export const FEE_MAX_INR = 50_000;

/** True when the whole value is just a phone number (not text that mentions one). */
export function looksLikePhone(v: string | null | undefined): boolean {
  const t = String(v ?? "").trim();
  if (!t) return false;
  return /^[+()\d\s.-]+$/.test(t) && t.replace(/\D/g, "").length >= 8;
}

/** A consultation fee in rupees, or null when absent or implausible. */
export function cleanFee(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[₹,\s]/g, ""));
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > FEE_MAX_INR) return null;
  return n;
}

/** Days/hours text, blanked when it is only a phone number. */
export function cleanSchedule(v: string | null | undefined): string {
  const t = String(v ?? "").trim();
  return looksLikePhone(t) ? "" : t;
}

/** Facility name is usable when non-empty and not just a number. */
export function goodFacilityName(v: string | null | undefined): v is string {
  return !badFacilityName(v);
}

/** Facility name is unusable when empty or just a number. */
export function badFacilityName(v: string | null | undefined): boolean {
  const t = String(v ?? "").trim();
  return !t || /^[+()\d\s.-]+$/.test(t);
}

/** Human-readable problems for a submitted practice block; empty when fine. */
export function practiceProblems(p: { facilityName?: string; days?: string; hours?: string; fee?: string | null; phone?: string }): string[] {
  const out: string[] = [];
  if (p.facilityName !== undefined && badFacilityName(p.facilityName)) out.push("Enter the clinic or hospital name, not a phone number.");
  if (looksLikePhone(p.days)) out.push("“Days” should read like Mon–Sat, not a phone number.");
  if (looksLikePhone(p.hours)) out.push("“Hours” should read like 10:00–13:00, not a phone number.");
  if (p.fee && cleanFee(p.fee) === null) out.push(`Fee must be a whole number of rupees between 0 and ${FEE_MAX_INR.toLocaleString("en-IN")}.`);
  return out;
}
