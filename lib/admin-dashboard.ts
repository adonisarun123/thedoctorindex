import "server-only";

import { sql } from "drizzle-orm";

import { emailConfigured, smsConfigured } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import { env } from "@/lib/env";

/**
 * Read model for /admin. Every function here is one or two round trips and
 * returns plain numbers and rows; the page decides how to show them. Nothing
 * in this file mutates.
 *
 * Definitions match the public site (lib/seo/gates.ts, lib/data/db-source.ts):
 *   verified  = quality ≥ gate AND practice confirmed within the deindex window
 *   indexable = what PROFILE_INDEX_MODE actually publishes
 */

const q = () => env.gates.profileQuality;
const fresh = () => env.freshness.deindexAfterDays;

type Row = Record<string, unknown>;
const n = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));
async function one(query: ReturnType<typeof sql>): Promise<Row> {
  const rows = (await getDb().execute(query)) as unknown as Row[];
  return rows[0] ?? {};
}
async function many<T = Row>(query: ReturnType<typeof sql>): Promise<T[]> {
  return (await getDb().execute(query)) as unknown as T[];
}

/* ------------------------------------------------------------------------ */
/* Work inbox                                                                */
/* ------------------------------------------------------------------------ */

export type InboxKind = "claim" | "submission" | "change" | "review" | "response" | "review_report" | "profile_report" | "correction" | "enquiry" | "register";

export interface InboxItem {
  kind: InboxKind;
  id: string;
  /** Doctor or subject name for the row. */
  subject: string;
  detail: string;
  createdAt: Date;
  /** 0 = safety, 1 = high, 2 = normal, 3 = low */
  priority: number;
  /** Target hours to first decision, from the operations policy. */
  slaHours: number;
  ageHours: number;
  breached: boolean;
  href: string;
}

/** Hours to first decision. Safety reports 4 h; claims and new profiles 2 business days ≈ 48 h. */
export const SLA_HOURS: Record<InboxKind, number> = {
  profile_report: 48,
  review_report: 48,
  claim: 48,
  submission: 48,
  change: 72,
  review: 72,
  response: 72,
  correction: 120,
  enquiry: 24,
  register: 168,
};

export const KIND_LABEL: Record<InboxKind, string> = {
  claim: "Claim",
  submission: "New profile",
  change: "Change request",
  review: "Review",
  response: "Doctor reply",
  review_report: "Review report",
  profile_report: "Profile report",
  correction: "Correction",
  enquiry: "Enquiry",
  register: "Register match",
};

const QUEUE_HREF: Record<InboxKind, string> = {
  claim: "/admin/claims",
  submission: "/admin/submissions",
  change: "/admin/changes",
  review: "/admin/reviews",
  response: "/admin/reviews",
  review_report: "/admin/reviews",
  profile_report: "/admin/reports",
  correction: "/admin/reports",
  enquiry: "/admin/enquiries",
  register: "/admin/enrichment",
};

const PRIORITY: Record<string, number> = { safety: 0, high: 1, normal: 2, low: 3 };

