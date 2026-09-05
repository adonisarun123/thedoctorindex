import { countIndexable } from "@/lib/data";
import { SPECIALTY_KEYS, specialtyByKey } from "@/lib/data/taxonomy";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return SPECIALTY_KEYS.map((specialty) => ({ specialty }));
}

export default async function Image({ params }: { params: Promise<{ specialty: string }> }) {
  const sp = specialtyByKey((await params).specialty);
  if (!sp) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  const n = await countIndexable(sp.key);
  return ogCard({
    eyebrow: sp.department,
    title: sp.name,
    subtitle: `When to consult ${sp.aOne}, in plain language, and ${n} verified ${sp.plural.toLowerCase()} to choose from.`,
    chips: sp.when.slice(0, 3).map((w) => (w.length > 34 ? `${w.slice(0, 32).trimEnd()}…` : w)),
    kicker: `Medically reviewed ${sp.reviewedOn}`,
  });
}
