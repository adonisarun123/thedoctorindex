import type { CouncilKind } from "@/lib/data/councils";
import { STATE_MEDICAL_COUNCILS } from "@/lib/registers/entries/state-medical-1";
import { STATE_MEDICAL_COUNCILS_2 } from "@/lib/registers/entries/state-medical-2";
import { NATIONAL_MEDICAL } from "@/lib/registers/entries/national-medical";
import { OTHER_REGISTERS } from "@/lib/registers/entries/other";
import { normalizeCouncil, type RegisterEntry } from "@/lib/registers/types";

export * from "@/lib/registers/types";

/**
 * Every register page, in hub order: the national medical bodies, the state
 * medical councils (largest supply on this site first, then the rest), then
 * dental, AYUSH and allied-health bodies.
 */
export const REGISTERS: RegisterEntry[] = [...NATIONAL_MEDICAL, ...STATE_MEDICAL_COUNCILS, ...STATE_MEDICAL_COUNCILS_2, ...OTHER_REGISTERS];

export const REGISTER_GROUPS: Array<{ kind: CouncilKind; name: string; blurb: string }> = [
  { kind: "medical", name: "Modern medicine", blurb: "The NMC and the state medical councils. Every number here is searchable on the Indian Medical Register." },
  { kind: "dental", name: "Dentistry", blurb: "State dental councils under the National Dental Commission. Not on the NMC register." },
  { kind: "ayush", name: "Ayurveda, Unani, Siddha, Sowa-Rigpa and Homoeopathy", blurb: "National commissions and the state boards that register practitioners. Not on the NMC register." },
  { kind: "allied", name: "Allied and rehabilitation professions", blurb: "Physiotherapy, clinical psychology, audiology and the rest. Statutory registers where they exist, professional bodies where they do not." },
];

const BY_SLUG = new Map(REGISTERS.map((r) => [r.slug, r]));

/** Council string → register entry, by normalised name. One council string maps to at most one register. */
const BY_MATCH = new Map<string, RegisterEntry>();
for (const r of REGISTERS) for (const m of r.match) if (!BY_MATCH.has(m)) BY_MATCH.set(m, r);

export function registerBySlug(slug: string): RegisterEntry | null {
  return BY_SLUG.get(slug) ?? null;
}

/** The register page for a council name as written on a profile, if one exists. */
export function registerForCouncil(council: string | null | undefined): RegisterEntry | null {
  if (!council) return null;
  return BY_MATCH.get(normalizeCouncil(council)) ?? null;
}

export function registersOf(kind: CouncilKind): RegisterEntry[] {
  return REGISTERS.filter((r) => r.kind === kind);
}

/** Related registers: the entry's own picks, topped up from its group, never itself. */
export function relatedRegisters(r: RegisterEntry, count = 3): RegisterEntry[] {
  const out: RegisterEntry[] = [];
  const add = (x: RegisterEntry | null) => {
    if (x && x.slug !== r.slug && !out.some((y) => y.slug === x.slug)) out.push(x);
  };
  (r.related ?? []).forEach((s) => add(registerBySlug(s)));
  registersOf(r.kind).forEach(add);
  REGISTERS.forEach(add);
  return out.slice(0, count);
}
