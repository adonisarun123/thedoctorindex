import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * `npm run db:fix-languages -- [--dry]` — rewrite stored languages through
 * `normalizeLanguages`, dropping scraper debris ("Know More", "&times;",
 * reviewer names, "2 months ago") and folding misspellings ("Telegu").
 *
 * Changes go through `applyField`, so each one writes an audit row and
 * recomputes quality: a profile whose only "languages" were debris loses the
 * points it should never have had. Idempotent: a second run finds nothing.
 */
async function main() {
  const dry = process.argv.includes("--dry");
  const { getDb } = await import("../lib/db/client");
  const s = await import("../lib/db/schema");
  const { sql } = await import("drizzle-orm");
  const { applyField } = await import("../lib/services/doctors");
  const { normalizeLanguages } = await import("../lib/data/languages");

  const rows = await getDb()
    .select({ id: s.doctors.id, languages: s.doctors.languages })
    .from(s.doctors)
    .where(sql`cardinality(${s.doctors.languages}) > 0`);
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
  const dirty = rows.filter((r) => !same(r.languages, normalizeLanguages(r.languages)));
  const emptied = dirty.filter((r) => normalizeLanguages(r.languages).length === 0).length;

  console.log(`${rows.length} doctors with languages; ${dirty.length} to rewrite, ${emptied} of them left with none${dry ? " (dry run)" : ""}`);
  for (const r of dirty.slice(0, dry ? 25 : 0)) {
    console.log(`  ${JSON.stringify(r.languages)} -> ${JSON.stringify(normalizeLanguages(r.languages))}`);
  }
  if (dry) return;
  let n = 0;
  for (const r of dirty) {
    await applyField(r.id, "languages", normalizeLanguages(r.languages), null, "system", "languages normalised; scraped non-language text removed");
    if (++n % 50 === 0) console.log(`  ${n}/${dirty.length}`);
  }
  console.log(`Done: ${n} rewritten.`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
