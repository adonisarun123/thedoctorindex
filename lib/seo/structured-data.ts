import { CITY, SPECIALTIES } from "@/lib/data/taxonomy";
import { SITE, absoluteUrl, paths } from "@/lib/site";
import type { DoctorView, Specialty } from "@/lib/types";

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
 * 3. Markup describes what is visible on the page and nothing else.
 */

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "grievance officer",
        email: SITE.grievanceEmail,
        areaServed: "IN",
      },
    ],
  };
}

export function webSiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
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

/** One MedicalClinic per practice location, using the most specific applicable type. */
function practiceLd(d: DoctorView): Json[] {
  return d.practices.map((p) => ({
    "@type": "MedicalClinic",
    name: p.facility,
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
      addressLocality: CITY.name,
      addressRegion: CITY.state,
      postalCode: p.postalCode,
      addressCountry: "IN",
    },
    telephone: p.phone,
    openingHours: `${p.days} ${p.hours}`,
  }));
}

export function doctorLd(d: DoctorView): Json {
  const specialty = SPECIALTIES[d.specialty];
  const person: Json = {
    "@type": "Person",
    name: `Dr ${d.name}`,
    jobTitle: specialty.one,
    url: absoluteUrl(paths.doctor(d.slug)),
    knowsLanguage: d.languages,
    worksFor: practiceLd(d),
    hasCredential: d.qualifications
      .filter((q) => q.state === "verified")
      .map((q) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: q.degree,
        recognizedBy: { "@type": "Organization", name: q.institution },
      })),
  };

  // Claimed profiles are participatory, so ProfilePage applies. Unclaimed
  // records are compiled by us and the doctor takes no part in them.
  return {
    "@context": "https://schema.org",
    "@type": d.claimed ? "ProfilePage" : "WebPage",
    url: absoluteUrl(paths.doctor(d.slug)),
    name: `Dr ${d.name}, ${specialty.one} in ${CITY.name}`,
    dateModified: d.lastVerifiedOn,
    mainEntity: person,
  };
}

export function listingLd(
  specialty: Specialty,
  placeName: string,
  canonicalPath: string,
  doctors: DoctorView[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absoluteUrl(canonicalPath),
    name: `Verified ${specialty.plural} in ${placeName}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: doctors.length,
      itemListElement: doctors.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(paths.doctor(d.slug)),
        name: `Dr ${d.name}`,
      })),
    },
  };
}
