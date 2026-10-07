import "server-only";

import { eq } from "drizzle-orm";
import { ImageResponse } from "next/og";

import { MARK_TD_PATH, MARK_VIEWBOX } from "@/components/Logo";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { NEWS_CATEGORIES, isCategory, istDate, initials } from "@/lib/news/format";
import type { StoryDoctor, StoryRow } from "@/lib/services/news";
import { storyNumbers } from "@/lib/services/news";
import { SITE } from "@/lib/site";

/**
 * News cards: the story's Open Graph image, the three NewsArticle image
 * ratios, and a five-slide Instagram carousel. The look is deliberately
 * unlike the directory's light cards — navy ground, teal rule, a "TDi
 * Newsdesk" masthead — so a story is recognisable as news in a feed.
 *
 * The doctor's photo appears only when their profile is published with photo
 * consent (the same rule as /photos/<id>); otherwise initials.
 */

export const CARD_SIZES = {
  og: { width: 1200, height: 630 },
  wide: { width: 1200, height: 675 },
  standard: { width: 1200, height: 900 },
  square: { width: 1200, height: 1200 },
  portrait: { width: 1080, height: 1350 },
} as const;
export type CardSize = keyof typeof CARD_SIZES;

export const CAROUSEL_SLIDES = 5;

const NAVY = "#063268";
const NAVY_2 = "#0a3f80";
const TEAL = "#06a69e";
const TEAL_LIGHT = "#7fe0d8";
const WHITE = "#ffffff";
const SOFT = "#c9d8ea";

/** The primary doctor's photo as a PNG data URI (satori cannot draw webp), or null. */
export async function doctorPhotoDataUri(d: StoryDoctor | null | undefined): Promise<string | null> {
  if (!d?.photoUrl) return null;
  const id = d.photoUrl.split("/").pop()!;
  try {
    const [f] = await getDb().select({ data: s.files.data }).from(s.files).where(eq(s.files.id, id)).limit(1);
    if (!f?.data) return null;
    const sharp = (await import("sharp")).default;
    const png = await sharp(f.data).resize(320, 320, { fit: "cover", position: "attention" }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function Mark({ size = 1 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * size }}>
      <svg viewBox={MARK_VIEWBOX} width={70 * size} height={38 * size}>
        <path fill={WHITE} d={MARK_TD_PATH} />
        <circle cx="976" cy="428" r="64" fill={TEAL} />
        <rect x="931" y="511" width="99" height="301" rx="24" fill={TEAL} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 26 * size, fontWeight: 700, color: WHITE, letterSpacing: 1 }}>TDi Newsdesk</div>
        <div style={{ fontSize: 16 * size, color: SOFT }}>{SITE.name}</div>
      </div>
    </div>
  );
}

function Avatar({ photo, name, px }: { photo: string | null; name: string; px: number }) {
  return (
    <div style={{ width: px, height: px, borderRadius: px, border: `6px solid ${TEAL}`, background: NAVY_2, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {photo ? <img src={photo} width={px} height={px} style={{ objectFit: "cover" }} alt="" /> : <div style={{ fontSize: px * 0.38, fontWeight: 700, color: WHITE }}>{initials(name)}</div>}
    </div>
  );
}

function Frame({ size, children, footer }: { size: { width: number; height: number }; children: React.ReactNode; footer: string }) {
  const pad = Math.round(size.width * 0.055);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: `linear-gradient(160deg, ${NAVY} 0%, #041f42 100%)`, padding: pad, fontFamily: "sans-serif", position: "relative", color: WHITE }}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 12, background: TEAL }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mark size={size.width >= 1080 ? 1.1 : 1} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", minHeight: 0 }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid rgba(255,255,255,0.18)`, paddingTop: 20, fontSize: 22, color: SOFT }}>
        <div>{footer}</div>
        <div>{SITE.origin.replace(/^https?:\/\//, "")}/news</div>
      </div>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: TEAL_LIGHT, textTransform: "uppercase", letterSpacing: 2 }}>
      <div style={{ width: 14, height: 14, background: TEAL, borderRadius: 3 }} />
      {text}
    </div>
  );
}

