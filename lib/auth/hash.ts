import { createHash, randomInt, timingSafeEqual } from "node:crypto";

/** SHA-256 hex with an optional pepper. Used for OTP codes and contact hashes. */
export function sha256(input: string, pepper = ""): string {
  return createHash("sha256").update(`${pepper}:${input}`).digest("hex");
}

/** Hash an IP for logs and rate limits — never store a raw address. */
export function ipHash(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return sha256(ip, process.env.CONTACT_HASH_PEPPER ?? "tdi").slice(0, 32);
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Numeric OTP of the configured length, from a CSPRNG. */
export function generateOtp(length = Number(process.env.OTP_LENGTH ?? 6)): string {
  let out = "";
  for (let i = 0; i < length; i++) out += String(randomInt(0, 10));
  return out;
}

/** Normalise an email or Indian mobile number into one canonical identifier. */
export function normalizeIdentifier(raw: string): { kind: "email" | "phone"; value: string } | null {
  const v = raw.trim();
  if (!v) return null;
  if (v.includes("@")) {
    const email = v.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
    return { kind: "email", value: email };
  }
  const digits = v.replace(/[^\d+]/g, "");
  const m = /^(?:\+?91)?([6-9]\d{9})$/.exec(digits);
  if (!m) return null;
  return { kind: "phone", value: `+91${m[1]}` };
}
