import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
import { GUIDES, guideBySlug } from "@/lib/data/guides";
import { CITY, SPECIALTIES } from "@/lib/data/taxonomy";
import { breadcrumbLd, guideLd, isoDate } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  if (!guide) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: guide.title,
    description: guide.standfirst,
    path: `/health-guides/${guide.slug}`,
    type: "article",
    image: "segment",
    article: { publishedTime: isoDate(guide.publishedOn), modifiedTime: isoDate(guide.reviewedOn), authors: [absoluteUrl("/about")], section: "Health guides", tags: guide.specialty ? [SPECIALTIES[guide.specialty].name] : undefined },
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();

  const specialty = guide.specialty ? SPECIALTIES[guide.specialty] : null;
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Health guides", path: "/health-guides" },
    { name: guide.title },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Health guide",
          title: `${guide.title} | The Doctor Index`,
          h1: guide.title,
          canonical: absoluteUrl(`/health-guides/${guide.slug}`),
          index: true,
          structuredData: "MedicalWebPage (lastReviewed, reviewedBy) › Article (author, publisher, image), BreadcrumbList",
          lastmod: guide.reviewedOn,
          notes: [
            {
              label: "No FAQ markup",
              text: "FAQ rich results are restricted to well-known authoritative government and health sites, so FAQ schema is not part of the business case here and is not emitted.",
            },
          ],
        }}
      />
      <JsonLd data={[guideLd(guide), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <article className="doc">
          <span className="eyebrow">
            {specialty ? specialty.department : "Choosing a doctor"} · {guide.readingMinutes} min read
          </span>
          <h1 style={{ marginTop: "10px" }}>{guide.title}</h1>
          <p style={{ fontSize: "17px", color: "var(--ink-2)", marginTop: "10px" }}>{guide.standfirst}</p>

          <div className="register" style={{ margin: "20px 0 26px" }}>
            <div className="rrow">
              <span className="dot ok" />
              <div>
                <div className="lbl">Written by {guide.author}</div>
                <div className="src">Published {guide.publishedOn}</div>
              </div>
              <span className="when">{guide.publishedOn}</span>
            </div>
            <div className="rrow">
              <span className="dot ok" />
              <div>
                <div className="lbl">Medically reviewed</div>
                <div className="src">{guide.reviewer}</div>
              </div>
              <span className="when">{guide.reviewedOn}</span>
            </div>
          </div>

          {guide.body}

          {specialty ? (
            <div className="panel pad" style={{ marginTop: "30px" }}>
              <div className="eyebrow">Find {specialty.aOne}</div>
              <p style={{ marginTop: "8px", marginBottom: "12px" }}>
                {countIndexable(specialty.key)} verified {specialty.plural.toLowerCase()} in {CITY.name},
                each with registration, qualifications and current practice checked and dated.
              </p>
              <Link className="btn" href={paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug)} style={{ display: "inline-block" }}>
                {specialty.plural} in {CITY.name}
              </Link>
            </div>
          ) : null}

          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "24px" }}>
            General guidance, not advice about your situation. Not for emergencies — call 108. Errors can
            be reported through the <Link href={paths.policy("corrections")}>corrections process</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
