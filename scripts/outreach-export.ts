import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { writeFileSync } from "node:fs";

config({ path: ".env.local" });
config();

/**
 * `npm run outreach:export -- --city bengaluru --out <file.json>`
 *
 * Unclaimed published doctors in a city, one row each with their primary
 * practice and a claim link tagged src=hospital, grouped for hospital-level
 * outreach. The site holds no personal phone or email for these doctors (the
 * practice numbers are hospital switchboards), so the realistic channel is a
 * hospital's doctor-relations team forwarding each doctor their own link.
 */
const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
const CITY = arg("city", "bengaluru");
const OUT = arg("out", `.claude-tmp/outreach-${CITY}.json`);
const SITE = "https://www.thedoctorindex.com";

const NETWORKS: Array<[RegExp, string]> = [
  [/manipal/i, "Manipal Hospitals"], [/apollo/i, "Apollo"], [/sparsh/i, "SPARSH"], [/aster/i, "Aster"],
  [/narayana|mazumdar shaw/i, "Narayana Health"], [/fortis/i, "Fortis"], [/cloudnine/i, "Cloudnine"],
  [/rainbow/i, "Rainbow Children's"], [/motherhood/i, "Motherhood"], [/sakra/i, "Sakra World"],
  [/baptist/i, "Bangalore Baptist"], [/sagar hosp/i, "Sagar Hospitals"], [/hcg/i, "HCG"], [/vikram/i, "Vikram"],
];
const network = (f: string) => NETWORKS.find(([re]) => re.test(f))?.[1] ?? "Other";

async function main() {
  const { getDb } = await import("../lib/db/client");
  const rows = (await getDb().execute(sql`
    select distinct on (d.id) d.slug, d.name, d.specialty_key specialty, f.name facility, l.name locality,
           coalesce(nullif(p.phone, ''), f.phone) phone, d.quality_score q,
           exists (select 1 from medical_registrations m where m.doctor_id = d.id and m.checked_on is not null) register_checked
    from doctors d
    join doctor_practices p on p.doctor_id = d.id
    join facilities f on f.id = p.facility_id
    join localities l on l.key = f.locality_key
    where d.status = 'published' and not d.claimed and d.merged_into_id is null and l.city_slug = ${CITY}
    order by d.id, p.sort`)) as unknown as Array<Record<string, unknown>>;
  const out = rows.map((r) => ({
    network: network(String(r.facility)),
    facility: r.facility, locality: r.locality, phone: r.phone ?? "",
    name: r.name, specialty: r.specialty, register_checked: r.register_checked,
    profile: `${SITE}/doctor/${r.slug}`,
    claim_link: `${SITE}/claim-profile?profile=${encodeURIComponent(String(r.slug))}&src=hospital`,
  }));
  writeFileSync(OUT, JSON.stringify(out));
  console.log(`${out.length} unclaimed doctors in ${CITY} -> ${OUT}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
