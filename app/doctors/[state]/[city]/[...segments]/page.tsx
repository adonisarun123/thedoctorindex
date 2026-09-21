import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingView } from "@/components/ListingView";
import type { RouteMetaData } from "@/components/RouteMeta";
import { countIndexable, supplyProfile } from "@/lib/data";
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
  // Three counts, deliberately. `publishedCount` is every listed profile in
  // this place and decides whether the page exists at all: a listing with no
  // profiles behind it is not a thin page to be gated, it is a page we do not
  // have, so it 404s rather than rendering an empty list for Google to crawl.
  // `indexableCount` is verified supply and is what the copy calls verified;
  // `eligibleCount` is the pool the current index mode publishes and is what
  // the gate decides on.
  const gatePlace = locality ? { localityKey: locality.key } : { stateSlug: city.stateSlug, citySlug: city.slug };
  const [publishedCount, indexableCount, eligibleCount] = await Promise.all([
    countIndexable(specialty.key, gatePlace, "published"),
    countIndexable(specialty.key, gatePlace),
    countIndexable(specialty.key, gatePlace, "eligible"),
  ]);
  if (publishedCount === 0) return { title: "Page not found", robots: { index: false, follow: false } };
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", eligibleCount, Boolean(specialty.guide)));
  const faceted = hasFacetParams(sp);

  /*
   * Neither "Best" nor "Verified" in the title.
   *
   * "Best cardiologists in Bengaluru" needs a published methodology, minimum
   * review volume and recency criteria we are not prepared to defend. And
   * "Verified" was worse: `indexableCount` is verified supply, and six of
   * 25,948 published profiles clear the quality gate, so on 21 Sep 2026 this
   * description was rendering "0 verified cardiologists in Bengaluru" under a
   * title asserting they were verified — a claim contradicted by its own
   * first character, on every listing page on the site. The title now states
   * the speciality and the place, and the description counts what is actually
   * on record.
   */
  const profile = await supplyProfile(gatePlace, specialty.key, "published");
  const desc = [
    `${profile.total.toLocaleString("en-IN")} ${(profile.total === 1 ? specialty.one : specialty.plural).toLowerCase()} listed in ${placeName}`,
    profile.facilities > 0 ? ` at ${profile.facilities.toLocaleString("en-IN")} practice ${profile.facilities === 1 ? "address" : "addresses"}` : "",
    profile.withRegistration > 0 ? `, ${profile.withRegistration.toLocaleString("en-IN")} with a council registration on record` : "",
    ". Every profile states what has been checked, and when.",
  ].join("");
  return pageMeta({
    title: `${specialty.plural} in ${placeName}`,
    description: desc,
    path: canonicalPath,
    index: gate.indexable && !faceted,
    image: { url: absoluteUrl(`/og/listing${canonicalPath.replace(/^\/doctors/, "")}`), alt: `${specialty.plural} in ${placeName}` },
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
  // Three counts, deliberately. `publishedCount` is every listed profile in
  // this place and decides whether the page exists at all: a listing with no
  // profiles behind it is not a thin page to be gated, it is a page we do not
  // have, so it 404s rather than rendering an empty list for Google to crawl.
  // `indexableCount` is verified supply and is what the copy calls verified;
  // `eligibleCount` is the pool the current index mode publishes and is what
  // the gate decides on.
  const gatePlace = locality ? { localityKey: locality.key } : { stateSlug: city.stateSlug, citySlug: city.slug };
  const [publishedCount, indexableCount, eligibleCount] = await Promise.all([
    countIndexable(specialty.key, gatePlace, "published"),
    countIndexable(specialty.key, gatePlace),
    countIndexable(specialty.key, gatePlace, "eligible"),
  ]);
  if (publishedCount === 0) notFound();
  const gate = await withOverride(canonicalPath, listingGate(locality ? "locality" : "city", eligibleCount, Boolean(specialty.guide)));
  const faceted = hasFacetParams(sp);

  const routeMeta: RouteMetaData = {
    route: locality ? "Locality × speciality" : "City × speciality",
    title: `${specialty.plural} in ${placeName} | The Doctor Index`,
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
        text: 'Neither "Best" nor "Verified". A best-of page would need a published methodology, review volume and recency criteria we cannot defend; and "Verified" was asserting a check that six of 25,948 profiles have actually passed — the title said verified while the description said zero. The page now names the speciality and the place, and counts what is on record.',
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
