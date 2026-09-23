import { ImageResponse } from "next/og";

import { MARK_TD_PATH, MARK_VIEWBOX } from "@/components/Logo";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { SITE } from "@/lib/site";
import { QR_NAVY, QR_TEAL, QR_TEAL_DARK, qrSvg } from "@/lib/tdi/qr";
import type { DoctorView } from "@/lib/types";
import { registrationLabel } from "@/lib/verification";
import { displayName } from "@/lib/display-name";

/**
 * The shareable TDI card: branded QR, name, TDI ID, speciality and city.
 *
 * It carries only what the public profile shows, and its one trust line is the
 * profile's own registration label (lib/verification) — never a bare
 * "Verified". The site deliberately has no single verified tick
 * (components/TrustBadges.tsx); a card a doctor hands out must not imply more
 * than the page it links to.
 */

export const CARD_W = 1080;
export const CARD_H = 1350;

export interface CardData {
  tdiId: string;
  name: string;
  line: string;
  trust: string;
  shortUrl: string;
  host: string;
}

export function cardData(d: DoctorView, tdiId: string): CardData {
  const sp = SPECIALTIES[d.specialty];
  const city = d.practices[0]?.city;
  const host = SITE.origin.replace(/^https?:\/\//, "");
  return {
    tdiId,
    name: displayName(d),
    line: [sp?.one ?? sp?.name, city].filter(Boolean).join(" · "),
    trust: registrationLabel(d),
    shortUrl: `${SITE.origin}/d/${tdiId}`,
    host,
  };
}

/** Name size steps down with length so it stays on one line at 920px. */
function nameSize(name: string): number {
  const n = name.length;
  return n <= 18 ? 72 : n <= 24 ? 60 : n <= 30 ? 50 : 42;
}

function clip(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const QR_PX = 720;
const QR_TOP = 210;

function markSvg(x: number, y: number, h: number): string {
  const [vx, vy, , vh] = MARK_VIEWBOX.split(" ").map(Number);
  const s = h / vh;
  return (
    `<g transform="translate(${x} ${y}) scale(${s}) translate(${-vx} ${-vy})">` +
    `<path fill="${QR_NAVY}" d="${MARK_TD_PATH}"/><circle cx="976" cy="428" r="64" fill="${QR_TEAL}"/>` +
    `<rect x="931" y="511" width="99" height="301" rx="24" fill="${QR_TEAL}"/></g>`
  );
}

/** Vector card for print. Text uses the viewer's IBM Plex Sans if present, else a system sans. */
export function cardSvg(c: CardData): string {
  const name = clip(c.name.toUpperCase(), 36);
  const fs = nameSize(name);
  const qr = qrSvg(c.shortUrl, { size: QR_PX, idPrefix: "card" }).replace("<svg ", `<svg x="${(CARD_W - QR_PX) / 2}" y="${QR_TOP}" `);
  const font = `font-family="IBM Plex Sans, Helvetica Neue, Arial, sans-serif"`;
  const idW = c.tdiId.length * 22 + 64;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" width="${CARD_W}" height="${CARD_H}">` +
    `<defs><linearGradient id="nm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${QR_NAVY}"/><stop offset="1" stop-color="${QR_TEAL_DARK}"/></linearGradient></defs>` +
    `<rect width="${CARD_W}" height="${CARD_H}" rx="48" fill="#fff"/>` +
    markSvg(378, 64, 40) +
    `<text x="464" y="96" ${font} font-size="28" font-weight="600" fill="${QR_NAVY}" letter-spacing="1">${esc(SITE.name)}</text>` +
    qr +
    `<text x="${CARD_W / 2}" y="${QR_TOP + QR_PX + 96}" text-anchor="middle" ${font} font-size="${fs}" font-weight="700" fill="url(#nm)" letter-spacing="2">${esc(name)}</text>` +
    `<text x="${CARD_W / 2}" y="${QR_TOP + QR_PX + 150}" text-anchor="middle" ${font} font-size="32" fill="#56657a">${esc(clip(c.line, 56))}</text>` +
    `<rect x="${(CARD_W - idW) / 2}" y="${QR_TOP + QR_PX + 180}" width="${idW}" height="64" rx="32" fill="#e4ecf6"/>` +
    `<text x="${CARD_W / 2}" y="${QR_TOP + QR_PX + 224}" text-anchor="middle" font-family="IBM Plex Mono, Menlo, Consolas, monospace" font-size="34" font-weight="600" fill="${QR_NAVY}" letter-spacing="2">${esc(c.tdiId)}</text>` +
    `<text x="${CARD_W / 2}" y="${CARD_H - 50}" text-anchor="middle" ${font} font-size="24" fill="#56657a">${esc(c.trust)} · ${esc(c.host)}/d/${esc(c.tdiId)}</text>` +
    `</svg>`
  );
}

/** Raster card (PNG) via next/og, the renderer the social cards already use. */
export function cardPng(c: CardData): ImageResponse {
  const name = clip(c.name.toUpperCase(), 36);
  const fs = nameSize(name);
  const qr = `data:image/svg+xml;base64,${Buffer.from(qrSvg(c.shortUrl, { size: QR_PX })).toString("base64")}`;
  const [, , vw, vh] = MARK_VIEWBOX.split(" ").map(Number);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 60 }}>
          <svg viewBox={MARK_VIEWBOX} width={Math.round((40 * vw) / vh)} height={40}>
            <path fill={QR_NAVY} d={MARK_TD_PATH} />
            <circle cx="976" cy="428" r="64" fill={QR_TEAL} />
            <rect x="931" y="511" width="99" height="301" rx="24" fill={QR_TEAL} />
          </svg>
          <div style={{ fontSize: 28, fontWeight: 600, color: QR_NAVY, letterSpacing: 1 }}>{SITE.name}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={qr} width={QR_PX} height={QR_PX} style={{ marginTop: 110 }} />
        <div style={{ display: "flex", marginTop: 34, fontSize: fs, fontWeight: 700, letterSpacing: 2, backgroundImage: `linear-gradient(90deg, ${QR_NAVY}, ${QR_TEAL_DARK})`, backgroundClip: "text", color: "transparent" }}>{name}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 32, color: "#56657a" }}>{clip(c.line, 56)}</div>
        <div style={{ display: "flex", marginTop: 26, padding: "10px 32px", borderRadius: 999, background: "#e4ecf6", color: QR_NAVY, fontSize: 34, fontWeight: 600, letterSpacing: 2 }}>{c.tdiId}</div>
        <div style={{ display: "flex", position: "absolute", bottom: 40, fontSize: 24, color: "#56657a" }}>{`${c.trust} · ${c.host}/d/${c.tdiId}`}</div>
      </div>
    ),
    { width: CARD_W, height: CARD_H },
  );
}
