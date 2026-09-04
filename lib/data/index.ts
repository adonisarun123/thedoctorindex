import "server-only";

import { dbSource } from "@/lib/data/db-source";
import { seedSource } from "@/lib/data/seed-source";
import type { DoctorView, ListingFilters, LocalityKey, SpecialtyKey } from "@/lib/types";

/**
 * The data access boundary.
 *
 * Two sources implement the same interface:
 *   db    — Postgres via Drizzle (lib/data/db-source.ts). Used whenever
 *           DATABASE_URL is set, unless DATA_SOURCE=seed forces the fixture.
 *   seed  — the fictional records in lib/data/doctors.ts. Zero infrastructure;
 *           used for builds and previews that have no database.
 *
 * Every function is async so the two are interchangeable. Routes, sitemaps and
 * components consume only this module.
 */

export type DataSource = {
  getAllDoctors(): Promise<DoctorView[]>;
  getDoctorBySlug(slug: string): Promise<DoctorView | null>;
  /** Canonical /doctor path for a stale slug (rename or merge), or null when unknown. */
  canonicalDoctorPath(slug: string): Promise<string | null>;
  findByRegistration(registrationNumber: string): Promise<DoctorView | null>;
  getDoctorsBySpecialty(specialty: SpecialtyKey): Promise<DoctorView[]>;
  getDoctorsBySpecialtyAndLocality(specialty: SpecialtyKey, locality: LocalityKey): Promise<DoctorView[]>;
  countIndexable(specialty: SpecialtyKey, locality?: LocalityKey): Promise<number>;
  searchDoctors(query: string): Promise<DoctorView[]>;
  getNearby(doctor: DoctorView, limit?: number): Promise<DoctorView[]>;
  getDoctorsByLocality(locality: LocalityKey): Promise<DoctorView[]>;
};

export function activeSourceName(): "db" | "seed" {
  if (process.env.DATA_SOURCE === "seed") return "seed";
  if (process.env.DATA_SOURCE === "db") return "db";
  return process.env.DATABASE_URL ? "db" : "seed";
}

function source(): DataSource {
  return activeSourceName() === "db" ? dbSource : seedSource;
}

export const getAllDoctors = () => source().getAllDoctors();
export const getDoctorBySlug = (slug: string) => source().getDoctorBySlug(slug);
export const canonicalDoctorPath = (slug: string) => source().canonicalDoctorPath(slug);
export const findByRegistration = (n: string) => source().findByRegistration(n);
export const getDoctorsBySpecialty = (k: SpecialtyKey) => source().getDoctorsBySpecialty(k);
export const getDoctorsBySpecialtyAndLocality = (k: SpecialtyKey, l: LocalityKey) => source().getDoctorsBySpecialtyAndLocality(k, l);
export const countIndexable = (k: SpecialtyKey, l?: LocalityKey) => source().countIndexable(k, l);
export const searchDoctors = (q: string) => source().searchDoctors(q);
export const getNearby = (d: DoctorView, limit?: number) => source().getNearby(d, limit);
export const getDoctorsByLocality = (l: LocalityKey) => source().getDoctorsByLocality(l);

/* Pure helpers, source-independent. */

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

export function allLanguages(pool: DoctorView[]): string[] {
  return Array.from(new Set(pool.flatMap((d) => d.languages))).sort();
}
