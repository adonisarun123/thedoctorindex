import { randomInt } from "node:crypto";

/**
 * Booking references: "TDI-BK-7K3M9Q". Six characters from a 31-character
 * alphabet with no 0/O or 1/I/L, so they survive being read out over the
 * phone. ~890 million combinations; uniqueness is enforced by a unique index
 * and the insert retries on the rare clash.
 */
export const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const REF_PREFIX = "TDI-BK-";

export function newBookingRef(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += REF_ALPHABET[randomInt(0, REF_ALPHABET.length)];
  return REF_PREFIX + out;
}

/** Accepts what people type ("tdi bk 7k3m9q", "7K3M9Q") and returns the canonical form, or null. */
export function normaliseBookingRef(raw: string): string | null {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^TDIBK/, "");
  if (s.length !== 6 || [...s].some((c) => !REF_ALPHABET.includes(c))) return null;
  return REF_PREFIX + s;
}