export async function inboxItems(limit = 400): Promise<InboxItem[]> {
  const rows = await many<{ kind: InboxKind; id: string; subject: string | null; detail: string | null; created_at: Date | string; priority: string | null }>(sql`
    select * from (
      select 'claim' as kind, c.id::text as id, d.name as subject, c.method::text as detail, c.created_at, 'normal' as priority
        from doctor_claims c join doctors d on d.id = c.doctor_id where c.status = 'pending'
      union all
      select 'submission', s.id::text, coalesce(s.payload->>'name', s.registration_number), s.status::text, s.created_at, 'normal'
        from doctor_submissions s where s.status in ('submitted','in_review','needs_info')
      union all
      select 'change', c.id::text, d.name, c.field || case when c.sensitive then ' · sensitive' else '' end, c.created_at, case when c.sensitive then 'high' else 'normal' end
        from profile_change_requests c join doctors d on d.id = c.doctor_id where c.status = 'pending'
      union all
      select 'review', r.id::text, d.name, 'risk ' || r.risk_score, r.submitted_at, case when r.risk_score >= 40 then 'high' else 'normal' end
        from reviews r join doctors d on d.id = r.doctor_id where r.status = 'pending'
      union all
      select 'response', x.id::text, d.name, 'reply to a review', x.created_at, 'normal'
        from doctor_responses x join reviews r on r.id = x.review_id join doctors d on d.id = r.doctor_id where x.status = 'pending'
      union all
      select 'review_report', rr.id::text, d.name, rr.reason, rr.created_at, rr.priority::text
        from review_reports rr join reviews r on r.id = rr.review_id join doctors d on d.id = r.doctor_id where rr.status = 'open'
      union all
      select 'profile_report', pr.id::text, d.name, pr.reason, pr.created_at, pr.priority::text
        from profile_reports pr join doctors d on d.id = pr.doctor_id where pr.status = 'open'
      union all
      select 'correction', co.id::text, d.name, co.field, co.created_at, 'low'
        from corrections co join doctors d on d.id = co.doctor_id where co.status = 'open'
      union all
      select 'enquiry', e.id::text, d.name, coalesce(e.preferred_day, ''), e.created_at, 'normal'
        from enquiries e join doctors d on d.id = e.doctor_id where e.status = 'new'
      union all
      select 'register', en.doctor_id::text, d.name, en.nmc_status, coalesce(en.nmc_checked_at, en.updated_at), 'low'
        from doctor_enrichment en join doctors d on d.id = en.doctor_id where en.nmc_status in ('ambiguous','number_mismatch','removed')
    ) t
    order by created_at asc
    limit ${limit}
  `);
  const now = Date.now();
  return rows
    .map((r) => {
      const createdAt = new Date(r.created_at);
      const ageHours = Math.max(0, (now - createdAt.getTime()) / 36e5);
      const slaHours = r.priority === "safety" ? 4 : SLA_HOURS[r.kind];
      return {
        kind: r.kind,
        id: r.id,
        subject: r.subject ?? "—",
        detail: r.detail ?? "",
        createdAt,
        priority: PRIORITY[r.priority ?? "normal"] ?? 2,
        slaHours,
        ageHours,
        breached: ageHours > slaHours,
        href: `${QUEUE_HREF[r.kind]}#${r.id}`,
      } satisfies InboxItem;
    })
    .sort((a, b) => (a.priority - b.priority) || (b.ageHours / b.slaHours - a.ageHours / a.slaHours));
}

export interface QueueSummary {
  kind: InboxKind;
  label: string;
  href: string;
  open: number;
  breached: number;
  oldestHours: number;
}

export function summariseInbox(items: InboxItem[]): QueueSummary[] {
  const by = new Map<InboxKind, QueueSummary>();
  for (const k of Object.keys(KIND_LABEL) as InboxKind[]) by.set(k, { kind: k, label: KIND_LABEL[k], href: QUEUE_HREF[k], open: 0, breached: 0, oldestHours: 0 });
  for (const it of items) {
    const s = by.get(it.kind)!;
    s.open += 1;
    if (it.breached) s.breached += 1;
    s.oldestHours = Math.max(s.oldestHours, it.ageHours);
  }
  return [...by.values()].sort((a, b) => b.breached - a.breached || b.open - a.open);
}

/* ------------------------------------------------------------------------ */
/* Verification throughput                                                   */
/* ------------------------------------------------------------------------ */

export interface Funnel {
  published: number;
  withNumber: number;
  registrationVerified: number;
  practiceConfirmed: number;
  verified: number;
  indexable: number;
  claimed: number;
  belowGate: number;
  noPractice: number;
}

export async function verificationFunnel(): Promise<Funnel> {
  const r = await one(sql`
    select
      (select count(*) from doctors where status = 'published') as published,
      (select count(distinct doctor_id) from medical_registrations where number_normalized is not null and number_normalized <> '') as with_number,
      (select count(distinct doctor_id) from medical_registrations where status = 'verified') as registration_verified,
      (select count(distinct d.id) from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id
         where d.status = 'published' and coalesce(p.confirmed_on, f.confirmed_on) is not null) as practice_confirmed,
      (select count(distinct d.id) from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id
         where d.status = 'published' and d.quality_score >= ${q()} and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${fresh()}::int)) as verified,
      (select count(distinct d.id) from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key
         where d.status = 'published' ${env.gates.profileIndexMode === "all" ? sql`` : sql`and d.quality_score >= ${q()} and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${fresh()}::int)`}) as indexable,
      (select count(*) from doctors where status = 'published' and claimed) as claimed,
      (select count(*) from doctors where status = 'published' and quality_score < ${q()}) as below_gate,
      (select count(*) from doctors d where d.status = 'published' and not exists (select 1 from doctor_practices p where p.doctor_id = d.id and p.active)) as no_practice
  `);
  return {
    published: n(r.published),
    withNumber: n(r.with_number),
    registrationVerified: n(r.registration_verified),
    practiceConfirmed: n(r.practice_confirmed),
    verified: n(r.verified),
    indexable: n(r.indexable),
    claimed: n(r.claimed),
    belowGate: n(r.below_gate),
    noPractice: n(r.no_practice),
  };
}

