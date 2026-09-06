import { coreTokens, phoneDigits, similarity } from "@/lib/enrich/names";

/**
 * Google Places (New) matcher.
 *
 * One Text Search per doctor finds the listing for the doctor or their clinic.
 * What we keep is what Google's policy lets a site keep: the place ID (may be
 * stored indefinitely) plus the listing name, address, phone and website used
 * to explain the match to staff. Ratings and reviews are never stored; the
 * profile page reads them live (lib/enrich/google-live.ts) and links to Google.
 */

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = ["places.id", "places.displayName", "places.formattedAddress", "places.nationalPhoneNumber", "places.internationalPhoneNumber", "places.websiteUri", "places.googleMapsUri", "places.types", "places.location"].join(",");

const HEALTH_TYPES = new Set(["doctor", "hospital", "health", "dentist", "physiotherapist", "medical_lab", "pharmacy", "dental_clinic", "medical_clinic", "wellness_center", "chiropractor", "skin_care_clinic", "spa"]);

export interface PlaceHit {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  mapsUri: string;
  types: string[];
  lat: number | null;
  lng: number | null;
}

export interface ProfileForGoogle {
  doctorName: string;
  facilityName: string | null;
  address: string | null;
  postalCode: string | null;
  phone: string | null;
  localityName: string | null;
  cityName: string;
  stateName: string;
  lat: number | null;
  lng: number | null;
}

export interface GoogleOutcome {
  status: "matched" | "no_match";
  query: string;
  best: PlaceHit | null;
  score: number;
  addressMatch: boolean;
  reasons: string[];
}

/** The text query: the clinic when we know it, else the doctor, always anchored to the place. */
export function buildQuery(p: ProfileForGoogle): string {
  const who = p.facilityName && !/not stated|unknown/i.test(p.facilityName) ? `${p.facilityName} Dr ${p.doctorName}` : `Dr ${p.doctorName}`;
  const where = [p.localityName && p.localityName !== p.cityName ? p.localityName : null, p.cityName, p.stateName].filter(Boolean).join(", ");
  return `${who}, ${where}`.replace(/\s+/g, " ").trim();
}

/**
 * Score a hit against the profile. 100 = name, place and phone all agree.
 * A match needs the name to agree and at least one of place or phone.
 */
export function scoreHit(hit: PlaceHit, p: ProfileForGoogle): { score: number; addressMatch: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const hitName = hit.name.toLowerCase();
  const docCore = coreTokens(p.doctorName);
  const docCovered = docCore.length > 0 && docCore.filter((t) => hitName.includes(t)).length >= Math.min(2, docCore.length);
  const facSim = p.facilityName ? similarity(hit.name, p.facilityName) : 0;
  const docSim = similarity(hit.name, `Dr ${p.doctorName}`);
  const nameOk = docCovered || facSim >= 0.6 || docSim >= 0.6;
  if (nameOk) {
    score += 50;
    reasons.push(docCovered ? "doctor name in listing" : facSim >= 0.6 ? `clinic name similar (${facSim.toFixed(2)})` : `name similar (${docSim.toFixed(2)})`);
  }
  const addr = hit.address.toLowerCase();
  const localityOk = Boolean(p.localityName && p.localityName !== p.cityName && addr.includes(p.localityName.toLowerCase()));
  const cityOk = addr.includes(p.cityName.toLowerCase());
  const pinOk = Boolean(p.postalCode && addr.includes(p.postalCode));
  const addressMatch = localityOk || pinOk || (cityOk && Boolean(p.address) && similarity(streetPart(hit.address, p), streetPart(p.address!, p)) >= 0.45);
  if (addressMatch) {
    score += 25;
    reasons.push(localityOk ? "locality in address" : pinOk ? "pincode in address" : "address similar");
  } else if (cityOk) {
    score += 10;
    reasons.push("city in address");
  }
  const pp = phoneDigits(p.phone);
  const hp = phoneDigits(hit.phone);
  if (pp && hp && pp.length >= 10 && pp === hp) {
    score += 25;
    reasons.push("phone matches");
  }
  if (hit.types.some((t) => HEALTH_TYPES.has(t))) {
    score += 10;
    reasons.push("health listing");
  }
  if (p.lat !== null && p.lng !== null && hit.lat !== null && hit.lng !== null) {
    const km = haversineKm(p.lat, p.lng, hit.lat, hit.lng);
    if (km <= 3) {
      score += 5;
      reasons.push(`${km.toFixed(1)} km from practice`);
    } else if (km > 40) {
      score -= 30;
      reasons.push(`${km.toFixed(0)} km away`);
    }
  }
  return { score, addressMatch, reasons };
}

