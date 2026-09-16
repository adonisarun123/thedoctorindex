import Link from "next/link";

import { revalidateSiteAction, runMaintenanceAction, snapshotStatsAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { Bars, Funnel, Lines, Stacked } from "@/components/admin/Charts";
import {
  cityTable,
  configChecks,
  growth,
  inboxItems,
  jobStatuses,
  KIND_LABEL,
  recentAudit,
  registerBreakdown,
  registerChecksPerDay,
  stockHistory,
  staffTable,
  summariseInbox,
  topDoctorsByEnquiries,
  verificationFunnel,
  workerHealth,
  type HealthCheck,
} from "@/lib/admin-dashboard";
import { hasRole, requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { env } from "@/lib/env";
import { GATES } from "@/lib/seo/gates";

export const dynamic = "force-dynamic";

const fmt = (v: number) => v.toLocaleString("en-IN");
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((100 * a) / b)}%` : "—");
const ago = (d: Date | null) => {
  if (!d) return "never";
  const h = (Date.now() - d.getTime()) / 36e5;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min ago`;
  if (h < 48) return `${Math.round(h)} h ago`;
  return `${Math.round(h / 24)} d ago`;
};
const hours = (h: number) => (h < 1 ? `${Math.round(h * 60)}m` : h < 48 ? `${Math.round(h)}h` : `${Math.round(h / 24)}d`);

function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0 && now === 0) return <div className="d flat">no change · prior 7 d: 0</div>;
  const diff = now - prev;
  const cls = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const sign = diff > 0 ? "+" : "";
  return <div className={`d ${cls}`}>{sign}{fmt(diff)} vs prior 7 d ({fmt(prev)})</div>;
}

function Priority({ p }: { p: number }) {
  const label = ["safety", "high", "normal", "low"][p] ?? "normal";
  const cls = p === 0 ? "warn" : p === 1 ? "wait" : "neut";
  return <span className={`pill ${cls}`}>{label}</span>;
}

const REGISTER_COLOURS: Record<string, string> = {
  confirmed: "var(--verified)",
  matched: "var(--accent)",
  pending: "var(--hair-strong)",
  ambiguous: "var(--pending)",
  number_mismatch: "var(--alert)",
  not_found: "var(--neutral-flag)",
  removed: "var(--alert)",
  not_applicable: "var(--surface-2)",
  dismissed: "var(--neutral-flag)",
  error: "var(--alert)",
};
const REGISTER_ORDER = ["confirmed", "matched", "pending", "ambiguous", "number_mismatch", "not_found", "removed", "dismissed", "error", "not_applicable"];

