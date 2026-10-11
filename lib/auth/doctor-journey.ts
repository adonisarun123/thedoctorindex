import { flowFromNext } from "@/lib/funnel";

/**
 * Doctor journeys — the rules shared by every sign-in route (one-time code,
 * LinkedIn, Google) and by account setup. Pure: no database, no network.
 *
 * Two decisions live here:
 *   1. Is this sign-in for a doctor? Then account setup asks only for what a
 *      verification officer needs (name, mobile, terms), not a home locality.
 *   2. Where does a doctor land once signed in? A bare claim or create journey
 *      goes straight to the register search with their name typed in, so the
 *      first screen after sign-in is "Is this you?" rather than an empty form.
 */

const DOCTOR_FLOWS = new Set(["claim", "add_doctor", "dashboard"]);

/** True when `next` is a claim, create-profile or dashboard destination. */
export function isDoctorNext(next: string | null | undefined): boolean {
  return DOCTOR_FLOWS.has(flowFromNext(next));
}

/**
 * The account type a sign-in implies before the person has said anything:
 * "doctor" on a doctor destination or when the sign-in page's doctor tab
 * was chosen (`as=doctor`), otherwise "patient". Account setup shows this as
 * the pre-selected answer and the person confirms or changes it.
 */
export function impliedAccountType(next: string | null | undefined, as?: string | null): "patient" | "doctor" {
  return as === "doctor" || isDoctorNext(next) ? "doctor" : "patient";
}

/** "Dr", "Dr.", "Doctor" in front of a name — the usual sign a patient account is really a doctor's. */
export function looksLikeDoctorName(name: string): boolean {
  return /^\s*(dr|doctor)\b\.?\s+/i.test(name);
}

/** Where a doctor-type account with no verified profile yet should go: the register search, name filled in. */
export function unverifiedDoctorHome(name: string | null): string {
  return doctorDestination("/claim-profile", name);
}

/** "Dr. Asha K Rao" → ["Asha", "K", "Rao"]. */
function nameWords(name: string | null): string[] {
  return (name ?? "").replace(/^\s*dr\.?\s+/i, "").trim().split(/\s+/).filter(Boolean);
}

/**
 * Where a doctor goes after signing in. A bare doctor journey (claim or create
 * with nothing chosen yet) goes to the register search with the name filled in.
 * A journey that already names a profile or a registration keeps its destination,
 * and so does `manual=1` — the full form, for registers the search does not
 * cover (dental, AYUSH, physiotherapy) and for doctors the register misses.
 */
export function doctorDestination(next: string, name: string | null): string {
  const path = next.split("?")[0];
  const query = new URLSearchParams(next.includes("?") ? next.slice(next.indexOf("?") + 1) : "");
  const bareDoctorJourney =
    (path === "/claim-profile" || path === "/add-doctor") && !query.get("profile") && !query.get("registration") && !query.get("manual");
  if (bareDoctorJourney || (path === "/claim-profile/find" && !query.get("q"))) {
    const words = nameWords(name);
    return words.length >= 2 ? `/claim-profile/find?q=${encodeURIComponent(words.join(" "))}` : "/claim-profile/find";
  }
  return next;
}
