import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { NewsDoctorCard } from "@/components/NewsDoctorCard";
import { RouteMeta } from "@/components/RouteMeta";
import { parseArticleBody } from "@/lib/articles/format";
import { words } from "@/lib/content/text";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { NEWS_CATEGORIES, NEWS_DESK, isCategory, istDate, istDateTime, readingMinutes } from "@/lib/news/format";
import { getPublishedStory, listPublishedStories, storyNumbers, storySources } from "@/lib/services/news";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, newsArticleLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

/**
 * A TDi Newsdesk story. Published only from the newsroom pipeline's buffer or
 * by staff (lib/services/news.ts); every fact is drawn from the sources
 * listed at the foot, which the NewsArticle markup cites too.
 */
export const revalidate = 600;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return [];
}

const load = cache(async (slug: string) => (process.env.DATABASE_URL ? getPublishedStory(slug) : null));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const row = await load((await params).slug);
  if (!row) return { title: "Not found", robots: { index: false, follow: false } };
  const st = row.story;
  const section = isCategory(st.category) ? NEWS_CATEGORIES[st.category].label : "News";
  const meta = pageMeta({
    title: st.headline,
    description: st.dek,
    path: paths.newsStory(st.slug),
    type: "article",
    image: "segment",
    article: {
      publishedTime: st.publishedAt?.toISOString(),
      modifiedTime: (st.correctedAt ?? st.publishedAt)?.toISOString(),
      authors: [absoluteUrl(paths.newsAbout())],
      section,
      tags: [st.subjectName, section, st.place].filter(Boolean),
    },
  });
  // Google's large-image preview in Discover needs this explicitly.
  return { ...meta, robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } };
}

