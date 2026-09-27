import Link from "next/link";
import type { ReactNode } from "react";

import type { SpecialtyContent } from "@/lib/data/specialty-content";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { QUALIFICATIONS } from "@/lib/qualifications";
import { paths } from "@/lib/site";
import type { Specialty } from "@/lib/types";

const REGISTER_LINE: Record<Specialty["system"], string> = {
  modern: "Registered with the National Medical Commission or a state medical council. The number can be searched on the NMC's Indian Medical Register.",
  dental: "Registered with a state dental council under the National Dental Commission.",
  ayush: "Registered with a state board under the NCISM (Ayurveda, Unani, Siddha, Sowa-Rigpa) or the NCH (Homoeopathy).",
  allied: "Registered with the body for that profession, such as the Rehabilitation Council of India or the allied and healthcare professions councils.",
  alternative: "There is no statutory national register for this practice in India, so check training and the clinic directly.",
};

export interface SpecialtyStats {
  listed: number;
  cities: number;
  states: number;
  verified: number;
}

const fmt = (n: number) => n.toLocaleString("en-IN");

function Icon({ name }: { name: "check" | "alert" | "arrow" | "doc" | "pulse" | "shield" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "check":
      return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "alert":
      return <svg {...common}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "doc":
      return <svg {...common}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>;
    case "pulse":
      return <svg {...common}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="sp-sec" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      {lead ? <p className="sp-lead">{lead}</p> : null}
      {children}
    </section>
  );
}

/**
 * The speciality page above the city directory: hero with live counts and the
 * two things a visitor came to do (find one, or check whether they need one),
 * then a contents rail beside the article. Every section renders only when it
 * has content, so an entry with no long-form content still gets the hero,
 * reasons to consult and the review note.
 */
