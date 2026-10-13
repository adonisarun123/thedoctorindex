/**
 * Doctor-acquisition conversions, sent to GA4 and (when configured) Google Ads.
 *
 * Client-only in effect: every call is a no-op on the server, and a no-op in the
 * browser until the visitor has accepted the consent banner, because gtag is
 * not defined before then (components/ConsentGate.tsx). The server-side claim
 * funnel (events.query = "src:<tag>", `npm run report:growth`) counts every
 * claim regardless of consent; these events are what Google Ads bids against.
 *
 * GA4 event names are the contract with the GA4 property: mark
 * doctor_claim_submitted and doctor_profile_submitted as key events there and
 * import them into Google Ads, OR set the NEXT_PUBLIC_GADS_* variables below to
 * fire Google Ads conversion actions directly. Doing both double-counts in Ads —
 * pick one per conversion.
 *
 * Nothing that identifies a doctor or a patient is sent: no slug, no name, no
 * registration number. The channel tag (`src`) and, on a claim, the chosen
 * verification method are the only parameters.
 *
 * NEXT_PUBLIC_* values are read as literal property accesses so Next inlines
 * them into the client bundle; lib/env.ts's dynamic lookup would not be.
 */

export type ConversionName =
  | "doctor_lp_search" // searched their own name on the landing page
  | "doctor_lp_claim_click" // chose a profile to claim
  | "doctor_lp_create_click" // chose to create a new profile
  | "doctor_claim_submitted" // claim form accepted (primary conversion)
  | "doctor_profile_submitted"; // new profile submitted for verification (primary conversion)

const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? "AW-18482115489";
// Google Ads conversion action "Doctor profile claimed" (created 13 Oct 2026),
// value 1.0 INR per Google's event snippet. Fired on claim-form success rather
// than on a page load, because the claim has no dedicated thank-you page.
const ADS_LABELS: Partial<Record<ConversionName, string>> = {
  doctor_claim_submitted: process.env.NEXT_PUBLIC_GADS_CLAIM_LABEL ?? "54-uCNvmyoodEKHn-uxE",
  doctor_profile_submitted: process.env.NEXT_PUBLIC_GADS_PROFILE_LABEL ?? "",
  doctor_lp_claim_click: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL ?? "",
  doctor_lp_create_click: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL ?? "",
};

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function sendConversion(name: ConversionName, params: { src?: string | null; method?: string | null } = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== "function") return;
  const p: Record<string, string> = {};
  if (params.src) p.src = params.src;
  if (params.method) p.method = params.method;
  gtag("event", name, p);
  const label = ADS_LABELS[name];
  if (/^AW-\d+$/.test(ADS_ID) && label) {
    gtag("event", "conversion", { send_to: `${ADS_ID}/${label}`, value: 1.0, currency: "INR" });
  }
}

/**
 * Thank-you-page hand-off. The form stashes the conversion in sessionStorage
 * and navigates to its /thank-you page, which fires it exactly once: the stash
 * is removed on read, so a refresh, a back-button visit or a direct hit to the
 * thank-you URL records nothing. `display` is for the page copy only and is
 * never sent to gtag.
 */
const STASH_KEY = "tdi:conversion";

export interface StashedConversion {
  name: ConversionName;
  params?: { src?: string | null; method?: string | null };
  display?: Record<string, string>;
  t: number;
}

export function stashConversion(c: Omit<StashedConversion, "t">): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STASH_KEY, JSON.stringify({ ...c, t: Date.now() }));
  } catch {
    // Storage blocked (private mode, disabled): the thank-you page then shows its generic copy.
  }
}

/** Reads and clears the stash; fires the conversion if it is less than 10 minutes old. */
export function takeStashedConversion(): StashedConversion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STASH_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STASH_KEY);
    const c = JSON.parse(raw) as StashedConversion;
    if (!c?.name || typeof c.t !== "number" || Date.now() - c.t > 10 * 60 * 1000) return null;
    sendConversion(c.name, c.params ?? {});
    return c;
  } catch {
    return null;
  }
}
