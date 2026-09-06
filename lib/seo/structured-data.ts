import type { Guide } from "@/lib/data/guides";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { SITE, absoluteUrl, paths } from "@/lib/site";
import type { DoctorView, Practice, Specialty, SpecialtyKey } from "@/lib/types";

/**
 * Structured data (project plan §11.6).
 *
 * Three constraints drive everything here:
 *
 * 1. ProfilePage is not earned by calling a page a profile. It is used only
 *    where the doctor is affiliated with and actively participates in the page
 *    — i.e. where the profile has been claimed. Unclaimed records get WebPage.
 * 2. We do not emit review/aggregateRating markup on doctor pages. Google's
 *    review snippet feature does not support a standalone Person the way it
 *    supports a qualifying local business, and promising stars on every doctor
 *    page would be selling something we cannot deliver.
 * 3. Markup describes what is visible on the page and nothing else. Practice
 *    phone numbers are gated behind sign-in on the page, so `telephone` is
 *    never emitted; nor is a photo without usage consent.
 *
 * Every entity that appears more than once (the organisation, the website, a
 * doctor) carries a stable `@id` so the graph across pages joins up.
 */

type Json = Record<string, unknown>;

const ORG_ID = () => `${absoluteUrl("/")}#organization`;
const SITE_ID = () => `${absoluteUrl("/")}#website`;
const LOGO_URL = () => absoluteUrl("/icon.svg");

/** "12 Aug 2026" → "2026-08-12". Unparseable input is returned unchanged. */
const MONTHS: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
export function isoDate(display: string | null | undefined): string | undefined {
  if (!display) return undefined;
  const m = /^(\d{2}) ([A-Za-z]{3}) (\d{4})$/.exec(display.trim());
  if (!m || !MONTHS[m[2]]) return /^\d{4}-\d{2}-\d{2}/.test(display) ? display.slice(0, 10) : undefined;
  return `${m[3]}-${MONTHS[m[2]]}-${m[1]}`;
}

/** schema.org MedicalSpecialty enumeration members for our specialities. */
const MS = (v: string) => `https://schema.org/${v}`;
export const MEDICAL_SPECIALTY: Partial<Record<SpecialtyKey, string>> = {
  cardiology: MS("Cardiovascular"),
  "cardiothoracic-surgery": MS("Cardiovascular"),
  dermatology: MS("Dermatology"),
  cosmetology: MS("Dermatology"),
  orthopaedics: MS("Musculoskeletal"),
  rheumatology: MS("Rheumatologic"),
  paediatrics: MS("Pediatric"),
  "paediatric-surgery": MS("Pediatric"),
  "general-practice": MS("PrimaryCare"),
  "internal-medicine": MS("PrimaryCare"),
  geriatrics: MS("Geriatric"),
  gynaecology: MS("Gynecologic"),
  "general-surgery": MS("Surgical"),
  "plastic-surgery": MS("PlasticSurgery"),
  "gi-surgery": MS("Surgical"),
  ophthalmology: MS("Optometric"),
  anaesthesiology: MS("Anesthesia"),
  pathology: MS("Pathology"),
  radiology: MS("Radiography"),
  psychiatry: MS("Psychiatric"),
  "clinical-psychology": MS("Psychiatric"),
  ent: MS("Otolaryngologic"),
  physiotherapy: MS("Physiotherapy"),
  "occupational-therapy": MS("Physiotherapy"),
  pulmonology: MS("Pulmonary"),
  urology: MS("Urologic"),
  nephrology: MS("Renal"),
  neurology: MS("Neurologic"),
  neurosurgery: MS("Neurologic"),
  dietetics: MS("DietNutrition"),
  gastroenterology: MS("Gastroenterologic"),
  "surgical-oncology": MS("Oncologic"),
  "radiation-oncology": MS("Oncologic"),
  "medical-oncology": MS("Oncologic"),
  haematology: MS("Hematologic"),
  diabetology: MS("Endocrine"),
  endocrinology: MS("Endocrine"),
  audiology: MS("SpeechPathology"),
  dentistry: MS("Dentistry"),
  "sexual-medicine": MS("Urologic"),
  "non-clinical-medicine": MS("LaboratoryScience"),
};

function aboutSpecialty(specialty: Specialty): Json {
  const id = MEDICAL_SPECIALTY[specialty.key];
  return { "@type": "MedicalSpecialty", ...(id ? { "@id": id } : {}), name: specialty.name };
}

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID(),
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: LOGO_URL(), width: 64, height: 64 },
    description: SITE.description,
    email: SITE.supportEmail,
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: ["Medical registration verification", "Doctor directories", "Healthcare in India"],
    ...(SITE.socialLinks.length ? { sameAs: SITE.socialLinks } : {}),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: SITE.supportEmail, areaServed: "IN", availableLanguage: ["en"] },
      { "@type": "ContactPoint", contactType: "grievance officer", email: SITE.grievanceEmail, areaServed: "IN", availableLanguage: ["en"] },
    ],
  };
}