export interface RegisterStatus {
  status: string;
  count: number;
}

/** NMC step outcome across published doctors; doctors the worker has not reached yet count as pending. */
export async function registerBreakdown(): Promise<RegisterStatus[]> {
  const rows = await many<{ status: string; count: number }>(sql`
    select coalesce(e.nmc_status, 'pending') as status, count(*)::int as count
    from doctors d left join doctor_enrichment e on e.doctor_id = d.id
    where d.status = 'published'
    group by 1 order by 2 desc
  `);
  return rows.map((r) => ({ status: r.status, count: n(r.count) }));
}

export interface WorkerHealth {
  lastActivity: Date | null;
  processed24h: number;
  processed7d: number;
  nmcPending: number;
  googlePending: number;
  googleMatched: number;
  errors24h: number;
  /** Days to clear the NMC backlog at the 7-day pace; null when the pace is 0. */
  etaDays: number | null;
}

export async function workerHealth(): Promise<WorkerHealth> {
  const r = await one(sql`
    select
      (select max(updated_at) from doctor_enrichment) as last_activity,
      (select count(*) from doctor_enrichment where nmc_checked_at >= now() - interval '24 hours') as p24,
      (select count(*) from doctor_enrichment where nmc_checked_at >= now() - interval '7 days') as p7,
      (select count(*) from doctors d left join doctor_enrichment e on e.doctor_id = d.id where d.status = 'published' and coalesce(e.nmc_status,'pending') = 'pending') as nmc_pending,
      (select count(*) from doctors d left join doctor_enrichment e on e.doctor_id = d.id where d.status = 'published' and coalesce(e.google_status,'pending') = 'pending') as google_pending,
      (select count(*) from doctor_enrichment where google_status = 'matched') as google_matched,
      (select count(*) from doctor_enrichment where last_error is not null and updated_at >= now() - interval '24 hours') as errors24
  `);
  const p7 = n(r.p7);
  const pending = n(r.nmc_pending);
  return {
    lastActivity: r.last_activity ? new Date(r.last_activity as string) : null,
    processed24h: n(r.p24),
    processed7d: p7,
    nmcPending: pending,
    googlePending: n(r.google_pending),
    googleMatched: n(r.google_matched),
    errors24h: n(r.errors24),
    etaDays: p7 > 0 ? Math.ceil(pending / (p7 / 7)) : null,
  };
}

export interface DayCount {
  day: string;
  count: number;
}

/** Registration checks that came back verified, per day, for the last `days` days (zero-filled). */
export async function registerChecksPerDay(days = 30): Promise<DayCount[]> {
  const rows = await many<{ day: string; count: number }>(sql`
    select to_char(g.d, 'YYYY-MM-DD') as day, coalesce(c.count, 0)::int as count
    from generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') g(d)
    left join (
      select checked_on as d, count(*) as count
      from verification_checks
      where kind = 'registration' and result = 'verified' and checked_on >= current_date - ${days - 1}::int
      group by 1
    ) c on c.d = g.d::date
    order by g.d
  `);
  return rows.map((r) => ({ day: r.day, count: n(r.count) }));
}

export interface CityRow {
  city: string;
  state: string;
  citySlug: string;
  stateSlug: string;
  published: number;
  registrationVerified: number;
  practiceConfirmed: number;
  verified: number;
  claimed: number;
  enquiries30d: number;
}

