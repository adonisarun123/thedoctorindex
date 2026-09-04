import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OtpSignIn } from "@/components/OtpSignIn";
import { ProfileActionForm } from "@/components/ProfileActionForm";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser, setupPath } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { LOCALITIES, SPECIALTIES } from "@/lib/data/taxonomy";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };
type Search = Record<string, string | string[] | undefined>;

const KIND = "enquire" as const;
const TITLE = "Request an appointment";
const EYEBROW = "Contact the practice";
const INTRO = "An enquiry goes to the practice you choose. They contact you to confirm a time.";
const NEEDS_SIGN_IN = true;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const doctor = await getDoctorBySlug((await params).slug);
  if (!doctor) notFound();
  return {
    title: `${TITLE} — Dr ${doctor.name}`,
    // Action flows are never indexed. The profile is the canonical page.
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(paths.doctor(doctor.slug)) },
  };
}

export default async function Page({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();
  const sp = await searchParams;
  const practice = Number(Array.isArray(sp.practice) ? sp.practice[0] : sp.practice) || 0;
  const about = Array.isArray(sp.about) ? sp.about[0] : sp.about;
  const specialty = SPECIALTIES[doctor.specialty];
  const user = await getSessionUser();
  const here = `${paths.doctor(doctor.slug)}/${KIND}${about ? `?about=${about}` : ""}`;
  if (user && !user.profileComplete) redirect(setupPath(here));

  return (
    <>
      <RouteMeta
        data={{
          route: "Profile action flow",
          title: `${TITLE} — Dr ${doctor.name} | The Doctor Index`,
          canonical: absoluteUrl(paths.doctor(doctor.slug)),
          index: false,
          structuredData: "None",
          notes: [
            {
              label: "Why noindex",
              text: "Action flows are per-profile forms. The canonical points at the profile itself so no equity is split across four near-duplicate URLs per doctor.",
            },
          ],
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: paths.home() },
          { name: `Dr ${doctor.name}`, path: paths.doctor(doctor.slug) },
          { name: TITLE },
        ]}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">{EYEBROW}</span>
          <h1 style={{ margin: "10px 0 6px" }}>{TITLE}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            Dr {doctor.name}, {specialty.one.toLowerCase()}. {INTRO}
          </p>
          {!doctor.dbId ? (
            <div className="notice" style={{ marginBottom: "16px" }}>
              <b>Read-only build.</b> This deployment runs on fixture data with no database, so the form below cannot be submitted. Set DATABASE_URL to enable it.
            </div>
          ) : null}
          {NEEDS_SIGN_IN && !user ? (
            <div className="panel pad">
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Step 1 of 2 · Sign in</div>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "16px" }}>
                An enquiry is tied to a verified contact so the practice can reach you. It goes to the practice you choose and nowhere else.
              </p>
              <OtpSignIn next={here} label="Continue" />
            </div>
          ) : (
            <ProfileActionForm
              kind={KIND}
              initialPractice={practice}
              about={about}
              signedIn={Boolean(user)}
              doctor={{
                slug: doctor.slug,
                name: doctor.name,
                specialtyOne: specialty.one,
                practices: doctor.practices.map((p) => ({ id: p.id, facility: p.facility, locality: LOCALITIES[p.locality].name })),
                contact: user ? { name: user.displayName ?? "", phone: user.phone ?? "" } : null,
                reviews: doctor.reviews.map((r) => ({ id: r.id, author: r.author, visitMonth: r.visitMonth })),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
