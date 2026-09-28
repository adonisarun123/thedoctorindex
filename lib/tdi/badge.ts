import { MARK_TD_PATH, MARK_VIEWBOX } from "@/components/Logo";
import { QR_NAVY, QR_TEAL } from "@/lib/tdi/qr";

/**
 * The embeddable badge a doctor puts on their own site, linking back to their
 * profile. It is the one backlink source that grows with supply: every claimed
 * doctor with a website is a potential link.
 *
 * The badge says only what the record supports. "Registration verified" needs
 * a register check on file (registrationState === "verified"); otherwise it
 * reads "Listed on". The image is generic per state so it caches at the edge;
 * the doctor's name travels in the link's alt text and title, which is what a
 * search engine reads as the anchor.
 */
export type BadgeState = "verified" | "listed";

import { BADGE_H, BADGE_W } from "@/lib/tdi/badge-size";

export { BADGE_H, BADGE_W };

export function badgeSvg(state: BadgeState): string {
  const [vx, vy, , vh] = MARK_VIEWBOX.split(" ").map(Number);
  const markH = 24; // 862x472 mark -> ~44px wide, spanning x 13..57
  const scale = markH / vh;
  const top = state === "verified" ? "Registration verified" : "Listed on";
  const tick = state === "verified"
    ? `<circle cx="70" cy="19" r="6" fill="${QR_TEAL}"/><path d="M67.2 19.2l1.9 1.9 3.8-3.9" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : "";
  const textX = state === "verified" ? 80 : 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BADGE_W}" height="${BADGE_H}" viewBox="0 0 ${BADGE_W} ${BADGE_H}" role="img" aria-label="${top} on The Doctor Index">`
    + `<rect x="0.5" y="0.5" width="${BADGE_W - 1}" height="${BADGE_H - 1}" rx="10" fill="#fff" stroke="#d6dee8"/>`
    + `<g transform="translate(${13 - vx * scale} ${(BADGE_H - markH) / 2 - vy * scale}) scale(${scale})"><path d="${MARK_TD_PATH}" fill="${QR_NAVY}"/></g>`
    + tick
    + `<text x="${textX}" y="23" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#4a5a6e">${top}</text>`
    + `<text x="64" y="41" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="${QR_NAVY}">The Doctor Index</text>`
    + `</svg>`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The copy-paste HTML. The link goes to the canonical profile URL, not the
 * /d/ short link, so the link's value lands on the page that ranks; a later
 * rename or merge is covered by the site's 301s.
 */
export function badgeSnippet(opts: { origin: string; slug: string; tdiId: string; name: string; state: BadgeState }): string {
  const href = `${opts.origin}/doctor/${opts.slug}`;
  const img = `${opts.origin}/d/${encodeURIComponent(opts.tdiId)}/badge`;
  const label = opts.state === "verified" ? `${opts.name} — registration verified on The Doctor Index` : `${opts.name} on The Doctor Index`;
  return `<a href="${esc(href)}" title="${esc(label)}"><img src="${esc(img)}" alt="${esc(label)}" width="${BADGE_W}" height="${BADGE_H}" loading="lazy"></a>`;
}
