import Link from "next/link";

import { importPublicationsAction } from "@/app/dashboard/publication-actions";
import { ActionForm } from "@/components/ActionForm";
import { getDashboardContext } from "@/lib/dashboard";
import { fetchOrcidWorks, parseOrcidId, pubmedAuthor, searchPubmed, withoutExisting, type FoundPaper } from "@/lib/publications";

export const metadata = { title: "Find your publications" };
export const dynamic = "force-dynamic";

/**
 * Search PubMed (by author name, narrowed by affiliation) or ORCID (by iD),
 * then tick the papers to add. Added papers are self-reported publications,
 * exactly as if typed by hand: a name match on PubMed is not proof of authorship.
 */
export default async function DashboardPublications({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { doctor, asManager } = await getDashboardContext();
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const author = one("author") || pubmedAuthor(doctor.name);
  const aff = sp.aff === undefined ? "India" : one("aff");
  const orcidRaw = one("orcid");
  const source = orcidRaw ? "orcid" : one("author") || sp.go ? "pubmed" : null;

  let papers: FoundPaper[] = [];
  let total = 0;
  let error: string | null = null;
  if (!asManager && source === "pubmed" && author) {
    try {
      const r = await searchPubmed(author, aff);
      total = r.total;
      papers = r.papers;
    } catch (e) {
      error = `PubMed did not answer (${e instanceof Error ? e.message : "error"}). Try again in a minute.`;
    }
  } else if (!asManager && source === "orcid") {
    const id = parseOrcidId(orcidRaw);
    if (!id) error = "That is not a valid ORCID iD. It looks like 0000-0002-1825-0097.";
    else {
      try {
        papers = await fetchOrcidWorks(id);
        total = papers.length;
      } catch (e) {
        error = `ORCID did not answer (${e instanceof Error ? e.message : "error"}). Check the iD is public.`;
      }
    }
  }
  const already = doctor.credentials.filter((c) => c.kind === "publication");
  const fresh = withoutExisting(papers, already.map((c) => ({ title: c.title, url: c.url })));

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Find your publications</h1>
          <div className="sub">Search PubMed or your ORCID record and tick your papers. They appear on your profile as publications you supplied, with a link readers can check.</div>
        </div>
        <Link className="btn quiet" href="/dashboard/profile">Back to profile</Link>
      </div>

      {asManager ? <div className="notice">Clinic managers cannot edit credentials.</div> : (
        <>
          <div className="two" style={{ marginBottom: "16px" }}>
            <form className="panel pad" method="get">
              <input type="hidden" name="go" value="1" />
              <div className="eyebrow">PubMed</div>
              <div className="field">
                <label htmlFor="p-author">Author as PubMed lists it</label>
                <input id="p-author" name="author" defaultValue={author} placeholder="Rao AK" />
                <div className="hint">Surname then initials, e.g. <span className="mono">Rao AK</span>.</div>
              </div>
              <div className="field">
                <label htmlFor="p-aff">Affiliation words</label>
                <input id="p-aff" name="aff" defaultValue={aff} placeholder="India, Bengaluru, Manipal" />
                <div className="hint">Comma-separated; all must match. Add a city or institution if the list is long.</div>
              </div>
              <button className="btn solid" type="submit">Search PubMed</button>
            </form>
            <form className="panel pad" method="get">
              <div className="eyebrow">ORCID</div>
              <div className="field">
                <label htmlFor="p-orcid">Your ORCID iD</label>
                <input id="p-orcid" name="orcid" defaultValue={orcidRaw} placeholder="0000-0002-1825-0097" />
                <div className="hint">The most reliable route: only your own works are listed.</div>
              </div>
              <button className="btn solid" type="submit">Load from ORCID</button>
            </form>
          </div>

          {error ? <div className="notice alert">{error}</div> : null}

          {source && !error ? (
            fresh.length === 0 ? (
              <div className="panel pad" style={{ color: "var(--muted)" }}>
                {papers.length ? "Everything found is already on your profile." : "Nothing found. Try fewer affiliation words, or your ORCID iD."}
              </div>
            ) : (
              <ActionForm action={importPublicationsAction} submitLabel="Add ticked papers to my profile" className="stack">
                <div className="sub" style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {source === "pubmed" && total > papers.length ? `${total.toLocaleString("en-IN")} matches; showing the ${papers.length} most recent. Narrow the affiliation if yours are not here. ` : ""}
                  Tick only papers you wrote — other doctors share names on PubMed.
                </div>
                <div className="rows">
                  {fresh.map((p) => (
                    <label key={p.key} className="fopt" style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 14px", borderBottom: "1px solid var(--hair)" }}>
                      <input type="checkbox" name="paper" value={JSON.stringify({ title: p.title, journal: p.journal, year: p.year, url: p.url })} defaultChecked={source === "orcid"} style={{ marginTop: "4px" }} />
                      <span>
                        <b>{p.title}</b>
                        <span style={{ display: "block", fontSize: "13.5px", color: "var(--muted)" }}>
                          {[p.authors.join(", "), p.journal, p.year].filter(Boolean).join(" · ")}
                          {p.url ? <> · <a href={p.url} target="_blank" rel="noopener">source</a></> : null}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </ActionForm>
            )
          ) : null}
        </>
      )}
    </>
  );
}
