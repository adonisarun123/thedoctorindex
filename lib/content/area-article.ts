import { displayName } from "@/lib/display-name";
import type { DoctorView, Locality, Specialty } from "@/lib/types";

/**
 * Area articles: "Orthopaedic surgeons in HSR Layout".
 *
 * Asked for 8 Oct 2026 as a separate article section. Built instead on the
 * existing locality × speciality listing URL, because a second page listing the
 * same doctors for the same query would compete with the listing and reads as a
 * doorway page. The listing becomes the article: an opening summary, where the
 * doctors practise, and every doctor in one A–Z list — claimed or not.
 *
 * Every sentence is computed from the records under the URL and is emitted only
 * when the figure behind it exists, so two area articles differ by their data,
 * not by swapped nouns.
 */

/** A locality × speciality page becomes an area article at this many published doctors. */
export const AREA_ARTICLE_MIN = 10;

/** Specialities with no patient-facing area guide (nobody searches for them by neighbourhood). */
export const AREA_ARTICLE_EXCLUDED = new Set<string>(["non-clinical-medicine"]);


/**
 * Search wording for area guides (8 Oct 2026). Titles and H1s use the words
 * patients type — "Orthopaedic Doctors in HSR Layout, Bangalore" — rather than
 * the register's wording ("Orthopaedic surgeons … Bengaluru"). URLs, breadcrumbs
 * and structured data keep the official names; only the copy changes.
 */
const CITY_COMMON_NAME: Record<string, string> = {
  bengaluru: "Bangalore",
  gurugram: "Gurgaon",
  mysuru: "Mysore",
  mangaluru: "Mangalore",
  belagavi: "Belgaum",
  kalaburagi: "Gulbarga",
  "hubballi-dharwad": "Hubli-Dharwad",
  kozhikode: "Calicut",
  thiruvananthapuram: "Trivandrum",
  puducherry: "Pondicherry",
  "kanpur-nagar": "Kanpur",
};

const SPECIALTY_SEARCH_NAME: Record<string, string> = {
  orthopaedics: "Orthopaedic Doctors",
  ent: "ENT Doctors",
  ayush: "AYUSH Doctors",
  "internal-medicine": "Internal Medicine Doctors",
  "general-practice": "General Physicians",
  "physical-medicine-rehabilitation": "Rehabilitation Doctors",
  "infectious-diseases": "Infectious Disease Doctors",
  "transplant-surgery": "Transplant Doctors",
};

const titleCase = (t: string) => t.replace(/\b([a-z])/g, (m) => m.toUpperCase()).replace(/\bIn\b/g, "in");

/** "Bangalore" for bengaluru, "Gurgaon" for gurugram; the official name otherwise. */
export function commonCityName(citySlug: string, cityName: string): string {
  return CITY_COMMON_NAME[citySlug] ?? cityName;
}

/** "Orthopaedic Doctors", "Gynaecologists", "ENT Doctors". */
export function areaSpecialtyName(specialty: Pick<Specialty, "key" | "plural">): string {
  return SPECIALTY_SEARCH_NAME[specialty.key] ?? titleCase(specialty.plural);
}

/** The same name inside a sentence: "orthopaedic doctors", keeping ENT and AYUSH upper case. */
export function areaSpecialtyLower(specialty: Pick<Specialty, "key" | "plural">): string {
  return areaSpecialtyName(specialty).replace(/\b([A-Z][a-z]+)\b/g, (w) => w.toLowerCase());
}

/** "Orthopaedic Doctors in HSR Layout, Bangalore" */
export function areaTitle(specialty: Pick<Specialty, "key" | "plural">, locality: Pick<Locality, "name" | "citySlug" | "city">): string {
  return `${areaSpecialtyName(specialty)} in ${locality.name}, ${commonCityName(locality.citySlug, locality.city)}`;
}

/** Whether a locality × speciality page is an area guide (gets the article and the search wording). */
export function isAreaGuide(locality: Locality | null, specialty: Pick<Specialty, "key">, doctors: number): locality is Locality {
  return Boolean(locality) && doctors >= AREA_ARTICLE_MIN && !isCitywideLocality(locality!) && !AREA_ARTICLE_EXCLUDED.has(specialty.key);
}

export interface AreaFacility {
  name: string;
  doctors: Array<{ name: string; slug: string }>;
}

export interface AreaRosterEntry {
  name: string;
  slug: string;
  facility: string | null;
  years: number;
  claimed: boolean;
}

