import { asc, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Taxonomy" };

export default async function AdminTaxonomy() {
  await requireStaff();
  const db = getDb();
  const [specialties, localities, terms, counts] = await Promise.all([
    db.select().from(s.specialties).orderBy(asc(s.specialties.sort), asc(s.specialties.name)),
    db.select().from(s.localities).orderBy(asc(s.localities.sort), asc(s.localities.name)),
    db.select().from(s.serviceTerms).orderBy(asc(s.serviceTerms.specialtyKey), asc(s.serviceTerms.term)),
    db.execute(sql`select specialty_key, count(*) filter (where status = 'published')::int as published, count(*)::int as total from doctors group by specialty_key`) as unknown as Promise<Array<{ specialty_key: string; published: number; total: number }>>,
  ]);
  const byKey = new Map(counts.map((c) => [c.specialty_key, c]));

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Taxonomy</h1>
          <div className="sub">Controlled vocabulary. Adding a speciality or locality is a governed change: it is defined in code (<span className="mono">lib/data/taxonomy.ts</span>) and synced into these tables by <span className="mono">npm run db:seed</span>, so the SEO gates and the URL structure change together with a review.</div>
        </div>
      </div>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Specialities</span><span className="m">{specialties.length}</span></div>
        <table className="table">
          <thead><tr><th>Key</th><th>Name</th><th>Slug</th><th>Department</th><th>Aliases</th><th>Guide reviewed</th><th>Doctors</th><th>Active</th></tr></thead>
          <tbody>
            {specialties.map((sp) => {
              const c = byKey.get(sp.key);
              return (
                <tr key={sp.key}>
                  <td className="mono">{sp.key}</td>
                  <td>{sp.name} <span style={{ color: "var(--muted)", fontSize: "12px" }}>({sp.plural})</span></td>
                  <td className="mono">/{sp.slug}</td>
                  <td>{sp.department}</td>
                  <td style={{ fontSize: "12.5px", color: "var(--muted)" }}>{sp.aliases.join(", ") || "—"}</td>
                  <td className="mono">{sp.reviewedOn ? toDisplay(sp.reviewedOn) : "—"}</td>
                  <td className="mono">{c ? `${c.published} / ${c.total}` : "0 / 0"}</td>
                  <td><span className={`pill ${sp.active ? "ok" : "neut"}`}>{sp.active ? "active" : "off"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Localities</span><span className="m">{localities.length}</span></div>
        <table className="table">
          <thead><tr><th>Key</th><th>Name</th><th>City</th><th>State</th><th>Centroid</th><th>Active</th></tr></thead>
          <tbody>
            {localities.map((l) => (
              <tr key={l.key}>
                <td className="mono">{l.key}</td>
                <td>{l.name}</td>
                <td>{l.city} <span className="mono" style={{ color: "var(--muted)", fontSize: "11px" }}>/{l.citySlug}</span></td>
                <td>{l.state} <span className="mono" style={{ color: "var(--muted)", fontSize: "11px" }}>/{l.stateSlug}</span></td>
                <td className="mono" style={{ fontSize: "12px" }}>{l.lat && l.lng ? `${l.lat}, ${l.lng}` : "—"}</td>
                <td><span className={`pill ${l.active ? "ok" : "neut"}`}>{l.active ? "active" : "off"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <div className="chart-head"><span className="t">Service terms</span><span className="m">{terms.length}</span></div>
        <div className="panel pad" style={{ fontSize: "13.5px" }}>
          {specialties.map((sp) => {
            const mine = terms.filter((t) => t.specialtyKey === sp.key);
            if (!mine.length) return null;
            return (
              <div key={sp.key} style={{ marginBottom: "10px" }}>
                <b>{sp.name}</b> <span style={{ color: "var(--muted)" }}>· {mine.length}</span>
                <div style={{ color: "var(--ink-2)", marginTop: "2px" }}>{mine.map((t) => t.term).join(" · ")}</div>
              </div>
            );
          })}
          {terms.filter((t) => !t.specialtyKey).length ? (
            <div><b>General</b><div style={{ color: "var(--ink-2)", marginTop: "2px" }}>{terms.filter((t) => !t.specialtyKey).map((t) => t.term).join(" · ")}</div></div>
          ) : null}
        </div>
      </section>
    </>
  );
}
