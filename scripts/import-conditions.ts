import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { revalidateSite } from "./revalidate-site";

import { bodyStrings, cleanCondition, countWords, type RawCondition } from "../lib/conditions/clean";
import { departmentByName } from "../lib/conditions/departments";
import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Imports the compiled condition drafts (TDI_2500_Article_Drafts/import).
 *
 *   npm run db:import:conditions -- --dir ~/Downloads/TDI_2500_Article_Drafts/import [--dry-run]
 *
 * Reads every batch-*.json, cleans each draft (lib/conditions/clean.ts),
 * measures how much of each page is shared boilerplate, and upserts by slug.
 * Re-running is safe: content is replaced, `live` is left as an editor set it.
 * Every imported row renders noindex — the importer cannot make a page
 * indexable (lib/conditions/gate.ts).
 *
 * Refuses the whole run if any draft names a department that is not mapped
 * in lib/conditions/departments.ts, or if two drafts share a slug.
 */

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const dryRun = process.argv.includes("--dry-run");

const SHARED_MIN_PAGES = 5;

function norm(text: string, name: string): string {
  return text.split(name).join("§").replace(/\s+/g, " ").trim().toLowerCase();
}

async function main() {
  const dir = arg("dir");
  if (!dir) throw new Error("Pass --dir <folder holding batch-*.json>");
  const files = readdirSync(dir).filter((f) => /^batch-\d+\.json$/.test(f)).sort();
  const raws: RawCondition[] = files.flatMap((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as RawCondition[]);
  console.log(`Read ${raws.length} drafts from ${files.length} files`);

  const unmapped = [...new Set(raws.map((r) => r.department).filter((d) => !departmentByName(d)))];
  if (unmapped.length) throw new Error(`Unmapped departments: ${unmapped.join(", ")}`);
  const slugs = new Set<string>();
  for (const r of raws) {
    if (slugs.has(r.slug)) throw new Error(`Duplicate slug ${r.slug}`);
    slugs.add(r.slug);
  }

  const cleaned = raws.map((raw) => ({ raw, c: cleanCondition(raw) }));

  // Shared-text measure: a paragraph that appears (name-normalised) on 5+
  // drafts is template, not substance.
  const pages = new Map<string, number>();
  for (const { raw, c } of cleaned) {
    for (const t of new Set(bodyStrings(c.sections).map((x) => norm(x, raw.condition_name)))) pages.set(t, (pages.get(t) ?? 0) + 1);
  }

  const rows = cleaned.map(({ raw, c }) => {
    const strings = bodyStrings(c.sections);
    const wordCount = strings.reduce((n, t) => n + countWords(t), 0);
    const uniqueWordCount = strings.reduce((n, t) => n + ((pages.get(norm(t, raw.condition_name)) ?? 0) >= SHARED_MIN_PAGES ? 0 : countWords(t)), 0);
    const dept = departmentByName(raw.department)!;
    return {
      slug: raw.slug,
      sourceId: raw.id,
      name: raw.condition_name.trim(),
      otherNames: c.otherNames,
      department: dept.name,
      departmentSlug: dept.slug,
      specialtyKey: dept.specialty,
      clinicianLabel: raw.doctor,
      additionalDepartments: raw.additional_departments,
      scope: raw.scope,
      sourceCollection: raw.source_collection,
      orphaCode: c.orphaCode,
      metaDescription: raw.meta_description,
      sections: c.sections,
      sources: c.sources,
      attribution: raw.attribution,
      hpoCitation: raw.hpo_citation,
      reviewFlags: raw.review_flags,
      sourceGaps: raw.source_gaps,
      cleanupNotes: c.notes,
      wordCount,
      uniqueWordCount,
      contentSha256: raw.content_sha256,
      compiledOn: raw.compiled_on,
    };
  });

  const noted = rows.filter((r) => r.cleanupNotes.length).length;
  const reattached = rows.reduce((n, r) => n + r.cleanupNotes.filter((x) => x.startsWith("Re-attached")).length, 0);
  const uncertain = rows.reduce((n, r) => n + r.cleanupNotes.filter((x) => x.startsWith("List order uncertain")).length, 0);
  const dropped = rows.reduce((n, r) => n + r.cleanupNotes.filter((x) => x.startsWith("Dropped")).length, 0);
  const race = rows.reduce((n, r) => n + r.cleanupNotes.filter((x) => x.startsWith("Removed US")).length, 0);
  const u = rows.map((r) => r.uniqueWordCount).sort((a, b) => a - b);
  console.log(`Cleanup: ${noted} drafts touched · ${reattached} lists re-attached · ${uncertain} uncertain · ${dropped} stray lines · ${race} US race risk lines`);
  console.log(`Unique words per page: p10 ${u[Math.floor(u.length * 0.1)]}, median ${u[Math.floor(u.length / 2)]}, p90 ${u[Math.floor(u.length * 0.9)]}`);
  if (dryRun) return;

  const client = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL!, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await db
      .insert(s.conditions)
      .values(chunk)
      .onConflictDoUpdate({
        target: s.conditions.slug,
        set: {
          sourceId: sql`excluded.source_id`,
          name: sql`excluded.name`,
          otherNames: sql`excluded.other_names`,
          department: sql`excluded.department`,
          departmentSlug: sql`excluded.department_slug`,
          specialtyKey: sql`excluded.specialty_key`,
          clinicianLabel: sql`excluded.clinician_label`,
          additionalDepartments: sql`excluded.additional_departments`,
          scope: sql`excluded.scope`,
          sourceCollection: sql`excluded.source_collection`,
          orphaCode: sql`excluded.orpha_code`,
          metaDescription: sql`excluded.meta_description`,
          sections: sql`excluded.sections`,
          sources: sql`excluded.sources`,
          attribution: sql`excluded.attribution`,
          hpoCitation: sql`excluded.hpo_citation`,
          reviewFlags: sql`excluded.review_flags`,
          sourceGaps: sql`excluded.source_gaps`,
          cleanupNotes: sql`excluded.cleanup_notes`,
          wordCount: sql`excluded.word_count`,
          uniqueWordCount: sql`excluded.unique_word_count`,
          contentSha256: sql`excluded.content_sha256`,
          compiledOn: sql`excluded.compiled_on`,
          updatedAt: sql`now()`,
        },
      });
    process.stdout.write(`\rUpserted ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
  }
  console.log();
  const [{ n }] = (await client`select count(*)::int as n from conditions`) as unknown as Array<{ n: number }>;
  console.log(`conditions table now holds ${n} rows`);
  await client.end();
  await revalidateSite();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
