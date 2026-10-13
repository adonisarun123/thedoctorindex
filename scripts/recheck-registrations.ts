import { writeFileSync } from "node:fs";

import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { accountNameMatches } from "../lib/nmc/instant-match";
import { audit } from "../lib/services/audit";
import { recomputeQuality } from "../lib/services/doctors";

config({ path: ".env.local" });
config();

/**
 * Re-check every "Registration checked" registration against the council
 * register we hold (nmc_register), on council AND name — not number alone.
 *
 *   npx tsx --require ./scripts/server-only-shim.cjs scripts/recheck-registrations.ts [--apply] [--out path.csv]
 *
 * Registration numbers are per council and collide across councils (KMC 12345
 * and TNMC 12345 are two people). A check that matched on the number only can
 * have put the "Registration checked" chip on the wrong person. This script
 * classifies each checked registration:
 *
 *   ok                 number + council agree with a register row whose name fits the doctor
 *   council_differs    number + name fit a register row, but under a different council (data entry; kept)
 *   collision          several councils hold this number and ours says none / none fits by name
 *   name_mismatch      number + council match a register row, but the names share no word → wrong person
 *   not_in_register    no register row carries this number (checked by another route: NMC online, document)
 *
 * With --apply, name_mismatch rows lose checked_on (the chip comes off), get a
 * verification_checks row with result "failed" and an audit line, and the
 * profile's quality is recomputed. Everything else is report-only.
 */

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const OUT = args[args.indexOf("--out") + 1] && args.includes("--out") ? args[args.indexOf("--out") + 1] : "Claude outputs/TDI registration re-check.csv";