export function webSiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID(),
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID() },
    // The site search exists and works; the sitelinks search box feature that
    // once read this was retired by Google in 2024, so it is informational.
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: Array<{ name: string; path?: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

/* ---------------------------------------------------------------------------
   Opening hours. Practice rows store "Mon–Fri" / "10:00–13:00, 17:00–19:30".
   Parsed into OpeningHoursSpecification where the strings are regular; the
   raw string is kept as `openingHours` either way so nothing is lost.
--------------------------------------------------------------------------- */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDEX: Record<string, number> = { mon: 0, tue: 1, tues: 1, wed: 2, thu: 3, thur: 3, thurs: 3, fri: 4, sat: 5, sun: 6 };

export function parseDays(spec: string): string[] | null {
  const out = new Set<string>();
  for (const part of spec.split(",").map((p) => p.trim()).filter(Boolean)) {
    const range = part.split(/\s*[–—-]\s*/);
    if (range.length === 1) {
      const i = DAY_INDEX[range[0].toLowerCase()];
      if (i === undefined) return null;
      out.add(DAYS[i]);
    } else if (range.length === 2) {
      const a = DAY_INDEX[range[0].toLowerCase()];
      const b = DAY_INDEX[range[1].toLowerCase()];
      if (a === undefined || b === undefined) return null;
      for (let i = a; ; i = (i + 1) % 7) {
        out.add(DAYS[i]);
        if (i === b) break;
      }
    } else return null;
  }
  return out.size ? [...out] : null;
}

export function parseHours(spec: string): Array<{ opens: string; closes: string }> | null {
  const out: Array<{ opens: string; closes: string }> = [];
  for (const part of spec.split(",").map((p) => p.trim()).filter(Boolean)) {
    const m = /^(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})$/.exec(part);
    if (!m) return null;
    out.push({ opens: m[1].padStart(5, "0"), closes: m[2].padStart(5, "0") });
  }
  return out.length ? out : null;
}

export function openingHoursLd(p: Pick<Practice, "days" | "hours">): Json[] | undefined {
  const days = parseDays(p.days);
  const hours = parseHours(p.hours);
  if (!days || !hours) return undefined;
  return hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: h.opens, closes: h.closes }));
}

function addressLd(p: Practice): Json {
  return {
    "@type": "PostalAddress",
    streetAddress: p.address,
    addressLocality: p.city || p.localityName,
    addressRegion: p.state,
    postalCode: p.postalCode,
    addressCountry: "IN",
  };
}

