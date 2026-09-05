import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CallButton, DirectionsButton, ViewBeacon } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { TrustBadges } from "@/components/TrustBadges";
import { canonicalDoctorPath, getAllDoctors, getDoctorBySlug, getNearby } from "@/lib/data";
import { CITY, LOCALITIES, SPECIALTIES } from "@/lib/data/taxonomy";
import { profileGate } from "@/lib/seo/gates";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, doctorLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getAllDoctors()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await resolve(slug);

  const specialty = SPECIALTIES[doctor.specialty];
  const locality = doctor.localities[0] ? LOCALITIES[doctor.localities[0]]?.name : null;
  const degrees = doctor.qualifications.filter((q) => q.state === "verified").map((q) => q.degree).slice(0, 2).join(", ");
  const [firstName, ...rest] = doctor.name.split(/\s+/);
  return pageMeta({
    title: `Dr ${doctor.name} – ${specialty.one} in ${CITY.name}`,
    ogTitle: `Dr ${doctor.name}, ${specialty.one} in ${locality ? `${locality}, ` : ""}${CITY.name}`,
    description: `Dr ${doctor.name}, ${specialty.one.toLowerCase()} in ${locality ? `${locality}, ` : ""}${CITY.name}. ${degrees ? `${degrees}. ` : ""}${doctor.yearsOfExperience}+ years. Registration checked ${doctor.registration.checkedOn}; qualifications and practice dated.`,
    path: paths.doctor(doctor.slug),
    index: doctor.indexable,
    type: "profile",
    image: "segment",
    profile: { firstName, lastName: rest.join(" ") || undefined, gender: doctor.gender === "F" ? "female" : "male" },
  });
}

/**
 * Exact slug → profile. Stale slug (rename, merge) → 308 to the canonical
 * URL. Unknown → a real 404, thrown here so it also fires from
 * generateMetadata, before any of the response has streamed.
 */
async function resolve(slug: string): Promise<DoctorView> {
  const doctor = await getDoctorBySlug(slug);
  if (doctor) return doctor;
  const canonical = await canonicalDoctorPath(slug);
  if (canonical) permanentRedirect(canonical);
  notFound();
}

