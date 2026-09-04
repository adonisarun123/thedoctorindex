import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { decideClaimAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Profile claims" };

const METHOD: Record<string, string> = { practice_otp: "OTP to practice number on file", work_email: "Hospital / clinic email domain", practice_admin: "Practice administrator confirmation", document: "Supporting document" };

export default async function AdminClaims({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const showAll = sp.all === "1";
  const rows = await getDb().query.doctorClaims.findMany({ where: showAll ? undefined : eq(s.doctorClaims.status, "pending"), with: { doctor: true, user: true }, orderBy: [desc(s.doctorClaims.createdAt)], limit: 100 });

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Profile claims</h1>
          <div className="sub">Verify control before transferring it. Never reveal one claimant&rsquo;s contact details to another. Approving one claim closes competing pending claims on the same profile.</div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/claims" : "/admin/claims?all=1"}>{showAll ? "Pending only" : "Show decided"}</Link>
      </div>
      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Queue is empty.</div> : null}
      {rows.map((c) => (
        <div className="qcard" key={c.id}>
          <div className="qh">
            <div>
              <div className="qt"><Link href={`/admin/doctors/${c.doctorId}`}>Dr {c.doctor.name}</Link> {c.doctor.claimed ? <span className="pill warn" style={{ marginLeft: "6px" }}>already claimed</span> : <span className="pill neut" style={{ marginLeft: "6px" }}>unclaimed</span>}</div>
              <div className="qm">claim {c.id.slice(0, 8)} · {toDisplay(c.createdAt)} · by {c.user.email ?? c.user.phone}</div>
            </div>
            <span className={`pill ${c.status === "approved" ? "ok" : c.status === "rejected" ? "warn" : "wait"}`}>{c.status}</span>
          </div>
          <dl className="kvi">
            <dt>Registration given</dt><dd className="mono">{c.registrationNumber}</dd>
            <dt>Method</dt><dd>{METHOD[c.method]}</dd>
            {c.evidenceFileId ? <><dt>Evidence</dt><dd><Link href={`/admin/files/${c.evidenceFileId}`} target="_blank">Open private document ↗</Link></dd></> : null}
            {c.note ? <><dt>Note</dt><dd>{c.note}</dd></> : null}
          </dl>
          {c.status === "pending" ? (
            <ActionForm action={decideClaimAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
              <input type="hidden" name="id" value={c.id} />
              <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                <div className="field" style={{ marginBottom: 0 }}><label>Decision</label><select name="decision" defaultValue="approved"><option value="approved">Approve — transfer control</option><option value="rejected">Reject</option></select></div>
                <div className="field" style={{ marginBottom: 0 }}><label>How control was confirmed</label><input type="text" name="note" placeholder="OTP to +91 80… confirmed on 04 Sep" /></div>
              </div>
            </ActionForm>
          ) : null}
        </div>
      ))}
    </>
  );
}