/** One MedicalClinic per practice location. Coordinates only when the facility itself was geocoded. */
function practiceLd(d: DoctorView): Json[] {
  return d.practices.map((p) => {
    const spec = openingHoursLd(p);
    return {
      "@type": "MedicalClinic",
      ...(p.facilityId ? { "@id": `${absoluteUrl(paths.doctor(d.slug))}#facility-${p.facilityId}` } : {}),
      name: p.facility,
      address: addressLd(p),
      ...(p.geoSource === "facility" && p.lat !== undefined && p.lng !== undefined ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
      openingHours: `${p.days} ${p.hours}`,
      ...(spec ? { openingHoursSpecification: spec } : {}),
      ...(p.feeInr !== null ? { priceRange: `₹${p.feeInr}` } : {}),
      ...(MEDICAL_SPECIALTY[d.specialty] ? { medicalSpecialty: MEDICAL_SPECIALTY[d.specialty] } : {}),
    };
  });
}

export function doctorLd(d: DoctorView): Json {
  const specialty = SPECIALTIES[d.specialty];
  const url = absoluteUrl(paths.doctor(d.slug));
  const clinics = practiceLd(d);
  const [first, last] = (() => {
    const parts = d.name.trim().split(/\s+/);
    return parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [parts[0], undefined];
  })();

  // IndividualPhysician is schema.org's type for a practitioner as opposed to
  // a practice; paired with Person so consumers that only know Person still
  // read the name, credentials and languages.
  const physician: Json = {
    "@type": ["Person", "IndividualPhysician"],
    "@id": `${url}#physician`,
    name: `Dr ${d.name}`,
    givenName: first,
    ...(last ? { familyName: last } : {}),
    honorificPrefix: "Dr",
    gender: d.gender === "F" ? "Female" : "Male",
    jobTitle: specialty.one,
    url,
    ...(d.photoUrl ? { image: absoluteUrl(d.photoUrl) } : {}),
    ...(MEDICAL_SPECIALTY[d.specialty] ? { medicalSpecialty: MEDICAL_SPECIALTY[d.specialty] } : {}),
    knowsAbout: [specialty.name, ...d.subspecialties],
    knowsLanguage: d.languages,
    identifier: {
      "@type": "PropertyValue",
      propertyID: `${d.registration.council} registration`,
      value: d.registration.number,
    },
    hasCredential: d.qualifications
      .filter((q) => q.state === "verified")
      .map((q) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: q.degree,
        recognizedBy: { "@type": "Organization", name: q.institution },
      })),
    ...(d.services.length ? { availableService: d.services.map((name) => ({ "@type": "MedicalProcedure", name })) } : {}),
    ...(clinics.length ? { address: (clinics[0] as { address: Json }).address, hospitalAffiliation: clinics } : {}),
    isAcceptingNewPatients: d.status === "active",
  };

  // Claimed profiles are participatory, so ProfilePage applies. Unclaimed
  // records are compiled by us and the doctor takes no part in them.
  return {
    "@context": "https://schema.org",
    "@type": d.claimed ? "ProfilePage" : "WebPage",
    "@id": url,
    url,
    name: `Dr ${d.name}, ${specialty.one} in ${d.practices[0]?.city || "India"}`,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
    dateModified: isoDate(d.lastVerifiedOn) ?? d.lastVerifiedOn,
    primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image`, width: 1200, height: 630 },
    mainEntity: physician,
  };
}

export function listingLd(specialty: Specialty, placeName: string, canonicalPath: string, doctors: DoctorView[], place: { city: string; state: string }): Json {
  const url = absoluteUrl(canonicalPath);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: `Verified ${specialty.plural} in ${placeName}`,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
    about: aboutSpecialty(specialty),
    spatialCoverage: { "@type": "Place", name: placeName, address: { "@type": "PostalAddress", addressLocality: place.city, addressRegion: place.state, addressCountry: "IN" } },
    primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(`/og/listing${canonicalPath.replace(/^\/doctors/, "")}`), width: 1200, height: 630 },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: doctors.length,
      itemListElement: doctors.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(paths.doctor(d.slug)),
        name: `Dr ${d.name}`,
        item: { "@type": ["Person", "IndividualPhysician"], "@id": `${absoluteUrl(paths.doctor(d.slug))}#physician`, name: `Dr ${d.name}`, url: absoluteUrl(paths.doctor(d.slug)), jobTitle: specialty.one, ...(MEDICAL_SPECIALTY[specialty.key] ? { medicalSpecialty: MEDICAL_SPECIALTY[specialty.key] } : {}) },
      })),
    },
  };
}

/** National speciality hub: reviewed guidance plus the open listing pages under it. */
export function specialtyLd(specialty: Specialty, count: number, listingPaths: string[]): Json {
  const url = absoluteUrl(paths.specialty(specialty.key));
  return {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "MedicalWebPage"],
    "@id": url,
    url,
    name: `${specialty.name} — verified ${specialty.plural.toLowerCase()} in India`,
    description: specialty.guide,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
    about: aboutSpecialty(specialty),
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    ...(specialty.reviewedOn ? { lastReviewed: isoDate(specialty.reviewedOn) ?? specialty.reviewedOn } : {}),
    primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image`, width: 1200, height: 630 },
    mainEntity: {
      "@type": "ItemList",
      name: `Where to find verified ${specialty.plural.toLowerCase()}`,
      numberOfItems: listingPaths.length,
      itemListElement: listingPaths.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(p) })),
    },
    ...(count ? { significantLink: listingPaths.map((p) => absoluteUrl(p)) } : {}),
  };
}

/** Health guide: a MedicalWebPage whose main entity is the reviewed article. */
export function guideLd(guide: Guide): Json {
  const url = absoluteUrl(`/health-guides/${guide.slug}`);
  const image = `${url}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": url,
    url,
    name: guide.title,
    description: guide.standfirst,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    lastReviewed: isoDate(guide.reviewedOn) ?? guide.reviewedOn,
    reviewedBy: { "@type": "Person", name: guide.reviewer },
    ...(guide.specialty ? { about: aboutSpecialty(SPECIALTIES[guide.specialty]) } : {}),
    primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    mainEntity: {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.standfirst,
      image,
      datePublished: isoDate(guide.publishedOn) ?? guide.publishedOn,
      dateModified: isoDate(guide.reviewedOn) ?? guide.reviewedOn,
      author: { "@type": "Organization", name: guide.author, url: absoluteUrl("/about") },
      reviewedBy: { "@type": "Person", name: guide.reviewer },
      publisher: { "@id": ORG_ID() },
      mainEntityOfPage: url,
      timeRequired: `PT${guide.readingMinutes}M`,
      inLanguage: "en-IN",
      isAccessibleForFree: true,
    },
  };
}

/** Generic hub page: a CollectionPage whose main entity lists the pages under it. */
export function collectionLd(input: { name: string; path: string; description?: string; items: Array<{ name: string; path: string }> }): Json {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
    },
  };
}
