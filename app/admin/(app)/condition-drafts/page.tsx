import Link from "next/link";

import { requireStaff } from "@/lib/auth/session";
import { conditionDraftManifest, filterConditionDrafts } from "@/lib/content/condition-drafts";
import { privateMeta } from "@/lib/seo/meta";

export const metadata = privateMeta("Condition article drafts");

export default async function ConditionDrafts({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const department = typeof sp.department === "string" ? sp.department : "";
  const limited = sp.coverage === "limited";
  const manifest = await conditionDraftManifest();
  const matches = filterConditionDrafts(manifest, q, department, limited);
  const pages = Math.max(1, Math.ceil(matches.length / 50));
  const requested = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isSafeInteger(requested) ? Math.min(pages, Math.max(1, requested)) : 1;
  const rows = matches.slice((page - 1) * 50, page * 50);
  const departments = [...new Set(manifest.map((row) => row.department))].sort();
  const limitedCount = manifest.filter((row) => row.condition_source_word_count < 350).length;
  function pageUrl(value: number) {
    const params = new URLSearchParams({ page: String(value) });
    if (q) params.set("q", q);
    if (department) params.set("department", department);
    if (limited) params.set("coverage", "limited");
    return `/admin/condition-drafts?${params}`;
  }
  return <>
    <div className="dash-head"><div>
      <h1>Condition article drafts</h1>
      <p className="sub">{manifest.length.toLocaleString()} source-compiled drafts · 700+ body words each · Staff access only</p>
    </div></div>
    <div className="notice alert">
      <b>Research drafts, not published health guides.</b> These combine attributed source text with shared consultation guidance.
      No article has been individually medically reviewed. {limitedCount.toLocaleString()} have fewer than 350 words of condition-specific source material and need substantial research and rewriting.
      The <Link href="/policies/editorial">editorial policy</Link> currently excludes bulk-generated condition pages; resolve that policy and review each article before public release.
    </div>
    <form className="admin-search" method="get" action="/admin/condition-drafts">
      <input type="search" name="q" defaultValue={q} placeholder="Condition or ID" aria-label="Search condition drafts" />
      <select name="department" defaultValue={department} aria-label="Department">
        <option value="">All departments</option>
        {departments.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
      <select name="coverage" defaultValue={limited ? "limited" : ""} aria-label="Source detail">
        <option value="">Any source detail</option><option value="limited">Limited source detail</option>
      </select>
      <button type="submit" className="btn">Filter</button>
      {q || department || limited ? <Link className="btn quiet" href="/admin/condition-drafts">Clear</Link> : null}
    </form>
    <p>{matches.length.toLocaleString()} matches · Page {page} of {pages}</p>
    <div style={{ overflowX: "auto" }}><table className="table">
      <thead><tr><th>Condition</th><th>Department / doctor</th><th>Body words</th><th>Source words</th></tr></thead>
      <tbody>{rows.length ? rows.map((row) => <tr key={row.id}>
        <td><Link href={`/admin/condition-drafts/${row.id}`}><b>{row.condition_name}</b></Link><div className="mono">{row.id}</div></td>
        <td>{row.department}<div style={{ fontSize: "12px", color: "var(--muted)" }}>{row.doctor}</div></td>
        <td>{row.word_count.toLocaleString()}</td>
        <td>{row.condition_source_word_count.toLocaleString()}{row.condition_source_word_count < 350 ? <div className="pill wait">Needs more research</div> : null}</td>
      </tr>) : <tr><td colSpan={4}>No drafts match these filters.</td></tr>}</tbody>
    </table></div>
    <nav aria-label="Draft pages" style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
      {page > 1 ? <Link className="btn" href={pageUrl(page - 1)}>Previous</Link> : null}
      {page < pages ? <Link className="btn" href={pageUrl(page + 1)}>Next</Link> : null}
    </nav>
    <p style={{ color: "var(--muted)", fontSize: "12.5px", marginTop: "18px" }}>
      Body counts exclude headings, references and review notes. Source counts include selected condition text and terminology definitions; they are not a clinical quality score.
    </p>
  </>;
}
