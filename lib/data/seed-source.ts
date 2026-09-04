import { lookupRedirect } from "@/lib/seo/redirects";
import { SEED_DOCTORS } from "@/lib/data/doctors";
import { LOCALITIES, resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { isProfileIndexable } from "@/lib/seo/gates";
import type { Doctor, DoctorView, LocalityKey, SpecialtyKey } from "@/lib/types";

/**
 * Fixture-backed data source. Same interface as the Postgres source, no
 * infrastructure. Used when DATABASE_URL is absent or DATA_SOURCE=seed.
 */

const CURRENT_YEAR = 2026;

function toSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, "-")}-${id}`;
}

function decorate(raw: Omit<Doctor, "slug">): DoctorView {
  const doctor: Doctor = {
    ...raw,
    slug: toSlug(raw.name, raw.id),
    practices: raw.practices.map((p) => ({ ...p, lat: LOCALITIES[p.locality].lat, lng: LOCALITIES[p.locality].lng, geoSource: "locality" as const })),
  };
  return {
    ...doctor,
    lifecycle: "published",
    yearsOfExperience: CURRENT_YEAR - doctor.practiceStartYear,
    localities: Array.from(new Set(doctor.practices.map((p) => p.locality))),
    indexable: isProfileIndexable(doctor),
    hasEvidenceReviews: doctor.reviews.some((r) => r.evidenceChecked),
  };
}

const ALL: DoctorView[] = SEED_DOCTORS.map(decorate);
const BY_SLUG = new Map(ALL.map((d) => [d.slug, d]));
const BY_REGISTRATION = new Map(ALL.map((d) => [d.registration.number.toUpperCase().replace(/[^A-Z0-9]/g, ""), d]));

export const seedSource = {
  async getAllDoctors(): Promise<DoctorView[]> {
    return ALL;
  },
  async getDoctorBySlug(slug: string): Promise<DoctorView | null> {
    return BY_SLUG.get(slug) ?? null;
  },
  async canonicalDoctorPath(slug: string): Promise<string | null> {
    const fromTable = lookupRedirect(`/doctor/${slug}`);
    if (fromTable) return fromTable;
    const publicId = slug.slice(slug.lastIndexOf("-") + 1);
    const d = ALL.find((x) => x.id === publicId);
    return d && d.slug !== slug ? `/doctor/${d.slug}` : null;
  },
  async findByRegistration(registrationNumber: string): Promise<DoctorView | null> {
    return BY_REGISTRATION.get(registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, "")) ?? null;
  },
  async getDoctorsBySpecialty(specialty: SpecialtyKey): Promise<DoctorView[]> {
    return ALL.filter((d) => d.specialty === specialty);
  },
  async getDoctorsBySpecialtyAndLocality(specialty: SpecialtyKey, locality: LocalityKey): Promise<DoctorView[]> {
    return ALL.filter((d) => d.specialty === specialty && d.localities.includes(locality));
  },
  async countIndexable(specialty: SpecialtyKey, locality?: LocalityKey): Promise<number> {
    return ALL.filter((d) => d.specialty === specialty && d.indexable && (!locality || d.localities.includes(locality))).length;
  },
  async searchDoctors(query: string): Promise<DoctorView[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const spec = resolveSpecialtyQuery(q)?.key;
    return ALL.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.includes(q) || d.specialty === spec || d.subspecialties.some((x) => x.toLowerCase().includes(q)));
  },
  async getNearby(doctor: DoctorView, limit = 4): Promise<DoctorView[]> {
    const pool = ALL.filter((d) => d.slug !== doctor.slug && d.specialty === doctor.specialty && d.indexable);
    const shares = (d: DoctorView) => d.localities.some((l) => doctor.localities.includes(l));
    return [...pool.filter(shares), ...pool.filter((d) => !shares(d))].slice(0, limit);
  },
  async getDoctorsByLocality(locality: LocalityKey): Promise<DoctorView[]> {
    return ALL.filter((d) => d.localities.includes(locality));
  },
};
