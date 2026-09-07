import { SPECIALTIES } from "@/lib/data/taxonomy";
import { hasDate, registrationState } from "@/lib/verification";
import type { DoctorView } from "@/lib/types";

/**
 * Profile page content assembled from verified facts only.
 *
 * Nothing here is invented: every sentence is a template over fields the
 * record actually has, and a missing fact produces an honest "not stated"
 * rather than filler. The same builders feed the visible page and the
 * FAQPage structured data, so the markup can never say more than the page.
 */

export interface Faq {
  q: string;
  a: string;
}

const clean = (s: string | null | undefined) => (s ?? "").trim();
const isStated = (s: string | null | undefined) => {
  const v = clean(s);
  return Boolean(v) && v !== "—" && !/not stated|not known|unknown|^n\/?a$/i.test(v);
};

/** The facility name without a trailing ", City" that some source records carry. */
export function facilityLabel(p: { facility: string; city: string }): string {
  return p.facility.replace(new RegExp(`\\s*,\\s*${p.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "").trim() || p.facility;
}

/**
 * One address line with the facility, street, pincode and city each said
 * once: source records often repeat the clinic name and the city inside the
 * street field.
 */
export function addressLine(p: { facility: string; address: string; postalCode: string; city: string }): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [facilityLabel(p), ...p.address.split(","), p.postalCode, p.city]) {
    const seg = clean(raw).replace(/\s+/g, " ");
    const key = seg.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seg || !key || seen.has(key)) continue;
    seen.add(key);
    out.push(seg);
  }
  return out.join(", ");
}

export function placePhrase(d: DoctorView): string | null {
  const p = d.practices[0];
  if (!p) return null;
  const locality = isStated(p.localityName) && p.localityName !== p.city ? `${p.localityName}, ` : "";
  return `${locality}${p.city}, ${p.state}`;
}

/** One factual sentence a reader or an answer engine can lift: who, what, where, and how the record was checked. */
export function summarySentence(d: DoctorView): string {
  const sp = SPECIALTIES[d.specialty];
  const p = d.practices[0];
  const where = placePhrase(d);
  const at = p && isStated(p.facility) ? ` at ${facilityLabel(p)}` : "";
  const degrees = d.qualifications.map((q) => q.degree).filter(isStated).slice(0, 3);
  const reg = registrationState(d);
  const parts: string[] = [];
  parts.push(`Dr ${d.name} is ${sp.aOne}${where ? ` practising${at} in ${where}` : ""}.`);
  if (degrees.length) parts.push(`Qualifications on record: ${degrees.join(", ")}.`);
  if (reg === "verified") parts.push(`Registered with the ${d.registration.council} (No. ${d.registration.number}), checked against the register on ${d.registration.checkedOn}.`);
  else if (reg === "submitted") parts.push(`Council registration ${d.registration.number} (${d.registration.council}) is on record and awaiting a check against the register.`);
  else parts.push("No medical council registration number is on record yet.");
  if (d.yearsOfExperience > 0 && d.practiceStartYear) parts.push(`In practice since ${d.practiceStartYear}.`);
  return parts.join(" ");
}

/** Short label of what the page can and cannot vouch for; shown under the heading. */
export function verificationLine(d: DoctorView): string {
  const reg = registrationState(d);
  const p = d.practices[0];
  const practice = p ? (hasDate(p.confirmedOn) ? `practice confirmed ${p.confirmedOn}` : "practice not yet confirmed") : "no practice on record";
  return `${reg === "verified" ? `Registration verified ${d.registration.checkedOn}` : reg === "submitted" ? "Registration not yet checked" : "No registration on record"} · ${practice} · ${d.claimed ? "claimed by the doctor" : "unclaimed record"}`;
}

function feeAnswer(d: DoctorView): string {
  const p = d.practices[0];
  if (!p) return "No practice is on record, so no fee can be stated.";
  if (p.feeInr !== null && p.feeCheckedOn) return `The consultation fee at ${facilityLabel(p)} was ₹${p.feeInr.toLocaleString("en-IN")} when last confirmed on ${p.feeCheckedOn}. Fees change; confirm with the practice before you visit.`;
  return `The consultation fee has not been confirmed with ${isStated(p.facility) ? facilityLabel(p) : "the practice"}. Ask when you call or book. Once the practice confirms a fee it appears here with the date it was checked.`;
}

function timingsAnswer(d: DoctorView): string {
  const p = d.practices[0];
  if (!p) return "No practice is on record.";
  const days = isStated(p.days) ? p.days : null;
  const hours = isStated(p.hours) ? p.hours : null;
  if (days || hours) return `${facilityLabel(p)} lists ${[days, hours].filter(Boolean).join(", ")}${hasDate(p.confirmedOn) ? ` (confirmed ${p.confirmedOn})` : ""}. Timings change on holidays and for emergencies; call ahead.`;
  return `Consultation timings for ${isStated(p.facility) ? facilityLabel(p) : "this practice"} are not on record. Call the practice to check before visiting.`;
}

function contactAnswer(d: DoctorView): string {
  const p = d.practices[0];
  if (!p) return "No practice contact is on record.";
  const bits: string[] = [];
  if (isStated(p.address)) bits.push(`${addressLine(p)}.`);
  bits.push(isStated(p.phone) ? "Use the Call button on this page for the practice number (shown after sign-in to keep the number off scraper lists), or send an enquiry and the practice is notified." : "No phone number is on record; you can send an enquiry from this page and the practice is notified by email where one is on file.");
  if (d.googleListing) bits.push(`The practice also has a Google listing${d.googleListing.addressMatch ? " at the same address" : ""}; the Google Maps link on this page opens it.`);
  return bits.join(" ");
}

function registrationAnswer(d: DoctorView): string {
  const reg = registrationState(d);
  if (reg === "verified") return `Yes. Dr ${d.name} holds registration No. ${d.registration.number} with the ${d.registration.council}${d.registration.registeredYear ? `, registered in ${d.registration.registeredYear}` : ""}. It was matched against the register on ${d.registration.checkedOn}. Registration confirms the doctor is on the register; it is not a measure of clinical skill.`;
  if (reg === "submitted") return `A registration number (${d.registration.number}, ${d.registration.council}) is on record for Dr ${d.name} but has not yet been checked against the register. The profile says so until the check is done.`;
  return `No medical council registration number is on record for Dr ${d.name}. The profile is marked accordingly. If you are the doctor, claiming the profile lets you add it for verification.`;
}

function qualificationsAnswer(d: DoctorView): string {
  const sp = SPECIALTIES[d.specialty];
  if (!d.qualifications.length) return `No qualification is on record for Dr ${d.name}. The speciality shown, ${sp.name.toLowerCase()}, comes from the source record and has not been verified against an awarding body.`;
  const list = d.qualifications.map((q) => `${q.degree}${isStated(q.institution) && !/not stated/i.test(q.institution) ? ` (${q.institution}${q.year ? `, ${q.year}` : ""})` : ""}${q.state === "verified" ? " — verified" : " — as supplied, not yet checked"}`);
  return `${list.join("; ")}.`;
}

function specialtyAnswer(d: DoctorView): string {
  const sp = SPECIALTIES[d.specialty];
  const subs = d.subspecialties.filter(isStated);
  const services = d.services.filter(isStated).slice(0, 6);
  return `Dr ${d.name} is listed under ${sp.name.toLowerCase()}${subs.length ? ` (${subs.join(", ")})` : ""}.${services.length ? ` Services on record: ${services.join(", ")}.` : ""}${sp.guide ? ` See the guide to when to consult ${sp.aOne} for what this speciality covers.` : ""}`;
}

/** Four to six question–answer pairs, each answered only from the record. */
export function buildFaq(d: DoctorView): Faq[] {
  const where = placePhrase(d);
  const faqs: Faq[] = [];
  if (where) faqs.push({ q: `Where does Dr ${d.name} practise?`, a: `${d.practices.map((p) => addressLine(p)).join("; ")}.${d.practices.length > 1 ? ` ${d.practices.length} practice locations are on record.` : ""}` });
  faqs.push({ q: `Is Dr ${d.name} registered with a medical council?`, a: registrationAnswer(d) });
  faqs.push({ q: `What are Dr ${d.name}'s qualifications?`, a: qualificationsAnswer(d) });
  faqs.push({ q: `What does Dr ${d.name} treat?`, a: specialtyAnswer(d) });
  if (d.practices[0]) {
    faqs.push({ q: `What is Dr ${d.name}'s consultation fee?`, a: feeAnswer(d) });
    faqs.push({ q: `What are the consultation timings?`, a: timingsAnswer(d) });
    faqs.push({ q: `How do I contact or book Dr ${d.name}?`, a: contactAnswer(d) });
  }
  return faqs;
}
