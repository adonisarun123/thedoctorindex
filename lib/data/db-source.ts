import "server-only";

import { and, eq, inArray, sql, type SQL } from "drizzle-orm";

import { env } from "@/lib/env";
import { getGeo } from "@/lib/data/geo";
import { resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { normalize } from "@/lib/search/fuzzy";
import { getDb } from "@/lib/db/client";
import { daysBetween, toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { PROFILE_ABOUT_MIN_CHARS, isProfileIndexable } from "@/lib/seo/gates";
import type { DataSource, DoctorSuggestion, Measure, MixEntry, NumberShape, Place, PlaceCount, PlaceSpecialtyCount, QualificationProfile, RegisterProfile, SupplyProfile, Totals } from "@/lib/data/index";
import type { DoctorView, Locality, SpecialtyKey } from "@/lib/types";
import { cleanSubspecialties } from "@/lib/data/subspecialties";

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
const CAP = 1000; // mirrors LISTING_CAP in lib/data/index.ts
// Internal search cap; mirrors SEARCH_CAP in lib/data/index.ts (kept local to avoid a value import cycle).
const SEARCH_CAP = 100;

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
      enrichment: true,
      qualifications: { orderBy: (q, { asc }) => [asc(q.sort)] },
      experience: { orderBy: (e, { asc }) => [asc(e.sort), asc(e.fromYear)] },
      credentials: { orderBy: (c, { asc, desc }) => [asc(c.sort), desc(c.year)] },
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
 * Card hydration.
 *
 * A listing renders name, speciality, one practice, the verification badges
 * and the rating — it never renders review text, career history, the
 * introduction or the service list. Loading those anyway cost the most
 * expensive part of a listing: at LISTING_CAP that is up to 1,000 doctors' worth of
 * review bodies and prose serialised out of Postgres and then again into the
 * RSC payload, to be thrown away.
 *
 * This loader takes the same rows minus what a card cannot show. The result is
 * still a DoctorView so nothing downstream changes shape, but `about`,
 * `services`, `reviews` and `experience` come back empty — which is why only
 * card readers (listings, search, featured, nearby) may use it, and anything
 * rendering a full profile must use loadRows.
 *
 * Qualifications keep only `state`: the badge counts verified against pending,
 * and the degree text is never shown on a card.
 */
async function loadCardRows(ids: string[]) {
  if (!ids.length) return [];
  const db = getDb();
  const rows = await db.query.doctors.findMany({
    where: inArray(s.doctors.id, ids),
    columns: {
      id: true, publicId: true, tdiId: true, slug: true, name: true, gender: true, specialtyKey: true, subspecialties: true,
      practiceStartYear: true, languages: true, modes: true, status: true, claimed: true, qualityScore: true,
      lastVerifiedOn: true, hprVerified: true, photoFileId: true, photoConsent: true,
    },
    with: {
      registrations: true,
      qualifications: { columns: { state: true, sort: true }, orderBy: (q, { asc }) => [asc(q.sort)] },
      practices: { where: (p, { eq }) => eq(p.active, true), orderBy: (p, { asc }) => [asc(p.sort)], with: { facility: true } },
    },
  });
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
    .map((r) => ({
      ...r,
      about: "",
      services: [] as string[],
      enrichment: null,
      experience: [] as DoctorRow["experience"],
      credentials: [] as DoctorRow["credentials"],
      reviews: [] as DoctorRow["reviews"],
      qualifications: r.qualifications.map((q) => ({ ...q, degree: "", institution: "", year: null })),
    })) as unknown as DoctorRow[];
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
    tdiId: row.tdiId ?? null,
    lifecycle: row.status,
    photoUrl: row.photoFileId && row.photoConsent ? `/photos/${row.photoFileId}` : null,
    googleListing:
      row.enrichment?.googleStatus === "matched" && row.enrichment.googlePlaceId
        ? {
            placeId: row.enrichment.googlePlaceId,
            mapsUri: row.enrichment.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${row.enrichment.googlePlaceId}`,
            name: row.enrichment.googleName ?? "",
            address: row.enrichment.googleAddress ?? "",
            addressMatch: Boolean(row.enrichment.googleAddressMatch),
            checkedOn: toDisplay(row.enrichment.googleCheckedAt),
          }
        : null,
    slug: row.slug,
    name: row.name,
    // "X" and an absent value both mean "not on record". Do not fall back to a
    // guess: the value is published in JSON-LD and drives the gender filter.
    gender: (row.gender === "M" || row.gender === "F" ? row.gender : null) as "F" | "M" | null,
    specialty: row.specialtyKey,
    subspecialties: cleanSubspecialties(row.subspecialties, row.specialtyKey),
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
    credentials: row.credentials.map((c) => ({
      id: c.id,
      kind: c.kind,
      title: c.title,
      issuer: c.issuer,
      year: c.year,
      url: c.url,
      // "rejected" is a staff decision to not show it as confirmed, not a
      // third public state: it reads as submitted, like everything unchecked.
      state: (c.state === "verified" ? "verified" : "submitted") as "verified" | "submitted",
    })),
    practices,
    claimed: row.claimed,
    qualityScore: row.qualityScore,
    status,
    lastVerifiedOn: toDisplay(row.lastVerifiedOn),
    hprVerified: row.hprVerified,
    bookingEnabled: Boolean((row as { bookingEnabled?: boolean }).bookingEnabled),
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
      ratings:
        r.ratings && Object.keys(r.ratings).length
          ? r.ratings
          : r.communication !== null
            ? { hospitality: r.communication, explanation: r.explanation ?? 0, wait_time: r.waitTime ?? 0, hygiene: r.facility ?? 0 }
            : {},
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

async function views(where: SQL, limit?: number, shape: "full" | "card" = "full"): Promise<DoctorView[]> {
  const ids = await selectIds(where, limit);
  const load = shape === "card" ? loadCardRows : loadRows;
  const [rows, geoReg, rollups] = await Promise.all([load(ids), getGeo(), loadRollups(ids)]);
  return rows.map((r) => toView(r, geoReg.locality, rollups.get(r.id)));
}

async function viewsByIds(ids: string[], shape: "full" | "card" = "full"): Promise<DoctorView[]> {
  const load = shape === "card" ? loadCardRows : loadRows;
  const [rows, geoReg, rollups] = await Promise.all([load(ids), getGeo(), loadRollups(ids)]);
  return rows.map((r) => toView(r, geoReg.locality, rollups.get(r.id)));
}

function geo(lat: string | null, lng: string | null, locality: Locality | null): { lat?: number; lng?: number; geoSource?: "facility" | "locality" } {
  if (lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) return { lat: Number(lat), lng: Number(lng), geoSource: "facility" };
  if (locality?.lat !== null && locality?.lat !== undefined && locality.lng !== null) return { lat: locality.lat, lng: locality.lng, geoSource: "locality" };
  return {};
}

const published = () => eq(s.doctors.status, "published");

/* ---------------------------------------------------------------------------
   Verified-supply predicate, in SQL, identical in meaning to
   isProfileVerified(): published, quality at or above the gate, and at least
   one active practice whose confirmation is inside the freshness window. It
   feeds listing gates and "verified" counts. Which profiles are *indexed* is
   isProfileIndexable() — the same set in verified mode, every published
   profile with a practice in "all" mode (listIndexableSlugs below).
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

/**
 * The pool the current index mode publishes. In "all" mode every published
 * profile with a practice carries index,follow, so the browse pages above them
 * must be gated on that same pool — otherwise 24,000 indexed profiles sit
 * under state, city and speciality pages that are all noindex and absent from
 * the sitemap.
 */
const ELIGIBLE_JOIN = env.gates.profileIndexMode === "all" ? PUBLISHED_JOIN : INDEXABLE_JOIN;

/**
 * isProfileSubstantive() in SQL: claimed, the primary registration checked
 * against the register, a consented photo, a bio over
 * PROFILE_ABOUT_MIN_CHARS, or quality at the gate. Only the index set (the
 * profile sitemap) applies it; listing gates keep the wider eligible pool.
 */
const SUBSTANTIVE_SQL = sql`(
  d.claimed
  or exists (
    select 1 from medical_registrations r
    where r.doctor_id = d.id and r.number <> '' and r.checked_on is not null
      and (r.is_primary or not exists (select 1 from medical_registrations r2 where r2.doctor_id = d.id and r2.is_primary))
  )
  or (d.photo_file_id is not null and d.photo_consent)
  or length(btrim(coalesce(d.about, ''))) > ${PROFILE_ABOUT_MIN_CHARS}
  or d.quality_score >= ${env.gates.profileQuality}
)`;

const joinFor = (m: Measure | undefined) => (m === "published" ? PUBLISHED_JOIN : m === "eligible" ? ELIGIBLE_JOIN : INDEXABLE_JOIN);

export const dbSource: DataSource = {
  async getDoctorBySlug(slug: string): Promise<DoctorView | null> {
    const [v] = await views(and(eq(s.doctors.slug, slug), inArray(s.doctors.status, ["published", "suspended", "retired"]))!);
    return v ?? null;
  },
  async pathRedirect(path: string): Promise<string | null> {
    const [r] = await getDb().select({ to: s.slugRedirects.toPath }).from(s.slugRedirects).where(eq(s.slugRedirects.fromPath, path)).limit(1);
    return r?.to ?? null;
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
  async findByRegistration(registrationNumber: string, council?: string): Promise<DoctorView | null> {
    // Bare numbers repeat across councils ("31042" is a Rajasthan doctor and a
    // Karnataka one), so identity is council + number. A record whose council
    // was never stated still matches on its number. Anything that resolves to
    // more than one doctor is treated as no match, never as the first row.
    const norm = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!norm) return null;
    const councilNorm = (council ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const where = councilNorm
      ? and(eq(s.medicalRegistrations.numberNormalized, norm), sql`${s.medicalRegistrations.councilNormalized} in (${councilNorm}, 'COUNCILNOTSTATED', '')`)
      : eq(s.medicalRegistrations.numberNormalized, norm);
    const regs = await getDb().selectDistinct({ doctorId: s.medicalRegistrations.doctorId }).from(s.medicalRegistrations).where(where).limit(2);
    if (regs.length !== 1) return null;
    const [v] = await viewsByIds([regs[0].doctorId]);
    return v ?? null;
  },
  async getListing(specialty: SpecialtyKey, place: Place, limit = CAP): Promise<DoctorView[]> {
    const where = Object.keys(place).length ? sql`${published()} and ${eq(s.doctors.specialtyKey, specialty)} and ${inPlaceSubquery(place, sql`${s.doctors.id}`)}` : sql`${published()} and ${eq(s.doctors.specialtyKey, specialty)}`;
    return views(where, limit, "card");
  },
  async countIndexable(specialty: SpecialtyKey, place?: Place, measure?: Measure): Promise<number> {
    const rows = (await getDb().execute(sql`
      select count(distinct d.id)::int as n ${joinFor(measure)} and d.specialty_key = ${specialty} ${placeSql(place)}
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
  async countsByLocality(citySlug: string, specialty?: SpecialtyKey, measure?: Measure): Promise<Record<string, number>> {
    const rows = (await getDb().execute(sql`
      select f.locality_key as k, count(distinct d.id)::int as n ${joinFor(measure)} and l.city_slug = ${citySlug}
      ${specialty ? sql`and d.specialty_key = ${specialty}` : sql``}
      group by f.locality_key
    `)) as unknown as Array<{ k: string; n: number }>;
    return Object.fromEntries(rows.map((r) => [r.k, Number(r.n)]));
  },
  async countsByLocalitySpecialty(citySlug: string, measure?: Measure) {
    const rows = (await getDb().execute(sql`
      select f.locality_key as "localityKey", d.specialty_key as specialty, count(distinct d.id)::int as n ${joinFor(measure)} and l.city_slug = ${citySlug}
      group by f.locality_key, d.specialty_key
    `)) as unknown as Array<{ localityKey: string; specialty: string; n: number }>;
    return rows.map((r) => ({ ...r, n: Number(r.n) }));
  },
  async countsByCitySpecialty(measure?: Measure): Promise<PlaceSpecialtyCount[]> {
    const rows = (await getDb().execute(sql`
      select l.state_slug as "stateSlug", l.city_slug as "citySlug", d.specialty_key as specialty, count(distinct d.id)::int as n ${joinFor(measure)}
      group by l.state_slug, l.city_slug, d.specialty_key
    `)) as unknown as PlaceSpecialtyCount[];
    return rows.map((r) => ({ ...r, n: Number(r.n) }));
  },
  async countsByLocalityAll(measure?: Measure): Promise<PlaceSpecialtyCount[]> {
    const rows = (await getDb().execute(sql`
      select l.state_slug as "stateSlug", l.city_slug as "citySlug", f.locality_key as "localityKey", d.specialty_key as specialty, count(distinct d.id)::int as n ${joinFor(measure)}
      group by l.state_slug, l.city_slug, f.locality_key, d.specialty_key
    `)) as unknown as PlaceSpecialtyCount[];
    return rows.map((r) => ({ ...r, n: Number(r.n) }));
  },
  async countsByState(measure?: Measure): Promise<Record<string, number>> {
    const rows = (await getDb().execute(sql`
      select l.state_slug as k, count(distinct d.id)::int as n ${joinFor(measure)} group by l.state_slug
    `)) as unknown as Array<{ k: string; n: number }>;
    return Object.fromEntries(rows.map((r) => [r.k, Number(r.n)]));
  },
  /**
   * One statement, one pool. The CTE is the same set of doctors every count on
   * the page already agrees on (the measure's join, plus the place and
   * speciality filters), so the composition can never disagree with the
   * headline count beside it.
   *
   * Councils containing a digit are dropped: six registration rows out of
   * 9,572 carry a registration number in the council column, and a council
   * list is a claim about registers, not a place to surface an import defect.
   */
  async supplyProfile(place?: Place, specialty?: SpecialtyKey, measure?: Measure): Promise<SupplyProfile> {
    const pool = sql`
      with pool as (
        select distinct d.id, d.claimed, d.practice_start_year, d.subspecialties, d.about
        ${joinFor(measure)} ${specialty ? sql`and d.specialty_key = ${specialty}` : sql``} ${placeSql(place)}
      ),
      quals as (
        select q.degree as name, count(distinct q.doctor_id)::int as n
        from doctor_qualifications q join pool p on p.id = q.doctor_id
        where q.degree <> '' group by 1 order by n desc, 1 limit 6
      ),
      councils as (
        select r.council as name, count(distinct r.doctor_id)::int as n
        from medical_registrations r join pool p on p.id = r.doctor_id
        where r.number <> '' and r.council <> '' and r.council !~ '[0-9]'
          and lower(r.council) not in ('council not stated', 'not stated', 'unknown', 'n/a')
        group by 1 order by n desc, 1 limit 5
      ),
      subs as (
        select x as name, count(*)::int as n
        from pool p, unnest(p.subspecialties) x
        where x <> '' group by 1 having count(*) >= 5 order by n desc, 1 limit 5
      ),
      prac as (
        select dp.facility_id, dp.doctor_id, dp.fee_inr, f2.locality_key
        from doctor_practices dp join pool p on p.id = dp.doctor_id
        join facilities f2 on f2.id = dp.facility_id
        where dp.active
      )
      select
        (select count(*)::int from pool) as total,
        (select count(*)::int from pool p where exists (select 1 from medical_registrations r where r.doctor_id = p.id and r.number <> '')) as "withRegistration",
        (select count(*)::int from pool p where exists (select 1 from medical_registrations r where r.doctor_id = p.id and r.checked_on is not null)) as "registerChecked",
        (select count(*)::int from pool p where p.claimed) as claimed,
        (select count(*)::int from pool p where p.about <> '') as "withAbout",
        (select count(*)::int from pool p where p.practice_start_year is not null) as "withExperience",
        (select (percentile_cont(0.5) within group (order by (${CURRENT_YEAR} - p.practice_start_year)))::int from pool p where p.practice_start_year is not null) as "medianYears",
        (select count(distinct facility_id)::int from prac) as facilities,
        (select count(distinct locality_key)::int from prac) as localities,
        (select count(distinct doctor_id)::int from prac where fee_inr is not null) as "withFee",
        (select min(fee_inr)::int from prac where fee_inr is not null) as "feeMin",
        (select max(fee_inr)::int from prac where fee_inr is not null) as "feeMax",
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from quals) as qualifications,
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from councils) as councils,
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from subs) as subspecialties
    `;
    const rows = (await getDb().execute(pool)) as unknown as Array<Record<string, unknown>>;
    const r = rows[0] ?? {};
    const num = (k: string) => Number(r[k] ?? 0) || 0;
    const nullable = (k: string) => (r[k] === null || r[k] === undefined ? null : Number(r[k]));
    const mix = (k: string): MixEntry[] => ((r[k] as MixEntry[] | null) ?? []).map((e) => ({ name: String(e.name), n: Number(e.n) }));
    return {
      total: num("total"),
      withRegistration: num("withRegistration"),
      registerChecked: num("registerChecked"),
      claimed: num("claimed"),
      withAbout: num("withAbout"),
      withExperience: num("withExperience"),
      medianYears: nullable("medianYears"),
      facilities: num("facilities"),
      localities: num("localities"),
      withFee: num("withFee"),
      feeMin: nullable("feeMin"),
      feeMax: nullable("feeMax"),
      qualifications: mix("qualifications"),
      councils: mix("councils"),
      // The mix is counted in SQL; tags that are not subspecialities are dropped here.
      subspecialties: mix("subspecialties").filter((x) => cleanSubspecialties([x.name], specialty).length > 0),
    };
  },

  async registerProfile(match: string[]): Promise<RegisterProfile> {
    if (!match.length) return { total: 0, registerChecked: 0, withYear: 0, earliestYear: null, latestYear: null, shapes: [], specialties: [], cities: [] };
    // Published doctors whose primary registration names this register. The
    // number formats are derived from the numbers themselves (digits → 9,
    // letters → A) so the page can show what "normal" looks like for a
    // council without anyone writing a rule that the data might not follow.
    const q = sql`
      with pool as (
        select d.id, d.specialty_key, r.number, r.checked_on, r.registered_year
        from doctors d
        join medical_registrations r on r.doctor_id = d.id and r.is_primary
        where d.status = 'published' and r.number <> ''
          and r.council_normalized in (${sql.join(match.map((m) => sql`${m}`), sql`, `)})
      ),
      shapes as (
        select regexp_replace(regexp_replace(upper(trim(number)), '[0-9]', '9', 'g'), '[A-Z]', 'A', 'g') as shape,
               min(trim(number)) as sample, count(*)::int as n
        from pool group by 1 order by n desc, 1 limit 4
      ),
      specs as (
        select specialty_key as name, count(*)::int as n from pool group by 1 order by n desc, 1 limit 8
      ),
      cities as (
        select l.state_slug as "stateSlug", l.city_slug as "citySlug", count(distinct p.id)::int as n
        from pool p
        join doctor_practices dp on dp.doctor_id = p.id and dp.active
        join facilities f on f.id = dp.facility_id
        join localities l on l.key = f.locality_key
        group by 1, 2 order by n desc, 2 limit 8
      )
      select
        (select count(*)::int from pool) as total,
        (select count(*)::int from pool where checked_on is not null) as "registerChecked",
        (select count(*)::int from pool where registered_year is not null) as "withYear",
        (select min(registered_year)::int from pool) as "earliestYear",
        (select max(registered_year)::int from pool) as "latestYear",
        (select coalesce(json_agg(json_build_object('shape', shape, 'sample', sample, 'n', n)), '[]'::json) from shapes) as shapes,
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from specs) as specialties,
        (select coalesce(json_agg(json_build_object('stateSlug', "stateSlug", 'citySlug', "citySlug", 'n', n)), '[]'::json) from cities) as cities
    `;
    const rows = (await getDb().execute(q)) as unknown as Array<Record<string, unknown>>;
    const r = rows[0] ?? {};
    const num = (k: string) => Number(r[k] ?? 0) || 0;
    const nullable = (k: string) => (r[k] === null || r[k] === undefined ? null : Number(r[k]));
    return {
      total: num("total"),
      registerChecked: num("registerChecked"),
      withYear: num("withYear"),
      earliestYear: nullable("earliestYear"),
      latestYear: nullable("latestYear"),
      shapes: ((r.shapes as NumberShape[] | null) ?? []).map((x) => ({ shape: String(x.shape), sample: String(x.sample), n: Number(x.n) })),
      specialties: ((r.specialties as MixEntry[] | null) ?? []).map((x) => ({ name: String(x.name), n: Number(x.n) })),
      cities: ((r.cities as PlaceCount[] | null) ?? []).map((x) => ({ stateSlug: String(x.stateSlug), citySlug: String(x.citySlug), n: Number(x.n) })),
    };
  },

  async qualificationProfile(pattern: string): Promise<QualificationProfile> {
    // One matching qualification row per doctor (the first by sort), so a
    // doctor with "MD" and "MD (Medicine)" counts once. The branch is the
    // parenthetical as written; institutions drop the import placeholder.
    const q = sql`
      with pool as (
        select distinct on (d.id) d.id, d.specialty_key, q.degree, q.institution, q.year, q.checked_on
        from doctors d join doctor_qualifications q on q.doctor_id = d.id
        where d.status = 'published' and upper(regexp_replace(q.degree, '[^A-Za-z0-9()]', '', 'g')) ~ ${pattern}
        order by d.id, q.sort
      ),
      branches as (
        select upper(regexp_replace(degree, '[^A-Za-z0-9()]', '', 'g')) as norm,
               min(btrim(regexp_replace(degree, '^[^(]*\\(([^)]*)\\).*$', '\\1'))) as label, count(*)::int as n
        from pool where degree like '%(%)%' group by 1 order by n desc limit 8
      ),
      insts as (
        select btrim(institution) as name, count(*)::int as n from pool
        where btrim(institution) <> '' and lower(btrim(institution)) not in ('awarding body not stated', 'not stated', 'unknown', 'n/a')
        group by 1 having count(*) >= 3 order by n desc, 1 limit 6
      ),
      specs as (select specialty_key as name, count(*)::int as n from pool group by 1 order by n desc, 1 limit 8),
      cities as (
        select l.state_slug as "stateSlug", l.city_slug as "citySlug", count(distinct p.id)::int as n
        from pool p join doctor_practices dp on dp.doctor_id = p.id and dp.active
        join facilities f on f.id = dp.facility_id join localities l on l.key = f.locality_key
        group by 1, 2 order by n desc, 2 limit 8
      )
      select
        (select count(*)::int from pool) as total,
        (select count(*)::int from pool where checked_on is not null) as checked,
        (select count(*)::int from pool where year is not null and year > 0) as "withYear",
        (select min(year)::int from pool where year > 0) as "earliestYear",
        (select max(year)::int from pool where year > 0) as "latestYear",
        (select coalesce(json_agg(json_build_object('name', label, 'n', n)), '[]'::json) from branches) as branches,
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from insts) as institutions,
        (select coalesce(json_agg(json_build_object('name', name, 'n', n)), '[]'::json) from specs) as specialties,
        (select coalesce(json_agg(json_build_object('stateSlug', "stateSlug", 'citySlug', "citySlug", 'n', n)), '[]'::json) from cities) as cities
    `;
    const rows = (await getDb().execute(q)) as unknown as Array<Record<string, unknown>>;
    const r = rows[0] ?? {};
    const num = (k: string) => Number(r[k] ?? 0) || 0;
    const nullable = (k: string) => (r[k] === null || r[k] === undefined ? null : Number(r[k]));
    const mix = (k: string): MixEntry[] => ((r[k] as MixEntry[] | null) ?? []).map((x) => ({ name: String(x.name), n: Number(x.n) }));
    return {
      total: num("total"),
      checked: num("checked"),
      withYear: num("withYear"),
      earliestYear: nullable("earliestYear"),
      latestYear: nullable("latestYear"),
      branches: mix("branches"),
      institutions: mix("institutions"),
      specialties: mix("specialties"),
      cities: ((r.cities as PlaceCount[] | null) ?? []).map((x) => ({ stateSlug: String(x.stateSlug), citySlug: String(x.citySlug), n: Number(x.n) })),
    };
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
      limit ${SEARCH_CAP}
    `)) as unknown as Array<{ id: string }>;
    if (!rows.length) return [];
    return viewsByIds(rows.map((r) => r.id), "card");
  },
  async suggestDoctors(query: string, limit = 6, place?: Place): Promise<DoctorSuggestion[]> {
    const q = normalize(query).replace(/^(dr|doctor)\s+/, "");
    if (q.length < 2) return [];
    // Word similarity (pg_trgm) so "shar" finds "Sharma" while the person is
    // still typing and "sharna" still finds it; the gin index on lower(name)
    // serves both operators. The closest name ranks first (a prefix of a word
    // scores 1.0, so typing ahead still works), then the better-documented profile.
    const rows = (await getDb().execute(sql`
      select d.slug, d.name, d.specialty_key as specialty,
             (select l.city from doctor_practices p join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key
               where p.doctor_id = d.id and p.active order by p.sort, p.id limit 1) as city
      from doctors d
      where d.status = 'published'
        and (lower(d.name) like ${q + "%"} or lower(d.name) like ${"% " + q + "%"} or ${q} <% lower(d.name))
        ${place && Object.keys(place).length ? sql`and ${inPlaceSubquery(place)}` : sql``}
      order by word_similarity(${q}, lower(d.name)) desc, (lower(d.name) like ${q + "%"}) desc, d.quality_score desc
      limit ${limit}
    `)) as unknown as Array<{ slug: string; name: string; specialty: SpecialtyKey; city: string | null }>;
    return rows.map((r) => ({ slug: r.slug, name: r.name, specialty: r.specialty, city: r.city ?? null }));
  },
  async getNearby(doctor: DoctorView, limit = 4): Promise<DoctorView[]> {
    const city = doctor.citySlugs[0];
    if (!city) return [];
    // Verified first (the listing order already does that), then the rest of the published pool — an unverified city still gets neighbours.
    const pool = (await this.getListing(doctor.specialty, { citySlug: city }, 40)).filter((d) => d.slug !== doctor.slug);
    const shares = (d: DoctorView) => d.localities.some((l) => doctor.localities.includes(l));
    return [...pool.filter(shares), ...pool.filter((d) => !shares(d))].slice(0, limit);
  },

  /**
   * Colleagues at the same address. Matched on facility id, never on the
   * facility name, so "Apollo Hospital" in two cities never merges and a
   * misspelt clinic never splits. Capped: a large hospital can hold hundreds
   * of doctors and this is a context block, not a listing.
   */
  async getAtFacility(facilityId: string, excludeSlug: string, limit = 6): Promise<DoctorView[]> {
    if (!facilityId) return [];
    // Imports created one facility row per doctor, so "Manipal Hospital Old
    // Airport Road" exists as 84 rows. Colleagues are therefore matched on the
    // same row OR the same normalised name in the same locality. The locality
    // keeps two hospitals that merely share a name apart; generic names
    // ("Consulting practice", "Clinic") never match by name at all.
    const where = sql`${published()} and ${s.doctors.slug} <> ${excludeSlug} and ${s.doctors.id} in (
      select p.doctor_id from doctor_practices p
      where p.active and (
        p.facility_id = ${facilityId}
        or p.facility_id in (
          select f2.id from facilities f1 join facilities f2
            on f2.locality_key = f1.locality_key
           and lower(regexp_replace(f2.name, '[^a-zA-Z0-9]', '', 'g')) = lower(regexp_replace(f1.name, '[^a-zA-Z0-9]', '', 'g'))
          where f1.id = ${facilityId}
            and length(regexp_replace(f1.name, '[^a-zA-Z0-9]', '', 'g')) >= 8
            and lower(regexp_replace(f1.name, '[^a-zA-Z0-9]', '', 'g')) not in
              ('consultingpractice', 'privateclinic', 'ownclinic', 'notstated', 'residence', 'clinic', 'hospital', 'nursinghome', 'polyclinic')
        )
      )
    )`;
    return views(where, limit, "card");
  },
  async getFeatured(limit: number, place?: Place): Promise<DoctorView[]> {
    const rows = (await getDb().execute(sql`
      select d.id ${INDEXABLE_JOIN} ${placeSql(place)}
      group by d.id, d.claimed, d.photo_file_id, d.quality_score
      order by d.claimed desc, (d.photo_file_id is not null) desc, d.quality_score desc
      limit ${limit}
    `)) as unknown as Array<{ id: string }>;
    if (!rows.length) return [];
    return viewsByIds(rows.map((r) => r.id), "card");
  },
  async listIndexableSlugs(): Promise<Array<{ slug: string; lastVerifiedOn: string }>> {
    // Mirrors isProfileIndexable(): substantive published profiles with an
    // active practice in "all" mode, verified supply only in "verified" mode.
    // lastmod falls back to the publication date so every entry carries one.
    const rows = (await getDb().execute(sql`
      select d.slug, coalesce(d.last_verified_on, d.published_at::date) as lv ${ELIGIBLE_JOIN}
        ${env.gates.profileIndexMode === "all" ? sql`and ${SUBSTANTIVE_SQL}` : sql``}
      group by d.id, d.slug, d.last_verified_on, d.published_at order by d.slug
    `)) as unknown as Array<{ slug: string; lv: string | null }>;
    return rows.map((r) => ({ slug: r.slug, lastVerifiedOn: toDisplay(r.lv) }));
  },
};

export type DbSource = typeof dbSource;
