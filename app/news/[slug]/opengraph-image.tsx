import { coverCard, doctorPhotoDataUri } from "@/lib/news/card";
import { getPublishedStory } from "@/lib/services/news";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 3600;
export const runtime = "nodejs";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const row = process.env.DATABASE_URL ? await getPublishedStory((await params).slug) : null;
  if (!row) return ogCard({ title: "Indian doctors in the news", kicker: "TDi Newsdesk", eyebrow: "News" });
  const photo = await doctorPhotoDataUri(row.doctors.find((d) => d.primary));
  return coverCard(row.story, photo, "og");
}
