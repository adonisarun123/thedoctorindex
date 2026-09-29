/**
 * Grow Your Tribe — the pure rules. No database, no request context, so the
 * level maths, the share links and the cash cap can be unit-tested and reused
 * by the dashboard, the admin queue and the notification copy.
 *
 * The programme in one paragraph: a doctor with a claimed profile gets a
 * permanent referral code. Colleagues who claim or create their own profile
 * through that code, and whose registration is then checked against the
 * register, count as verified referrals. Every LEVEL_SIZE verified referrals
 * is a level, up to MAX_LEVEL; each level crossed earns a gift voucher until
 * the per-financial-year cash cap, after which levels earn recognition only.
 */

import { env } from "@/lib/env";

export const TRIBE = {
  levelSize: Math.max(1, env.tribe.levelSize),
  maxLevel: Math.max(1, env.tribe.maxLevel),
  rewardInr: Math.max(0, env.tribe.rewardInr),
  cashCapInrPerFy: Math.max(0, env.tribe.cashCapInrPerFy),
  holdDays: Math.max(0, env.tribe.holdDays),
  cookieDays: Math.max(1, env.tribe.cookieDays),
  cookieName: env.tribe.cookieName,
  enabled: env.tribe.enabled,
} as const;

/** Referral codes: DR + six unambiguous characters (no 0/O/1/I). */
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_RE = /^DR[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

/** Accepts a code from a URL or a cookie; anything off-pattern is dropped, never stored. */
export function parseReferralCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toUpperCase();
  return CODE_RE.test(v) ? v : null;
}

/** Level reached for a count of verified referrals; capped. */
export function levelFor(verified: number, size = TRIBE.levelSize, max = TRIBE.maxLevel): number {
  if (!Number.isFinite(verified) || verified <= 0) return 0;
  return Math.min(max, Math.floor(verified / size));
}

export interface LevelProgress {
  level: number;
  verified: number;
  /** Verified referrals needed for the next level; equals the cap when maxed. */
  nextAt: number;
  /** How many more to the next level; 0 when maxed. */
  remaining: number;
  /** 0–100 towards the next level. */
  pct: number;
  maxed: boolean;
}

export function progressFor(verified: number, size = TRIBE.levelSize, max = TRIBE.maxLevel): LevelProgress {
  const level = levelFor(verified, size, max);
  const maxed = level >= max;
  const nextAt = maxed ? max * size : (level + 1) * size;
  const remaining = maxed ? 0 : Math.max(0, nextAt - verified);
  const into = maxed ? size : verified - level * size;
  const pct = maxed ? 100 : Math.round((Math.max(0, into) / size) * 100);
  return { level, verified: Math.max(0, verified), nextAt, remaining, pct, maxed };
}

/**
 * Indian financial year label for a date — "2026-27" for anything from
 * 1 Apr 2026 to 31 Mar 2027 — and its bounds. Used to apply the cash cap.
 */
export function financialYear(d = new Date()): { label: string; start: Date; end: Date } {
  const y = d.getUTCMonth() >= 3 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;
  const start = new Date(Date.UTC(y, 3, 1));
  const end = new Date(Date.UTC(y + 1, 3, 1));
  return { label: `${y}-${String(y + 1).slice(-2)}`, start, end };
}

/**
 * What a newly crossed level earns, given the cash already committed this
 * financial year (issued or pending, not cancelled). A cap of 0 means no cap.
 */
export function rewardFor(committedThisFyInr: number, rewardInr = TRIBE.rewardInr, capInr = TRIBE.cashCapInrPerFy): { kind: "voucher" | "recognition"; amountInr: number } {
  if (rewardInr <= 0) return { kind: "recognition", amountInr: 0 };
  if (capInr > 0 && committedThisFyInr + rewardInr > capInr) return { kind: "recognition", amountInr: 0 };
  return { kind: "voucher", amountInr: rewardInr };
}

/** Level names for the badge. Every ten levels a new tier. */
export function tierName(level: number): string {
  if (level <= 0) return "Member";
  if (level < 5) return "Connector";
  if (level < 10) return "Tribe builder";
  if (level < 20) return "Tribe leader";
  if (level < 35) return "Tribe elder";
  return "Tribe founder";
}

/* ------------------------------------------------------------------------- */
/* Links and share copy                                                      */
/* ------------------------------------------------------------------------- */

/** The referral landing path. `profile` names a colleague's own unclaimed profile. */
export function joinPath(code: string, profileSlug?: string | null): string {
  return `/join?ref=${encodeURIComponent(code)}${profileSlug ? `&p=${encodeURIComponent(profileSlug)}` : ""}`;
}

export function joinUrl(origin: string, code: string, profileSlug?: string | null): string {
  return `${origin.replace(/\/$/, "")}${joinPath(code, profileSlug)}`;
}

/**
 * The message a doctor sends. Plain, first person, no superlatives, no
 * mention of the reward — the reward is the doctor's business, and an invite
 * that leads with money reads as spam to the colleague receiving it.
 */
export function inviteMessage(opts: { inviterName: string; url: string; colleagueName?: string | null; siteName?: string }): string {
  const site = opts.siteName ?? "The Doctor Index";
  const who = opts.colleagueName ? `Dr ${opts.colleagueName}, ` : "";
  const what = opts.colleagueName
    ? `there is already a profile in your name on ${site} — the directory that checks doctors against the medical registers. I have claimed mine; claim yours so patients see the right practice details:`
    : `I have claimed my profile on ${site}, the directory that checks doctors against the medical registers. It is free and takes a minute — join me here:`;
  return `${who}${what}\n${opts.url}\n— ${opts.inviterName}`;
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function linkedinShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function mailtoShareUrl(subject: string, text: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

/** Channel tag stored on the referral; only these values are kept. */
export const TRIBE_CHANNELS = ["whatsapp", "linkedin", "email", "link", "qr", "other"] as const;
export type TribeChannel = (typeof TRIBE_CHANNELS)[number];
export function tribeChannel(raw: unknown): TribeChannel {
  const v = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return (TRIBE_CHANNELS as readonly string[]).includes(v) ? (v as TribeChannel) : "link";
}
