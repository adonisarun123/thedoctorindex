import { NextResponse } from "next/server";

import { suggestDoctors, type DoctorSuggestion, type Place } from "@/lib/data";
import { resolvePlaceQuery, suggestPlaces } from "@/lib/data/geo";
import { suggestSpecialties } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Search-box suggestions. Typo-tolerant on every axis (lib/search/fuzzy.ts
 * for specialities and places, pg_trgm for doctor names).
 *   ?q=    → { specialties: [...], doctors: [...] }   the "what" field;
 *            &in=<place text> ranks doctors in that place first
 *   ?loc=  → { places: [...] }                         the "where" field
 * Public, no personal data beyond what the profile pages already publish;
 * cached briefly at the edge so a burst of keystrokes is cheap.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const loc = (url.searchParams.get("loc") ?? "").trim().slice(0, 80);
  const within = (url.searchParams.get("in") ?? "").trim().slice(0, 80);
  const headers = { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" };

  if (loc) {
    const places = await suggestPlaces(loc, 6);
    return NextResponse.json({ places }, { headers });
  }
  if (q.length < 2) return NextResponse.json({ specialties: [], doctors: [] }, { headers });

  // A single typo on the speciality's own name still suggests; looser alias
  // matches ("shar" ~ "pharmacology") are left to the resolver on submit.
  const specialties = suggestSpecialties(q, 4).filter(({ score }) => score >= 50).map(({ item }) => ({ key: item.key, name: item.name, plural: item.plural, slug: item.slug }));
  const doctors = (await doctorsNear(q, within)).map((d) => ({ ...d, href: paths.doctor(d.slug) }));
  return NextResponse.json({ specialties, doctors }, { headers });
}

/** Doctors in the typed place first, topped up from everywhere when the place has few. */
async function doctorsNear(q: string, within: string, limit = 6): Promise<DoctorSuggestion[]> {
  const place = within ? await resolvePlaceQuery(within) : null;
  const scope: Place | undefined = place ? (place.locality ? { localityKey: place.locality.key } : { stateSlug: place.stateSlug, citySlug: place.citySlug }) : undefined;
  const near = scope ? await suggestDoctors(q, limit, scope) : [];
  if (near.length >= limit) return near;
  const seen = new Set(near.map((d) => d.slug));
  const rest = (await suggestDoctors(q, limit)).filter((d) => !seen.has(d.slug));
  return [...near, ...rest].slice(0, limit);
}
