import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { SEED_DOCTORS } from "../lib/data/doctors";
import { LOCALITIES, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "../lib/data/taxonomy";
import { toIso } from "../lib/db/dates";
import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Seeds the database with the controlled taxonomy, the 24 FICTIONAL doctors
 * from lib/data/doctors.ts, their reviews (with pseudonymous reviewer
 * accounts), a bootstrap super administrator, the SEO route allowlist and the
 * slug redirect table.
 *
 * Idempotent: re-running updates taxonomy and skips doctors that already exist
 * by registration number. Pass --reset-doctors to delete and reload doctors.
 *
 * Admin: set STAFF_BOOTSTRAP_ADMIN_EMAIL (defaults to admin@thedoctorindex.in).
 * Sign in at /admin/sign-in with that email; the OTP is emailed, or printed to
 * the server console when no email provider is configured.
 */

function slugify(name: string, publicId: string): string {
  return `${name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, "-")}-${publicId}`;
}
function normalize(v: string): string {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  const resetDoctors = process.argv.includes("--reset-doctors");

  /* --- taxonomy ---------------------------------------------------------- */
  for (const [i, key] of SPECIALTY_KEYS.entries()) {
    const sp = SPECIALTIES[key];
    await db
      .insert(s.specialties)
      .values({
        key,
        name: sp.name,
        plural: sp.plural,
        one: sp.one,
        aOne: sp.aOne,
        slug: sp.slug,
        department: sp.department,
        aliases: sp.aliases,
        guide: sp.guide,
        whenItems: sp.when,
        reviewedOn: toIso(sp.reviewedOn),
        sort: i,
      })
      .onConflictDoUpdate({
        target: s.specialties.key,
        set: { name: sp.name, plural: sp.plural, one: sp.one, aOne: sp.aOne, slug: sp.slug, department: sp.department, aliases: sp.aliases, guide: sp.guide, whenItems: sp.when, reviewedOn: toIso(sp.reviewedOn), sort: i },
      });
  }
  for (const [i, key] of LOCALITY_KEYS.entries()) {
    const l = LOCALITIES[key];
    await db
      .insert(s.localities)
      .values({ key, name: l.name, city: l.city, citySlug: l.citySlug, state: l.state, stateSlug: l.stateSlug, lat: String(l.lat), lng: String(l.lng), sort: i })
      .onConflictDoUpdate({ target: s.localities.key, set: { name: l.name, city: l.city, citySlug: l.citySlug, state: l.state, stateSlug: l.stateSlug, lat: String(l.lat), lng: String(l.lng), sort: i } });
  }
  // Controlled service terms from the seed doctors' services.
  const terms = new Map<string, string>();
  for (const d of SEED_DOCTORS) for (const t of d.services) terms.set(`${d.specialty}::${t}`, t);
  for (const [k, term] of terms) {
    const specialtyKey = k.split("::")[0];
    const exists = await db.select({ id: s.serviceTerms.id }).from(s.serviceTerms).where(sql`${s.serviceTerms.specialtyKey} = ${specialtyKey} and ${s.serviceTerms.term} = ${term}`);
    if (!exists.length) await db.insert(s.serviceTerms).values({ specialtyKey, term });
  }
  console.log(`taxonomy: ${SPECIALTY_KEYS.length} specialities, ${LOCALITY_KEYS.length} localities, ${terms.size} service terms`);

  /* --- bootstrap admin ---------------------------------------------------- */
  const adminEmail = (process.env.STAFF_BOOTSTRAP_ADMIN_EMAIL || "admin@thedoctorindex.in").toLowerCase();
  let [admin] = await db.select().from(s.users).where(sql`lower(${s.users.email}) = ${adminEmail}`);
  if (!admin) {
    [admin] = await db.insert(s.users).values({ email: adminEmail, role: "staff", displayName: "Super administrator" }).returning();
  } else if (admin.role !== "staff") {
    await db.update(s.users).set({ role: "staff" }).where(eq(s.users.id, admin.id));
  }
  await db
    .insert(s.staffMembers)
    .values({ userId: admin.id, roles: ["super_admin"], active: true })
    .onConflictDoUpdate({ target: s.staffMembers.userId, set: { roles: ["super_admin"], active: true } });
  console.log(`admin: ${adminEmail}`);

  /* --- doctors ------------------------------------------------------------ */
  if (resetDoctors) {
    await db.delete(s.doctors);
    await db.delete(s.facilities);
    console.log("doctors: reset");
  }

  const facilityIds = new Map<string, string>();
  async function facilityId(f: { facility: string; locality: string; address: string; postalCode: string; phone: string; confirmedOn: string }): Promise<string> {
    const key = `${f.facility}|${f.locality}`;
    if (facilityIds.has(key)) return facilityIds.get(key)!;
    const [existing] = await db.select({ id: s.facilities.id }).from(s.facilities).where(sql`${s.facilities.name} = ${f.facility} and ${s.facilities.localityKey} = ${f.locality}`);
    if (existing) {
      facilityIds.set(key, existing.id);
      return existing.id;
    }
    const [row] = await db
      .insert(s.facilities)
      .values({ name: f.facility, localityKey: f.locality, address: f.address, postalCode: f.postalCode, phone: f.phone, confirmedOn: toIso(f.confirmedOn) })
      .returning({ id: s.facilities.id });
    facilityIds.set(key, row.id);
    return row.id;
  }

  // Seed accounts are fictional; give them complete registrations (fake but
  // well-formed mobiles) so the seeded doctors and reviewers can be used
  // straight away without the first-run details step.
  let seedPhone = 9000000000;
  const registered = () => ({ phone: `+91${seedPhone++}`, localityKey: LOCALITY_KEYS[seedPhone % LOCALITY_KEYS.length], city: "Bengaluru", termsAcceptedAt: new Date(), profileCompletedAt: new Date() });
  const reviewerUsers = new Map<string, string>();
  async function reviewerUser(label: string): Promise<string> {
    if (reviewerUsers.has(label)) return reviewerUsers.get(label)!;
    const email = `${label.toLowerCase().replace(/[^a-z]/g, "")}@reviewers.example`;
    let [u] = await db.select().from(s.users).where(sql`lower(${s.users.email}) = ${email}`);
    if (!u) [u] = await db.insert(s.users).values({ email, role: "patient", displayName: label, ...registered() }).returning();
    reviewerUsers.set(label, u.id);
    return u.id;
  }

  let created = 0;
  let skipped = 0;
  for (const d of SEED_DOCTORS) {
    const [dup] = await db
      .select({ id: s.medicalRegistrations.id })
      .from(s.medicalRegistrations)
      .where(sql`${s.medicalRegistrations.numberNormalized} = ${normalize(d.registration.number)} and ${s.medicalRegistrations.councilNormalized} = ${normalize(d.registration.council)}`);
    if (dup) {
      skipped++;
      continue;
    }

    // Claimed profiles get a doctor user so the dashboard has someone to sign in as.
    let claimedByUserId: string | null = null;
    if (d.claimed) {
      const email = `${d.name.toLowerCase().replace(/[^a-z]/g, ".")}@doctors.example`;
      let [u] = await db.select().from(s.users).where(sql`lower(${s.users.email}) = ${email}`);
      if (!u) [u] = await db.insert(s.users).values({ email, role: "doctor", displayName: `Dr ${d.name}`, ...registered() }).returning();
      claimedByUserId = u.id;
    }

    const [doc] = await db
      .insert(s.doctors)
      .values({
        publicId: d.id,
        slug: slugify(d.name, d.id),
        name: d.name,
        gender: d.gender,
        specialtyKey: d.specialty,
        subspecialties: d.subspecialties,
        practiceStartYear: d.practiceStartYear,
        languages: d.languages,
        modes: d.modes,
        about: d.about,
        services: d.services,
        claimed: d.claimed,
        claimedByUserId,
        qualityScore: d.qualityScore,
        status: "published",
        lastVerifiedOn: toIso(d.lastVerifiedOn),
        hprVerified: d.hprVerified,
        source: d.claimed ? "self" : "import",
        publishedAt: new Date(`${toIso(d.lastVerifiedOn)}T00:00:00Z`),
      })
      .returning({ id: s.doctors.id });

    await db.insert(s.medicalRegistrations).values({
      doctorId: doc.id,
      number: d.registration.number,
      numberNormalized: normalize(d.registration.number),
      council: d.registration.council,
      councilNormalized: normalize(d.registration.council),
      registeredYear: d.registration.registeredYear,
      checkedOn: toIso(d.registration.checkedOn),
      source: "State Medical Council register",
      isPrimary: true,
    });
    await db.insert(s.verificationChecks).values({ doctorId: doc.id, kind: "registration", result: "verified", source: d.registration.council, checkedOn: new Date(`${toIso(d.registration.checkedOn)}T00:00:00Z`), checkedByUserId: admin.id, note: "Seed: matched on council + registration number" });

    for (const [i, q] of d.qualifications.entries()) {
      await db.insert(s.doctorQualifications).values({ doctorId: doc.id, degree: q.degree, institution: q.institution, year: q.year, state: q.state, checkedOn: q.state === "verified" ? toIso(d.registration.checkedOn) : null, sort: i });
    }
    for (const [i, e] of d.experience.entries()) {
      await db.insert(s.doctorExperience).values({ doctorId: doc.id, role: e.role, place: e.place, fromYear: e.from, toYear: e.to, sort: i });
    }
    for (const [i, p] of d.practices.entries()) {
      const fid = await facilityId({ facility: p.facility, locality: p.locality, address: p.address, postalCode: p.postalCode, phone: p.phone, confirmedOn: p.confirmedOn });
      const [pr] = await db
        .insert(s.doctorPractices)
        .values({ doctorId: doc.id, facilityId: fid, days: p.days, hours: p.hours, feeInr: p.feeInr, feeCheckedOn: toIso(p.feeCheckedOn), confirmedOn: toIso(p.confirmedOn), phone: p.phone, sort: i })
        .returning({ id: s.doctorPractices.id });
      await db.insert(s.verificationChecks).values({ doctorId: doc.id, kind: "practice", subjectId: pr.id, result: d.status === "stale" ? "pending" : "verified", source: "Practice confirmation", checkedOn: new Date(`${toIso(p.confirmedOn)}T00:00:00Z`), checkedByUserId: admin.id });
    }
    if (d.hprVerified) {
      await db.insert(s.verificationChecks).values({ doctorId: doc.id, kind: "hpr", result: "verified", source: "ABDM Healthcare Professionals Registry", checkedByUserId: admin.id });
    }

    // Written reviews. The rating rollup view derives everything else, so the
    // seed's count/distribution figures are not stored — real records only.
    for (const r of d.reviews) {
      const authorId = await reviewerUser(r.author);
      const [rev] = await db
        .insert(s.reviews)
        .values({
          doctorId: doc.id,
          authorUserId: authorId,
          authorLabel: r.author,
          visitMonth: r.visitMonth,
          mode: r.mode,
          communication: r.dimensions.communication,
          explanation: r.dimensions.explanation,
          waitTime: r.dimensions.waitTime,
          facility: r.dimensions.facility,
          text: r.text,
          status: "published",
          evidence: r.evidenceChecked ? "checked" : "none",
          moderatedAt: new Date(),
          moderatedByUserId: admin.id,
        })
        .returning({ id: s.reviews.id });
      if (r.reply) {
        await db.insert(s.doctorResponses).values({ reviewId: rev.id, doctorId: doc.id, text: r.reply, status: "published", moderatedAt: new Date(), moderatedByUserId: admin.id });
      }
    }
    await db.insert(s.profileRevisions).values({ doctorId: doc.id, snapshot: d, reason: "seed", createdByUserId: admin.id });
    created++;
  }
  console.log(`doctors: ${created} created, ${skipped} already present`);

  /* --- slug redirects ----------------------------------------------------- */
  for (const r of [
    { fromPath: "/doctor/anita-s-d8f4c2", toPath: "/doctor/anita-sharma-d8f4c2", reason: "name-change" },
    { fromPath: "/doctor/suresh-gowda-duplicate-9f10ab", toPath: "/doctor/suresh-gowda-c7e9a1", reason: "merge" },
  ]) {
    await db.insert(s.slugRedirects).values(r).onConflictDoNothing();
  }

  /* --- SEO route allowlist ------------------------------------------------ */
  const gateCity = Number(process.env.GATE_CITY_SPECIALTY_MIN_DOCTORS ?? 3);
  const gateLocality = Number(process.env.GATE_LOCALITY_SPECIALTY_MIN_DOCTORS ?? 5);
  const gateNational = Number(process.env.GATE_NATIONAL_SPECIALTY_MIN_DOCTORS ?? 3);
  const gateQuality = Number(process.env.GATE_PROFILE_QUALITY ?? 70);
  for (const key of SPECIALTY_KEYS) {
    const sp = SPECIALTIES[key];
    const [{ n: cityCount }] = await db.execute<{ n: number }>(sql`
      select count(distinct d.id)::int as n from doctors d
      join doctor_practices p on p.doctor_id = d.id and p.active
      where d.specialty_key = ${key} and d.status = 'published' and d.quality_score >= ${gateQuality}
    `).then((r) => r as unknown as Array<{ n: number }>);
    await upsertRoute(db, { kind: "national", specialtyKey: key, localityKey: null, path: `/specialties/${key}`, count: cityCount, gate: gateNational });
    await upsertRoute(db, { kind: "city", specialtyKey: key, localityKey: null, path: `/doctors/karnataka/bengaluru/${sp.slug}`, count: cityCount, gate: gateCity });
    for (const loc of LOCALITY_KEYS) {
      const rows = (await db.execute(sql`
        select count(distinct d.id)::int as n from doctors d
        join doctor_practices p on p.doctor_id = d.id and p.active
        join facilities f on f.id = p.facility_id
        where d.specialty_key = ${key} and d.status = 'published' and d.quality_score >= ${gateQuality} and f.locality_key = ${loc}
      `)) as unknown as Array<{ n: number }>;
      await upsertRoute(db, { kind: "locality", specialtyKey: key, localityKey: loc, path: `/doctors/karnataka/bengaluru/${loc}/${sp.slug}`, count: rows[0].n, gate: gateLocality });
    }
  }
  console.log(`seo_routes: ${SPECIALTY_KEYS.length * (2 + LOCALITY_KEYS.length)} computed`);

  await client.end();
}

async function upsertRoute(
  db: ReturnType<typeof drizzle<typeof s>>,
  r: { kind: "national" | "city" | "locality"; specialtyKey: string; localityKey: string | null; path: string; count: number; gate: number },
) {
  await db
    .insert(s.seoRoutes)
    .values({ kind: r.kind, specialtyKey: r.specialtyKey, localityKey: r.localityKey, path: r.path, indexableCount: r.count, computedIndexable: r.count >= r.gate })
    .onConflictDoUpdate({ target: s.seoRoutes.path, set: { indexableCount: r.count, computedIndexable: r.count >= r.gate, updatedAt: new Date() } });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
