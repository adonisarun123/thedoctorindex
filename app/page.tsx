import type { Metadata } from "next";
import Link from "next/link";

import { HomeSearch } from "@/components/HomeSearch";
import { RouteMeta } from "@/components/RouteMeta";
import { getAllDoctors, countIndexable } from "@/lib/data";
import { CITY, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  const all = getAllDoctors();
  const indexable = all.filter((d) => d.indexable).length;
  const claimed = all.filter((d) => d.claimed).length;
  const practices = all.reduce((n, d) => n + d.practices.length, 0);

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
              text: "Listed in the core sitemap. The doctor and directory sitemaps are generated separately so an indexation problem can be isolated by page type.",
            },
          ],
        }}
      />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Bengaluru launch cluster · 4 specialities</span>
            <h1 style={{ marginTop: "12px" }}>Find a doctor, and see exactly what has been checked.</h1>
            <p className="lede">
              Every profile shows which claims were verified, against which source, and on what date.
              Registration is verified separately from qualification, and both separately from whether
              the doctor still practises at that address.
            </p>
            <HomeSearch />
            <div className="quick">
              <span>Try:</span>
              <Link className="chip" href={paths.citySpecialty(CITY.stateSlug, CITY.slug, "cardiologists")}>
                Cardiologists in Bengaluru
              </Link>
              <Link
                className="chip"
                href={paths.localitySpecialty(CITY.stateSlug, CITY.slug, "indiranagar", "dermatologists")}
              >
                Dermatologists in Indiranagar
              </Link>
              <Link className="chip" href={paths.doctor("shalini-prakash-e8c451")}>
                A full profile
              </Link>
            </div>
          </div>

          <div className="register">
            <div className="rhead">
              <span className="t">What each label means</span>
              <span className="n">{SITE.dataSnapshot}</span>
            </div>
            <LabelRow
              tone="ok"
              label="Medical registration verified"
              source="Matched on council + registration number in the state register"
              when="checked"
            />
            <LabelRow
              tone="ok"
              label="Qualification verified"
              source="Degree found in the awarding body's official record"
              when="checked"
            />
            <LabelRow
              tone="wait"
              label="Qualification submitted"
              source="Supplied by the doctor, verification still open"
              when="pending"
            />
            <LabelRow
              tone="ok"
              label="Practice location confirmed"
              source="Address and contact reconfirmed with the practice"
              when="checked"
            />
            <LabelRow
              tone="none"
              label="Unclaimed profile"
              source="Compiled from permitted sources; the doctor has not taken it over"
              when="—"
            />
            <div className="statline">
              <div>
                <div className="v">{indexable}</div>
                <div className="l">Indexable profiles</div>
              </div>
              <div>
                <div className="v">{claimed}</div>
                <div className="l">Claimed by doctor</div>
              </div>
              <div>
                <div className="v">{practices}</div>
                <div className="l">Confirmed practices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Browse by department</h2>
            <span className="eyebrow">
              {CITY.state} · {CITY.name}
            </span>
          </div>
          <div className="deptgrid">
            {SPECIALTY_KEYS.map((k) => {
              const s = SPECIALTIES[k];
              return (
                <Link
                  key={k}
                  className="dept"
                  href={paths.citySpecialty(CITY.stateSlug, CITY.slug, s.slug)}
                >
                  <div className="d">{s.department}</div>
                  <div className="n">{s.name}</div>
                  <div className="c">{countIndexable(k)} verified in {CITY.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>What we will not do</h2>
          </div>
          <div className="deptgrid">
            <Commitment
              title="Ranking"
              text="Payment is not an input to organic order. Sponsored cards, if introduced, sit outside the results list and are labelled."
            />
            <Commitment
              title="Reviews"
              text="No imported ratings from other platforms, no paid removal, no review gating. Doctors may reply once, without confirming any health detail."
            />
            <Commitment
              title="Superlatives"
              text="No “best doctor” lists or awards. Verified is a fact we can evidence; best is a claim we cannot."
            />
            <Commitment
              title="Listing fees"
              text="The basic profile is permanently free. A doctor never pays to be found, corrected, or verified."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function LabelRow({
  tone,
  label,
  source,
  when,
}: {
  tone: "ok" | "wait" | "none";
  label: string;
  source: string;
  when: string;
}) {
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
