import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingView } from "@/components/ListingView";
import type { RouteMetaData } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
import { CITY, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { GATES, hasFacetParams, listingGate } from "@/lib/seo/gates";
import { resolveListing, type ListingParams } from "@/lib/seo/listing";
import { pageMeta } from "@/lib/seo/meta";
import { withOverride } from "@/lib/seo/override";
import { absoluteUrl, paths } from "@/lib/site";

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

type Params = ListingParams;
type Search = Record<string, string | string[] | undefined>;

const resolve = resolveListing;

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

  // "Verified", never "Best". "Best cardiologists in Bengaluru" needs a
  // published methodology, minimum review volume and recency criteria that we
  // are not prepared to defend, so we do not use the word.
  return pageMeta({
    title: `Verified ${specialty.plural} in ${placeName}`,
    description: `${indexableCount} verified ${(indexableCount === 1 ? specialty.one : specialty.plural).toLowerCase()} in ${placeName}: registration, qualification and practice checked and dated. Filter by locality, language, fee and mode.`,
    path: canonicalPath,
    index: gate.indexable && !faceted,
    image: { url: absoluteUrl(`/og/listing${canonicalPath.replace(/^\/doctors/, "")}`), alt: `Verified ${specialty.plural} in ${placeName}` },
  });
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
