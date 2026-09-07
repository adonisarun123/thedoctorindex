import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";

/** Queue depths for the admin navigation and overview. One round trip. */
export async function queueCounts(): Promise<Record<string, number>> {
  const rows = (await getDb().execute(sql`
    select
      (select count(*) from doctor_submissions where status in ('submitted','in_review','needs_info'))::int as submissions,
      (select count(*) from doctor_claims where status = 'pending')::int as claims,
      (select count(*) from profile_change_requests where status = 'pending')::int as changes,
      (select count(*) from reviews where status = 'pending')::int + (select count(*) from doctor_responses where status = 'pending')::int + (select count(*) from review_reports where status = 'open')::int as reviews,
      (select count(*) from profile_reports where status = 'open')::int + (select count(*) from corrections where status = 'open')::int as reports,
      (select count(*) from enquiries where status = 'new')::int as enquiries,
      (select count(*) from doctors where status = 'published')::int as published,
      (select count(*) from doctors where status = 'draft')::int as drafts,
      (select count(*) from doctors where status = 'published' and quality_score < ${Number(process.env.GATE_PROFILE_QUALITY ?? 70)})::int as below_gate,
      (select count(*) from reviews where status = 'pending' and risk_score >= 40)::int as high_risk_reviews,
      (select count(*) from review_reports where status = 'open' and priority = 'safety')::int + (select count(*) from profile_reports where status = 'open' and priority = 'safety')::int as safety,
      (select count(*) from doctor_enrichment where nmc_status in ('ambiguous','number_mismatch','removed'))::int as enrichment_queue
  `)) as unknown as Array<Record<string, number>>;
  const r = rows[0] ?? {};
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Number(v)]));
}
