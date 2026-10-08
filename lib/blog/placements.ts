import { POSTS, postBySlug, type BlogPost } from "@/lib/blog";

/**
 * Where blog posts are linked from, outside the blog.
 *
 * Before this file, seven of the ten posts had no inbound link from anywhere
 * on the site except the /blog index and each other's "Read next" blocks — so
 * the pages with the most crawl attention (specialities, conditions, registers,
 * qualifications, profiles) passed nothing to them. Each page family now names
 * the posts that actually answer the next question a reader on that page has,
 * and `tests/unit/blog-placements.test.ts` fails if any post is left with no
 * page family pointing at it.
 *
 * Choices are topical, not random: a surgical speciality page links to consent
 * and the hospital bill; a register page links to the fake-doctor checks. Where
 * one family has more good candidates than slots (profiles, conditions), the
 * pick rotates on the page's slug so the links spread over the whole pool
 * rather than piling onto the same three posts on thousands of pages.
 */

export type PlacementFamily = "specialty" | "condition" | "register" | "qualification" | "profile";

const SURGICAL = new Set([
  "general-surgery", "orthopaedics", "neurosurgery", "cardiothoracic-surgery", "gi-surgery",
  "plastic-surgery", "paediatric-surgery", "surgical-oncology", "transplant-surgery", "urology",
  "ent", "ophthalmology", "anaesthesiology",
]);
const ACUTE = new Set(["emergency-medicine", "critical-care"]);
const ALLIED = new Set([
  "physiotherapy", "clinical-psychology", "dietetics", "audiology", "occupational-therapy",
  "acupuncture", "ayush", "cosmetology",
]);

/** Pools, in priority order. Every slug here must exist; the test checks. */
export const POOLS: Record<string, string[]> = {
  surgical: [
    "informed-consent-before-surgery-in-india",
    "how-to-read-a-hospital-bill-in-india",
    "cashless-vs-reimbursement-health-insurance-claims",
    "getting-a-second-opinion-in-india",
  ],
  acute: [
    "emergency-treatment-rights-in-india",
    "cashless-vs-reimbursement-health-insurance-claims",
    "ayushman-bharat-pm-jay-explained",
    "how-to-read-a-hospital-bill-in-india",
  ],
  allied: [
    "how-to-spot-a-fake-doctor-in-india",
    "preparing-for-your-first-doctor-appointment",
    "doctor-consultation-fees-in-india",
  ],
  clinical: [
    "preparing-for-your-first-doctor-appointment",
    "doctor-consultation-fees-in-india",
    "how-to-choose-a-doctor-in-india",
    "getting-a-second-opinion-in-india",
  ],
  condition: [
    "preparing-for-your-first-doctor-appointment",
    "getting-a-second-opinion-in-india",
    "generic-medicines-and-jan-aushadhi",
    "how-to-get-your-medical-records-in-india",
    "prescriptions-and-pharmacies-in-india",
    "ayushman-bharat-pm-jay-explained",
    "online-doctor-consultation-rules-in-india",
    "abha-health-id-explained",
  ],
  register: [
    "how-to-spot-a-fake-doctor-in-india",
    "healthcare-professionals-registry-hpr-explained",
    "how-to-complain-about-a-doctor-in-india",
  ],
  qualification: [
    "how-to-spot-a-fake-doctor-in-india",
    "how-to-choose-a-doctor-in-india",
    "prescriptions-and-pharmacies-in-india",
  ],
  profile: [
    "preparing-for-your-first-doctor-appointment",
    "doctor-consultation-fees-in-india",
    "how-to-choose-a-doctor-in-india",
    "patient-rights-in-india",
    "clinic-nursing-home-or-hospital-in-india",
    "nabh-accreditation-explained",
    "online-doctor-consultation-rules-in-india",
    "how-to-get-your-medical-records-in-india",
    "abha-health-id-explained",
  ],
};

/** Small stable hash, so a page always shows the same rotation. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function take(pool: string[], count: number, seed?: string): BlogPost[] {
  const start = seed ? hash(seed) % pool.length : 0;
  const out: BlogPost[] = [];
  for (let i = 0; i < pool.length && out.length < count; i++) {
    const p = postBySlug(pool[(start + i) % pool.length]);
    if (p) out.push(p);
  }
  return out;
}

export function poolForSpecialty(key: string): string[] {
  if (ACUTE.has(key)) return POOLS.acute;
  if (SURGICAL.has(key)) return POOLS.surgical;
  if (ALLIED.has(key)) return POOLS.allied;
  return POOLS.clinical;
}

export function postsForSpecialty(key: string, count = 3): BlogPost[] {
  return take(poolForSpecialty(key), count);
}

export function postsForCondition(slug: string, count = 3): BlogPost[] {
  return take(POOLS.condition, count, slug);
}

export function postsForRegister(count = 3): BlogPost[] {
  return take(POOLS.register, count);
}

export function postsForQualification(count = 3): BlogPost[] {
  return take(POOLS.qualification, count);
}

export function postsForProfile(slug: string, count = 2): BlogPost[] {
  return take(POOLS.profile, count, slug);
}

/** Every post some page family can surface — used by the test. */
export function placedSlugs(): Set<string> {
  return new Set(Object.values(POOLS).flat());
}

export { POSTS };