export interface AreaArticle {
  intro: string[];
  facilities: AreaFacility[];
  roster: AreaRosterEntry[];
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;

/**
 * Some imported records place doctors in a "locality" that is the whole city
 * (Indore in Indore). That page repeats the city page, so it gets no article
 * and no place in the area hub.
 */
export function isCitywideLocality(locality: Pick<Locality, "slug" | "name" | "citySlug" | "city">): boolean {
  return locality.slug === locality.citySlug || locality.name.trim().toLowerCase() === locality.city.trim().toLowerCase();
}

export function buildAreaArticle(doctors: DoctorView[], specialty: Specialty, locality: Locality): AreaArticle | null {
  if (!isAreaGuide(locality, specialty, doctors.length)) return null;
  const here = (d: DoctorView) => d.practices.filter((p) => p.locality === locality.key);

  // Where they practise: facilities inside this locality, largest first.
  const byFacility = new Map<string, AreaFacility>();
  for (const d of doctors) {
    for (const p of here(d)) {
      const name = p.facility.trim();
      if (!name) continue;
      const f = byFacility.get(name) ?? { name, doctors: [] };
      if (!f.doctors.some((x) => x.slug === d.slug)) f.doctors.push({ name: displayName(d), slug: d.slug });
      byFacility.set(name, f);
    }
  }
  const facilities = [...byFacility.values()].sort((a, b) => b.doctors.length - a.doctors.length || a.name.localeCompare(b.name));

  const roster: AreaRosterEntry[] = doctors
    .map((d) => ({ name: displayName(d), slug: d.slug, facility: here(d)[0]?.facility ?? d.practices[0]?.facility ?? null, years: d.yearsOfExperience, claimed: d.claimed }))
    .sort((a, b) => a.name.replace(/^Dr\.?\s+/i, "").localeCompare(b.name.replace(/^Dr\.?\s+/i, "")));

  const fees = doctors.flatMap((d) => here(d).map((p) => p.feeInr)).filter((f): f is number => typeof f === "number" && f > 0);
  const senior = doctors.filter((d) => d.yearsOfExperience >= 15).length;
  const women = doctors.filter((d) => d.gender === "F").length;
  const claimed = doctors.filter((d) => d.claimed).length;
  const online = doctors.filter((d) => d.modes.includes("Online")).length;
  const langCount = new Map<string, number>();
  for (const d of doctors) for (const l of d.languages) langCount.set(l, (langCount.get(l) ?? 0) + 1);
  const langs = [...langCount.entries()].filter(([l]) => l !== "English").sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l);

  const n = doctors.length;
  const place = `${locality.name}, ${commonCityName(locality.citySlug, locality.city)}`;
  const intro: string[] = [];
  intro.push(
    `The Doctor Index lists ${plural(n, areaSpecialtyLower(specialty).replace(/s$/, ""), areaSpecialtyLower(specialty))} practising in ${place}` +
      (facilities.length > 0 ? `, across ${plural(facilities.length, "hospital or clinic", "hospitals and clinics")} in the area` : "") +
      (facilities[0] && facilities[0].doctors.length > 1 ? `. ${facilities[0].name} has the most, with ${facilities[0].doctors.length}.` : "."),
  );
  const facts: string[] = [];
  if (senior > 0) facts.push(`${plural(senior, "has", "have")} 15 or more years in practice`);
  if (women > 0) facts.push(`${plural(women, "is a woman", "are women")}`);
  if (online > 0) facts.push(`${plural(online, "offers", "offer")} online consultations`);
  if (facts.length > 0) intro.push(`Of these, ${facts.join(", ")}.`);
  if (fees.length >= 3) {
    const lo = Math.min(...fees), hi = Math.max(...fees);
    intro.push(lo === hi ? `Where a consultation fee is on record, it is ${inr(lo)}.` : `Consultation fees on record range from ${inr(lo)} to ${inr(hi)}; most profiles do not yet list one, so confirm with the practice.`);
  }
  if (langs.length > 0) intro.push(`Besides English, the languages most often listed are ${langs.join(", ")}.`);
  intro.push(
    claimed === n
      ? "Every profile here has been claimed by the doctor."
      : `Every doctor on record is listed below, including the ${plural(n - claimed, "who has", "who have")} not yet claimed their profile. Each profile states what has been checked, and when.`,
  );
  return { intro, facilities, roster };
}
