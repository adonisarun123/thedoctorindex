import { coreTokens } from "@/lib/enrich/names";
import type { PlaceHit } from "@/lib/enrich/google";

/**
 * Placing a register-built profile at a practice from a Google Places text
 * search. Pure, unit-tested.
 *
 * A register entry gives a name, a speciality (read from the degree) and a
 * state. That is far less than the live worker has for an existing profile
 * (clinic name, address, phone), so the bar here is different and stricter
 * on what it can check:
 *
 *   - the listing name must carry the doctor's name (every core token for a
 *     two-token name; at least two, plus no contradiction, for longer ones);
 *   - the listing address must be in the council's state;
 *   - the listing must be a health place;
 *   - exactly ONE listing may pass — two plausible "Dr Ramesh Kumar"s in
 *     the same state is an ambiguity, not a match.
 *
 * A hospital listing that does not name the doctor never matches; those
 * doctors stay as drafts. That is the intended outcome, not a gap.
 */

const HEALTH_TYPES = new Set(["doctor", "hospital", "health", "dentist", "physiotherapist", "medical_lab", "dental_clinic", "medical_clinic", "wellness_center", "skin_care_clinic", "pharmacy"]);

export interface RegisterDoctor {
  name: string;
  specialtyName: string;
  stateName: string;
}

export interface RegisterMatch {
  status: "matched" | "no_match" | "ambiguous";
  query: string;
  best: PlaceHit | null;
  reasons: string[];
  passing: number;
}

export function buildRegisterQuery(d: RegisterDoctor): string {
  return `Dr ${d.name} ${d.specialtyName}, ${d.stateName}, India`.replace(/\s+/g, " ").trim();
}

/** Does the listing name carry the doctor's name? */
export function listingNamesDoctor(listingName: string, doctorName: string): boolean {
  const core = coreTokens(doctorName);
  if (core.length < 2) return false;
  const ln = ` ${listingName.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  const present = core.filter((t) => ln.includes(` ${t} `));
  if (core.length === 2) return present.length === 2;
  return present.length >= 2 && present.length >= core.length - 1;
}

export function inState(address: string, stateName: string): boolean {
  const a = address.toLowerCase();
  const st = stateName.toLowerCase();
  if (a.includes(st)) return true;
  // Google's short forms and the older spellings the address line still carries.
  const alt: Record<string, string[]> = { "jammu and kashmir": ["jammu & kashmir", "jammu"], odisha: ["orissa"], delhi: ["new delhi"], puducherry: ["pondicherry"], uttarakhand: ["uttaranchal"] };
  return (alt[st] ?? []).some((v) => a.includes(v));
}

export function isHealthPlace(types: string[]): boolean {
  return types.some((t) => HEALTH_TYPES.has(t));
}

export function pickRegisterMatch(hits: PlaceHit[], d: RegisterDoctor, query: string): RegisterMatch {
  const passing: Array<{ hit: PlaceHit; reasons: string[] }> = [];
  for (const hit of hits) {
    const reasons: string[] = [];
    if (!listingNamesDoctor(hit.name, d.name)) continue;
    reasons.push("doctor named in listing");
    if (!inState(hit.address, d.stateName)) continue;
    reasons.push(`address in ${d.stateName}`);
    if (!isHealthPlace(hit.types)) continue;
    reasons.push("health listing");
    passing.push({ hit, reasons });
  }
  // The same clinic listed twice (branch + main) is one place, not an ambiguity.
  const distinct = new Map<string, { hit: PlaceHit; reasons: string[] }>();
  for (const p of passing) distinct.set(`${p.hit.name.toLowerCase()}|${p.hit.address.toLowerCase().replace(/\d/g, "")}`, p);
  if (distinct.size === 1) {
    const [p] = distinct.values();
    return { status: "matched", query, best: p.hit, reasons: p.reasons, passing: 1 };
  }
  if (distinct.size > 1) return { status: "ambiguous", query, best: null, reasons: [`${distinct.size} listings name the doctor in ${d.stateName}`], passing: distinct.size };
  return { status: "no_match", query, best: null, reasons: hits.length ? ["no listing names the doctor in the state"] : ["no results"], passing: 0 };
}

/** "12, 1st Main Rd, Jayanagar, Bengaluru, Karnataka 560011, India" → { city: "Bengaluru", area: "Jayanagar", postalCode: "560011", street: "12, 1st Main Rd" } */
export function parseIndianAddress(address: string, stateName: string): { city: string | null; area: string | null; postalCode: string | null; street: string } {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const postalCode = address.match(/\b\d{6}\b/)?.[0] ?? null;
  if (parts.length && /^india$/i.test(parts[parts.length - 1])) parts.pop();
  let stateIdx = parts.findIndex((p) => inState(p, stateName));
  if (stateIdx === -1) stateIdx = parts.length; // state missing: treat the last part as the city
  const city = stateIdx >= 1 ? parts[stateIdx - 1].replace(/\b\d{6}\b/, "").trim() || null : null;
  const areaRaw = stateIdx >= 2 ? parts[stateIdx - 2] : null;
  const area = areaRaw && !/\d/.test(areaRaw) && !/\b(road|rd|street|st|main|cross|lane|floor|no)\b/i.test(areaRaw) ? areaRaw : null;
  const street = parts.slice(0, Math.max(0, stateIdx - 1)).join(", ");
  return { city, area, postalCode, street: street || address };
}
