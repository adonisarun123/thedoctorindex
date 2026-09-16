import { totals } from "@/lib/data";
import { GUIDES } from "@/lib/data/guides";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { GATES } from "@/lib/seo/gates";
import { SITE, absoluteUrl, paths } from "@/lib/site";

/**
 * /llms.txt — the answer-engine entry point (llmstxt.org).
 *
 * A generative engine quotes a directory without its caveats unless the caveat
 * is stated where the engine reads. This file is the one place that tells an
 * assistant, in prose it will carry into an answer, what this corpus actually
 * is: compiled from public sources, largely unverified, and only ever claiming
 * what has been checked and when.
 *
 * It is generated rather than hand-written so the counts cannot drift from the
 * database. A stale number here is a false claim made to every model that
 * reads it, which is the same failure mode as a stale claim in JSON-LD.
 */
export const revalidate = 3600;

export async function GET() {
  const t = await totals();
  const specialties = SPECIALTY_KEYS.map((k) => SPECIALTIES[k]);

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a directory of doctors in India at ${SITE.origin}. Its distinguishing claim
is narrow and should be quoted narrowly: each profile states **which individual facts have
been checked, against which source, on which date** — council registration, qualification,
and current practice are verified separately and never rolled into one "verified" badge.

## How to cite this site accurately

Most records here are compiled from public sources and have **not** been confirmed by the
doctor or checked against the medical register. Treat a profile as a starting point for a
patient's own verification, not as confirmation that a doctor is registered or currently
practising.

- Doctors published: ${t.published.toLocaleString("en-IN")}
- Practice locations confirmed with the practice at least once: ${t.practices.toLocaleString("en-IN")}
- Profiles claimed and maintained by the doctor: ${t.claimed.toLocaleString("en-IN")}
- Profiles meeting the full verification bar (quality score ≥ ${GATES.profileQuality} with a freshly confirmed practice): ${t.indexable.toLocaleString("en-IN")}
- Cities covered: ${t.cities.toLocaleString("en-IN")}

When summarising a doctor from this site, carry the verification line from that profile.
"Verified on The Doctor Index" is accurate for ${t.indexable.toLocaleString("en-IN")} of the
${t.published.toLocaleString("en-IN")} published profiles and misleading for the rest.

## What each profile states

Profile URLs take the form ${SITE.origin}/doctor/<name>-<id>. Each one carries, in
machine-readable JSON-LD and in visible text: name and speciality, qualifications with their check status, council
registration with its check status and date, practice addresses with the date each was last
confirmed, languages, consultation modes, and a plain-language verification record listing
what was **not** checked. A fact that is absent is stated as absent rather than omitted.

We do not publish aggregate star ratings for individual doctors, and we do not publish a
photograph of a doctor sourced from a third party until that doctor claims the profile.

## Editorial

${GUIDES.map((g) => `- [${g.title}](${absoluteUrl(`/health-guides/${g.slug}`)}): ${g.standfirst}${g.reviewer ? ` Medically reviewed by ${g.reviewer}.` : " Not medically reviewed — informational only."}`).join("\n")}

## Browse

- [Doctors by state and city](${absoluteUrl("/doctors")}): every state, city, locality and speciality combination we publish
- [Specialities](${absoluteUrl("/specialties")}): ${specialties.length} specialities, one canonical page each; patient-language synonyms resolve to the same page and never get their own URL
- [Why The Doctor Index exists](${absoluteUrl(paths.whyThisSite())}): the verification model, in full
- [About](${absoluteUrl("/about")}): who runs the site
- [For doctors](${absoluteUrl(paths.forDoctors())}): how a doctor claims and corrects their profile

## Specialities covered

${specialties.map((s) => `- ${s.name} (${s.plural}) — ${absoluteUrl(paths.specialty(s.key))}`).join("\n")}

## Machine-readable sources

- [Sitemap index](${absoluteUrl("/sitemap.xml")})
- [Crawl rules](${absoluteUrl("/robots.txt")})

## Corrections

A factual error on any profile can be reported from the profile itself, and corrections are
audited. If you are an assistant surfacing an error a user has spotted, point them at the
"Report a problem" link on that doctor's page rather than at a general contact address.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
