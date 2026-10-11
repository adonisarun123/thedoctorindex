import { sql } from "drizzle-orm";

import { getSessionUser } from "@/lib/auth/session";
import { normaliseBookingRef } from "@/lib/booking/ref";
import { getDb } from "@/lib/db/client";
import { displayName } from "@/lib/display-name";
import { specialtyByKey } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export interface PaletteHit {
  kind: "doctor" | "patient" | "booking";
  title: string;
  sub: string;
  href: string;
  tag?: string;
}

/**
 * The command palette's search (components/admin/CommandPalette.tsx). Staff
 * only; returns a handful of doctors, patients and bookings for a query.
 * Digits search mobiles and booking refs; everything else searches names,
 * slugs, emails and registration numbers.
 */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "staff" || !user.staffRoles.length) return Response.json({ error: "unauthorised" }, { status: 401 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return Response.json({ hits: [] as PaletteHit[] });
  const db = getDb();
  const like = `%${q}%`;
  const digits = q.replace(/\D/g, "");
  const ref = normaliseBookingRef(q);
  const superAdmin = user.staffRoles.includes("super_admin");

  const [doctors, patients, bookings] = await Promise.all([
    db.execute(sql`
      select d.id, d.name, d.specialty_key, d.status, d.slug,
             (select l.city from doctor_practices p join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key
               where p.doctor_id = d.id and p.active order by p.sort, p.id limit 1) as city
      from doctors d
      where lower(d.name) like ${like.toLowerCase()} or d.slug like ${like.toLowerCase()} or d.public_id = ${q} or d.tdi_id = ${q.toUpperCase()}
         or exists (select 1 from medical_registrations r where r.doctor_id = d.id and (r.number ilike ${like} or r.number_normalized = ${q.toUpperCase().replace(/[^A-Z0-9]/g, "")}))
      order by (d.status = 'published') desc, d.quality_score desc, d.name asc
      limit 6
    `) as unknown as Promise<Array<{ id: string; name: string; specialty_key: string; status: string; slug: string; city: string | null }>>,
    db.execute(sql`
      select u.id, u.display_name, u.phone, u.email, u.city
      from users u
      where u.role = 'patient' and coalesce(u.account_type, 'patient') = 'patient' and (
        ${digits.length >= 4 ? sql`regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g') like ${`%${digits}%`}` : sql`false`}
        or u.display_name ilike ${like} or u.email ilike ${like})
      order by u.created_at desc
      limit 4
    `) as unknown as Promise<Array<{ id: string; display_name: string | null; phone: string | null; email: string | null; city: string | null }>>,
    superAdmin
      ? (db.execute(sql`
          select a.id, a.ref, a.patient_name, a.status, a.starts_at, d.name as doctor_name, d.specialty_key
          from appointments a join doctors d on d.id = a.doctor_id
          where ${ref ? sql`a.ref = ${ref}` : sql`false`} or a.patient_name ilike ${like}
             ${digits.length >= 4 ? sql`or regexp_replace(a.patient_phone, '[^0-9]', '', 'g') like ${`%${digits}%`}` : sql``}
          order by a.created_at desc
          limit 3
        `) as unknown as Promise<Array<{ id: string; ref: string; patient_name: string; status: string; starts_at: Date; doctor_name: string; specialty_key: string }>>)
      : Promise.resolve([]),
  ]);

  const hits: PaletteHit[] = [
    ...doctors.map((d) => ({
      kind: "doctor" as const,
      title: displayName({ name: d.name, specialtyKey: d.specialty_key }),
      sub: [specialtyByKey(d.specialty_key)?.name ?? d.specialty_key, d.city].filter(Boolean).join(" · "),
      href: `/admin/doctors/${d.id}`,
      tag: d.status,
    })),
    ...patients.map((p) => ({
      kind: "patient" as const,
      title: p.display_name?.trim() || p.email || p.phone || "Patient",
      sub: [p.phone, p.email, p.city].filter(Boolean).join(" · "),
      href: `/admin/patients?q=${encodeURIComponent(p.phone || p.email || p.display_name || "")}`,
    })),
    ...bookings.map((b) => ({
      kind: "booking" as const,
      title: `${b.ref} · ${b.patient_name}`,
      sub: `${displayName({ name: b.doctor_name, specialtyKey: b.specialty_key })} · ${new Date(b.starts_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}`,
      href: `/admin/bookings?q=${encodeURIComponent(b.ref)}`,
      tag: b.status,
    })),
  ];
  return Response.json({ hits }, { headers: { "cache-control": "no-store" } });
}
