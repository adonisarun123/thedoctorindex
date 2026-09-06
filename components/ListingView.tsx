import { Suspense } from "react";
import Link from "next/link";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { DemoAction } from "@/components/DemoAction";
import { DoctorRow } from "@/components/DoctorRow";
import { NearMe } from "@/components/NearMe";
import { FilterRail } from "@/components/FilterRail";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { LISTING_CAP, LISTING_PAGE, allLanguages, applyFilters, countIndexable, countsByLocality, getListing } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { nearestKm, parseNear, sortByDistance } from "@/lib/geo";
import { sortBy } from "@/lib/ranking";
import { GATES } from "@/lib/seo/gates";
import { breadcrumbLd, listingLd } from "@/lib/seo/structured-data";
import { SITE, paths } from "@/lib/site";
import type { City, ListingFilters, Locality, Specialty } from "@/lib/types";

export function parseFilters(sp: Record<string, string | string[] | undefined>, validLocality: (key: string) => boolean): ListingFilters {
  const one = (k: string): string | undefined => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const locality = one("locality");
  const gender = one("gender");
  return {
    locality: locality && validLocality(locality) ? locality : undefined,
    online: one("online") === "1",
    gender: gender === "F" || gender === "M" ? gender : undefined,
    language: one("language") || undefined,
    minExperience: Number(one("experience")) || undefined,
    maxFee: Number(one("fee")) || undefined,
    claimedOnly: one("claimed") === "1",
    evidenceOnly: one("evidence") === "1",
  };
}

