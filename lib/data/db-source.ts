import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";

import { env } from "@/lib/env";
import { LOCALITIES, resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";
import { daysBetween, toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { isProfileIndexable } from "@/lib/seo/gates";
import type { DoctorView, LocalityKey, SpecialtyKey } from "@/lib/types";

/**
 * Postgres implementation of the data source. Public readers see published
 * doctors only. Everything is mapped into the same DoctorView the seed source
 * produces, so no component knows where a record came from.
 */

type DoctorRow = Awaited<ReturnType<typeof loadRows>>[number];

const CURRENT_YEAR = new Date().getUTCFullYear();

async function loadRows(where: ReturnType<typeof and> | undefined) {
  const db = getDb();
  return db.query.doctors.findMany({
    where,
    with: {
      registrations: true,
      qualifications: { orderBy: (q, { asc }) => [asc(q.sort)] },
      experience: { orderBy: (e, { asc }) => [asc(e.sort), asc(e.fromYear)] },
      practices: { where: (p, { eq }) => eq(p.active, true), orderBy: (p, { asc }) => [asc(p.sort)], with: { facility: true } },
      reviews: {
        where: (r, { inArray }) => inArray(r.status, ["published", "redacted"]),
        orderBy: (r, { desc }) => [desc(r.submittedAt)],
        with: { response: true },
      },
    },
    orderBy: (d, { asc }) => [asc(d.name)],
  });
}

async function loadRollups(ids: string[]): Promise<Map<string, { average: number; count: number; dist: [number, number, number, number, number]; evidence: number }>> {
  const map = new Map();
  if (!ids.length) return map;
  const rows = (await getDb().execute(sql`
    select doctor_id, review_count, average, star1, star2, star3, star4, star5, evidence_checked_count
    from doctor_rating_rollups where doctor_id in ${ids}
  `)) as unknown as Array<{ doctor_id: string; review_count: number; average: string; star1: number; star2: number; star3: number; star4: number; star5: number; evidence_checked_count: number }>;
  for (const r of rows) {
    map.set(r.doctor_id, { average: Number(r.average), count: Number(r.review_count), dist: [r.star1, r.star2, r.star3, r.star4, r.star5], evidence: Number(r.evidence_checked_count) });
  }
  return map;
}

function toView(row: DoctorRow, rollup?: { average: number; count: number; dist: [number, number, number, number, number]; evidence: number }): DoctorView {
  const primary = row.registrations.find((r) => r.isPrimary) ?? row.registrations[0];
  const practices = row.practices.map((p) => ({
    id: p.id,
    facilityId: p.facilityId,
    facility: p.facility.name,
    locality: p.facility.localityKey as LocalityKey,
    address: p.facility.address,
    postalCode: p.facility.postalCode ?? "",
    days: p.days,
    hours: p.hours,
    // A fee older than the freshness window is hidden, not shown stale.
    feeInr: p.feeInr !== null && p.feeCheckedOn && daysBetween(p.feeCheckedOn) <= env.freshness.feeDays ? p.feeInr : null,
    feeCheckedOn: p.feeCheckedOn ? toDisplay(p.feeCheckedOn) : null,
    confirmedOn: toDisplay(p.confirmedOn ?? p.facility.confirmedOn),
    phone: p.phone ?? p.facility.phone ?? "",
    ...geo(p.facility.lat, p.facility.lng, p.facility.localityKey as LocalityKey),
  }));

  const newestConfirm = row.practices
    .map((p) => p.confirmedOn ?? p.facility.confirmedOn)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  const stale = !newestConfirm || daysBetween(newestConfirm) > env.freshness.deindexAfterDays;
  const status: DoctorView["status"] = row.status === "retired" ? "retired" : stale ? "stale" : "active";

  const doctor = {
    id: row.publicId,
    dbId: row.id,
    lifecycle: row.status,
    photoUrl: row.photoFileId && row.photoConsent ? `/photos/${row.photoFileId}` : null,
    slug: row.slug,
    name: row.name,
    gender: (row.gender === "M" ? "M" : "F") as "F" | "M",
    specialty: row.specialtyKey as SpecialtyKey,
    subspecialties: row.subspecialties,
    registration: {
      number: primary?.number ?? "—",
      council: primary?.council ?? "—",
      registeredYear: primary?.registeredYear ?? 0,
      checkedOn: toDisplay(primary?.checkedOn),
    },
    qualifications: row.qualifications.map((q) => ({
      degree: q.degree,
      institution: q.institution,
      year: q.year ?? 0,
      state: (q.state === "verified" ? "verified" : "submitted") as "verified" | "submitted",
    })),
    practiceStartYear: row.practiceStartYear ?? CURRENT_YEAR,
    languages: row.languages,
    modes: row.modes as Array<"In person" | "Online">,
    about: row.about,
    services: row.services,
    experience: row.experience.map((e) => ({ role: e.role, place: e.place, from: e.fromYear, to: e.toYear })),
    practices,
    claimed: row.claimed,
    qualityScore: row.qualityScore,
    status,
    lastVerifiedOn: toDisplay(row.lastVerifiedOn),
    hprVerified: row.hprVerified,
    rating: {
      average: rollup?.average ?? 0,
      count: rollup?.count ?? 0,
      distribution: rollup?.dist ?? ([0, 0, 0, 0, 0] as [number, number, number, number, number]),
    },
    reviews: row.reviews.map((r) => ({
      id: r.id,
      author: r.authorLabel,
      visitMonth: r.visitMonth,
      mode: (r.mode === "Online" ? "Online" : "In person") as "In person" | "Online",
      evidenceChecked: r.evidence === "checked",
      dimensions: { communication: r.communication, explanation: r.explanation, waitTime: r.waitTime, facility: r.facility },
      text: r.status === "redacted" && r.publishedText ? r.publishedText : r.text,
      reply: r.response && r.response.status === "published" ? r.response.text : null,
    })),
  };

  return {
    ...doctor,
    yearsOfExperience: Math.max(0, CURRENT_YEAR - doctor.practiceStartYear),
    localities: Array.from(new Set(practices.map((p) => p.locality))),
    indexable: row.status === "published" && isProfileIndexable(doctor),
    hasEvidenceReviews: (rollup?.evidence ?? 0) > 0,
  };
}

async function views(where: ReturnType<typeof and> | undefined): Promise<DoctorView[]> {
  const rows = await loadRows(where);
  const rollups = await loadRollups(rows.map((r) => r.id));
  return rows.map((r) => toView(r, rollups.get(r.id)));
}

function geo(lat: string | null, lng: string | null, locality: LocalityKey): { lat: number; lng: number; geoSource: "facility" | "locality" } {
  if (lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) return { lat: Number(lat), lng: Number(lng), geoSource: "facility" };
  const l = LOCALITIES[locality];
  return { lat: l?.lat ?? 0, lng: l?.lng ?? 0, geoSource: "locality" };
}

const published = () => eq(s.doctors.status, "published");

export const dbSource = {
  async getAllDoctors(): Promise<DoctorView[]> {
    return views(and(published()));
  },
  async getDoctorBySlug(slug: string): Promise<DoctorView | null> {
    const [v] = await views(and(eq(s.doctors.slug, slug), inArray(s.doctors.status, ["published", "suspended", "retired"])));
    return v ?? null;
  },
  async canonicalDoctorPath(slug: string): Promise<string | null> {
    const db = getDb();
    const [r] = await db.select({ to: s.slugRedirects.toPath }).from(s.slugRedirects).where(eq(s.slugRedirects.fromPath, `/doctor/${slug}`)).limit(1);
    if (r) return r.to;
    const publicId = slug.slice(slug.lastIndexOf("-") + 1);
    if (publicId.length !== 6) return null;
    let [d] = await db.select({ slug: s.doctors.slug, status: s.doctors.status, mergedIntoId: s.doctors.mergedIntoId }).from(s.doctors).where(eq(s.doctors.publicId, publicId)).limit(1);
    for (let hops = 0; d?.mergedIntoId && hops < 5; hops++) {
      [d] = await db.select({ slug: s.doctors.slug, status: s.doctors.status, mergedIntoId: s.doctors.mergedIntoId }).from(s.doctors).where(eq(s.doctors.id, d.mergedIntoId)).limit(1);
    }
    if (!d || d.slug === slug || !["published", "suspended", "retired"].includes(d.status)) return null;
    return `/doctor/${d.slug}`;
  },
  async getDoctorByDbId(id: string): Promise<DoctorView | null> {
    const [v] = await views(and(eq(s.doctors.id, id)));
    return v ?? null;
  },
  async findByRegistration(registrationNumber: string): Promise<DoctorView | null> {
    const norm = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const [reg] = await getDb().select({ doctorId: s.medicalRegistrations.doctorId }).from(s.medicalRegistrations).where(eq(s.medicalRegistrations.numberNormalized, norm)).limit(1);
    if (!reg) return null;
    const [v] = await views(and(eq(s.doctors.id, reg.doctorId)));
    return v ?? null;
  },
  async getDoctorsBySpecialty(specialty: SpecialtyKey): Promise<DoctorView[]> {
    return views(and(published(), eq(s.doctors.specialtyKey, specialty)));
  },
  async getDoctorsBySpecialtyAndLocality(specialty: SpecialtyKey, locality: LocalityKey): Promise<DoctorView[]> {
    const all = await this.getDoctorsBySpecialty(specialty);
    return all.filter((d) => d.localities.includes(locality));
  },
  async countIndexable(specialty: SpecialtyKey, locality?: LocalityKey): Promise<number> {
    const rows = (await getDb().execute(sql`
      select count(distinct d.id)::int as n
      from doctors d
      join doctor_practices p on p.doctor_id = d.id and p.active
      join facilities f on f.id = p.facility_id
      where d.status = 'published'
        and d.specialty_key = ${specialty}
        and d.quality_score >= ${env.gates.profileQuality}
        and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${env.freshness.deindexAfterDays}::int)
        ${locality ? sql`and f.locality_key = ${locality}` : sql``}
    `)) as unknown as Array<{ n: number }>;
    return Number(rows[0]?.n ?? 0);
  },
  async searchDoctors(query: string): Promise<DoctorView[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // "cardiologist", "heart doctor" → cardiology via the taxonomy's synonym list.
    const spec = resolveSpecialtyQuery(q)?.key ?? "";
    const rows = (await getDb().execute(sql`
      select id from doctors
      where status = 'published'
        and (lower(name) % ${q} or lower(name) like ${"%" + q + "%"} or specialty_key like ${"%" + q + "%"} or specialty_key = ${spec}
             or exists (select 1 from unnest(subspecialties) x where lower(x) like ${"%" + q + "%"}))
      order by (specialty_key = ${spec}) desc, similarity(lower(name), ${q}) desc
      limit 50
    `)) as unknown as Array<{ id: string }>;
    if (!rows.length) return [];
    return views(and(inArray(s.doctors.id, rows.map((r) => r.id))));
  },
  async getNearby(doctor: DoctorView, limit = 4): Promise<DoctorView[]> {
    const pool = (await this.getDoctorsBySpecialty(doctor.specialty)).filter((d) => d.slug !== doctor.slug && d.indexable);
    const shares = (d: DoctorView) => d.localities.some((l) => doctor.localities.includes(l));
    return [...pool.filter(shares), ...pool.filter((d) => !shares(d))].slice(0, limit);
  },
  async getDoctorsByLocality(locality: LocalityKey): Promise<DoctorView[]> {
    const all = await this.getAllDoctors();
    return all.filter((d) => d.localities.includes(locality));
  },
};

export type DbSource = typeof dbSource;
