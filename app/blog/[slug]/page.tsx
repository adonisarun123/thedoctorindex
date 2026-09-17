import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody, Contents, FaqList } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { BLOG_CATEGORIES, POSTS, abstract, contents, postBySlug, readingMinutes, relatedTo, wordCount } from "@/lib/blog";
import { plain } from "@/lib/content/rich";
import { blogPostLd, breadcrumbLd, faqLd, isoDate } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: post.metaTitle ?? post.title,
    ogTitle: post.title,
    description: post.standfirst,
    path: paths.blogPost(post.slug),
    type: "article",
    image: "segment",
    article: {
      publishedTime: isoDate(post.publishedOn),
      modifiedTime: isoDate(post.updatedOn),
      authors: [absoluteUrl("/about")],
      section: BLOG_CATEGORIES[post.category].name,
    },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const category = BLOG_CATEGORIES[post.category];
  const path = paths.blogPost(post.slug);
  const related = relatedTo(post);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Blog", path: paths.blog() },
    { name: post.metaTitle ?? post.title },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Blog post",
          title: `${post.metaTitle ?? post.title} | ${SITE.name}`,
          h1: post.title,
          canonical: absoluteUrl(path),
          index: true,
          structuredData: "BlogPosting (author, publisher, wordCount) › FAQPage, BreadcrumbList",
          lastmod: post.updatedOn,
          notes: [
            {
              label: "FAQ markup, deliberately",
              text: "Google restricts FAQ rich results to authoritative government and health sources, so no snippet is expected here. The markup is emitted for answer engines and assistants, and every question in it is visible on the page.",
            },
            {
              label: `${wordCount(post)} words`,
              text: "Counted from the body itself rather than asserted. tests/unit/blog.test.ts fails the build below the published minimum.",
            },
          ],
        }}
      />
      <JsonLd
        data={[
          blogPostLd(post, {
            wordCount: wordCount(post),
            readingMinutes: readingMinutes(post),
            abstract: abstract(post),
            keywords: [post.targetQuery, category.name],
          }),
          faqLd(path, post.faqs.map((f) => ({ q: plain(f.q), a: plain(f.a) }))),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <article className="wrap post">
        <header className="posthead">
          <span className="eyebrow">
            <Link href={paths.blog()}>{category.name}</Link> · {readingMinutes(post)} min read ·{" "}
            {wordCount(post).toLocaleString("en-IN")} words
          </span>
          <h1>{post.title}</h1>
          <p className="standfirst">{post.standfirst}</p>
        </header>

        <div className="postgrid">
          <div className="postbody doc">
            <ArticleBody blocks={post.body} />

            <FaqList faqs={post.faqs} />

            <div className="endcta">
              <div>
                <div className="eyebrow">Put it to use</div>
                <p>
                  Every profile shows what was checked — registration, qualifications, current
                  practice — against which source and on what date, and says so plainly where nothing
                  has been verified yet.
                </p>
              </div>
              <Link className="btn" href="/doctors">
                Browse doctors
              </Link>
            </div>

            <p className="postfoot">
              General information about how healthcare in India is organised and regulated, current at{" "}
              {post.updatedOn}. Not advice about your situation, and not for emergencies — call{" "}
              {SITE.emergencyNumber}. Errors can be reported through the{" "}
              <Link href={paths.policy("corrections")}>corrections process</Link>.
            </p>
          </div>

          <aside className="rail" aria-label="About this post">
            <div className="railcard">
              <div className="eyebrow">About this post</div>
              <dl className="railmeta">
                <div>
                  <dt>Written by</dt>
                  <dd>{post.author}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{post.publishedOn}</dd>
                </div>
                {post.updatedOn !== post.publishedOn ? (
                  <div>
                    <dt>Updated</dt>
                    <dd>{post.updatedOn}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Clinical review</dt>
                  <dd>
                    Not required. This post is about registers, credentials, costs and process, and
                    makes no claim about any condition or treatment.
                  </dd>
                </div>
              </dl>
            </div>

            <Contents items={contents(post)} />

            <div className="railcard railcta">
              <div className="eyebrow">The directory</div>
              <p>Verified doctors by city and speciality, each showing what was checked and when.</p>
              <Link className="btn" href="/doctors">
                Browse doctors
              </Link>
              <Link className="plainlink" href="/health-guides">
                Health guides →
              </Link>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="readnext" aria-labelledby="readnext-heading">
            <div className="section-head">
              <h2 id="readnext-heading">Read next</h2>
              <Link href={paths.blog()}>All posts</Link>
            </div>
            <div className="guidegrid">
              {related.map((r) => (
                <Link key={r.slug} className="guide" href={paths.blogPost(r.slug)}>
                  <div className="eyebrow">{BLOG_CATEGORIES[r.category].name}</div>
                  <div className="t">{r.metaTitle ?? r.title}</div>
                  <div className="d">{r.standfirst}</div>
                  <div className="m">{readingMinutes(r)} min read</div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
