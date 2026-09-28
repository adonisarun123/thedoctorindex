import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });
config();

/**
 * Merge published profiles that are the same doctor listed twice.
 *
 *   npm run db:merge-dupes -- --dry
 *   npm run db:merge-dupes -- --actor <staff user id> --basis "<instruction and date>"
 *
 * A pair is a duplicate only when BOTH hold:
 *   1. the registration digits match, under the same council (or one side's
 *      council is "not stated"), and
 *   2. every name token of the shorter name appears in the longer one
 *      ("Smita B Kalappa" ⊇ "Smita Kalappa"). Single letters are ignored.
 *
 * Digits alone are not enough: Madhya Pradesh runs several numbering series
 * (1059, MP-1059, A-1059 are three different doctors) and Karnataka's state
 * migration numbers ("UTC 0000013 KTK") repeat across origin states.
 *
 * The keeper is the stronger record (claimed, register-checked, photo, bio,
 * quality, older). Anything the keeper lacks is first copied from the
 * duplicate: photo, a longer bio, practices at other facilities, and
 * qualifications it does not list. Then mergeDoctor() moves reviews and
 * enquiries, archives the duplicate and 301s its slug.
 */

type Row = {
  id: string; slug: string; name: string; claimed: boolean; q: number; photo: string | null;
  about: string | null; reg: string; council: string; digits: string; created: string;
};

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const arg = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };

const tokens = (n: string) => n.toLowerCase().replace(/[^a-z]+/g, " ").split(" ").filter((t) => t.length > 1);
export const sameName = (a: string, b: string) => {
  const [x, y] = [tokens(a), tokens(b)].sort((p, q) => p.length - q.length);
  return x.length >= 2 && x.every((t) => y.includes(t));
};
const NOT_STATED = "Council not stated";
const rank = (r: Row) => [r.claimed ? 1 : 0, r.reg === "active" ? 1 : 0, r.photo ? 1 : 0, (r.about ?? "").length, r.q, -Date.parse(r.created)];
const better = (a: Row, b: Row) => {
  const [x, y] = [rank(a), rank(b)];
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return a.id < b.id;
};

async function main() {
  const { getDb } = await import("../lib/db/client");
  const db = getDb();
  const rows = (await db.execute(sql`
    select d.id, d.slug, d.name, d.claimed, d.quality_score q, d.photo_file_id photo, d.about, m.status reg, m.council,
           regexp_replace(m.number, '\\D', '', 'g') digits, d.created_at::text created
    from medical_registrations m join doctors d on d.id = m.doctor_id
    where d.status = 'published' and d.merged_into_id is null
      and regexp_replace(m.number, '\\D', '', 'g') <> ''`)) as unknown as Row[];

  const byDigits = new Map<string, Row[]>();
  for (const r of rows) byDigits.set(r.digits, [...(byDigits.get(r.digits) ?? []), r]);

  // Union-find, so a doctor listed three times collapses to one keeper.
  const parent = new Map<string, string>();
  const find = (x: string): string => { const p = parent.get(x) ?? x; if (p === x) return x; const r = find(p); parent.set(x, r); return r; };
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const group of byDigits.values()) {
    for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) {
      const [a, b] = [group[i], group[j]];
      if (a.id === b.id) continue;
      const councilOk = a.council === b.council || a.council === NOT_STATED || b.council === NOT_STATED;
      if (councilOk && sameName(a.name, b.name)) {
        const [ra, rb] = [find(a.id), find(b.id)];
        if (ra !== rb) parent.set(ra, rb);
      }
    }
  }
  const clusters = new Map<string, Map<string, Row>>();
  for (const id of parent.keys()) {
    const root = find(id);
    const c = clusters.get(root) ?? new Map<string, Row>();
    c.set(id, byId.get(id)!);
    c.set(root, byId.get(root)!);
    clusters.set(root, c);
  }

  const plan = [...clusters.values()].map((m) => [...m.values()]).filter((c) => c.length > 1).map((c) => {
    const keeper = c.reduce((a, b) => (better(a, b) ? a : b));
    return { keeper, dupes: c.filter((x) => x.id !== keeper.id) };
  });
  console.log(`${plan.length} doctors listed more than once · ${plan.reduce((n, p) => n + p.dupes.length, 0)} profiles to merge`);
  for (const p of plan) console.log(`  keep ${p.keeper.slug} (${p.keeper.name})  <-  ${p.dupes.map((d) => `${d.slug} (${d.name})`).join(", ")}`);
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
      await mergeDoctor(d.id, keeper.id, actor, `Duplicate: same registration digits (${d.digits}) and name. ${basis}`);
      console.log(`merged ${d.slug} -> ${keeper.slug}`);
    }
  }
}

if (process.argv[1]?.includes("merge-duplicate-registrations")) {
  main().then(() => process.exit(0)).catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
}
