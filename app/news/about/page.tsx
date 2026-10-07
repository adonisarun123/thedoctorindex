import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { NEWS_DAILY_MAX } from "@/lib/news/format";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, newsdeskLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

const TITLE = "About the TDi Newsdesk";
const DESCRIPTION = "How the TDi Newsdesk finds, checks and writes news about Indian doctors: sources, the two-source rule, corrections, and what we will not publish.";

export const metadata: Metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: paths.newsAbout() });

/**
 * The Newsdesk's standards page, and the author page every NewsArticle's
 * `author.url` points at. It describes what the pipeline actually does
 * (lib/news, lib/services/news.ts) — keep the two in step.
 */
export default function NewsAbout() {
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "News", path: paths.news() },
    { name: "About the Newsdesk", path: paths.newsAbout() },
  ];
  const url = absoluteUrl(paths.newsAbout());
  return (
    <>
      <RouteMeta data={{ route: "Newsdesk standards", title: `${TITLE} | ${SITE.name}`, h1: TITLE, canonical: url, index: true, structuredData: "AboutPage (mainEntity Organization: TDi Newsdesk) › BreadcrumbList" }} />
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "AboutPage", "@id": url, url, name: TITLE, description: DESCRIPTION, inLanguage: "en-IN", mainEntity: newsdeskLd() },
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <article className="wrap post">
        <header className="posthead">
          <span className="eyebrow">Newsroom standards</span>
          <h1>{TITLE}</h1>
          <p className="standfirst">{DESCRIPTION}</p>
        </header>
        <div className="doc postbody" style={{ maxWidth: "74ch" }}>
          <h2>What we cover</h2>
          <p>
            Achievements of doctors practising in India and of Indian-origin doctors abroad: awards and honours, medical firsts, published research, recognition by professional bodies, public-health work, milestones and senior appointments. We publish up to {NEWS_DAILY_MAX} stories a day, and none on a day when there is nothing worth publishing.
          </p>
          <h2>Where the facts come from</h2>
          <ul>
            <li>Every story is built from published reporting &mdash; news outlets, government releases, journals, and hospitals&rsquo; and institutions&rsquo; own announcements &mdash; and lists each source at the foot of the page with a link.</li>
            <li>We summarise in our own words and never reproduce a source&rsquo;s text. Quotations are short, attributed, and taken only from a cited source.</li>
            <li>Every highlight and every figure in &ldquo;By the numbers&rdquo; must appear in a cited source. Before publishing, each statement is checked against the source texts; a statement no source supports is removed or the story goes to an editor.</li>
          </ul>
          <h2>When a story needs an editor</h2>
          <p>
            Stories are researched and drafted with the help of software, including AI. A story is published without an editor reading it first only when all of these hold: at least two independent news organisations or institutions report it; the doctor has been matched to their profile on The Doctor Index; the news was reported within the last two weeks; and the statement check passed. Everything else &mdash; a single-source story, a doctor not on the site, an Indian-origin doctor abroad &mdash; is read and approved by a member of our team before it appears.
          </p>
          <h2>Linking to a doctor&rsquo;s profile</h2>
          <p>
            When a story is about a doctor listed here, it links to their profile and shows what we have verified about them, such as whether their medical registration was checked against the register. Reporting an achievement is not a recommendation of a doctor or their treatment, and no doctor can pay to appear in, or be left out of, the news. See our <Link href={paths.policy("advertising")}>advertising policy</Link>.
          </p>
          <h2>What we will not publish</h2>
          <ul>
            <li>Claims of cures, guaranteed results, or treatment outcomes stated as fact in our own voice.</li>
            <li>Rankings or superlatives (&ldquo;best&rdquo;, &ldquo;top&rdquo;, &ldquo;leading&rdquo;) in our own voice. If a source calls something a first, we attribute it.</li>
            <li>Patients&rsquo; names, photographs or identifying details, unless the patient made them public through the source.</li>
            <li>Press photographs. Images on our stories are our own cards, or a doctor&rsquo;s profile photo published with their consent.</li>
            <li>Sponsored or paid-for stories of any kind.</li>
          </ul>
          <h2>Corrections</h2>
          <p>
            If we get something wrong we correct it on the story, with a dated note saying what changed. Doctors named in a story can ask for a factual correction or for a profile link to be added or removed. Use the <Link href={paths.policy("corrections")}>corrections process</Link> or write to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
          </p>
          <p className="postfoot">
            The TDi Newsdesk is the news team of {SITE.name}. Read the site&rsquo;s wider <Link href={paths.policy("editorial")}>editorial policy</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
