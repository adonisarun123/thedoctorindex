import Link from "next/link";

import { recomputeSeoAction, seoOverrideAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { toDisplay } from "@/lib/db/dates";
import { GATES } from "@/lib/seo/gates";
import { listSeoRoutes, seoRouteSummary, type SeoRouteFilter } from "@/lib/services/seo";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "SEO routes" };

const KINDS = ["national", "city", "locality"] as const;
const STATUSES = ["index", "noindex", "overridden"] as const;
const fmt = (n: number) => n.toLocaleString("en-IN");

/**
 * The route allowlist, nationwide. The table holds every listing route the
 * sitemap considers (12,000+ once supply is counted the way the pages count
 * it), so the page is a filtered, paged view with the totals up top.
 */
export default async function AdminSeo({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const kind = KINDS.find((k) => k === sp.kind);
  const status = STATUSES.find((st) => st === sp.status);
  const page = Math.max(1, Number.parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);
  const filter: SeoRouteFilter = { q: q || undefined, kind, status, page };
  const [summary, list] = await Promise.all([seoRouteSummary(), listSeoRoutes(filter)]);
  const gateFor = (k: string) => (k === "national" ? GATES.nationalSpecialty : k === "city" ? GATES.citySpecialty : GATES.localitySpecialty);
  const href = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (kind) u.set("kind", kind);
    if (status) u.set("status", status);
    if (p > 1) u.set("page", String(p));
    const qs = u.toString();
    return `/admin/seo${qs ? `?${qs}` : ""}`;
  };
  const filtered = Boolean(q || kind || status);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>SEO route allowlist</h1>
          <div className="sub">
            Every browse page the sitemap considers, counted the way the page counts: national ≥ {GATES.nationalSpecialty}, city ≥ {GATES.citySpecialty}, locality ≥ {GATES.localitySpecialty} eligible doctors. Overrides are the exception, recorded with a reason.
            {summary.updatedAt ? <> Last recomputed {toDisplay(summary.updatedAt)}.</> : null}
          </div>
        </div>
        <form action={recomputeSeoAction}><button type="submit" className="btn solid">Recompute from live supply</button></form>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(6, 1fr)", marginBottom: 14 }}>
        <Link href="/admin/seo" className="tile link"><div className="l">Routes</div><div className="v">{fmt(summary.total)}</div><div className="d flat">{fmt(summary.indexable)} index</div></Link>
        <Link href="/admin/seo?kind=national" className="tile link"><div className="l">National</div><div className="v">{fmt(summary.byKind.national.indexable)}<small>of {fmt(summary.byKind.national.total)}</small></div><div className="d flat">speciality pages</div></Link>
        <Link href="/admin/seo?kind=city" className="tile link"><div className="l">City × speciality</div><div className="v">{fmt(summary.byKind.city.indexable)}<small>of {fmt(summary.byKind.city.total)}</small></div><div className="d flat">{fmt(summary.cities)} cities, {fmt(summary.states)} states</div></Link>
        <Link href="/admin/seo?kind=locality" className="tile link"><div className="l">Locality × speciality</div><div className="v">{fmt(summary.byKind.locality.indexable)}<small>of {fmt(summary.byKind.locality.total)}</small></div><div className="d flat">neighbourhood pages</div></Link>
        <Link href="/admin/seo?status=overridden" className="tile link"><div className="l">Overridden</div><div className="v">{fmt(summary.overridden)}</div><div className="d flat">staff decisions</div></Link>
        <Link href="/sitemap.xml" className="tile link" target="_blank"><div className="l">Sitemap</div><div className="v">↗</div><div className="d flat">what Google is told</div></Link>
      </div>

      <form className="admin-search" method="get" action="/admin/seo">
        <input type="search" name="q" defaultValue={q} placeholder="Path, city, speciality or locality — e.g. hyderabad/cardio" aria-label="Search routes" style={{ minWidth: 320 }} />
        <select name="kind" defaultValue={kind ?? ""} aria-label="Kind">
          <option value="">Any kind</option>
          {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select name="status" defaultValue={status ?? ""} aria-label="Status">
          <option value="">Any status</option>
          <option value="index">index</option>
          <option value="noindex">noindex</option>
          <option value="overridden">overridden</option>
        </select>
        <button type="submit" className="btn">Filter</button>
        {filtered ? <Link className="btn quiet" href="/admin/seo">Clear</Link> : null}
      </form>

      {summary.total === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>No routes computed yet. Run a recompute.</div> : null}

      <table className="table">
        <thead><tr><th>Route</th><th>Kind</th><th>Eligible doctors</th><th>Computed</th><th>Override</th><th>Updated</th><th></th></tr></thead>
        <tbody>
          {list.rows.length === 0 && summary.total > 0 ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No routes match.</td></tr> : null}
          {list.rows.map((r) => {
            const effective = r.override ? r.override === "force_index" : r.computedIndexable;
            return (
              <tr key={r.path} style={effective ? undefined : { color: "var(--muted)" }}>
                <td><Link href={r.path} target="_blank" className="mono" style={{ fontSize: "12.5px" }}>{r.path}</Link><div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.specialty?.name}{r.locality ? ` · ${r.locality.name}, ${r.locality.city}` : ""}</div></td>
                <td>{r.kind}</td>
                <td className="mono">{fmt(r.indexableCount)} <span style={{ color: "var(--muted)" }}>/ {gateFor(r.kind)}</span></td>
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

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, fontSize: "13px", color: "var(--muted)" }}>
        <span>{fmt(list.total)} route{list.total === 1 ? "" : "s"}{filtered ? " match" : ""} · page {fmt(list.page)} of {fmt(list.pages)}</span>
        {list.page > 1 ? <Link className="btn quiet" href={href(list.page - 1)}>← Previous</Link> : null}
        {list.page < list.pages ? <Link className="btn quiet" href={href(list.page + 1)}>Next →</Link> : null}
      </div>
    </>
  );
}
