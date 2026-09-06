import { desc, inArray, sql } from "drizzle-orm";
import Link from "next/link";

import { acceptRegisterCandidateAction, dismissEnrichmentAction, resetEnrichmentAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Register matching" };
export const dynamic = "force-dynamic";

interface CandidateRow {
  doctorId: string;
  registrationNo: string;
  council: string;
  name: string;
  year: number | null;
  degree: string | null;
  university: string | null;
  place: string | null;
  removed: boolean;
}

/**
 * The enrichment worker's queue: profiles where the NMC register returned more
 * than one plausible entry, a number on file that belongs to someone else, or a
 * struck-off entry. A verification officer picks the right entry (or none).
 * Progress counters for the whole run sit at the top.
 */
export default async function AdminEnrichment({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const view = typeof sp.view === "string" ? sp.view : "queue";
  const db = getDb();

  const [counts] = (await db.execute(sql`select
      count(*)::int as total,
      count(*) filter (where nmc_status = 'pending')::int as nmc_pending,
      count(*) filter (where nmc_status = 'confirmed')::int as nmc_confirmed,
      count(*) filter (where nmc_status = 'matched')::int as nmc_matched,
      count(*) filter (where nmc_status = 'not_found')::int as nmc_not_found,
      count(*) filter (where nmc_status = 'not_applicable')::int as nmc_na,
      count(*) filter (where nmc_status in ('ambiguous','number_mismatch','removed'))::int as nmc_queue,
      count(*) filter (where nmc_status = 'dismissed')::int as nmc_dismissed,
      count(*) filter (where google_status = 'pending')::int as g_pending,
      count(*) filter (where google_status = 'matched')::int as g_matched,
      count(*) filter (where google_status = 'no_match')::int as g_no_match,
      count(*) filter (where google_status in ('skipped','error'))::int as g_other,
      count(*) filter (where last_error is not null)::int as errors,
      max(updated_at) as last_run
    from doctor_enrichment`)) as unknown as Array<Record<string, number | string | null>>;

  const statuses = view === "errors" ? ["error"] : view === "not_found" ? ["not_found"] : ["ambiguous", "number_mismatch", "removed"];
  const rows = await db.query.doctorEnrichment.findMany({
    where: view === "errors" ? sql`${s.doctorEnrichment.lastError} is not null` : inArray(s.doctorEnrichment.nmcStatus, statuses),
    with: { doctor: { with: { registrations: true, practices: { where: (p, { eq }) => eq(p.active, true), with: { facility: { with: { locality: true } } } } } } },
    orderBy: [desc(s.doctorEnrichment.updatedAt)],
    limit: 60,
  });

  const n = (k: string) => Number(counts?.[k] ?? 0);
  const tiles: Array<[string, number, string]> = [
    ["Register: confirmed", n("nmc_confirmed"), "number on file found under this name"],
    ["Register: filled", n("nmc_matched"), "number added from a unique match"],
    ["Register: in queue", n("nmc_queue"), "needs a person"],
    ["Register: not found", n("nmc_not_found"), "no entry under this name and council"],
    ["Register: pending", n("nmc_pending"), `${n("nmc_na")} not on the NMC register (dental, AYUSH, allied)`],
    ["Google: matched", n("g_matched"), `${n("g_no_match")} no listing · ${n("g_pending")} pending`],
  ];

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Register matching</h1>
          <div className="sub">
            {n("total").toLocaleString("en-IN")} published profiles tracked · last worker activity {counts?.last_run ? toDisplay(new Date(String(counts.last_run))) : "never"} · {n("errors")} with errors
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link className={`btn ${view === "queue" ? "solid" : "quiet"}`} href="/admin/enrichment">Queue</Link>
          <Link className={`btn ${view === "not_found" ? "solid" : "quiet"}`} href="/admin/enrichment?view=not_found">Not found</Link>
          <Link className={`btn ${view === "errors" ? "solid" : "quiet"}`} href="/admin/enrichment?view=errors">Errors</Link>
        </div>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "22px" }}>
        {tiles.map(([label, v, note]) => (
          <div key={label} className="tile">
            <div className="l">{label}</div>
            <div className="v">{v.toLocaleString("en-IN")}</div>
            <div className="d">{note}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Nothing here.</div> : null}
      {rows.map((r) => {
        const d = r.doctor;
        const sp = specialtyByKey(d.specialtyKey);
        const practice = d.practices[0];
        const loc = practice?.facility.locality;
        const reg = d.registrations.find((x) => x.isPrimary) ?? d.registrations[0];
        const candidates = (r.nmcCandidates as CandidateRow[] | null) ?? [];
        return (
          <div className="qcard" key={r.doctorId}>
            <div className="qh">
              <div>
                <div className="qt">
                  <Link href={`/admin/doctors/${d.id}`}>Dr {d.name}</Link> · {sp?.name ?? d.specialtyKey}
                </div>
                <div className="qm">
                  {practice ? `${practice.facility.name}, ${practice.facility.address}` : "no practice"}{loc ? ` · ${loc.name}, ${loc.city}, ${loc.state}` : ""}
                  {reg ? ` · on file: ${reg.council} ${reg.number}${reg.checkedOn ? " (checked)" : ""}` : " · no number on file"}
                </div>
              </div>
              <span className={`pill ${r.nmcStatus === "removed" ? "warn" : "wait"}`}>{r.nmcStatus.replace("_", " ")}</span>
            </div>
            {r.lastError ? <div className="notice alert" style={{ marginBottom: "10px", fontSize: "13px" }}>{r.lastError}</div> : null}
            <div className="mono" style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "8px" }}>query: {r.nmcQuery ?? "—"}</div>
            {candidates.length ? (
              <table className="table" style={{ marginBottom: "10px" }}>
                <thead><tr><th>Register name</th><th>Council · number</th><th>Year</th><th>Degree · university</th><th>Place</th><th /></tr></thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={`${c.council}|${c.registrationNo}`}>
                      <td>{c.name}{c.removed ? <span className="pill warn" style={{ marginLeft: "6px" }}>struck off</span> : null}</td>
                      <td className="mono" style={{ fontSize: "12px" }}>{c.council} · {c.registrationNo}</td>
                      <td className="mono">{c.year ?? "—"}</td>
                      <td style={{ fontSize: "13px" }}>{c.degree ?? "—"}{c.university ? ` · ${c.university}` : ""}</td>
                      <td style={{ fontSize: "13px" }}>{c.place ?? "—"}</td>
                      <td>
                        {c.removed ? null : (
                          <ActionForm action={acceptRegisterCandidateAction} submitLabel="This one" confirm={`Record ${c.council} ${c.registrationNo} (${c.name}) as Dr ${d.name}'s verified registration?`}>
                            <input type="hidden" name="doctorId" value={d.id} />
                            <input type="hidden" name="registrationNo" value={c.registrationNo} />
                            <input type="hidden" name="council" value={c.council} />
                            <input type="hidden" name="year" value={c.year ?? ""} />
                            <input type="hidden" name="registerName" value={c.name} />
                          </ActionForm>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <ActionForm action={dismissEnrichmentAction} submitLabel="None of these — leave unverified">
                <input type="hidden" name="doctorId" value={d.id} />
              </ActionForm>
              <ActionForm action={resetEnrichmentAction} submitLabel="Retry on next run">
                <input type="hidden" name="doctorId" value={d.id} />
              </ActionForm>
            </div>
          </div>
        );
      })}
      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "18px" }}>
        The worker runs hourly (GitHub Actions → “Enrich doctor profiles”). It fills a number only when exactly one register entry matches the name in the state's councils; everything else lands here. Candidates show register data only (no father's name, date of birth or address).
      </p>
    </>
  );
}
