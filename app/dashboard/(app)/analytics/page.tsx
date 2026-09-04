import { getDashboardContext } from "@/lib/dashboard";
import { doctorAnalytics } from "@/lib/services/events";

export const metadata = { title: "How patients find you" };

/**
 * Discovery analytics for the doctor. Counts only; nothing here identifies a
 * patient, and no health data is ever sent to analytics (plan §17).
 */
export default async function DashboardAnalytics() {
  const { doctorId } = await getDashboardContext();
  const a = await doctorAnalytics(doctorId);
  const max = Math.max(1, ...a.views);
  const actions = Object.values(a.actions).reduce((x, y) => x + y, 0);
  const conversion = a.viewsTotal ? Math.round((actions / a.viewsTotal) * 100) : 0;
  const rows: Array<[string, keyof typeof a.actions]> = [["Called a practice", "call"], ["Opened directions", "directions"], ["Sent an appointment enquiry", "enquiry"], ["Visited practice website", "website"]];

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>How patients find you</h1>
          <div className="sub">Last 28 days · counts only, never identities · no health data reaches analytics</div>
        </div>
      </div>

      <div className="tiles">
        <div className="tile"><div className="l">Profile views</div><div className="v">{a.viewsTotal.toLocaleString("en-IN")}</div><div className="d">Previous 28 days: {a.viewsPrevTotal}</div></div>
        <div className="tile"><div className="l">Contact actions</div><div className="v">{actions}</div><div className="d">Call, directions, enquiry, website</div></div>
        <div className="tile"><div className="l">View → contact</div><div className="v">{conversion}%</div><div className="d">Share of views that led to an action</div></div>
        <div className="tile"><div className="l">Organic impressions</div><div className="v">—</div><div className="d">Search Console linked after launch (GSC_* in .env)</div></div>
      </div>

      <div className="panel pad" style={{ marginTop: "16px" }}>
        <div className="chart-head"><span className="t">Daily profile views</span><span className="m">peak {Math.max(0, ...a.views)} · low {Math.min(...a.views)}</span></div>
        {a.viewsTotal ? (
          <div className="spark" style={{ height: 120 }} aria-label={`Daily views over 28 days, ${a.viewsTotal} total`}>
            {a.views.map((v, i) => (<i key={i} style={{ height: `${Math.round((v / max) * 100)}%` }} title={`${v} views`} />))}
          </div>
        ) : (
          <p style={{ fontSize: "13.5px", color: "var(--muted)" }}>No views recorded in the last 28 days. Every visit to your public profile is counted from the moment it is published.</p>
        )}
        <div className="chart-axis"><span>28 days ago</span><span>14 days ago</span><span>today</span></div>
      </div>

      <div className="two" style={{ marginTop: "16px" }}>
        <div>
          <div className="chart-head"><span className="t">Contact actions</span><span className="m">vs previous 28 days</span></div>
          <table className="table">
            <thead><tr><th>Action</th><th className="num">Now</th><th className="num">Before</th></tr></thead>
            <tbody>{rows.map(([label, key]) => (<tr key={key}><td>{label}</td><td className="num">{a.actions[key]}</td><td className="num" style={{ color: "var(--muted)" }}>{a.actionsPrev[key]}</td></tr>))}</tbody>
          </table>
        </div>
        <div>
          <div className="chart-head"><span className="t">Where viewers were searching from</span></div>
          <div className="panel pad">
            {a.viewerLocalities.length ? a.viewerLocalities.map((l) => (
              <div key={l.name} className="distrow" style={{ gridTemplateColumns: "130px 1fr 40px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--ink-2)" }}>{l.name}</span>
                <span className="b"><i style={{ width: `${l.share}%` }} /></span>
                <span>{l.share}%</span>
              </div>
            )) : <p style={{ fontSize: "13px", color: "var(--muted)" }}>Locality is recorded when a viewer arrives from a locality listing. None yet.</p>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div className="chart-head"><span className="t">Searches that led to your profile</span><span className="m">on this site</span></div>
        <table className="table">
          <thead><tr><th>Search</th><th className="num">Profile views</th></tr></thead>
          <tbody>
            {a.searchTerms.length ? a.searchTerms.map((s) => (<tr key={s.term}><td>{s.term}</td><td className="num">{s.views}</td></tr>)) : <tr><td colSpan={2} style={{ color: "var(--muted)" }}>Terms appear once a search is seen at least twice, so no single search is identifiable.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