const clip = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);

/** Cover: category, headline, the doctor. Used for every non-carousel size. */
export function coverCard(st: StoryRow, photo: string | null, sizeKey: CardSize): ImageResponse {
  const size = CARD_SIZES[sizeKey];
  const tall = size.height >= size.width * 0.9;
  const headline = clip(st.headline, tall ? 120 : 100);
  const hs = tall ? (headline.length > 80 ? 64 : 74) : headline.length > 80 ? 48 : headline.length > 55 ? 56 : 64;
  const cat = isCategory(st.category) ? NEWS_CATEGORIES[st.category].label : "News";
  const date = st.publishedAt ? istDate(st.publishedAt) : "";
  return new ImageResponse(
    (
      <Frame size={size} footer={date}>
        <div style={{ display: "flex", flexDirection: tall ? "column" : "row", alignItems: tall ? "flex-start" : "center", gap: tall ? 36 : 44 }}>
          <Avatar photo={photo} name={st.subjectName} px={tall ? 220 : 190} />
          <div style={{ display: "flex", flexDirection: "column", gap: 18, width: tall ? size.width - 140 : size.width - 360 }}>
            <Tag text={st.place ? `${cat} · ${st.place}` : cat} />
            <div style={{ fontSize: hs, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>{headline}</div>
            <div style={{ fontSize: 28, color: SOFT }}>{clip(st.subjectRole ? `${st.subjectName} · ${st.subjectRole}` : st.subjectName, 90)}</div>
          </div>
        </div>
      </Frame>
    ),
    size,
  );
}

/** Instagram carousel slide n (1-based), 1080×1350. */
export function carouselSlide(st: StoryRow, photo: string | null, n: number): ImageResponse {
  const size = CARD_SIZES.portrait;
  if (n <= 1) return coverCard(st, photo, "portrait");
  const numbers = storyNumbers(st);
  const footer = `${n} / ${CAROUSEL_SLIDES}`;
  let body: React.ReactNode;
  if (n === 2) {
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Tag text="Key highlights" />
        {st.highlights.slice(0, 3).map((h, i) => (
          <div key={h} style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: TEAL_LIGHT, lineHeight: 1, width: 60 }}>{i + 1}</div>
            <div style={{ fontSize: 40, lineHeight: 1.3, flex: 1 }}>{clip(h, 150)}</div>
          </div>
        ))}
      </div>
    );
  } else if (n === 3) {
    body = numbers.length ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <Tag text="By the numbers" />
        {numbers.slice(0, 3).map((x) => (
          <div key={x.label} style={{ display: "flex", flexDirection: "column", borderLeft: `8px solid ${TEAL}`, paddingLeft: 28 }}>
            <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>{clip(x.value, 14)}</div>
            <div style={{ fontSize: 34, color: SOFT, marginTop: 8 }}>{clip(x.label, 70)}</div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Tag text="The story" />
        <div style={{ fontSize: 46, lineHeight: 1.3 }}>{clip(st.dek, 200)}</div>
      </div>
    );
  } else if (n === 4) {
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Tag text="Why it matters for patients" />
        <div style={{ fontSize: 44, lineHeight: 1.35 }}>{clip(st.whyItMatters, 260)}</div>
      </div>
    );
  } else {
    body = (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, textAlign: "center" }}>
        <Avatar photo={photo} name={st.subjectName} px={240} />
        <div style={{ fontSize: 50, fontWeight: 700 }}>{clip(st.subjectName, 40)}</div>
        <div style={{ fontSize: 34, color: SOFT, maxWidth: 860 }}>See the verified profile and read the full story</div>
        <div style={{ display: "flex", padding: "18px 34px", borderRadius: 999, background: TEAL, color: NAVY, fontSize: 34, fontWeight: 700 }}>Link in bio · thedoctorindex.com/news</div>
      </div>
    );
  }
  return new ImageResponse(<Frame size={size} footer={footer}>{body}</Frame>, size);
}
