import Link from "next/link";

import { BLOG_CATEGORIES, readingMinutes, type BlogPost } from "@/lib/blog";
import { paths } from "@/lib/site";

/**
 * A short "Useful before you go" block linking into the blog from the
 * directory's own pages. Posts are chosen per page family in
 * lib/blog/placements.ts. Renders nothing when given nothing.
 */
export function BlogReading({
  posts,
  title = "Useful before you go",
  id = "blog-reading",
}: {
  posts: BlogPost[];
  title?: string;
  id?: string;
}) {
  if (!posts.length) return null;
  return (
    <section className="readnext" aria-labelledby={`${id}-heading`}>
      <div className="section-head">
        <h2 id={`${id}-heading`}>{title}</h2>
        <Link href={paths.blog()}>All posts</Link>
      </div>
      <div className="guidegrid">
        {posts.map((p) => (
          <Link key={p.slug} className="guide" href={paths.blogPost(p.slug)}>
            <div className="eyebrow">{BLOG_CATEGORIES[p.category].name}</div>
            <div className="t">{p.metaTitle ?? p.title}</div>
            <div className="d">{p.standfirst}</div>
            <div className="m">{readingMinutes(p)} min read</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
