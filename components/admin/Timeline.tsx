import Link from "next/link";

import type { TimelineEvent } from "@/lib/services/doctor-timeline";

const DAY = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" });
const TIME = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });

/** A dated stream grouped by day. Server component; the data is lib/services/doctor-timeline.ts. */
export function Timeline({ events, more }: { events: TimelineEvent[]; more?: { href: string; label: string } }) {
  if (!events.length) return <div className="empty">Nothing recorded yet.</div>;
  const groups: Array<[string, TimelineEvent[]]> = [];
  for (const e of events) {
    const day = DAY.format(e.at);
    const last = groups[groups.length - 1];
    if (last && last[0] === day) last[1].push(e);
    else groups.push([day, [e]]);
  }
  return (
    <div className="tl">
      {groups.map(([day, items]) => (
        <div className="tl-day" key={day}>
          <div className="tl-dl">{day}</div>
          {items.map((e, i) => (
            <div className={`tl-ev ${e.kind}`} key={`${day}-${i}`}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-time mono">{TIME.format(e.at)}</span>
              <div className="tl-body">
                <div className="tl-t">{e.href ? <Link href={e.href}>{e.title}</Link> : e.title}</div>
                {e.detail || e.actor ? (
                  <div className="tl-d">
                    {e.detail}
                    {e.detail && e.actor ? " · " : ""}
                    {e.actor ? <span className="tl-a">{e.actor}</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ))}
      {more ? <Link href={more.href} className="tl-more">{more.label}</Link> : null}
    </div>
  );
}
