"use client";

import { SESSION_HINT_COOKIE } from "@/lib/session-hint";

export type Me = { signedIn: false } | { signedIn: true; role: "patient" | "doctor" | "staff"; staff: boolean; home: string };

const SIGNED_OUT: Me = { signedIn: false };

/** True when middleware has flagged a session cookie on this browser. */
export function hasSessionHint(): boolean {
  try {
    return document.cookie.split(";").some((c) => c.trim() === `${SESSION_HINT_COOKIE}=1`);
  } catch {
    // No cookie access: fall back to asking, which is always correct.
    return true;
  }
}

let probe: Promise<Me> | null = null;
let probedWithHint: boolean | null = null;

/**
 * One /api/me request per page load, shared by the header (rendered twice,
 * desktop and mobile) and the gated contact buttons. A visitor with no
 * session hint is answered "signed out" without any request: that is every
 * anonymous visitor and every crawler that runs JavaScript.
 */
export function getMe(): Promise<Me> {
  const hint = hasSessionHint();
  if (!hint) return Promise.resolve(SIGNED_OUT);
  if (!probe || probedWithHint !== hint) {
    probedWithHint = hint;
    probe = fetch("/api/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Me>) : SIGNED_OUT))
      .catch(() => SIGNED_OUT);
  }
  return probe;
}

/** Forget the shared answer, e.g. after signing in or out without a full page load. */
export function resetMe(): void {
  probe = null;
  probedWithHint = null;
}
