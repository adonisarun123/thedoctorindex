import "server-only";

import { and, asc, desc, eq, ilike, isNotNull, isNull, lt, or, sql } from "drizzle-orm";

import { env } from "@/lib/env";
import { dbSource } from "@/lib/data/db-source";
import { getDb } from "@/lib/db/client";
import { isCitywideLocality } from "@/lib/geo-names";
import * as s from "@/lib/db/schema";
import { buildSeoRoutes } from "@/lib/seo/routes";
import { audit } from "@/lib/services/audit";

/**
 * SEO route allowlist (plan §11.4). Recomputed from live supply; staff can
 * force a route in or out of the index with a recorded reason. The public
 * routes still apply the gate functions directly — this table is the
 * operational view and the override source.
 *
 * The counts come from the same queries, over the same "eligible" pool, that
 * the sitemap and the listing pages use (lib/seo/sitemap.ts), so a route is
 * "index" here exactly when the page carries index,follow. The table is read
 * straight from the database, not through the hourly data cache, because a
 * recompute is asked for precisely when the supply has just changed.
 */
export async function recomputeSeoRoutes(): Promise<{ routes: number; indexable: number; removed: number }> {
  const db = getDb();
  const [specialties, localities, national, city, locality] = await Promise.all([
    db.select({ key: s.specialties.key, slug: s.specialties.slug }).from(s.specialties).where(eq(s.specialties.active, true)),
    db.select({ key: s.localities.key, slug: s.localities.slug, name: s.localities.name, city: s.localities.city, citySlug: s.localities.citySlug, stateSlug: s.localities.stateSlug }).from(s.localities).where(eq(s.localities.active, true)),
    dbSource.countsBySpecialty(undefined, "eligible"),
    dbSource.countsByCitySpecialty("eligible"),
    dbSource.countsByLocalityAll("eligible"),
  ]);

  // A city-wide "locality" (Indore in Indore) has no page of its own — its URL
  // 301s to the city listing — so it gets no route either.
  const placeLocalities = localities.filter((l) => !isCitywideLocality(l));
  const rows = buildSeoRoutes({ national, city, locality }, specialties, placeLocalities, {
    national: env.gates.nationalSpecialty,
    city: env.gates.citySpecialty,
    locality: env.gates.localitySpecialty,
  });

  const now = new Date();
  for (let i = 0; i < rows.length; i += UPSERT_BATCH) {
    const batch = rows.slice(i, i + UPSERT_BATCH);
    await db
      .insert(s.seoRoutes)
      .values(batch.map((r) => ({ kind: r.kind, specialtyKey: r.specialtyKey, localityKey: r.localityKey, path: r.path, indexableCount: r.indexableCount, computedIndexable: r.computedIndexable, updatedAt: now })))
      .onConflictDoUpdate({
        target: s.seoRoutes.path,
        set: {
          kind: sql`excluded.kind`,
          specialtyKey: sql`excluded.specialty_key`,
          localityKey: sql`excluded.locality_key`,
          indexableCount: sql`excluded.indexable_count`,
          computedIndexable: sql`excluded.computed_indexable`,
          updatedAt: now,
        },
      });
  }

  // A route the supply no longer produces (a locality renamed, a speciality
  // retired, a city emptied) leaves the table — unless staff recorded an
  // override on it, which is a decision to keep visible until they clear it.
  const removed = await db
    .delete(s.seoRoutes)
    .where(and(lt(s.seoRoutes.updatedAt, now), isNull(s.seoRoutes.override)))
    .returning({ path: s.seoRoutes.path });

  overrideCache = null;
  return { routes: rows.length, indexable: rows.filter((r) => r.computedIndexable).length, removed: removed.length };
}

/** Rows per INSERT. 12,000 routes in 24 statements rather than 12,000. */
const UPSERT_BATCH = 500;

export async function setSeoOverride(path: string, override: "force_index" | "force_noindex" | null, staffUserId: string, note?: string) {
  const db = getDb();
  const [before] = await db.select().from(s.seoRoutes).where(eq(s.seoRoutes.path, path)).limit(1);
  await db.update(s.seoRoutes).set({ override, note: note ?? null, updatedAt: new Date() }).where(eq(s.seoRoutes.path, path));
  overrideCache = null;
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "seo_route.override", entityType: "seo_route", entityId: path, before: { override: before?.override ?? null }, after: { override }, reason: note });
}

/** Effective indexability for a listing path, honouring staff overrides. */
let overrideCache: { map: Map<string, "force_index" | "force_noindex">; at: number; degraded?: boolean } | null = null;

/**
 * All staff overrides, cached for a minute. Overrides are rare (tens of rows)
 * while the sitemap asks about thousands of paths, so one query serves all.
 */
