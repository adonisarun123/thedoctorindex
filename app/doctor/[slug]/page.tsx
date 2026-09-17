import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CallButton, DirectionsButton, ViewBeacon } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { canonicalDoctorPath, countIndexable, countsByLocality, countsBySpecialty, getAtFacility, getDoctorBySlug, getNearby, totals } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { hasDate, registrationLabel, registrationSource, registrationState } from "@/lib/verification";
import { GATES, profileGate } from "@/lib/seo/gates";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, doctorLd, faqLd } from "@/lib/seo/structured-data";
import { addressLine, buildFaq, facilityLabel, summarySentence, supplySentence, verificationLine } from "@/lib/seo/profile-content";
import { GoogleListingCard } from "@/components/GoogleListing";
import { absoluteUrl, paths } from "@/lib/site";
import type { DoctorCredential, DoctorView } from "@/lib/types";

type Params = { slug: string };

/**
 * Profiles render on demand and are cached for an hour. Tens of thousands
 * of profiles make prerendering every one at build time pointless; the
 * first visitor (or crawler) pays a single render, after which the page is
 * static until a verification event or the hour passes.
 */
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await resolve(slug);

  const specialty = SPECIALTIES[doctor.specialty];
  const primary = doctor.practices[0];
  const locality = primary?.localityName ?? null;
  const cityName = primary?.city || "India";
  const degrees = doctor.qualifications.filter((q) => q.state === "verified").map((q) => q.degree).slice(0, 2).join(", ");
  const [firstName, ...rest] = doctor.name.split(/\s+/);
  return pageMeta({
    title: `Dr ${doctor.name} – ${specialty.one} in ${cityName}`,
    ogTitle: `Dr ${doctor.name}, ${specialty.one} in ${locality && locality !== cityName ? `${locality}, ` : ""}${cityName}`,
    description: `Dr ${doctor.name}, ${specialty.one.toLowerCase()} in ${locality && locality !== cityName ? `${locality}, ` : ""}${cityName}. ${degrees ? `${degrees}. ` : ""}${doctor.yearsOfExperience ? `${doctor.yearsOfExperience}+ years. ` : ""}${doctor.registration.checkedOn && doctor.registration.checkedOn !== "—" ? `Registration checked ${doctor.registration.checkedOn}; qualifications and practice dated.` : "Registration not yet checked against the council register."}`,
    path: paths.doctor(doctor.slug),
    index: doctor.indexable,
    type: "profile",
    image: "segment",
    profile: { firstName, lastName: rest.join(" ") || undefined, ...(doctor.gender ? { gender: doctor.gender === "F" ? "female" : "male" } : {}) },
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
  const primary = doctor.practices[0];
  const cityName = primary?.city || "India";
  const listingPath = primary?.citySlug ? paths.citySpecialty(primary.stateSlug, primary.citySlug, specialty.slug) : paths.specialty(specialty.key);
  const faqs = buildFaq(doctor);

  // A locality step is added only when the locality × speciality page behind it
  // holds enough doctors to be indexed. A breadcrumb that points at a page we
  // have decided not to index spends crawl budget for nothing, and reads to a
  // patient as a promise of a list that is not there.
  const localityKey = doctor.localities[0];
  const localityCount = localityKey ? await countIndexable(doctor.specialty, { localityKey }, "published") : 0;
  const localityCrumb =
    primary?.localitySlug && primary.localityName && primary.localityName !== primary.city && localityCount >= GATES.localitySpecialty
      ? [{ name: primary.localityName, path: paths.localitySpecialty(primary.stateSlug, primary.citySlug, primary.localitySlug, specialty.slug) }]
      : [];

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    ...(primary?.citySlug ? [{ name: primary.city, path: `/doctors/${primary.stateSlug}/${primary.citySlug}` }] : []),
    { name: specialty.plural, path: listingPath },
    ...localityCrumb,
    { name: `Dr ${doctor.name}` },
  ];

  const routeMeta: RouteMetaData = {
    route: "Doctor profile",
    title: `Dr ${doctor.name} – ${specialty.one} in ${cityName} | The Doctor Index`,
    h1: `Dr ${doctor.name}, ${specialty.one} in ${cityName}`,
    canonical: absoluteUrl(paths.doctor(doctor.slug)),
    index: doctor.indexable,
    gate: { name: "Profile gate", checks: gate.checks },
    structuredData: doctor.claimed
      ? "ProfilePage > mainEntity: Person + IndividualPhysician, MedicalClinic per practice, FAQPage from the record"
      : "WebPage > mainEntity: Person + IndividualPhysician, MedicalClinic per practice, FAQPage from the record",
    lastmod: doctor.lastVerifiedOn,
    notes: [
      {
        label: "Why this schema type",
        text: doctor.claimed
          ? "ProfilePage is used only where the doctor is affiliated with and actively participates in the page. This profile is claimed, so it qualifies."
          : "This record is unclaimed, so the doctor takes no part in it and ProfilePage does not apply. It gets WebPage instead.",
      },
      {
        label: "FAQ and summary",
        text: "Every sentence is a template over fields the record holds — a missing fee reads \"not confirmed\", never a guess. The FAQPage markup is built from the same builders as the visible answers, so it cannot say more than the page.",
      },
      {
        label: "Google listing",
        text: doctor.googleListing ? "Matched by the enrichment worker; only the place ID is stored. Ratings are Google's and are linked, not copied, per the Places policy." : "No Google listing matched yet.",
      },
      {
        label: "Review markup",
        text: doctor.rating.count > 0
          ? "AggregateRating is emitted from the stored rollup, which is a real aggregate. Individual Review objects are not: a review here scores four named dimensions and carries no single overall star, so any per-review rating would be a number no reviewer gave. Google does not show review snippets for a Person regardless."
          : "Not emitted — there are no published reviews on this profile. Nothing is emitted until there are, and even then only the aggregate.",
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

  const primaryPractice = doctor.practices[0] ?? null;
  const checks = profileChecks(doctor);
  const passed = checks.filter((c) => c.ok).length;
  const qualsVerified = doctor.qualifications.filter((q) => q.state === "verified");
  const claimHref = doctor.claimed ? "/dashboard" : `${paths.claimProfile()}?registration=${encodeURIComponent(doctor.registration.number)}`;
  const surname = doctor.name.split(" ").slice(-1)[0];

  // "On record": only facts the record actually holds. A missing fact is
  // said once, in the practice card, not as a row of "Not stated".
  const facts: Array<{ k: string; v: string; mono?: boolean }> = [];
  if (registrationState(doctor) !== "none") {
    facts.push({ k: registrationState(doctor) === "verified" ? "Registration" : "Registration (as supplied)", v: `${doctor.registration.council} · No. ${doctor.registration.number}`, mono: true });
  }
  if (doctor.registration.registeredYear) {
    const yrs = new Date().getFullYear() - doctor.registration.registeredYear;
    facts.push({ k: "Registered since", v: `${doctor.registration.registeredYear}${yrs > 0 ? ` · ${yrs} years` : ""}`, mono: true });
  }
  if (doctor.qualifications.length) {
    facts.push({ k: qualsVerified.length === doctor.qualifications.length ? "Qualification" : "Qualification (as supplied)", v: doctor.qualifications.map((q) => [q.degree, q.institution, q.year || null].filter(Boolean).join(", ")).join(" · ") });
  }
  facts.push({ k: "System of medicine", v: systemLabel(specialty.system) });
  if (doctor.practiceStartYear) facts.push({ k: "Experience", v: `${doctor.yearsOfExperience} years · practising since ${doctor.practiceStartYear}` });
  if (doctor.languages.length) facts.push({ k: "Languages", v: doctor.languages.join(", ") });
  if (doctor.modes.length) facts.push({ k: "Consultation", v: doctor.modes.join(", ") });

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd data={[doctorLd(doctor), faqLd(paths.doctor(doctor.slug), faqs), breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path })))]} />
      <ViewBeacon doctorId={doctor.dbId} localityKey={doctor.localities[0]} />

      {primaryPractice ? (
        <nav className="mobile-actions" aria-label="Contact this practice">
          <CallButton practiceId={primaryPractice.id} variant="solid" />
          <DirectionsButton practiceId={primaryPractice.id} variant="outline" />
          <Link className="btn" href={`${paths.doctor(doctor.slug)}/enquire?practice=0`}>Enquire</Link>
        </nav>
      ) : null}

      <header className="idband">
        <Breadcrumbs items={crumbs} />
        <div className="wrap">
          {!doctor.indexable ? <GateBanner doctor={doctor} /> : null}
          <div className="idband-grid">
            <Avatar name={doctor.name} id={doctor.id} photoUrl={doctor.photoUrl} />
            <div className="idband-main">
              <div className="idband-name">
                <h1>Dr {doctor.name}</h1>
                {registrationState(doctor) === "verified" ? (
                  <span className="badge ok">Registered</span>
                ) : null}
              </div>
              <div className="role">
                {specialty.one}
                {qualsVerified.length ? ` · ${qualsVerified.map((q) => q.degree).slice(0, 2).join(", ")}` : ""}
                {doctor.registration.registeredYear ? ` · practising since ${doctor.registration.registeredYear}` : ""}
                {doctor.subspecialties.length ? ` · ${doctor.subspecialties.join(", ")}` : ""}
              </div>
              {primaryPractice ? (
                <div className="where">
                  <PinIcon />
                  <span>{[facilityLabel(primaryPractice), primaryPractice.localityName, primaryPractice.city].filter((v, i, a) => v && a.indexOf(v) === i).join(", ")}</span>
                </div>
              ) : null}
              <div className="meter" aria-label={`${passed} of ${checks.length} checks passed`}>
                <div className="meter-head">
                  <span>
                    {passed} of {checks.length} checks passed
                  </span>
                  <Link href={paths.policy("verification")} className="mono">
                    What each check means
                  </Link>
                </div>
                <div className="meter-bars">
                  {checks.map((c) => (
                    <i key={c.label} className={c.ok ? "ok" : c.pending ? "wait" : ""} />
                  ))}
                </div>
                <div className="meter-labels">
                  {checks.map((c) => (
                    <span key={c.label} className={c.ok ? "ok" : ""}>
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {primaryPractice ? (
              <div className="idband-acts">
                <CallButton practiceId={primaryPractice.id} variant="solid" />
                <div className="pair">
                  <DirectionsButton practiceId={primaryPractice.id} variant="outline" />
                  <Link className="btn" href={`${paths.doctor(doctor.slug)}/enquire?practice=0`}>
                    Enquire
                  </Link>
                </div>
                <p>Number shown after sign-in, to keep it off scraper lists.</p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="prof">
          <div>
            <section className="block">
              <h2>On record</h2>
              <dl className="facts">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt className="eyebrow">{f.k}</dt>
                    <dd className={f.mono ? "mono" : undefined}>{f.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="blocklede">
                {summarySentence(doctor)}
              </p>
              {doctor.about && doctor.about.trim().length >= 40 ? (
                <p className="blockbody">{doctor.about}</p>
              ) : null}
            </section>

            {doctor.practices.length ? (
              <section className="block">
                <h2>{doctor.practices.length > 1 ? "Practices" : "Practice"}</h2>
                <div className="practices">
                  {doctor.practices.map((p, i) => {
                    const confirmed = hasDate(p.confirmedOn) && doctor.status !== "stale";
                    const gaps = [
                      p.feeInr === null ? "fee" : null,
                      !p.days && !p.hours ? "timings" : null,
                      !doctor.languages.length ? "languages" : null,
                    ].filter(Boolean) as string[];
                    return (
                      <div className="practice" key={p.id ?? p.facility}>
                        {doctor.practices.length > 1 ? (
                          <div className="eyebrow">
                            Practice {i + 1} of {doctor.practices.length}
                          </div>
                        ) : null}
                        <div className="f">{facilityLabel(p)}</div>
                        <div className="a">{addressLine(p).replace(new RegExp(`^${facilityLabel(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")},\\s*`), "")}</div>
                        <div className="badges">
                          {confirmed ? <span className="badge ok">Address confirmed {p.confirmedOn}</span> : <span className="badge wait">Address not yet reconfirmed with the clinic</span>}
                          {p.feeInr !== null ? <span className="badge ok">Fee ₹{p.feeInr.toLocaleString("en-IN")} · confirmed {p.feeCheckedOn}</span> : null}
                        </div>
                        {p.days || p.hours ? (
                          <div className="h mono">
                            {p.days} {p.hours}
                          </div>
                        ) : null}
                        {gaps.length ? (
                          <p className="gaps">
                            {cap(listJoin(gaps))} {gaps.length > 1 ? "are" : "is"} not on record yet. Ask when you call{doctor.claimed ? "" : ", or the practice can confirm them by claiming this page"}.
                          </p>
                        ) : null}
                        <div className="acts">
                          <DirectionsButton practiceId={p.id} variant="outline" />
                          <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/enquire?practice=${i}`}>
                            Request appointment
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {doctor.googleListing ? (
                  <div style={{ marginTop: "12px" }}>
                    <GoogleListingCard listing={doctor.googleListing} doctorName={doctor.name} />
                  </div>
                ) : null}
              </section>
            ) : null}

            <section className="block">
              <div className="section-head" style={{ marginBottom: "12px" }}>
                <h2>Verification record</h2>
                <span className="mono blockmeta">
                  Last checked {doctor.lastVerifiedOn}
                </span>
              </div>
              <div className="register">
                <Row
                  tone={registrationState(doctor) === "verified" ? "ok" : registrationState(doctor) === "submitted" ? "wait" : "none"}
                  label={registrationState(doctor) === "verified" ? "Medical registration verified" : registrationLabel(doctor)}
                  source={registrationSource(doctor)}
                  when={registrationState(doctor) === "verified" ? doctor.registration.checkedOn : registrationState(doctor) === "submitted" ? "pending" : "—"}
                />
                {doctor.qualifications.length === 0 ? <Row tone="none" label="No qualification on record" source="Degrees appear here once supplied and checked against the awarding body" when="—" /> : null}
                {doctor.qualifications.map((q) => (
                  <Row
                    key={`${q.degree}-${q.year}`}
                    tone={q.state === "verified" ? "ok" : "wait"}
                    label={q.state === "verified" ? "Qualification verified" : "Qualification submitted by doctor"}
                    source={[q.degree, q.institution, q.year || null].filter(Boolean).join(" · ")}
                    when={q.state === "verified" ? doctor.registration.checkedOn : "pending"}
                  />
                ))}
                {primaryPractice ? (
                  <Row
                    tone={doctor.status === "stale" ? "none" : "ok"}
                    label={
                      doctor.status === "stale"
                        ? hasDate(primaryPractice.confirmedOn) ? "Practice not recently confirmed" : "Practice address not yet reconfirmed"
                        : "Practice location confirmed"
                    }
                    source={`${facilityLabel(primaryPractice)}, ${primaryPractice.localityName}`}
                    when={primaryPractice.confirmedOn}
                  />
                ) : (
                  <Row tone="none" label="Practice location not on record" source="No practice address has been supplied or confirmed" when="—" />
                )}
                <Row
                  tone={doctor.claimed ? "ok" : "none"}
                  label={doctor.claimed ? "Profile claimed by doctor" : "Not yet claimed by the doctor"}
                  source={doctor.claimed ? "The doctor controls the editable fields on this page" : "Compiled from permitted sources; the doctor may claim it free of charge"}
                  when={doctor.claimed ? doctor.lastVerifiedOn : "—"}
                />
                {doctor.hprVerified ? <Row tone="ok" label="HPR ID verified" source="Healthcare Professionals Registry, used as a secondary signal only" when={doctor.registration.checkedOn} /> : null}
              </div>
              <p className="blocknote">
                Registration verification confirms that a doctor is on the register. It does not measure clinical skill, outcomes, current employment or the
                authenticity of any review. <Link href={paths.policy("verification")}>How verification works</Link>
              </p>
            </section>

            {doctor.experience.length ? (
              <section className="block">
                <h2>Career history</h2>
                <div className="tl">
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
            ) : null}

            {doctor.services.length ? (
              <section className="block">
                <h2>Services and conditions managed</h2>
                <div className="taglist">
                  {doctor.services.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <p className="blocknote">Drawn from a controlled list. Free-text claims go to review before they appear here.</p>
              </section>
            ) : null}

            <Credentials doctor={doctor} />

            <section className="block" aria-labelledby="faq-h">
              <h2 id="faq-h">Questions people ask</h2>
              <div className="faq-acc">
                {faqs.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
              <p className="blocknote">
                Answers come from the verified record on this page, not from opinion. Where a fact has not been confirmed, the answer says so.
              </p>
            </section>

            <Reviews doctor={doctor} />

            <Nearby doctor={doctor} nearby={await getNearby(doctor)} />

            <AtFacility doctor={doctor} />

            <InTheArea doctor={doctor} />
          </div>

          <aside className="sticky">
            {doctor.claimed ? (
              <div className="panel pad">
                <div className="eyebrow">Claimed by the doctor</div>
                <p className="panelbody">The doctor controls the editable fields on this page.</p>
                <Link className="btn quiet" href={claimHref}>
                  Manage this profile
                </Link>
              </div>
            ) : (
              <div className="claimcard">
                <div className="eyebrow">Is this you, Dr {surname}?</div>
                <div className="t">Claim this page, free</div>
                <p>Correct anything, add your fee and timings, and reply to reviews. Takes about five minutes with your registration number.</p>
                <Link className="btn solid" href={claimHref}>
                  Claim this profile
                </Link>
              </div>
            )}

            <div className="panel pad honest">
              <div className="eyebrow">Keep this page honest</div>
              <Link href={`${paths.doctor(doctor.slug)}/correct`}>Suggest a correction →</Link>
              <Link href={`${paths.doctor(doctor.slug)}/report`}>Report this profile →</Link>
              <p className="mono">
                Public ID {doctor.id} · last verified {doctor.lastVerifiedOn}
              </p>
            </div>
            <p className="railnote">Not for emergencies. If someone is in immediate danger, call 108.</p>
          </aside>
        </div>
      </div>
    </>
  );
}

/**
 * The four checks the header meter shows. Same derivations as the badges
 * and the verification record, so the meter can never disagree with them.
 */
function profileChecks(doctor: DoctorView): Array<{ label: string; ok: boolean; pending?: boolean }> {
  const reg = registrationState(doctor);
  const quals = doctor.qualifications;
  return [
    { label: "Registration", ok: reg === "verified", pending: reg === "submitted" },
    { label: "Qualification", ok: quals.length > 0 && quals.every((q) => q.state === "verified"), pending: quals.length > 0 },
    { label: "Address", ok: Boolean(doctor.practices[0]) && doctor.status !== "stale" },
    { label: "Claimed", ok: doctor.claimed },
  ];
}

function systemLabel(system: string): string {
  switch (system) {
    case "modern":
      return "Allopathic (modern medicine)";
    case "dental":
      return "Dentistry";
    case "ayush":
      return "AYUSH";
    default:
      return system.charAt(0).toUpperCase() + system.slice(1);
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const listJoin = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

function PinIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
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
  if (doctor.indexable) return null;
  return (
    <div className="notice alert" style={{ margin: "14px 0 6px" }}>
      <b>This profile is not indexed.</b>{" "}
      {doctor.status === "retired"
        ? "The record is marked retired."
        : !doctor.practices.length
          ? "No practice location is on record."
          : `Quality score ${doctor.qualityScore}/100 against a gate of ${GATES.profileQuality}${hasDate(doctor.practices[0]?.confirmedOn) ? `, and the practice has not been reconfirmed since ${doctor.practices[0]?.confirmedOn}` : ", and no practice location has been confirmed yet"}.`}{" "}
      It stays reachable by direct link and by search on this site, and carries <span className="mono">noindex</span> until it passes.
    </div>
  );
}

function Reviews({ doctor }: { doctor: DoctorView }) {
  const { rating, reviews } = doctor;
  if (!rating.count && !reviews.length) {
    return (
      <section className="block">
        <h2>Patient reviews</h2>
        <div className="panel pad revempty">
          <p>
            No reviews yet. Reviews open once the profile is claimed and verified; they describe patient experience, never clinical outcome.{" "}
            <Link href={paths.policy("reviews")}>Review policy</Link>
          </p>
          <Link className="btn" href={`${paths.doctor(doctor.slug)}/review`}>
            Write a review
          </Link>
        </div>
      </section>
    );
  }
  return (
    <section className="block">
      <h2>Patient reviews</h2>
      <div className="revsum">
        <div>
          <div className="big">{rating.count ? rating.average.toFixed(1) : "—"}</div>
          <div className="of">{rating.count ? `${rating.count} reviews` : "no reviews yet"}</div>
        </div>
        <div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = rating.distribution[star - 1];
            const pct = rating.count ? Math.round((count / rating.count) * 100) : 0;
            return (
              <div className="distrow" key={star}>
                <span>{star}★</span>
                <span className="b">
                  <i style={{ width: `${pct}%` }} />
                </span>
                <span>{count}</span>
              </div>
            );
          })}
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
            No written reviews have been published for this doctor yet. The score above comes from ratings submitted without written feedback.
          </p>
        </div>
      )}

      <div className="blockacts">
        <Link className="btn" href={`${paths.doctor(doctor.slug)}/review`}>
          Write a review
        </Link>
        <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/report?about=review`}>
          Report a review
        </Link>
      </div>
      <p className="blocknote">
        Reviews describe patient experience, not clinical outcome. We do not rate treatment effectiveness. <Link href={paths.policy("reviews")}>Review policy</Link>
      </p>
    </section>
  );
}

/**
 * Awards, memberships and publications.
 *
 * All of it is self-reported: no import carries these and no register confirms
 * most of them. So each entry states which of the two it is, in the same words
 * the qualifications use, and an unverified one is never dressed as a
 * distinction. They earn no quality-score points either, so this section can
 * never move a profile towards the index gate.
 */
function Credentials({ doctor }: { doctor: DoctorView }) {
  if (!doctor.credentials.length) return null;
  const groups: Array<{ kind: DoctorCredential["kind"]; heading: string }> = [
    { kind: "award", heading: "Awards and honours" },
    { kind: "membership", heading: "Professional memberships" },
    { kind: "publication", heading: "Publications" },
  ];
  const anyUnverified = doctor.credentials.some((c) => c.state !== "verified");
  return (
    <section className="block">
      <h2>Awards, memberships and publications</h2>
      {groups.map(({ kind, heading }) => {
        const items = doctor.credentials.filter((c) => c.kind === kind);
        if (!items.length) return null;
        return (
          <div className="credgroup" key={kind}>
            <h3 className="ctxhead">{heading}</h3>
            <ul className="credlist">
              {items.map((c) => (
                <li key={c.id}>
                  <div className="ct">
                    {c.url ? (
                      <a href={c.url} rel="nofollow ugc noopener" target="_blank">
                        {c.title}
                      </a>
                    ) : (
                      c.title
                    )}
                  </div>
                  <div className="cm">{[c.issuer, c.year ? String(c.year) : null].filter(Boolean).join(" · ") || "Issuer not stated"}</div>
                  <span className={`badge ${c.state === "verified" ? "ok" : "neut"}`}>
                    {c.state === "verified" ? "Checked with the issuer" : "As supplied by the doctor"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="blocknote">
        Supplied by the doctor. An entry marked as checked was confirmed with the awarding body, society or journal named beside it; the rest have not
        been. None of this counts towards the profile&rsquo;s verification checks or its quality score, and an unchecked entry is not published to search
        engines as a credential. Links are the doctor&rsquo;s own.{anyUnverified ? " " : ""}
        {anyUnverified ? <Link href={paths.policy("verification")}>How verification works</Link> : null}
      </p>
    </section>
  );
}

/**
 * Colleagues at the same address, any speciality.
 *
 * Matched on facility id, so this is a fact the record holds rather than a
 * guess from a name. It is the one block on this page whose contents are
 * unique to this doctor's address, and it gives a large hospital's doctors a
 * crawlable path to each other that the sitemap alone does not.
 */
async function AtFacility({ doctor }: { doctor: DoctorView }) {
  const primary = doctor.practices[0];
  if (!primary?.facilityId) return null;
  const peers = await getAtFacility(primary.facilityId, doctor.slug, 6);
  if (!peers.length) return null;
  const where = facilityLabel(primary);
  return (
    <section className="block">
      <h2>Other doctors at {where}</h2>
      <div className="rows">
        {peers.map((d) => {
          const sp = SPECIALTIES[d.specialty];
          return (
            <div className="mini" key={d.slug}>
              <Avatar name={d.name} id={d.id} size={40} photoUrl={d.photoUrl} />
              <div>
                <Link className="nm" href={paths.doctor(d.slug)}>
                  Dr {d.name}
                </Link>
                <div className="s">
                  {sp.one}
                  {d.qualifications.length ? ` · ${d.qualifications.map((q) => q.degree).slice(0, 2).join(", ")}` : ""}
                </div>
              </div>
              <div className="r">
                {registrationState(d) === "verified" ? <span className="badge ok">Registered</span> : <span className="badge neut">Listed</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="blocknote">
        Doctors with an active practice recorded at the same address. Sharing an address is not an endorsement by either doctor, and the list is not
        ordered by payment.
      </p>
    </section>
  );
}

/**
 * Where this doctor sits in the local supply, and the browse pages either side
 * of this profile.
 *
 * Every number here is a count the database returned for this exact locality,
 * city and speciality, so no two profiles carry the same paragraph. Links are
 * emitted only for combinations that clear the same gate the listing page
 * itself uses — a profile should never point a crawler at a page we have
 * decided not to index.
 */
async function InTheArea({ doctor }: { doctor: DoctorView }) {
  const p = doctor.practices[0];
  if (!p?.citySlug) return null;
  const sp = SPECIALTIES[doctor.specialty];
  const localityKey = doctor.localities[0];
  const place = { stateSlug: p.stateSlug, citySlug: p.citySlug };

  const [inLocality, inCity, cityTotals, byLocality, bySpecialty, geo] = await Promise.all([
    localityKey ? countIndexable(doctor.specialty, { localityKey }, "published") : Promise.resolve(0),
    countIndexable(doctor.specialty, place, "published"),
    totals(place),
    countsByLocality(p.citySlug, doctor.specialty, "published"),
    countsBySpecialty(place, "published"),
    getGeo(),
  ]);

  const sentence = supplySentence(doctor, { locality: inLocality, city: inCity, cityAllSpecialties: cityTotals.published });

  // Other localities in this city that hold enough of this speciality to be worth a link.
  const localityLinks = Object.entries(byLocality)
    .filter(([key, n]) => key !== localityKey && n >= GATES.localitySpecialty)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, n]) => ({ loc: geo.locality(key), n }))
    .filter((x): x is { loc: NonNullable<ReturnType<typeof geo.locality>>; n: number } => Boolean(x.loc));

  // Other specialities in this city, same gate as the city × speciality page.
  const specialtyLinks = SPECIALTY_KEYS.filter((k) => k !== doctor.specialty && (bySpecialty[k] ?? 0) >= GATES.citySpecialty)
    .map((k) => ({ sp: SPECIALTIES[k], n: bySpecialty[k] ?? 0 }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 12);

  if (!sentence && !localityLinks.length && !specialtyLinks.length) return null;

  return (
    <section className="block">
      <h2>
        {sp.name} in {p.city}
      </h2>
      {sentence ? <p className="blocklede">{sentence}</p> : null}
      <div className="ctxlinks">
        {inCity >= GATES.citySpecialty ? (
          <Link className="ctxlink lead" href={paths.citySpecialty(p.stateSlug, p.citySlug, sp.slug)}>
            <span className="n">All {sp.plural.toLowerCase()} in {p.city}</span>
            <span className="c">{inCity.toLocaleString("en-IN")}</span>
          </Link>
        ) : null}
        {localityLinks.map(({ loc, n }) => (
          <Link className="ctxlink" key={loc.key} href={paths.localitySpecialty(loc.stateSlug, loc.citySlug, loc.slug, sp.slug)}>
            <span className="n">{loc.name}</span>
            <span className="c">{n}</span>
          </Link>
        ))}
      </div>
      {specialtyLinks.length ? (
        <>
          <h3 className="ctxhead">Other specialities in {p.city}</h3>
          <div className="ctxlinks">
            {specialtyLinks.map(({ sp: other, n }) => (
              <Link className="ctxlink" key={other.key} href={paths.citySpecialty(p.stateSlug, p.citySlug, other.slug)}>
                <span className="n">{other.plural}</span>
                <span className="c">{n.toLocaleString("en-IN")}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
      <p className="blocknote">
        Counts are of profiles this index holds, taken from the database when the page was last built. They are not a census of doctors practising in{" "}
        {p.city}.
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
      <h2>
        Other {specialty.plural.toLowerCase()} {doctor.practices[0]?.city ? `in ${doctor.practices[0].city}` : "nearby"}
      </h2>
      <div className="rows">
        {nearby.map((d) => (
          <div className="mini" key={d.slug}>
            <Avatar name={d.name} id={d.id} size={40} photoUrl={d.photoUrl} />
            <div>
              <Link className="nm" href={paths.doctor(d.slug)}>
                Dr {d.name}
              </Link>
              <div className="s">
                {d.practices[0] ? `${d.practices[0].facility}, ${d.practices[0].localityName}` : "Practice not on record"}
                {d.subspecialties.length ? ` · ${d.subspecialties[0]}` : ""}
              </div>
            </div>
            <div className="r">
              {d.rating.count ? `${d.rating.average.toFixed(1)} · ${d.rating.count}` : registrationState(d) === "verified" ? <span className="badge ok">Registered</span> : <span className="badge neut">Listed</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="blocknote">
        Same locality first, then the rest of {doctor.practices[0]?.city || "the city"}; doctors with a registration on record come before those without. Nobody pays to appear here.
      </p>
    </section>
  );
}
