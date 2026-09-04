import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { events } from "@/lib/db/schema";

/**
 * Product analytics events (plan §17). Counts only. No identity, no health
 * data, no evidence. `sessionHash` is a salted hash of a first-party cookie so
 * a return visit is not double-counted; it cannot be reversed to a person.
 */
export type EventKind =
  | "search_started" | "search_completed" | "zero_results" | "filter_applied" | "profile_viewed"
  | "call_clicked" | "directions_clicked" | "website_clicked" | "whatsapp_clicked" | "enquiry_submitted"
  | "profile_started" | "profile_submitted" | "claim_started" | "claim_approved"
  | "review_started" | "review_submitted" | "review_published" | "review_reported"
  | "correction_submitted" | "grievance_submitted";

export async function track(kind: EventKind, data: { doctorId?: string | null; practiceId?: string | null; path?: string | null; query?: string | null; localityKey?: string | null; sessionHash?: string | null } = {}) {
  if (!process.env.DATABASE_URL) return;
  try {
    await getDb().insert(events).values({ kind, doctorId: data.doctorId ?? null, practiceId: data.practiceId ?? null, path: data.path?.slice(0, 300) ?? null, query: data.query?.slice(0, 120) ?? null, localityKey: data.localityKey ?? null, sessionHash: data.sessionHash ?? null });
  } catch {
    /* analytics must never break a request */
  }
}

export interface DoctorAnalytics {
  views: number[]; // last 28 days, oldest first
  viewsTotal: number;
  viewsPrevTotal: number;
  actions: Record<"call" | "directions" | "enquiry" | "website", number>;
  actionsPrev: Record<"call" | "directions" | "enquiry" | "website", number>;
  searchTerms: Array<{ term: string; views: number }>;
  viewerLocalities: Array<{ name: string; share: number }>;
}

export async function doctorAnalytics(doctorId: string): Promise<DoctorAnalytics> {
  const db = getDb();
  const daily = (await db.execute(sql`
    select d::date as day, count(e.id)::int as n
    from generate_series(current_date - 27, current_date, interval '1 day') d
    left join events e on e.doctor_id = ${doctorId} and e.kind = 'profile_viewed' and e.created_at::date = d::date
    group by d order by d
  `)) as unknown as Array<{ day: string; n: number }>;
  const views = daily.map((r) => Number(r.n));
  const [{ prev }] = (await db.execute(sql`select count(*)::int as prev from events where doctor_id = ${doctorId} and kind = 'profile_viewed' and created_at >= current_date - 55 and created_at < current_date - 27`)) as unknown as Array<{ prev: number }>;
  const kinds = { call: "call_clicked", directions: "directions_clicked", enquiry: "enquiry_submitted", website: "website_clicked" } as const;
  const actions = { call: 0, directions: 0, enquiry: 0, website: 0 };
  const actionsPrev = { call: 0, directions: 0, enquiry: 0, website: 0 };
  const rows = (await db.execute(sql`
    select kind, (created_at >= current_date - 27) as recent, count(*)::int as n
    from events where doctor_id = ${doctorId} and kind in ('call_clicked','directions_clicked','enquiry_submitted','website_clicked') and created_at >= current_date - 55
    group by kind, recent
  `)) as unknown as Array<{ kind: string; recent: boolean; n: number }>;
  for (const r of rows) {
    const key = (Object.keys(kinds) as Array<keyof typeof kinds>).find((k) => kinds[k] === r.kind);
    if (!key) continue;
    if (r.recent) actions[key] = Number(r.n);
    else actionsPrev[key] = Number(r.n);
  }
  const terms = (await db.execute(sql`
    select query as term, count(*)::int as views from events
    where doctor_id = ${doctorId} and kind = 'profile_viewed' and query is not null and created_at >= current_date - 27
    group by query having count(*) >= 2 order by views desc limit 8
  `)) as unknown as Array<{ term: string; views: number }>;
  const locs = (await db.execute(sql`
    select coalesce(l.name, 'Unknown') as name, count(*)::int as n from events e
    left join localities l on l.key = e.locality_key
    where e.doctor_id = ${doctorId} and e.kind = 'profile_viewed' and e.created_at >= current_date - 27
    group by l.name order by n desc limit 6
  `)) as unknown as Array<{ name: string; n: number }>;
  const total = locs.reduce((a, r) => a + Number(r.n), 0) || 1;
  return {
    views,
    viewsTotal: views.reduce((a, b) => a + b, 0),
    viewsPrevTotal: Number(prev),
    actions,
    actionsPrev,
    searchTerms: terms.map((t) => ({ term: t.term, views: Number(t.views) })),
    viewerLocalities: locs.map((l) => ({ name: l.name, share: Math.round((Number(l.n) / total) * 100) })),
  };
}
