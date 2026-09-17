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

function languagesAnswer(d: DoctorView): string {
  const langs = d.languages.filter(isStated);
  if (langs.length) return `${langs.join(", ")} are on record for Dr ${d.name}. Languages are supplied by the practice or the doctor, not independently checked.`;
  return `No consultation languages are on record for Dr ${d.name}. Ask the practice when you call. Once the doctor claims this profile, the languages they list appear here.`;
}

function modesAnswer(d: DoctorView): string {
  const online = d.modes.some((m) => /online|video|tele/i.test(m));
  if (!d.modes.length) return `Consultation modes are not on record for Dr ${d.name}. Ask the practice whether an online consultation is possible.`;
  if (online) return `Yes. Dr ${d.name} is listed for ${d.modes.join(" and ").toLowerCase()} consultation. Availability changes; confirm with the practice before you book.`;
  return `Only ${d.modes.join(" and ").toLowerCase()} consultation is on record for Dr ${d.name}. No online consultation is listed. Ask the practice whether one is possible.`;
}

function experienceAnswer(d: DoctorView): string {
  if (d.practiceStartYear && d.yearsOfExperience > 0) return `Dr ${d.name} has been in practice since ${d.practiceStartYear}, about ${d.yearsOfExperience} years. The start year comes from the record and has not been independently checked.`;
  if (d.registration.registeredYear) {
    const yrs = new Date().getFullYear() - d.registration.registeredYear;
    return `A practice start year is not on record. Council registration dates from ${d.registration.registeredYear}, ${yrs > 0 ? `about ${yrs} years ago` : "this year"}, which is the earliest date this profile can evidence — it is not the same as years in practice.`;
  }
  return `Neither a practice start year nor a registration year is on record for Dr ${d.name}, so this profile does not state years of experience. It will not estimate one.`;
}

function claimAnswer(d: DoctorView): string {
  if (d.claimed) return `Yes. Dr ${d.name} has claimed this profile and controls the editable fields on it. Verification of registration and qualifications is still carried out by The Doctor Index, not by the doctor.`;
  return `No. This record was compiled from permitted public sources and Dr ${d.name} takes no part in it. Nothing on this page was written or approved by the doctor. Claiming the profile is free and lets the doctor correct it.`;
}

/** How a reader checks this doctor without trusting this page — the site's own argument, stated per record. */
function selfCheckAnswer(d: DoctorView): string {
  const reg = registrationState(d);
  const base = reg === "none"
    ? `No registration number is on record here, so there is nothing to look up yet. Ask the practice for the doctor's council registration number, then search for it on the National Medical Commission register.`
    : `Search No. ${d.registration.number} on the National Medical Commission register, or on the ${d.registration.council} register directly. That is the authoritative source; this page only records what the search returned and when.`;
  return `${base} Do not take a profile on any directory, including this one, as proof on its own.`;
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
  faqs.push({ q: `How many years has Dr ${d.name} been practising?`, a: experienceAnswer(d) });
  faqs.push({ q: `Does Dr ${d.name} consult online?`, a: modesAnswer(d) });
  faqs.push({ q: `What languages does Dr ${d.name} consult in?`, a: languagesAnswer(d) });
  faqs.push({ q: `Has Dr ${d.name} claimed this profile?`, a: claimAnswer(d) });
  faqs.push({ q: `How can I check Dr ${d.name}'s registration myself?`, a: selfCheckAnswer(d) });
  return faqs;
}

/**
 * One sentence placing this doctor in the local supply, built from counts the
 * database returned for this exact locality, city and speciality. Every number
 * is measured; a count of zero or one produces a shorter sentence rather than
 * a padded one.
 */
export function supplySentence(d: DoctorView, counts: { locality: number; city: number; cityAllSpecialties: number }): string | null {
  const p = d.practices[0];
  const sp = SPECIALTIES[d.specialty];
  if (!p || !isStated(p.city)) return null;
  const plural = sp.plural.toLowerCase();
  const parts: string[] = [];
  const hasLocality = isStated(p.localityName) && p.localityName !== p.city && counts.locality > 0;
  if (hasLocality) {
    parts.push(counts.locality === 1
      ? `Dr ${d.name} is the only ${sp.one.toLowerCase()} on record in ${p.localityName}.`
      : `${counts.locality} ${plural} are on record in ${p.localityName}, including Dr ${d.name}.`);
  }
  if (counts.city > 0) {
    parts.push(hasLocality
      ? `Across ${p.city} the index holds ${counts.city.toLocaleString("en-IN")}.`
      : `${counts.city.toLocaleString("en-IN")} ${plural} are on record in ${p.city}, including Dr ${d.name}.`);
  }
  if (counts.cityAllSpecialties > 0) parts.push(`${counts.cityAllSpecialties.toLocaleString("en-IN")} doctors across all specialities are listed in ${p.city}.`);
  if (!parts.length) return null;
  parts.push("Counts are of profiles compiled by this index, not of every doctor practising there.");
  return parts.join(" ");
}