export default async function DoctorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doctor = await resolve(slug);

  const specialty = SPECIALTIES[doctor.specialty];
  const gate = profileGate(doctor);
  const listingPath = paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug);

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: CITY.name, path: listingPath },
    { name: specialty.plural, path: listingPath },
    { name: `Dr ${doctor.name}` },
  ];

  const routeMeta: RouteMetaData = {
    route: "Doctor profile",
    title: `Dr ${doctor.name} – ${specialty.one} in ${CITY.name} | The Doctor Index`,
    h1: `Dr ${doctor.name}, ${specialty.one} in ${CITY.name}`,
    canonical: absoluteUrl(paths.doctor(doctor.slug)),
    index: doctor.indexable,
    gate: { name: "Profile gate", checks: gate.checks },
    structuredData: doctor.claimed
      ? "ProfilePage > mainEntity: Person, plus MedicalClinic per practice"
      : "WebPage > mainEntity: Person, plus MedicalClinic per practice",
    lastmod: doctor.lastVerifiedOn,
    notes: [
      {
        label: "Why this schema type",
        text: doctor.claimed
          ? "ProfilePage is used only where the doctor is affiliated with and actively participates in the page. This profile is claimed, so it qualifies."
          : "This record is unclaimed, so the doctor takes no part in it and ProfilePage does not apply. It gets WebPage instead.",
      },
      {
        label: "Review markup",
        text: "Not emitted. Google's review snippet feature does not support a standalone Person the way it supports a qualifying local business, so promising stars on doctor pages would be selling something we cannot deliver.",
      },
      {
        label: "URL stability",
        text: "The public ID is part of the slug, so a name change never breaks the URL. Old slugs 301 to this one via the redirect table in lib/seo/redirects.ts.",
      },
      {
        label: "lastmod",
        text: "Set from the last verification event, never bumped by a re-render or a redeploy.",
      },
    ],
  };

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd data={[doctorLd(doctor), breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path })))]} />
      <Breadcrumbs items={crumbs} />
      <ViewBeacon doctorId={doctor.dbId} localityKey={doctor.localities[0]} />

      <div className="wrap">
        {doctor.practices[0] ? (
          <nav className="mobile-actions" aria-label="Contact this practice">
            <CallButton practiceId={doctor.practices[0].id} variant="solid" />
            <DirectionsButton practiceId={doctor.practices[0].id} variant="outline" />
            <Link className="btn" href={`${paths.doctor(doctor.slug)}/enquire?practice=0`}>Enquire</Link>
          </nav>
        ) : null}
        <div className="prof">
          <div>
            <GateBanner doctor={doctor} />

            <div className="prof-head">
              <Avatar name={doctor.name} id={doctor.id} size={84} photoUrl={doctor.photoUrl} />
              <div>
                <h1>Dr {doctor.name}</h1>
                <div className="role">
                  {specialty.one} in {CITY.name}
                  {doctor.subspecialties.length ? ` · ${doctor.subspecialties.join(", ")}` : ""}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <TrustBadges doctor={doctor} />
                </div>
              </div>
            </div>

            <div className="block">
              <p style={{ fontSize: "15.5px", color: "var(--ink-2)", maxWidth: "64ch" }}>
                {doctor.about}
              </p>
            </div>

            <section className="block">
              <h2>Verification record</h2>
              <div className="register">
                <div className="rhead">
                  <span className="t">Checked claims · source · date</span>
                  <span className="n">{doctor.lastVerifiedOn}</span>
                </div>

                <Row
                  tone="ok"
                  label="Medical registration verified"
                  source={`${doctor.registration.council} · ${doctor.registration.number} · registered ${doctor.registration.registeredYear}`}
                  when={doctor.registration.checkedOn}
                />
                {doctor.qualifications.map((q) => (
                  <Row
                    key={`${q.degree}-${q.year}`}
                    tone={q.state === "verified" ? "ok" : "wait"}
                    label={q.state === "verified" ? "Qualification verified" : "Qualification submitted by doctor"}
                    source={`${q.degree} · ${q.institution} · ${q.year}`}
                    when={q.state === "verified" ? doctor.registration.checkedOn : "pending"}
                  />
                ))}
                <Row
                  tone={doctor.status === "stale" ? "none" : "ok"}
                  label={
                    doctor.status === "stale"
                      ? "Practice not recently confirmed"
                      : "Practice location confirmed"
                  }
                  source={`${doctor.practices[0].facility}, ${LOCALITIES[doctor.practices[0].locality].name}`}
                  when={doctor.practices[0].confirmedOn}
                />
                <Row
                  tone={doctor.claimed ? "ok" : "none"}
                  label={doctor.claimed ? "Profile claimed by doctor" : "Profile not claimed"}
                  source={
                    doctor.claimed
                      ? "The doctor controls the editable fields on this page"
                      : "Compiled from permitted sources; the doctor may claim it free of charge"
                  }
                  when={doctor.claimed ? doctor.lastVerifiedOn : "—"}
                />
                {doctor.hprVerified ? (
                  <Row
                    tone="ok"
                    label="HPR ID verified"
                    source="Healthcare Professionals Registry, used as a secondary signal only"
                    when={doctor.registration.checkedOn}
                  />
                ) : null}
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
                Registration verification confirms that a doctor is on the register. It does not
                measure clinical skill, outcomes, current employment or the authenticity of any
                review. <Link href={paths.policy("verification")}>How verification works</Link>
              </p>
            </section>

            <section className="block">
              <h2>Practice and experience</h2>
              <dl className="kv">
                <dt>Experience</dt>
                <dd>
                  {doctor.yearsOfExperience} years — practice start year {doctor.practiceStartYear}{" "}
                  supplied by the doctor and consistent with the career history below
                </dd>
                <dt>Registered since</dt>
                <dd>{doctor.registration.registeredYear}</dd>
                <dt>Languages</dt>
                <dd>{doctor.languages.join(", ")}</dd>
                <dt>Consultation</dt>
                <dd>{doctor.modes.join(", ")}</dd>
              </dl>
              <div className="tl" style={{ marginTop: "16px" }}>
                {doctor.experience.map((e) => (
                  <div className="it" key={`${e.role}-${e.from}`}>
                    <div className="yr">
                      {e.from} – {e.to ?? "present"}
                    </div>
                    <div className="rl">{e.role}</div>
                    <div className="pl">{e.place}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="block">
              <h2>Services and conditions managed</h2>
              <div className="taglist">
                {doctor.services.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
                Drawn from a controlled list. Free-text claims go to review before they appear here.
              </p>
            </section>

            <Reviews doctor={doctor} />

            <Nearby doctor={doctor} nearby={await getNearby(doctor)} />
          </div>

          <div className="sticky">
            {doctor.practices.map((p, i) => (
              <div className="pcard" key={p.facility}>
                <div className="eyebrow">
                  Practice {i + 1} of {doctor.practices.length}
                </div>
                <div className="f" style={{ marginTop: "6px" }}>
                  {p.facility}
                </div>
                <div className="a">
                  {p.address} {p.postalCode}
                </div>
                <div className="h">
                  {p.days} {p.hours}
                  <br />
                  {p.feeInr !== null
                    ? `Fee ₹${p.feeInr.toLocaleString("en-IN")} · confirmed ${p.feeCheckedOn}`
                    : "Fee not confirmed"}
                  <br />
                  Address confirmed {p.confirmedOn}
                </div>
                <div className="acts">
                  <CallButton practiceId={p.id} />
                  <DirectionsButton practiceId={p.id} />
                  <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/enquire?practice=${i}`}>
                    Request appointment
                  </Link>
                </div>
              </div>
            ))}

            <div className="panel pad">
              <div className="eyebrow">Keep this page honest</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                <Link className="btn quiet" href={doctor.claimed ? "/dashboard" : `${paths.claimProfile()}?registration=${encodeURIComponent(doctor.registration.number)}`}>
                  {doctor.claimed ? "Manage this profile" : "Claim this profile"}
                </Link>
                <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/correct`}>
                  Suggest a correction
                </Link>
                <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/report`}>
                  Report this profile
                </Link>
              </div>
              <p className="mono" style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>
                Public ID {doctor.id} · last verified {doctor.lastVerifiedOn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({
  tone,
  label,
  source,
  when,
}: {
  tone: "ok" | "wait" | "none";
  label: string;
  source: string;
  when: string;
}) {
  return (
    <div className="rrow">
      <span className={`dot${tone === "none" ? "" : ` ${tone}`}`} />
      <div>
        <div className="lbl">{label}</div>
        <div className="src">{source}</div>
      </div>
      <span className="when">{when}</span>
    </div>
  );
}

function GateBanner({ doctor }: { doctor: DoctorView }) {
  if (!doctor.indexable) {
    return (
      <div className="notice alert" style={{ marginBottom: "18px" }}>
        <b>This profile is not indexed.</b> Quality score {doctor.qualityScore}/100 against a gate of
        70, and the practice has not been reconfirmed since {doctor.practices[0].confirmedOn}. It stays
        reachable by direct link and by search on this site, and carries <span className="mono">noindex</span>{" "}
        until it passes.
      </div>
    );
  }
  if (!doctor.claimed) {
    return (
      <div className="notice" style={{ marginBottom: "18px" }}>
        <b>Unclaimed profile.</b> Compiled from permitted sources and verified against the state
        register. If you are Dr {doctor.name.split(" ").slice(-1)[0]}, you can{" "}
        <Link href={paths.claimProfile()}>claim this page free</Link> and correct anything on it.
      </div>
    );
  }
  return null;
}

function Reviews({ doctor }: { doctor: DoctorView }) {
  const { rating, reviews } = doctor;
  return (
    <section className="block">
      <h2>Patient reviews</h2>
      <div className="revsum">
        <div>
          <div className="big">{rating.count ? rating.average.toFixed(1) : "—"}</div>
          <div className="of">{rating.count ? `${rating.count} reviews` : "no reviews yet"}</div>
        </div>
        <div>
          {rating.count ? (
            [5, 4, 3, 2, 1].map((star) => {
              const count = rating.distribution[star - 1];
              const pct = Math.round((count / rating.count) * 100);
              return (
                <div className="distrow" key={star}>
                  <span>{star}★</span>
                  <span className="b">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                  <span>{count}</span>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: "13.5px", color: "var(--muted)" }}>
              Reviews open once the profile is claimed and verified.
            </p>
          )}
        </div>
      </div>

      {reviews.length ? (
        reviews.map((r) => (
          <article className="rev" key={r.id}>
            <div className="top">
              <span className="who">
                {r.author}{" "}
                <span className={`badge ${r.evidenceChecked ? "ok" : "neut"}`} style={{ marginLeft: "6px" }}>
                  {r.evidenceChecked ? "Visit evidence checked" : "Evidence not supplied"}
                </span>
              </span>
              <span className="when">
                {r.visitMonth} · {r.mode}
              </span>
            </div>
            <div className="dims">
              <span>Communication {r.dimensions.communication}/5</span>
              <span>Explanation {r.dimensions.explanation}/5</span>
              <span>Wait time {r.dimensions.waitTime}/5</span>
              <span>Facility {r.dimensions.facility}/5</span>
            </div>
            <p className="txt">{r.text}</p>
            {r.reply ? (
              <div className="reply">
                <div className="who">Reply from Dr {doctor.name}</div>
                <p className="txt">{r.reply}</p>
              </div>
            ) : null}
          </article>
        ))
      ) : (
        <div className="rev">
          <p className="txt" style={{ color: "var(--muted)" }}>
            No written reviews have been published for this doctor yet. The score above comes from
            ratings submitted without written feedback.
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
        <Link className="btn" href={`${paths.doctor(doctor.slug)}/review`}>
          Write a review
        </Link>
        <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/report?about=review`}>
          Report a review
        </Link>
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "12px" }}>
        Reviews describe patient experience, not clinical outcome. We do not rate treatment
        effectiveness. <Link href={paths.policy("reviews")}>Review policy</Link>
      </p>
    </section>
  );
}

/**
 * Relevant nearby doctors — same speciality, same locality first. Chosen by
 * geography, never by payment (plan §7.1 item 16).
 */
function Nearby({ doctor, nearby }: { doctor: DoctorView; nearby: DoctorView[] }) {
  if (!nearby.length) return null;
  const specialty = SPECIALTIES[doctor.specialty];
  return (
    <section className="block">
      <h2>Other verified {specialty.plural.toLowerCase()} nearby</h2>
      <div className="rows">
        {nearby.map((d) => (
          <div className="mini" key={d.slug}>
            <Avatar name={d.name} id={d.id} size={40} photoUrl={d.photoUrl} />
            <div>
              <Link className="nm" href={paths.doctor(d.slug)}>
                Dr {d.name}
              </Link>
              <div className="s">
                {d.practices[0].facility}, {LOCALITIES[d.practices[0].locality].name}
                {d.subspecialties.length ? ` · ${d.subspecialties[0]}` : ""}
              </div>
            </div>
            <div className="r">{d.rating.count ? `${d.rating.average.toFixed(1)} · ${d.rating.count}` : "no reviews"}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
        Ordered by shared locality, then the rest of {CITY.name}. Nobody pays to appear here.
      </p>
    </section>
  );
}
