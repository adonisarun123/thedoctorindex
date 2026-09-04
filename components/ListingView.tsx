import Link from "next/link";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { DemoAction } from "@/components/DemoAction";
import { DoctorRow } from "@/components/DoctorRow";
import { FilterRail } from "@/components/FilterRail";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { allLanguages, applyFilters, countIndexable, getDoctorsBySpecialty } from "@/lib/data";
import { CITY, LOCALITIES, SPECIALTIES } from "@/lib/data/taxonomy";
import { sortBy } from "@/lib/ranking";
import { GATES } from "@/lib/seo/gates";
import { breadcrumbLd, listingLd } from "@/lib/seo/structured-data";
import { SITE, paths } from "@/lib/site";
import type { ListingFilters, Locality, Specialty } from "@/lib/types";

export function parseFilters(sp: Record<string, string | string[] | undefined>): ListingFilters {
  const one = (k: string): string | undefined => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const locality = one("locality");
  const gender = one("gender");
  return {
    locality: locality && locality in LOCALITIES ? (locality as ListingFilters["locality"]) : undefined,
    online: one("online") === "1",
    gender: gender === "F" || gender === "M" ? gender : undefined,
    language: one("language") || undefined,
    minExperience: Number(one("experience")) || undefined,
    maxFee: Number(one("fee")) || undefined,
    claimedOnly: one("claimed") === "1",
    evidenceOnly: one("evidence") === "1",
  };
}

export function ListingView({
  specialty,
  locality,
  searchParams,
  routeMeta,
}: {
  specialty: Specialty;
  locality: Locality | null;
  searchParams: Record<string, string | string[] | undefined>;
  routeMeta: RouteMetaData;
}) {
  const filters = parseFilters(searchParams);
  const sortParam = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) ?? "relevance";
  const sortMode: "relevance" | "experience" | "reviews" =
    sortParam === "experience" || sortParam === "reviews" ? sortParam : "relevance";

  const base = getDoctorsBySpecialty(specialty.key);
  const scoped = locality ? base.filter((d) => d.localities.includes(locality.key)) : base;
  const filtered = applyFilters(scoped, filters);
  const ctx = { specialty: specialty.key, locality: locality?.key ?? filters.locality };
  const results = sortBy(filtered, sortMode, ctx);

  const canonicalPath = locality
    ? paths.localitySpecialty(locality.stateSlug, locality.citySlug, locality.key, specialty.slug)
    : paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug);

  const placeName = locality ? `${locality.name}, ${locality.city}` : CITY.name;
  const heading = `${specialty.plural} in ${placeName}`;

  const indexableHere = countIndexable(specialty.key, locality?.key);
  const threshold = locality ? GATES.localitySpecialty : GATES.citySpecialty;
  const belowThreshold = indexableHere < threshold;

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: CITY.state, path: paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug) },
    { name: CITY.name, path: paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug) },
    ...(locality
      ? [{ name: locality.name, path: canonicalPath }]
      : []),
    { name: specialty.plural },
  ];

  // Localities that clear the supply gate get a crawlable link from this page.
  // Ones that do not are simply absent — we never link into a thin page.
  const localityLinks = locality
    ? []
    : (Object.keys(LOCALITIES) as Array<keyof typeof LOCALITIES>).filter(
        (k) => countIndexable(specialty.key, k) >= 2,
      );

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd
        data={[
          listingLd(specialty, placeName, canonicalPath, results),
          breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="listing">
          <FilterRail languages={allLanguages(base)} />

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
                  {results.length} of {scoped.length} profiles shown · {indexableHere} pass the index
                  gate · data checked to {SITE.dataSnapshot}
                </div>
              </div>
              <SortLinks canonicalPath={canonicalPath} searchParams={searchParams} current={sortMode} />
            </div>

            {results.length > 0 ? (
              <div className="rows">
                {results.map((d) => (
                  <DoctorRow key={d.slug} doctor={d} ctx={ctx} />
                ))}
              </div>
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

            {localityLinks.length > 0 ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <div className="eyebrow">Localities with enough verified supply</div>
                <div className="quick" style={{ marginTop: "10px" }}>
                  {localityLinks.map((k) => (
                    <Link
                      key={k}
                      className="chip"
                      href={paths.localitySpecialty(
                        LOCALITIES[k].stateSlug,
                        LOCALITIES[k].citySlug,
                        k,
                        specialty.slug,
                      )}
                    >
                      {LOCALITIES[k].name}
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
  ];
  const base = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (k === "sort") continue;
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
