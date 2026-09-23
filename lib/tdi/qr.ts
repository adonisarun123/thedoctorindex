import QRCode from "qrcode";

import { MARK_TD_PATH, MARK_VIEWBOX } from "@/components/Logo";

/**
 * Branded QR for TDI cards: soft square dots, rounded finder rings with a round
 * centre, and the TDi mark knocked out of the middle — the same grammar as the
 * Instagram name tag, drawn in our navy and teal. Error correction is H (30%),
 * so the centre knockout (about 5% of the modules) never costs a scan.
 *
 * Pure: returns SVG markup, no I/O. The dots run navy to a darkened teal; the
 * logo teal (#06a69e) alone is ~3:1 on white, too faint for cheap scanners.
 */

export const QR_NAVY = "#063268";
export const QR_TEAL_DARK = "#04766f";
export const QR_TEAL = "#06a69e";

const QUIET = 4; // modules of white margin, per the QR spec

export interface QrSvgOptions {
  /** Intrinsic width/height in px; the SVG scales freely. */
  size?: number;
  /** Draw the TDi mark in the centre. Default true. */
  logo?: boolean;
  /** Unique prefix for gradient ids when several QRs share a document. */
  idPrefix?: string;
}

export function qrMatrix(text: string): { n: number; dark: (r: number, c: number) => boolean } {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const data = qr.modules.data;
  return { n, dark: (r, c) => Boolean(data[r * n + c]) };
}

function inFinder(r: number, c: number, n: number): boolean {
  return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
}

/** Returns an `<svg>` string (no XML prolog), or the inner markup when `inner` is set. */
export function qrSvg(text: string, opts: QrSvgOptions = {}): string {
  const { n, dark } = qrMatrix(text);
  const logo = opts.logo ?? true;
  const id = opts.idPrefix ?? "tdiqr";
  const total = n + QUIET * 2;
  const size = opts.size ?? 1024;

  // Centre knockout: an odd number of modules, about 22% of the symbol width.
  let hole = Math.round(n * 0.22);
  if (hole % 2 === 0) hole += 1;
  const h0 = (n - hole) / 2; // integer, since n and hole are both odd
  const inHole = (r: number, c: number) => logo && r >= h0 && r < h0 + hole && c >= h0 && c < h0 + hole;

  const dots: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!dark(r, c) || inFinder(r, c, n) || inHole(r, c)) continue;
      // Soft squares, not circles: round dots leave gaps that jsQR (the
      // decoder most in-browser scanners use) misreads at many sizes. rx 0.36
      // on a 0.94 square decoded at every width from 200 to 1200px; 0.44 failed
      // at over half of them. ZXing reads either.
      dots.push(`<rect x="${c + QUIET + 0.03}" y="${r + QUIET + 0.03}" width="0.94" height="0.94" rx="0.36"/>`);
    }
  }

  const finder = (r: number, c: number) => {
    const x = c + QUIET;
    const y = r + QUIET;
    return (
      `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.8" fill="none" stroke="url(#${id}-g)" stroke-width="1"/>` +
      `<circle cx="${x + 3.5}" cy="${y + 3.5}" r="1.55" fill="url(#${id}-g)"/>`
    );
  };

  let centre = "";
  if (logo) {
    const [vx, vy, vw, vh] = MARK_VIEWBOX.split(" ").map(Number);
    const box = hole;
    const bx = QUIET + h0;
    const pad = box * 0.16;
    const w = box - pad * 2;
    const hgt = (w * vh) / vw;
    const scale = w / vw;
    centre =
      `<rect x="${bx}" y="${bx}" width="${box}" height="${box}" rx="${box * 0.24}" fill="#fff"/>` +
      `<g transform="translate(${bx + pad} ${bx + (box - hgt) / 2}) scale(${scale}) translate(${-vx} ${-vy})">` +
      `<path fill="${QR_NAVY}" d="${MARK_TD_PATH}"/>` +
      `<circle cx="976" cy="428" r="64" fill="${QR_TEAL}"/>` +
      `<rect x="931" y="511" width="99" height="301" rx="24" fill="${QR_TEAL}"/>` +
      `</g>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}">` +
    `<defs><linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${total}" y2="${total}">` +
    `<stop offset="0" stop-color="${QR_NAVY}"/><stop offset="1" stop-color="${QR_TEAL_DARK}"/>` +
    `</linearGradient></defs>` +
    `<rect width="${total}" height="${total}" fill="#fff"/>` +
    `<g fill="url(#${id}-g)">${dots.join("")}</g>` +
    finder(0, 0) + finder(0, n - 7) + finder(n - 7, 0) +
    centre +
    `</svg>`
  );
}
