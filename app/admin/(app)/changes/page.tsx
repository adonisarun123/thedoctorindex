import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { decideChangeAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Change requests" };

function fmt(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  return typeof v === "object" ? JSON.stringify(v) : String(v);
}

export default async function AdminChanges({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const showAll = sp.all === "1";
  const rows = await getDb().query.profileChangeRequests.findMany({ where: showAll ? undefined : eq(s.profileChangeRequests.status, "pending"), with: { doctor: true, requestedBy: true }, orderBy: [desc(s.profileChangeRequests.createdAt)], limit: 150 });

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Change requests</h1>
          <div className="sub">Only sensitive fields land here — name, gender, speciality, and address changes awaiting practice confirmation. Everything else published on save and is in the audit log.</div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/changes" : "/admin/changes?all=1"}>{showAll ? "Pending only" : "Show all"}</Link>
      </div>
      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Queue is empty.</div> : null}
      {rows.map((c) => (
        <div className="qcard" key={c.id}>
          <div className="qh">
            <div>
              <div className="qt"><Link href={`/admin/doctors/${c.doctorId}`}>Dr {c.doctor.name}</Link> · <span className="mono">{c.field}</span></div>
              <div className="qm">{c.id.slice(0, 8)} · {toDisplay(c.createdAt)} · by {c.requestedBy.email ?? c.requestedBy.phone} {c.sensitive ? "· sensitive" : ""}</div>
            </div>
            <span className={`pill ${c.status === "published" ? "ok" : c.status === "rejected" ? "warn" : "wait"}`}>{c.status}</span>
          </div>
          <dl className="kvi">
            <dt>From</dt><dd style={{ color: "var(--muted)" }}>{fmt(c.fromValue)}</dd>
            <dt>To</dt><dd>{fmt(c.toValue)}</dd>
            {c.note ? <><dt>Note</dt><dd>{c.note}</dd></> : null}
          </dl>
          {c.status === "pending" ? (
            <ActionForm action={decideChangeAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
              <input type="hidden" name="id" value={c.id} />
              <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                <div className="field" style={{ marginBottom: 0 }}><label>Decision</label><select name="decision" defaultValue="published"><option value="published">Approve and publish</option><option value="rejected">Reject</option></select></div>
                <div className="field" style={{ marginBottom: 0 }}><label>Verification note</label><input type="text" name="note" placeholder={c.field === "name" ? "Matches register entry for KMC-…" : "Practice confirmed by phone on …"} /></div>
              </div>
            </ActionForm>
          ) : null}
        </div>
      ))}
    </>
  );
}
