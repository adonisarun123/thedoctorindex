import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ArticleBody, Contents } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { articleReadingMinutes, articleWordCount, parseArticleBody, registrationLine } from "@/lib/articles/format";
import { anchorId } from "@/lib/blog/types";
import { plain } from "@/lib/content/rich";
import { toDisplay } from "@/lib/db/dates";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import { getPublishedArticle } from "@/lib/services/articles";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

/**
 * A doctor's article. Published only after staff approval, under a claimed
 * profile whose registration was checked against the register; the
 * registration printed here was copied from that profile at approval.
 *
 * Indexed unless the doctor gave an original publication link, in which case
 * the canonical points there and the page is noindex (and absent from
 * /sitemaps/articles.xml).
 */
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return [];
}

const load = cache(async (slug: string) => (process.env.DATABASE_URL ? getPublishedArticle(slug) : null));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const row = await load((await params).slug);
  if (!row) return { title: "Not found", robots: { index: false, follow: false } };
  const a = row.article;
  const meta = pageMeta({
    title: a.title,
    description: a.description,
    path: paths.article(a.slug),
    index: !a.sourceUrl,
    type: "article",
    image: "segment",
    article: {
      publishedTime: a.publishedAt?.toISOString(),
      modifiedTime: (a.decidedAt ?? a.publishedAt)?.toISOString(),
      authors: [absoluteUrl(paths.doctor(row.doctorSlug))],
      section: SPECIALTIES[row.specialty]?.name,
    },
  });
  return a.sourceUrl ? { ...meta, alternates: { canonical: a.sourceUrl } } : meta;
}

export default async function DoctorArticlePage({ params }: { params: Promise<Params> }) {
  const row = await load((await params).slug);
  if (!row) notFound();
  const a = row.article;
  const author = displayName({ name: row.doctorName, specialty: row.specialty });
  const specialty = SPECIALTIES[row.specialty];
  const reg = registrationLine(a.registrationCouncil, a.registrationNumber);
  const blocks = parseArticleBody(a.body);
  const toc = blocks.filter((b): b is { k: "h2"; text: string } => b.k === "h2").map((b) => ({ id: anchorId(b.text), text: plain(b.text) }));
  const path = paths.article(a.slug);
  const url = absoluteUrl(path);
  const profileUrl = absoluteUrl(paths.doctor(row.doctorSlug));
  const words = articleWordCount(a);
  const updated = a.decidedAt && a.publishedAt && a.decidedAt.getTime() - a.publishedAt.getTime() > 86_400_000 ? a.decidedAt : null;
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Articles by doctors", path: paths.articles() },
    { name: a.title, path },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Doctor article",
          title: `${a.title} | ${SITE.name}`,
          h1: a.title,
          canonical: a.sourceUrl ?? url,
          index: !a.sourceUrl,
          structuredData: "Article (author Person with registration identifier) › BreadcrumbList",
          notes: [
            { label: "Review", text: "Approved by staff for authorship and content rules. Not clinical peer review; the page says so." },
            ...(a.sourceUrl ? [{ label: "Republished", text: "Canonical points at the original publication; noindex and out of the sitemap." }] : []),
          ],
        }}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${url}#article`,
            url,
            mainEntityOfPage: a.sourceUrl ?? url,
            headline: a.title,
            description: a.description,
            datePublished: a.publishedAt?.toISOString(),
            dateModified: (a.decidedAt ?? a.publishedAt)?.toISOString(),
            inLanguage: "en-IN",
            wordCount: words,
            isAccessibleForFree: true,
            author: {
              "@type": "Person",
              name: author,
              url: profileUrl,
              ...(a.registrationNumber
                ? { identifier: { "@type": "PropertyValue", propertyID: a.registrationCouncil ?? "Medical registration", value: a.registrationNumber } }
                : {}),
            },
            publisher: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
          },
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <article className="wrap post">
        <header className="posthead">
          <span className="eyebrow">
            {specialty ? `${specialty.name} · ` : ""}
            {articleReadingMinutes(a)} min read
          </span>
          <h1>{a.title}</h1>
          <p className="standfirst">{a.description}</p>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", margin: "10px 0 0" }}>
            By <Link href={paths.doctor(row.doctorSlug)}>{author}</Link>
            {reg ? <> · Reg. <span className="mono">{reg}</span></> : null} · {toDisplay(a.publishedAt)}
          </p>
        </header>

        <div className="postgrid">
          <div className="postbody doc">
            {a.sourceUrl ? (
              <p className="notice" style={{ marginBottom: "18px" }}>
                First published at{" "}
                <a href={a.sourceUrl} target="_blank" rel="noopener nofollow">
                  {new URL(a.sourceUrl).hostname.replace(/^www\./, "")}
                </a>
                .
              </p>
            ) : null}

            <ArticleBody blocks={blocks} />

            <p className="postfoot">
              Written by {author}
              {reg ? <> (registration {reg})</> : null}, who is responsible for its content. The Doctor Index checked the author&rsquo;s registration and the site&rsquo;s content rules before publishing; this is not a clinical peer review. General information, not advice about your situation — see a doctor for that, and in an emergency call {SITE.emergencyNumber}.
            </p>
          </div>

          <aside className="rail" aria-label="About this article">
            <div className="railcard">
              <div className="eyebrow">About the author</div>
              <dl className="railmeta">
                <div>
                  <dt>Written by</dt>
                  <dd><Link href={paths.doctor(row.doctorSlug)}>{author}</Link>{specialty ? `, ${specialty.one.toLowerCase()}` : ""}</dd>
                </div>
                {reg ? (
                  <div>
                    <dt>Medical registration</dt>
                    <dd className="mono">{reg}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Published</dt>
                  <dd>{toDisplay(a.publishedAt)}</dd>
                </div>
                {updated ? (
                  <div>
                    <dt>Updated</dt>
                    <dd>{toDisplay(updated)}</dd>
                  </div>
                ) : null}
              </dl>
              <Link className="btn" href={paths.doctor(row.doctorSlug)}>View profile</Link>
            </div>
            {toc.length > 1 ? <Contents items={toc} /> : null}
          </aside>
        </div>
      </article>
    </>
  );
}
