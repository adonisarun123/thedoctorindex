import Link from "next/link";

import { recomputeSeoAction, seoOverrideAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { toDisplay } from "@/lib/db/dates";
import { GATES } from "@/lib/seo/gates";
import { listSeoRoutes } from "@/lib/services/seo";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "SEO routes" };

export default async function AdminSeo() {
  await requireStaff();
  const routes = await listSeoRoutes();
  const indexable = routes.filter((r) => (r.override ? r.override === "force_index" : r.computedIndexable));
  const gateFor = (kind: string) => (kind === "national" ? GATES.nationalSpecialty : kind === "city" ? GATES.citySpecialty : GATES.localitySpecialty);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>SEO route allowlist</h1>
          <div className="sub">
            A listing page is indexed only when it has enough indexable doctors: national ≥ {GATES.nationalSpecialty}, city ≥ {GATES.citySpecialty}, locality ≥ {GATES.localitySpecialty}. {indexable.length} of {routes.length} routes qualify. Overrides are the exception, recorded with a reason.
          </div>
        </div>
        <form action={recomputeSeoAction}><button type="submit" className="btn solid">Recompute from live supply</button></form>
      </div>

      {routes.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>No routes computed yet. Run a recompute.</div> : null}

      <table className="table">
        <thead><tr><th>Route</th><th>Kind</th><th>Indexable doctors</th><th>Computed</th><th>Override</th><th>Updated</th><th></th></tr></thead>
        <tbody>
          {routes.map((r) => {
            const effective = r.override ? r.override === "force_index" : r.computedIndexable;
            return (
              <tr key={r.path} style={effective ? undefined : { color: "var(--muted)" }}>
                <td><Link href={r.path} target="_blank" className="mono" style={{ fontSize: "12.5px" }}>{r.path}</Link><div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.specialty?.name}{r.locality ? ` · ${r.locality.name}` : ""}</div></td>
                <td>{r.kind}</td>
                <td className="mono">{r.indexableCount} <span style={{ color: "var(--muted)" }}>/ {gateFor(r.kind)}</span></td>
                <td><span className={`pill ${r.computedIndexable ? "ok" : "neut"}`}>{r.computedIndexable ? "index" : "noindex"}</span></td>
                <td>{r.override ? <span className={`pill ${r.override === "force_index" ? "warn" : "wait"}`}>{r.override.replace("_", " ")}</span> : "—"}{r.note ? <div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.note}</div> : null}</td>
                <td className="mono" style={{ fontSize: "12px" }}>{toDisplay(r.updatedAt)}</td>
                <td>
                  <ActionForm action={seoOverrideAction} submitLabel="Set" variant="quiet" inline>
                    <input type="hidden" name="path" value={r.path} />
                    <select name="override" defaultValue={r.override ?? ""} style={{ width: "auto" }}><option value="">computed</option><option value="force_index">force index</option><option value="force_noindex">force noindex</option></select>
                    <input type="text" name="note" placeholder="reason" defaultValue={r.note ?? ""} style={{ width: "140px" }} />
                  </ActionForm>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
