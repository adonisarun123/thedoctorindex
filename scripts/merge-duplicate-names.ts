import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { writeFileSync } from "node:fs";

config({ path: ".env.local" });
config();

/**
 * Merge published profiles that are the same doctor under a reordered name.
 *
 *   npm run db:merge-names -- --dry
 *   npm run db:merge-names -- --actor <staff user id> --basis "<instruction and date>" [--review <csv path>]
 *
 * Imports file some doctors surname-first ("Bhasin Neha") and others
 * first-name-first ("Neha Bhasin"); db:merge-dupes only sees pairs that share
 * a registration number, so these survive as two profiles. A pair is merged
 * here only when ALL hold:
 *   1. the same multi-letter name tokens, in any order ("Neha Bhasin" =
 *      "Bhasin Neha"); single-letter initials must not contradict each other
 *      ("Shah Chetan K." and "Shah Chetan V." are two anaesthetists);
 *   2. the same speciality;
 *   3. at least one practice city in common;
 *   4. no registration number under the SAME council that differs between the
 *      two (a doctor holding an APMC number and a TSMC number is one doctor;
 *      two different KMC numbers are two). "0000525" and "201400000525" are
 *      the same number written two ways, so numbers compare by suffix;
 *   5. one more anchor: a shared facility, a shared registration number, or a
 *      name of three or more tokens.
 * A pair meeting 1–4 but not 5 (a two-token name, no shared facility, no
 * registration) is LIKELY the same person and plausibly two people with a
 * common name; it is written to the review file, not merged.
 *
 * The keeper and the copy-across of photo, bio, practices and qualifications
 * follow db:merge-dupes; mergeDoctor() moves reviews and enquiries, archives
 * the duplicate and 301s its slug.
 */

type Row = {
  id: string; slug: string; name: string; sk: string; claimed: boolean; q: number; photo: string | null; about: string | null;
  reg: string | null; created: string; cities: string | null; facilities: string | null;
  /** "council_normalized:digits" per registration, comma-separated. */
  regs: string | null; digits: string | null;
};

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const arg = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };

const HONORIFICS = new Set(["dr", "prof", "mr", "mrs", "ms", "doctor"]);
const parts = (n: string) => n.toLowerCase().replace(/[^a-z]+/g, " ").split(" ").filter(Boolean).filter((t) => !HONORIFICS.has(t));
const words = (n: string) => parts(n).filter((t) => t.length > 1).sort();
const initials = (n: string) => parts(n).filter((t) => t.length === 1).sort();
export const nameKey = (n: string) => words(n).join(" ");
/** Initials agree when both sides have none, one side has none, or the sets are equal. */
export const initialsCompatible = (a: string, b: string) => {
  const [x, y] = [initials(a), initials(b)];
  return x.length === 0 || y.length === 0 || (x.length === y.length && x.every((t, i) => t === y[i]));
};
const split = (s: string | null) => (s ?? "").split(",").filter(Boolean);
const overlap = (a: string | null, b: string | null) => split(a).some((x) => split(b).includes(x));
const trim0 = (d: string) => d.replace(/^0+/, "");
/** The same number written two ways: one is a suffix of the other once leading zeros go ("0000525" ~ "201400000525"). */
export const sameNumber = (a: string, b: string) => {
  const [x, y] = [trim0(a), trim0(b)];
  return x.length >= 3 && y.length >= 3 && (x.endsWith(y) || y.endsWith(x));
};
const regPairs = (r: Row) => split(r.regs).map((x) => { const i = x.indexOf(":"); return { council: x.slice(0, i), digits: x.slice(i + 1) }; }).filter((x) => x.digits);
const UNSTATED = new Set(["", "COUNCILNOTSTATED"]);
/** True when the two hold different numbers under one named council. */
export const registrationsConflict = (a: Row, b: Row) =>
  regPairs(a).some((x) => regPairs(b).some((y) => !UNSTATED.has(x.council) && x.council === y.council && !sameNumber(x.digits, y.digits)));