async function main() {
  const db = getDb();
  // Set-based: one pass over the register per registration number, with the
  // name overlap computed in SQL. 236k registrations are "checked" — most of
  // them register-sourced drafts whose row IS the register row — so a
  // per-row loop would take an hour; this takes a minute.
  const rows = (await db.execute(sql`
    with reg as (
      select r.id as reg_id, d.id as doctor_id, d.slug, d.name as doctor_name, r.council, r.council_normalized as council_norm,
             r.number, r.number_normalized as number_norm, r.checked_on::text as checked_on, r.source, d.status, d.claimed,
             (select array_agg(w) from unnest(regexp_split_to_array(lower(regexp_replace(d.name, '[^A-Za-z ]', ' ', 'g')), '\\s+')) w
               where length(w) >= 3 and w not in ('dr','prof','mrs')) as dwords
      from medical_registrations r
      join doctors d on d.id = r.doctor_id
      where r.checked_on is not null and d.merged_into_id is null
    ),
    cand as (
      select reg.reg_id, n.name as reg_name, n.council as reg_council, n.council_normalized as reg_council_norm, n.source_record_id,
             (reg.council_norm = n.council_normalized) as same_council,
             coalesce((select count(*) from unnest(regexp_split_to_array(lower(regexp_replace(n.name, '[^A-Za-z ]', ' ', 'g')), '\\s+')) w
                where length(w) >= 3 and w = any(reg.dwords)), 0)::int as shared
      from reg join nmc_register n on n.number_normalized = reg.number_norm
    ),
    agg as (
      select reg_id,
             count(*)::int as n_cands,
             count(*) filter (where same_council)::int as n_same,
             max(shared) filter (where same_council) as best_same_shared,
             max(shared) as best_any_shared,
             (array_agg(reg_name order by same_council desc, shared desc))[1] as best_name,
             (array_agg(reg_council order by same_council desc, shared desc))[1] as best_council
      from cand group by reg_id
    )
    select reg.*, agg.n_cands, agg.n_same, agg.best_same_shared, agg.best_any_shared, agg.best_name, agg.best_council
    from reg left join agg on agg.reg_id = reg.reg_id
  `)) as unknown as Array<Record<string, unknown>>;
  console.log(`checked registrations: ${rows.length}`);

  const out: string[] = ["slug,doctor,council,number,checked_on,source,claimed,class,register_matches,best_register_name,best_register_council,shared_words,name_fit,action"];
  const counts: Record<string, number> = {};
  let applied = 0;

  for (const r of rows) {
    const doctorName = String(r.doctor_name);
    const councilNorm = String(r.council_norm ?? "");
    const unstated = !councilNorm || councilNorm === "COUNCILNOTSTATED";
    const nCands = Number(r.n_cands ?? 0);
    const nSame = Number(r.n_same ?? 0);
    const bestSame = r.best_same_shared === null || r.best_same_shared === undefined ? null : Number(r.best_same_shared);
    const bestAny = Number(r.best_any_shared ?? 0);
    const bestName = (r.best_name as string | null) ?? "";
    const fit = bestName ? accountNameMatches(bestName, doctorName).ok : false;
    let klass: string;
    let action = "";
    if (!nCands) klass = "not_in_register";
    else if (nSame) klass = (bestSame ?? 0) >= 1 ? (fit ? "ok" : "ok_weak_name") : "name_mismatch";
    else if (fit || bestAny >= 2) klass = unstated ? "ok" : "council_differs";
    else klass = unstated ? "collision" : "not_in_register_for_council";
    if (klass === "name_mismatch") {
      // "Ravi Shankar" vs "RAVISHANKAR R.", "K. S. Premlal" vs "Prem Lal, Kochiparambath…": the
      // same person with the spaces in different places. Compare with the spaces removed.
      const compact = (x: string) => x.toLowerCase().replace(/[^a-z]/g, "");
      const longWord = doctorName.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 5).sort((x, y) => y.length - x.length)[0];
      const near = (x: string, y: string) => {
        if (Math.abs(x.length - y.length) > 1) return false;
        let i = 0, j = 0, edits = 0;
        while (i < x.length && j < y.length) {
          if (x[i] === y[j]) { i++; j++; continue; }
          if (++edits > 1) return false;
          if (x.length > y.length) i++; else if (y.length > x.length) j++; else { i++; j++; }
        }
        return edits + (x.length - i) + (y.length - j) <= 1;
      };
      const dWords = doctorName.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 5);
      const rWords = bestName.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 5);
      if (longWord && compact(bestName).includes(longWord)) klass = "ok_weak_name";
      else if (dWords.some((d) => rWords.some((r) => near(d, r)))) klass = "ok_weak_name";
      // Read by a person on 13 Oct 2026 and judged the same doctor despite the spelling (Sanjiv Goel ↔ "Govel Sanjeev").
      else if (["sanjiv-goel-a944d2"].includes(String(r.slug))) klass = "ok_weak_name";
      // A claimed profile's number came from the doctor: an officer asks them, the chip is not pulled by a script.
      else if (r.claimed) klass = "claimed_mismatch_for_officer";
      // A register row whose "name" is a university or a placeholder is a bad row, not a wrong doctor.
      else if (/\b(univ|university|sciences|college|medical|hospital|institute|tamilnadu|dr\.)\b|^u\./i.test(bestName)) klass = "register_row_corrupt";
    }

    counts[klass] = (counts[klass] ?? 0) + 1;
    if (klass === "name_mismatch" && APPLY) {
      const regId = String(r.reg_id);
      const doctorId = String(r.doctor_id);
      await db.update(s.medicalRegistrations).set({ checkedOn: null }).where(eq(s.medicalRegistrations.id, regId));
      await db.insert(s.verificationChecks).values({ doctorId, kind: "registration", subjectId: regId, result: "failed", source: "recheck:nmc_register", note: `Re-check 13 Oct 2026: register row for ${r.council} ${r.number} is "${bestName}", which shares no name with "${doctorName}". Checked flag removed pending a document or an officer's look.` });
      await audit({ actorUserId: null, actorRole: "staff", action: "registration.recheck_failed", entityType: "doctor", entityId: doctorId, before: { checkedOn: r.checked_on }, after: { checkedOn: null, registerName: bestName }, reason: "council+name re-check" });
      await recomputeQuality(doctorId);
      applied++;
      action = "unchecked";
    }
    if (klass === "ok") continue; // the report lists only what needs eyes
    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    out.push([r.slug, doctorName, r.council, r.number, r.checked_on, r.source, r.claimed, klass, nCands, bestName, r.best_council, bestSame ?? bestAny, fit, action].map(q).join(","));
  }
  writeFileSync(OUT, out.join("\n"));
  console.log(JSON.stringify({ counts, applied, out: OUT }, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
