import { NextResponse, type NextRequest } from "next/server";

import { countsByCity } from "@/lib/data";
import { getGeo, resolvePlaceQuery } from "@/lib/data/geo";

/**
 * GET /api/region — the visitor's likely city, from Vercel's IP geolocation
 * headers, so the search box can pre-fill it.
 *
 * This only ever feeds a default into the client-side search UI. It must
 * never change what a page renders, redirect, or vary a canonical: crawlers
 * fetch from outside India, and a page whose content depended on the IP would
 * show them something different from what patients see. That is why it is an
 * uncached JSON endpoint and not something read during page render.
 *
 * IP city in India is a guess — mobile carriers often egress through another
 * metro — so only a city with published supply is returned, and the UI shows
 * it as an editable value that the visitor's own choice always overrides.
 */
const MIN_SUPPLY = 5;
/** A lat/long fix further than this from every covered city is not "in" any of them. */
const MAX_KM = 45;

function header(req: NextRequest, name: string): string {
  const v = req.headers.get(name);
  if (!v) return "";
  try {
    return decodeURIComponent(v).trim();
  } catch {
    return v.trim();
  }
}

function km(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat);
  const dLng = r(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export async function GET(req: NextRequest) {
  const none = () => NextResponse.json({ city: null }, { headers: { "Cache-Control": "private, no-store" } });
  const country = header(req, "x-vercel-ip-country");
  if (country && country !== "IN") return none();

  const [geo, supply] = await Promise.all([getGeo(), countsByCity(undefined, "published")]);
  const open = new Set(supply.filter((c) => c.n >= MIN_SUPPLY).map((c) => `${c.stateSlug}/${c.citySlug}`));
  const answer = (stateSlug: string, citySlug: string) => {
    const c = geo.city(stateSlug, citySlug);
    return c && open.has(`${stateSlug}/${citySlug}`)
      ? NextResponse.json({ city: c.name, source: "ip" }, { headers: { "Cache-Control": "private, no-store" } })
      : null;
  };

  // 1. The city name, when it is one we cover.
  const cityName = header(req, "x-vercel-ip-city");
  if (cityName) {
    const hit = await resolvePlaceQuery(cityName);
    if (hit && !hit.locality) {
      const r = answer(hit.stateSlug, hit.citySlug);
      if (r) return r;
    }
  }

  // 2. Nearest covered city to the lat/long fix (handles "Bangalore" vs
  //    "Bengaluru", suburbs reported under their own name, and so on).
  const lat = Number(header(req, "x-vercel-ip-latitude"));
  const lng = Number(header(req, "x-vercel-ip-longitude"));
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    const centres = new Map<string, { lat: number; lng: number; n: number; stateSlug: string; citySlug: string }>();
    for (const l of geo.localities) {
      if (l.lat == null || l.lng == null) continue;
      const k = `${l.stateSlug}/${l.citySlug}`;
      if (!open.has(k)) continue;
      const c = centres.get(k) ?? { lat: 0, lng: 0, n: 0, stateSlug: l.stateSlug, citySlug: l.citySlug };
      c.lat += l.lat;
      c.lng += l.lng;
      c.n++;
      centres.set(k, c);
    }
    let best: { d: number; stateSlug: string; citySlug: string } | null = null;
    for (const c of centres.values()) {
      const d = km(lat, lng, c.lat / c.n, c.lng / c.n);
      if (!best || d < best.d) best = { d, stateSlug: c.stateSlug, citySlug: c.citySlug };
    }
    if (best && best.d <= MAX_KM) {
      const r = answer(best.stateSlug, best.citySlug);
      if (r) return r;
    }
  }

  return none();
}
