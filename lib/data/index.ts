import "server-only";

import { dbSource } from "@/lib/data/db-source";
import { emptySource } from "@/lib/data/empty-source";
import { seedSource } from "@/lib/data/seed-source";
import { databaseReadyForBuild, isBuildPhase } from "@/lib/db/readiness";
import type { DoctorView, ListingFilters, SpecialtyKey } from "@/lib/types";

/**
 * The data access boundary.
 *
 * Two sources implement the same interface:
 *   db    — Postgres via Drizzle (lib/data/db-source.ts). Used whenever
 *           DATABASE_URL is set, unless DATA_SOURCE=seed forces the fixture.
 *   seed  — the fictional records in lib/data/doctors.ts. Zero infrastructure;
 *           used for builds and previews that have no database.
 *
 * A third, empty source stands in during `next build` only, when DATABASE_URL
 * is set but the database is unreachable or not yet migrated
 * (lib/db/readiness.ts): the build succeeds and the prerendered pages
 * regenerate from the database on their next revalidation.
 *
 * Every function is async so the two are interchangeable. Routes, sitemaps and
 * components consume only this module. Nothing here returns "all doctors":
 * with tens of thousands of records every reader names the slice it needs
 * (a city, a locality, a speciality) and the source answers with a query.
 */

/** Where a listing or a count is scoped. All fields optional; narrower wins. */
export interface Place {
  stateSlug?: string;
  citySlug?: string;
  localityKey?: string;
}

/** Which doctors a count includes: those passing every gate, or every published one. */
export type Measure = "indexable" | "published";

export interface PlaceCount {
  stateSlug: string;
  citySlug: string;
  n: number;
}

export interface Totals {
  published: number;
  indexable: number;
  claimed: number;
  /** Practice locations confirmed with the practice at least once. */
  practices: number;
  cities: number;
}

/** Listings are capped: a city with 4,000 family physicians is browsed by locality and filter, not scrolled. */
export const LISTING_CAP = 200;
/** Rows rendered per page of a listing; further pages are `?page=` facets (noindex, canonical unchanged). */
export const LISTING_PAGE = 60;

export type DataSource = {
  getDoctorBySlug(slug: string): Promise<DoctorView | null>;
  /** Canonical /doctor path for a stale slug (rename or merge), or null when unknown. */
  canonicalDoctorPath(slug: string): Promise<string | null>;
  findByRegistration(registrationNumber: string): Promise<DoctorView | null>;
  /** Published doctors of one speciality in a place, best-first, capped at LISTING_CAP. */
  getListing(specialty: SpecialtyKey, place: Place, limit?: number): Promise<DoctorView[]>;
  countIndexable(specialty: SpecialtyKey, place?: Place): Promise<number>;
  /** Count per speciality key within a place (missing key = 0). */
  countsBySpecialty(place?: Place, measure?: Measure): Promise<Record<string, number>>;
  /** Count per city, optionally for one speciality, descending. */
  countsByCity(specialty?: SpecialtyKey, measure?: Measure): Promise<PlaceCount[]>;
  /** Indexable count per locality key within a city, optionally for one speciality. */
  countsByLocality(citySlug: string, specialty?: SpecialtyKey): Promise<Record<string, number>>;
  /** Indexable count per (locality key, speciality key) within a city — one query for a city hub. */
  countsByLocalitySpecialty(citySlug: string): Promise<Array<{ localityKey: string; specialty: string; n: number }>>;
  countsByState(measure?: Measure): Promise<Record<string, number>>;
  /** Published / indexable / claimed / practice counts, optionally within a place. */
  totals(place?: Place): Promise<Totals>;
  searchDoctors(query: string, place?: Place): Promise<DoctorView[]>;
  getNearby(doctor: DoctorView, limit?: number): Promise<DoctorView[]>;
  /** Indexable doctors with a photo or a claim first — the home page strip. */
  getFeatured(limit: number, place?: Place): Promise<DoctorView[]>;
  /** Slug + last verification date for every indexable doctor (sitemap). */
  listIndexableSlugs(): Promise<Array<{ slug: string; lastVerifiedOn: string }>>;
  /** Doctors a person has a relationship with (dashboard, account); by database id. */
  getDoctorByDbId?(id: string): Promise<DoctorView | null>;
};

export function activeSourceName(): "db" | "seed" {
  if (process.env.DATA_SOURCE === "seed") return "seed";
  if (process.env.DATA_SOURCE === "db") return "db";
  return process.env.DATABASE_URL ? "db" : "seed";
}

async function source(): Promise<DataSource> {
  if (activeSourceName() !== "db") return seedSource;
  if (isBuildPhase() && !(await databaseReadyForBuild())) return emptySource;
  return dbSource;
}

export const getDoctorBySlug = async (slug: string) => (await source()).getDoctorBySlug(slug);
export const canonicalDoctorPath = async (slug: string) => (await source()).canonicalDoctorPath(slug);
export const findByRegistration = async (n: string) => (await source()).findByRegistration(n);
export const getListing = async (k: SpecialtyKey, place: Place, limit?: number) => (await source()).getListing(k, place, limit);
export const countIndexable = async (k: SpecialtyKey, place?: Place) => (await source()).countIndexable(k, place);
export const countsBySpecialty = async (place?: Place, measure?: Measure) => (await source()).countsBySpecialty(place, measure);
export const countsByCity = async (k?: SpecialtyKey, measure?: Measure) => (await source()).countsByCity(k, measure);
export const countsByLocality = async (citySlug: string, k?: SpecialtyKey) => (await source()).countsByLocality(citySlug, k);
export const countsByLocalitySpecialty = async (citySlug: string) => (await source()).countsByLocalitySpecialty(citySlug);
export const countsByState = async (measure?: Measure) => (await source()).countsByState(measure);
export const totals = async (place?: Place) => (await source()).totals(place);
export const searchDoctors = async (q: string, place?: Place) => (await source()).searchDoctors(q, place);
export const getNearby = async (d: DoctorView, limit?: number) => (await source()).getNearby(d, limit);
export const getFeatured = async (limit: number, place?: Place) => (await source()).getFeatured(limit, place);
export const listIndexableSlugs = async () => (await source()).listIndexableSlugs();

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
