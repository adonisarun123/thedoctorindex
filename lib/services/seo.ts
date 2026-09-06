import "server-only";

import { desc, eq, isNotNull, sql } from "drizzle-orm";

import { env } from "@/lib/env";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";

/**
 * SEO route allowlist (plan §11.4). Recomputed from live supply; staff can
 * force a route in or out of the index with a recorded reason. The public
 * routes still apply the gate functions directly — this table is the
 * operational view and the override source.
 */
export async function recomputeSeoRoutes(): Promise<number> {
  const db = getDb();
  const specialties = await db.select().from(s.specialties).where(eq(s.specialties.active, true));
  const localities = await db.select().from(s.localities).where(eq(s.localities.active, true));
  const bySlug = new Map(specialties.map((sp) => [sp.key, sp]));
  const locByKey = new Map(localities.map((l) => [l.key, l]));

  // One GROUP BY over the indexable predicate gives every (locality, speciality)
  // count; city and national counts roll up from it in memory.
  const rows = (await db.execute(sql`
    select f.locality_key as lk, d.specialty_key as sk, count(distinct d.id)::int as c
    from doctors d
    join doctor_practices p on p.doctor_id = d.id and p.active
    join facilities f on f.id = p.facility_id
    where d.status = 'published' and d.quality_score >= ${env.gates.profileQuality}
      and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${env.freshness.deindexAfterDays}::int)
    group by f.locality_key, d.specialty_key
  `)) as unknown as Array<{ lk: string; sk: string; c: number }>;

  const national = new Map<string, number>();
  const city = new Map<string, number>();
  let n = 0;
  for (const r of rows) {
    const loc = locByKey.get(r.lk);
    const sp = bySlug.get(r.sk);
    if (!loc || !sp) continue;
    national.set(r.sk, (national.get(r.sk) ?? 0) + Number(r.c));
    const ck = `${loc.stateSlug}/${loc.citySlug}/${r.sk}`;
    city.set(ck, (city.get(ck) ?? 0) + Number(r.c));
    if (Number(r.c) >= 1) {
      await upsert({ kind: "locality", specialtyKey: sp.key, localityKey: loc.key, path: `/doctors/${loc.stateSlug}/${loc.citySlug}/${loc.slug}/${sp.slug}`, count: Number(r.c), gate: env.gates.localitySpecialty });
      n++;
    }
  }
  for (const sp of specialties) {
    await upsert({ kind: "national", specialtyKey: sp.key, localityKey: null, path: `/specialties/${sp.key}`, count: national.get(sp.key) ?? 0, gate: env.gates.nationalSpecialty });
    n++;
  }
  for (const [ck, c] of city) {
    const [stateSlug, citySlug, sk] = ck.split("/");
    const sp = bySlug.get(sk);
    if (!sp) continue;
    await upsert({ kind: "city", specialtyKey: sp.key, localityKey: null, path: `/doctors/${stateSlug}/${citySlug}/${sp.slug}`, count: c, gate: env.gates.citySpecialty });
    n++;
  }
  return n;
}

async function upsert(r: { kind: "national" | "city" | "locality"; specialtyKey: string; localityKey: string | null; path: string; count: number; gate: number }) {
  await getDb()
    .insert(s.seoRoutes)
    .values({ kind: r.kind, specialtyKey: r.specialtyKey, localityKey: r.localityKey, path: r.path, indexableCount: r.count, computedIndexable: r.count >= r.gate })
    .onConflictDoUpdate({ target: s.seoRoutes.path, set: { indexableCount: r.count, computedIndexable: r.count >= r.gate, updatedAt: new Date() } });
}

export async function setSeoOverride(path: string, override: "force_index" | "force_noindex" | null, staffUserId: string, note?: string) {
  const db = getDb();
  const [before] = await db.select().from(s.seoRoutes).where(eq(s.seoRoutes.path, path)).limit(1);
  await db.update(s.seoRoutes).set({ override, note: note ?? null, updatedAt: new Date() }).where(eq(s.seoRoutes.path, path));
  overrideCache = null;
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "seo_route.override", entityType: "seo_route", entityId: path, before: { override: before?.override ?? null }, after: { override }, reason: note });
}

/** Effective indexability for a listing path, honouring staff overrides. */
let overrideCache: { map: Map<string, "force_index" | "force_noindex">; at: number } | null = null;

/**
 * All staff overrides, cached for a minute. Overrides are rare (tens of rows)
 * while the sitemap asks about thousands of paths, so one query serves all.
 */
export async function routeOverrides(): Promise<Map<string, "force_index" | "force_noindex">> {
  if (!process.env.DATABASE_URL) return new Map();
  if (overrideCache && Date.now() - overrideCache.at < 60_000) return overrideCache.map;
  const rows = await getDb().select({ path: s.seoRoutes.path, override: s.seoRoutes.override }).from(s.seoRoutes).where(isNotNull(s.seoRoutes.override));
  const map = new Map<string, "force_index" | "force_noindex">();
  for (const r of rows) if (r.override) map.set(r.path, r.override);
  overrideCache = { map, at: Date.now() };
  return map;
}

export function invalidateOverrides(): void {
  overrideCache = null;
}

export async function routeOverride(path: string): Promise<"force_index" | "force_noindex" | null> {
  return (await routeOverrides()).get(path) ?? null;
}

export async function listSeoRoutes() {
  return getDb().query.seoRoutes.findMany({ with: { specialty: true, locality: true }, orderBy: [s.seoRoutes.kind, desc(s.seoRoutes.indexableCount)] });
}
