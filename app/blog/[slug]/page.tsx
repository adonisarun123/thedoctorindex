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

      <div className="wrap">
        <article className="doc post">
          <span className="eyebrow">
            {category.name} · {readingMinutes(post)} min read
          </span>
          <h1 style={{ marginTop: "10px" }}>{post.title}</h1>
          <p className="standfirst">{post.standfirst}</p>

          <div className="register" style={{ margin: "20px 0 26px" }}>
            <div className="rrow">
              <span className="dot ok" />
              <div>
                <div className="lbl">Written by {post.author}</div>
                <div className="src">
                  Published {post.publishedOn}
                  {post.updatedOn !== post.publishedOn ? ` · updated ${post.updatedOn}` : ""}
                </div>
              </div>
              <span className="when">{post.updatedOn}</span>
            </div>
            <div className="rrow">
              <span className="dot" />
              <div>
                <div className="lbl">Not medical advice</div>
                <div className="src">
                  This post is about registers, credentials, costs and process. It makes no claim about
                  any medical condition or treatment, which is why it carries no clinical reviewer.
                </div>
              </div>
              <span className="when">Non-clinical</span>
            </div>
          </div>

          <Contents items={contents(post)} />

          <ArticleBody blocks={post.body} />

          <FaqList faqs={post.faqs} />

          <div className="panel pad" style={{ marginTop: "30px" }}>
            <div className="eyebrow">Put it to use</div>
            <p style={{ marginTop: "8px", marginBottom: "12px" }}>
              Every profile in the directory shows what was checked — registration, qualifications,
              current practice — against which source and on what date, and says so plainly where
              nothing has been verified yet.
            </p>
            <Link className="btn" href="/doctors" style={{ display: "inline-block" }}>
              Browse doctors by city and speciality
            </Link>
          </div>

          {related.length ? (
            <section style={{ marginTop: "34px" }}>
              <h2 style={{ fontSize: "1.15rem" }}>Read next</h2>
              <div className="guidegrid">
                {related.map((r) => (
                  <Link key={r.slug} className="guide" href={paths.blogPost(r.slug)}>
                    <div className="eyebrow">{BLOG_CATEGORIES[r.category].name}</div>
                    <div className="t">{r.title}</div>
                    <div className="d">{r.standfirst}</div>
                    <div className="m">{readingMinutes(r)} min</div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "24px" }}>
            General information about how healthcare in India is organised and regulated, current at{" "}
            {post.updatedOn}. Not advice about your situation, and not for emergencies — call{" "}
            {SITE.emergencyNumber}. Errors can be reported through the{" "}
            <Link href={paths.policy("corrections")}>corrections process</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
