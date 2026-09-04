import { and, desc, eq, ilike, lt } from "drizzle-orm";
import Link from "next/link";

import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Audit log" };

const PAGE = 100;

function pretty(v: unknown): string {
  if (v === null || v === undefined) return "";
  try {
    return JSON.stringify(v, null, 1).replace(/^\{\n?|\n?\}$/g, "").trim();
  } catch {
    return String(v);
  }
}

export default async function AdminAudit({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const entity = typeof sp.entity === "string" ? sp.entity.trim() : "";
  const action = typeof sp.action === "string" ? sp.action.trim() : "";
  const before = typeof sp.before === "string" ? sp.before : "";
  const conds = [];
  if (entity) conds.push(eq(s.auditLogs.entityId, entity));
  if (action) conds.push(ilike(s.auditLogs.action, `%${action}%`));
  if (before) conds.push(lt(s.auditLogs.createdAt, new Date(before)));
  const rows = await getDb().query.auditLogs.findMany({ where: conds.length ? and(...conds) : undefined, with: { actor: true }, orderBy: [desc(s.auditLogs.createdAt)], limit: PAGE });
  const last = rows[rows.length - 1];
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (entity) p.set("entity", entity);
    if (action) p.set("action", action);
    for (const [k, v] of Object.entries(extra)) p.set(k, v);
    return `/admin/audit?${p.toString()}`;
  };

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Audit log</h1>
          <div className="sub">Every write on the platform, by whom, with before/after and the reason given. Append-only; nothing here is editable.</div>
        </div>
      </div>

      <form className="admin-search" method="get" action="/admin/audit">
        <input type="text" name="entity" defaultValue={entity} placeholder="Entity id (doctor, review, …)" className="mono" aria-label="Entity id" />
        <input type="text" name="action" defaultValue={action} placeholder="Action contains… e.g. review., doctor.field" className="mono" aria-label="Action" />
        <button type="submit" className="btn">Filter</button>
        {entity || action ? <Link className="btn quiet" href="/admin/audit">Clear</Link> : null}
      </form>

      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>No entries.</div> : null}
      {rows.map((a) => (
        <details className="qcard" key={a.id}>
          <summary style={{ cursor: "pointer", listStyle: "none" }}>
            <div className="qh" style={{ marginBottom: 0 }}>
              <div>
                <div className="qt"><span className="mono">{a.action}</span> <span style={{ color: "var(--muted)", fontWeight: 400 }}>on {a.entityType}</span> {a.entityId ? <Link href={a.entityType === "doctor" ? `/admin/doctors/${a.entityId}` : qs({ entity: a.entityId })} className="mono" style={{ fontSize: "12px" }}>{a.entityId.slice(0, 8)}</Link> : null}</div>
                <div className="qm">{toDisplay(a.createdAt)} · {a.actor?.email ?? a.actor?.phone ?? "system"} ({a.actorRole ?? "—"}){a.reason ? ` · ${a.reason}` : ""}</div>
              </div>
            </div>
          </summary>
          {a.before || a.after ? (
            <div className="two" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "10px" }}>
              <div><div className="eyebrow">Before</div><pre className="pre">{pretty(a.before) || "—"}</pre></div>
              <div><div className="eyebrow">After</div><pre className="pre">{pretty(a.after) || "—"}</pre></div>
            </div>
          ) : <div className="qm" style={{ marginTop: "8px" }}>No payload recorded.</div>}
        </details>
      ))}

      {rows.length === PAGE && last ? <div style={{ marginTop: "12px" }}><Link className="btn quiet" href={qs({ before: last.createdAt.toISOString() })}>Older entries →</Link></div> : null}
    </>
  );
}
