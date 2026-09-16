import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { env } from "@/lib/env";

/**
 * Daily stock snapshot for the admin dashboard. Idempotent: one row per
 * calendar day (Asia/Kolkata), re-running the same day overwrites it, so the
 * hourly maintenance job can call this freely and the row ends the day with
 * the latest figures.
 *
 * "verified" follows lib/seo/gates.ts: quality at or above the gate AND a
 * practice confirmed inside the deindex window. "indexable" follows the
 * profile index mode. Both are the same definitions the public site uses, so
 * the chart and the sitemap never disagree.
 */
export async function snapshotDailyStats(): Promise<{ day: string }> {
  const db = getDb();
  const q = env.gates.profileQuality;
  const fresh = env.freshness.deindexAfterDays;
  const indexableJoin =
    env.gates.profileIndexMode === "all"
      ? sql`from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where d.status = 'published'`
      : sql`from doctors d join doctor_practices p on p.doctor_id = d.id and p.active join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where d.status = 'published' and d.quality_score >= ${q} and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${fresh}::int)`;

  const rows = (await db.execute(sql`
    insert into admin_daily_stats (
      day, published, verified, indexable, claimed, registration_verified, practice_confirmed,
      nmc_confirmed, nmc_pending, nmc_queue, google_matched, seo_routes_indexable, queue_open,
      reviews_published, doctor_accounts, captured_at
    )
    select
      (now() at time zone 'Asia/Kolkata')::date,
      (select count(*) from doctors where status = 'published'),
      (select count(distinct d.id) from doctors d
         join doctor_practices p on p.doctor_id = d.id and p.active
         join facilities f on f.id = p.facility_id
        where d.status = 'published' and d.quality_score >= ${q}
          and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${fresh}::int)),
      (select count(distinct d.id) ${indexableJoin}),
      (select count(*) from doctors where status = 'published' and claimed),
      (select count(distinct doctor_id) from medical_registrations where status = 'verified'),
      (select count(distinct d.id) from doctors d
         join doctor_practices p on p.doctor_id = d.id and p.active
         join facilities f on f.id = p.facility_id
        where d.status = 'published' and coalesce(p.confirmed_on, f.confirmed_on) is not null),
      (select count(*) from doctor_enrichment where nmc_status in ('confirmed','matched')),
      (select count(*) from doctors d left join doctor_enrichment e on e.doctor_id = d.id
        where d.status = 'published' and coalesce(e.nmc_status, 'pending') = 'pending'),
      (select count(*) from doctor_enrichment where nmc_status in ('ambiguous','number_mismatch','removed')),
      (select count(*) from doctor_enrichment where google_status = 'matched'),
      (select count(*) from seo_routes where case override when 'force_index' then true when 'force_noindex' then false else computed_indexable end),
      (select count(*) from doctor_submissions where status in ('submitted','in_review','needs_info'))
        + (select count(*) from doctor_claims where status = 'pending')
        + (select count(*) from profile_change_requests where status = 'pending')
        + (select count(*) from reviews where status = 'pending')
        + (select count(*) from doctor_responses where status = 'pending')
        + (select count(*) from review_reports where status = 'open')
        + (select count(*) from profile_reports where status = 'open')
        + (select count(*) from corrections where status = 'open')
        + (select count(*) from enquiries where status = 'new'),
      (select count(*) from reviews where status = 'published'),
      (select count(*) from users where role = 'doctor' and disabled_at is null),
      now()
    on conflict (day) do update set
      published = excluded.published, verified = excluded.verified, indexable = excluded.indexable,
      claimed = excluded.claimed, registration_verified = excluded.registration_verified,
      practice_confirmed = excluded.practice_confirmed, nmc_confirmed = excluded.nmc_confirmed,
      nmc_pending = excluded.nmc_pending, nmc_queue = excluded.nmc_queue, google_matched = excluded.google_matched,
      seo_routes_indexable = excluded.seo_routes_indexable, queue_open = excluded.queue_open,
      reviews_published = excluded.reviews_published, doctor_accounts = excluded.doctor_accounts,
      captured_at = excluded.captured_at
    returning day::text as day
  `)) as unknown as Array<{ day: string }>;
  return { day: rows[0]?.day ?? "" };
}
