import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { revalidateSite } from "./revalidate-site";

import { departmentByName } from "../lib/conditions/departments";
import { ROUTING_OVERRIDES } from "../lib/conditions/routing-overrides";
import { SPECIALTIES } from "../lib/data/taxonomy";
import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Applies lib/conditions/routing-overrides.ts to condition rows already in
 * the database, without a full re-import.
 *
 *   npx tsx --require ./scripts/server-only-shim.cjs scripts/fix-condition-routing.ts [--apply]
 *
 * Dry run by default. Unknown slugs are reported, not created.
 */
async function main() {
  const apply = process.argv.includes("--apply");
  const client = postgres(process.env.DIRECT_URL ?? process.env.DATABASE_URL!, { ssl: "require", max: 1 });
  const db = drizzle(client, { schema: s });
  let changed = 0;
  const missing: string[] = [];
  for (const [slug, name] of Object.entries(ROUTING_OVERRIDES)) {
    const dept = departmentByName(name);
    if (!dept) throw new Error(`Unknown department "${name}" for ${slug}`);
    const [row] = await db.select({ d: s.conditions.departmentSlug }).from(s.conditions).where(eq(s.conditions.slug, slug));
    if (!row) { missing.push(slug); continue; }
    if (row.d === dept.slug) continue;
    changed++;
    console.log(`${slug}: ${row.d} → ${dept.slug}`);
    if (apply) {
      await db.update(s.conditions).set({
        department: dept.name,
        departmentSlug: dept.slug,
        specialtyKey: dept.specialty,
        clinicianLabel: dept.specialty ? SPECIALTIES[dept.specialty].one : undefined,
        updatedAt: new Date(),
      }).where(eq(s.conditions.slug, slug));
    }
  }
  console.log(`${changed} to change${apply ? " (applied)" : " (dry run)"}; ${missing.length} not in table${missing.length ? `: ${missing.join(", ")}` : ""}`);
  await client.end();
  if (apply && changed) await revalidateSite();
}

main().catch((e) => { console.error(e); process.exit(1); });
