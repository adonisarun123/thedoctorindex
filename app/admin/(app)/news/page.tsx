import Link from "next/link";

import { decideStoryAction, editStoryAction, linkDoctorAction, publishDueAction } from "@/app/admin/news-actions";
import { ActionForm } from "@/components/ActionForm";
import { ArticleBody } from "@/components/ArticleBody";
import { parseArticleBody } from "@/lib/articles/format";
import { requireStaff } from "@/lib/auth/session";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { instagramCaption } from "@/lib/news/caption";
import { CAROUSEL_SLIDES } from "@/lib/news/card";
import { NEWS_BUFFER_MIN, NEWS_CATEGORIES, NEWS_DAILY_MAX, independentSourceCount, istDateTime } from "@/lib/news/format";
import { type QueueView, listNewsQueue, newsCounts, storyNumbers, storySources } from "@/lib/services/news";
import { paths } from "@/lib/site";

export const metadata = { title: "Newsroom" };

const VIEWS: Array<{ key: QueueView; label: string }> = [
  { key: "review", label: "Needs review" },
  { key: "buffer", label: "Buffer (approved)" },
  { key: "published", label: "Published" },
  { key: "rejected", label: "Rejected / withdrawn" },
];

/**
 * The TDi Newsdesk queue. Drafts the pipeline could not auto-approve wait in
 * "Needs review"; approved stories wait in the buffer for a daily slot
 * (NEWS_DAILY_MAX per IST day). Staff may edit our copy; a change to a live
 * story needs a correction note, which the page prints.
 */
