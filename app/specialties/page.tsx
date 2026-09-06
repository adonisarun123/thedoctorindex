import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsBySpecialty } from "@/lib/data";
import { guideForSpecialty } from "@/lib/data/guides";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Specialities and departments",
  description: "Browse doctors by department and speciality. Each speciality page explains when to consult, in plain language, before you choose a doctor.",
  path: "/specialties",
});

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

export const revalidate = 3600;

export default async function SpecialtiesIndexPage() {
  const [counts, listed] = await Promise.all([countsBySpecialty(), countsBySpecialty(undefined, "published")]);
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
      <JsonLd data={[collectionLd({ name: "Specialities and departments", path: "/specialties", description: String(metadata.description), items: SPECIALTY_KEYS.map((k) => ({ name: SPECIALTIES[k].name, path: paths.specialty(k) })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Browse by speciality</span>
          <h1 style={{ marginTop: "10px" }}>Specialities</h1>
          <div className="upd">{SPECIALTY_KEYS.length} specialities · {SPECIALTY_KEYS.filter((k) => SPECIALTIES[k].guide).length} with medically reviewed guidance · modern medicine, dental, AYUSH and allied health, each labelled by its register</div>

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
                  <div className="d">{s.guide ? `${s.guide.split(". ")[0]}.` : `${s.plural} listed by city; guidance under review.`}</div>
                  <div className="quick" style={{ marginTop: "4px" }}>
                    <Link className="chip" href={paths.specialty(k)}>
                      {counts[k] ?? 0} verified · {listed[k] ?? 0} listed
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
