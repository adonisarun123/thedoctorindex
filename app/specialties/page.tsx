import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
import { guideForSpecialty } from "@/lib/data/guides";
import { CITY, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  title: "Specialities and departments",
  description:
    "Browse doctors by department and speciality. Each speciality page explains when to consult, in plain language, before you choose a doctor.",
  alternates: { canonical: absoluteUrl("/specialties") },
  robots: { index: true, follow: true },
};

/**
 * Department → speciality browse. Four specialities are open; the plan's later
 * additions (dentistry, AYUSH systems, allied health) are separate practitioner
 * systems with their own regulators and are listed as such, not folded in.
 */
const PLANNED = [
  { dept: "Women's health", name: "Obstetrics & gynaecology" },
  { dept: "Mental health", name: "Psychiatry" },
  { dept: "Eyes", name: "Ophthalmology" },
  { dept: "Ear, nose & throat", name: "Otorhinolaryngology" },
  { dept: "General medicine", name: "Internal medicine" },
  { dept: "Diabetes & hormones", name: "Endocrinology" },
];

export default function SpecialtiesIndexPage() {
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Specialities" }];
  return (
    <>
      <RouteMeta
        data={{
          route: "Speciality index",
          title: "Specialities and departments | The Doctor Index",
          h1: "Specialities",
          canonical: absoluteUrl("/specialties"),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Planned specialities",
              text: "Listed as text with no link and no page. A speciality gets a URL only when it has a taxonomy entry, reviewed guidance and verified supply.",
            },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Browse by speciality</span>
          <h1 style={{ marginTop: "10px" }}>Specialities</h1>
          <div className="upd">4 open · modern-medicine (NMC / State Medical Council) practitioners only in this phase</div>

          <div className="guidegrid">
            {SPECIALTY_KEYS.map((k) => {
              const s = SPECIALTIES[k];
              const guide = guideForSpecialty(k);
              return (
                <div key={k} className="guide" style={{ minHeight: 0 }}>
                  <div className="eyebrow">{s.department}</div>
                  <Link className="t" href={paths.specialty(k)} style={{ color: "var(--ink)" }}>
                    {s.name}
                  </Link>
                  <div className="d">{s.guide.split(". ")[0]}.</div>
                  <div className="quick" style={{ marginTop: "4px" }}>
                    <Link className="chip" href={paths.citySpecialty(CITY.stateSlug, CITY.slug, s.slug)}>
                      {countIndexable(k)} verified in {CITY.name}
                    </Link>
                    {guide ? (
                      <Link className="chip" href={`/health-guides/${guide.slug}`}>
                        When to consult
                      </Link>
                    ) : null}
                  </div>
                  <div className="m">Also: {s.aliases.slice(0, 3).join(", ")}</div>
                </div>
              );
            })}
          </div>

          <h2>Planned next</h2>
          <p style={{ maxWidth: "66ch" }}>
            These open as verified supply arrives and their guidance is written and reviewed. They have
            no page yet, on purpose. Dentists, AYUSH practitioners, physiotherapists and psychologists
            are regulated by different bodies and will be added as distinct systems with their own
            verification wording — never behind a generic badge.
          </p>
          <div className="locgrid">
            {PLANNED.map((p) => (
              <div key={p.name} className="loc off" aria-disabled="true">
                <span>
                  <span className="n">{p.name}</span>
                  <br />
                  <span style={{ fontSize: "12px" }}>{p.dept}</span>
                </span>
                <span className="c">planned</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
