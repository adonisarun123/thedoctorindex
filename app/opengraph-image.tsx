import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Default social card for every page without a more specific one. */
export default function Image() {
  return ogCard({
    eyebrow: "India",
    title: SITE.tagline,
    subtitle: "Registration, qualification and current practice, each checked separately and dated.",
    chips: ["Council registers", "Dated verification", "Free for doctors", "Ranking never sold"],
    kicker: "Verified directory",
  });
}
