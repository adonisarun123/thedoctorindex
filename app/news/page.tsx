import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { NEWS_CATEGORIES, NEWS_DESK, isCategory, istDate } from "@/lib/news/format";
import { categoryCounts, listPublishedStories, type StoryListItem } from "@/lib/services/news";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

const TITLE = "Indian doctors in the news";
const DESCRIPTION = "Awards, medical firsts, research and appointments of Indian doctors at home and abroad — reported daily by the TDi Newsdesk, every story sourced.";

type Search = Promise<Record<string, string | string[] | undefined>>;

async function load(category?: string) {
  if (!process.env.DATABASE_URL) return { rows: [] as StoryListItem[], counts: {} as Record<string, number> };
  const [rows, counts] = await Promise.all([listPublishedStories({ category, limit: 60 }), categoryCounts()]);
  return { rows, counts };
}

function pickCategory(v: string | string[] | undefined): string | undefined {
  const c = Array.isArray(v) ? v[0] : v;
  return c && isCategory(c) ? c : undefined;
}

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const category = pickCategory((await searchParams).category);
  const { rows } = await load();
  // A filtered view is a convenience, not a page: it canonicalises to /news
  // and stays out of the index. An empty newsroom is thin, so it waits too.
  const meta = pageMeta({ title: TITLE, description: DESCRIPTION, path: paths.news(), index: !category && rows.length > 0 });
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": absoluteUrl("/news/feed.xml") } } };
}

function Item({ r }: { r: StoryListItem }) {
  return (
    <Link className="newsitem" href={paths.newsStory(r.slug)}>
      <span className="newstag">
        {isCategory(r.category) ? NEWS_CATEGORIES[r.category].label : "News"}
        {r.place ? <><span className="sep">·</span><span style={{ fontWeight: 400, color: "var(--muted)" }}>{r.place}</span></> : null}
      </span>
      <h3>{r.headline}</h3>
      <p className="dek">{r.dek}</p>
      {r.publishedAt ? <div className="meta">{istDate(r.publishedAt)}</div> : null}
    </Link>
  );
}

export default async function NewsHub({ searchParams }: { searchParams: Search }) {
  const category = pickCategory((await searchParams).category);
  const { rows, counts } = await load(category);
  const [lead, ...rest] = rows;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "News", path: paths.news() }];
  const latest = rows[0]?.publishedAt;

  return (
    <>
      <RouteMeta data={{ route: "News hub", title: `${TITLE} | ${SITE.name}`, h1: `${NEWS_DESK}`, canonical: absoluteUrl(paths.news()), index: !category && rows.length > 0, structuredData: "CollectionPage (ItemList of NewsArticle) › BreadcrumbList" }} />
      <JsonLd
        data={[
          collectionLd({ name: TITLE, path: paths.news(), description: DESCRIPTION, items: rows.map((r) => ({ name: r.headline, path: paths.newsStory(r.slug) })) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <div className="wrap post">
        <header className="newsmast">
          <div>
            <h1 className="title">
              TDi <span>Newsdesk</span>
            </h1>
            <p className="tagline">{DESCRIPTION}</p>
          </div>
          <div className="dateline">
            {latest ? <>Updated {istDate(latest)}<br /></> : null}
            <Link href={paths.newsAbout()}>Our standards</Link> · <a href="/news/feed.xml">RSS</a>
          </div>
        </header>

        {total > 0 ? (
          <nav className="newscats" aria-label="Filter by category">
            <Link href={paths.news()} aria-current={!category ? "page" : undefined}>All<span className="n">{total}</span></Link>
            {Object.entries(NEWS_CATEGORIES)
              .filter(([k]) => counts[k])
              .map(([k, v]) => (
                <Link key={k} href={paths.news(k)} aria-current={category === k ? "page" : undefined}>
                  {v.plural}
                  <span className="n">{counts[k]}</span>
                </Link>
              ))}
          </nav>
        ) : null}

        {!lead ? (
          <p className="newsempty">The first stories are on their way. The Newsdesk publishes one or two a day.</p>
        ) : (
          <>
            <Link className="newslead" href={paths.newsStory(lead.slug)}>
              <div>
                <span className="newstag">
                  {isCategory(lead.category) ? NEWS_CATEGORIES[lead.category].label : "News"}
                  {lead.place ? <><span className="sep">·</span><span style={{ fontWeight: 400, color: "var(--muted)" }}>{lead.place}</span></> : null}
                </span>
                <h2>{lead.headline}</h2>
                <p className="dek">{lead.dek}</p>
                {lead.publishedAt ? <div className="meta">{NEWS_DESK} · {istDate(lead.publishedAt)}</div> : null}
              </div>
              {lead.highlights.length ? (
                <div className="hlbox">
                  <div className="hlh">Key highlights</div>
                  <ol>
                    {lead.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </Link>
            <div className="newsgrid">
              {rest.map((r) => (
                <Item key={r.slug} r={r} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
