import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { revalidateSite } from "./revalidate-site";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { markAllVerified, recomputeQuality } from "../lib/services/doctors";

config({ path: ".env.local" });
config();

/**
 * Record a verified check on every pending registration, qualification and
 * active practice for one doctor.
 *
 *   npm run db:verify -- --slug naveen-kumar-lv-19162b
 *   npm run db:verify -- --slug some-doctor-abc123 --note "Checked against council and awarding bodies"
 *
 * Goes through the same service the admin "Mark all as verified" button uses.
 * Does not claim the profile or invent an HPR match.
 */

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
  const slug = arg("slug");
  const note = arg("note") ?? "Marked all as verified";
  if (!slug) throw new Error("usage: npm run db:verify -- --slug <slug> [--note '...']");

  const db = getDb();
  const [doctor] = await db
    .select({ id: s.doctors.id, name: s.doctors.name, slug: s.doctors.slug, status: s.doctors.status, quality: s.doctors.qualityScore })
    .from(s.doctors)
    .where(eq(s.doctors.slug, slug))
    .limit(1);
  if (!doctor) throw new Error(`No doctor with slug ${slug}`);

  const [staff] = await db
    .select({ id: s.users.id, email: s.users.email })
    .from(s.staffMembers)
    .innerJoin(s.users, eq(s.users.id, s.staffMembers.userId))
    .where(eq(s.staffMembers.active, true))
    .limit(1);

  const summary = await markAllVerified(doctor.id, staff?.id ?? null, note);
  const quality = await recomputeQuality(doctor.id);

  console.log(`${doctor.name} (${doctor.slug}): registration ${summary.registrations}, qualification ${summary.qualifications}, practice ${summary.practices}`);
  console.log(`quality ${doctor.quality} → ${quality.score} · status ${doctor.status}`);

  await revalidateSite();
  process.exit(0);
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exit(1);
});
