import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { removeDoctorPhoto } from "../lib/services/photos";

config({ path: ".env.local" });
config();

/**
 * Undo `npm run db:publish-photos`.
 *
 *   npm run db:unpublish-photos -- [--dry] [--reason "..."]
 *
 * Removes every portrait that was published from a hospital-sourced candidate
 * and puts the candidate back to `pending`, so the claim flow can offer it to
 * the doctor again. A photo a doctor supplied themselves is never touched:
 * only candidates this pipeline marked `published` are reversed.
 *
 * This exists so the decision to publish without consent stays a decision and
 * not a one-way door — a single takedown request, or a change of mind, is one
 * command rather than an afternoon.
 */

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const reasonIdx = args.indexOf("--reason");
const REASON = reasonIdx >= 0 && args[reasonIdx + 1] ? args[reasonIdx + 1] : "hospital-sourced portrait withdrawn";

async function main() {
  const db = getDb();
  const rows = await db
    .select({ id: s.photoCandidates.id, doctorId: s.photoCandidates.doctorId, name: s.doctors.name, photoFileId: s.doctors.photoFileId })
    .from(s.photoCandidates)
    .innerJoin(s.doctors, eq(s.doctors.id, s.photoCandidates.doctorId))
    .where(eq(s.photoCandidates.status, "published"));

  console.log(`${rows.length} photos published from hospital candidates${DRY ? " · DRY RUN" : ""}`);
  if (DRY) {
    for (const r of rows.slice(0, 10)) console.log(`  would clear ${r.name}`);
    process.exit(0);
  }

  const [staff] = await db
    .select({ id: s.users.id })
    .from(s.staffMembers)
    .innerJoin(s.users, eq(s.users.id, s.staffMembers.userId))
    .where(eq(s.staffMembers.active, true))
    .limit(1);

  let cleared = 0;
  for (const r of rows) {
    if (r.photoFileId) {
      await removeDoctorPhoto(r.doctorId, staff?.id ?? "", "script", REASON);
      cleared++;
    }
    await db.update(s.photoCandidates).set({ status: "pending", resolvedAt: null }).where(eq(s.photoCandidates.id, r.id));
    if (cleared % 200 === 0 && cleared) console.log(`  ${cleared}…`);
  }
  // photo_consent asserted permission we did not have; take the assertion back too.
  const ids = rows.map((r) => r.doctorId);
  for (let i = 0; i < ids.length; i += 500) {
    await db.update(s.doctors).set({ photoConsent: false }).where(inArray(s.doctors.id, ids.slice(i, i + 500)));
  }
  console.log(`cleared ${cleared} photos · ${rows.length} candidates returned to pending`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
