import { config } from "dotenv";
import { and, eq, sql } from "drizzle-orm";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { createDoctor, recomputeQuality } from "../lib/services/doctors";

config({ path: ".env.local" });
config();

/**
 * Demo accounts for sales demos: one patient, one doctor with a complete,
 * claimed profile. Idempotent — re-running only fills what is missing.
 *
 * The doctor is NOT a real doctor and its registration is NOT a real
 * registration. It is created with source = 'demo' and kept as a draft so it
 * never appears on the public site. Publishing it requires the demo filter
 * (search, listings, sitemap, counts, rewards, digests, noindex) to ship first.
 *
 * Sign-in is by email code; both addresses deliver to the thedoctorindex@gmail.com inbox.
 */

export const DEMO_PATIENT_EMAIL = "thedoctorindex+demopatient@gmail.com";
export const DEMO_DOCTOR_EMAIL = "thedoctorindex+demodoctor@gmail.com";
const DEMO_REF = "tdi-demo-doctor";

async function upsertUser(email: string, role: "patient" | "doctor", displayName: string) {
  const db = getDb();
  const [existing] = await db.select({ id: s.users.id }).from(s.users).where(sql`lower(${s.users.email}) = ${email}`).limit(1);
  if (existing) return existing.id;
  const now = new Date();
  const [u] = await db
    .insert(s.users)
    .values({ email, role, displayName, localityKey: "hsr-layout", city: "Bengaluru", termsAcceptedAt: now, profileCompletedAt: now, signupFlow: "other", remindersOptOutAt: now, digestOptOutAt: now })
    .returning({ id: s.users.id });
  return u.id;
}

async function main() {
  const db = getDb();
  const patientId = await upsertUser(DEMO_PATIENT_EMAIL, "patient", "Demo Patient");
  const doctorUserId = await upsertUser(DEMO_DOCTOR_EMAIL, "doctor", "Demo Doctor");

  let [doc] = await db.select({ id: s.doctors.id, slug: s.doctors.slug, status: s.doctors.status }).from(s.doctors).where(and(eq(s.doctors.source, "demo"), eq(s.doctors.sourceRef, DEMO_REF))).limit(1);
  if (!doc) {
    const created = await createDoctor(
      {
        name: "Demo Doctor",
        specialtyKey: "general-practice",
        practiceStartYear: 2012,
        languages: ["English", "Kannada", "Hindi"],
        modes: ["In person", "Video"],
        about:
          "This is a demonstration profile used to show how The Doctor Index works. It is not a real doctor. A general practitioner profile like this one lists registration, qualifications, clinics, fees and consulting hours, so patients can check a doctor before they visit and request a slot.",
        services: ["Fever and infections", "Diabetes follow-up", "Blood pressure checks", "Health check-ups", "Vaccinations"],
        registration: { number: "DEMO-0001", council: "TDi Demo (not a real registration)", registeredYear: 2012, verified: false },
        qualifications: [
          { degree: "MBBS", institution: "Demo Medical College (not real)", year: 2011 },
          { degree: "MD (General Medicine)", institution: "Demo Medical College (not real)", year: 2015 },
        ],
        experience: [{ role: "Consultant", place: "TDi Demo Clinic", fromYear: 2016 }],
        practices: [
          { facilityName: "TDi Demo Clinic (not real)", localityKey: "hsr-layout", address: "Demo address, HSR Layout, Bengaluru", postalCode: "560102", days: "Mon–Sat", hours: "10:00–13:00", feeInr: 500, confirmed: true },
        ],
        status: "draft",
        source: "demo",
        sourceRef: DEMO_REF,
        claimedByUserId: doctorUserId,
      },
      null,
      "system",
    );
    doc = { id: created.id, slug: created.slug, status: "draft" };
  }

  // Mark the demo registration as checked so features gated on it (booking unlock,
  // articles) can be shown. The source says plainly that it is not real.
  await db.update(s.medicalRegistrations).set({ checkedOn: sql`current_date`, source: "Demo record — not a real registration" }).where(eq(s.medicalRegistrations.doctorId, doc.id));

  // Booking hours (tables from migration 0021). Raw SQL so this script does not
  // depend on unshipped booking code.
  const [{ has }] = (await db.execute(sql`select to_regclass('public.availability_rules') is not null as has`)) as unknown as Array<{ has: boolean }>;
  if (has) {
    const [{ n }] = (await db.execute(sql`select count(*)::int as n from availability_rules where doctor_id = ${doc.id}`)) as unknown as Array<{ n: number }>;
    if (n === 0) {
      const [p] = await db.select({ id: s.doctorPractices.id }).from(s.doctorPractices).where(eq(s.doctorPractices.doctorId, doc.id)).limit(1);
      for (const weekday of [1, 2, 3, 4, 5, 6]) {
        await db.execute(sql`insert into availability_rules (doctor_id, practice_id, weekday, start_time, end_time, slot_minutes) values (${doc.id}, ${p.id}, ${weekday}, '10:00', '13:00', 15)`);
      }
    }
    await db.execute(sql`update doctors set booking_enabled = true where id = ${doc.id}`);
  }
  await recomputeQuality(doc.id);

  console.log(JSON.stringify({ patientId, doctorUserId, doctorId: doc.id, slug: doc.slug, status: doc.status }, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
