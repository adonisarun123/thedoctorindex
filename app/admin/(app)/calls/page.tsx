import Link from "next/link";
import { sql } from "drizzle-orm";

import { logCallAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaff } from "@/lib/auth/session";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";

export const metadata = { title: "Call queue" };
export const dynamic = "force-dynamic";

/**
 * The confirmation call queue.
 *
 * Registration (22) and qualifications (15) come off the NMC register without
 * anyone speaking to anybody. The remaining points that matter — practice
 * confirmed (17), consultation fee (10), professional introduction (10) — do
 * not exist in any register or dataset, and the verified gate is 70. One
 * telephone call is the only instrument that collects them, so this page exists
 * to make that call short: the number to dial, the address to read back, and
 * the three fields, on one screen and one submit.
 *
 * Rows are ordered by what the call is worth. A doctor already holding 37 from
 * the register crosses the gate on one successful call; a doctor holding
 * nothing does not, however good the call. Calling the first group first is the
 * difference between a cluster that clears the gate and one that does not.
 *
 * Recall rules are read from the audit log rather than a new column: a number
 * that rings out returns after 2 days, anything else after 90.
 */

interface Row {
  doctor_id: string;
  practice_id: string;
  name: string;
  specialty_key: string;
  quality_score: number;
  phone: string;
  facility: string;
  address: string;
  locality: string;
  city: string;
  about_len: number;
  fee_inr: number | null;
  reg_verified: boolean;
  quals_total: number;
  quals_verified: number;
  last_outcome: string | null;
}

