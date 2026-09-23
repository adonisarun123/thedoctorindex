import { SPECIALTIES } from "@/lib/data/specialties";
import type { SpecialtyKey } from "@/lib/types";

/**
 * How a practitioner is named on every public surface.
 *
 * "Dr" for medical, dental and AYUSH practitioners. Nothing for allied-health
 * professionals — physiotherapists, dietitians, clinical psychologists,
 * audiologists, occupational therapists — where the title is contested (and,
 * for physiotherapists, was the subject of a DGHS direction in India) and
 * where the site would otherwise assert a medical qualification it has not
 * seen. The speciality's `system` decides, so a new allied speciality is
 * covered by setting that one field.
 */
export function honorific(specialty: SpecialtyKey | string | null | undefined): string {
  const sp = specialty ? SPECIALTIES[specialty as SpecialtyKey] : undefined;
  return sp?.system === "allied" ? "" : "Dr ";
}

export function displayName(d: { name: string; specialty?: SpecialtyKey | string | null; specialtyKey?: string | null }): string {
  const bare = d.name.replace(/^dr\.?\s+/i, "").trim();
  return `${honorific(d.specialty ?? d.specialtyKey)}${bare}`;
}
