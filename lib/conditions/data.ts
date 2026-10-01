import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import type { ConditionDraft, ConditionSummary, DraftSection, DraftSource } from "@/lib/conditions/types";
import { DATA_CACHE_TAG } from "@/lib/data/cache-tag";
import { getDb, hasDatabase } from "@/lib/db/client";
import { databaseReadyForBuild, isBuildPhase } from "@/lib/db/readiness";
import { conditions } from "@/lib/db/schema";
import type { SpecialtyKey } from "@/lib/types";

/**
 * Reads for the condition library. Same contract as lib/data: no database
 * (seed builds, previews) means an empty library rather than an error, and a
 * build against an unreachable database prerenders empty and regenerates.
 */

const CACHE_SECONDS = 3600;
const SHAPE = "2026-10-01-conditions-v1";

async function available(): Promise<boolean> {
  if (!hasDatabase()) return false;
  if (isBuildPhase()) return databaseReadyForBuild();
  return true;
}

function cached<A extends unknown[], R>(name: string, fn: (...args: A) => Promise<R>) {
  return (...args: A): Promise<R> =>
    unstable_cache(() => fn(...args), [SHAPE, name, JSON.stringify(args)], { revalidate: CACHE_SECONDS, tags: [DATA_CACHE_TAG, "conditions"] })();
}

const summaryCols = {
  slug: conditions.slug,
  name: conditions.name,
  department: conditions.department,
  departmentSlug: conditions.departmentSlug,
  specialtyKey: conditions.specialtyKey,
};

export const listConditions = cached("listConditions", async (): Promise<ConditionSummary[]> => {
  if (!(await available())) return [];
  const rows = await getDb().select(summaryCols).from(conditions).where(eq(conditions.live, true)).orderBy(asc(sql`lower(${conditions.name})`));
  return rows.map((r) => ({ ...r, specialtyKey: (r.specialtyKey as SpecialtyKey | null) ?? null }));
});

export const getConditionDraft = cached("getConditionDraft", async (slug: string): Promise<ConditionDraft | null> => {
  if (!(await available())) return null;
  const [r] = await getDb().select().from(conditions).where(eq(conditions.slug, slug)).limit(1);
  if (!r || !r.live) return null;
  return {
    slug: r.slug,
    sourceId: r.sourceId,
    name: r.name,
    otherNames: r.otherNames,
    department: r.department,
    departmentSlug: r.departmentSlug,
    specialtyKey: (r.specialtyKey as SpecialtyKey | null) ?? null,
    clinicianLabel: r.clinicianLabel,
    additionalDepartments: r.additionalDepartments,
    scope: r.scope,
    sourceCollection: r.sourceCollection,
    orphaCode: r.orphaCode,
    metaDescription: r.metaDescription,
    sections: r.sections as DraftSection[],
    sources: r.sources as DraftSource[],
    attribution: r.attribution,
    hpoCitation: r.hpoCitation,
    reviewFlags: r.reviewFlags,
    sourceGaps: r.sourceGaps,
    wordCount: r.wordCount,
    uniqueWordCount: r.uniqueWordCount,
    compiledOn: String(r.compiledOn),
    updatedAt: r.updatedAt.toISOString(),
  };
});