export default async function AdminCalls({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const city = typeof sp.city === "string" && sp.city ? sp.city : "Jabalpur";
  const speciality = typeof sp.speciality === "string" && sp.speciality ? sp.speciality : "general-practice";
  const db = getDb();

  const cities = (await db.execute(sql`
    select l.city, count(distinct d.id)::int as n
    from doctors d
    join doctor_practices p on p.doctor_id = d.id and p.active
    join facilities f on f.id = p.facility_id
    join localities l on l.key = f.locality_key
    where d.status = 'published' and p.confirmed_on is null
      and coalesce(p.phone, f.phone) is not null and coalesce(p.phone, f.phone) <> ''
    group by 1 order by 2 desc limit 8`)) as unknown as Array<{ city: string; n: number }>;

  const specialities = (await db.execute(sql`
    select d.specialty_key as k, count(distinct d.id)::int as n
    from doctors d
    join doctor_practices p on p.doctor_id = d.id and p.active
    join facilities f on f.id = p.facility_id
    join localities l on l.key = f.locality_key
    where d.status = 'published' and p.confirmed_on is null and l.city = ${city}
      and coalesce(p.phone, f.phone) is not null and coalesce(p.phone, f.phone) <> ''
    group by 1 order by 2 desc limit 10`)) as unknown as Array<{ k: string; n: number }>;

  const rows = (await db.execute(sql`
    with call_log as (
      select entity_id,
             max(created_at) as last_called,
             (array_agg(after ->> 'outcome' order by created_at desc))[1] as last_outcome
      from audit_logs where action = 'doctor.call.logged' group by 1
    )
    select d.id as doctor_id, p.id as practice_id, d.name, d.specialty_key,
           d.quality_score, coalesce(p.phone, f.phone) as phone,
           f.name as facility, f.address, l.name as locality, l.city,
           length(d.about) as about_len, p.fee_inr,
           exists (select 1 from medical_registrations m where m.doctor_id = d.id and m.checked_on is not null) as reg_verified,
           (select count(*)::int from doctor_qualifications q where q.doctor_id = d.id) as quals_total,
           (select count(*)::int from doctor_qualifications q where q.doctor_id = d.id and q.state = 'verified') as quals_verified,
           cl.last_outcome
    from doctors d
    join doctor_practices p on p.doctor_id = d.id and p.active
    join facilities f on f.id = p.facility_id
    join localities l on l.key = f.locality_key
    left join call_log cl on cl.entity_id = d.id::text
    where d.status = 'published'
      and l.city = ${city} and d.specialty_key = ${speciality}
      and coalesce(p.phone, f.phone) is not null and coalesce(p.phone, f.phone) <> ''
      and p.confirmed_on is null
      and (cl.last_called is null
           or (cl.last_outcome = 'no_answer' and cl.last_called < now() - interval '2 days')
           or (cl.last_outcome not in ('no_answer', 'declined', 'wrong_number')
               and cl.last_called < now() - interval '90 days'))
    order by
      (case when exists (select 1 from medical_registrations m
                          where m.doctor_id = d.id and m.checked_on is not null) then 22 else 0 end
       + case when (select count(*) from doctor_qualifications q where q.doctor_id = d.id) > 0
                   and (select count(*) from doctor_qualifications q where q.doctor_id = d.id)
                     = (select count(*) from doctor_qualifications q
                         where q.doctor_id = d.id and q.state = 'verified')
              then 15 else 0 end) desc,
      d.name asc
    limit 60`)) as unknown as Row[];

  const spLabel = (k: string) => SPECIALTIES[k as keyof typeof SPECIALTIES]?.name ?? k;

  // What the register has already banked, and what a perfect call adds on top.
  const held = (r: Row) => (r.reg_verified ? 22 : 0) + (r.quals_total > 0 && r.quals_total === r.quals_verified ? 15 : 0);
  const reachable = (r: Row) => held(r) + 17 + (r.fee_inr === null ? 10 : 0) + (r.about_len < 80 ? 10 : 0);
  const willClear = rows.filter((r) => reachable(r) >= 70).length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Call queue</h1>
          <div className="sub">
            {rows.length} to call in {city} · {spLabel(speciality)} · <b>{willClear}</b> of them cross 70 on one good call
          </div>
        </div>
        <Link className="btn quiet" href="/admin/doctors">All doctors</Link>
      </div>

      <div className="panel pad" style={{ marginBottom: "18px" }}>
        <div className="eyebrow">City</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "8px 0 14px" }}>
          {cities.map((c) => (
            <Link key={c.city} className="chip" href={`/admin/calls?city=${encodeURIComponent(c.city)}`} aria-current={c.city === city ? "page" : undefined}>
              {c.city} <span style={{ opacity: 0.6 }}>{c.n}</span>
            </Link>
          ))}
        </div>
        <div className="eyebrow">Speciality</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          {specialities.map((x) => (
            <Link
              key={x.k}
              className="chip"
              href={`/admin/calls?city=${encodeURIComponent(city)}&speciality=${x.k}`}
              aria-current={x.k === speciality ? "page" : undefined}
            >
              {spLabel(x.k)} <span style={{ opacity: 0.6 }}>{x.n}</span>
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="panel pad" style={{ color: "var(--muted)" }}>
          Nobody left to call here — every practice with a phone number is confirmed, or was called recently.
        </div>
      ) : null}

      {rows.map((r) => {
        const h = held(r);
        const canClear = reachable(r) >= 70;
        return (
          <div className="qcard" key={r.practice_id}>
            <div className="qh">
              <div>
                <div className="qt">
                  <Link href={`/admin/doctors/${r.doctor_id}`}>Dr {r.name}</Link>{" "}
                  <a className="btn solid" href={`tel:${r.phone.replace(/\s+/g, "")}`} style={{ marginLeft: "8px", fontSize: "13px" }}>
                    {r.phone}
                  </a>
                </div>
                <div className="qm">
                  {r.facility}, {r.address} · {r.locality}, {r.city}
                  {r.last_outcome ? ` · last call: ${r.last_outcome.replace("_", " ")}` : ""}
                </div>
              </div>
              <span className={`pill ${canClear ? "ok" : "wait"}`}>
                {r.quality_score} → {canClear ? "70+" : reachable(r)}
              </span>
            </div>

            <div className="mono" style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "10px" }}>
              holds {h} from the register · {r.reg_verified ? "registration verified" : "registration not yet verified"} ·{" "}
              {r.quals_verified}/{r.quals_total} qualifications verified
              {!canClear ? " — one call will not clear 70 here; the register has to land first" : ""}
            </div>

            <ActionForm action={logCallAction} submitLabel="Save call" resetOnSuccess>
              <input type="hidden" name="doctorId" value={r.doctor_id} />
              <input type="hidden" name="practiceId" value={r.practice_id} />

              <div style={{ display: "grid", gridTemplateColumns: "170px 140px 1fr", gap: "10px", alignItems: "start" }}>
                <label>
                  <span className="eyebrow">Outcome</span>
                  <select name="outcome" defaultValue="reached" style={{ width: "100%" }}>
                    <option value="reached">Reached the clinic</option>
                    <option value="no_answer">No answer</option>
                    <option value="wrong_number">Wrong number</option>
                    <option value="declined">Declined</option>
                  </select>
                </label>
                <label>
                  <span className="eyebrow">Fee (₹){r.fee_inr !== null ? " · on file" : ""}</span>
                  <input name="fee" type="number" min="0" step="10" defaultValue={r.fee_inr ?? ""} placeholder="600" style={{ width: "100%" }} />
                </label>
                <label>
                  <span className="eyebrow">Note (never published)</span>
                  <input name="note" type="text" placeholder="Receptionist asked us to call back Tuesday" style={{ width: "100%" }} />
                </label>
              </div>

              <label style={{ display: "block", marginTop: "10px" }}>
                <span className="eyebrow">
                  Introduction — 80 characters or more, factual, and without “best”, “top”, “no. 1” or “most trusted”, any of
                  which silently costs the 10 points{r.about_len >= 80 ? " · already on file" : ""}
                </span>
                <textarea
                  name="about"
                  rows={3}
                  style={{ width: "100%" }}
                  placeholder="At this clinic since 2009. Walk-ins in the morning, appointments after 5pm. Consults in Hindi and English."
                />
              </label>

              <label style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "10px", fontSize: "13.5px" }}>
                <input type="checkbox" name="confirm" defaultChecked />
                Doctor still practises at this address — confirm the location (worth 17)
              </label>
            </ActionForm>
          </div>
        );
      })}

      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "18px" }}>
        Ask only what is on the card: whether the doctor is still at this address, the consultation fee today, and two or three
        factual sentences about the practice. None of it is a medical question, and none of it needs the doctor personally — a
        receptionist can answer all three. A number that rings out returns to the queue in 2 days; a clinic that declines is
        parked for 90. The profile stays published and honestly labelled either way.
      </p>
    </>
  );
}
