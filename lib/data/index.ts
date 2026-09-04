import { SEED_DOCTORS } from "@/lib/data/doctors";
import { isProfileIndexable } from "@/lib/seo/gates";
import type { Doctor, DoctorView, ListingFilters, LocalityKey, SpecialtyKey } from "@/lib/types";

/**
 * The data access boundary.
 *
 * Everything above this file (routes, components, sitemaps) reads doctors
 * through these functions. Swapping the seed array for a fetch against the
 * directory API means rewriting only this module.
 *
 * The functions are synchronous today. They are written to be trivially
 * promisified later — routes already `await` where it matters.
 */

const CURRENT_YEAR = 2026;

function toSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, "-")}-${id}`;
}

function decorate(raw: Omit<Doctor, "slug">): DoctorView {
  const doctor: Doctor = { ...raw, slug: toSlug(raw.name, raw.id) };
  return {
    ...doctor,
    yearsOfExperience: CURRENT_YEAR - doctor.practiceStartYear,
    localities: Array.from(new Set(doctor.practices.map((p) => p.locality))),
    indexable: isProfileIndexable(doctor),
    hasEvidenceReviews: doctor.reviews.some((r) => r.evidenceChecked),
  };
}

const ALL: DoctorView[] = SEED_DOCTORS.map(decorate);
const BY_SLUG = new Map(ALL.map((d) => [d.slug, d]));
const BY_REGISTRATION = new Map(ALL.map((d) => [d.registration.number.toUpperCase(), d]));

export function getAllDoctors(): DoctorView[] {
  return ALL;
}

export function getDoctorBySlug(slug: string): DoctorView | null {
  return BY_SLUG.get(slug) ?? null;
}

/**
 * Registration number plus council is the identity key, never the name.
 * Used by the add-doctor flow to catch a duplicate before one is created.
 */
export function findByRegistration(registrationNumber: string): DoctorView | null {
  return BY_REGISTRATION.get(registrationNumber.trim().toUpperCase()) ?? null;
}

export function getDoctorsBySpecialty(specialty: SpecialtyKey): DoctorView[] {
  return ALL.filter((d) => d.specialty === specialty);
}

export function getDoctorsBySpecialtyAndLocality(
  specialty: SpecialtyKey,
  locality: LocalityKey,
): DoctorView[] {
  return ALL.filter((d) => d.specialty === specialty && d.localities.includes(locality));
}

/** Count that the indexation gates are measured against. Indexable profiles only. */
export function countIndexable(specialty: SpecialtyKey, locality?: LocalityKey): number {
  return ALL.filter(
    (d) => d.specialty === specialty && d.indexable && (!locality || d.localities.includes(locality)),
  ).length;
}

export function applyFilters(pool: DoctorView[], f: ListingFilters): DoctorView[] {
  return pool.filter((d) => {
    if (f.locality && !d.localities.includes(f.locality)) return false;
    if (f.online && !d.modes.includes("Online")) return false;
    if (f.gender && d.gender !== f.gender) return false;
    if (f.language && !d.languages.includes(f.language)) return false;
    if (f.minExperience && d.yearsOfExperience < f.minExperience) return false;
    if (f.maxFee && !d.practices.some((p) => p.feeInr !== null && p.feeInr <= f.maxFee!)) return false;
    if (f.claimedOnly && !d.claimed) return false;
    if (f.evidenceOnly && !d.hasEvidenceReviews) return false;
    return true;
  });
}

/** Free-text search across name and speciality. Powers /search, which is noindex. */
export function searchDoctors(query: string): DoctorView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL.filter(
    (d) => d.name.toLowerCase().includes(q) || d.specialty.includes(q) || d.subspecialties.some((s) => s.toLowerCase().includes(q)),
  );
}

export function allLanguages(pool: DoctorView[]): string[] {
  return Array.from(new Set(pool.flatMap((d) => d.languages))).sort();
}
