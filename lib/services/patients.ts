import { sql } from "drizzle-orm";

import { getGeo } from "@/lib/data/geo";
import { getDb } from "@/lib/db/client";

/**
 * Patient accounts as staff see them. Every account gives its name, mobile,
 * email and area at /account/setup before it can enquire, book or review
 * (app/account/actions.ts), so these four columns are complete for any
 * account that has done anything; "incomplete" rows signed in and stopped.
 * Doctors and staff are excluded — they have their own queues. An account
 * that said it is a doctor at sign-up (users.account_type) is excluded even
 * before its profile is verified; those sit on /admin/doctor-accounts.
 */

/** The rows this page is about, as a WHERE fragment on alias `u`. */
export const PATIENT_ACCOUNT_SQL = sql`u.role = 'patient' and coalesce(u.account_type, 'patient') = 'patient'`;
export interface PatientRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  /** "HSR Layout, Bengaluru" — locality when chosen, else the typed city. */
  area: string;
  areaKey: string | null;
  city: string;
  signedUpAt: Date;
  lastSignInAt: Date | null;
  completedAt: Date | null;
  /** The journey the account was created for: enquire, review, dashboard … */
  flow: string;
  marketingOptIn: boolean;
  enquiries: number;
  bookings: number;
  reviews: number;
}

export interface PatientFilter {
  q?: string;
  /** "active" = at least one enquiry, booking or review; "incomplete" = never finished setup. */
  only?: "active" | "incomplete";
  limit?: number;
}

/** Area label for a user row; shared by the patients page and the queue views. */
export async function areaLabel(localityKey: string | null, city: string | null): Promise<{ area: string; city: string }> {
  const geo = await getGeo();
  const loc = localityKey ? geo.locality(localityKey) : null;
  if (loc) return { area: `${loc.name}, ${loc.city}`, city: loc.city };
  return { area: city?.trim() || "", city: city?.trim() || "" };
}

export async function listPatients(f: PatientFilter = {}): Promise<PatientRow[]> {
  const q = f.q?.trim();
  const digits = q ? q.replace(/\D/g, "") : "";
  const limit = Math.min(Math.max(f.limit ?? 500, 1), 5000);
  const conds = [PATIENT_ACCOUNT_SQL];
  if (q) {
    const like = `%${q}%`;
    conds.push(
      digits.length >= 4
        ? sql`regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g') like ${`%${digits}%`}`
        : sql`(u.display_name ilike ${like} or u.email ilike ${like} or u.city ilike ${like} or u.locality_key ilike ${like})`,
    );
  }
  if (f.only === "incomplete") conds.push(sql`u.profile_completed_at is null`);
  if (f.only === "active") conds.push(sql`(e.n > 0 or a.n > 0 or r.n > 0)`);
  const rows = (await getDb().execute(sql`
    select u.id, u.display_name, u.phone, u.email, u.locality_key, u.city, u.created_at, u.last_sign_in_at, u.profile_completed_at,
           u.signup_flow, u.marketing_opt_in,
           coalesce(e.n, 0)::int as enquiries, coalesce(a.n, 0)::int as bookings, coalesce(r.n, 0)::int as reviews
    from users u
    left join (select user_id, count(*) as n from enquiries where user_id is not null group by user_id) e on e.user_id = u.id
    left join (select patient_user_id, count(*) as n from appointments group by patient_user_id) a on a.patient_user_id = u.id
    left join (select author_user_id, count(*) as n from reviews group by author_user_id) r on r.author_user_id = u.id
    where ${sql.join(conds, sql` and `)}
    order by u.created_at desc
    limit ${limit}
  `)) as unknown as Array<{
    id: string; display_name: string | null; phone: string | null; email: string | null; locality_key: string | null; city: string | null;
    created_at: Date; last_sign_in_at: Date | null; profile_completed_at: Date | null; signup_flow: string | null; marketing_opt_in: boolean;
    enquiries: number; bookings: number; reviews: number;
  }>;
  const geo = await getGeo();
  return rows.map((r) => {
    const loc = r.locality_key ? geo.locality(r.locality_key) : null;
    return {
      id: r.id,
      name: r.display_name?.trim() || "",
      phone: r.phone ?? "",
      email: r.email ?? "",
      area: loc ? `${loc.name}, ${loc.city}` : r.city?.trim() || "",
      areaKey: r.locality_key,
      city: loc?.city ?? r.city?.trim() ?? "",
      signedUpAt: new Date(r.created_at),
      lastSignInAt: r.last_sign_in_at ? new Date(r.last_sign_in_at) : null,
      completedAt: r.profile_completed_at ? new Date(r.profile_completed_at) : null,
      flow: r.signup_flow ?? "",
      marketingOptIn: Boolean(r.marketing_opt_in),
      enquiries: Number(r.enquiries),
      bookings: Number(r.bookings),
      reviews: Number(r.reviews),
    };
  });
}

export async function patientTotals(): Promise<{ total: number; complete: number; active: number; last7: number; optedIn: number }> {
  const [row] = (await getDb().execute(sql`
    select count(*)::int as total,
           count(*) filter (where u.profile_completed_at is not null)::int as complete,
           count(*) filter (where exists (select 1 from enquiries e where e.user_id = u.id) or exists (select 1 from appointments a where a.patient_user_id = u.id) or exists (select 1 from reviews r where r.author_user_id = u.id))::int as active,
           count(*) filter (where u.created_at > now() - interval '7 days')::int as last7,
           count(*) filter (where u.marketing_opt_in)::int as opted_in
    from users u where ${PATIENT_ACCOUNT_SQL}
  `)) as unknown as Array<{ total: number; complete: number; active: number; last7: number; opted_in: number }>;
  return { total: Number(row?.total ?? 0), complete: Number(row?.complete ?? 0), active: Number(row?.active ?? 0), last7: Number(row?.last7 ?? 0), optedIn: Number(row?.opted_in ?? 0) };
}

/** RFC 4180 CSV of the same rows the page shows. */
export function patientsCsv(rows: PatientRow[]): string {
  const esc = (v: string | number | boolean | null | undefined) => {
    const t = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const head = ["name", "mobile", "email", "area", "city", "signed_up", "last_sign_in", "details_complete", "came_for", "marketing_opt_in", "enquiries", "bookings", "reviews"];
  const lines = rows.map((r) => [r.name, r.phone, r.email, r.area, r.city, r.signedUpAt.toISOString(), r.lastSignInAt?.toISOString() ?? "", r.completedAt ? "yes" : "no", r.flow, r.marketingOptIn ? "yes" : "no", r.enquiries, r.bookings, r.reviews].map(esc).join(","));
  return [head.join(","), ...lines].join("\r\n") + "\r\n";
}
