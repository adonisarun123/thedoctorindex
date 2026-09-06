import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingView } from "@/components/ListingView";
import type { RouteMetaData } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
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
 * Listings render per request: they read filter/sort parameters, and with
 * hundreds of cities and dozens of specialities there are far too many valid
 * combinations to prerender. Whether a page is *indexed* is the gate's
 * decision, not the build's — building a page and submitting it to Google
 * are different acts. The data behind a listing is one capped query plus
 * cached geography, so a render is cheap.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const resolved = await resolve(await params);
  if (!resolved) return { title: "Page not found", robots: { index: false, follow: false } };

  const sp = await searchParams;
  const { specialty, city, locality, canonicalPath, placeName } = resolved;
  const indexableCount = await countIndexable(specialty.key, locality ? { localityKey: locality.key } : { stateSlug: city.stateSlug, citySlug: city.slug });
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", indexableCount, Boolean(specialty.guide)));
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
  const resolved = await resolve(await params);
  if (!resolved) notFound();

  const sp = await searchParams;
  const { specialty, city, locality, canonicalPath, placeName } = resolved;
  const indexableCount = await countIndexable(specialty.key, locality ? { localityKey: locality.key } : { stateSlug: city.stateSlug, citySlug: city.slug });
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", indexableCount, Boolean(specialty.guide)));
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
      city={city}
      locality={locality}
      searchParams={sp}
      routeMeta={routeMeta}
    />
  );
}
