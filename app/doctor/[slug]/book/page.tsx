import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BookForm, type DaySlots } from "@/components/BookForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OtpSignIn } from "@/components/OtpSignIn";
import { getSessionUser, setupPath } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import { availableSlots, bookingRequirementsFor } from "@/lib/services/booking";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const doctor = await getDoctorBySlug((await params).slug);
  if (!doctor) notFound();
  return {
    title: `Book an appointment — ${displayName(doctor)}`,
    // Action flow: never indexed; the profile is the canonical page.
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(paths.doctor(doctor.slug)) },
  };
}

export default async function BookPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();
  const sp = await searchParams;
  const onlyPractice = typeof sp.practice === "string" ? sp.practice : null;
  const profilePath = paths.doctor(doctor.slug);
  const here = `${profilePath}/book${onlyPractice ? `?practice=${onlyPractice}` : ""}`;
  const user = await getSessionUser();
  if (user && !user.profileComplete) redirect(setupPath(here));
  const specialty = SPECIALTIES[doctor.specialty];

  const state = doctor.dbId ? await bookingRequirementsFor(doctor.dbId) : null;
  const slots = state?.enabled ? await availableSlots(doctor.dbId!) : [];
  const names = new Map(doctor.practices.map((p) => [p.id, `${p.facility}, ${p.localityName}`]));
  const filtered = onlyPractice && slots.some((s) => s.practiceId === onlyPractice) ? slots.filter((s) => s.practiceId === onlyPractice) : slots;
  const byDay = new Map<string, DaySlots>();
  for (const s of filtered) {
    const label = s.startsAt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" });
    const d = byDay.get(s.day) ?? { day: s.day, label, slots: [] };
    d.slots.push({ value: `${s.practiceId}|${s.startsAt.toISOString()}`, time: s.time, practice: names.get(s.practiceId) ?? "" });
    byDay.set(s.day, d);
  }
  const days = [...byDay.values()];

  return (
    <>
      <Breadcrumbs items={[{ name: "Home", path: paths.home() }, { name: displayName(doctor), path: profilePath }, { name: "Book", path: `${profilePath}/book` }]} />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">Appointments</span>
          <h1 style={{ margin: "10px 0 6px" }}>Book an appointment</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            {displayName(doctor)}, {specialty.one.toLowerCase()}. Pick a time; the practice confirms it and you get an email.
          </p>
          {!state?.enabled ? (
            <div className="panel pad">
              <p style={{ marginTop: 0 }}>This doctor is not taking online bookings right now.</p>
              <Link className="btn solid" href={`${profilePath}/enquire?practice=0`}>Send an appointment enquiry instead</Link>
            </div>
          ) : !user ? (
            <div className="panel pad">
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Step 1 of 2 · Sign in</div>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "16px" }}>
                Sign in with a one-time code so the practice can reach you. Your contact details are shared only with this practice, only for this appointment.
              </p>
              <OtpSignIn next={here} label="Continue" />
            </div>
          ) : days.length === 0 ? (
            <div className="panel pad">
              <p style={{ marginTop: 0 }}>No open slots in the next two weeks.</p>
              <Link className="btn solid" href={`${profilePath}/enquire?practice=0`}>Send an appointment enquiry instead</Link>
            </div>
          ) : (
            <BookForm slug={doctor.slug} profilePath={profilePath} days={days} contact={{ name: user.displayName ?? "", phone: user.phone ?? "" }} multiPractice={new Set(filtered.map((s) => s.practiceId)).size > 1} />
          )}
        </div>
      </div>
    </>
  );
}
