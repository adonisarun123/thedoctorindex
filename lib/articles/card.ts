import "server-only";

import { articleReadingMinutes, registrationLine } from "@/lib/articles/format";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import type { getPublishedArticle } from "@/lib/services/articles";
import type { OgCard } from "@/lib/seo/og";

type Published = NonNullable<Awaited<ReturnType<typeof getPublishedArticle>>>;

/**
 * Social card for an approved article: title, author, registration. Used for
 * the page's Open Graph image and for the Instagram/LinkedIn downloads in the
 * doctor's dashboard, so every share carries the registration number.
 */
export function articleCard(row: Published): OgCard {
  const a = row.article;
  const author = displayName({ name: row.doctorName, specialty: row.specialty });
  const reg = registrationLine(a.registrationCouncil, a.registrationNumber);
  const initials = row.doctorName.replace(/^dr\.?\s*/i, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return {
    eyebrow: SPECIALTIES[row.specialty]?.name ?? "Health",
    title: a.title,
    subtitle: `By ${author}`,
    chips: [reg ? `Reg. ${reg}` : "", `${articleReadingMinutes(a)} min read`].filter(Boolean),
    initials,
    kicker: "Written by a registered doctor",
  };
}

/** Download sizes offered to the doctor. */
export const SHARE_SIZES = {
  landscape: { width: 1200, height: 627, label: "LinkedIn / Facebook / X" },
  portrait: { width: 1080, height: 1350, label: "Instagram post" },
  square: { width: 1080, height: 1080, label: "Instagram / WhatsApp status" },
} as const;
export type ShareSize = keyof typeof SHARE_SIZES;