export default async function AdminNews({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff("content_editor");
  const v = (await searchParams).view;
  const view: QueueView = VIEWS.some((x) => x.key === v) ? (v as QueueView) : "review";
  const [rows, counts] = await Promise.all([listNewsQueue(view), newsCounts()]);
  const run = counts.lastRun;
  const report = (run?.report ?? null) as Record<string, unknown> | null;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Newsroom</h1>
          <div className="sub">
            Auto-publish needs 2+ independent sources, a matched TDi profile and a passed claims check. Up to {NEWS_DAILY_MAX} stories go live per IST day from the buffer. Check before approving: every highlight and number appears in a source; no superlatives in our voice; no patient-identifying detail; the right profile is linked.
          </div>
        </div>
        <ActionForm action={publishDueAction} submitLabel="Fill today's slots now" variant="quiet" />
      </div>

      <div className="panel pad" style={{ display: "flex", gap: "28px", flexWrap: "wrap", marginBottom: "14px" }}>
        <div><div className="eyebrow">Needs review</div><b style={{ fontSize: "22px" }}>{counts.review}</b></div>
        <div><div className="eyebrow">Buffer</div><b style={{ fontSize: "22px", color: counts.buffer < NEWS_BUFFER_MIN ? "var(--alert)" : undefined }}>{counts.buffer}</b>{counts.buffer < NEWS_BUFFER_MIN ? <span style={{ color: "var(--alert)", fontSize: "14px" }}> below {NEWS_BUFFER_MIN}</span> : null}</div>
        <div><div className="eyebrow">Published today (IST)</div><b style={{ fontSize: "22px" }}>{counts.today} / {NEWS_DAILY_MAX}</b></div>
        <div>
          <div className="eyebrow">Last pipeline run</div>
          {run ? (
            <span style={{ color: run.ok === false ? "var(--alert)" : undefined }}>
              {istDateTime(run.startedAt)} · {run.ok === false ? `failed: ${run.error}` : run.ok ? `ok${report ? ` · ${report.drafted ?? 0} drafted, ${report.autoApproved ?? 0} auto-approved, ${report.published ?? 0} published` : ""}` : "running"}
            </span>
          ) : (
            <span style={{ color: "var(--muted)" }}>never</span>
          )}
        </div>
      </div>

      <nav className="newscats" aria-label="Queue">
        {VIEWS.map((x) => (
          <Link key={x.key} href={`/admin/news?view=${x.key}`} aria-current={view === x.key ? "page" : undefined}>{x.label}</Link>
        ))}
      </nav>

      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Nothing here.</div> : null}
      {rows.map((st) => {
        const sources = storySources(st);
        const numbers = storyNumbers(st);
        const ver = st.verification as { ok: boolean; checked: number; unsupported: string[] } | null;
        const primary = st.doctors.find((d) => d.primary);
        const sp = st.specialtyKey ? SPECIALTIES[st.specialtyKey as keyof typeof SPECIALTIES] : null;
        return (
          <div className="qcard" id={st.id} key={st.id}>
            <div className="qh">
              <div>
                <div className="qt">{st.headline}</div>
                <div className="qm">
                  {NEWS_CATEGORIES[st.category as keyof typeof NEWS_CATEGORIES]?.label ?? st.category} · {st.subjectName}{st.place ? `, ${st.place}` : ""}{st.abroad ? " (abroad)" : ""} · {independentSourceCount(sources)} independent source(s) · {st.origin} · created {istDateTime(st.createdAt)}
                  {st.publishedAt ? <> · live {istDateTime(st.publishedAt)} · <Link href={paths.newsStory(st.slug)} target="_blank">/news/{st.slug}</Link></> : null}
                </div>
              </div>
              <span className={`pill ${st.status === "published" ? "ok" : st.status === "approved" ? "ok" : st.status === "draft" ? "wait" : "neut"}`}>{st.status === "approved" ? "buffer" : st.status}</span>
            </div>

            <dl className="kvi">
              {st.gateNotes.length ? <><dt>Why it needs review</dt><dd><ul style={{ margin: 0, paddingLeft: "18px" }}>{st.gateNotes.map((n) => <li key={n}>{n}</li>)}</ul></dd></> : null}
              <dt>Claims check</dt>
              <dd>{ver ? (ver.ok ? `Passed (${ver.checked} statements)` : <span style={{ color: "var(--alert)" }}>Unsupported: {ver.unsupported.join(" · ")}</span>) : "Not run (staff story)"}</dd>
              <dt>Profile</dt>
              <dd>
                {st.doctors.length ? st.doctors.map((d) => (
                  <span key={d.id} style={{ marginRight: "12px" }}>
                    <Link href={`/admin/doctors/${d.id}`}>{d.name}</Link> ({d.primary ? "primary" : "mentioned"}{d.registrationChecked ? ", reg. checked" : ""})
                  </span>
                )) : <span style={{ color: "var(--muted)" }}>None linked</span>}
              </dd>
              <dt>Standfirst</dt>
              <dd>{st.dek}</dd>
              <dt>Highlights</dt>
              <dd><ol style={{ margin: 0, paddingLeft: "18px" }}>{st.highlights.map((h) => <li key={h}>{h}</li>)}</ol></dd>
              {numbers.length ? <><dt>By the numbers</dt><dd>{numbers.map((n) => `${n.value} — ${n.label}`).join(" · ")}</dd></> : null}
              <dt>Why it matters</dt>
              <dd>{st.whyItMatters}</dd>
              <dt>Sources</dt>
              <dd><ol style={{ margin: 0, paddingLeft: "18px" }}>{sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener nofollow">{s.title}</a> — {s.publisher}{s.publishedOn ? `, ${s.publishedOn}` : ""}</li>)}</ol></dd>
              {st.reviewerNote ? <><dt>Note</dt><dd>{st.reviewerNote}</dd></> : null}
              {st.correction ? <><dt>Correction shown</dt><dd>{st.correction}</dd></> : null}
            </dl>

            <details style={{ margin: "8px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: "14px" }}>Read the story</summary>
              <div className="doc" style={{ marginTop: "10px", maxHeight: "520px", overflow: "auto", border: "1px solid var(--hair)", borderRadius: "8px", padding: "12px 16px" }}>
                <ArticleBody blocks={parseArticleBody(st.body)} />
              </div>
            </details>

            <details style={{ margin: "8px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: "14px" }}>Edit{st.status === "published" ? " (needs a correction note)" : ""}</summary>
              <ActionForm action={editStoryAction} submitLabel="Save changes" variant="solid" style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={st.id} />
                <div className="field"><label>Headline</label><input name="headline" defaultValue={st.headline} /></div>
                <div className="field"><label>Standfirst</label><textarea name="dek" rows={2} defaultValue={st.dek} /></div>
                {[0, 1, 2].map((i) => (
                  <div className="field" key={i}><label>Highlight {i + 1}</label><input name={`h${i + 1}`} defaultValue={st.highlights[i] ?? ""} /></div>
                ))}
                <div className="field"><label>Why it matters for patients</label><textarea name="whyItMatters" rows={3} defaultValue={st.whyItMatters} /></div>
                <div className="field"><label>By the numbers (one per line: value | label)</label><textarea name="numbers" rows={3} defaultValue={numbers.map((n) => `${n.value} | ${n.label}`).join("\n")} /></div>
                <div className="field"><label>Body (## headings, - lists, **bold**, [link](url))</label><textarea name="body" rows={14} defaultValue={st.body} /></div>
                <div className="two">
                  <div className="field"><label>Category</label><select name="category" defaultValue={st.category}>{Object.entries(NEWS_CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}</select></div>
                  <div className="field"><label>Place</label><input name="place" defaultValue={st.place} /></div>
                </div>
                <div className="two">
                  <div className="field"><label>Subject name</label><input name="subjectName" defaultValue={st.subjectName} /></div>
                  <div className="field"><label>Subject role</label><input name="subjectRole" defaultValue={st.subjectRole} /></div>
                </div>
                {st.status === "published" ? <div className="field"><label>Correction note (shown on the page)</label><input name="correction" placeholder="e.g. An earlier version gave the wrong hospital name." /></div> : null}
              </ActionForm>
            </details>

            <details style={{ margin: "8px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: "14px" }}>Link a TDi profile</summary>
              <ActionForm action={linkDoctorAction} submitLabel="Link profile" variant="quiet" style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={st.id} />
                <div className="two" style={{ gridTemplateColumns: "1fr 160px" }}>
                  <div className="field"><label>Profile URL, slug or TDi ID</label><input name="doctor" placeholder="https://thedoctorindex.com/doctor/… or TDI-CAR-00412" /></div>
                  <div className="field"><label><input type="checkbox" name="primary" defaultChecked={!primary} /> Primary subject</label></div>
                </div>
              </ActionForm>
              {st.doctors.map((d) => (
                <ActionForm key={d.id} action={linkDoctorAction} submitLabel={`Unlink ${d.name}`} variant="quiet" inline>
                  <input type="hidden" name="id" value={st.id} />
                  <input type="hidden" name="doctor" value={d.id} />
                  <input type="hidden" name="op" value="unlink" />
                </ActionForm>
              ))}
            </details>

            {st.status === "published" ? (
              <details style={{ margin: "8px 0" }}>
                <summary style={{ cursor: "pointer", fontSize: "14px" }}>Instagram carousel</summary>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "10px 0" }}>
                  {Array.from({ length: CAROUSEL_SLIDES }, (_, i) => (
                    <a key={i} href={`/news/${st.slug}/card?slide=${i + 1}&download=1`} style={{ display: "block", width: "140px" }}>
                      <img src={`/news/${st.slug}/card?slide=${i + 1}`} alt={`Slide ${i + 1}`} width={140} height={175} style={{ border: "1px solid var(--hair)", borderRadius: "6px" }} loading="lazy" />
                      <span style={{ fontSize: "13px" }}>Download slide {i + 1}</span>
                    </a>
                  ))}
                </div>
                <div className="field"><label>Caption</label><textarea readOnly rows={10} defaultValue={instagramCaption(st, sp?.name)} /></div>
                <p style={{ fontSize: "14px", color: "var(--muted)" }}>Post as a carousel from instagram.com/thedoctorindex, location {st.place || "Bangalore"}; tag {primary ? primary.name : st.subjectName} and add them as a collaborator if their handle is known.</p>
              </details>
            ) : null}

            <ActionForm action={decideStoryAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
              <input type="hidden" name="id" value={st.id} />
              <div className="two" style={{ gridTemplateColumns: "220px 1fr" }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Decision</label>
                  <select name="decision" defaultValue={st.status === "draft" ? "approve" : st.status === "approved" ? "publish" : st.status === "published" ? "withdraw" : "restore"}>
                    {st.status === "draft" || st.status === "approved" ? (
                      <>
                        {st.status === "draft" ? <option value="approve">Approve → buffer</option> : null}
                        <option value="publish">Publish now</option>
                        <option value="reject">Reject</option>
                      </>
                    ) : st.status === "published" ? (
                      <option value="withdraw">Withdraw (404)</option>
                    ) : (
                      <option value="restore">Restore to review</option>
                    )}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Note (required to reject or withdraw)</label>
                  <input type="text" name="note" />
                </div>
              </div>
            </ActionForm>
          </div>
        );
      })}
    </>
  );
}