export default async function AdminOverview() {
  const user = await requireStaff();
  const superAdmin = hasRole(user, "super_admin");

  const [items, funnel, register, worker, checks, cities, g, top, history, audit] = await Promise.all([
    inboxItems(),
    verificationFunnel(),
    registerBreakdown(),
    workerHealth(),
    registerChecksPerDay(30),
    cityTable(12),
    growth(30),
    topDoctorsByEnquiries(30, 8),
    stockHistory(90),
    recentAudit(10),
  ]);
  const queues = summariseInbox(items);
  const breached = items.filter((i) => i.breached);
  const safety = items.filter((i) => i.priority === 0);
  const [config, jobs, staff] = superAdmin ? await Promise.all([Promise.resolve(configChecks()), jobStatuses(worker), staffTable()]) : [[] as HealthCheck[], [], []];

  const workerStale = worker.lastActivity ? Date.now() - worker.lastActivity.getTime() > 3 * 36e5 : true;
  const alerts: Array<{ tone: "alert" | "good" | ""; body: React.ReactNode }> = [];
  if (safety.length) alerts.push({ tone: "alert", body: <><b>{safety.length} safety-priority report{safety.length > 1 ? "s" : ""} open.</b> Initial assessment target is 4 hours. <Link href="/admin/reports">Open the queue →</Link></> });
  if (breached.length) alerts.push({ tone: "alert", body: <><b>{breached.length} item{breached.length > 1 ? "s" : ""} past target.</b> Oldest is {hours(Math.max(...breached.map((b) => b.ageHours)))} old. The inbox below is sorted so they come first.</> });
  if (workerStale && funnel.published > 100) alerts.push({ tone: "alert", body: <><b>Enrichment worker quiet for {worker.lastActivity ? hours((Date.now() - worker.lastActivity.getTime()) / 36e5) : "ever"}.</b> It is scheduled hourly on GitHub Actions; check the last run there. {worker.nmcPending > 0 ? `${fmt(worker.nmcPending)} profiles still await a register check.` : ""}</> });
  if (superAdmin) {
    for (const c of config.filter((c) => c.state === "bad")) alerts.push({ tone: "alert", body: <><b>{c.label}: {c.value}.</b> {c.hint}</> });
  }
  if (!alerts.length) alerts.push({ tone: "good", body: <><b>Nothing overdue.</b> {fmt(items.length)} open item{items.length === 1 ? "" : "s"} inside target.</> });

  const registerTotal = register.reduce((a, b) => a + b.count, 0);
  const registerParts = REGISTER_ORDER.filter((k) => register.some((r) => r.status === k)).map((k) => ({ label: k.replace(/_/g, " "), value: register.find((r) => r.status === k)!.count, color: REGISTER_COLOURS[k] ?? "var(--neutral-flag)" }));
  const historyDays = history.map((h) => h.day);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Operations</h1>
          <div className="sub">
            {fmt(funnel.published)} published · {fmt(funnel.verified)} verified ({pct(funnel.verified, funnel.published)}) · {fmt(funnel.claimed)} claimed · index mode <span className="mono">{GATES.profileIndexMode}</span> · gate ≥ {GATES.profileQuality}
          </div>
        </div>
        <div className="tools">
          <Link className="btn quiet" href="/admin/doctors">Find a doctor</Link>
          <Link className="btn solid" href="/admin/doctors/new">Create a doctor profile</Link>
        </div>
      </div>

      <div className="alerts">
        {alerts.map((a, i) => (
          <div key={i} className={`notice ${a.tone}`}>{a.body}</div>
        ))}
      </div>

      {/* ---------------------------------------------------------------- Inbox */}
      <section className="ops-sec" style={{ marginTop: 0 }}>
        <div className="sh">
          <h2>Work inbox</h2>
          <span className="m">{fmt(items.length)} open · {fmt(breached.length)} past target · sorted by priority, then age against target</span>
        </div>
        <div className="qstrip">
          {queues.map((qd) => (
            <Link key={qd.kind} href={qd.href} className={`qs${qd.breached ? " hot" : ""}${qd.open === 0 ? " zero" : ""}`}>
              <div className="l"><span>{qd.label}</span>{qd.open ? <span className="b">oldest {hours(qd.oldestHours)}</span> : null}</div>
              <div className="n">{fmt(qd.open)}</div>
              <div className="b">{qd.breached ? `${qd.breached} past target` : qd.open ? "inside target" : "clear"}</div>
            </Link>
          ))}
        </div>
        {items.length ? (
          <table className="table inbox">
            <thead><tr><th>Priority</th><th>Queue</th><th>Subject</th><th>Detail</th><th>Age</th><th>Target</th><th></th></tr></thead>
            <tbody>
              {items.slice(0, 15).map((it) => (
                <tr key={`${it.kind}:${it.id}`} className={it.breached ? "late" : undefined}>
                  <td><Priority p={it.priority} /></td>
                  <td>{KIND_LABEL[it.kind]}</td>
                  <td>{it.subject}</td>
                  <td className="sub">{it.detail}</td>
                  <td className="age">{hours(it.ageHours)}</td>
                  <td className="age" style={{ color: "var(--muted)" }}>{hours(it.slaHours)}</td>
                  <td><Link href={it.href}>Open →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">Every queue is clear.</div>
        )}
        {items.length > 15 ? <div className="chart-axis" style={{ marginTop: 6 }}><span>Showing the 15 most urgent of {fmt(items.length)}.</span><span>Each queue page has the rest.</span></div> : null}
      </section>

      {/* ---------------------------------------------------------- Verification */}
      <section className="ops-sec">
        <div className="sh">
          <h2>Verification throughput</h2>
          <span className="m"><Link href="/admin/enrichment">Register matching queue</Link> · <Link href="/admin/calls">Call queue</Link></span>
        </div>
        <div className="two">
          <div className="panel-ops">
            <div className="ph">From imported record to verified profile <span className="m">share of published</span></div>
            <Funnel
              steps={[
                { label: "Published", value: funnel.published, href: "/admin/doctors?status=published" },
                { label: "Registration number on file", value: funnel.withNumber },
                { label: "Register check confirmed", value: funnel.registrationVerified, hint: `${fmt(funnel.withNumber - funnel.registrationVerified > 0 ? funnel.withNumber - funnel.registrationVerified : 0)} numbered profiles still unchecked or mismatched` },
                { label: "Practice confirmed by a person", value: funnel.practiceConfirmed, href: "/admin/calls" },
                { label: `Verified (quality ≥ ${GATES.profileQuality}, fresh)`, value: funnel.verified },
                { label: "Claimed by the doctor", value: funnel.claimed, href: "/admin/claims" },
              ]}
            />
            <div className="chart-axis" style={{ marginTop: 10 }}>
              <span>{fmt(funnel.indexable)} indexable ({GATES.profileIndexMode} mode)</span>
              <span>{fmt(funnel.belowGate)} below gate</span>
              <span>{fmt(funnel.noPractice)} without a practice</span>
            </div>
          </div>
          <div className="stack">
            <div className="panel-ops">
              <div className="ph">NMC register step <span className="m">{fmt(registerTotal)} published profiles</span></div>
              <Stacked parts={registerParts} total={registerTotal} />
            </div>
            <div className="panel-ops">
              <div className="ph">Worker <span className="m">{worker.lastActivity ? `last activity ${ago(worker.lastActivity)}` : "no activity"}</span></div>
              <dl className="kv">
                <dt>Checked, last 24 h</dt><dd>{fmt(worker.processed24h)}</dd>
                <dt>Checked, last 7 d</dt><dd>{fmt(worker.processed7d)} <span style={{ color: "var(--muted)" }}>({fmt(Math.round(worker.processed7d / 7))}/day)</span></dd>
                <dt>Awaiting register check</dt><dd>{fmt(worker.nmcPending)}</dd>
                <dt>Backlog at this pace</dt><dd>{worker.etaDays === null ? "—" : `${fmt(worker.etaDays)} days`}</dd>
                <dt>Google Places matched</dt><dd>{fmt(worker.googleMatched)} <span style={{ color: "var(--muted)" }}>· {fmt(worker.googlePending)} pending</span></dd>
                <dt>Errors, last 24 h</dt><dd style={worker.errors24h ? { color: "var(--alert)" } : undefined}>{fmt(worker.errors24h)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="two" style={{ marginTop: 14 }}>
          <div className="panel-ops">
            <div className="ph">Registrations verified per day <span className="m">last 30 days</span></div>
            <Bars data={checks} title="Registrations verified per day" color="var(--verified)" />
          </div>
          <div className="panel-ops">
            <div className="ph">Stock over time <span className="m">{history.length ? `${history.length} daily snapshots` : "no snapshots yet"}</span></div>
            {history.length >= 2 ? (
              <Lines
                title="Published, indexable and verified profiles over time"
                days={historyDays}
                series={[
                  { label: "Published", color: "var(--ink-2)", values: history.map((h) => h.published) },
                  { label: "Register confirmed", color: "var(--accent)", values: history.map((h) => h.registrationVerified) },
                  { label: "Verified", color: "var(--verified)", values: history.map((h) => h.verified) },
                ]}
              />
            ) : (
              <div className="empty">The maintenance job writes one snapshot a day. Trends appear after the second run{superAdmin ? " — or take one now from the System panel" : ""}.</div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Cities */}
      <section className="ops-sec">
        <div className="sh">
          <h2>By city</h2>
          <span className="m">top {cities.length} by published profiles · enquiries are the last 30 days</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>City</th><th className="num">Published</th><th className="num">Register ✓</th><th className="num">Practice ✓</th><th className="num">Verified</th><th className="num">Claimed</th><th className="num">Enquiries</th><th></th></tr>
          </thead>
          <tbody>
            {cities.length === 0 ? <tr><td colSpan={8} className="empty">No published profiles with a placeable practice.</td></tr> : null}
            {cities.map((c) => (
              <tr key={`${c.stateSlug}/${c.citySlug}`}>
                <td>{c.city} <span className="sub" style={{ color: "var(--muted)", fontSize: 12 }}>{c.state}</span></td>
                <td className="num">{fmt(c.published)}</td>
                <td className="num">{fmt(c.registrationVerified)} <span style={{ color: "var(--muted)" }}>{pct(c.registrationVerified, c.published)}</span></td>
                <td className="num">{fmt(c.practiceConfirmed)} <span style={{ color: "var(--muted)" }}>{pct(c.practiceConfirmed, c.published)}</span></td>
                <td className="num">{fmt(c.verified)} <span style={{ color: "var(--muted)" }}>{pct(c.verified, c.published)}</span></td>
                <td className="num">{fmt(c.claimed)}</td>
                <td className="num">{fmt(c.enquiries30d)}</td>
                <td style={{ whiteSpace: "nowrap" }}><Link href={`/admin/calls?city=${encodeURIComponent(c.city)}`}>Calls</Link> · <Link href={`/doctors/${c.stateSlug}/${c.citySlug}`}>Public page</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------------------------------------------------------------- Growth */}
      <section className="ops-sec">
        <div className="sh">
          <h2>Growth &amp; search</h2>
          <span className="m"><Link href="/admin/seo">SEO routes</Link> · <Link href="/sitemap.xml">sitemap</Link></span>
        </div>
        <div className="tiles" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
          <Link href="/admin/enquiries" className="tile link"><div className="l">Enquiries, 7 d</div><div className="v">{fmt(g.enquiries7d)}</div><Delta now={g.enquiries7d} prev={g.enquiriesPrev7d} /></Link>
          <Link href="/admin/claims" className="tile link"><div className="l">Claims, 7 d</div><div className="v">{fmt(g.claims7d)}<small>{fmt(g.claimsApproved7d)} approved</small></div><Delta now={g.claims7d} prev={g.claimsPrev7d} /></Link>
          <Link href="/admin/reviews" className="tile link"><div className="l">Reviews, 7 d</div><div className="v">{fmt(g.reviews7d)}</div><Delta now={g.reviews7d} prev={g.reviewsPrev7d} /></Link>
          <Link href="/admin/doctors" className="tile link"><div className="l">Profiles added, 7 d</div><div className="v">{fmt(g.newProfiles7d)}</div><Delta now={g.newProfiles7d} prev={g.newProfilesPrev7d} /></Link>
          <div className="tile"><div className="l">Doctor accounts</div><div className="v">{fmt(g.doctorAccounts)}</div><div className="d flat">signed-in doctors, any status</div></div>
          <Link href="/admin/seo" className="tile link"><div className="l">Browse pages indexed</div><div className="v">{fmt(g.seoRoutesIndexable)}<small>of {fmt(g.seoRoutesTotal)}</small></div><div className="d flat">+ {fmt(funnel.indexable)} profile pages</div></Link>
        </div>
        <div className="three" style={{ marginTop: 14 }}>
          <div className="panel-ops">
            <div className="ph">Enquiries per day <span className="m">30 d</span></div>
            <Bars data={g.enquiriesPerDay} title="Enquiries per day" />
          </div>
          <div className="panel-ops">
            <div className="ph">Claims filed per day <span className="m">30 d</span></div>
            <Bars data={g.claimsPerDay} title="Claims per day" color="var(--ink-2)" />
          </div>
          <div className="panel-ops">
            <div className="ph">Most enquired profiles <span className="m">30 d</span></div>
            {top.length === 0 ? <div className="empty">No enquiries in the last 30 days.</div> : (
              <table className="table" style={{ border: 0 }}>
                <tbody>
                  {top.map((d) => (
                    <tr key={d.id}>
                      <td style={{ padding: "6px 8px" }}><Link href={`/admin/doctors/${d.id}`}>{d.name}</Link><div className="sub" style={{ color: "var(--muted)", fontSize: 12 }}>{d.city ?? "—"} · Q{d.qualityScore}{d.claimed ? " · claimed" : ""}</div></td>
                      <td className="num" style={{ padding: "6px 8px" }}>{fmt(d.enquiries)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- System */}
      {superAdmin ? (
        <section className="ops-sec">
          <div className="sh">
            <h2>System</h2>
            <span className="m">super administrator · <Link href="/admin/staff">Staff</Link> · <Link href="/admin/audit">Audit log</Link> · <Link href="/admin/security">Two-step sign-in</Link></span>
          </div>
          <div className="panel-ops">
            <div className="ph">Configuration <span className="m">read from the running environment · values are never shown, only whether they are usable</span></div>
            <table className="table health" style={{ border: 0 }}>
              <tbody>
                {config.map((c) => (
                  <tr key={c.label}>
                    <td style={{ padding: "7px 8px", width: 220 }}><span className={`dot ${c.state}`} aria-hidden />{c.label}</td>
                    <td style={{ padding: "7px 8px", width: 260 }} className="mono">{c.value}</td>
                    <td style={{ padding: "7px 8px", color: "var(--muted)", fontSize: 12.5 }}>{c.hint ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="stack" style={{ marginTop: 14 }}>
            <div className="panel-ops">
              <div className="ph">Scheduled jobs</div>
              <table className="table" style={{ border: 0 }}>
                <tbody>
                  {jobs.map((j) => {
                    const late = !j.lastRun || Date.now() - j.lastRun.getTime() > j.expectedEveryHours * 36e5 * 1.5;
                    return (
                      <tr key={j.label}>
                        <td style={{ padding: "7px 8px" }}><span className={`dot ${late ? "bad" : "ok"}`} aria-hidden />{j.label}<div className="sub" style={{ color: "var(--muted)", fontSize: 12 }}>{j.detail}</div></td>
                        <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }} className="mono">{ago(j.lastRun)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="tools" style={{ marginTop: 10 }}>
                <ActionForm action={runMaintenanceAction} submitLabel="Run maintenance now" variant="quiet" inline confirm="Recomputes quality for dated profiles, rebuilds SEO routes, pings IndexNow and writes today's snapshot. Continue?" />
                <ActionForm action={snapshotStatsAction} submitLabel="Snapshot stats" variant="quiet" inline />
                <ActionForm action={revalidateSiteAction} submitLabel="Revalidate public pages" variant="quiet" inline />
              </div>
            </div>
            <div className="panel-ops">
              <div className="ph">Staff <span className="m">{staff.filter((s) => s.active).length} active · <Link href="/admin/staff">manage</Link></span></div>
              <table className="table" style={{ border: 0 }}>
                <thead><tr><th>Account</th><th>Roles</th><th>2-step</th><th>Last sign-in</th><th className="num">Actions 30 d</th></tr></thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.userId} style={s.active ? undefined : { opacity: 0.55 }}>
                      <td style={{ padding: "7px 8px" }}>{s.email ?? s.userId.slice(0, 8)}{s.displayName ? <div className="sub" style={{ color: "var(--muted)", fontSize: 12 }}>{s.displayName}</div> : null}</td>
                      <td style={{ padding: "7px 8px", fontSize: 12 }}>{s.roles.map((r) => r.replace(/_/g, " ")).join(", ") || "—"}</td>
                      <td style={{ padding: "7px 8px" }}><span className={`pill ${s.mfaEnrolled ? "ok" : "warn"}`}>{s.mfaEnrolled ? "enrolled" : "not enrolled"}</span></td>
                      <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }} className="mono">{s.lastSignInAt ? ago(s.lastSignInAt) : "never"}{s.openSessions ? ` · ${s.openSessions} session${s.openSessions > 1 ? "s" : ""}` : ""}</td>
                      <td className="num" style={{ padding: "7px 8px" }}>{fmt(s.decisions30d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- Audit */}
      <section className="ops-sec">
        <div className="sh">
          <h2>Recent activity</h2>
          <span className="m"><Link href="/admin/audit">Full audit log →</Link></span>
        </div>
        <table className="table">
          <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Actor</th><th>Reason</th></tr></thead>
          <tbody>
            {audit.length === 0 ? <tr><td colSpan={5} className="empty">Nothing yet.</td></tr> : null}
            {audit.map((a) => (
              <tr key={a.id}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>{toDisplay(a.createdAt)}</td>
                <td className="mono">{a.action}</td>
                <td style={{ fontSize: 13 }}>{a.entityType} <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{a.entityId?.slice(0, 8)}</span></td>
                <td style={{ fontSize: 13 }}>{a.actor}</td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{a.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="chart-axis" style={{ marginTop: 8 }}><span>Site {env.siteUrl}</span><span>Rendered {toDisplay(new Date())}</span></div>
      </section>
    </>
  );
}
