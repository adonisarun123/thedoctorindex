import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";
import { revalidateSite } from "./revalidate-site";

config({ path: ".env.local" });
config();

/**
 * Merge one city identity into another.
 *
 *   npm run db:merge-city -- --from bangalore-urban --to bengaluru --dry
 *   npm run db:merge-city -- --from bangalore-urban --to bengaluru
 *
 * The DrData and Lybrate imports named the same city three ways — "Bangalore
 * Urban" (the district), "Bengaluru" and "Bangalore" — so one city was
 * published as two URL trees with the supply split between them, and a third
 * tree of empty localities. Every speciality page in that city was gated on
 * half its doctors.
 *
 * Localities are keyed by `key`, which `facilities.locality_key` references, so
 * nothing is renamed in place where a collision exists. For each locality in
 * the source city:
 *
 *   - if the target city already has a locality with the same slug, the
 *     source's facilities are repointed at it and the now-empty source row is
 *     deactivated. Two rows resolving to one URL is the thing to avoid.
 *   - otherwise the row's city and city_slug are rewritten and its key is left
 *     alone, which moves it under the target city without touching any
 *     foreign key.
 *
 * A locality whose slug is the source city's own name (the importers created
 * "Bangalore, Bangalore Urban" as a catch-all for addresses with no
 * neighbourhood) is treated as the city catch-all and mapped onto the target
 * city's catch-all rather than becoming a neighbourhood of it.
 *
 * Idempotent: a second run finds nothing in the source city and does nothing.
 */

const args = process.argv.slice(2);
const arg = (k: string, d = "") => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const FROM = arg("from");
const TO = arg("to");
const DRY = args.includes("--dry");
/** Extra source slugs to treat as the city catch-all rather than a neighbourhood. */
const CATCH_ALL = new Set(arg("catch-all").split(",").map((x) => x.trim()).filter(Boolean));

async function main() {
  if (!FROM || !TO) throw new Error("usage: npm run db:merge-city -- --from <city_slug> --to <city_slug> [--dry]");
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { max: 2, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });

  const rows = (await db.execute(sql`
    select l.key, l.name, l.slug, l.city, l.city_slug, l.state,
           (select count(*)::int from facilities f where f.locality_key = l.key) as facilities
    from localities l where l.city_slug = ${FROM} order by facilities desc`)) as unknown as Array<{
    key: string; name: string; slug: string; city: string; city_slug: string; state: string; facilities: number;
  }>;
  if (!rows.length) {
    console.log(`nothing under city_slug ${FROM} — already merged, or wrong slug`);
    await client.end();
    return;
  }

  // Active only. A locality retired by an earlier merge still holds its slug,
  // and repointing facilities at a deactivated row would hide them from the
  // site entirely — the failure mode is silent, so it is worth the filter.
  const targets = (await db.execute(sql`
    select key, name, slug, city, state from localities where city_slug = ${TO} and active`)) as unknown as Array<{
    key: string; name: string; slug: string; city: string; state: string;
  }>;
  if (!targets.length) throw new Error(`no localities under ${TO}; refusing to merge into a city that does not exist`);

  const cityName = targets[0].city;
  const cityState = targets[0].state;
  const bySlug = new Map(targets.map((t) => [t.slug, t]));
  // The catch-all: the target locality whose slug is the city's own slug, or
  // failing that one named after the city.
  const catchAll = bySlug.get(TO) ?? targets.find((t) => t.slug === t.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")) ?? null;

  console.log(`merging ${rows.length} localities from ${FROM} into ${TO} (${cityName}, ${cityState})${DRY ? " · DRY RUN" : ""}`);
  console.log(`target city catch-all: ${catchAll ? `${catchAll.key} (${catchAll.name})` : "none — city-level rows will be renamed in place"}\n`);

  let repointed = 0;
  let moved = 0;
  let facilitiesMoved = 0;
  let retired = 0;

  for (const l of rows) {
    // Is this the source city's own catch-all rather than a neighbourhood?
    //
    // The importers wrote a locality named after the city for any address with
    // no recognisable neighbourhood, and they did not always use the city's
    // full name: "Bangalore Urban" carries a catch-all called plain
    // "Bangalore", holding more facilities than every real neighbourhood
    // combined. Left undetected it would merge in as a locality named
    // "Bangalore" *inside* Bengaluru. Hence the prefix test, and --catch-all
    // for anything the rules do not catch.
    const citySlugified = l.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const isCatchAll =
      l.slug === FROM ||
      l.slug === citySlugified ||
      l.name.toLowerCase() === l.city.toLowerCase() ||
      FROM.startsWith(`${l.slug}-`) ||
      citySlugified.startsWith(`${l.slug}-`) ||
      CATCH_ALL.has(l.slug);
    const target = isCatchAll ? catchAll : (bySlug.get(l.slug) ?? null);

    if (target && target.key !== l.key) {
      console.log(`  ${l.key} (${l.name}, ${l.facilities} facilities) → ${target.key} (${target.name})${isCatchAll ? "  [city catch-all]" : ""}`);
      if (!DRY) {
        await db.transaction(async (tx) => {
          await tx.execute(sql`update facilities set locality_key = ${target.key} where locality_key = ${l.key}`);
          await tx.execute(sql`update localities set active = false where key = ${l.key}`);
        });
      }
      repointed++;
      retired++;
      facilitiesMoved += l.facilities;
    } else {
      const newSlug = isCatchAll ? TO : l.slug;
      const newName = isCatchAll ? cityName : l.name;
      console.log(`  ${l.key} (${l.name}, ${l.facilities} facilities) → stays, recity to ${cityName}${newSlug !== l.slug ? ` · slug ${l.slug} → ${newSlug}` : ""}`);
      if (!DRY) {
        await db.execute(sql`update localities set city = ${cityName}, city_slug = ${TO}, state = ${cityState}, slug = ${newSlug}, name = ${newName} where key = ${l.key}`);
      }
      moved++;
    }
  }

  console.log(`\n${repointed} localities repointed (${facilitiesMoved} facilities moved), ${moved} recitied, ${retired} deactivated`);

  if (!DRY) {
    const [after] = (await db.execute(sql`
      select count(distinct d.id)::int as doctors, count(distinct l.key)::int as localities
      from localities l join facilities f on f.locality_key = l.key
      join doctor_practices p on p.facility_id = f.id and p.active
      join doctors d on d.id = p.doctor_id and d.status = 'published'
      where l.city_slug = ${TO}`)) as unknown as Array<{ doctors: number; localities: number }>;
    console.log(`${TO} now holds ${after?.doctors ?? 0} published doctors across ${after?.localities ?? 0} localities`);
    await revalidateSite();
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
