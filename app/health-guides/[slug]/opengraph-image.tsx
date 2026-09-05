import { GUIDES, guideBySlug } from "@/lib/data/guides";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  return ogCard({
    eyebrow: "Health guide",
    title: g.title,
    subtitle: g.standfirst,
    chips: [`${g.readingMinutes} min read`, `Reviewed ${g.reviewedOn}`, g.author],
    kicker: "Medically reviewed",
  });
}