export function SpecialtyArticle({
  specialty,
  content,
  stats,
  guideSlug,
}: {
  specialty: Specialty;
  content: SpecialtyContent | null;
  stats: SpecialtyStats;
  guideSlug: string | null;
}) {
  const quals = QUALIFICATIONS.filter((q) => q.specialty === specialty.key);
  const lower = specialty.plural.toLowerCase();
  const toc: Array<{ id: string; label: string }> = [
    specialty.when.length ? { id: "when", label: `When to see ${specialty.aOne}` } : null,
    content ? { id: "about", label: `What ${specialty.aOne} does` } : null,
    content?.conditions.length ? { id: "conditions", label: "Conditions treated" } : null,
    content?.tests.length ? { id: "tests", label: "Tests and procedures" } : null,
    content?.versus.length ? { id: "versus", label: "Which specialist?" } : null,
    content?.firstVisit.length ? { id: "first-visit", label: "Your first visit" } : null,
    { id: "credentials", label: "Qualifications to check" },
    content?.faqs.length ? { id: "faq", label: "Questions" } : null,
    { id: "by-place", label: `Find ${lower}` },
  ].filter((x): x is { id: string; label: string } => Boolean(x));

  return (
    <>
      <header className="sp-hero">
        <div className="wrap sp-hero-in">
          <div className="sp-hero-main">
            <span className="sp-dept">{specialty.department}</span>
            <h1>{specialty.name}</h1>
            <p className="sp-sub">{specialty.plural} in India: what they treat, when to see one, and who is listed near you</p>
            {specialty.guide ? <p className="sp-lede">{specialty.guide}</p> : null}
            <div className="sp-actions">
              <a className="btn solid" href="#by-place">
                Find {lower} near you <Icon name="arrow" />
              </a>
              {guideSlug ? (
                <Link className="btn quiet" href={`/health-guides/${guideSlug}`}>
                  When to consult: full guide
                </Link>
              ) : null}
            </div>
          </div>
          <aside className="sp-hero-side" aria-label="At a glance">
            <dl className="sp-stats">
              <div>
                <dt>Listed</dt>
                <dd>{fmt(stats.listed)}</dd>
              </div>
              <div>
                <dt>Cities</dt>
                <dd>{fmt(stats.cities)}</dd>
              </div>
              <div>
                <dt>States</dt>
                <dd>{fmt(stats.states)}</dd>
              </div>
              {stats.verified > 0 ? (
                <div>
                  <dt>Fully verified</dt>
                  <dd>{fmt(stats.verified)}</dd>
                </div>
              ) : null}
            </dl>
            <div className="sp-108">
              <Icon name="alert" />
              <span>
                <b>Emergency?</b> Call <b>108</b>. This is a directory, not an emergency service.
              </span>
            </div>
          </aside>
        </div>
      </header>

      <div className="wrap sp-layout">
        <nav className="sp-toc" aria-label="On this page">
          <div className="sp-toc-in">
            <span className="sp-toc-h">On this page</span>
            <ol>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.label}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="sp-main">
          {specialty.when.length ? (
            <Section id="when" title={`When to see ${specialty.aOne}`} lead="Common reasons people book a consultation.">
              <ul className="sp-checks">
                {specialty.when.map((w) => (
                  <li key={w}>
                    <span className="sp-ic ok"><Icon name="check" /></span>
                    {w}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {content ? (
            <Section id="about" title={`What ${specialty.aOne} does`}>
              <div className="sp-prose">
                {content.overview.map((p, i) => (
                  <p key={i} className={i === 0 ? "first" : undefined}>{p}</p>
                ))}
              </div>
            </Section>
          ) : null}

          {content?.urgent.length ? (
            <div className="sp-urgent" role="note">
              <div className="sp-urgent-h">
                <Icon name="alert" />
                <span>Do not wait for an appointment. Call 108 for:</span>
              </div>
              <ul>
                {content.urgent.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {content?.conditions.length ? (
            <Section id="conditions" title={`Conditions ${lower} treat`}>
              <div className="sp-cards">
                {content.conditions.map((c) => (
                  <div key={c.name} className="sp-card">
                    <h3>{c.name}</h3>
                    <p>{c.note}</p>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {content?.tests.length ? (
            <Section id="tests" title="Tests and procedures you may come across">
              <ul className="sp-tests">
                {content.tests.map((t) => (
                  <li key={t.name}>
                    <span className="sp-ic"><Icon name="pulse" /></span>
                    <div>
                      <h3>{t.name}</h3>
                      <p>{t.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {content?.versus.length ? (
            <Section id="versus" title={`${specialty.one} or another specialist?`} lead="The nearest neighbouring specialities, and when each is the right door.">
              <div className="sp-versus">
                {content.versus.map((v) => {
                  const other = specialtyByKey(v.key);
                  if (!other) return null;
                  return (
                    <Link key={v.key} href={paths.specialty(other.key)} className="sp-vs">
                      <span className="sp-vs-h">
                        {specialty.one} <span className="sp-vs-or">or</span> {other.one.toLowerCase()}?
                      </span>
                      <span className="sp-vs-t">{v.text}</span>
                      <span className="sp-vs-go">
                        About {other.plural.toLowerCase()} <Icon name="arrow" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {content?.firstVisit.length ? (
            <Section id="first-visit" title="Before your first visit">
              <ol className="sp-steps">
                {content.firstVisit.map((f, i) => (
                  <li key={i}>
                    <span className="sp-step-n" aria-hidden="true">{i + 1}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          <Section id="credentials" title="Qualifications and registration to check">
            <div className="sp-cred">
              <span className="sp-ic big"><Icon name="shield" /></span>
              <div>
                <p>{REGISTER_LINE[specialty.system]} Every profile on The Doctor Index shows the registration number and says whether it has been checked against the register.</p>
                {quals.length ? (
                  <>
                    <span className="sp-cred-h">Degrees you will see on {lower}&apos; profiles</span>
                    <ul className="regchips">
                      {quals.map((q) => (
                        <li key={q.slug}>
                          <Link href={paths.qualification(q.slug)}>{q.abbr}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <Link href={paths.registers()} className="sp-more">
                  How to check a registration <Icon name="arrow" />
                </Link>
              </div>
            </div>
          </Section>

          {content?.faqs.length ? (
            <Section id="faq" title={`Questions about seeing ${specialty.aOne}`}>
              <div className="sp-faq">
                {content.faqs.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>
                      <h3>{f.q}</h3>
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </Section>
          ) : null}

          <div className="sp-foot">
            {specialty.aliases.length ? (
              <p>
                <b>Also searched as:</b> {specialty.aliases.join(", ")}.
              </p>
            ) : null}
            <p className="sp-review">
              <Icon name="doc" />
              <span>
                {content?.reviewedOn
                  ? `Reviewed by ${content.reviewedBy ?? "a clinician"} on ${content.reviewedOn}.`
                  : content
                    ? `Written by The Doctor Index on ${content.writtenOn}${specialty.reviewedOn ? `. The summary at the top was medically reviewed on ${specialty.reviewedOn}; the rest of this page` : ", and"} has not yet been reviewed by a clinician.`
                    : specialty.reviewedOn
                      ? `Medically reviewed on ${specialty.reviewedOn}.`
                      : "General orientation written by The Doctor Index, not yet reviewed by a clinician."}{" "}
                General information, not advice about your own situation.
              </span>
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
