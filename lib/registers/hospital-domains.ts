/**
 * Hospital email domains. A sign-in email at one of these — verified by the
 * one-time code or Google sign-in, so the mailbox is really the person's —
 * is strong corroboration that the account belongs to someone on that
 * hospital's staff. It verifies a claim on its own only when the profile's
 * practice is at that hospital AND the account name fits the profile name
 * (lib/services/claim-autoverify.ts); otherwise it is a note for the officer.
 *
 * Pure and unit-tested. Domains are the chains' own corporate domains as
 * known in Oct 2026; a wrong or stale domain costs nothing but an
 * auto-approval that then goes to the queue instead.
 */

export interface HospitalDomain {
  /** Lower-case registrable domain; sub-domains match too. */
  domain: string;
  hospital: string;
  /** Matches the facility name on the profile (case-insensitive). */
  facility: RegExp;
}

export const HOSPITAL_DOMAINS: HospitalDomain[] = [
  { domain: "manipalhospitals.com", hospital: "Manipal Hospitals", facility: /\bmanipal\b|\bcolumbia asia\b/i },
  { domain: "apollohospitals.com", hospital: "Apollo Hospitals", facility: /\bapollo\b/i },
  { domain: "asterhospital.com", hospital: "Aster Hospitals", facility: /\baster\b/i },
  { domain: "asterdmhealthcare.com", hospital: "Aster DM Healthcare", facility: /\baster\b/i },
  { domain: "cloudninecare.com", hospital: "Cloudnine", facility: /\bcloudnine\b/i },
  { domain: "fortishealthcare.com", hospital: "Fortis Healthcare", facility: /\bfortis\b/i },
  { domain: "kimshospitals.com", hospital: "KIMS Hospitals", facility: /\bkims\b/i },
  { domain: "narayanahealth.org", hospital: "Narayana Health", facility: /\bnarayana\b|\bmazumdar\b|\bnh\b/i },
  { domain: "sparshhospital.com", hospital: "Sparsh Hospital", facility: /\bsparsh\b/i },
  { domain: "rainbowhospitals.in", hospital: "Rainbow Children's Hospital", facility: /\brainbow\b/i },
  { domain: "motherhoodindia.com", hospital: "Motherhood Hospitals", facility: /\bmotherhood\b/i },
  { domain: "medanta.org", hospital: "Medanta", facility: /\bmedanta\b/i },
  { domain: "yashodahospitals.com", hospital: "Yashoda Hospitals", facility: /\byashoda\b/i },
  { domain: "carehospitals.com", hospital: "CARE Hospitals", facility: /\bcare hospital/i },
  { domain: "kauveryhospital.com", hospital: "Kauvery Hospital", facility: /\bkauvery\b/i },
  { domain: "sagarhospitals.in", hospital: "Sagar Hospitals", facility: /\bsagar\b/i },
  { domain: "sakraworldhospital.com", hospital: "Sakra World Hospital", facility: /\bsakra\b/i },
  { domain: "kokilabenhospital.com", hospital: "Kokilaben Dhirubhai Ambani Hospital", facility: /\bkokilaben\b/i },
  { domain: "amritahospitals.org", hospital: "Amrita Hospitals", facility: /\bamrita\b/i },
  { domain: "continentalhospitals.com", hospital: "Continental Hospitals", facility: /\bcontinental\b/i },
  { domain: "artemishospitals.com", hospital: "Artemis Hospitals", facility: /\bartemis\b/i },
  { domain: "maxhealthcare.com", hospital: "Max Healthcare", facility: /\bmax\b/i },
  { domain: "hcgoncology.com", hospital: "HCG", facility: /\bhcg\b/i },
  { domain: "gleneagleshospitals.co.in", hospital: "Gleneagles Hospitals", facility: /\bgleneagles\b|\bbgs\b/i },
  { domain: "stjohns.in", hospital: "St. John's Medical College Hospital", facility: /\bst\.? ?john/i },
  { domain: "nimhans.ac.in", hospital: "NIMHANS", facility: /\bnimhans\b/i },
  { domain: "aiims.edu", hospital: "AIIMS", facility: /\baiims\b/i },
  { domain: "pgimer.edu.in", hospital: "PGIMER", facility: /\bpgimer\b/i },
  { domain: "cmcvellore.ac.in", hospital: "CMC Vellore", facility: /\bcmc\b|christian medical college/i },
  { domain: "jipmer.edu.in", hospital: "JIPMER", facility: /\bjipmer\b/i },
  { domain: "tmc.gov.in", hospital: "Tata Memorial Centre", facility: /\btata memorial\b/i },
  { domain: "lilavatihospital.com", hospital: "Lilavati Hospital", facility: /\blilavati\b/i },
  { domain: "hindujahospital.com", hospital: "P. D. Hinduja Hospital", facility: /\bhinduja\b/i },
  { domain: "jaslokhospital.net", hospital: "Jaslok Hospital", facility: /\bjaslok\b/i },
  { domain: "rubyhall.com", hospital: "Ruby Hall Clinic", facility: /\bruby hall\b/i },
  { domain: "kimsglobal.com", hospital: "KIMSHEALTH", facility: /\bkims\b/i },
];

/** Domain of an email, lower-cased; null for anything that is not an email. */
export function emailDomain(email: string | null | undefined): string | null {
  const m = /^[^@\s]+@([^@\s]+)$/.exec((email ?? "").trim().toLowerCase());
  return m ? m[1] : null;
}

/** The hospital whose domain the email is at, if any. Sub-domains (mail.manipalhospitals.com) count. */
export function hospitalForEmail(email: string | null | undefined): HospitalDomain | null {
  const d = emailDomain(email);
  if (!d) return null;
  return HOSPITAL_DOMAINS.find((h) => d === h.domain || d.endsWith(`.${h.domain}`)) ?? null;
}

/** True when any of the profile's facility names is that hospital. */
export function facilityMatchesHospital(h: HospitalDomain, facilityNames: string[]): boolean {
  return facilityNames.some((n) => h.facility.test(n));
}
