import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsBySpecialty } from "@/lib/data";
import { guideForSpecialty } from "@/lib/data/guides";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { breadcrumbLd, collectionLd, faqLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";
import type { SpecialtyKey } from "@/lib/types";

const TITLE = "Find a doctor by speciality";
const DESCRIPTION = `What each of ${SPECIALTY_KEYS.length} medical, dental, AYUSH and allied-health specialities treats, the names patients search for it by, and how many practising doctors in India are listed and verified in each.`;

export const metadata = pageMeta({ title: "Doctors by speciality in India", description: DESCRIPTION, path: "/specialties" });

export const revalidate = 3600;

const fmt = (n: number) => n.toLocaleString("en-IN");

/**
 * One line per department, shown under its heading. Descriptive only — what the
 * group covers — so it makes no clinical claim a reviewer would need to sign.
 * A department missing from this map still renders, just without a line.
 */
const DEPARTMENT_BLURB: Record<string, string> = {
  "General & family medicine": "The usual first stop, and the physicians who coordinate care when several conditions overlap.",
  "Women's health": "Pregnancy, childbirth, periods, fertility and menopause.",
  "Child Health": "Newborns, children and adolescents — medical and surgical.",
  "Heart & Vascular": "The heart, blood pressure and blood vessels — medical and surgical.",
  "Bones & Joints": "Bones, joints, spine and muscles, and the recovery of movement.",
  "Skin & Hair": "Skin, hair, nails and scalp — medical and cosmetic.",
  "Eyes": "Eye disease, vision and eye surgery.",
  "Ear, nose & throat": "Hearing, sinuses, throat, voice, head and neck.",
  "Brain & nerves": "The brain, spinal cord and nerves — medical and surgical.",
  "Mental health": "Mental illness and psychological difficulty — medication and talking therapy.",
  "Lungs & breathing": "Asthma, COPD, tuberculosis and other lung and breathing problems.",
  "Digestive": "Stomach, intestine, liver and pancreas — medical and surgical.",
  "Kidney & urinary": "The kidneys, bladder, prostate and urinary tract.",
  "Hormones & metabolism": "Diabetes, thyroid and other hormone disorders.",
  "Cancer": "Cancer and blood disorders — surgery, radiation and drug treatment.",
  "Surgery": "Surgical specialities, and the anaesthesia and transplant teams around them.",
  "Diagnostics": "The doctors who read the scans and run the lab tests other doctors act on.",
  "Emergency & critical care": "Emergency departments and intensive care. In an emergency, call 108 — do not browse.",
  "Dental": "Teeth, gums and mouth. Dentists are registered with the dental councils, not the medical register.",
  "AYUSH & alternative": "Ayurveda, Homoeopathy, Unani, Siddha and other systems, each labelled by the register it answers to.",
  "Allied health": "Therapists and allied professionals, who answer to their own registering bodies rather than a medical council.",
  "Other": "Specialities that do not sit under one organ system.",
};

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function SpecialtiesIndexPage() {
  const [verified, listed] = await Promise.all([countsBySpecialty(), countsBySpecialty(undefined, "published")]);
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Specialities", path: paths.specialties() }];
  const reviewed = SPECIALTY_KEYS.filter((k) => SPECIALTIES[k].reviewedOn).length;
  const totalListed = SPECIALTY_KEYS.reduce((a, k) => a + (listed[k] ?? 0), 0);
  const totalVerified = SPECIALTY_KEYS.reduce((a, k) => a + (verified[k] ?? 0), 0);

  // Departments ordered by how many doctors they list, largest first; "Other" last.
  // Within a department, the same order. Both follow the live counts.
  const byDept = new Map<string, SpecialtyKey[]>();
  for (const k of SPECIALTY_KEYS) {
    const d = SPECIALTIES[k].department;
    byDept.set(d, [...(byDept.get(d) ?? []), k]);
  }
  const deptTotal = (keys: SpecialtyKey[]) => keys.reduce((a, k) => a + (listed[k] ?? 0), 0);
  const groups = [...byDept.entries()]
    .map(([name, keys]) => ({ name, id: `dept-${slug(name)}`, keys: [...keys].sort((a, b) => (listed[b] ?? 0) - (listed[a] ?? 0)) }))
    .sort((a, b) => (a.name === "Other" ? 1 : b.name === "Other" ? -1 : deptTotal(b.keys) - deptTotal(a.keys)));

  // Every answer restates copy already on the site (the speciality registry,
  // the register pages, the ranking and verification policies). The FAQPage
  // markup is built from this same array, so it cannot say more than the page.
  const faqs: Array<{ q: string; a: string; more?: { href: string; label: string } }> = [
    {
      q: "Which doctor should I see if I am not sure which specialist I need?",
      a: "Usually a general physician. They diagnose and treat common illness across the whole body, manage long-term conditions such as blood pressure and diabetes, and decide when a specialist is needed. Starting there is usually faster and cheaper than guessing which specialist to book. If it feels like an emergency, call 108 instead.",
      more: { href: paths.specialty("general-practice"), label: "General physicians" },
    },
    {
      q: "What is the difference between a psychiatrist and a psychologist?",
      a: "A psychiatrist is a medical doctor who diagnoses and treats mental illness and can prescribe medication. A clinical psychologist treats with talking therapy and structured programmes, such as cognitive behavioural therapy, and does psychometric testing; they do not prescribe, and work alongside a psychiatrist where medication is needed. Clinical psychologists in India are registered with the Rehabilitation Council of India.",
      more: { href: paths.specialty("clinical-psychology"), label: "Clinical psychologists" },
    },
    {
      q: "Should I see a neurologist or a neurosurgeon?",
      a: "A neurologist diagnoses and treats disorders of the brain, spinal cord, nerves and muscles — stroke, epilepsy, migraine, Parkinson's disease, neuropathy and memory loss — with medication and rehabilitation. A neurosurgeon operates, for tumours, head and spinal injury, slipped discs and hydrocephalus. Most people see a neurologist first.",
      more: { href: paths.specialty("neurology"), label: "Neurologists" },
    },
    {
      q: "Are dentists, AYUSH practitioners and physiotherapists checked the same way as doctors?",
      a: "No. Each is checked against its own register. Modern-medicine doctors are registered with the National Medical Commission and the state medical councils; dentists with the dental councils; Ayurveda, Unani and Siddha practitioners with the NCISM; homoeopaths with the NCH; and allied health professionals with their own bodies. Every profile names its own register and says whether the number has been checked there, rather than showing one generic badge.",
      more: { href: paths.registers(), label: "All registers" },
    },
    {
      q: "What do 'listed' and 'verified' mean on this page?",
      a: `Listed counts every published profile in that speciality — ${fmt(totalListed)} across all of them today. Verified counts the profiles that have passed every check in the verification policy, including a registration checked against the register — ${fmt(totalVerified)} so far. Each profile says exactly which checks it has passed and which are still pending.`,
      more: { href: paths.policy("verification"), label: "How verification works" },
    },
    {
      q: "Is the guidance on these pages medically reviewed?",
      a: `Only where it says so. ${reviewed} of the ${SPECIALTY_KEYS.length} speciality pages carry guidance signed off by a named clinician, with the date of that review. The rest carry plain-language guidance written for this site that has not yet been reviewed by a clinician. None of it replaces a consultation.`,
    },
    {
      q: "Can a doctor pay to appear higher in these lists?",
      a: "No. Organic ranking is never for sale, and basic profiles are permanently free. The ranking policy sets out what does decide the order.",
      more: { href: paths.policy("ranking"), label: "How ranking works" },
    },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Speciality index",
          title: "Doctors by speciality in India | The Doctor Index",
          h1: TITLE,
          canonical: absoluteUrl("/specialties"),
          index: true,
          structuredData: "CollectionPage (ItemList) › FAQPage, BreadcrumbList",
          notes: [
            { label: "Whole card is the link", text: "The speciality name is the card's one link, stretched over the card; the 'When to consult' chip sits above it and stays separately clickable." },
            { label: "Counts live", text: "Listed and verified counts are live queries, cached for an hour. A zero verified count prints nothing." },
            { label: "Reviewed count", text: "Counts entries with a reviewedOn date, not entries with guidance. Never report guidance as reviewed without a named sign-off." },
          ],
        }}
      />
      <JsonLd
        data={[
          collectionLd({
            name: "Doctors by speciality in India",
            path: "/specialties",
            description: DESCRIPTION,
            items: groups.flatMap((g) => g.keys).map((k) => ({ name: SPECIALTIES[k].plural, path: paths.specialty(k) })),
          }),
          faqLd("/specialties", faqs.map(({ q, a }) => ({ q, a }))),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <header className="posthead">
          <span className="eyebrow">Browse by speciality · {SPECIALTY_KEYS.length} specialities</span>
          <h1>{TITLE}</h1>
          <p className="standfirst">
            {fmt(totalListed)} practising doctors and health professionals across India, grouped by the kind of care they give. Each
            speciality page says what that specialist treats, when people usually see one, and which cities have them — and every
            profile names the register its practitioner is on, and whether that has been checked yet. Modern medicine, dental, AYUSH and allied health are
            kept apart, because each answers to a different regulator.
          </p>
        </header>

        <div className="notice" style={{ maxWidth: "70ch" }}>
          <b>Not sure where to start?</b> A <Link href={paths.specialty("general-practice")}>general physician</Link> sees
          everything first and refers on when a specialist is needed. For chest pain, sudden weakness or anything that feels like an
          emergency, call <b>108</b> — this is a directory, not an emergency service.
        </div>

        <nav className="spec-jump" aria-label="Jump to a department">
          <ul className="regchips">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`}>{g.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        {groups.map((g) => (
          <section key={g.id} className="reggroup" aria-labelledby={g.id}>
            <h2 id={g.id}>{g.name}</h2>
            {DEPARTMENT_BLURB[g.name] ? <p>{DEPARTMENT_BLURB[g.name]}</p> : null}
            <div className="reggrid">
              {g.keys.map((k) => {
                const s = SPECIALTIES[k];
                const guide = guideForSpecialty(k);
                const v = verified[k] ?? 0;
                const l = listed[k] ?? 0;
                return (
                  <article key={k} className="guide stretch">
                    <div className="eyebrow">{s.plural}</div>
                    <h3 className="t">
                      <Link href={paths.specialty(k)}>{s.name}</Link>
                    </h3>
                    <p className="d">{s.guide ? `${s.guide.split(". ")[0].replace(/\.$/, "")}.` : `${s.plural} listed by city; guidance under review.`}</p>
                    <div className="m">
                      {l ? `${fmt(l)} listed` : "None listed yet"}
                      {v ? ` · ${fmt(v)} verified` : ""}
                    </div>
                    {s.aliases.length ? <div className="m">Also searched as: {s.aliases.slice(0, 3).join(", ")}</div> : null}
                    {guide ? (
                      <div className="quick" style={{ marginTop: "2px" }}>
                        <Link className="chip" href={`/health-guides/${guide.slug}`}>
                          When to consult {s.aOne}
                        </Link>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="reggroup" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Questions about choosing a specialist</h2>
          <div className="spec-faq">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>
                  {f.a}
                  {f.more ? (
                    <>
                      {" "}
                      <Link href={f.more.href}>{f.more.label} →</Link>
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
