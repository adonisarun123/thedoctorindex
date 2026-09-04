import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingView } from "@/components/ListingView";
import type { RouteMetaData } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
import { CITY, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS, localityBySlug, specialtyBySlug } from "@/lib/data/taxonomy";
import { GATES, hasFacetParams, listingGate } from "@/lib/seo/gates";
import { withOverride } from "@/lib/seo/override";
import { absoluteUrl, paths } from "@/lib/site";
import type { Locality, Specialty } from "@/lib/types";

/**
 * City × speciality and locality × speciality listings.
 *
 * One catch-all rather than two routes, because Next.js will not accept two
 * differently-named dynamic segments at the same depth. Segment count decides:
 *   1 → /doctors/karnataka/bengaluru/cardiologists
 *   2 → /doctors/karnataka/bengaluru/indiranagar/cardiologists
 * Anything else is not a page we have — it returns a genuine 404 rather than
 * an empty listing.
 */

type Params = { state: string; city: string; segments: string[] };
type Search = Record<string, string | string[] | undefined>;

interface Resolved {
  specialty: Specialty;
  locality: Locality | null;
  canonicalPath: string;
}

function resolve(params: Params): Resolved | null {
  const { state, city, segments } = params;
  if (state !== CITY.stateSlug || city !== CITY.slug) return null;
  if (segments.length === 1) {
    const specialty = specialtyBySlug(segments[0]);
    if (!specialty) return null;
    return {
      specialty,
      locality: null,
      canonicalPath: paths.citySpecialty(state, city, specialty.slug),
    };
  }
  if (segments.length === 2) {
    const locality = localityBySlug(segments[0]);
    const specialty = specialtyBySlug(segments[1]);
    if (!locality || !specialty) return null;
    return {
      specialty,
      locality,
      canonicalPath: paths.localitySpecialty(state, city, locality.key, specialty.slug),
    };
  }
  return null;
}

/**
 * Every valid combination is prerendered so patients get a fast page. Whether
 * it is *indexed* is a separate decision, made by the gate below — building a
 * page and submitting it to Google are not the same act.
 */
export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const key of SPECIALTY_KEYS) {
    out.push({ state: CITY.stateSlug, city: CITY.slug, segments: [SPECIALTIES[key].slug] });
    for (const loc of LOCALITY_KEYS) {
      out.push({
        state: CITY.stateSlug,
        city: CITY.slug,
        segments: [loc, SPECIALTIES[key].slug],
      });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return { title: "Page not found", robots: { index: false, follow: false } };

  const sp = await searchParams;
  const { specialty, locality, canonicalPath } = resolved;
  const placeName = locality ? `${locality.name}, ${locality.city}` : CITY.name;
  const indexableCount = await countIndexable(specialty.key, locality?.key);
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", indexableCount, true));
  const faceted = hasFacetParams(sp);

  return {
    // "Verified", never "Best". "Best cardiologists in Bengaluru" needs a
    // published methodology, minimum review volume and recency criteria that we
    // are not prepared to defend, so we do not use the word.
    title: `Verified ${specialty.plural} in ${placeName}`,
    description: `${indexableCount} verified ${specialty.plural.toLowerCase()} in ${placeName}, each showing registration, qualification and current practice with the date it was checked.`,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    robots: {
      index: gate.indexable && !faceted,
      follow: true,
    },
    openGraph: {
      title: `Verified ${specialty.plural} in ${placeName}`,
      url: absoluteUrl(canonicalPath),
    },
  };
}

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const resolved = resolve(await params);
  if (!resolved) notFound();

  const sp = await searchParams;
  const { specialty, locality, canonicalPath } = resolved;
  const placeName = locality ? `${locality.name}, ${locality.city}` : CITY.name;
  const indexableCount = await countIndexable(specialty.key, locality?.key);
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", indexableCount, true));
  const faceted = hasFacetParams(sp);

  const routeMeta: RouteMetaData = {
    route: locality ? "Locality × speciality" : "City × speciality",
    title: `Verified ${specialty.plural} in ${placeName} | The Doctor Index`,
    h1: `${specialty.plural} in ${placeName}`,
    canonical: absoluteUrl(canonicalPath),
    index: gate.indexable && !faceted,
    gate: {
      name: `Inventory gate (threshold ${locality ? GATES.localitySpecialty : GATES.citySpecialty})`,
      checks: gate.checks,
    },
    structuredData: "CollectionPage, ItemList, BreadcrumbList",
    notes: [
      {
        label: "Facets",
        text: faceted
          ? "A filter or sort parameter is present, so this view is noindex,follow. The canonical still points at the unfiltered page."
          : "No filter or sort parameter present. Any filter, sort or page parameter makes the view a facet and sets noindex — we never expose an unlimited crawlable parameter space.",
      },
      {
        label: "Title wording",
        text: 'We use "Verified", never "Best". A best-of page would need a published methodology, a minimum review volume and recency criteria before it could be defended.',
      },
    ],
  };

  return (
    <ListingView
      specialty={specialty}
      locality={locality}
      searchParams={sp}
      routeMeta={routeMeta}
    />
  );
}