export async function routeOverrides(): Promise<Map<string, "force_index" | "force_noindex">> {
  if (!process.env.DATABASE_URL) return new Map();
  if (overrideCache && Date.now() - overrideCache.at < (overrideCache.degraded ? 10_000 : 60_000)) return overrideCache.map;
  try {
    const rows = await getDb().select({ path: s.seoRoutes.path, override: s.seoRoutes.override }).from(s.seoRoutes).where(isNotNull(s.seoRoutes.override));
    const map = new Map<string, "force_index" | "force_noindex">();
    for (const r of rows) if (r.override) map.set(r.path, r.override);
    overrideCache = { map, at: Date.now() };
    return map;
  } catch (err) {
    // A failure is cached too, briefly.
    //
    // Without this, an unreachable database turns the one query this function
    // promises into one failed query per asking path. The sitemap asks about
    // thousands, sequentially, so a database blip stopped being a slow sitemap
    // and became a build that times out and fails. Overrides are an
    // enhancement — no override is the correct answer to fall back to — so the
    // empty map is served and retried in ten seconds rather than immediately.
    console.warn("[seo] route overrides unavailable, continuing without them:", err instanceof Error ? err.message : err);
    overrideCache = { map: new Map(), at: Date.now(), degraded: true };
    return overrideCache.map;
  }
}

export function invalidateOverrides(): void {
  overrideCache = null;
}

export async function routeOverride(path: string): Promise<"force_index" | "force_noindex" | null> {
  return (await routeOverrides()).get(path) ?? null;
}

export interface SeoRouteFilter {
  kind?: "national" | "city" | "locality";
  /** Matched against the path and the locality name, case-insensitively. */
  q?: string;
  /** Effective decision after overrides. */
  status?: "index" | "noindex" | "overridden";
  page?: number;
  pageSize?: number;
}

export interface SeoRouteSummary {
  total: number;
  indexable: number;
  overridden: number;
  byKind: Record<"national" | "city" | "locality", { total: number; indexable: number }>;
  states: number;
  cities: number;
  updatedAt: Date | null;
}

const EFFECTIVE = sql<boolean>`case ${s.seoRoutes.override} when 'force_index' then true when 'force_noindex' then false else ${s.seoRoutes.computedIndexable} end`;

function routeWhere(f: SeoRouteFilter) {
  const parts = [];
  if (f.kind) parts.push(eq(s.seoRoutes.kind, f.kind));
  if (f.q) {
    const like = `%${f.q.trim().replace(/[%_]/g, "\\$&")}%`;
    parts.push(or(ilike(s.seoRoutes.path, like), sql`exists (select 1 from localities l where l.key = ${s.seoRoutes.localityKey} and l.name ilike ${like})`));
  }
  if (f.status === "index") parts.push(sql`${EFFECTIVE}`);
  if (f.status === "noindex") parts.push(sql`not ${EFFECTIVE}`);
  if (f.status === "overridden") parts.push(isNotNull(s.seoRoutes.override));
  return parts.length ? and(...parts) : undefined;
}

export const SEO_ROUTES_PAGE = 100;

/**
 * One page of the allowlist. The table holds every listing route on the site
 * (12,000+ once it counts the nationwide supply), so it is filtered and paged
 * rather than rendered whole.
 */
export async function listSeoRoutes(f: SeoRouteFilter = {}) {
  const pageSize = f.pageSize ?? SEO_ROUTES_PAGE;
  const page = Math.max(1, f.page ?? 1);
  const where = routeWhere(f);
  const db = getDb();
  const [rows, [{ n }]] = await Promise.all([
    db.query.seoRoutes.findMany({
      where,
      with: { specialty: true, locality: true },
      orderBy: [asc(s.seoRoutes.kind), desc(s.seoRoutes.indexableCount), asc(s.seoRoutes.path)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db.select({ n: sql<number>`count(*)::int` }).from(s.seoRoutes).where(where),
  ]);
  return { rows, total: Number(n), page, pageSize, pages: Math.max(1, Math.ceil(Number(n) / pageSize)) };
}

export async function seoRouteSummary(): Promise<SeoRouteSummary> {
  const db = getDb();
  const [kinds, [geo]] = await Promise.all([
    db
      .select({ kind: s.seoRoutes.kind, total: sql<number>`count(*)::int`, indexable: sql<number>`count(*) filter (where ${EFFECTIVE})::int`, overridden: sql<number>`count(*) filter (where ${s.seoRoutes.override} is not null)::int`, updatedAt: sql<Date | null>`max(${s.seoRoutes.updatedAt})` })
      .from(s.seoRoutes)
      .groupBy(s.seoRoutes.kind),
    db.execute(sql`
      select count(distinct split_part(path, '/', 3))::int as states, count(distinct split_part(path, '/', 3) || '/' || split_part(path, '/', 4))::int as cities
      from seo_routes where kind = 'city'
    `) as unknown as Promise<Array<{ states: number; cities: number }>>,
  ]);
  const byKind = { national: { total: 0, indexable: 0 }, city: { total: 0, indexable: 0 }, locality: { total: 0, indexable: 0 } };
  let total = 0;
  let indexable = 0;
  let overridden = 0;
  let updatedAt: Date | null = null;
  for (const k of kinds) {
    byKind[k.kind] = { total: Number(k.total), indexable: Number(k.indexable) };
    total += Number(k.total);
    indexable += Number(k.indexable);
    overridden += Number(k.overridden);
    if (k.updatedAt && (!updatedAt || new Date(k.updatedAt) > updatedAt)) updatedAt = new Date(k.updatedAt);
  }
  return { total, indexable, overridden, byKind, states: Number(geo?.states ?? 0), cities: Number(geo?.cities ?? 0), updatedAt };
}
