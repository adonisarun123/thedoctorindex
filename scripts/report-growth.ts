import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });
config();

/**
 * `npm run report:growth [-- --days 7]`
 *
 * The two numbers that decide growth right now, from the live database:
 *   1. supply the search engines are allowed to index (the quality gate), and
 *   2. the claim funnel by channel: tagged link opened → claim submitted →
 *      claim approved, grouped by the `src` tag on the claim link.
 *
 * Google's own indexed count lives in Search Console and is not reachable from
 * here; this prints what the site offers, not what Google has accepted.
 */
const i = process.argv.indexOf("--days");
const DAYS = i >= 0 ? Math.max(1, Number(process.argv[i + 1]) || 7) : 7;

async function main() {
  const { getDb } = await import("../lib/db/client");
  const db = getDb();
  const [supply] = (await db.execute(sql`
    select count(*) filter (where status = 'published')::int published,
           count(*) filter (where status = 'published' and claimed)::int claimed,
           count(*) filter (where status = 'published' and merged_into_id is null
             and exists (select 1 from medical_registrations m where m.doctor_id = doctors.id and m.checked_on is not null))::int register_checked
    from doctors`)) as unknown as Array<Record<string, number>>;
  const funnel = (await db.execute(sql`
    select coalesce(nullif(replace(query, 'src:', ''), ''), '(untagged)') src,
           count(*) filter (where kind = 'doctor_lp_viewed')::int landed,
           count(*) filter (where kind = 'claim_link_opened')::int opened,
           count(*) filter (where kind = 'claim_started')::int started,
           count(*) filter (where kind = 'profile_submitted')::int created
    from events
    where kind in ('doctor_lp_viewed', 'claim_link_opened', 'claim_started', 'profile_submitted') and created_at >= now() - make_interval(days => ${DAYS})
    group by 1 order by 2 desc, 3 desc`)) as unknown as Array<{ src: string; landed: number; opened: number; started: number; created: number }>;
  const [decided] = (await db.execute(sql`
    select count(*) filter (where status = 'approved')::int approved, count(*) filter (where status = 'pending')::int pending
    from doctor_claims where created_at >= now() - make_interval(days => ${DAYS})`)) as unknown as Array<Record<string, number>>;

  console.log(`Supply  published ${supply.published} · register-checked ${supply.register_checked} · claimed ${supply.claimed}`);
  console.log(`Claims, last ${DAYS} days  approved ${decided.approved} · pending ${decided.pending}`);
  if (!funnel.length) return console.log("No claim-link activity in this window.");
  console.log("src            landed  opened  claimed  created");
  for (const r of funnel) console.log(`${r.src.padEnd(14)} ${String(r.landed).padStart(6)}  ${String(r.opened).padStart(6)}  ${String(r.started).padStart(7)}  ${String(r.created).padStart(7)}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
