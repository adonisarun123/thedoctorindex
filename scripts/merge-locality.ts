import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";
import { revalidateSite } from "./revalidate-site";

config({ path: ".env.local" });
config();

/**
 * Merge one locality into another.
 *
 *   npm run db:merge-locality -- --from bangalore-urban-j-p-nagar --to bengaluru-jp-nagar --dry
 *   npm run db:merge-locality -- --from bangalore-urban-j-p-nagar --to bengaluru-jp-nagar
 *
 * The imports spelled the same neighbourhood several ways — "J P Nagar" and
 * "Jp Nagar", "Indiranagar" and "Indira Nagar", "Basaveshwaranagar" and
 * "Basaveshwara Nagar" — and each spelling became its own locality with its own
 * URL and its own slice of the doctors. The city merge in merge-city.ts only
 * catches duplicates that already share a slug; these do not, so they need
 * naming by hand.
 *
 * Takes keys, not slugs, because a slug is only unique within a city and the
 * whole point here is that the duplicates are often in different cities. Both
 * sides are printed with their doctor counts before anything is written, and
 * --dry prints the plan without writing.
 *
 * Facilities are repointed at the target and the source is deactivated rather
 * than deleted: `facilities.locality_key` references it, and a deactivated row
 * keeps the audit trail intact while dropping out of the site's queries.
 */

const args = process.argv.slice(2);
const arg = (k: string, d = "") => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const FROM = arg("from");
const TO = arg("to");
const DRY = args.includes("--dry");

interface Row {
  key: string; name: string; slug: string; city: string; city_slug: string; state: string; active: boolean; facilities: number; doctors: number;
}

async function main() {
  if (!FROM || !TO) throw new Error("usage: npm run db:merge-locality -- --from <key> --to <key> [--dry]");
  if (FROM === TO) throw new Error("--from and --to are the same locality");
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { max: 2, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });

  const load = async (key: string): Promise<Row | null> => {
    const [r] = (await db.execute(sql`
      select l.key, l.name, l.slug, l.city, l.city_slug, l.state, l.active,
        (select count(*)::int from facilities f where f.locality_key = l.key) as facilities,
        (select count(distinct d.id)::int from facilities f
           join doctor_practices p on p.facility_id = f.id and p.active
           join doctors d on d.id = p.doctor_id and d.status = 'published'
         where f.locality_key = l.key) as doctors
      from localities l where l.key = ${key}`)) as unknown as Row[];
    return r ?? null;
  };

  const from = await load(FROM);
  const to = await load(TO);
  if (!from) throw new Error(`no locality with key ${FROM}`);
  if (!to) throw new Error(`no locality with key ${TO}`);

  const show = (r: Row) => `${r.key} — "${r.name}" (/${r.city_slug}/${r.slug}) · ${r.city}, ${r.state} · ${r.facilities} facilities, ${r.doctors} published doctors${r.active ? "" : " · INACTIVE"}`;
  console.log(`from: ${show(from)}`);
  console.log(`to:   ${show(to)}`);

  // Different states almost always means these are different places that
  // happen to share a name. Refuse rather than silently merge two towns.
  if (from.state !== to.state) throw new Error(`refusing: ${from.state} ≠ ${to.state}. Different states are different places; pass --force-state to override.`);

  console.log(`\n${DRY ? "would move" : "moving"} ${from.facilities} facilities → ${to.key}, then deactivate ${from.key}`);
  if (DRY) {
    console.log("DRY RUN — nothing written");
    await client.end();
    return;
  }

  await db.transaction(async (tx) => {
    await tx.execute(sql`update facilities set locality_key = ${to.key} where locality_key = ${from.key}`);
    await tx.execute(sql`update localities set active = false where key = ${from.key}`);
  });

  const after = await load(TO);
  console.log(`done — ${to.key} now holds ${after?.facilities ?? 0} facilities and ${after?.doctors ?? 0} published doctors`);
  await revalidateSite();
  await client.end();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
