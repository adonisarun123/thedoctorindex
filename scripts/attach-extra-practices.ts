import { readFileSync } from "node:fs";

import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Attach the second and third hospitals a merged doctor works at.
 *
 *   npm run db:extra-practices -- [--file data/private/import/extra-practices.json] [--dry]
 *
 * A doctor who appears on two hospitals' sites is imported once, from whichever
 * page carried the most detail, so the other clinic would otherwise be lost.
 * The register said the two pages are the same person; this puts the second
 * address on the profile.
 *
 * Facilities are reused, never re-created: two doctors at Manipal Whitefield
 * must point at one facility row, or the locality pages fill up with duplicates
 * of the same hospital.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const FILE = arg("--file", "data/private/import/extra-practices.json");
const DRY = args.includes("--dry");

type Extra = { registration: string; hospital: string; branch: string; address: string; locality: string; phone: string; source_url: string };

const normalizeKey = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  const { addPractice } = await import("../lib/services/doctors");

  const rows = JSON.parse(readFileSync(FILE, "utf8")) as Extra[];
  console.log(`${rows.length} extra practices in ${FILE}`);

  let added = 0;
  let reusedFacility = 0;
  let noDoctor = 0;
  let already = 0;

  for (const r of rows) {
    // "Karnataka Medical Council 117608" → find the doctor by that registration.
    const m = r.registration.match(/^(.*?)\s+(\S+)$/);
    if (!m) continue;
    const [, council, number] = m;
    const [reg] = await db
      .select({ doctorId: s.medicalRegistrations.doctorId })
      .from(s.medicalRegistrations)
      .where(and(eq(s.medicalRegistrations.numberNormalized, normalizeKey(number)), eq(s.medicalRegistrations.councilNormalized, normalizeKey(council))))
      .limit(1);
    if (!reg) {
      noDoctor++;
      continue;
    }

    const [existingFacility] = await db
      .select({ id: s.facilities.id })
      .from(s.facilities)
      .where(and(eq(s.facilities.name, r.hospital), eq(s.facilities.localityKey, r.locality)))
      .limit(1);

    if (existingFacility) {
      const [dup] = await db
        .select({ id: s.doctorPractices.id })
        .from(s.doctorPractices)
        .where(and(eq(s.doctorPractices.doctorId, reg.doctorId), eq(s.doctorPractices.facilityId, existingFacility.id)))
        .limit(1);
      if (dup) {
        already++;
        continue;
      }
      reusedFacility++;
    }

    if (DRY) {
      added++;
      continue;
    }
    try {
      await addPractice(
        reg.doctorId,
        existingFacility
          ? { facilityId: existingFacility.id, phone: r.phone || undefined }
          : { facilityName: r.hospital, localityKey: r.locality, address: r.address, phone: r.phone || undefined },
        null,
        false,
      );
      added++;
    } catch (e) {
      console.log(`  ✗ ${r.hospital} / ${r.locality}: ${(e as Error).message}`);
    }
  }

  console.log(`${DRY ? "would add" : "added"} ${added} (${reusedFacility} reusing an existing facility) · ${already} already on the profile · ${noDoctor} had no imported doctor`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
