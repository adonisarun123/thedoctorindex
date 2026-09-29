/**
 * Where a claim came from — the `src` tag on a claim link.
 *
 * Outreach links carry it (`/claim-profile?profile=<slug>&src=linkedin`) so the
 * claim funnel can be counted per channel: link opened (`claim_link_opened`),
 * then claim submitted (`claim_started`), both stored in `events.query` as
 * `src:<tag>`. Short lowercase tags only; anything else is dropped rather than
 * stored, since the value arrives from a URL anyone can edit.
 */
export const CLAIM_SOURCES = ["profile", "linkedin", "whatsapp", "email", "qr", "badge", "hospital", "gads", "meta", "lp", "other"] as const;

export function claimSource(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  return /^[a-z0-9_-]{1,32}$/.test(v) ? v : null;
}

/** The claim link for one profile, tagged with its channel. */
export function claimLink(slug: string, src?: string): string {
  const s = claimSource(src);
  return `/claim-profile?profile=${encodeURIComponent(slug)}${s ? `&src=${s}` : ""}`;
}
