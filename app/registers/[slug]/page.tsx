import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody, Contents, FaqList } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { anchorId } from "@/lib/blog/types";
import { plain } from "@/lib/content/text";
import { registerProfile, type RegisterProfile } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { REGISTERS, REGISTER_GROUPS, registerBySlug, registerWordCount, relatedRegisters, withArticle, type RegisterEntry } from "@/lib/registers";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, faqLd, isoDate } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

/** Counts on the page are live; prerendered, then refreshed hourly. */
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return REGISTERS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = registerBySlug((await params).slug);
  if (!r) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: `${r.short ? `${r.short} registration check` : `${r.name} registration check`}`,
    ogTitle: `How to check ${withArticle(r.short ?? r.name)} registration`,
    description: r.standfirst,
    path: paths.register(r.slug),
    type: "article",
    article: { publishedTime: isoDate(r.checkedOn), modifiedTime: isoDate(r.checkedOn), authors: [absoluteUrl("/about")], section: "Registers" },
  });
}

const fmt = (n: number) => n.toLocaleString("en-IN");

function registerLd(r: RegisterEntry, profile: RegisterProfile) {
  const url = absoluteUrl(paths.register(r.slug));
  const about: Record<string, unknown> = {
    "@type": r.kind === "allied" && r.slug === "indian-association-of-physiotherapists" ? "Organization" : "GovernmentOrganization",
    name: r.name,
    ...(r.website ? { url: r.website } : {}),
    ...(r.office ? { address: r.office } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `How to check ${withArticle(r.short ?? r.name)} registration`,
    description: r.standfirst,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-IN",
    datePublished: isoDate(r.checkedOn),
    dateModified: isoDate(r.checkedOn),
    wordCount: registerWordCount(r),
    author: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    about,
    ...(profile.total ? { mentions: { "@type": "Dataset", name: `Profiles on ${SITE.name} citing the ${r.name}`, description: `${fmt(profile.total)} published profiles, ${fmt(profile.registerChecked)} checked against a register.` } } : {}),
  };
}

/** The measured block: what the profiles on this site say about this register. Prints nothing for a zero. */
async function Measured({ r, p }: { r: RegisterEntry; p: RegisterProfile }) {
  if (!p.total) return null;
  const geo = await getGeo();
  const short = r.short ?? r.name;
  const cities = p.cities
    .map((c) => ({ ...c, city: geo.city(c.stateSlug, c.citySlug) }))
    .filter((c) => c.city)
    .slice(0, 6);
  const specs = p.specialties.map((s) => ({ ...s, spec: specialtyByKey(s.name) })).filter((s) => s.spec).slice(0, 6);
  const checkedShare = Math.round((p.registerChecked / p.total) * 100);
  return (
    <section className="panel pad" aria-labelledby="measured-heading" style={{ margin: "26px 0" }}>
      <div className="eyebrow">Measured on this site</div>
      <h2 id="measured-heading" style={{ marginTop: "6px" }}>
        {fmt(p.total)} profiles cite the {short}
      </h2>
      <p className="blocklede">
        {fmt(p.registerChecked)} of them ({checkedShare}%) have had that number checked against a register
        {p.withYear ? `; ${fmt(p.withYear)} record a year of registration${p.earliestYear && p.latestYear ? `, from ${p.earliestYear} to ${p.latestYear}` : ""}` : ""}.
        The rest are recorded as supplied. Counts are read from the live database and refresh hourly.
      </p>
      {p.shapes.length ? (
        <>
          <h3>Number formats seen</h3>
          <div className="tablewrap regtable"><table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Example</th>
                <th>Profiles</th>
              </tr>
            </thead>
            <tbody>
              {p.shapes.map((s) => (
                <tr key={s.shape}>
                  <td data-h="Pattern">
                    <code>{s.shape}</code>
                  </td>
                  <td data-h="Example">
                    <code>{s.sample}</code>
                  </td>
                  <td data-h="Profiles">{fmt(s.n)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <p className="blocknote">A = any letter, 9 = any digit. A number that fits none of these is not necessarily wrong; it is worth looking at twice.</p>
        </>
      ) : null}
      {specs.length ? (
        <>
          <h3>Specialities</h3>
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

export default async function RegisterPage({ params }: { params: Promise<Params> }) {
  const r = registerBySlug((await params).slug);
  if (!r) notFound();

  const [profile, geo] = await Promise.all([registerProfile(r.match), getGeo()]);
  const group = REGISTER_GROUPS.find((g) => g.kind === r.kind);
  const path = paths.register(r.slug);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Registers", path: paths.registers() },
    { name: r.short ?? r.name, path },
  ];
  const related = relatedRegisters(r);
  const stateLink = r.state && geo.state(r.state.slug) ? `/doctors/${r.state.slug}` : null;
  const contents = [
    ...r.body.filter((b): b is Extract<typeof b, { k: "h2" }> => b.k === "h2").map((b) => ({ id: anchorId(b.text), text: plain(b.text) })),
    ...(profile.total ? [{ id: "measured-heading", text: `Measured on this site` }] : []),
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Register",
          title: `${r.short ?? r.name} registration check | ${SITE.name}`,
          h1: `How to check ${withArticle(r.short ?? r.name)} registration`,
          canonical: absoluteUrl(path),
          index: true,
          structuredData: "Article (about: GovernmentOrganization) › FAQPage, BreadcrumbList",
          lastmod: r.checkedOn,
          notes: [
            { label: "Facts dated", text: `Office, website and search page were read from the sources listed on ${r.checkedOn}. A field we could not verify is omitted, never guessed.` },
            { label: "Counts live", text: "The measured block is one query against the production database, cached for an hour. Zero prints nothing." },
          ],
        }}
      />
      <JsonLd data={[registerLd(r, profile), faqLd(path, r.faqs.map((f) => ({ q: plain(f.q), a: plain(f.a) }))), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <article className="wrap post">
        <header className="posthead">
          <span className="eyebrow">
            <Link href={paths.registers()}>Registers</Link> · {group?.name ?? r.kind} · facts checked {r.checkedOn}
          </span>
          <h1>How to check {withArticle(r.short ?? r.name)} registration</h1>
          <p className="standfirst">{r.standfirst}</p>
        </header>

        <div className="postgrid">
          <div className="postbody doc">
            {!r.onNmcRegister ? (
              <div className="notice">
                <b>Not on the NMC register.</b> {r.name} registrations are for {r.profession} and are not searchable on the National Medical
                Commission&apos;s Indian Medical Register. The automated check on this site does not cover them.
              </div>
            ) : null}

            <ArticleBody blocks={r.body} />

            <Measured r={r} p={profile} />

            <FaqList faqs={r.faqs} />

            <div className="endcta">
              <div>
                <div className="eyebrow">On this site</div>
                <p>
                  Every profile names the registering body and the number as supplied, and says whether that number has been checked against a
                  register and when. Where it has not, the profile says so.
                </p>
              </div>
              <Link className="btn" href={stateLink ?? "/doctors"}>
                {stateLink ? `Doctors in ${r.state!.name}` : "Browse doctors"}
              </Link>
            </div>

            <p className="postfoot">
              General information about how registration works in India, read from the sources below on {r.checkedOn}. Not advice about your
              situation. Errors can be reported through the <Link href={paths.policy("corrections")}>corrections process</Link>.
            </p>
          </div>

          <aside className="rail" aria-label="About this register">
            <div className="railcard">
              <div className="eyebrow">{r.name}</div>
              <dl className="railmeta">
                {r.office ? (
                  <div>
                    <dt>Office</dt>
                    <dd>{r.office}</dd>
                  </div>
                ) : null}
                {r.website ? (
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <a href={r.website} rel="noopener nofollow" target="_blank">
                        {r.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {r.search ? (
                  <div>
                    <dt>Public search</dt>
                    <dd>
                      <a href={r.search.url} rel="noopener nofollow" target="_blank">
                        Open the register search
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Registers</dt>
                  <dd>{r.profession}</dd>
                </div>
                <div>
                  <dt>On the NMC register</dt>
                  <dd>{r.onNmcRegister ? "Yes — search it there" : "No"}</dd>
                </div>
                <div>
                  <dt>Facts checked</dt>
                  <dd>{r.checkedOn}</dd>
                </div>
              </dl>
            </div>

            <Contents items={contents} />

            {r.sources.length ? (
              <div className="railcard">
                <div className="eyebrow">Sources</div>
                <ul className="raillist">
                  {r.sources.map((s) => (
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
              <Link className="btn" href={stateLink ?? "/doctors"}>
                {stateLink ? `Doctors in ${r.state!.name}` : "Browse doctors"}
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
              <h2 id="related-heading">Related registers</h2>
              <Link href={paths.registers()}>All registers</Link>
            </div>
            <div className="guidegrid">
              {related.map((x) => (
                <Link key={x.slug} className="guide" href={paths.register(x.slug)}>
                  <div className="eyebrow">{REGISTER_GROUPS.find((g) => g.kind === x.kind)?.name ?? x.kind}</div>
                  <div className="t">{x.name}</div>
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
