import { SITE } from "@/lib/site";

/**
 * The TDi mark, traced from the Sep 2026 logo artwork (1254px master).
 *
 * Colours come from CSS tokens, not literals: `--brand-navy` flips to the
 * light ink in dark mode (navy on a near-black ground would vanish), while
 * `--brand-teal` holds in both themes. Social cards and the favicon cannot
 * read CSS, so lib/seo/og.tsx and app/icon.svg carry the literal hexes.
 */
export const MARK_VIEWBOX = "190 352 862 472";
export const MARK_TD_PATH =
  "M219 382H740C850 382 912 470 912 598C912 730 845 812 730 812H523Q509 812 509 798V526Q509 512 523 512H599Q613 512 613 526V714H712C770 714 804 668 804 598C804 530 775 485 720 485H448V798Q448 812 434 812H358Q344 812 344 798V485H219Q201 485 201 467V400Q201 382 219 382Z";

export function LogoMark({ height = 26 }: { height?: number }) {
  return (
    <svg
      className="logomark"
      viewBox={MARK_VIEWBOX}
      height={height}
      width={Math.round((height * 862) / 472)}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="var(--brand-navy)" d={MARK_TD_PATH} />
      <circle cx="976" cy="428" r="64" fill="var(--brand-teal)" />
      <rect x="931" y="511" width="99" height="301" rx="24" fill="var(--brand-teal)" />
    </svg>
  );
}

/** Mark + wordmark, as on the artwork. The accessible name is the text. */
export function Logo({ height = 26 }: { height?: number }) {
  return (
    <span className="logo">
      <LogoMark height={height} />
      <span className="wordmark">{SITE.name}</span>
    </span>
  );
}
