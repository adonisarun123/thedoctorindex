import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody, Contents, FaqList } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { anchorId } from "@/lib/blog/types";
import { plain } from "@/lib/content/text";
import { qualificationProfile, type QualificationProfile } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { QUALIFICATIONS, QUALIFICATION_GROUPS, abbrWithArticle, branchesOf, qualificationBySlug, qualificationWordCount, relatedQualifications, tidyBranch, type QualificationEntry } from "@/lib/qualifications";
import { registerBySlug } from "@/lib/registers";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, faqLd, isoDate } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

/** Counts on the page are live; prerendered, then refreshed hourly. */
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return QUALIFICATIONS.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const q = qualificationBySlug((await params).slug);
  if (!q) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: `${q.abbr}: what it means`,
    ogTitle: `What ${abbrWithArticle(q.abbr)} means on a doctor's profile`,
    description: q.standfirst,
    path: paths.qualification(q.slug),
    type: "article",
    article: { publishedTime: isoDate(q.checkedOn), modifiedTime: isoDate(q.checkedOn), authors: [absoluteUrl("/about")], section: "Qualifications" },
  });
}

const fmt = (n: number) => n.toLocaleString("en-IN");

function qualificationLd(q: QualificationEntry, p: QualificationProfile) {
  const url = absoluteUrl(paths.qualification(q.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `What ${abbrWithArticle(q.abbr)} means on a doctor's profile`,
    description: q.standfirst,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-IN",
    datePublished: isoDate(q.checkedOn),
    dateModified: isoDate(q.checkedOn),
    wordCount: qualificationWordCount(q),
    author: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    about: { "@type": "EducationalOccupationalCredential", name: q.name, alternateName: q.abbr, credentialCategory: q.kind === "diploma" ? "diploma" : q.kind === "membership" || q.kind === "fellowship" ? "certificate" : "degree", recognizedBy: { "@type": "Organization", name: q.awardedBy } },
    ...(p.total ? { mentions: { "@type": "Dataset", name: `Profiles on ${SITE.name} recording ${q.abbr}`, description: `${fmt(p.total)} published doctors, ${fmt(p.checked)} with the qualification checked against the awarding body.` } } : {}),
  };
}

async function Measured({ q, p }: { q: QualificationEntry; p: QualificationProfile }) {
  if (!p.total) return null;
  const geo = await getGeo();
  const cities = p.cities.map((c) => ({ ...c, city: geo.city(c.stateSlug, c.citySlug) })).filter((c) => c.city).slice(0, 6);
  const specs = p.specialties.map((s) => ({ ...s, spec: specialtyByKey(s.name) })).filter((s) => s.spec).slice(0, 6);
  const branches = p.branches.filter((b) => b.n >= 5).slice(0, 8);
  const share = Math.round((p.checked / p.total) * 100);
  return (
    <section className="panel pad" aria-labelledby="measured-heading" style={{ margin: "26px 0" }}>
      <div className="eyebrow">Measured on this site</div>
      <h2 id="measured-heading" style={{ marginTop: "6px" }}>
        {fmt(p.total)} doctors record {abbrWithArticle(q.abbr)}
      </h2>
      <p className="blocklede">
        {p.checked ? `${fmt(p.checked)} of them (${share}%) have the qualification checked against the awarding body` : "None of them has the qualification checked against the awarding body yet"}
        {p.withYear ? `; ${fmt(p.withYear)} record the year it was awarded${p.earliestYear && p.latestYear ? `, from ${p.earliestYear} to ${p.latestYear}` : ""}` : ""}.{" "}
        {p.checked ? "The rest are recorded as supplied. " : "All are recorded as supplied. "}Counts are read from the live database and refresh hourly.
      </p>
      {branches.length ? (
        <>
          <h3>Branches as written on profiles</h3>
          <div className="tablewrap regtable">
            <table>
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Doctors</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr key={b.name}>
                    <td data-h="Branch">{tidyBranch(b.name)}</td>
                    <td data-h="Doctors">{fmt(b.n)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {p.institutions.length ? (
        <>
          <h3>Awarding institutions most often recorded</h3>
          <ul className="regchips">
            {p.institutions.map((i) => (
              <li key={i.name}>
                <span className="chip" style={{ cursor: "default" }}>
                  {i.name} · {fmt(i.n)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {specs.length ? (
        <>
          <h3>Specialities they practise</h3>
          <ul className="regchips">
            {specs.map((s) => (
              <li key={s.name}>
                <Link href={paths.specialty(s.spec!.key)}>
                  {s.spec!.plural} · {fmt(s.n)}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {cities.length ? (
        <>
          <h3>Where they practise</h3>
          <ul className="regchips">
            {cities.map((c) => (
              <li key={`${c.stateSlug}/${c.citySlug}`}>
                <Link href={`/doctors/${c.stateSlug}/${c.citySlug}`}>
                  {c.city!.name} · {fmt(c.n)}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export default async function QualificationPage({ params }: { params: Promise<Params> }) {
  const q = qualificationBySlug((await params).slug);
  if (!q) notFound();

  const profile = await qualificationProfile(q.pattern);
  const group = QUALIFICATION_GROUPS.find((g) => g.kind === q.kind);
  const register = registerBySlug(q.registerSlug);
  const parent = q.parent ? qualificationBySlug(q.parent) : null;
  const branches = branchesOf(q.slug);
  const specialty = q.specialty ? specialtyByKey(q.specialty) : null;
  const path = paths.qualification(q.slug);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Qualifications", path: paths.qualifications() },
    ...(parent ? [{ name: parent.abbr, path: paths.qualification(parent.slug) }] : []),
    { name: q.abbr, path },
  ];
  const related = relatedQualifications(q);
  const contents = [
    ...q.body.filter((b): b is Extract<typeof b, { k: "h2" }> => b.k === "h2").map((b) => ({ id: anchorId(b.text), text: plain(b.text) })),
    ...(profile.total ? [{ id: "measured-heading", text: "Measured on this site" }] : []),
  ];
  const cta = specialty ? { href: paths.specialty(specialty.key), label: `Find ${specialty.plural.toLowerCase()}` } : { href: "/doctors", label: "Browse doctors" };

  return (
    <>
      <RouteMeta
        data={{
          route: "Qualification",
          title: `${q.abbr}: what it means | ${SITE.name}`,
          h1: `What ${abbrWithArticle(q.abbr)} means on a doctor's profile`,
          canonical: absoluteUrl(path),
          index: true,
          structuredData: "Article (about: EducationalOccupationalCredential) › FAQPage, BreadcrumbList",
          lastmod: q.checkedOn,
          notes: [
            { label: "Counts live", text: `One query matching the pattern ${q.pattern} against normalised degree strings, cached for an hour. Zero prints nothing.` },
            { label: "Facts dated", text: `Length, entry route and awarding body were checked against the sources listed on ${q.checkedOn}.` },
          ],
        }}
      />
      <JsonLd data={[qualificationLd(q, profile), faqLd(path, q.faqs.map((f) => ({ q: plain(f.q), a: plain(f.a) }))), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <article className="wrap post">
        <header className="posthead">
          <span className="eyebrow">
            <Link href={paths.qualifications()}>Qualifications</Link> · {group?.name ?? q.kind} · facts checked {q.checkedOn}
          </span>
          <h1>What {abbrWithArticle(q.abbr)} means on a doctor&apos;s profile</h1>
          <p className="standfirst">{q.standfirst}</p>
        </header>

        <div className="postgrid">
          <div className="postbody doc">
            {q.kind === "membership" ? (
              <div className="notice">
                <b>Not a degree.</b> {q.abbr} records membership of a body. It is shown on profiles here after the qualifications, never in place of one.
              </div>
            ) : null}

            <ArticleBody blocks={q.body} />

            <Measured q={q} p={profile} />

            {branches.length ? (
              <section aria-labelledby="branches-heading">
                <h2 id="branches-heading">Branches with their own page</h2>
                <ul>
                  {branches.map((b) => (
                    <li key={b.slug}>
                      <Link href={paths.qualification(b.slug)}>{b.abbr}</Link> — {b.name}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <FaqList faqs={q.faqs} />

            <div className="endcta">
              <div>
                <div className="eyebrow">On this site</div>
                <p>
                  Every profile lists its qualifications as supplied and says which of them have been checked against the awarding body and
                  when. Where none has, the profile says so.
                </p>
              </div>
              <Link className="btn" href={cta.href}>
                {cta.label}
              </Link>
            </div>

            <p className="postfoot">
              General information about medical qualifications in India, checked against the sources listed on {q.checkedOn}. Not advice
              about your situation. Errors can be reported through the <Link href={paths.policy("corrections")}>corrections process</Link>.
            </p>
          </div>

          <aside className="rail" aria-label="About this qualification">
            <div className="railcard">
              <div className="eyebrow">{q.abbr}</div>
              <dl className="railmeta">
                <div>
                  <dt>Full name</dt>
                  <dd>{q.name}</dd>
                </div>
                <div>
                  <dt>Kind</dt>
                  <dd>{group?.name ?? q.kind}</dd>
                </div>
                <div>
                  <dt>Awarded by</dt>
                  <dd>{q.awardedBy}</dd>
                </div>
                {q.duration ? (
                  <div>
                    <dt>Length</dt>
                    <dd>{q.duration}</dd>
                  </div>
                ) : null}
                {q.entry ? (
                  <div>
                    <dt>Entry</dt>
                    <dd>{q.entry}</dd>
                  </div>
                ) : null}
                {register ? (
                  <div>
                    <dt>Register</dt>
                    <dd>
                      <Link href={paths.register(register.slug)}>{register.short ?? register.name}</Link>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Facts checked</dt>
                  <dd>{q.checkedOn}</dd>
                </div>
              </dl>
            </div>

            <Contents items={contents} />

            {q.sources.length ? (
              <div className="railcard">
                <div className="eyebrow">Sources</div>
                <ul className="raillist">
                  {q.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} rel="noopener nofollow" target="_blank">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="railcard railcta">
              <div className="eyebrow">The directory</div>
              <p>Doctors by city and speciality, each showing which facts were checked and when.</p>
              <Link className="btn" href={cta.href}>
                {cta.label}
              </Link>
              <Link className="plainlink" href="/blog/how-to-spot-a-fake-doctor-in-india">
                How to spot a fake doctor →
              </Link>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="readnext" aria-labelledby="related-heading">
            <div className="section-head">
              <h2 id="related-heading">Related qualifications</h2>
              <Link href={paths.qualifications()}>All qualifications</Link>
            </div>
            <div className="guidegrid">
              {related.map((x) => (
                <Link key={x.slug} className="guide" href={paths.qualification(x.slug)}>
                  <div className="eyebrow">{QUALIFICATION_GROUPS.find((g) => g.kind === x.kind)?.name ?? x.kind}</div>
                  <div className="t">{x.abbr}</div>
                  <div className="d">{x.standfirst}</div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
