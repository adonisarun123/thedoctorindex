import { readFileSync } from "node:fs";

import { config } from "dotenv";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Record where an imported doctor's portrait lives, without showing it.
 *
 *   npm run db:photo-candidates -- [--file data/private/import/photo-candidates.json] [--dry]
 *
 * Hospital sites publish a portrait of every consultant. That image belongs to
 * the hospital and the doctor never agreed to it appearing on this directory,
 * so importing it would be republishing someone's likeness without consent.
 * What we can honestly keep is the fact that it exists and where: when the
 * doctor claims their profile, the claim flow offers it to them and they decide.
 *
 * Nothing here downloads an image, and nothing here writes doctors.photo_file_id
 * — only `npm run db:photo --consent` does that, one doctor at a time.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const FILE = arg("--file", "data/private/import/photo-candidates.json");
const DRY = args.includes("--dry");

type Candidate = { source_url: string; photo_url: string; source: string };

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });

  const rows = JSON.parse(readFileSync(FILE, "utf8")) as Candidate[];
  console.log(`${rows.length} photo candidates in ${FILE}`);

  // Doctors are found by the source URL the import recorded on them.
  const urls = [...new Set(rows.map((r) => r.source_url))];
  const found = new Map<string, string>();
  for (let i = 0; i < urls.length; i += 500) {
    const chunk = urls.slice(i, i + 500);
    const docs = await db.select({ id: s.doctors.id, sourceUrl: s.doctors.sourceUrl }).from(s.doctors).where(inArray(s.doctors.sourceUrl, chunk));
    for (const d of docs) if (d.sourceUrl) found.set(d.sourceUrl, d.id);
  }
  console.log(`${found.size}/${urls.length} source URLs matched an imported doctor`);

  let written = 0;
  let skipped = 0;
  for (const r of rows) {
    const doctorId = found.get(r.source_url);
    if (!doctorId) {
      skipped++;
      continue;
    }
    if (DRY) {
      written++;
      continue;
    }
    await db
      .insert(s.photoCandidates)
      .values({ doctorId, url: r.photo_url, sourceUrl: r.source_url, source: r.source, status: "pending" })
      .onConflictDoNothing();
    written++;
  }
  console.log(`${DRY ? "would record" : "recorded"} ${written} candidates · ${skipped} had no imported doctor`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
