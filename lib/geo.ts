import type { DoctorView } from "@/lib/types";

/**
 * "Near me" support. The visitor's position arrives as a `near=lat,lng`
 * query parameter that the browser adds after explicit consent (see
 * components/NearMe.tsx); it is rounded to ~100 m before it leaves the
 * device and is never stored server-side. Distances are great-circle
 * (haversine) to the nearest practice — road distance needs a maps provider.
 */
export interface Point {
  lat: number;
  lng: number;
}

export function parseNear(v: string | string[] | undefined): Point | null {
  const raw = Array.isArray(v) ? v[0] : v;
  if (!raw) return null;
  const [a, b] = raw.split(",").map(Number);
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 90 || Math.abs(b) > 180) return null;
  return { lat: a, lng: b };
}

export function haversineKm(a: Point, b: Point): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Distance from `from` to the doctor's nearest practice, or null when no practice has coordinates. */
export function nearestKm(d: DoctorView, from: Point): { km: number; practiceIndex: number; approximate: boolean } | null {
  let best: { km: number; practiceIndex: number; approximate: boolean } | null = null;
  d.practices.forEach((p, i) => {
    if (p.lat === undefined || p.lng === undefined) return;
    const km = haversineKm(from, { lat: p.lat, lng: p.lng });
    if (!best || km < best.km) best = { km, practiceIndex: i, approximate: p.geoSource !== "facility" };
  });
  return best;
}

export function sortByDistance(doctors: DoctorView[], from: Point): DoctorView[] {
  return [...doctors]
    .map((d) => ({ d, km: nearestKm(d, from)?.km ?? Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.km - b.km || a.d.name.localeCompare(b.d.name))
    .map((x) => x.d);
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.max(1, Math.round(km * 10)) * 100} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
