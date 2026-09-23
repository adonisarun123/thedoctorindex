import { config } from "dotenv";
import { readFileSync } from "node:fs";

config({ path: ".env.local" });
config();

/**
 * `npm run db:reclassify -- --file <json> [--dry]`
 *
 * Re-files harvested doctors whose hospital department names a speciality the
 * taxonomy did not have when they were imported (critical care, emergency
 * medicine, PM&R, infectious diseases, nuclear medicine, transplant). They
 * went in under a near-neighbour — 59 ICU consultants as "non-clinical
 * medicine", MD rehabilitation physicians as physiotherapists.
 *
 * Input: `[{ url, spec }]` — the hospital page the record came from and the
 * speciality it now resolves to (build-import output). A record is moved only
 * out of a generic or wrong bucket; a doctor already filed under a specific
 * speciality (plastic surgery, gastroenterology, …) keeps it. Each move goes
 * through `applyField`: audit row, quality recompute. The TDI ID is unchanged
 * by design — it records the speciality at issue.
 */
const MOVABLE_FROM = new Set([
  "non-clinical-medicine",
  "internal-medicine",
  "general-practice",
  "general-surgery",
  "anaesthesiology",
  "physiotherapy",
  "occupational-therapy",
  "radiology",
]);

async function main() {
  const dry = process.argv.includes("--dry");
  const i = process.argv.indexOf("--file");
  if (i < 0) throw new Error("--file <json> required");
  const input = JSON.parse(readFileSync(process.argv[i + 1], "utf8")) as Array<{ url: string; spec: string }>;
  const { getDb } = await import("../lib/db/client");
  const { sql } = await import("drizzle-orm");
  const { applyField } = await import("../lib/services/doctors");
  const { SPECIALTIES } = await import("../lib/data/specialties");

  const want = new Map<string, string>();
  for (const r of input) if (SPECIALTIES[r.spec]) want.set(r.url.toLowerCase(), r.spec);
  const urls = [...want.keys()];
  if (!urls.length) return console.log("nothing to do");
  const rows = (await getDb().execute(sql`select id, name, specialty_key, status, lower(source_url) u from doctors where lower(source_url) in ${urls}`)) as unknown as Array<{ id: string; name: string; specialty_key: string; status: string; u: string }>;

  let moved = 0, kept = 0, same = 0;
  for (const r of rows) {
    const to = want.get(r.u)!;
    if (r.specialty_key === to) { same++; continue; }
    if (!MOVABLE_FROM.has(r.specialty_key)) { kept++; console.log(`  keep  ${r.name} (${r.specialty_key}; would be ${to})`); continue; }
    console.log(`  ${dry ? "would " : ""}move ${r.name}: ${r.specialty_key} -> ${to} [${r.status}]`);
    if (!dry) await applyField(r.id, "specialtyKey", to, null, "system", `re-filed from hospital department: ${r.specialty_key} was a stand-in before ${to} existed`);
    moved++;
  }
  console.log(`\n${rows.length} found · ${dry ? "would move" : "moved"} ${moved} · kept (specific speciality) ${kept} · already right ${same}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
