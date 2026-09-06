import "server-only";

import { and, eq, isNotNull, isNull, lt, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { recomputeQuality } from "@/lib/services/doctors";
import { deleteFile } from "@/lib/services/files";
import { recomputeSeoRoutes } from "@/lib/services/seo";

/**
 * Scheduled housekeeping (plan §13 retention, §11.4 gates). Idempotent;
 * safe to run hourly. Triggered by /api/cron/maintenance (CRON_SECRET) or
 * `npm run db:maintenance`. Every run leaves one audit row with counts.
 */
const days = (k: string, d: number) => Number(process.env[k] ?? d);

export interface MaintenanceReport {
  evidencePurged: number;
  otpsDeleted: number;
  sessionsDeleted: number;
  rateLimitsDeleted: number;
  enquiriesAnonymised: number;
  eventsDeleted: number;
  qualityRecomputed: number;
  seoRoutes: number;
  ms: number;
}

export async function runMaintenance(actorUserId: string | null = null): Promise<MaintenanceReport> {
  const t0 = Date.now();
  const db = getDb();

  // Review evidence past its purge date: bytes go, the row stays as proof a check happened.
  const due = await db.select({ id: s.reviewEvidence.id, fileId: s.reviewEvidence.fileId }).from(s.reviewEvidence).innerJoin(s.files, eq(s.files.id, s.reviewEvidence.fileId)).where(and(isNotNull(s.reviewEvidence.purgeAfter), lt(s.reviewEvidence.purgeAfter, new Date()), isNull(s.files.deletedAt)));
  for (const e of due) await deleteFile(e.fileId);

  const otpDays = days("RETENTION_OTP_LOGS_DAYS", 30);
  const otps = await db.delete(s.otpCodes).where(sql`${s.otpCodes.createdAt} < now() - (${otpDays} || ' days')::interval`).returning({ id: s.otpCodes.id });

  const sessions = await db.delete(s.sessions).where(sql`${s.sessions.expiresAt} < now() - interval '7 days' or ${s.sessions.revokedAt} < now() - interval '7 days'`).returning({ id: s.sessions.id });

  const rl = await db.delete(s.rateLimits).where(sql`${s.rateLimits.windowStart} < now() - interval '2 days'`).returning({ key: s.rateLimits.key });

  // Closed enquiries older than the retention window lose the patient's contact detail.
  const enqDays = days("RETENTION_ENQUIRY_DAYS", 180);
  const enq = await db
    .update(s.enquiries)
    .set({ contact: "[removed after retention period]", note: null })
    .where(sql`${s.enquiries.createdAt} < now() - (${enqDays} || ' days')::interval and ${s.enquiries.contact} <> '[removed after retention period]'`)
    .returning({ id: s.enquiries.id });

  const evDays = days("RETENTION_ANALYTICS_RAW_DAYS", 395);
  const ev = await db.delete(s.events).where(sql`${s.events.createdAt} < now() - (${evDays} || ' days')::interval`).returning({ id: s.events.id });

  // Freshness decays daily: recompute quality for published profiles so the
  // gates, sitemaps and dashboard checklists move together.
  // Only profiles whose score can decay with time — those carrying a dated
  // confirmation or fee — need recomputing; an unverified import cannot change
  // by the calendar alone, and there may be tens of thousands of those.
  const published = (await db.execute(sql`
    select distinct d.id from doctors d
    join doctor_practices p on p.doctor_id = d.id and p.active
    join facilities f on f.id = p.facility_id
    where d.status = 'published' and (p.confirmed_on is not null or f.confirmed_on is not null or p.fee_checked_on is not null)
  `)) as unknown as Array<{ id: string }>;
  for (const d of published) await recomputeQuality(d.id);
  const seoRoutes = await recomputeSeoRoutes();

  const report: MaintenanceReport = {
    evidencePurged: due.length,
    otpsDeleted: otps.length,
    sessionsDeleted: sessions.length,
    rateLimitsDeleted: rl.length,
    enquiriesAnonymised: enq.length,
    eventsDeleted: ev.length,
    qualityRecomputed: published.length,
    seoRoutes,
    ms: Date.now() - t0,
  };
  await audit({ actorUserId, actorRole: actorUserId ? "staff" : "system", action: "maintenance.ran", entityType: "system", after: report });
  return report;
}
