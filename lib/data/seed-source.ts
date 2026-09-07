import { lookupRedirect } from "@/lib/seo/redirects";
import { SEED_DOCTORS, type SeedDoctor } from "@/lib/data/doctors";
import { LOCALITIES, resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { isProfileIndexable, isProfileVerified } from "@/lib/seo/gates";
import type { DataSource, Measure, Place, PlaceCount, PlaceSpecialtyCount, Totals } from "@/lib/data/index";
import type { Doctor, DoctorView, Practice, SpecialtyKey } from "@/lib/types";
import { registrationTier } from "@/lib/verification";

/**
 * Fixture-backed data source. Same interface as the Postgres source, no
 * infrastructure. Used when DATABASE_URL is absent or DATA_SOURCE=seed.
 */

const CURRENT_YEAR = 2026;

function toSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, "-")}-${id}`;
}

function decorate(raw: SeedDoctor): DoctorView {
  const practices: Practice[] = raw.practices.map((p) => {
    const l = LOCALITIES[p.locality];
    return { ...p, localityName: l.name, localitySlug: l.slug, city: l.city, citySlug: l.citySlug, state: l.state, stateSlug: l.stateSlug, lat: l.lat ?? undefined, lng: l.lng ?? undefined, geoSource: "locality" as const };
  });
  const doctor: Doctor = { ...raw, slug: toSlug(raw.name, raw.id), practices };
  return {
    ...doctor,
    lifecycle: "published",
    yearsOfExperience: CURRENT_YEAR - doctor.practiceStartYear,
    localities: Array.from(new Set(practices.map((p) => p.locality))),
    citySlugs: Array.from(new Set(practices.map((p) => p.citySlug))),
    indexable: isProfileIndexable(doctor),
    hasEvidenceReviews: doctor.reviews.some((r) => r.evidenceChecked),
  };
}

const ALL: DoctorView[] = SEED_DOCTORS.map(decorate);
const BY_SLUG = new Map(ALL.map((d) => [d.slug, d]));
const BY_REGISTRATION = new Map(ALL.map((d) => [d.registration.number.toUpperCase().replace(/[^A-Z0-9]/g, ""), d]));

function inPlace(d: DoctorView, place?: Place): boolean {
  if (!place) return true;
  return d.practices.some((p) => (!place.localityKey || p.locality === place.localityKey) && (!place.citySlug || p.citySlug === place.citySlug) && (!place.stateSlug || p.stateSlug === place.stateSlug));
}

/** Verified supply ("indexable"), everything published ("published"), or whatever the current index mode publishes ("eligible"). */
const matches = (d: DoctorView, measure: Measure) => (measure === "published" ? true : measure === "eligible" ? isProfileIndexable(d) : isProfileVerified(d));
const indexable = (place?: Place, specialty?: SpecialtyKey, measure: Measure = "indexable") => ALL.filter((d) => matches(d, measure) && (!specialty || d.specialty === specialty) && inPlace(d, place));

export const seedSource: DataSource = {
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
  async getListing(specialty: SpecialtyKey, place: Place, limit = 200): Promise<DoctorView[]> {
    return ALL.filter((d) => d.specialty === specialty && inPlace(d, place))
      .sort((a, b) => registrationTier(b) - registrationTier(a) || b.qualityScore - a.qualityScore || a.name.localeCompare(b.name))
      .slice(0, limit);
  },
  async countIndexable(specialty: SpecialtyKey, place?: Place, measure?: Measure): Promise<number> {
    return indexable(place, specialty, measure).length;
  },
  async countsBySpecialty(place?: Place, measure?: Measure): Promise<Record<string, number>> {
    const out: Record<string, number> = {};
    for (const d of indexable(place, undefined, measure)) out[d.specialty] = (out[d.specialty] ?? 0) + 1;
    return out;
  },
  async countsByCity(specialty?: SpecialtyKey, measure?: Measure): Promise<PlaceCount[]> {
    const map = new Map<string, PlaceCount>();
    for (const d of indexable(undefined, specialty, measure)) {
      for (const key of new Set(d.practices.map((p) => `${p.stateSlug}/${p.citySlug}`))) {
        const [stateSlug, citySlug] = key.split("/");
        const cur = map.get(key) ?? { stateSlug, citySlug, n: 0 };
        cur.n++;
        map.set(key, cur);
      }
    }
    return [...map.values()].sort((a, b) => b.n - a.n);
  },
  async countsByLocality(citySlug: string, specialty?: SpecialtyKey, measure?: Measure): Promise<Record<string, number>> {
    const out: Record<string, number> = {};
    for (const d of indexable({ citySlug }, specialty, measure)) for (const l of d.localities) out[l] = (out[l] ?? 0) + 1;
    return out;
  },
  async countsByLocalitySpecialty(citySlug: string, measure?: Measure) {
    const map = new Map<string, { localityKey: string; specialty: string; n: number }>();
    for (const d of indexable({ citySlug }, undefined, measure)) {
      for (const l of d.localities) {
        const k = `${l}|${d.specialty}`;
        const cur = map.get(k) ?? { localityKey: l, specialty: d.specialty, n: 0 };
        cur.n++;
        map.set(k, cur);
      }
    }
    return [...map.values()];
  },
  async countsByCitySpecialty(measure?: Measure): Promise<PlaceSpecialtyCount[]> {
    const map = new Map<string, PlaceSpecialtyCount>();
    for (const d of indexable(undefined, undefined, measure)) {
      for (const key of new Set(d.practices.map((p) => `${p.stateSlug}/${p.citySlug}`))) {
        const [stateSlug, citySlug] = key.split("/");
        const k = `${key}|${d.specialty}`;
        const cur = map.get(k) ?? { stateSlug, citySlug, specialty: d.specialty, n: 0 };
        cur.n++;
        map.set(k, cur);
      }
    }
    return [...map.values()];
  },
  async countsByLocalityAll(measure?: Measure): Promise<PlaceSpecialtyCount[]> {
    const map = new Map<string, PlaceSpecialtyCount>();
    for (const d of indexable(undefined, undefined, measure)) {
      for (const p of d.practices) {
        const k = `${p.stateSlug}/${p.citySlug}/${p.locality}|${d.specialty}`;
        const cur = map.get(k) ?? { stateSlug: p.stateSlug, citySlug: p.citySlug, localityKey: p.locality, specialty: d.specialty, n: 0 };
        cur.n++;
        map.set(k, cur);
      }
    }
    return [...map.values()];
  },
  async countsByState(measure?: Measure): Promise<Record<string, number>> {
    const out: Record<string, number> = {};
    for (const d of indexable(undefined, undefined, measure)) for (const st of new Set(d.practices.map((p) => p.stateSlug))) out[st] = (out[st] ?? 0) + 1;
    return out;
  },
  async totals(place?: Place): Promise<Totals> {
    const pool = ALL.filter((d) => inPlace(d, place));
    return {
      published: pool.length,
      indexable: pool.filter((d) => isProfileVerified(d)).length,
      claimed: pool.filter((d) => d.claimed).length,
      practices: pool.reduce((n, d) => n + d.practices.filter((p) => p.confirmedOn && p.confirmedOn !== "—").length, 0),
      cities: new Set(pool.flatMap((d) => d.citySlugs)).size,
    };
  },
  async searchDoctors(query: string, place?: Place): Promise<DoctorView[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const spec = resolveSpecialtyQuery(q)?.key;
    return ALL.filter((d) => inPlace(d, place) && (d.name.toLowerCase().includes(q) || d.specialty.includes(q) || d.specialty === spec || d.subspecialties.some((x) => x.toLowerCase().includes(q))));
  },
  async getNearby(doctor: DoctorView, limit = 4): Promise<DoctorView[]> {
    const pool = ALL.filter((d) => d.slug !== doctor.slug && d.specialty === doctor.specialty && isProfileVerified(d) && d.citySlugs.some((c) => doctor.citySlugs.includes(c)));
    const shares = (d: DoctorView) => d.localities.some((l) => doctor.localities.includes(l));
    return [...pool.filter(shares), ...pool.filter((d) => !shares(d))].slice(0, limit);
  },
  async getFeatured(limit: number, place?: Place): Promise<DoctorView[]> {
    return indexable(place)
      .sort((a, b) => Number(b.claimed) - Number(a.claimed) || Number(Boolean(b.photoUrl)) - Number(Boolean(a.photoUrl)) || b.qualityScore - a.qualityScore)
      .slice(0, limit);
  },
  async listIndexableSlugs() {
    return ALL.filter((d) => d.indexable).map((d) => ({ slug: d.slug, lastVerifiedOn: d.lastVerifiedOn }));
  },
};
