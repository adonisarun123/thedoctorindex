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
const ADS_LABELS: Partial<Record<ConversionName, string>> = {
  doctor_claim_submitted: process.env.NEXT_PUBLIC_GADS_CLAIM_LABEL ?? "",
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
    gtag("event", "conversion", { send_to: `${ADS_ID}/${label}` });
  }
}
