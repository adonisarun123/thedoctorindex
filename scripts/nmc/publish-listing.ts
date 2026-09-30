import { eq } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import { todayIso } from "../../lib/db/dates";
import * as s from "../../lib/db/schema";
import type { PlaceHit } from "../../lib/enrich/google";
import { STATE_NAMES } from "../../lib/nmc/classify";
import { parseIndianAddress } from "../../lib/nmc/research-match";
import { recomputeQuality } from "../../lib/services/doctors";
import { ensureLocality } from "../../lib/services/places";

/**
 * The one way a register-built draft becomes a published profile: a practice
 * the research found, written as a facility + practice, the evidence on
 * doctor_enrichment and audit_logs, the outcome on nmc_register, then
 * status → published and a quality recompute. Shared by every research
 * provider (Places, Serper, OpenStreetMap) so the writes are identical.
 */

export interface Draft {
  id: string;
  name: string;
  slug: string;
  state_slug: string;
  source_record_id: number;
}

export interface Placement {
  /** Where the evidence came from, for geocode_source / audit. */
  evidence: "google-places-text-search" | "serper-local-pack" | "serper-organic" | "openstreetmap";
  query: string;
  facilityName: string;
  /** Street-level address when known; otherwise the locality/city text the source gave. */
  address: string;
  postalCode: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  /** City name when the source gives one directly (organic / OSM addr:city). */
  city: string | null;
  locality: string | null;
  placeId: string | null;
  mapsUri: string | null;
  urls: string[];
  reasons: string[];
  /** Match confidence written to geocode_confidence. */
  confidence: string;
}

/** "Dr. X - Free Consultation for Piles | Best Surgeon in Bangalore" → "Dr. X": a listing's marketing tail is not a facility name. */
export function cleanListingName(name: string): string {
  let n = name.replace(/\s+/g, " ").trim().split(/\s+[-|–—]\s+|\s\|\s|\s+I\s+/)[0].trim();
  const comma = n.indexOf(", ");
  if (comma > 3 && /^(consultant|senior|specialist|surgeon|doctor|physician|md|mbbs|ms|dnb|best|top|the best|clinic|expert|leading|famous|renowned)\b/i.test(n.slice(comma + 2))) n = n.slice(0, comma).trim();
  n = n.replace(/\s*\((?:best|top|leading|famous|renowned)[^)]*\)\s*$/i, "").trim();
  return (n.length >= 4 ? n : name).slice(0, 80);
}

export function placementFromHit(hit: PlaceHit, stateName: string, query: string, evidence: Placement["evidence"]): Placement {
  const parsed = parseIndianAddress(hit.address, stateName);
  return { evidence, query, facilityName: cleanListingName(hit.name), address: parsed.street, postalCode: parsed.postalCode, lat: hit.lat, lng: hit.lng, phone: hit.phone, website: hit.website, city: parsed.city, locality: parsed.area, placeId: hit.id, mapsUri: hit.mapsUri || null, urls: hit.website ? [hit.website] : [], reasons: [], confidence: hit.lat !== null ? "0.8" : "0.6" };
}

type LocalityRow = { key: string; name: string; city: string; citySlug: string; stateSlug: string; lat: string | null; lng: string | null };

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export class Placer {
  private byState = new Map<string, LocalityRow[]>();
  private loaded = false;

  async load() {
    const db = getDb();
    const locs = await db.select({ key: s.localities.key, name: s.localities.name, city: s.localities.city, citySlug: s.localities.citySlug, stateSlug: s.localities.stateSlug, lat: s.localities.lat, lng: s.localities.lng }).from(s.localities).where(eq(s.localities.active, true));
    for (const l of locs) this.byState.set(l.stateSlug, [...(this.byState.get(l.stateSlug) ?? []), l]);
    this.loaded = true;
  }

  /** The city of the nearest known locality with coordinates, within maxKm. */
  nearestCity(lat: number, lng: number, stateSlug: string, maxKm = 25): { city: string; locality: string | null; km: number } | null {
    let best: { city: string; locality: string | null; km: number } | null = null;
    for (const l of this.byState.get(stateSlug) ?? []) {
      if (!l.lat || !l.lng) continue;
      const km = haversineKm(lat, lng, Number(l.lat), Number(l.lng));
      if (km <= maxKm && (!best || km < best.km)) best = { city: l.city, locality: l.key === l.citySlug ? null : l.name, km };
    }
    return best;
  }

  /** City names known in a state (for the organic city matcher). */
  cities(stateSlug: string): string[] {
    return [...new Set((this.byState.get(stateSlug) ?? []).map((l) => l.city))];
  }

  /** Nearest known neighbourhood within 3 km of the coordinates, else the city (created when new), else null. */
  async localityFor(p: Placement, stateSlug: string): Promise<string | null> {
    if (!this.loaded) await this.load();
    const cands = this.byState.get(stateSlug) ?? [];
    if (p.lat !== null && p.lng !== null) {
      let best: { key: string; km: number } | null = null;
      for (const l of cands) {
        if (!l.lat || !l.lng || l.key === l.citySlug) continue;
        const km = haversineKm(p.lat, p.lng, Number(l.lat), Number(l.lng));
        if (km <= 3 && (!best || km < best.km)) best = { key: l.key, km };
      }
      if (best) return best.key;
    }
    const stateName = STATE_NAMES[stateSlug] ?? stateSlug;
    if (p.city) {
      // A named locality inside a known city, when the site already lists it.
      if (p.locality) {
        const hit = cands.find((l) => l.city.toLowerCase() === p.city!.toLowerCase() && l.name.toLowerCase() === p.locality!.toLowerCase());
        if (hit) return hit.key;
      }
      const loc = await ensureLocality({ state: stateName, city: p.city });
      if (!cands.some((l) => l.key === loc.key)) this.byState.set(stateSlug, [...cands, { key: loc.key, name: loc.name, city: loc.city, citySlug: loc.citySlug, stateSlug: loc.stateSlug, lat: null, lng: null }]);
      return loc.key;
    }
    return null;
  }
}

