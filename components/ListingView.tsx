import { Suspense } from "react";
import Link from "next/link";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { DemoAction } from "@/components/DemoAction";
import { DoctorRow } from "@/components/DoctorRow";
import { NearMe } from "@/components/NearMe";
import { FilterRail } from "@/components/FilterRail";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { LISTING_CAP, LISTING_PAGE, allLanguages, applyFilters, countsByLocality, getListing, supplyProfile } from "@/lib/data";
import { SupplyPanel } from "@/components/SupplyPanel";
import { AREA_ARTICLE_MIN, buildAreaArticle } from "@/lib/content/area-article";
import { concentrationSentence, councilSentence, countPhrase, gapSentence, listingFaq, placementSentence, qualificationSentence, subspecialtySentence, supplyFacts, verificationSentence } from "@/lib/content/supply";
import { getGeo } from "@/lib/data/geo";
import { nearestKm, parseNear, sortByDistance } from "@/lib/geo";
import { sortBy } from "@/lib/ranking";
import { GATES } from "@/lib/seo/gates";
import { breadcrumbLd, faqLd, listingLd } from "@/lib/seo/structured-data";
import { paths } from "@/lib/site";
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

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: city.state, path: `/doctors/${city.stateSlug}` },
    { name: city.name, path: `/doctors/${city.stateSlug}/${city.slug}` },
    ...(locality
      ? [{ name: specialty.plural, path: cityPath }, { name: locality.name, path: canonicalPath }]
      : [{ name: specialty.plural, path: cityPath }]),
  ];

  // Localities that clear the supply gate get a crawlable link from this page.
  // Ones that do not are simply absent — we never link into a thin page.
  const localityCounts = locality ? {} : await countsByLocality(city.slug, specialty.key, "eligible");

  // Area article (locality pages with AREA_ARTICLE_MIN+ doctors): shown on the
  // unfiltered first page only, so pages 2+ and facets do not repeat it.
  const isArticleView = pageNo === 1 && !Object.keys(searchParams).some((k) => k !== "page" && searchParams[k]);
  const article = locality && isArticleView ? buildAreaArticle(scoped, specialty, locality) : null;
  const nearbyCounts = article ? await countsByLocality(city.slug, specialty.key, "published") : {};
  const nearbyAreas = article
    ? cityLocalities
        .filter((l) => l.key !== locality!.key && (nearbyCounts[l.key] ?? 0) >= AREA_ARTICLE_MIN)
        .sort((a, b) => (nearbyCounts[b.key] ?? 0) - (nearbyCounts[a.key] ?? 0))
        .slice(0, 12)
    : [];
  const localityLinks = locality ? [] : cityLocalities.filter((l) => (localityCounts[l.key] ?? 0) >= GATES.localityLinkMin);

  /*
   * Measured composition of this exact pool.
   *
   * The speciality guidance below is written once per speciality and is
   * therefore identical on every city and locality page that shows it — which
   * is fine for one block and fatal as a whole page. Everything in this block
   * is counted from the records under this URL, so what makes a Jayanagar
   * cardiology page different from a Koramangala one is not the adjective, it
   * is the data. `withOverride`-gated links aside, no sentence here is emitted
   * unless the figure behind it exists (see lib/content/supply.ts).
   */
  const profile = await supplyProfile(place, specialty.key, "published");
  const localityMix = locality
    ? []
    : cityLocalities.map((l) => ({ name: l.name, n: localityCounts[l.key] ?? 0 })).filter((e) => e.n > 0).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const localityTotal = localityMix.reduce((a, e) => a + e.n, 0);
  const supplySentences = [
    placementSentence(profile, countPhrase(profile.total, specialty.one, specialty.plural), placeName),
    locality ? null : concentrationSentence(localityMix, localityTotal, { singular: "locality", plural: "localities" }, city.name),
    verificationSentence(profile),
    qualificationSentence(profile),
    councilSentence(profile),
    subspecialtySentence(profile),
  ];
  const faqs = listingFaq(profile, specialty, placeName, localityMix, city.name);

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd
        data={[
          listingLd(specialty, placeName, canonicalPath, results, { city: city.name, state: city.state }),
          breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path }))),
          // Emitted from the same array the block below renders, so the markup
          // can never assert a question the page does not visibly answer.
          ...(faqs.length > 0 ? [faqLd(canonicalPath, faqs)] : []),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="listing">
          <FilterRail languages={allLanguages(scoped)} localities={cityLocalities.map((l) => ({ key: l.key, name: l.name }))} cityName={city.name} />

          <div>

            <div className="resulthead">
              <div>
                <h1 style={{ fontSize: "1.75rem" }}>{heading}</h1>
                <div className="count">
                  {ordered.length === results.length ? `${results.length} of ${scoped.length}${scoped.length >= LISTING_CAP ? "+" : ""} profiles shown` : `Showing ${(pageNo - 1) * LISTING_PAGE + 1}–${(pageNo - 1) * LISTING_PAGE + results.length} of ${ordered.length}${scoped.length >= LISTING_CAP ? "+" : ""} profiles`}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <SortLinks canonicalPath={canonicalPath} searchParams={searchParams} current={near ? "distance" : sortMode} />
                <Suspense fallback={null}>
                  <NearMe active={Boolean(near)} />
                </Suspense>
              </div>
            </div>

            {article ? (
              <div className="panel pad" style={{ marginBottom: "14px" }}>
                {article.intro.map((t) => (
                  <p key={t} style={{ fontSize: "14.5px", color: "var(--ink-2)", maxWidth: "70ch", margin: "0 0 8px" }}>{t}</p>
                ))}
              </div>
            ) : null}

            {results.length > 0 ? (
              <>
                <div className="rows">
                  {results.map((d) => (
                    <DoctorRow key={d.slug} doctor={d} distance={near ? nearestKm(d, near) : null} />
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

            {article && article.facilities.length > 0 ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <h2 style={{ fontSize: "1.22rem", marginBottom: "10px", marginTop: 0 }}>
                  Where {specialty.plural.toLowerCase()} practise in {locality!.name}
                </h2>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "var(--ink-2)" }}>
                  {article.facilities.slice(0, 15).map((f) => (
                    <li key={f.name} style={{ marginBottom: "6px" }}>
                      <strong>{f.name}</strong> ({f.doctors.length}):{" "}
                      {f.doctors.map((d, i) => (
                        <span key={d.slug}>
                          {i > 0 ? ", " : ""}
                          <Link href={paths.doctor(d.slug)}>{d.name}</Link>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
                {article.facilities.length > 15 ? (
                  <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "8px" }}>
                    And {article.facilities.length - 15} more practices; every doctor is in the list below.
                  </p>
                ) : null}
              </div>
            ) : null}

            {article ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <h2 style={{ fontSize: "1.22rem", marginBottom: "10px", marginTop: 0 }}>
                  All {article.roster.length} {specialty.plural.toLowerCase()} in {locality!.name}, A–Z
                </h2>
                <ol style={{ margin: 0, paddingLeft: "22px", fontSize: "14px", color: "var(--ink-2)", columns: "2 280px" }}>
                  {article.roster.map((d) => (
                    <li key={d.slug} style={{ breakInside: "avoid", marginBottom: "6px" }}>
                      <Link href={paths.doctor(d.slug)}>{d.name}</Link>
                      {d.facility ? <span style={{ color: "var(--muted)" }}> · {d.facility}</span> : null}
                      {d.years > 0 ? <span style={{ color: "var(--muted)" }}> · {d.years} yrs</span> : null}
                      {d.claimed ? null : <span style={{ color: "var(--muted)", fontSize: "12px" }}> · not yet claimed</span>}
                    </li>
                  ))}
                </ol>
                <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
                  Are you one of these doctors? <Link href={paths.claimProfile()}>Claim your profile</Link> to correct and complete it.
                </p>
              </div>
            ) : null}

            {nearbyAreas.length > 0 ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <div className="eyebrow">{specialty.plural} in nearby areas of {city.name}</div>
                <div className="quick" style={{ marginTop: "10px" }}>
                  {nearbyAreas.map((l) => (
                    <Link key={l.key} className="chip" href={paths.localitySpecialty(city.stateSlug, city.slug, l.slug, specialty.slug)}>
                      {l.name} ({nearbyCounts[l.key]})
                    </Link>
                  ))}
                  <Link className="chip" href="/doctors/by-area">All areas</Link>
                </div>
              </div>
            ) : null}

            <SupplyPanel
              heading={`${specialty.plural} in ${placeName}, by the record`}
              sentences={supplySentences}
              facts={supplyFacts(profile)}
              footnote={gapSentence(profile)}
            />

            {faqs.length > 0 ? (
              <div className="panel pad" style={{ marginTop: "14px" }}>
                <h2 style={{ fontSize: "1.22rem", marginBottom: "10px", marginTop: 0 }}>
                  Questions about {specialty.plural.toLowerCase()} in {placeName}
                </h2>
                <dl className="faqlist">
                  {faqs.map((f) => (
                    <div key={f.q}>
                      <dt>{f.q}</dt>
                      <dd>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {specialty.guide ? (
            <div className="panel pad" style={{ marginTop: "22px" }}>
              <h2 style={{ fontSize: "1.22rem", marginBottom: "8px" }}>
                {specialty.when.length > 0 ? `When to consult ${specialty.aOne}` : `About ${specialty.name.toLowerCase()}`}
              </h2>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", maxWidth: "66ch" }}>
                {specialty.guide}
              </p>
              {specialty.when.length > 0 ? (
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
              ) : null}
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "14px" }}>
                {specialty.reviewedOn
                  ? `Medically reviewed · last substantive review ${specialty.reviewedOn}. General guidance, not advice about your situation.`
                  : "General orientation written by The Doctor Index. Not reviewed by a clinician, and not advice about your situation."}
              </p>
            </div>
            ) : (
            <div className="panel pad" style={{ marginTop: "22px" }}>
              <h2 style={{ fontSize: "1.22rem", marginBottom: "8px" }}>About {specialty.name.toLowerCase()}</h2>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", maxWidth: "66ch" }}>
                Orientation copy for {specialty.aOne} has not been written yet. The profiles on this
                page are complete and usable.
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
