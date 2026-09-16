/**
 * Server-rendered SVG charts for the admin console. No client JS: every mark
 * carries a <title> so the browser shows the value on hover, colours come
 * from the site tokens, and text uses text tokens rather than series colour.
 */

export interface Point {
  day: string;
  count: number;
}

const short = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
};

/** Single-series daily bars. Baseline-anchored, 2px gaps, direct label on the max only. */
export function Bars({ data, height = 64, color = "var(--accent)", title }: { data: Point[]; height?: number; color?: string; title: string }) {
  const w = 320;
  const max = Math.max(1, ...data.map((d) => d.count));
  const gap = 2;
  const bw = (w - gap * (data.length - 1)) / Math.max(1, data.length);
  const total = data.reduce((a, b) => a + b.count, 0);
  const maxIdx = data.reduce((m, d, i) => (d.count > data[m].count ? i : m), 0);
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} role="img" aria-label={`${title}: ${total} over ${data.length} days`} preserveAspectRatio="none" style={{ display: "block" }}>
        <line x1="0" y1={height - 0.5} x2={w} y2={height - 0.5} stroke="var(--hair)" />
        {data.map((d, i) => {
          const h = Math.max(d.count > 0 ? 2 : 0, ((height - 14) * d.count) / max);
          const x = i * (bw + gap);
          return (
            <g key={d.day}>
              <rect x={x} y={height - 1 - h} width={bw} height={h} rx={Math.min(3, bw / 2)} fill={color} opacity={i === data.length - 1 ? 1 : 0.7}>
                <title>{`${short(d.day)}: ${d.count}`}</title>
              </rect>
              {i === maxIdx && d.count > 0 ? (
                <text x={Math.min(w - 2, Math.max(8, x + bw / 2))} y={Math.max(9, height - 1 - h - 3)} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)">
                  {d.count}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <figcaption className="chart-axis"><span>{data.length ? short(data[0].day) : ""}</span><span>{total} total</span><span>{data.length ? short(data[data.length - 1].day) : ""}</span></figcaption>
    </figure>
  );
}

export interface Series {
  label: string;
  color: string;
  values: number[];
}

/** Up to three lines on one axis, shared x (days). Legend always present; last value direct-labelled. */
export function Lines({ days, series, height = 120, title }: { days: string[]; series: Series[]; height?: number; title: string }) {
  const w = 640;
  const padL = 34;
  const padR = 44;
  const padT = 8;
  const padB = 16;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const x = (i: number) => padL + (days.length <= 1 ? 0 : (i * (w - padL - padR)) / (days.length - 1));
  const y = (v: number) => padT + (height - padT - padB) * (1 - v / max);
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" role="img" aria-label={title} style={{ display: "block" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="var(--hair)" />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)">{t.toLocaleString("en-IN")}</text>
          </g>
        ))}
        {series.map((s) => {
          const d = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
          const last = s.values[s.values.length - 1] ?? 0;
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                <title>{s.label}</title>
              </path>
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r="4" fill={s.color} stroke="var(--surface)" strokeWidth="2" opacity={i === s.values.length - 1 ? 1 : 0}>
                  <title>{`${s.label} · ${short(days[i])}: ${v.toLocaleString("en-IN")}`}</title>
                </circle>
              ))}
              <text x={w - padR + 8} y={y(last) + 3} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">{last.toLocaleString("en-IN")}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="chart-axis" style={{ justifyContent: "flex-start", gap: "14px", flexWrap: "wrap" }}>
        <span>{days.length ? short(days[0]) : ""} → {days.length ? short(days[days.length - 1]) : ""}</span>
        {series.map((s) => (
          <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <i style={{ width: 10, height: 2, background: s.color, display: "inline-block" }} aria-hidden /> {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/** Horizontal funnel: each step as a share of the first. */
export function Funnel({ steps }: { steps: Array<{ label: string; value: number; hint?: string; href?: string }> }) {
  const base = Math.max(1, steps[0]?.value ?? 1);
  return (
    <div className="funnel">
      {steps.map((s, i) => {
        const pct = Math.round((100 * s.value) / base);
        return (
          <div className="frow" key={s.label}>
            <div className="fl">{s.href ? <a href={s.href}>{s.label}</a> : s.label}</div>
            <div className="fbar" aria-hidden><i style={{ width: `${Math.max(pct, s.value > 0 ? 1 : 0)}%`, opacity: 1 - i * 0.12 }} /></div>
            <div className="fv">{s.value.toLocaleString("en-IN")}</div>
            <div className="fp">{i === 0 ? "" : `${pct}%`}</div>
            {s.hint ? <div className="fh">{s.hint}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

/** One stacked bar of categories with a legend beneath — status breakdown. */
export function Stacked({ parts, total }: { parts: Array<{ label: string; value: number; color: string }>; total: number }) {
  const t = Math.max(1, total);
  return (
    <div>
      <div className="stackbar" role="img" aria-label={parts.map((p) => `${p.label} ${p.value}`).join(", ")}>
        {parts.filter((p) => p.value > 0).map((p) => (
          <i key={p.label} style={{ width: `${(100 * p.value) / t}%`, background: p.color }} title={`${p.label}: ${p.value.toLocaleString("en-IN")} (${Math.round((100 * p.value) / t)}%)`} />
        ))}
      </div>
      <div className="stacklegend">
        {parts.map((p) => (
          <span key={p.label}><i style={{ background: p.color }} aria-hidden /> {p.label} <b>{p.value.toLocaleString("en-IN")}</b></span>
        ))}
      </div>
    </div>
  );
}
