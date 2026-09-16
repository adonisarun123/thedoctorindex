import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { BLOG_CATEGORIES, CATEGORY_ORDER, POSTS, postsIn, readingMinutes } from "@/lib/blog";
import { breadcrumbLd, blogLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";

const DESCRIPTION =
  "How to check a doctor's registration, what qualifications mean, what care costs, and what you are entitled to as a patient in India.";

export const metadata: Metadata = pageMeta({
  title: "Notes on finding and checking a doctor",
  ogTitle: "The Doctor Index blog — checking, choosing and paying for care in India",
  description: DESCRIPTION,
  path: "/blog",
});

/** Post count and reading times are derived from the posts themselves. */
export const revalidate = 3600;

export default function BlogIndexPage() {
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Blog" }];
  const [lead, ...rest] = POSTS;

  return (
    <>
      <RouteMeta
        data={{
          route: "Blog index",
          title: `Notes on finding and checking a doctor | ${SITE.name}`,
          h1: "Notes on finding and checking a doctor",
          canonical: absoluteUrl("/blog"),
          index: true,
          structuredData: "Blog (blogPost[]), BreadcrumbList",
          notes: [
            {
              label: "No category routes",
              text: "Categories group this index but are not separate URLs. Three or four posts do not make a page worth submitting, and thin category pages cost more crawl budget than they return. That changes above a dozen posts in a category.",
            },
            {
              label: "Non-clinical by design",
              text: "Every post here is about registers, credentials, costs, records or process. None makes a medical claim, so none waits on a medical reviewer — unlike the clinical health guides.",
            },
          ],
        }}
      />
      <JsonLd
        data={[
          blogLd({ description: DESCRIPTION, posts: POSTS.map((p) => ({ slug: p.slug, title: p.title, standfirst: p.standfirst, publishedOn: p.publishedOn })) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Editorial</span>
          <h1 style={{ marginTop: "10px" }}>Notes on finding and checking a doctor</h1>
          <div className="upd">
            {POSTS.length} posts · non-clinical · <Link href="/blog/feed.xml">RSS</Link> ·{" "}
            <Link href={paths.policy("editorial")}>editorial policy</Link>
          </div>
          <p style={{ maxWidth: "66ch" }}>
            {DESCRIPTION} These are the parts of Indian healthcare that are a matter of record rather
            than of clinical judgement — which is exactly why they can be written down plainly, and why
            nothing here needs a medical reviewer to stand behind it. For guidance on which kind of
            specialist to see, the <Link href="/health-guides">health guides</Link> are next door.
          </p>

          {lead ? (
            <Link className="postlead" href={paths.blogPost(lead.slug)}>
              <div className="eyebrow">{BLOG_CATEGORIES[lead.category].name} · Start here</div>
              <div className="t">{lead.title}</div>
              <div className="d">{lead.standfirst}</div>
              <div className="m">
                {readingMinutes(lead)} min read · {lead.updatedOn}
              </div>
            </Link>
          ) : null}

          {CATEGORY_ORDER.map((key) => {
            const posts = postsIn(key).filter((p) => !lead || p.slug !== lead.slug);
            if (!posts.length) return null;
            const category = BLOG_CATEGORIES[key];
            return (
              <section key={key} className="section" style={{ marginTop: "34px" }}>
                <div className="section-head">
                  <h2 style={{ fontSize: "1.2rem", margin: 0 }}>{category.name}</h2>
                </div>
                <p style={{ maxWidth: "62ch", marginTop: "-4px" }}>{category.blurb}</p>
                <div className="guidegrid">
                  {posts.map((p) => (
                    <Link key={p.slug} className="guide" href={paths.blogPost(p.slug)}>
                      <div className="eyebrow">{category.name}</div>
                      <div className="t">{p.title}</div>
                      <div className="d">{p.standfirst}</div>
                      <div className="m">
                        {readingMinutes(p)} min · {p.updatedOn}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="panel pad" style={{ marginTop: "34px" }}>
            <div className="eyebrow">The directory</div>
            <p style={{ marginTop: "8px", marginBottom: "12px", maxWidth: "62ch" }}>
              Everything above is the method. The directory is the method applied: each profile shows
              what was checked, against which source, on what date — and says so plainly where nothing
              has been verified yet.
            </p>
            <Link className="btn" href="/doctors" style={{ display: "inline-block" }}>
              Browse doctors by city and speciality
            </Link>
          </div>

          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "24px" }}>
            General information about how healthcare in India is organised and regulated. Not medical
            advice, and not for emergencies — call {SITE.emergencyNumber}. Errors can be reported through the{" "}
            <Link href={paths.policy("corrections")}>corrections process</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