export default async function NewsStoryPage({ params }: { params: Promise<Params> }) {
  const row = await load((await params).slug);
  if (!row) notFound();
  const st = row.story;
  const doctors = row.doctors;
  const primary = doctors.find((d) => d.primary) ?? null;
  const sources = storySources(st);
  const numbers = storyNumbers(st);
  const section = isCategory(st.category) ? NEWS_CATEGORIES[st.category] : null;
  const published = st.publishedAt ?? st.createdAt;
  const modified = st.correctedAt ?? published;
  const path = paths.newsStory(st.slug);
  const url = absoluteUrl(path);
  const blocks = parseArticleBody(st.body);
  const wordCount = words([st.dek, ...st.highlights, st.whyItMatters, st.body].join(" "));
  const more = await listPublishedStories({ limit: 3, excludeId: st.id });
  const sp = st.specialtyKey ? SPECIALTIES[st.specialtyKey as keyof typeof SPECIALTIES] : null;
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "News", path: paths.news() },
    { name: st.headline, path },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "News story",
          title: `${st.headline} | ${SITE.name}`,
          h1: st.headline,
          canonical: url,
          index: true,
          structuredData: "NewsArticle (author TDi Newsdesk, about Physician @id, citation) › BreadcrumbList",
          notes: [
            { label: "Sources", text: `${sources.length} cited; every fact is drawn from them.` },
            { label: "Publishing", text: st.autoEligible ? "Auto-approved: 2+ independent sources, doctor matched, claims check passed." : "Approved by staff." },
          ],
        }}
      />
      <JsonLd
        data={[
          newsArticleLd({
            slug: st.slug,
            headline: st.headline,
            dek: st.dek,
            category: st.category,
            section: section?.label ?? "News",
            publishedAt: published,
            modifiedAt: modified,
            wordCount,
            subject: { name: st.subjectName, jobTitle: st.subjectRole || undefined, place: st.place || undefined },
            doctors: doctors.map((d) => ({ slug: d.slug, primary: d.primary })),
            sources,
            correction: st.correction && st.correctedAt ? { text: st.correction, at: st.correctedAt } : null,
            keywords: [st.subjectName, section?.label, sp?.name, st.place, "Indian doctors"].filter((x): x is string => Boolean(x)),
          }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <article className="wrap post">
        <header className="storyhead">
          <span className="newstag">
            <Link href={paths.news(st.category)} style={{ color: "inherit" }}>{section?.label ?? "News"}</Link>
            {st.place ? <><span className="sep">·</span><span>{st.place}{st.abroad ? " (Indian-origin doctor abroad)" : ""}</span></> : null}
          </span>
          <h1>{st.headline}</h1>
          <p className="standfirst">{st.dek}</p>
          <div className="byline">
            <span>By <Link href={paths.newsAbout()}><b>{NEWS_DESK}</b></Link></span>
            <span><time dateTime={published.toISOString()}>{istDateTime(published)}</time></span>
            {st.correctedAt ? <span>Corrected <time dateTime={st.correctedAt.toISOString()}>{istDate(st.correctedAt)}</time></span> : null}
            <span>{readingMinutes(st.body)} min read</span>
            <span>{sources.length} source{sources.length === 1 ? "" : "s"}</span>
          </div>
        </header>

        <div className="postgrid">
          <div className="postbody doc">
            {st.correction && st.correctedAt ? (
              <p className="notice correction">
                <b>Correction, {istDate(st.correctedAt)}:</b> {st.correction}
              </p>
            ) : null}

            <section className="highlights" aria-labelledby="kh">
              <h2 id="kh">Key highlights</h2>
              <ol>
                {st.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </section>

            {numbers.length ? (
              <section className="numbers" aria-label="By the numbers">
                {numbers.map((n) => (
                  <div key={n.label}>
                    <div className="nv">{n.value}</div>
                    <div className="nl">{n.label}</div>
                  </div>
                ))}
              </section>
            ) : null}

            <ArticleBody blocks={blocks} />

            <section className="whymatters" aria-labelledby="wm">
              <h2 id="wm">Why it matters for patients</h2>
              <p>{st.whyItMatters}</p>
            </section>

            <section className="sources" aria-labelledby="src">
              <h2 id="src">Sources</h2>
              <ol>
                {sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener nofollow">{s.title}</a> <span className="pub">— {s.publisher}{s.publishedOn ? `, ${istDate(new Date(`${s.publishedOn}T12:00:00+05:30`))}` : ""}</span>
                  </li>
                ))}
              </ol>
            </section>

            <p className="postfoot">
              Written by the {NEWS_DESK} from the reporting listed above; we link to every source and do not reproduce it. Reporting a doctor&rsquo;s achievement is not a recommendation or an endorsement of their treatment. Spotted an error? <Link href={paths.policy("corrections")}>Tell us</Link> and we will correct it on this page with a dated note. Read our <Link href={paths.newsAbout()}>newsroom standards</Link>.
            </p>
          </div>

          <aside className="rail" aria-label="About this story">
            {doctors.map((d) => (
              <NewsDoctorCard key={d.id} d={d} subjectRole={d.primary ? st.subjectRole : undefined} />
            ))}
            {!primary ? (
              <div className="railcard">
                <div className="eyebrow">In this story</div>
                <p style={{ margin: "8px 0 0" }}>
                  <b style={{ color: "var(--ink)" }}>{st.subjectName}</b>
                  {st.subjectRole ? <><br />{st.subjectRole}</> : null}
                </p>
                <p>{st.abroad ? "Practises outside India, so does not have a profile in this directory." : "Not yet listed on The Doctor Index."}</p>
                {!st.abroad ? <Link className="btn quiet" href={paths.addDoctor()}>Add a doctor&rsquo;s profile</Link> : null}
              </div>
            ) : null}
            <div className="railcard">
              <div className="eyebrow">About the Newsdesk</div>
              <p>Achievements, firsts, research and appointments of Indian doctors, at home and abroad — one or two stories a day, every one sourced.</p>
              <Link className="plainlink" href={paths.news()}>All news →</Link>
              <a className="plainlink" href="/news/feed.xml">RSS feed</a>
            </div>
          </aside>
        </div>

        {more.length ? (
          <section className="storymore" aria-labelledby="more">
            <h2 id="more">More from the {NEWS_DESK}</h2>
            <div className="newsgrid">
              {more.map((m) => (
                <Link key={m.slug} className="newsitem" href={paths.newsStory(m.slug)}>
                  <span className="newstag">{isCategory(m.category) ? NEWS_CATEGORIES[m.category].label : "News"}</span>
                  <h3>{m.headline}</h3>
                  <p className="dek">{m.dek}</p>
                  {m.publishedAt ? <div className="meta">{istDate(m.publishedAt)}</div> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
