import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DoctorRow } from "@/components/DoctorRow";
import { RouteMeta } from "@/components/RouteMeta";
import { NearMe } from "@/components/NearMe";
import { SEARCH_CAP, SEARCH_PAGE, searchDoctors } from "@/lib/data";
import { nearestKm, parseNear, sortByDistance } from "@/lib/geo";
import { resolvePlaceQuery } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS, resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { privateMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

/**
 * Internal search results. Never indexed (plan §6): every profile is also
 * reachable through crawlable HTML links from a speciality or city page, so the
 * search box is never the only path to a record.
 */
export const metadata: Metadata = {
  ...privateMeta("Search results", "Search verified doctors by name, speciality or locality.", "/search"),
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const query = (raw ?? "").trim();
  const locRaw = (Array.isArray(sp.loc) ? sp.loc[0] : sp.loc ?? "").trim();
  const near = parseNear(sp.near);

  // A place plus a speciality is a listing page, not a search result.
  const place = locRaw ? await resolvePlaceQuery(locRaw) : null;
  const specialty = resolveSpecialtyQuery(query);
  if (place && specialty) {
    redirect(place.locality ? paths.localitySpecialty(place.stateSlug, place.citySlug, place.locality.slug, specialty.slug) : paths.citySpecialty(place.stateSlug, place.citySlug, specialty.slug));
  }
  const scope = place ? (place.locality ? { localityKey: place.locality.key } : { stateSlug: place.stateSlug, citySlug: place.citySlug }) : undefined;
  const found = await searchDoctors(query || (place ? place.name : ""), scope);
  const ordered = near ? sortByDistance(found, near) : found;
  const pageCount = Math.max(1, Math.ceil(ordered.length / SEARCH_PAGE));
  const pageNo = Math.max(1, Math.min(pageCount, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1));
  const results = ordered.slice((pageNo - 1) * SEARCH_PAGE, pageNo * SEARCH_PAGE);
  const pageHref = (n: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set("q", query);
    if (locRaw) qs.set("loc", locRaw);
    const nearRaw = Array.isArray(sp.near) ? sp.near[0] : sp.near;
    if (nearRaw) qs.set("near", nearRaw);
    if (n > 1) qs.set("page", String(n));
    const q = qs.toString();
    return q ? `/search?${q}` : "/search";
  };

  return (
    <>
      <RouteMeta
        data={{
          route: "Internal search results",
          title: "Search results | The Doctor Index",
          canonical: absoluteUrl("/search"),
          index: false,
          structuredData: "None",
          notes: [
            {
              label: "Why noindex",
              text: "Internal search results are never indexed. Every profile is reachable through crawlable links from a city or speciality page, so the search box is never the only path to a record.",
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ name: "Home", path: paths.home() }, { name: "Search", path: "/search" }]} />

      <div className="wrap" style={{ paddingTop: "22px" }}>
        <h1 style={{ fontSize: "1.75rem" }}>
          {query ? <>Results for “{query}”{place ? <> in {place.name}</> : null}</> : place ? <>Doctors in {place.name}</> : "Search"}
        </h1>
        <div className="resulthead" style={{ marginBottom: "14px" }}>
          <div className="count mono" style={{ color: "var(--muted)" }}>
            {ordered.length === results.length
              ? `${ordered.length} matching profiles`
              : `Showing ${(pageNo - 1) * SEARCH_PAGE + 1}–${(pageNo - 1) * SEARCH_PAGE + results.length} of ${ordered.length}${ordered.length >= SEARCH_CAP ? "+" : ""} matching profiles`}
          </div>
          <Suspense fallback={null}>
            <NearMe active={Boolean(near)} />
          </Suspense>
        </div>

        {results.length ? (
          <>
            <div className="rows">
              {results.map((d) => (
                <DoctorRow key={d.slug} doctor={d} distance={near ? nearestKm(d, near) : null} />
              ))}
            </div>
            {pageCount > 1 ? (
              <nav className="quick" aria-label="More results" style={{ marginTop: "14px", justifyContent: "space-between" }}>
                {pageNo > 1 ? <Link className="btn quiet" href={pageHref(pageNo - 1)} rel="prev">← Previous {SEARCH_PAGE}</Link> : <span />}
                <span className="mono" style={{ fontSize: "12.5px", color: "var(--muted)" }}>Page {pageNo} of {pageCount}</span>
                {pageNo < pageCount ? <Link className="btn quiet" href={pageHref(pageNo + 1)} rel="next">Next {Math.min(SEARCH_PAGE, ordered.length - pageNo * SEARCH_PAGE)} →</Link> : <span />}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="rows">
            <div className="zero">
              <h3>No verified match for that search</h3>
              <p>
                We would rather return nothing than show an unrelated practitioner. Try a speciality
                instead of a condition, or browse a department.
              </p>
              <div className="opts">
                {SPECIALTY_KEYS.map((k) => (
                  <Link key={k} className="chip" href={paths.specialty(k)}>
                    {SPECIALTIES[k].plural}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
