import { desc, inArray } from "drizzle-orm";
import Link from "next/link";

import { decideSubmissionAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import type { SubmissionPayload } from "@/lib/services/workflow";
import { findDuplicateByRegistration } from "@/lib/services/workflow";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "New profile submissions" };

export default async function AdminSubmissions({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const localityNames = Object.fromEntries((await getGeo()).localities.map((l) => [l.key, `${l.name}, ${l.city}`]));
  await requireStaff();
  const sp = await searchParams;
  const showAll = sp.all === "1";
  const rows = await getDb().query.doctorSubmissions.findMany({
    where: showAll ? undefined : inArray(s.doctorSubmissions.status, ["submitted", "in_review", "needs_info"]),
    with: { user: true, doctor: true },
    orderBy: [desc(s.doctorSubmissions.createdAt)],
    limit: 100,
  });
  const dupes = await Promise.all(rows.map((r) => (r.status === "approved" ? null : findDuplicateByRegistration(r.council, r.registrationNumber))));

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>New profile submissions</h1>
          <div className="sub">Registration-first. Match council + number in the register, then decide. Approval publishes the profile as claimed by the submitter.</div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/submissions" : "/admin/submissions?all=1"}>{showAll ? "Open only" : "Show decided"}</Link>
      </div>

      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Queue is empty.</div> : null}
      {rows.map((r, i) => {
        const p = r.payload as SubmissionPayload;
        const dupe = dupes[i];
        return (
          <div className="qcard" key={r.id}>
            <div className="qh">
              <div>
                <div className="qt">Dr {p.name} · {SPECIALTIES[p.specialtyKey as keyof typeof SPECIALTIES]?.name ?? p.specialtyKey}</div>
                <div className="qm">{r.council} · {r.registrationNumber} · submitted {toDisplay(r.createdAt)} by {r.user.email ?? r.user.phone}</div>
              </div>
              <span className={`pill ${r.status === "approved" ? "ok" : r.status === "rejected" ? "warn" : "wait"}`}>{r.status.replace("_", " ")}</span>
            </div>
            {dupe ? (
              <div className="notice alert" style={{ marginBottom: "10px", fontSize: "13px" }}>
                <b>Duplicate registration.</b> A profile already exists: <Link href={`/admin/doctors/${dupe.doctorId}`}>Dr {dupe.name}</Link> ({dupe.status}{dupe.claimed ? ", claimed" : ""}). Reject this and point the submitter to the claim flow.
              </div>
            ) : null}
            <dl className="kvi">
              <dt>Subspecialities</dt><dd>{p.subspecialties?.join(", ") || "—"}</dd>
              <dt>Practice start</dt><dd>{p.practiceStartYear ?? "—"}</dd>
              <dt>Languages / modes</dt><dd>{p.languages?.join(", ") || "—"} · {p.modes?.join(", ") || "—"}</dd>
              <dt>Qualifications</dt><dd>{p.qualifications?.length ? p.qualifications.map((q) => `${q.degree} · ${q.institution}${q.year ? ` · ${q.year}` : ""}`).join("; ") : "—"}</dd>
              <dt>Practice</dt><dd>{p.practice ? `${p.practice.facilityName}, ${localityNames[p.practice.localityKey] ?? p.practice.localityKey} · ${p.practice.address} · ${p.practice.days} ${p.practice.hours} · ₹${p.practice.feeInr ?? "—"} · ${p.practice.phone}` : "—"}</dd>
              <dt>Services</dt><dd>{p.services?.join(", ") || "—"}</dd>
              <dt>Introduction</dt><dd className="qb">{p.about || "—"}</dd>
              <dt>Consents</dt><dd className="mono" style={{ fontSize: "11.5px" }}>publish {p.consents?.publish ? "✓" : "✗"} · photo {p.consents?.photo ? "✓" : "✗"} · phone {p.consents?.phone ? "✓" : "✗"} · accurate {p.consents?.accurate ? "✓" : "✗"}</dd>
            </dl>
            {r.reviewerNote ? <div className="qb" style={{ marginTop: "6px" }}><b>Note:</b> {r.reviewerNote}</div> : null}
            {r.doctorId ? <div style={{ marginTop: "6px" }}><Link href={`/admin/doctors/${r.doctorId}`}>Open created profile →</Link></div> : null}

            {r.status !== "approved" && r.status !== "rejected" ? (
              <ActionForm action={decideSubmissionAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={r.id} />
                <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Decision</label>
                    <select name="decision" defaultValue="approved">
                      <option value="approved">Approve and publish</option>
                      <option value="needs_info">Needs more information</option>
                      <option value="in_review">Mark in review</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Note to submitter / for the record</label>
                    <input type="text" name="note" placeholder="Matched KMC register on 04 Sep; qualification pending university confirmation" />
                  </div>
                </div>
                <label className="consent" style={{ marginTop: "10px" }}><input type="checkbox" name="verify" defaultChecked /> I matched council + registration number in the state register (records a verification event)</label>
              </ActionForm>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
