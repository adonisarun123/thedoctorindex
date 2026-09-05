import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

/**
 * Social cards (Open Graph / Twitter) rendered on the server with next/og.
 *
 * Every public segment has an `opengraph-image.tsx` that calls `ogCard` with
 * the same data the page shows: never a phone number, never a photo without
 * consent, never a claim ("best", "top") the page itself does not make. The
 * renderer uses the font bundled with next/og so builds need no network.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export interface OgCard {
  /** Small caps line above the title, e.g. "Cardiologist · Bengaluru". */
  eyebrow?: string;
  title: string;
  /** One or two supporting lines. */
  subtitle?: string;
  /** Up to four short facts rendered as chips. */
  chips?: string[];
  /** Two-letter initials for the avatar disc; omitted for non-person cards. */
  initials?: string;
  /** Right-hand label, e.g. "Verified profile" / "Health guide". */
  kicker?: string;
}

const INK = "#0e1a19";
const ACCENT = "#0d5b55";
const SOFT = "#e3efec";
const MUTED = "#5a6b65";
const HAIR = "#d5dedb";
const VERIFIED = "#1f6b46";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1, marginTop: -2 }}>D</div>
        <div style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 8, background: "#63b489" }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: -0.3 }}>{SITE.name}</div>
    </div>
  );
}

export function ogCard(card: OgCard): ImageResponse {
  const title = card.title.length > 96 ? `${card.title.slice(0, 94).trimEnd()}…` : card.title;
  const titleSize = title.length > 64 ? 52 : title.length > 40 ? 62 : 72;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f2f5f4", padding: "56px 64px", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 14, height: "100%", background: ACCENT }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          {card.kicker ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: SOFT, color: ACCENT, fontSize: 22, fontWeight: 600 }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: VERIFIED }} />
              {card.kicker}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 40, flexGrow: 1, marginTop: 24 }}>
          {card.initials ? (
            <div style={{ width: 150, height: 150, borderRadius: 150, background: SOFT, border: `4px solid ${HAIR}`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: 64, fontWeight: 600, flexShrink: 0 }}>
              {card.initials}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            {card.eyebrow ? <div style={{ fontSize: 24, color: ACCENT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>{card.eyebrow}</div> : null}
            <div style={{ fontSize: titleSize, fontWeight: 700, color: INK, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
            {card.subtitle ? <div style={{ fontSize: 28, color: MUTED, lineHeight: 1.35, maxWidth: 900 }}>{card.subtitle}</div> : null}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `2px solid ${HAIR}`, paddingTop: 22 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 860, flexShrink: 1 }}>
            {(card.chips ?? []).slice(0, 4).map((c) => (
              <div key={c} style={{ padding: "8px 14px", borderRadius: 6, border: `2px solid ${HAIR}`, background: "#fff", color: INK, fontSize: 21, whiteSpace: "nowrap" }}>
                {c.length > 44 ? `${c.slice(0, 42).trimEnd()}…` : c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: MUTED, flexShrink: 0, marginLeft: 24 }}>{SITE.origin.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
