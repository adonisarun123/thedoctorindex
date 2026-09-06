import "server-only";

import { and, eq, inArray, sql, type SQL } from "drizzle-orm";

import { env } from "@/lib/env";
import { getGeo } from "@/lib/data/geo";
import { resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";
import { daysBetween, toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { isProfileIndexable } from "@/lib/seo/gates";
import type { DataSource, Measure, Place, PlaceCount, Totals } from "@/lib/data/index";
import type { DoctorView, Locality, SpecialtyKey } from "@/lib/types";

/**
 * Postgres implementation of the data source. Public readers see published
 * doctors only. Everything is mapped into the same DoctorView the seed source
 * produces, so no component knows where a record came from.
 *
 * Scale rule: no reader loads the whole table. Listings are one query per
 * (speciality, place) capped at LISTING_CAP; counts are GROUP BY queries over
 * the same "indexable" predicate the gates use, so a number on a page and the
 * sitemap entry for that page can never disagree.
 */

type DoctorRow = Awaited<ReturnType<typeof loadRows>>[number];

const CURRENT_YEAR = new Date().getUTCFullYear();
const CAP = 200;

/**
 * Hydration is a two-step: the ids that match come from a plain query the
 * planner handles well (indexed filters, ORDER BY, LIMIT), and the relational
 * query then loads exactly those rows by primary key. Combining a subquery
 * filter with five lateral joins in one statement sent the planner down a
 * 12-second path at 24k rows; split, the same listing takes tens of ms.
 */
async function loadRows(ids: string[]) {
  if (!ids.length) return [];
  const db = getDb();
  const rows = await db.query.doctors.findMany({
    where: inArray(s.doctors.id, ids),
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
  });
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

/**
 * Registration tier, the first sort key of every listing (policy: /policies/ranking).
 * 2 = a council registration number checked against the register, 1 = a number on
 * record awaiting a check, 0 = no number. Doctors with a number on record always
 * precede doctors without one; quality and name order within a tier.
 */
const REGISTRATION_TIER = sql`coalesce((select max(case when r.checked_on is not null then 2 else 1 end) from medical_registrations r where r.doctor_id = ${s.doctors.id} and r.number <> ''), 0)`;

async function selectIds(where: SQL, limit?: number): Promise<string[]> {
  const rows = (await getDb().execute(sql`select ${s.doctors.id} as id from ${s.doctors} where ${where} order by ${REGISTRATION_TIER} desc, ${s.doctors.qualityScore} desc, ${s.doctors.name} asc ${limit ? sql`limit ${limit}` : sql``}`)) as unknown as Array<{ id: string }>;
  return rows.map((r) => r.id);
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

function toView(row: DoctorRow, locality: (key: string) => Locality | null, rollup?: { average: number; count: number; dist: [number, number, number, number, number]; evidence: number }): DoctorView {
  const primary = row.registrations.find((r) => r.isPrimary) ?? row.registrations[0];
  const practices = row.practices.map((p) => {
    const loc = locality(p.facility.localityKey);
    return {
      id: p.id,
      facilityId: p.facilityId,
      facility: p.facility.name,
      locality: p.facility.localityKey,
      localityName: loc?.name ?? p.facility.localityKey,
      localitySlug: loc?.slug ?? p.facility.localityKey,
      city: loc?.city ?? "",
      citySlug: loc?.citySlug ?? "",
      state: loc?.state ?? "",
      stateSlug: loc?.stateSlug ?? "",
      address: p.facility.address,
      postalCode: p.facility.postalCode ?? "",
      days: p.days,
      hours: p.hours,
      // A fee older than the freshness window is hidden, not shown stale.
      feeInr: p.feeInr !== null && p.feeCheckedOn && daysBetween(p.feeCheckedOn) <= env.freshness.feeDays ? p.feeInr : null,
      feeCheckedOn: p.feeCheckedOn ? toDisplay(p.feeCheckedOn) : null,
      confirmedOn: toDisplay(p.confirmedOn ?? p.facility.confirmedOn),
      phone: p.phone ?? p.facility.phone ?? "",
      ...geo(p.facility.lat, p.facility.lng, loc),
    };
  });

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
    specialty: row.specialtyKey,
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
    practiceStartYear: row.practiceStartYear ?? 0,
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
    yearsOfExperience: doctor.practiceStartYear ? Math.max(0, CURRENT_YEAR - doctor.practiceStartYear) : 0,
    localities: Array.from(new Set(practices.map((p) => p.locality))),
    citySlugs: Array.from(new Set(practices.map((p) => p.citySlug).filter(Boolean))),
    indexable: row.status === "published" && isProfileIndexable(doctor),
    hasEvidenceReviews: (rollup?.evidence ?? 0) > 0,
  };
}

async function views(where: SQL, limit?: number): Promise<DoctorView[]> {
  const ids = await selectIds(where, limit);
  const [rows, geoReg, rollups] = await Promise.all([loadRows(ids), getGeo(), loadRollups(ids)]);
  return rows.map((r) => toView(r, geoReg.locality, rollups.get(r.id)));
}

async function viewsByIds(ids: string[]): Promise<DoctorView[]> {
  const [rows, geoReg, rollups] = await Promise.all([loadRows(ids), getGeo(), loadRollups(ids)]);
  return rows.map((r) => toView(r, geoReg.locality, rollups.get(r.id)));
}

function geo(lat: string | null, lng: string | null, locality: Locality | null): { lat?: number; lng?: number; geoSource?: "facility" | "locality" } {
  if (lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) return { lat: Number(lat), lng: Number(lng), geoSource: "facility" };
  if (locality?.lat !== null && locality?.lat !== undefined && locality.lng !== null) return { lat: locality.lat, lng: locality.lng, geoSource: "locality" };
  return {};
}

const published = () => eq(s.doctors.status, "published");

/* ---------------------------------------------------------------------------
   Indexable predicate, in SQL, identical in meaning to isProfileIndexable():
   published, quality at or above the gate, and at least one active practice
   whose confirmation is inside the freshness window.
--------------------------------------------------------------------------- */

function placeSql(place: Place | undefined, alias = "l"): SQL {
  const parts: SQL[] = [];
  if (place?.localityKey) parts.push(sql`f.locality_key = ${place.localityKey}`);
  else if (place?.citySlug) parts.push(sql`${sql.raw(alias)}.city_slug = ${place.citySlug}${place.stateSlug ? sql` and ${sql.raw(alias)}.state_slug = ${place.stateSlug}` : sql``}`);
  else if (place?.stateSlug) parts.push(sql`${sql.raw(alias)}.state_slug = ${place.stateSlug}`);
  return parts.length ? sql`and ${sql.join(parts, sql` and `)}` : sql``;
}

/** Doctors with at least one practice in the place; `idExpr` names the outer doctor id column. */
function inPlaceSubquery(place: Place, idExpr: SQL = sql`d.id`): SQL {
  return sql`${idExpr} in (
    select p.doctor_id from doctor_practices p
    join facilities f on f.id = p.facility_id
    join localities l on l.key = f.locality_key
    where p.active ${placeSql(place)}
  )`;
}

const INDEXABLE_JOIN = sql`
  from doctors d
  join doctor_practices p on p.doctor_id = d.id and p.active
  join facilities f on f.id = p.facility_id
  join localities l on l.key = f.locality_key
  where d.status = 'published'
    and d.quality_score >= ${env.gates.profileQuality}
    and coalesce(p.confirmed_on, f.confirmed_on) >= (current_date - ${env.freshness.deindexAfterDays}::int)
`;

/** Every published doctor with a practice, gate or no gate. */
const PUBLISHED_JOIN = sql`
  from doctors d
  join doctor_practices p on p.doctor_id = d.id and p.active
  join facilities f on f.id = p.facility_id
  join localities l on l.key = f.locality_key
  where d.status = 'published'
`;

const joinFor = (m: Measure | undefined) => (m === "published" ? PUBLISHED_JOIN : INDEXABLE_JOIN);

export const dbSource: DataSource = {
  async getDoctorBySlug(slug: string): Promise<DoctorView | null> {
    const [v] = await views(and(eq(s.doctors.slug, slug), inArray(s.doctors.status, ["published", "suspended", "retired"]))!);
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
    const [v] = await viewsByIds([id]);
    return v ?? null;
  },
  async findByRegistration(registrationNumber: string): Promise<DoctorView | null> {
    const norm = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const [reg] = await getDb().select({ doctorId: s.medicalRegistrations.doctorId }).from(s.medicalRegistrations).where(eq(s.medicalRegistrations.numberNormalized, norm)).limit(1);
    if (!reg) return null;
    const [v] = await viewsByIds([reg.doctorId]);
    return v ?? null;
  },
  async getListing(specialty: SpecialtyKey, place: Place, limit = CAP): Promise<DoctorView[]> {
    const where = Object.keys(place).length ? sql`${published()} and ${eq(s.doctors.specialtyKey, specialty)} and ${inPlaceSubquery(place, sql`${s.doctors.id}`)}` : sql`${published()} and ${eq(s.doctors.specialtyKey, specialty)}`;
    return views(where, limit);
  },
  async countIndexable(specialty: SpecialtyKey, place?: Place): Promise<number> {
    const rows = (await getDb().execute(sql`
      select count(distinct d.id)::int as n ${INDEXABLE_JOIN} and d.specialty_key = ${specialty} ${placeSql(place)}
    `)) as unknown as Array<{ n: number }>;
    return Number(rows[0]?.n ?? 0);
  },
  async countsBySpecialty(place?: Place, measure?: Measure): Promise<Record<string, number>> {
    const rows = (await getDb().execute(sql`
      select d.specialty_key as k, count(distinct d.id)::int as n ${joinFor(measure)} ${placeSql(place)} group by d.specialty_key
    `)) as unknown as Array<{ k: string; n: number }>;
    return Object.fromEntries(rows.map((r) => [r.k, Number(r.n)]));
  },
  async countsByCity(specialty?: SpecialtyKey, measure?: Measure): Promise<PlaceCount[]> {
    const rows = (await getDb().execute(sql`
      select l.state_slug as "stateSlug", l.city_slug as "citySlug", count(distinct d.id)::int as n ${joinFor(measure)}
      ${specialty ? sql`and d.specialty_key = ${specialty}` : sql``}
      group by l.state_slug, l.city_slug order by n desc, l.city_slug
    `)) as unknown as PlaceCount[];
    return rows.map((r) => ({ ...r, n: Number(r.n) }));
  },
  async countsByLocality(citySlug: string, specialty?: SpecialtyKey): Promise<Record<string, number>> {
    const rows = (await getDb().execute(sql`
      select f.locality_key as k, count(distinct d.id)::int as n ${INDEXABLE_JOIN} and l.city_slug = ${citySlug}
      ${specialty ? sql`and d.specialty_key = ${specialty}` : sql``}
      group by f.locality_key
    `)) as unknown as Array<{ k: string; n: number }>;
    return Object.fromEntries(rows.map((r) => [r.k, Number(r.n)]));
  },
  async countsByLocalitySpecialty(citySlug: string) {
    const rows = (await getDb().execute(sql`
      select f.locality_key as "localityKey", d.specialty_key as specialty, count(distinct d.id)::int as n ${INDEXABLE_JOIN} and l.city_slug = ${citySlug}
      group by f.locality_key, d.specialty_key
    `)) as unknown as Array<{ localityKey: string; specialty: string; n: number }>;
    return rows.map((r) => ({ ...r, n: Number(r.n) }));
  },
  async countsByState(measure?: Measure): Promise<Record<string, number>> {
    const rows = (await getDb().execute(sql`
      select l.state_slug as k, count(distinct d.id)::int as n ${joinFor(measure)} group by l.state_slug
    `)) as unknown as Array<{ k: string; n: number }>;
    return Object.fromEntries(rows.map((r) => [r.k, Number(r.n)]));
  },
  async totals(place?: Place): Promise<Totals> {
    const scoped = place && Object.keys(place).length;
    const [a] = (await getDb().execute(sql`
      select
        (select count(*)::int from doctors d where d.status = 'published' ${scoped ? sql`and ${inPlaceSubquery(place)}` : sql``}) as published,
        (select count(*)::int from doctors d where d.status = 'published' and d.claimed ${scoped ? sql`and ${inPlaceSubquery(place)}` : sql``}) as claimed,
        (select count(*)::int from doctor_practices p join doctors d on d.id = p.doctor_id join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where p.active and d.status = 'published' and coalesce(p.confirmed_on, f.confirmed_on) is not null ${placeSql(place)}) as practices,
        (select count(distinct (l.state_slug, l.city_slug))::int from localities l where true ${placeSql(place ? { stateSlug: place.stateSlug, citySlug: place.citySlug } : undefined)}) as cities,
        (select count(distinct d.id)::int ${INDEXABLE_JOIN} ${placeSql(place)}) as indexable
    `)) as unknown as Totals[];
    return { published: Number(a.published), indexable: Number(a.indexable), claimed: Number(a.claimed), practices: Number(a.practices), cities: Number(a.cities) };
  },
  async searchDoctors(query: string, place?: Place): Promise<DoctorView[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // "cardiologist", "heart doctor" → cardiology via the taxonomy's synonym list.
    const spec = resolveSpecialtyQuery(q)?.key ?? "";
    const rows = (await getDb().execute(sql`
      select d.id from doctors d
      where d.status = 'published'
        and (lower(d.name) % ${q} or lower(d.name) like ${"%" + q + "%"} or d.specialty_key like ${"%" + q + "%"} or d.specialty_key = ${spec}
             or exists (select 1 from unnest(d.subspecialties) x where lower(x) like ${"%" + q + "%"}))
        ${place && Object.keys(place).length ? sql`and ${inPlaceSubquery(place)}` : sql``}
      order by (d.specialty_key = ${spec}) desc, d.quality_score desc, similarity(lower(d.name), ${q}) desc
      limit 50
    `)) as unknown as Array<{ id: string }>;
    if (!rows.length) return [];
    return viewsByIds(rows.map((r) => r.id));
  },
  async getNearby(doctor: DoctorView, limit = 4): Promise<DoctorView[]> {
    const city = doctor.citySlugs[0];
    if (!city) return [];
    const pool = (await this.getListing(doctor.specialty, { citySlug: city }, 40)).filter((d) => d.slug !== doctor.slug && d.indexable);
    const shares = (d: DoctorView) => d.localities.some((l) => doctor.localities.includes(l));
    return [...pool.filter(shares), ...pool.filter((d) => !shares(d))].slice(0, limit);
  },
  async getFeatured(limit: number, place?: Place): Promise<DoctorView[]> {
    const rows = (await getDb().execute(sql`
      select d.id ${INDEXABLE_JOIN} ${placeSql(place)}
      group by d.id, d.claimed, d.photo_file_id, d.quality_score
      order by d.claimed desc, (d.photo_file_id is not null) desc, d.quality_score desc
      limit ${limit}
    `)) as unknown as Array<{ id: string }>;
    if (!rows.length) return [];
    return viewsByIds(rows.map((r) => r.id));
  },
  async listIndexableSlugs(): Promise<Array<{ slug: string; lastVerifiedOn: string }>> {
    const rows = (await getDb().execute(sql`
      select d.slug, d.last_verified_on as lv ${INDEXABLE_JOIN} group by d.id, d.slug, d.last_verified_on order by d.slug
    `)) as unknown as Array<{ slug: string; lv: string | null }>;
    return rows.map((r) => ({ slug: r.slug, lastVerifiedOn: toDisplay(r.lv) }));
  },
};

export type DbSource = typeof dbSource;
