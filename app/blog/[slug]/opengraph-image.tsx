import { BLOG_CATEGORIES, POSTS, postBySlug, readingMinutes } from "@/lib/blog";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  return ogCard({
    eyebrow: BLOG_CATEGORIES[post.category].name,
    title: post.metaTitle ?? post.title,
    subtitle: post.standfirst,
    chips: [`${readingMinutes(post)} min read`, post.updatedOn, "Non-clinical"],
    kicker: "The Doctor Index",
  });
}
