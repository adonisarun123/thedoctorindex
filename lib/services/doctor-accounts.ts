import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";

/**
 * Accounts that said they are a doctor at sign-up, and where each stands on
 * verification. `role = 'doctor'` means a profile was claimed or created
 * against the register (lib/services/instant-onboard.ts, workflow.ts);
 * everything else is an unverified doctor account — the sales funnel, and
 * the reason these never appear on the patients page.
 */
export interface DoctorAccountRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  signedUpAt: Date;
  lastSignInAt: Date | null;
  completedAt: Date | null;
  flow: string;
  /** verified = role doctor with a profile; pending = a claim or submission waiting on staff; unverified = nothing yet. */
  state: "verified" | "pending" | "unverified";
  profileId: string | null;
  profileName: string | null;
  profileStatus: string | null;
  pendingKind: "claim" | "submission" | null;
}

export interface DoctorAccountFilter {
  q?: string;
  state?: "verified" | "pending" | "unverified";
  limit?: number;
}

export async function listDoctorAccounts(f: DoctorAccountFilter = {}): Promise<DoctorAccountRow[]> {
  const q = f.q?.trim();
  const digits = q ? q.replace(/\D/g, "") : "";
  const limit = Math.min(Math.max(f.limit ?? 500, 1), 5000);
  const conds = [sql`(u.account_type = 'doctor' or u.role = 'doctor')`];
  if (q) {
    const like = `%${q}%`;
    conds.push(
      digits.length >= 4
        ? sql`regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g') like ${`%${digits}%`}`
        : sql`(u.display_name ilike ${like} or u.email ilike ${like} or d.name ilike ${like})`,
    );
  }
  if (f.state === "verified") conds.push(sql`u.role = 'doctor' and d.id is not null`);
  if (f.state === "pending") conds.push(sql`u.role <> 'doctor' and (pc.id is not null or ps.id is not null)`);
  if (f.state === "unverified") conds.push(sql`u.role <> 'doctor' and pc.id is null and ps.id is null`);
  const rows = (await getDb().execute(sql`
    select u.id, u.display_name, u.phone, u.email, u.created_at, u.last_sign_in_at, u.profile_completed_at, u.signup_flow, u.role,
           d.id as profile_id, d.name as profile_name, d.status::text as profile_status,
           pc.id as pending_claim, ps.id as pending_submission
    from users u
    left join lateral (select id, name, status from doctors where claimed_by_user_id = u.id order by updated_at desc limit 1) d on true
    left join lateral (select id from doctor_claims where user_id = u.id and status = 'pending' limit 1) pc on true
    left join lateral (select id from doctor_submissions where user_id = u.id and status in ('submitted','in_review','needs_info') limit 1) ps on true
    where ${sql.join(conds, sql` and `)}
    order by u.created_at desc
    limit ${limit}
  `)) as unknown as Array<{
    id: string; display_name: string | null; phone: string | null; email: string | null; created_at: Date; last_sign_in_at: Date | null; profile_completed_at: Date | null; signup_flow: string | null; role: string;
    profile_id: string | null; profile_name: string | null; profile_status: string | null; pending_claim: string | null; pending_submission: string | null;
  }>;
  return rows.map((r) => ({
    id: r.id,
    name: r.display_name?.trim() || "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    signedUpAt: new Date(r.created_at),
    lastSignInAt: r.last_sign_in_at ? new Date(r.last_sign_in_at) : null,
    completedAt: r.profile_completed_at ? new Date(r.profile_completed_at) : null,
    flow: r.signup_flow ?? "",
    state: r.role === "doctor" && r.profile_id ? "verified" : r.pending_claim || r.pending_submission ? "pending" : "unverified",
    profileId: r.profile_id,
    profileName: r.profile_name,
    profileStatus: r.profile_status,
    pendingKind: r.pending_claim ? "claim" : r.pending_submission ? "submission" : null,
  }));
}

export async function doctorAccountTotals(): Promise<{ total: number; verified: number; pending: number; unverified: number; last7: number }> {
  const [row] = (await getDb().execute(sql`
    select count(*)::int as total,
           count(*) filter (where u.role = 'doctor' and exists (select 1 from doctors where claimed_by_user_id = u.id))::int as verified,
           count(*) filter (where u.role <> 'doctor' and (exists (select 1 from doctor_claims c where c.user_id = u.id and c.status = 'pending') or exists (select 1 from doctor_submissions x where x.user_id = u.id and x.status in ('submitted','in_review','needs_info'))))::int as pending,
           count(*) filter (where u.created_at > now() - interval '7 days')::int as last7
    from users u where u.account_type = 'doctor' or u.role = 'doctor'
  `)) as unknown as Array<{ total: number; verified: number; pending: number; last7: number }>;
  const total = Number(row?.total ?? 0), verified = Number(row?.verified ?? 0), pending = Number(row?.pending ?? 0);
  return { total, verified, pending, unverified: total - verified - pending, last7: Number(row?.last7 ?? 0) };
}