export interface PublishResult {
  ok: boolean;
  reason?: string;
}

/** Writes everything or nothing; returns ok=false (nothing written except the outcome) when the place cannot be put in a locality. */
export async function publishFromPlacement(d: Draft, p: Placement, placer: Placer): Promise<PublishResult> {
  const db = getDb();
  const today = todayIso();
  const stamp = { googleCheckedAt: new Date(), updatedAt: new Date() };
  const localityKey = await placer.localityFor(p, d.state_slug);
  if (!localityKey) {
    await db.transaction(async (tx) => {
      await tx.insert(s.doctorEnrichment).values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "no_match", googlePlaceId: p.placeId, googleName: p.facilityName, googleAddress: p.address, ...stamp }).onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "no_match", googlePlaceId: p.placeId, googleName: p.facilityName, googleAddress: p.address, ...stamp } });
      await tx.update(s.nmcRegister).set({ researchStatus: "unplaceable", researchNote: `${p.query} → "${p.facilityName}", ${p.address}: no city`, researchPlaceId: p.placeId, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
    });
    return { ok: false, reason: "unplaceable (no city)" };
  }
  await db.transaction(async (tx) => {
    const [f] = await tx
      .insert(s.facilities)
      .values({ name: p.facilityName, localityKey, address: p.address, postalCode: p.postalCode, lat: p.lat !== null ? String(p.lat) : null, lng: p.lng !== null ? String(p.lng) : null, geocodeSource: p.lat !== null ? p.evidence : null, geocodeConfidence: p.lat !== null ? p.confidence : null, phone: p.phone, website: p.website, confirmedOn: null })
      .returning({ id: s.facilities.id });
    await tx.insert(s.doctorPractices).values({ doctorId: d.id, facilityId: f.id, days: "", hours: "", feeInr: null, phone: p.phone, sort: 0 });
    await tx
      .insert(s.doctorEnrichment)
      .values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "matched", googlePlaceId: p.placeId, googleMapsUri: p.mapsUri, googleName: p.facilityName, googleAddress: p.address, googlePhone: p.phone, googleWebsite: p.website, googleAddressMatch: true, googleScore: 100, ...stamp })
      .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "matched", googlePlaceId: p.placeId, googleMapsUri: p.mapsUri, googleName: p.facilityName, googleAddress: p.address, googlePhone: p.phone, googleWebsite: p.website, googleAddressMatch: true, googleScore: 100, ...stamp } });
    await tx.update(s.doctors).set({ status: "published", publishedAt: new Date(), updatedAt: new Date(), lastVerifiedOn: today }).where(eq(s.doctors.id, d.id));
    await tx.insert(s.auditLogs).values({
      actorRole: "system",
      action: "doctor.imported_published",
      entityType: "doctor",
      entityId: d.id,
      after: { query: p.query, evidence: p.evidence, placeId: p.placeId, practice: p.facilityName, address: p.address, city: p.city, phone: p.phone, website: p.website, localityKey, urls: p.urls, reasons: p.reasons },
      reason: `Published from the NMC register import after research placed the doctor at a practice (${p.evidence}; scripts/nmc). Practice, address and fee remain unconfirmed by the doctor.`,
    });
    await tx.update(s.nmcRegister).set({ researchStatus: "matched", researchNote: `${p.query} → "${p.facilityName}", ${p.address} [${p.evidence}]`, researchPlaceId: p.placeId, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
  });
  await recomputeQuality(d.id);
  return { ok: true };
}

/** Record a non-match so the draft is not researched again by this provider. */
export async function recordOutcome(d: Draft, status: string, note: string, attemptsBump = false): Promise<void> {
  const db = getDb();
  const stamp = { googleCheckedAt: new Date(), updatedAt: new Date() };
  await db.transaction(async (tx) => {
    await tx.insert(s.doctorEnrichment).values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "no_match", ...stamp }).onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "no_match", googleName: null, googleAddress: null, ...stamp } });
    await tx.update(s.nmcRegister).set({ researchStatus: status, researchNote: note.slice(0, 500), researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
  });
  void attemptsBump;
}
