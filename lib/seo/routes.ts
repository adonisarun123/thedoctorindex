/**
 * The SEO route set, built from supply counts (plan §11.4).
 *
 * Pure: no database. recomputeSeoRoutes() in lib/services/seo.ts feeds it the
 * same counts the sitemap and the listing pages read (countsBySpecialty,
 * countsByCitySpecialty, countsByLocalityAll over the "eligible" pool), so
 * the admin allowlist describes the routes the site actually serves —
 * nationwide — rather than a narrower pool of its own.
 *
 * Until 12 Oct 2026 the recompute counted only quality-gated, freshly
 * confirmed doctors while the public gates (in "all" mode) count every
 * published profile with a practice. With 16 confirmed practices in the whole
 * database the allowlist held 69 routes, 20 of them in Bengaluru, and called
 * 6 indexable — while the sitemap was submitting over 4,000 listing pages
 * across 33 states. Two sources of truth, one of them blind.
 */

export type SeoRouteKind = "national" | "city" | "locality";

export interface RouteSpecialty {
  key: string;
  slug: string;
}

export interface RouteLocality {
  key: string;
  slug: string;
  citySlug: string;
  stateSlug: string;
}

export interface RouteGates {
  national: number;
  city: number;
  locality: number;
}

export interface SupplyCounts {
  /** Distinct doctors per speciality, nationwide. */
  national: Record<string, number>;
  /** Distinct doctors per (state, city, speciality). */
  city: Array<{ stateSlug: string; citySlug: string; specialty: string; n: number }>;
  /** Distinct doctors per (locality, speciality). */
  locality: Array<{ stateSlug: string; citySlug: string; localityKey?: string | null; specialty: string; n: number }>;
}

export interface SeoRouteRow {
  kind: SeoRouteKind;
  specialtyKey: string;
  localityKey: string | null;
  path: string;
  indexableCount: number;
  computedIndexable: boolean;
}

/**
 * Each level is counted on its own (count(distinct doctor) per grouping), the
 * way the pages count, so a doctor practising in two localities of one city
 * is one doctor on the city row. Rows are therefore not summable across
 * levels, and that is correct.
 */
export function buildSeoRoutes(counts: SupplyCounts, specialties: RouteSpecialty[], localities: RouteLocality[], gates: RouteGates): SeoRouteRow[] {
  const specByKey = new Map(specialties.map((sp) => [sp.key, sp]));
  const locByKey = new Map(localities.map((l) => [l.key, l]));
  const out: SeoRouteRow[] = [];
  const seen = new Set<string>();
  const push = (r: SeoRouteRow) => {
    if (seen.has(r.path)) return;
    seen.add(r.path);
    out.push(r);
  };

  // Every active speciality has a national page, listed even at zero so staff
  // can see which specialities the site has no supply for.
  for (const sp of specialties) {
    const n = Number(counts.national[sp.key] ?? 0);
    push({ kind: "national", specialtyKey: sp.key, localityKey: null, path: `/specialties/${sp.key}`, indexableCount: n, computedIndexable: n >= gates.national });
  }

  for (const r of counts.city) {
    const sp = specByKey.get(r.specialty);
    const n = Number(r.n);
    if (!sp || !r.stateSlug || !r.citySlug || !(n >= 1)) continue;
    push({ kind: "city", specialtyKey: sp.key, localityKey: null, path: `/doctors/${r.stateSlug}/${r.citySlug}/${sp.slug}`, indexableCount: n, computedIndexable: n >= gates.city });
  }

  for (const r of counts.locality) {
    const sp = specByKey.get(r.specialty);
    const loc = r.localityKey ? locByKey.get(r.localityKey) : undefined;
    const n = Number(r.n);
    // A locality filed under another city than its facility row claims is a
    // data error the sitemap also skips; it gets no route until the geography
    // is fixed.
    if (!sp || !loc || loc.stateSlug !== r.stateSlug || loc.citySlug !== r.citySlug || !(n >= 1)) continue;
    push({ kind: "locality", specialtyKey: sp.key, localityKey: loc.key, path: `/doctors/${loc.stateSlug}/${loc.citySlug}/${loc.slug}/${sp.slug}`, indexableCount: n, computedIndexable: n >= gates.locality });
  }

  return out;
}
