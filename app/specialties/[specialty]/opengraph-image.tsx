import { countIndexable } from "@/lib/data";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const revalidate = 3600;
export const dynamicParams = true;

/** Rendered on first request and refreshed hourly: the card carries a live count. */
export function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ specialty: string }> }) {
  const sp = specialtyByKey((await params).specialty);
  if (!sp) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  // The published pool, not verified supply: verified supply is 6 profiles
  // site-wide, so this card used to promise "0 … to choose from".
  const n = await countIndexable(sp.key, undefined, "eligible");
  return ogCard({
    eyebrow: sp.department,
    title: sp.name,
    subtitle: `When to consult ${sp.aOne}, in plain language, and ${n.toLocaleString("en-IN")} ${sp.plural.toLowerCase()} listed across India.`,
    chips: sp.when.slice(0, 3).map((w) => (w.length > 34 ? `${w.slice(0, 32).trimEnd()}…` : w)),
    kicker: sp.reviewedOn ? `Medically reviewed ${sp.reviewedOn}` : "General orientation, not medical advice",
  });
}