export async function cityTable(limit = 12): Promise<CityRow[]> {
  const rows = await many<Row>(sql`
    with dp as (
      select distinct d.id as doctor_id, l.city, l.state, l.city_slug, l.state_slug, d.quality_score, d.claimed,
             coalesce(p.confirmed_on, f.confirmed_on) as confirmed_on
      from doctors d
      join doctor_practices p on p.doctor_id = d.id and p.active
      join facilities f on f.id = p.facility_id
      join localities l on l.key = f.locality_key
      where d.status = 'published'
    ),
    cities as (
      select city, state, city_slug, state_slug,
             count(distinct doctor_id)::int as published,
             count(distinct doctor_id) filter (where confirmed_on is not null)::int as practice_confirmed,
             count(distinct doctor_id) filter (where quality_score >= ${q()} and confirmed_on >= current_date - ${fresh()}::int)::int as verified,
             count(distinct doctor_id) filter (where claimed)::int as claimed
      from dp group by 1,2,3,4
    ),
    regs as (
      select dp.city, dp.state, count(distinct dp.doctor_id)::int as registration_verified
      from dp join medical_registrations m on m.doctor_id = dp.doctor_id and m.status = 'verified'
      group by 1,2
    ),
    enq as (
      select dp.city, dp.state, count(distinct e.id)::int as enquiries
      from dp join enquiries e on e.doctor_id = dp.doctor_id and e.created_at >= now() - interval '30 days'
      group by 1,2
    )
    select c.*, coalesce(r.registration_verified, 0) as registration_verified, coalesce(e.enquiries, 0) as enquiries
    from cities c
    left join regs r on r.city = c.city and r.state = c.state
    left join enq e on e.city = c.city and e.state = c.state
    order by c.published desc
    limit ${limit}
  `);
  return rows.map((r) => ({
    city: String(r.city),
    state: String(r.state),
    citySlug: String(r.city_slug),
    stateSlug: String(r.state_slug),
    published: n(r.published),
    registrationVerified: n(r.registration_verified),
    practiceConfirmed: n(r.practice_confirmed),
    verified: n(r.verified),
    claimed: n(r.claimed),
    enquiries30d: n(r.enquiries),
  }));
}

/* ------------------------------------------------------------------------ */
/* Growth                                                                    */
/* ------------------------------------------------------------------------ */

export interface Growth {
  enquiries7d: number;
  enquiriesPrev7d: number;
  claims7d: number;
  claimsPrev7d: number;
  claimsApproved7d: number;
  reviews7d: number;
  reviewsPrev7d: number;
  newProfiles7d: number;
  newProfilesPrev7d: number;
  doctorAccounts: number;
  seoRoutesIndexable: number;
  seoRoutesTotal: number;
  enquiriesPerDay: DayCount[];
  claimsPerDay: DayCount[];
}

export async function growth(days = 30): Promise<Growth> {
  const r = await one(sql`
    select
      (select count(*) from enquiries where created_at >= now() - interval '7 days') as e7,
      (select count(*) from enquiries where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days') as e14,
      (select count(*) from doctor_claims where created_at >= now() - interval '7 days') as c7,
      (select count(*) from doctor_claims where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days') as c14,
      (select count(*) from doctor_claims where status = 'approved' and decided_at >= now() - interval '7 days') as ca7,
      (select count(*) from reviews where submitted_at >= now() - interval '7 days') as r7,
      (select count(*) from reviews where submitted_at >= now() - interval '14 days' and submitted_at < now() - interval '7 days') as r14,
      (select count(*) from doctors where created_at >= now() - interval '7 days') as d7,
      (select count(*) from doctors where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days') as d14,
      (select count(*) from users where role = 'doctor' and disabled_at is null) as accounts,
      (select count(*) from seo_routes where case override when 'force_index' then true when 'force_noindex' then false else computed_indexable end) as seo_ok,
      (select count(*) from seo_routes) as seo_total
  `);
  const series = await many<{ day: string; enquiries: number; claims: number }>(sql`
    select to_char(g.d, 'YYYY-MM-DD') as day,
           (select count(*) from enquiries e where e.created_at::date = g.d::date)::int as enquiries,
           (select count(*) from doctor_claims c where c.created_at::date = g.d::date)::int as claims
    from generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') g(d)
    order by g.d
  `);
  return {
    enquiries7d: n(r.e7),
    enquiriesPrev7d: n(r.e14),
    claims7d: n(r.c7),
    claimsPrev7d: n(r.c14),
    claimsApproved7d: n(r.ca7),
    reviews7d: n(r.r7),
    reviewsPrev7d: n(r.r14),
    newProfiles7d: n(r.d7),
    newProfilesPrev7d: n(r.d14),
    doctorAccounts: n(r.accounts),
    seoRoutesIndexable: n(r.seo_ok),
    seoRoutesTotal: n(r.seo_total),
    enquiriesPerDay: series.map((s) => ({ day: s.day, count: n(s.enquiries) })),
    claimsPerDay: series.map((s) => ({ day: s.day, count: n(s.claims) })),
  };
}

export interface TopDoctor {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  enquiries: number;
  claimed: boolean;
  qualityScore: number;
}

