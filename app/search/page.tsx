import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DoctorRow } from "@/components/DoctorRow";
import { RouteMeta } from "@/components/RouteMeta";
import { NearMe } from "@/components/NearMe";
import { searchDoctors } from "@/lib/data";
import { nearestKm, parseNear, sortByDistance } from "@/lib/geo";
import { CITY, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
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
  const near = parseNear(sp.near);
  const found = await searchDoctors(query);
  const results = near ? sortByDistance(found, near) : found;

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
      <Breadcrumbs items={[{ name: "Home", path: paths.home() }, { name: "Search" }]} />

      <div className="wrap" style={{ paddingTop: "22px" }}>
        <h1 style={{ fontSize: "1.75rem" }}>
          {query ? <>Results for “{query}”</> : "Search"}
        </h1>
        <div className="resulthead" style={{ marginBottom: "14px" }}>
          <div className="count mono" style={{ color: "var(--muted)" }}>
            {results.length} matching profiles
          </div>
          <Suspense fallback={null}>
            <NearMe active={Boolean(near)} />
          </Suspense>
        </div>

        {results.length ? (
          <div className="rows">
            {results.map((d) => (
              <DoctorRow key={d.slug} doctor={d} ctx={{ query }} distance={near ? nearestKm(d, near) : null} />
            ))}
          </div>
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
                  <Link
                    key={k}
                    className="chip"
                    href={paths.citySpecialty(CITY.stateSlug, CITY.slug, SPECIALTIES[k].slug)}
                  >
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
