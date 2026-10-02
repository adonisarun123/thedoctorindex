import { articleCard } from "@/lib/articles/card";
import { getPublishedArticle } from "@/lib/services/articles";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const row = process.env.DATABASE_URL ? await getPublishedArticle((await params).slug) : null;
  if (!row) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  return ogCard(articleCard(row));
}
