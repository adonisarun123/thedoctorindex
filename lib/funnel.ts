/**
 * Doctor-funnel and contact events for GA4 — the step-by-step view of where
 * doctors drop out between "Claim your profile" and a submitted claim or
 * profile, and which patient contact actions get used.
 *
 * Same rules as lib/conversions.ts (which owns the two primary conversions,
 * doctor_claim_submitted and doctor_profile_submitted):
 *   - client-only, and a no-op until the visitor has accepted analytics,
 *     because gtag is not defined before then (components/ConsentGate.tsx).
 *     GA therefore sees consenting visitors only; the server-side funnel
 *     (`npm run report:growth`) is the complete count.
 *   - nothing that identifies a doctor or a patient: no slug, name,
 *     registration number, search term or free text. Parameters are short
 *     enumerated codes, each registered as a custom dimension in the GA4
 *     property (Admin → Custom definitions). A new parameter name here needs a
 *     new custom dimension there, or it is invisible in reports.
 */

export type FunnelEvent =
  | "claim_cta_click" // any link to /claim-profile          {cta_location, page_type, src?}
  | "add_profile_cta_click" // any link to /add-doctor        {cta_location, page_type, src?}
  | "claim_page_view" // /claim-profile rendered              {step: sign_in|form, has_profile}
  | "add_profile_page_view" // /add-doctor rendered           {step: sign_in|registration|match_found|details}
  | "linkedin_click" // "Continue with LinkedIn"                {flow}
  | "otp_requested" // code sent                               {flow}
  | "otp_submitted" // code entered and sent for checking      {flow}
  | "otp_error" // request or verify rejected                  {flow, stage}
  | "account_setup_view" // first-run details form             {flow}
  | "funnel_form_start" // first interaction with a funnel form {form_name, flow?}
  | "form_abandon" // left the page with a started, unsent form {form_name, last_field, fields_touched, flow?}
  | "claim_method_select" //                                   {method}
  | "claim_submit_attempt" //                                  {method}
  | "claim_error" //                                           {error_code, method}
  | "register_check" // add-profile step 1                     {match: found|none}
  | "register_search" // /claim-profile/find, one search       {match: found|none}
  | "register_result_click" // a result's action button       {cta_location: claim-published|claim-draft|create|claimed|…}
  | "add_profile_submit_attempt"
  | "add_profile_error" //                                     {error_code}
  | "contact_click"; // patient contact action                 {contact_type, signed_in}

export type FunnelParams = Record<string, string | number | boolean | null | undefined>;

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function trackEvent(name: FunnelEvent, params: FunnelParams = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== "function") return;
  const clean: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined || v === "") continue;
    clean[k] = typeof v === "boolean" ? (v ? "yes" : "no") : typeof v === "number" ? v : v.slice(0, 40);
  }
  gtag("event", name, clean);
}

/** Which journey a sign-in / account step serves, from its `next` path. */
export function flowFromNext(next: string | null | undefined): string {
  const n = decodeURIComponent(next ?? "");
  if (n.includes("/claim-profile")) return "claim";
  if (n.includes("/add-doctor")) return "add_doctor";
  if (n.includes("/enquire")) return "enquire";
  if (n.includes("/review")) return "review";
  if (n.startsWith("/dashboard")) return "dashboard";
  if (n.startsWith("/admin")) return "admin";
  return "other";
}

/** First path segment: "home", "doctor", "doctors", "for-doctors", … Never a slug. */
export function pageType(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? "home";
}
