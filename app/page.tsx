import type { Metadata } from "next";
import Link from "next/link";

import { Avatar } from "@/components/Avatar";
import { HomeSearch } from "@/components/HomeSearch";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByCity, countsBySpecialty, getFeatured } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { GUIDES } from "@/lib/data/guides";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { GATES } from "@/lib/seo/gates";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta({ title: SITE.tagline, description: SITE.description, path: "/" }),
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [countBySpecialty, listedBySpecialty, cityCounts, cityListed, geo, recentlyVerified] = await Promise.all([countsBySpecialty(), countsBySpecialty(undefined, "published"), countsByCity(), countsByCity(undefined, "published"), getGeo(), getFeatured(4)]);
  const topSpecialties = [...SPECIALTY_KEYS].sort((a, b) => (countBySpecialty[b] ?? 0) - (countBySpecialty[a] ?? 0) || (listedBySpecialty[b] ?? 0) - (listedBySpecialty[a] ?? 0)).slice(0, 8);
  const verifiedByCity = new Map(cityCounts.map((c) => [`${c.stateSlug}/${c.citySlug}`, c.n]));
  const topCities = cityListed.map((c) => ({ ...c, v: verifiedByCity.get(`${c.stateSlug}/${c.citySlug}`) ?? 0, city: geo.city(c.stateSlug, c.citySlug) })).filter((c) => c.city).sort((a, b) => b.v - a.v || b.n - a.n).slice(0, 8);
  const statesOpen = new Set(cityListed.filter((c) => c.n > 0).map((c) => c.stateSlug)).size;
  // The busiest city we actually have supply in, and its strongest speciality there.
  const topCity = topCities[0] ?? null;
  const cityBySpecialty = topCity ? await countsBySpecialty({ stateSlug: topCity.stateSlug, citySlug: topCity.citySlug }, "eligible") : {};
  const topCitySpecialty = [...SPECIALTY_KEYS].sort((a, b) => (cityBySpecialty[b] ?? 0) - (cityBySpecialty[a] ?? 0))[0];

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
          ],
        }}
      />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="rise">
            <span className="eyebrow">{statesOpen ? `${statesOpen} ${statesOpen === 1 ? "state" : "states"} · ` : ""}{SPECIALTY_KEYS.length} specialities · verified against the registers</span>
            <h1 style={{ marginTop: "12px" }}>Find a doctor, and see exactly what has been checked.</h1>
            <p className="lede">
              Every profile shows which claims were verified, against which source, and on what date.
              Registration is verified separately from qualification, and both separately from whether
              the doctor still practises at that address.
            </p>
            <HomeSearch />
            <div className="quick">
              <span>Try:</span>
              {/* Chips are built from what the directory actually holds, so none of them
                  can point at an empty listing or a profile that no longer exists. */}
              {topCity ? (
                <Link className="chip" href={paths.citySpecialty(topCity.stateSlug, topCity.citySlug, SPECIALTIES[topCitySpecialty].slug)}>
                  {SPECIALTIES[topCitySpecialty].plural} in {topCity.city!.name}
                </Link>
              ) : null}
              {topSpecialties[0] ? (
                <Link className="chip" href={paths.specialty(SPECIALTIES[topSpecialties[0]].slug)}>
                  {SPECIALTIES[topSpecialties[0]].plural}
                </Link>
              ) : null}
              {recentlyVerified[0] ? (
                <Link className="chip" href={paths.doctor(recentlyVerified[0].slug)}>
                  A full profile
                </Link>
              ) : null}
              <Link className="chip" href="/health-guides/how-to-choose-a-specialist">
                How to choose a specialist
              </Link>
            </div>
          </div>

          <div className="register rise rise-2">
            <LabelRow tone="ok" label="Medical registration verified" source="Matched on council + registration number in the state register" when="checked" />
            <LabelRow tone="ok" label="Qualification verified" source="Degree found in the awarding body's official record" when="checked" />
            <LabelRow tone="wait" label="Qualification submitted" source="Supplied by the doctor, verification still open" when="pending" />
            <LabelRow tone="ok" label="Practice location confirmed" source="Address and contact reconfirmed with the practice" when="checked" />
            <LabelRow tone="none" label="Unclaimed profile" source="Compiled from permitted sources; the doctor has not taken it over" when="—" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Browse by department</h2>
            <Link href="/specialties" style={{ fontSize: "13.5px" }}>
              All {SPECIALTY_KEYS.length} specialities →
            </Link>
          </div>
          <div className="deptgrid">
            {topSpecialties.map((k) => {
              const s = SPECIALTIES[k];
              return (
                <Link key={k} className="dept" href={paths.specialty(k)}>
                  <div className="d">{s.department}</div>
                  <div className="n">{s.name}</div>
                  <div className="c">{(countBySpecialty[k] ?? 0).toLocaleString("en-IN")} verified · {(listedBySpecialty[k] ?? 0).toLocaleString("en-IN")} listed</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>How a profile earns its labels</h2>
            <Link href={paths.policy("verification")} style={{ fontSize: "13.5px" }}>
              Full methodology →
            </Link>
          </div>
          <div className="steps3">
            <div className="step">
              <div className="n">1</div>
              <div className="t">Registration first</div>
              <div className="d">
                Council plus registration number, matched in the state register. Never name alone —
                names repeat, transliterations differ.
              </div>
            </div>
            <div className="step">
              <div className="n">2</div>
              <div className="t">Each claim, its own source</div>
              <div className="d">
                Degrees against the awarding body. Addresses and hours reconfirmed with the practice.
                Every line carries the date it was checked.
              </div>
            </div>
            <div className="step">
              <div className="n">3</div>
              <div className="t">Stale means visible</div>
              <div className="d">
                A profile that is not reconfirmed keeps its last-checked date on show, loses ranking
                weight, and leaves the index until it is.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="two" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: "26px" }}>
            <div>
              <div className="section-head">
                <h2>Recently verified</h2>
                <span className="eyebrow">Claimed and verified first</span>
              </div>
              <div className="rows">
                {recentlyVerified.map((d) => (
                  <div className="mini" key={d.slug}>
                    <Avatar name={d.name} id={d.id} size={40} photoUrl={d.photoUrl} />
                    <div>
                      <Link className="nm" href={paths.doctor(d.slug)}>
                        Dr {d.name}
                      </Link>
                      <div className="s">
                        {SPECIALTIES[d.specialty].one} · {d.practices[0]?.localityName ?? "—"} ·
                        verified {d.lastVerifiedOn}
                      </div>
                    </div>
                    <div className="r">
                      {d.rating.count ? `${d.rating.average.toFixed(1)} · ${d.rating.count}` : "no reviews"}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
                Ordered by profile quality score. Nobody pays to appear here.
              </p>
            </div>

            <div>
              <div className="section-head">
                <h2>By city</h2>
                <Link href="/doctors" style={{ fontSize: "13.5px" }}>All states →</Link>
              </div>
              <div className="locgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {topCities.map((c) => (
                  <Link key={`${c.stateSlug}/${c.citySlug}`} className="loc" href={`/doctors/${c.stateSlug}/${c.citySlug}`}>
                    <span className="n">{c.city!.name}</span>
                    <span className="c">{c.v.toLocaleString("en-IN")} verified · {c.n.toLocaleString("en-IN")} listed</span>
                  </Link>
                ))}
                {topCities.length === 0 ? (
                  <Link className="loc off" href="/doctors">
                    <span className="n">No city has profiles yet</span>
                    <span className="c">browse states</span>
                  </Link>
                ) : null}
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
                A city × speciality page enters search results at {GATES.citySpecialty} verified doctors, a locality page at {GATES.localitySpecialty}.
                Every page is reachable by link meanwhile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Before you choose</h2>
            <Link href="/health-guides" style={{ fontSize: "13.5px" }}>
              All health guides →
            </Link>
          </div>
          <div className="guidegrid">
            {GUIDES.slice(0, 3).map((g) => (
              <Link key={g.slug} className="guide" href={`/health-guides/${g.slug}`}>
                <div className="eyebrow">
                  {g.specialty ? SPECIALTIES[g.specialty].department : "Choosing a doctor"}
                </div>
                <div className="t">{g.title}</div>
                <div className="d">{g.standfirst}</div>
                <div className="m">
                  {g.readingMinutes} min · medically reviewed {g.reviewedOn}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="band">
            <div>
              <span className="eyebrow" style={{ color: "inherit", opacity: 0.7 }}>For doctors</span>
              <h2 style={{ marginTop: "8px" }}>A free profile you control. Nothing to pay, ever, to be found.</h2>
              <p>
                Registration-first, verified against the register, with your practice details kept
                current on your terms. We do not promise rankings, leads or appointments — no directory
                can. We do promise the basic profile stays free.
              </p>
            </div>
            <div className="acts">
              <Link className="btn solid" href={paths.addDoctor()}>
                Create your profile
              </Link>
              <Link className="btn" href={paths.claimProfile()}>
                Claim an existing one
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>What we will not do</h2>
            <Link href={paths.policy("advertising")} style={{ fontSize: "13.5px" }}>
              In writing →
            </Link>
          </div>
          <div className="deptgrid">
            <Commitment title="Ranking" text="Payment is not an input to organic order. Sponsored cards, if introduced, sit outside the results list and are labelled." />
            <Commitment title="Reviews" text="No imported ratings from other platforms, no paid removal, no review gating. Doctors may reply once, without confirming any health detail." />
            <Commitment title="Superlatives" text="No “best doctor” lists or awards. Verified is a fact we can evidence; best is a claim we cannot." />
            <Commitment title="Listing fees" text="The basic profile is permanently free. A doctor never pays to be found, corrected, or verified." />
          </div>
        </div>
      </section>
    </>
  );
}

function LabelRow({ tone, label, source, when }: { tone: "ok" | "wait" | "none"; label: string; source: string; when: string }) {
  return (
    <div className="rrow">
      <span className={`dot${tone === "none" ? "" : ` ${tone}`}`} />
      <div>
        <div className="lbl">{label}</div>
        <div className="src">{source}</div>
      </div>
      <span className="when">{when}</span>
    </div>
  );
}

function Commitment({ title, text }: { title: string; text: string }) {
  return (
    <div className="panel pad">
      <div className="eyebrow">{title}</div>
      <p style={{ marginTop: "8px", fontSize: "14px", color: "var(--ink-2)" }}>{text}</p>
    </div>
  );
}