export async function topDoctorsByEnquiries(days = 30, limit = 8): Promise<TopDoctor[]> {
  const rows = await many<Row>(sql`
    select d.id, d.slug, d.name, d.claimed, d.quality_score,
           (select l.city from doctor_practices p join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where p.doctor_id = d.id and p.active order by p.sort limit 1) as city,
           count(e.id)::int as enquiries
    from enquiries e join doctors d on d.id = e.doctor_id
    where e.created_at >= now() - (${days} || ' days')::interval
    group by d.id order by enquiries desc, d.name limit ${limit}
  `);
  return rows.map((r) => ({ id: String(r.id), slug: String(r.slug), name: String(r.name), city: (r.city as string | null) ?? null, enquiries: n(r.enquiries), claimed: Boolean(r.claimed), qualityScore: n(r.quality_score) }));
}

/* ------------------------------------------------------------------------ */
/* History (admin_daily_stats)                                               */
/* ------------------------------------------------------------------------ */

export interface StockPoint {
  day: string;
  published: number;
  verified: number;
  indexable: number;
  claimed: number;
  registrationVerified: number;
  nmcConfirmed: number;
  queueOpen: number;
}

export async function stockHistory(days = 90): Promise<StockPoint[]> {
  const rows = await many<Row>(sql`
    select to_char(day, 'YYYY-MM-DD') as day, published, verified, indexable, claimed, registration_verified, nmc_confirmed, queue_open
    from admin_daily_stats where day >= current_date - ${days}::int order by day
  `);
  return rows.map((r) => ({ day: String(r.day), published: n(r.published), verified: n(r.verified), indexable: n(r.indexable), claimed: n(r.claimed), registrationVerified: n(r.registration_verified), nmcConfirmed: n(r.nmc_confirmed), queueOpen: n(r.queue_open) }));
}

/* ------------------------------------------------------------------------ */
/* System (super_admin)                                                      */
/* ------------------------------------------------------------------------ */

export interface HealthCheck {
  label: string;
  state: "ok" | "warn" | "bad" | "info";
  value: string;
  hint?: string;
}

/** Configuration the console depends on, read from the process env — never the values, only whether they are usable. */
export function configChecks(): HealthCheck[] {
  const prod = env.appEnv === "production";
  const provider = (process.env.EMAIL_PROVIDER ?? "").toLowerCase() || "unset";
  const fieldKey = process.env.FIELD_ENCRYPTION_KEY?.trim();
  const fieldKeyBytes = fieldKey ? Buffer.from(fieldKey.split(",")[0].trim(), "base64").length : 0;
  const mfaRequired = process.env.STAFF_MFA_REQUIRED ? process.env.STAFF_MFA_REQUIRED !== "0" : prod;
  return [
    { label: "Environment", state: "info", value: `${env.appEnv} · ${env.siteUrl}` },
    {
      label: "Email delivery",
      state: emailConfigured() ? "ok" : prod ? "bad" : "warn",
      value: emailConfigured() ? provider : `${provider} — not delivering`,
      hint: emailConfigured() ? undefined : "Sign-in codes, claim outcomes and enquiry forwards are logged, not sent. Set EMAIL_PROVIDER and its key.",
    },
    { label: "SMS (practice OTP claims)", state: smsConfigured() ? "ok" : "warn", value: smsConfigured() ? "twilio" : "not configured", hint: smsConfigured() ? undefined : "Doctors can still claim by work email or document." },
    { label: "Staff two-step sign-in", state: mfaRequired ? "ok" : prod ? "bad" : "info", value: mfaRequired ? "required" : "optional", hint: mfaRequired ? undefined : "STAFF_MFA_REQUIRED is off." },
    {
      label: "Field encryption key",
      state: fieldKey ? (fieldKeyBytes === 32 ? "ok" : "warn") : process.env.AUTH_SECRET ? "info" : "bad",
      value: fieldKey ? `${fieldKeyBytes}-byte key${fieldKeyBytes === 32 ? "" : " (normalised)"}` : process.env.AUTH_SECRET ? "derived from AUTH_SECRET" : "missing",
      hint: fieldKey && fieldKeyBytes !== 32 ? "Works, but a 32-byte base64 key is the documented shape." : undefined,
    },
    { label: "Profile index mode", state: env.gates.profileIndexMode === "all" ? "warn" : "ok", value: env.gates.profileIndexMode, hint: env.gates.profileIndexMode === "all" ? "Every published profile is indexed, verified or not. Watch Search Console for thin-page signals." : undefined },
    { label: "Quality gate", state: "info", value: `≥ ${env.gates.profileQuality} · practice fresh within ${env.freshness.deindexAfterDays} d` },
    { label: "Google Places key", state: process.env.GOOGLE_PLACES_API_KEY ? "ok" : "warn", value: process.env.GOOGLE_PLACES_API_KEY ? "set" : "missing", hint: process.env.GOOGLE_PLACES_API_KEY ? undefined : "The Google step of the enrichment worker is skipped." },
    { label: "IndexNow key", state: process.env.INDEXNOW_KEY ? "ok" : "warn", value: process.env.INDEXNOW_KEY ? "set" : "missing" },
    { label: "Cron secret", state: process.env.CRON_SECRET ? "ok" : "bad", value: process.env.CRON_SECRET ? "set" : "missing", hint: process.env.CRON_SECRET ? undefined : "/api/cron/maintenance and /api/revalidate are unprotected or disabled." },
    { label: "Search Console verification", state: env.googleSiteVerification ? "ok" : "warn", value: env.googleSiteVerification ? "tag present" : "no tag" },
  ];
}

