import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";

/**
 * One dated stream of everything that happened to a profile, for the admin
 * doctor page: audit rows, verification checks, claims, enquiries, bookings,
 * reviews and the enrichment worker's state changes. Read-only; each row
 * links to the queue that owns it. Newest first, capped.
 */
export type TimelineKind = "profile" | "check" | "claim" | "enquiry" | "booking" | "review" | "worker" | "staff";

export interface TimelineEvent {
  at: Date;
  kind: TimelineKind;
  title: string;
  detail?: string;
  actor?: string;
  href?: string;
}

const ACTION_LABELS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^doctor\.created$/, () => "Profile created"],
  [/^doctor\.imported\.(\w+)$/, (m) => `Imported as ${m[1]}`],
  [/^enquiry\.created$/, () => "Enquiry received"],
  [/^booking\.(\w+)$/, (m) => `Booking ${m[1]}`],
  [/^doctor\.published$/, () => "Profile published"],
  [/^doctor\.status\.(\w+)$/, (m) => `Status set to ${m[1]}`],
  [/^doctor\.registration\.verified$/, () => "Registration verified against the register"],
  [/^doctor\.registration\.unmatched$/, () => "Left unverified — no register candidate accepted"],
  [/^doctor\.field\.(\w+)$/, (m) => `Field edited: ${m[1].replace(/_/g, " ")}`],
  [/^doctor\.merged$/, () => "Merged into another profile"],
  [/^doctor\.photo\.(\w+)$/, (m) => `Photograph ${m[1]}`],
  [/^claim\.(\w+)$/, (m) => `Claim ${m[1]}`],
  [/^review\.(\w+)$/, (m) => `Review ${m[1]}`],
  [/^evidence\.(\w+)$/, (m) => `Review document ${m[1]}`],
  [/^enrichment\.(\w+)$/, (m) => `Worker: ${m[1]}`],
  [/^invite\.(\w+)$/, (m) => `Invite ${m[1]}`],
];

function labelAction(action: string): string {
  for (const [re, f] of ACTION_LABELS) {
    const m = action.match(re);
    if (m) return f(m);
  }
  return action.replace(/[._]/g, " ");
}

export async function doctorTimeline(doctorId: string, limit = 80): Promise<TimelineEvent[]> {
  const db = getDb();
  const rows = (await db.execute(sql`
    select * from (
      select a.created_at as at, 'staff' as kind, a.action as a, a.reason as b, coalesce(u.email, a.actor_role, 'system') as c, null::text as d
      from audit_logs a left join users u on u.id = a.actor_user_id
      where a.entity_type = 'doctor' and a.entity_id = ${doctorId}
      union all
      select v.checked_on, 'check', v.kind::text, v.result::text, coalesce(u.email, v.source, 'system'), v.note
      from verification_checks v left join users u on u.id = v.checked_by_user_id
      where v.doctor_id = ${doctorId}
      union all
      select c.created_at, 'claim', 'submitted', c.method::text, coalesce(u.email, u.phone, ''), c.id::text
      from doctor_claims c left join users u on u.id = c.user_id
      where c.doctor_id = ${doctorId}
      union all
      select c.decided_at, 'claim', c.status::text, c.note, coalesce(u.email, ''), c.id::text
      from doctor_claims c left join users u on u.id = c.decided_by_user_id
      where c.doctor_id = ${doctorId} and c.decided_at is not null
      union all
      select e.created_at, 'enquiry', e.status::text, e.preferred_day, split_part(e.contact, ' · ', 1), e.id::text
      from enquiries e where e.doctor_id = ${doctorId}
      union all
      select ap.created_at, 'booking', ap.status::text, to_char(ap.starts_at at time zone 'Asia/Kolkata', 'DD Mon HH24:MI'), ap.patient_name, ap.ref
      from appointments ap where ap.doctor_id = ${doctorId}
      union all
      select r.submitted_at, 'review', r.status::text, case when r.score is null then null else round(r.score::numeric, 1)::text || ' / 5' end, r.author_label, r.id::text
      from reviews r where r.doctor_id = ${doctorId}
      union all
      select en.updated_at, 'worker', en.nmc_status, en.google_status, 'enrichment worker', en.last_error
      from doctor_enrichment en where en.doctor_id = ${doctorId}
      union all
      select d.created_at, 'profile', 'created', d.source_ref, null, null from doctors d where d.id = ${doctorId}
      union all
      select d.published_at, 'profile', 'published', null, null, null from doctors d where d.id = ${doctorId} and d.published_at is not null
    ) t
    where at is not null
    order by at desc
    limit ${limit}
  `)) as unknown as Array<{ at: Date; kind: TimelineKind; a: string | null; b: string | null; c: string | null; d: string | null }>;

  return rows.map((r) => {
    const at = new Date(r.at);
    switch (r.kind) {
      case "staff":
        return { at, kind: "staff", title: labelAction(r.a ?? ""), detail: r.b ?? undefined, actor: r.c ?? undefined };
      case "check":
        return { at, kind: "check", title: `${(r.a ?? "check").replace(/_/g, " ")} check — ${r.b ?? ""}`, detail: r.d ?? undefined, actor: r.c ?? undefined };
      case "claim":
        return { at, kind: "claim", title: r.a === "submitted" ? `Claim submitted (${(r.b ?? "").replace(/_/g, " ")})` : `Claim ${r.a}`, detail: r.a === "submitted" ? undefined : r.b ?? undefined, actor: r.c ?? undefined, href: `/admin/claims?all=1#${r.d}` };
      case "enquiry":
        return { at, kind: "enquiry", title: `Enquiry from ${r.c || "a patient"}`, detail: [r.b, r.a].filter(Boolean).join(" · "), href: `/admin/enquiries#${r.d}` };
      case "booking":
        return { at, kind: "booking", title: `Booking ${r.d} · ${r.c}`, detail: `${r.b} · ${(r.a ?? "").replace(/_/g, " ")}`, href: `/admin/bookings?q=${encodeURIComponent(r.d ?? "")}` };
      case "review":
        return { at, kind: "review", title: `Review by ${r.c} — ${r.a}`, detail: r.b ?? undefined, href: `/admin/reviews?status=${r.a}#${r.d}` };
      case "worker":
        return { at, kind: "worker", title: `Register match: ${(r.a ?? "").replace(/_/g, " ")}`, detail: [r.b ? `Google: ${r.b.replace(/_/g, " ")}` : null, r.d].filter(Boolean).join(" · "), actor: r.c ?? undefined, href: "/admin/enrichment" };
      case "profile":
      default:
        return { at, kind: "profile", title: r.a === "published" ? "Profile published" : "Profile created", detail: r.b ? `source ${r.b}` : undefined };
    }
  });
}
