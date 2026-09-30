import { SPECIALTIES } from "@/lib/data/specialties";
import type { SpecialtyKey } from "@/lib/types";

/**
 * How a practitioner is named on every public surface.
 *
 * "Dr" for medical, dental and AYUSH practitioners.
 *
 * Physiotherapists are "Dr <Name> (PT)". The NCAHP 2025 physiotherapy
 * curriculum sets the title as prefix "Dr" with suffix "PT"; DGHS's Sep 2025
 * direction against the prefix was withdrawn, and the Kerala High Court
 * (22 Jan 2026) upheld the prefix. Older rulings (Bengaluru 2020, Madras HC
 * 2022) went the other way, so the "(PT)" suffix is never dropped — it is the
 * qualifier the regulator and the court both rely on.
 *
 * Nothing for the other allied-health professions — dietitians, clinical
 * psychologists, audiologists, occupational therapists — where no regulator
 * backs the title and the site would otherwise assert a qualification it has
 * not seen. The speciality's `system` decides, so a new allied speciality is
 * covered by setting that one field.
 */
const DR_WITH_SUFFIX: Partial<Record<SpecialtyKey, string>> = {
  physiotherapy: "PT",
};

export function honorific(specialty: SpecialtyKey | string | null | undefined): string {
  if (specialty && DR_WITH_SUFFIX[specialty as SpecialtyKey]) return "Dr ";
  const sp = specialty ? SPECIALTIES[specialty as SpecialtyKey] : undefined;
  return sp?.system === "allied" ? "" : "Dr ";
}

/** The post-nominal that qualifies the honorific ("PT" for physiotherapists), or "". */
export function postnominal(specialty: SpecialtyKey | string | null | undefined): string {
  return (specialty && DR_WITH_SUFFIX[specialty as SpecialtyKey]) || "";
}

/** Whether the practitioner is a physician for schema.org purposes (IndividualPhysician). */
export function isPhysician(specialty: SpecialtyKey | string | null | undefined): boolean {
  return honorific(specialty) !== "" && postnominal(specialty) === "";
}

export function displayName(d: { name: string; specialty?: SpecialtyKey | string | null; specialtyKey?: string | null }): string {
  const specialty = d.specialty ?? d.specialtyKey;
  let bare = d.name.replace(/^dr\.?\s*/i, "").trim();
  const suffix = postnominal(specialty);
  if (suffix) {
    // A stored name that already carries the post-nominal, or a degree tail
    // ("…, PT, BPT, MPT (Neuro)"), must not be doubled. Degrees live in
    // doctor_qualifications; the name is the name.
    bare = bare
      .replace(/,.*$/, "")
      .replace(new RegExp(`^${suffix}\\.?\\s+`, "i"), "")
      .replace(new RegExp(`\\s+${suffix}\\.?$`, "i"), "")
      .trim();
    return `Dr ${bare} (${suffix})`;
  }
  return `${honorific(specialty)}${bare}`;
}