export const registrationsShared = (a: Row, b: Row) => regPairs(a).some((x) => regPairs(b).some((y) => sameNumber(x.digits, y.digits)));
const rank = (r: Row) => [r.claimed ? 1 : 0, r.reg === "active" ? 1 : 0, r.photo ? 1 : 0, (r.about ?? "").length, r.q, -Date.parse(r.created)];
const better = (a: Row, b: Row) => {
  const [x, y] = [rank(a), rank(b)];
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return a.id < b.id;
};

export type Verdict = "MERGE" | "LIKELY" | "CONFLICT";
export function judge(a: Row, b: Row): Verdict | null {
  if (a.sk !== b.sk || nameKey(a.name) !== nameKey(b.name) || words(a.name).length < 2) return null;
  if (!overlap(a.cities, b.cities)) return null;
  if (!initialsCompatible(a.name, b.name)) return "CONFLICT";
  if (registrationsConflict(a, b)) return "CONFLICT";
  const anchored = overlap(a.facilities, b.facilities) || registrationsShared(a, b) || words(a.name).length >= 3;
  return anchored ? "MERGE" : "LIKELY";
}

async function main() {
  const { getDb } = await import("../lib/db/client");
  const db = getDb();
  const rows = (await db.execute(sql`
    select d.id, d.slug, d.name, d.specialty_key sk, d.claimed, d.quality_score q, d.photo_file_id photo, d.about, d.created_at::text created,
      (select m.status from medical_registrations m where m.doctor_id = d.id order by m.is_primary desc limit 1) reg,
      (select string_agg(distinct l.city_slug, ',') from doctor_practices p join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where p.doctor_id = d.id and p.active) cities,
      (select string_agg(distinct p.facility_id::text, ',') from doctor_practices p where p.doctor_id = d.id and p.active) facilities,
      (select string_agg(distinct m.council_normalized || ':' || regexp_replace(m.number, '\\D', '', 'g'), ',') from medical_registrations m where m.doctor_id = d.id and regexp_replace(m.number, '\\D', '', 'g') <> '') regs,
      (select string_agg(distinct regexp_replace(m.number, '\\D', '', 'g'), ',') from medical_registrations m where m.doctor_id = d.id and regexp_replace(m.number, '\\D', '', 'g') <> '') digits
    from doctors d where d.status = 'published' and d.merged_into_id is null`)) as unknown as Row[];

  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const k = nameKey(r.name);
    if (words(r.name).length < 2) continue;
    groups.set(`${r.sk}|${k}`, [...(groups.get(`${r.sk}|${k}`) ?? []), r]);
  }

  // Union-find over MERGE pairs; LIKELY and CONFLICT pairs are reported.
  const parent = new Map<string, string>();
  const find = (x: string): string => { const p = parent.get(x) ?? x; if (p === x) return x; const r = find(p); parent.set(x, r); return r; };
  const byId = new Map(rows.map((r) => [r.id, r]));
  const review: Array<{ verdict: Verdict; a: Row; b: Row }> = [];
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      const v = judge(g[i], g[j]);
      if (v === "MERGE") { const [ra, rb] = [find(g[i].id), find(g[j].id)]; if (ra !== rb) parent.set(ra, rb); }
      else if (v) review.push({ verdict: v, a: g[i], b: g[j] });
    }
  }
  const clusters = new Map<string, Map<string, Row>>();
  for (const id of parent.keys()) {
    const root = find(id);
    const c = clusters.get(root) ?? new Map<string, Row>();
    c.set(id, byId.get(id)!); c.set(root, byId.get(root)!);
    clusters.set(root, c);
  }
  const plan = [...clusters.values()].map((m) => [...m.values()]).filter((c) => c.length > 1).map((c) => {
    const keeper = c.reduce((a, b) => (better(a, b) ? a : b));
    return { keeper, dupes: c.filter((x) => x.id !== keeper.id) };
  });

  console.log(`${plan.length} doctors listed more than once · ${plan.reduce((n, p) => n + p.dupes.length, 0)} profiles to merge · ${review.filter((r) => r.verdict === "LIKELY").length} LIKELY pairs for review · ${review.filter((r) => r.verdict === "CONFLICT").length} same-name CONFLICT pairs left alone`);
  for (const p of plan) console.log(`  keep ${p.keeper.slug} (${p.keeper.name})  <-  ${p.dupes.map((d) => `${d.slug} (${d.name})`).join(", ")}`);

  const reviewPath = arg("review");
  if (reviewPath) {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const site = process.env.NEXT_PUBLIC_SITE_URL?.includes("localhost") ? "https://www.thedoctorindex.com" : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thedoctorindex.com");
    const lines = [["Verdict", "Why", "Speciality", "City", "Profile A", "URL A", "Registrations A", "Profile B", "URL B", "Registrations B"].map(esc).join(",")];
    for (const r of review) {
      const why = r.verdict === "CONFLICT"
        ? (!initialsCompatible(r.a.name, r.b.name) ? "Initials differ" : "Different numbers under the same council")
        : "Two-token name, no shared facility, no shared registration number";
      lines.push([r.verdict, why, r.a.sk, split(r.a.cities).filter((c) => split(r.b.cities).includes(c)).join(" "), r.a.name, `${site}/doctor/${r.a.slug}`, r.a.regs, r.b.name, `${site}/doctor/${r.b.slug}`, r.b.regs].map(esc).join(","));
    }
    writeFileSync(reviewPath, lines.join("\n"));
    console.log(`review list: ${reviewPath} (${review.length} pairs)`);
  }
  if (dry) return console.log("dry run: nothing written");

  const actor = arg("actor");
  const basis = arg("basis");
  if (!actor || !basis) throw new Error("--actor and --basis are required for a real run");
  const { mergeDoctor } = await import("../lib/services/doctors");

  for (const { keeper, dupes } of plan) {
    for (const d of dupes) {
      const [kp] = (await db.execute(sql`select photo_file_id, about from doctors where id = ${keeper.id}`)) as unknown as { photo_file_id: string | null; about: string | null }[];
      if (!kp.photo_file_id && d.photo) {
        await db.execute(sql`update doctors set photo_file_id = ${d.photo}, photo_consent = (select photo_consent from doctors where id = ${d.id}) where id = ${keeper.id}`);
      }
      if ((d.about ?? "").length > (kp.about ?? "").length && (kp.about ?? "").length < 200) {
        await db.execute(sql`update doctors set about = ${d.about} where id = ${keeper.id}`);
      }
      await db.execute(sql`
        insert into doctor_practices (id, doctor_id, facility_id, days, hours, fee_inr, fee_checked_on, confirmed_on, phone, whatsapp, wheelchair_access, active, sort)
        select gen_random_uuid(), ${keeper.id}, p.facility_id, p.days, p.hours, p.fee_inr, p.fee_checked_on, p.confirmed_on, p.phone, p.whatsapp, p.wheelchair_access, p.active, p.sort + 50
        from doctor_practices p where p.doctor_id = ${d.id}
          and not exists (select 1 from doctor_practices k where k.doctor_id = ${keeper.id} and k.facility_id = p.facility_id)`);
      await db.execute(sql`
        insert into doctor_qualifications (id, doctor_id, degree, institution, year, state, checked_on, sort)
        select gen_random_uuid(), ${keeper.id}, q.degree, q.institution, q.year, q.state, q.checked_on, q.sort + 50
        from doctor_qualifications q where q.doctor_id = ${d.id}
          and not exists (select 1 from doctor_qualifications k where k.doctor_id = ${keeper.id}
            and upper(regexp_replace(k.degree, '[^A-Za-z]', '', 'g')) = upper(regexp_replace(q.degree, '[^A-Za-z]', '', 'g')))`);
      // A registration the keeper lacks moves across (council + number is
      // unique site-wide, so it is moved, not copied), as a secondary number.
      await db.execute(sql`
        update medical_registrations m set doctor_id = ${keeper.id}, is_primary = false
        where m.doctor_id = ${d.id}
          and not exists (select 1 from medical_registrations k where k.doctor_id = ${keeper.id}
            and k.council_normalized = m.council_normalized and k.number_normalized = m.number_normalized)`);
      await mergeDoctor(d.id, keeper.id, actor, `Duplicate: same name tokens in another order, same speciality and city. ${basis}`);
      console.log(`merged ${d.slug} -> ${keeper.slug}`);
    }
  }
}

if (process.argv[1]?.includes("merge-duplicate-names")) {
  main().then(() => process.exit(0)).catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
}