export const MATCH_THRESHOLD = 75;

export function pickBest(hits: PlaceHit[], p: ProfileForGoogle, query: string): GoogleOutcome {
  let best: GoogleOutcome = { status: "no_match", query, best: null, score: 0, addressMatch: false, reasons: [] };
  for (const hit of hits) {
    const s = scoreHit(hit, p);
    if (s.score > best.score) best = { status: s.score >= MATCH_THRESHOLD ? "matched" : "no_match", query, best: hit, score: s.score, addressMatch: s.addressMatch, reasons: s.reasons };
  }
  if (best.status === "no_match") best = { ...best, best: best.score >= 50 ? best.best : null };
  return best;
}

/** The address with city, state, country and pincode removed, so only the street-level part is compared. */
function streetPart(addr: string, p: ProfileForGoogle): string {
  let a = addr.toLowerCase();
  for (const w of [p.cityName, p.stateName, p.localityName ?? "", "india", p.postalCode ?? ""]) if (w) a = a.split(w.toLowerCase()).join(" ");
  return a.replace(/\b\d{6}\b/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function parsePlaces(body: unknown): PlaceHit[] {
  const places = (body as { places?: Array<Record<string, unknown>> })?.places ?? [];
  return places
    .map((pl) => {
      const loc = pl.location as { latitude?: number; longitude?: number } | undefined;
      return {
        id: String(pl.id ?? ""),
        name: String((pl.displayName as { text?: string } | undefined)?.text ?? ""),
        address: String(pl.formattedAddress ?? ""),
        phone: (pl.nationalPhoneNumber as string | undefined) ?? (pl.internationalPhoneNumber as string | undefined) ?? null,
        website: (pl.websiteUri as string | undefined) ?? null,
        mapsUri: String(pl.googleMapsUri ?? ""),
        types: Array.isArray(pl.types) ? (pl.types as string[]) : [],
        lat: typeof loc?.latitude === "number" ? loc.latitude : null,
        lng: typeof loc?.longitude === "number" ? loc.longitude : null,
      };
    })
    .filter((h) => h.id && h.name);
}

export class GoogleClient {
  requests = 0;
  constructor(private readonly apiKey: string, private readonly fetchImpl: typeof fetch = fetch) {}

  async searchText(query: string, bias?: { lat: number; lng: number }): Promise<PlaceHit[]> {
    this.requests++;
    const body: Record<string, unknown> = { textQuery: query, regionCode: "IN", languageCode: "en", maxResultCount: 5 };
    if (bias) body.locationBias = { circle: { center: { latitude: bias.lat, longitude: bias.lng }, radius: 15000 } };
    const res = await this.fetchImpl(SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": this.apiKey, "X-Goog-FieldMask": FIELD_MASK },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`places searchText ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return parsePlaces(await res.json());
  }

  async match(p: ProfileForGoogle): Promise<GoogleOutcome> {
    const query = buildQuery(p);
    const hits = await this.searchText(query, p.lat !== null && p.lng !== null ? { lat: p.lat, lng: p.lng } : undefined);
    return pickBest(hits, p, query);
  }
}