export async function ListingView({
  specialty,
  city,
  locality,
  searchParams,
  routeMeta,
}: {
  specialty: Specialty;
  city: City;
  locality: Locality | null;
  searchParams: Record<string, string | string[] | undefined>;
  routeMeta: RouteMetaData;
}) {
  const geo = await getGeo();
  const cityLocalities = geo.localitiesIn(city.slug).filter((l) => l.stateSlug === city.stateSlug);
  const localityKeySet = new Set(cityLocalities.map((l) => l.key));
  const filters = parseFilters(searchParams, (k) => localityKeySet.has(k));
  const sortParam = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) ?? "relevance";
  const sortMode: "relevance" | "experience" | "reviews" =
    sortParam === "experience" || sortParam === "reviews" ? sortParam : "relevance";

  const place = locality ? { localityKey: locality.key } : { stateSlug: city.stateSlug, citySlug: city.slug };
  const scoped = await getListing(specialty.key, place);
  const filtered = applyFilters(scoped, filters);
  const ctx = { specialty: specialty.key, locality: locality?.key ?? filters.locality };
  const cityPath = paths.citySpecialty(city.stateSlug, city.slug, specialty.slug);
  const canonicalPath = locality ? paths.localitySpecialty(city.stateSlug, city.slug, locality.slug, specialty.slug) : cityPath;
  const near = parseNear(searchParams.near);
  const ordered = near ? sortByDistance(filtered, near) : sortBy(filtered, sortMode, ctx);
  const pageNo = Math.max(1, Math.min(Math.ceil(ordered.length / LISTING_PAGE) || 1, Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1));
  const results = ordered.slice((pageNo - 1) * LISTING_PAGE, pageNo * LISTING_PAGE);
  const pageCount = Math.ceil(ordered.length / LISTING_PAGE);
  const pageHref = (n: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) if (k !== "page" && typeof v === "string" && v) qs.set(k, v);
    if (n > 1) qs.set("page", String(n));
    const q = qs.toString();
    return q ? `${canonicalPath}?${q}` : canonicalPath;
  };


  const placeName = locality ? `${locality.name}, ${city.name}` : city.name;
  const heading = `${specialty.plural} in ${placeName}`;

  const indexableHere = await countIndexable(specialty.key, place);
  const threshold = locality ? GATES.localitySpecialty : GATES.citySpecialty;
  const belowThreshold = indexableHere < threshold;

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: city.state, path: `/doctors/${city.stateSlug}` },
    { name: city.name, path: `/doctors/${city.stateSlug}/${city.slug}` },
    ...(locality ? [{ name: specialty.plural, path: cityPath }, { name: locality.name }] : [{ name: specialty.plural }]),
  ];

  // Localities that clear the supply gate get a crawlable link from this page.
  // Ones that do not are simply absent — we never link into a thin page.
  const localityCounts = locality ? {} : await countsByLocality(city.slug, specialty.key);
  const localityLinks = locality ? [] : cityLocalities.filter((l) => (localityCounts[l.key] ?? 0) >= GATES.localityLinkMin);

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd
        data={[
          listingLd(specialty, placeName, canonicalPath, results, { city: city.name, state: city.state }),
          breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="listing">
          <FilterRail languages={allLanguages(scoped)} localities={cityLocalities.map((l) => ({ key: l.key, name: l.name }))} cityName={city.name} />

          <div>
            {belowThreshold ? (
              <div className="notice" style={{ marginBottom: "16px" }}>
                <b>This page is live but not indexed.</b> A {locality ? "locality" : "city"} ×
                speciality page needs at least {threshold} verified doctors with confirmed addresses
                before it enters the sitemap. This one has {indexableHere}. Patients reaching it from
                a link see the full page; search engines are told not to index it.
              </div>
            ) : null}

            <div className="resulthead">
              <div>
                <h1 style={{ fontSize: "1.75rem" }}>{heading}</h1>
                <div className="count">
                  {ordered.length === results.length ? `${results.length} of ${scoped.length}${scoped.length >= LISTING_CAP ? "+" : ""} profiles shown` : `Showing ${(pageNo - 1) * LISTING_PAGE + 1}–${(pageNo - 1) * LISTING_PAGE + results.length} of ${ordered.length}${scoped.length >= LISTING_CAP ? "+" : ""} profiles`} · {indexableHere} pass the index
                  gate · data checked to {SITE.dataSnapshot}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <SortLinks canonicalPath={canonicalPath} searchParams={searchParams} current={near ? "distance" : sortMode} />
                <Suspense fallback={null}>
                  <NearMe active={Boolean(near)} />
                </Suspense>
              </div>
            </div>

            {results.length > 0 ? (
              <>
                <div className="rows">
                  {results.map((d) => (
                    <DoctorRow key={d.slug} doctor={d} ctx={ctx} distance={near ? nearestKm(d, near) : null} />
                  ))}
                </div>
                {pageCount > 1 ? (
                  <nav className="quick" aria-label="More results" style={{ marginTop: "14px", justifyContent: "space-between" }}>
                    {pageNo > 1 ? <Link className="btn quiet" href={pageHref(pageNo - 1)} rel="prev">← Previous {LISTING_PAGE}</Link> : <span />}
                    <span className="mono" style={{ fontSize: "12.5px", color: "var(--muted)" }}>Page {pageNo} of {pageCount}</span>
                    {pageNo < pageCount ? <Link className="btn quiet" href={pageHref(pageNo + 1)} rel="next">Next {Math.min(LISTING_PAGE, ordered.length - pageNo * LISTING_PAGE)} →</Link> : <span />}
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="rows">
                <div className="zero">
                  <h3>No verified match for this combination</h3>
                  <p>
                    No doctor in this index meets every filter you have set. We would rather say so
                    than show someone who does not match your speciality.
                  </p>
                  <div className="opts">
                    <Link className="btn" href={canonicalPath}>
                      Clear filters
                    </Link>
                    <Link className="btn quiet" href={paths.specialty(specialty.key)}>
                      See all {specialty.plural.toLowerCase()} in India
                    </Link>
                    <DemoAction
                      label="Ask us to onboard doctors here"
                      explains="Records the locality and speciality so acquisition can target it, and offers to notify you when supply arrives. The notification service is not part of this build."
                    />
                  </div>
                </div>
              </div>
            )}

            {specialty.guide ? (
            <div className="panel pad" style={{ marginTop: "22px" }}>
              <h2 style={{ fontSize: "1.22rem", marginBottom: "8px" }}>
                When to consult {specialty.aOne}
              </h2>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", maxWidth: "66ch" }}>
                {specialty.guide}
              </p>
              <ul
                style={{
                  margin: "12px 0 0",
                  paddingLeft: "20px",
                  fontSize: "14px",
                  color: "var(--ink-2)",
                }}
              >
                {specialty.when.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "14px" }}>
                Medically reviewed · last substantive review {specialty.reviewedOn}. General guidance,
                not advice about your situation.
              </p>
            </div>
            ) : (
            <div className="panel pad" style={{ marginTop: "22px" }}>
              <h2 style={{ fontSize: "1.22rem", marginBottom: "8px" }}>About {specialty.name.toLowerCase()}</h2>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", maxWidth: "66ch" }}>
                Guidance on when to consult {specialty.aOne} is being written and medically reviewed. Until it is signed off this page is
                kept out of search results; the profiles themselves are complete and usable.
              </p>
            </div>
            )}

            {localityLinks.length > 0 ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <div className="eyebrow">Localities with enough verified supply</div>
                <div className="quick" style={{ marginTop: "10px" }}>
                  {localityLinks.map((l) => (
                    <Link key={l.key} className="chip" href={paths.localitySpecialty(city.stateSlug, city.slug, l.slug, specialty.slug)}>
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Sort is expressed as links, not a JS-only control, so the sorted view is
 * reachable and readable without scripting. Each sorted view is a facet and
 * carries noindex — it is not a landing page.
 */
function SortLinks({
  canonicalPath,
  searchParams,
  current,
}: {
  canonicalPath: string;
  searchParams: Record<string, string | string[] | undefined>;
  current: string;
}) {
  const options: Array<[string, string]> = [
    ["relevance", "Relevance & trust"],
    ["experience", "Most experience"],
    ["reviews", "Review confidence"],
    ...(current === "distance" ? ([["distance", "Nearest first"]] as Array<[string, string]>) : []),
  ];
  const base = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (k === "sort" || k === "near") continue;
    if (typeof v === "string" && v) base.set(k, v);
  }
  return (
    <div className="quick" style={{ marginTop: 0 }}>
      <span className="eyebrow">Sort</span>
      {options.map(([value, label]) => {
        const p = new URLSearchParams(base.toString());
        if (value !== "relevance") p.set("sort", value);
        const qs = p.toString();
        return (
          <Link
            key={value}
            className="chip"
            href={qs ? `${canonicalPath}?${qs}` : canonicalPath}
            style={
              current === value
                ? { borderColor: "var(--accent)", color: "var(--accent)" }
                : undefined
            }
            aria-current={current === value ? "true" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
