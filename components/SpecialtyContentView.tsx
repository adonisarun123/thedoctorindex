import Link from "next/link";

import type { SpecialtyContent } from "@/lib/data/specialty-content";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { QUALIFICATIONS } from "@/lib/qualifications";
import { paths } from "@/lib/site";
import type { Specialty } from "@/lib/types";

const REGISTER_LINE: Record<Specialty["system"], string> = {
  modern: "Registration is with the National Medical Commission or a state medical council; the number can be searched on the NMC's Indian Medical Register.",
  dental: "Registration is with a state dental council under the National Dental Commission.",
  ayush: "Registration is with a state board under the NCISM (Ayurveda, Unani, Siddha) or the NCH (Homoeopathy).",
  allied: "Registration is with the body for that profession — the Rehabilitation Council of India or the allied and healthcare professions councils.",
  alternative: "There is no statutory national register for this practice in India, so check training and the clinic directly.",
};

/**
 * The long-form half of a speciality page. Every section renders only when it
 * has content, and the qualifications list is drawn from the qualification
 * pages themselves (entries whose `specialty` is this one), never typed here.
 */
export function SpecialtyContentView({ specialty, content }: { specialty: Specialty; content: SpecialtyContent }) {
  const quals = QUALIFICATIONS.filter((q) => q.specialty === specialty.key);
  const one = specialty.one.toLowerCase();
  return (
    <>
      <h2>What {specialty.aOne} does</h2>
      {content.overview.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}

      {content.conditions.length ? (
        <>
          <h2>Conditions {specialty.plural.toLowerCase()} treat</h2>
          <dl className="spec-dl">
            {content.conditions.map((c) => (
              <div key={c.name}>
                <dt>{c.name}</dt>
                <dd>{c.note}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      {content.tests.length ? (
        <>
          <h2>Tests and procedures you may come across</h2>
          <dl className="spec-dl">
            {content.tests.map((t) => (
              <div key={t.name}>
                <dt>{t.name}</dt>
                <dd>{t.note}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      {content.versus.length ? (
        <>
          <h2>{specialty.one} or another specialist?</h2>
          <ul>
            {content.versus.map((v) => {
              const other = specialtyByKey(v.key);
              return other ? (
                <li key={v.key}>
                  <Link href={paths.specialty(other.key)}>{other.one}</Link>: {v.text}
                </li>
              ) : null;
            })}
          </ul>
        </>
      ) : null}

      {content.firstVisit.length ? (
        <>
          <h2>Before your first visit</h2>
          <ul>
            {content.firstVisit.map((f) => (
              <li key={f.slice(0, 40)}>{f}</li>
            ))}
          </ul>
        </>
      ) : null}

      <h2>Qualifications and registration to look for</h2>
      <p>{REGISTER_LINE[specialty.system]} Every profile on this site shows the registration number and says whether it has been checked.</p>
      {quals.length ? (
        <ul className="regchips">
          {quals.map((q) => (
            <li key={q.slug}>
              <Link href={paths.qualification(q.slug)}>{q.abbr}</Link>
            </li>
          ))}
        </ul>
      ) : null}

      {content.urgent.length ? (
        <div className="notice alert" style={{ maxWidth: "70ch", marginTop: "22px" }}>
          <b>Do not wait for an appointment — call 108 for:</b>
          <ul style={{ margin: "8px 0 0" }}>
            {content.urgent.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {content.faqs.length ? (
        <>
          <h2>Questions about seeing {specialty.aOne}</h2>
          <div className="spec-faq">
            {content.faqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "22px" }}>
        {content.reviewedOn
          ? `This guide to ${one}s was reviewed by ${content.reviewedBy ?? "a clinician"} on ${content.reviewedOn}.`
          : `This guide was written by The Doctor Index on ${content.writtenOn} and has not yet been reviewed by a clinician. It is general orientation, not advice about your situation.`}
      </p>
    </>
  );
}
