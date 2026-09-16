import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * `npm run db:fix-names -- [--dry]` — strip honorifics left in stored names.
 *
 * Every surface prefixes "Dr" itself, so a name stored as "Dr. Bhavsagar Neena"
 * renders as "Dr Dr. Bhavsagar Neena" in the <h1>, the <title> and the JSON-LD,
 * and slugifies to `/doctor/dr-bhavsagar-neena-…`. The importers only stripped
 * a title when whitespace followed it, so "Dr.Abhishek Anand" got through.
 *
 * Renames go through `applyField`, so each one writes a 308 redirect from the
 * old slug, an audit row, and a quality recompute — the same path a staff edit
 * takes. Idempotent: a second run finds nothing.
 */
async function main() {
  const dry = process.argv.includes("--dry");
  const { getDb } = await import("../lib/db/client");
  const s = await import("../lib/db/schema");
  const { applyField, cleanPersonName } = await import("../lib/services/doctors");

  const rows = await getDb().select({ id: s.doctors.id, name: s.doctors.name, slug: s.doctors.slug }).from(s.doctors);
  const dirty = rows.filter((r) => cleanPersonName(r.name) !== r.name && cleanPersonName(r.name).length >= 2);

  console.log(`${rows.length} doctors, ${dirty.length} with an honorific in the name${dry ? " (dry run)" : ""}\n`);
  for (const r of dirty) {
    const next = cleanPersonName(r.name);
    console.log(`  ${r.name.padEnd(30)} → ${next.padEnd(30)} (was /doctor/${r.slug})`);
    if (!dry) await applyField(r.id, "name", next, null, "system", "honorific stripped from imported name");
  }
  if (dry && dirty.length) console.log("\nRe-run without --dry to apply. Old URLs will 308 to the new ones.");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
