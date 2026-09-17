import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { BLOG_CATEGORIES, CATEGORY_ORDER, POSTS, postsIn, readingMinutes, wordCount } from "@/lib/blog";
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

      <div className="wrap post">
        <header className="bloghead">
          <div>
            <span className="eyebrow">Editorial · non-clinical</span>
            <h1>Notes on finding and checking a doctor</h1>
            <p className="standfirst">
              {DESCRIPTION} These are the parts of Indian healthcare that are a matter of record
              rather than of clinical judgement — which is why they can be written down plainly, and
              why nothing here needs a medical reviewer to stand behind it.
            </p>
          </div>
          <div className="railcard">
            <div className="eyebrow">{POSTS.length} posts</div>
            <p>
              For guidance on which kind of specialist to see, the health guides are next door. For
              the directory itself, start with a city and a speciality.
            </p>
            <Link className="btn" href="/doctors">
              Browse doctors
            </Link>
            <Link className="plainlink" href="/health-guides">
              Health guides →
            </Link>
            <Link className="plainlink" href="/blog/feed.xml">
              RSS feed →
            </Link>
            <Link className="plainlink" href={paths.policy("editorial")}>
              Editorial policy →
            </Link>
          </div>
        </header>

        {lead ? (
          <Link className="postlead" href={paths.blogPost(lead.slug)}>
            <div className="leadmain">
              <div className="eyebrow">{BLOG_CATEGORIES[lead.category].name} · Start here</div>
              <div className="t">{lead.title}</div>
              <div className="d">{lead.standfirst}</div>
            </div>
            <div className="leadmeta">
              <span className="mono">{readingMinutes(lead)} min read</span>
              <span className="mono">{wordCount(lead).toLocaleString("en-IN")} words</span>
              <span className="mono">{lead.updatedOn}</span>
              <span className="leadgo">Read &rarr;</span>
            </div>
          </Link>
        ) : null}

        {CATEGORY_ORDER.map((key) => {
          const posts = postsIn(key).filter((p) => !lead || p.slug !== lead.slug);
          if (!posts.length) return null;
          const category = BLOG_CATEGORIES[key];
          return (
            <section key={key} className="blogsection">
              <div className="section-head">
                <h2>{category.name}</h2>
                <span className="mono">{posts.length + (lead && lead.category === key ? 1 : 0)} posts</span>
              </div>
              <p className="sectionblurb">{category.blurb}</p>
              <div className="guidegrid">
                {posts.map((p) => (
                  <Link key={p.slug} className="guide" href={paths.blogPost(p.slug)}>
                    <div className="eyebrow">{category.name}</div>
                    <div className="t">{p.metaTitle ?? p.title}</div>
                    <div className="d">{p.standfirst}</div>
                    <div className="m">{readingMinutes(p)} min read</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <p className="postfoot">
          General information about how healthcare in India is organised and regulated. Not medical
          advice, and not for emergencies — call {SITE.emergencyNumber}. Errors can be reported
          through the <Link href={paths.policy("corrections")}>corrections process</Link>.
        </p>
      </div>
    </>
  );
}
