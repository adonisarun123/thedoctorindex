import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Make sure every locality a harvest mentions exists in `localities`.
 *
 *   npm run db:localities -- [--dir data/private/harvest] [--city bengaluru] [--dry]
 *
 * Hospital rosters name neighbourhoods the directory has never seen (Hebbal,
 * Bommasandra, Yeshwanthpur…). A practice row cannot be imported without a
 * known locality key, so this runs first: it reads the locality hints out of
 * the harvest, matches them against what already exists — allowing for the
 * legacy "bengaluru-" and "bangalore-urban-" key prefixes — and creates only
 * what is genuinely new.
 *
 * Coordinates come from Nominatim (one request a second, as its usage policy
 * requires), never from guesswork; a locality that cannot be geocoded is still
 * created, with null coordinates, because a missing pin is a smaller problem
 * than a wrong one.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const DIR = arg("--dir", "data/private/harvest");
const CITY = arg("--city", "bengaluru");
const CITY_NAME = arg("--city-name", "Bengaluru");
const STATE = arg("--state", "Karnataka");
const STATE_SLUG = arg("--state-slug", "karnataka");
const DRY = args.includes("--dry");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Compare locality identities ignoring the legacy city prefixes and punctuation. */
const bare = (key: string) => key.replace(/^(bengaluru|bangalore|bangalore-urban)-/, "").replace(/[^a-z0-9]/g, "");

/**
 * Hints that name a locality the directory already has, under a different
 * spelling or at a finer grain than a browse page should go. Folding these is
 * the difference between one honest /bengaluru/rr-nagar page and two thin ones
 * competing with each other.
 */
const FOLD: Record<string, string> = {
  "rr nagar": "bengaluru-raja-rajeshwari-nagar",
  sahakarnagar: "bengaluru-sahakara-nagar",
  nagarabhavi: "nagarbhavi",
  varthur: "bangalore-urban-vartur",
  "varthur road": "bangalore-urban-vartur",
  "hsr layout 2nd sector": "hsr-layout",
  "aurobindo marg - jayanagar": "jayanagar",
  // Nominatim pins bare "Sarjapur" ~20 km from the hospitals that use the name;
  // every record carrying it is on Sarjapur Road, which already exists.
  sarjapur: "sarjapur-road",
};

/** Titlecase a hint the way the existing rows are written. */
function displayName(hint: string) {
  return hint
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\bRr\b/, "RR")
    .replace(/\bJp\b/, "JP")
    .replace(/\bHsr\b/, "HSR")
    .replace(/\bHrbr\b/, "HRBR");
}

async function geocode(name: string): Promise<{ lat: number; lng: number } | null> {
  const contact = process.env.GEOCODING_CONTACT_EMAIL ?? process.env.EMAIL_REPLY_TO ?? "ops@thedoctorindex.com";
  const q = `${name}, ${CITY_NAME}, ${STATE}, India`;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": `TheDoctorIndex/1.0 (${contact})`, Accept: "application/json" } });
    if (!r.ok) return null;
    const j = (await r.json()) as Array<{ lat: string; lon: string }>;
    if (!j.length) return null;
    const lat = Number(j[0].lat);
    const lng = Number(j[0].lon);
    // Sanity-check the pin actually lands in the Bengaluru region before trusting it.
    if (CITY === "bengaluru" && (lat < 12.6 || lat > 13.4 || lng < 77.3 || lng > 78.0)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });

  const hints = new Map<string, number>();
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.startsWith(".") && !/\.pre\.json$/.test(f))) {
    const parsed = JSON.parse(readFileSync(join(DIR, f), "utf8")) as unknown;
    if (!Array.isArray(parsed)) continue;
    for (const r of parsed as Array<{ locality_hint?: string }>) {
      const h = (r.locality_hint ?? "").replace(/\s*clinic\s*$/i, "").trim();
      if (h) hints.set(h, (hints.get(h) ?? 0) + 1);
    }
  }
  console.log(`${hints.size} distinct locality hints in ${DIR}`);

  const existing = await db.select().from(s.localities).where(eq(s.localities.citySlug, CITY));
  const byBare = new Map(existing.map((l) => [bare(l.key), l]));
  for (const l of existing) byBare.set(bare(l.slug ?? l.key), l);

  const missing: Array<[string, number]> = [];
  for (const [hint, n] of [...hints].sort((a, b) => b[1] - a[1])) {
    const folded = FOLD[hint.toLowerCase()];
    const hit = byBare.get(bare(folded ?? slugify(hint)));
    if (hit) console.log(`  ok    ${String(n).padStart(4)}  ${hint} → ${hit.key}${folded ? " (folded)" : ""}`);
    else if (folded) missing.push([folded.replace(/-/g, " "), n]);
    else missing.push([hint, n]);
  }

  console.log(`\n${missing.length} to create:`);
  for (const [hint, n] of missing) console.log(`  new   ${String(n).padStart(4)}  ${hint}`);
  if (DRY || !missing.length) {
    await client.end();
    return;
  }

  let sort = 100;
  for (const [hint] of missing) {
    const name = displayName(hint);
    const key = slugify(hint);
    const geo = await geocode(name);
    await new Promise((r) => setTimeout(r, 1100));
    await db
      .insert(s.localities)
      .values({
        key,
        slug: key,
        name,
        city: CITY_NAME,
        citySlug: CITY,
        state: STATE,
        stateSlug: STATE_SLUG,
        lat: geo ? String(geo.lat) : null,
        lng: geo ? String(geo.lng) : null,
        active: true,
        sort: sort++,
      })
      .onConflictDoNothing();
    console.log(`  + ${key}${geo ? ` (${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)})` : " (no coordinates)"}`);
  }
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