export interface JobStatus {
  label: string;
  lastRun: Date | null;
  detail: string;
  expectedEveryHours: number;
}

export async function jobStatuses(worker: WorkerHealth): Promise<JobStatus[]> {
  const rows = await many<{ created_at: Date | string; after: Record<string, unknown> | null }>(sql`
    select created_at, after from audit_logs where action = 'maintenance.ran' order by created_at desc limit 1
  `);
  const m = rows[0];
  const mAfter = m?.after ?? {};
  return [
    {
      label: "Maintenance (quality, SEO routes, sitemap ping, snapshot)",
      lastRun: m ? new Date(m.created_at) : null,
      detail: m ? `${n(mAfter.qualityRecomputed)} recomputed · ${n(mAfter.seoRoutes)} routes · ${n(mAfter.indexNowSubmitted)} URLs pinged · ${Math.round(n(mAfter.ms) / 1000)} s` : "never ran",
      expectedEveryHours: 24,
    },
    {
      label: "Enrichment worker (NMC register, Google Places)",
      lastRun: worker.lastActivity,
      detail: worker.lastActivity ? `${worker.processed24h} checked in 24 h · ${worker.errors24h} errors` : "no activity recorded",
      expectedEveryHours: 3,
    },
  ];
}

export interface StaffRow {
  userId: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
  active: boolean;
  mfaEnrolled: boolean;
  lastSignInAt: Date | null;
  openSessions: number;
  decisions30d: number;
}

export async function staffTable(): Promise<StaffRow[]> {
  const rows = await many<Row>(sql`
    select sm.user_id, u.email, u.display_name, sm.roles, sm.active, sm.mfa_enrolled, u.last_sign_in_at,
           (select count(*) from sessions s where s.user_id = sm.user_id and s.revoked_at is null and s.expires_at > now())::int as open_sessions,
           (select count(*) from audit_logs a where a.actor_user_id = sm.user_id and a.created_at >= now() - interval '30 days')::int as decisions
    from staff_members sm join users u on u.id = sm.user_id
    order by sm.active desc, u.email
  `);
  return rows.map((r) => ({
    userId: String(r.user_id),
    email: (r.email as string | null) ?? null,
    displayName: (r.display_name as string | null) ?? null,
    roles: Array.isArray(r.roles) ? (r.roles as string[]) : String(r.roles ?? "").replace(/[{}]/g, "").split(",").filter(Boolean),
    active: Boolean(r.active),
    mfaEnrolled: Boolean(r.mfa_enrolled),
    lastSignInAt: r.last_sign_in_at ? new Date(r.last_sign_in_at as string) : null,
    openSessions: n(r.open_sessions),
    decisions30d: n(r.decisions),
  }));
}

export interface RecentAudit {
  id: string;
  createdAt: Date;
  action: string;
  entityType: string;
  entityId: string | null;
  actor: string;
  reason: string | null;
}

export async function recentAudit(limit = 12): Promise<RecentAudit[]> {
  const rows = await many<Row>(sql`
    select a.id, a.created_at, a.action, a.entity_type, a.entity_id, a.reason, coalesce(u.email, a.actor_role, 'system') as actor
    from audit_logs a left join users u on u.id = a.actor_user_id
    order by a.created_at desc limit ${limit}
  `);
  return rows.map((r) => ({ id: String(r.id), createdAt: new Date(r.created_at as string), action: String(r.action), entityType: String(r.entity_type), entityId: (r.entity_id as string | null) ?? null, actor: String(r.actor), reason: (r.reason as string | null) ?? null }));
}
