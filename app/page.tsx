import type { Metadata } from "next";
import Link from "next/link";

import { HomeSearch } from "@/components/HomeSearch";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByCity, countsByCitySpecialty, countsBySpecialty, totals } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { GUIDES } from "@/lib/data/guides";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";
import type { SpecialtyKey } from "@/lib/types";

export const metadata: Metadata = {
  ...pageMeta({ title: SITE.tagline, description: SITE.description, path: "/" }),
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
};

export const revalidate = 3600;

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Round a live total down to a figure that stays true until the next revalidation. */
function roundedTotal(n: number): string {
  if (n >= 10_000) return `${fmt(Math.floor(n / 100) * 100)}+`;
  if (n >= 1_000) return `${fmt(Math.floor(n / 10) * 10)}+`;
  return fmt(n);
}

/**
 * The homepage leads with what the directory actually holds. Every number
 * is a live "published" count (the pool the site indexes), never the
 * verified count — that stays on the profile, where a zero means something.
 */
export default async function HomePage() {
  const [listedBySpecialty, cityListed, citySpecialty, geo, sum] = await Promise.all([
    countsBySpecialty(undefined, "published"),
    countsByCity(undefined, "published"),
    countsByCitySpecialty("published"),
    getGeo(),
    totals(),
  ]);

  const specialtiesPerCity = new Map<string, number>();
  for (const r of citySpecialty) {
    if (r.n > 0) {
      const k = `${r.stateSlug}/${r.citySlug}`;
      specialtiesPerCity.set(k, (specialtiesPerCity.get(k) ?? 0) + 1);
    }
  }

  const topCities = cityListed
    .filter((c) => c.n > 0)
    .map((c) => ({ ...c, city: geo.city(c.stateSlug, c.citySlug), specialties: specialtiesPerCity.get(`${c.stateSlug}/${c.citySlug}`) ?? 0 }))
    .filter((c) => c.city)
    .sort((a, b) => b.n - a.n)
    .slice(0, 7);
  const statesOpen = new Set(cityListed.filter((c) => c.n > 0).map((c) => c.stateSlug)).size;
  const topSpecialties = [...SPECIALTY_KEYS].filter((k) => (listedBySpecialty[k] ?? 0) > 0).sort((a, b) => (listedBySpecialty[b] ?? 0) - (listedBySpecialty[a] ?? 0)).slice(0, 9);

  // Popular specialities in the busiest city, for the chips under the search.
  const topCity = topCities[0] ?? null;
  const popular: SpecialtyKey[] = topCity
    ? citySpecialty
        .filter((r) => r.stateSlug === topCity.stateSlug && r.citySlug === topCity.citySlug && r.n > 0 && r.specialty in SPECIALTIES)
        .sort((a, b) => b.n - a.n)
        .slice(0, 5)
        .map((r) => r.specialty as SpecialtyKey)
    : [];

  return (
    <>
      <RouteMeta
        data={{
          route: "Homepage",
          title: `${SITE.name} — ${SITE.tagline}`,
          canonical: absoluteUrl("/"),
          index: true,
          structuredData: "Organization, WebSite",
          notes: [
            {
              label: "Sitemap",
              text: "Listed in the directory sitemap. Doctor, directory and editorial sitemaps are generated separately so an indexation problem can be isolated by page type.",
            },
            {
              label: "Counts",
              text: "Every figure on this page is a live published count, cached for an hour. Verified counts are deliberately absent here; they belong on the profile, where a zero is a statement.",
            },
          ],
        }}
      />

      <section className="hero-dark">
        <div className="wrap hero-dark-inner">
          <span className="eyebrow rise">
            {sum.published ? `${roundedTotal(sum.published)} doctors · ` : ""}
            {statesOpen ? `${statesOpen} ${statesOpen === 1 ? "state" : "states"} · ` : ""}
            checked against the medical registers
          </span>
          <h1 className="rise">Find a doctor near you, and see what has actually been checked.</h1>
          <div className="rise rise-2">
            <HomeSearch defaultLocation={topCity?.city?.name ?? ""} />
          </div>
          {topCity && popular.length ? (
            <div className="quick rise rise-3">
              <span>Popular near {topCity.city!.name}:</span>
              {popular.map((k) => (
                <Link key={k} className="chip" href={paths.citySpecialty(topCity.stateSlug, topCity.citySlug, SPECIALTIES[k].slug)}>
                  {SPECIALTIES[k].plural}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="proof">
        <div className="wrap proof-grid">
          <div className="proof-item">
            <ShieldIcon />
            <div>
              <div className="t">Registration checked, not claimed</div>
              <div className="d">Council and number matched in the state register, with the date we checked.</div>
            </div>
          </div>
          <div className="proof-item">
            <RecordIcon />
            <div>
              <div className="t">Every line carries its source</div>
              <div className="d">Degrees against the awarding body; addresses reconfirmed with the practice.</div>
            </div>
          </div>
          <div className="proof-item">
            <ClockIcon />
            <div>
              <div className="t">Nobody pays to appear</div>
              <div className="d">
                No sponsored rank, no imported ratings, no “best doctor” lists. <Link href={paths.policy("advertising")}>In writing</Link>.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Browse by city</h2>
            <Link href="/doctors" style={{ fontSize: "13.5px" }}>
              All {statesOpen || ""} states →
            </Link>
          </div>
          <div className="citygrid">
            {topCities.map((c) => (
              <Link key={`${c.stateSlug}/${c.citySlug}`} className="citycard" href={`/doctors/${c.stateSlug}/${c.citySlug}`}>
                <span className="n">{c.city!.name}</span>
                <span className="c">
                  {fmt(c.n)} doctors{c.specialties ? ` · ${c.specialties} specialities` : ""}
                </span>
              </Link>
            ))}
            {topCities.length === 0 ? (
              <Link className="citycard" href="/doctors">
                <span className="n">No city has profiles yet</span>
                <span className="c">browse states</span>
              </Link>
            ) : null}
            <Link className="citycard more" href="/doctors">
              All locations →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Browse by speciality</h2>
            <Link href="/specialties" style={{ fontSize: "13.5px" }}>
              All {SPECIALTY_KEYS.length} →
            </Link>
          </div>
          <div className="specindex">
            {topSpecialties.map((k) => (
              <Link key={k} className="specrow" href={paths.specialty(k)}>
                <span className="n">{SPECIALTIES[k].plural}</span>
                <span className="c">{fmt(listedBySpecialty[k] ?? 0)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap guides-band">
          <div>
            <div className="section-head">
              <h2>Before you choose</h2>
              <Link href="/health-guides" style={{ fontSize: "13.5px" }}>
                All health guides →
              </Link>
            </div>
            <div className="guidegrid">
              {GUIDES.slice(0, 3).map((g) => (
                <Link key={g.slug} className="guide" href={`/health-guides/${g.slug}`}>
                  <div className="eyebrow">{g.specialty ? SPECIALTIES[g.specialty].department : "Choosing a doctor"}</div>
                  <div className="t">{g.title}</div>
                  <div className="d">{g.standfirst}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="claimband">
            <span className="eyebrow">For doctors</span>
            <h2>Your name is probably already here. Claim it, free.</h2>
            <p>Correct the record, set your timings and fee, reply to reviews. No listing fee, ever.</p>
            <div className="acts">
              <Link className="btn solid" href={paths.claimProfile()}>
                Find my profile
              </Link>
              <Link className="btn" href={paths.addDoctor()}>
                Create one
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShieldIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" style={{ color: "var(--verified)" }}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function RecordIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
