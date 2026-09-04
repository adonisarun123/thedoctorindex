import "server-only";

import { desc, eq, sql } from "drizzle-orm";

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
  let n = 0;
  for (const sp of specialties) {
    const [{ c }] = (await db.execute(sql`
      select count(distinct d.id)::int as c from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id
      where d.specialty_key = ${sp.key} and d.status = 'published' and d.quality_score >= ${env.gates.profileQuality}
        and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${env.freshness.deindexAfterDays}::int)
    `)) as unknown as Array<{ c: number }>;
    await upsert({ kind: "national", specialtyKey: sp.key, localityKey: null, path: `/specialties/${sp.key}`, count: Number(c), gate: env.gates.nationalSpecialty });
    await upsert({ kind: "city", specialtyKey: sp.key, localityKey: null, path: `/doctors/${env.defaultStateSlug}/${env.defaultCitySlug}/${sp.slug}`, count: Number(c), gate: env.gates.citySpecialty });
    n += 2;
    for (const loc of localities) {
      const [{ c: lc }] = (await db.execute(sql`
        select count(distinct d.id)::int as c from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id
        where d.specialty_key = ${sp.key} and d.status = 'published' and d.quality_score >= ${env.gates.profileQuality} and f.locality_key = ${loc.key}
          and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${env.freshness.deindexAfterDays}::int)
      `)) as unknown as Array<{ c: number }>;
      await upsert({ kind: "locality", specialtyKey: sp.key, localityKey: loc.key, path: `/doctors/${loc.stateSlug}/${loc.citySlug}/${loc.key}/${sp.slug}`, count: Number(lc), gate: env.gates.localitySpecialty });
      n++;
    }
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
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "seo_route.override", entityType: "seo_route", entityId: path, before: { override: before?.override ?? null }, after: { override }, reason: note });
}

/** Effective indexability for a listing path, honouring staff overrides. */
export async function routeOverride(path: string): Promise<"force_index" | "force_noindex" | null> {
  if (!process.env.DATABASE_URL) return null;
  const [r] = await getDb().select({ override: s.seoRoutes.override }).from(s.seoRoutes).where(eq(s.seoRoutes.path, path)).limit(1);
  return r?.override ?? null;
}

export async function listSeoRoutes() {
  return getDb().query.seoRoutes.findMany({ with: { specialty: true, locality: true }, orderBy: [s.seoRoutes.kind, desc(s.seoRoutes.indexableCount)] });
}
