import { desc } from "drizzle-orm";
import Link from "next/link";

import { queueCounts } from "@/lib/admin";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { GATES } from "@/lib/seo/gates";
import { requireStaff } from "@/lib/auth/session";

export default async function AdminOverview() {
  await requireStaff();
  const c = await queueCounts();
  const recent = await getDb().query.auditLogs.findMany({ orderBy: [desc(s.auditLogs.createdAt)], limit: 12 });

  const queues: Array<[string, string, number, string]> = [
    ["New profiles", "/admin/submissions", c.submissions, "target 2 business days"],
    ["Claims", "/admin/claims", c.claims, "competing claims go to a person"],
    ["Change requests", "/admin/changes", c.changes, "sensitive fields re-verify"],
    ["Review moderation", "/admin/reviews", c.reviews, `${c.high_risk_reviews} high-risk`],
    ["Reports & corrections", "/admin/reports", c.reports, `${c.safety} safety-priority`],
    ["New enquiries", "/admin/enquiries", c.enquiries, "forwarded to practices"],
    ["Register matching", "/admin/enrichment", c.enrichment_queue, "worker found more than one entry"],
  ];

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Operations</h1>
          <div className="sub">{c.published} published profiles · {c.drafts} drafts · {c.below_gate} published but below the quality gate ({GATES.profileQuality})</div>
        </div>
        <Link className="btn solid" href="/admin/doctors/new">Create a doctor profile</Link>
      </div>

      {c.safety > 0 ? (
        <div className="notice alert" style={{ marginBottom: "14px" }}>
          <b>{c.safety} safety-priority report{c.safety > 1 ? "s" : ""} open.</b> Initial assessment target is 4 hours. <Link href="/admin/reports">Open the queue →</Link>
        </div>
      ) : null}

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {queues.map(([label, href, n, note]) => (
          <Link key={href} href={href} className="tile" style={{ color: "inherit", textDecoration: "none" }}>
            <div className="l">{label}</div>
            <div className="v">{n}</div>
            <div className="d">{note}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "22px" }}>
        <div className="chart-head"><span className="t">Recent activity</span><Link href="/admin/audit" className="m">Full audit log →</Link></div>
        <table className="table">
          <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Actor</th><th>Reason</th></tr></thead>
          <tbody>
            {recent.map((a) => (
              <tr key={a.id}>
                <td className="mono">{toDisplay(a.createdAt)}</td>
                <td className="mono">{a.action}</td>
                <td style={{ fontSize: "13px" }}>{a.entityType} <span className="mono" style={{ color: "var(--muted)", fontSize: "11px" }}>{a.entityId?.slice(0, 8)}</span></td>
                <td style={{ fontSize: "13px" }}>{a.actorRole ?? "—"}</td>
                <td style={{ fontSize: "13px", color: "var(--muted)" }}>{a.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
