import { NextResponse } from "next/server";

import { getGeo } from "@/lib/data/geo";

export const dynamic = "force-dynamic";

/**
 * Geography for pickers: no params → states; ?state= → cities in it;
 * ?state=&city= → localities in it. Public, cacheable, no personal data.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const city = url.searchParams.get("city");
  const geo = await getGeo();
  const headers = { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
  if (state && city) {
    return NextResponse.json(geo.localitiesIn(city).filter((l) => l.stateSlug === state).map((l) => ({ key: l.key, slug: l.slug, name: l.name })), { headers });
  }
  if (state) return NextResponse.json(geo.citiesIn(state).map((c) => ({ slug: c.slug, name: c.name })), { headers });
  return NextResponse.json(geo.states, { headers });
}
