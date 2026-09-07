import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { photoAdminAction, addPracticeAdminAction, addQualificationAdminAction, mergeDoctorAction, registrationCheckAction, qualificationStateAction, setStatusAction, updateDoctorFieldsAction, updatePracticeAdminAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { RankingBreakdown } from "@/components/RankingBreakdown";
import { PlacePicker } from "@/components/PlacePicker";
import { getDoctorBySlug } from "@/lib/data";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { getDoctorAdmin, recomputeQuality } from "@/lib/services/doctors";
import { doctorAnalytics } from "@/lib/services/events";
import { GATES } from "@/lib/seo/gates";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Doctor" };

const STATUSES = ["draft", "in_review", "published", "suspended", "retired", "archived"] as const;

function pill(status: string) {
  return status === "published" || status === "verified" || status === "active" ? "ok" : status === "suspended" || status === "failed" || status === "rejected" ? "warn" : status === "draft" || status === "in_review" || status === "submitted" || status === "pending" ? "wait" : "neut";
}

export default async function AdminDoctor({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const { id } = await params;
  const sp = await searchParams;
  const d = await getDoctorAdmin(id);
  if (!d) notFound();
  const [quality, analytics, audit, mergedInto, publicView] = await Promise.all([
    recomputeQuality(d.id),
    doctorAnalytics(d.id),
    getDb().query.auditLogs.findMany({ where: eq(s.auditLogs.entityId, d.id), orderBy: [desc(s.auditLogs.createdAt)], limit: 40 }),
    d.mergedIntoId ? getDb().query.doctors.findFirst({ where: eq(s.doctors.id, d.mergedIntoId), columns: { id: true, name: true } }) : Promise.resolve(null),
    getDoctorBySlug(d.slug).catch(() => null),
  ]);
  const reg = d.registrations.find((r) => r.isPrimary) ?? d.registrations[0];
  const activePractices = d.practices.filter((p) => p.active);
  const specialtyName = SPECIALTIES[d.specialtyKey as keyof typeof SPECIALTIES]?.name ?? d.specialtyKey;

  return (
    <>
      {sp.created === "1" ? <div className="notice good" style={{ marginBottom: "14px" }}><b>Profile created.</b> Public ID <span className="mono">{d.publicId}</span>. Record the register check below before publishing.</div> : null}
      <div className="dash-head">
        <div>
          <h1>Dr {d.name} <span className={`pill ${pill(d.status)}`} style={{ marginLeft: "8px", verticalAlign: "middle" }}>{d.status.replace("_", " ")}</span></h1>
          <div className="sub">{specialtyName} · <span className="mono">{d.publicId}</span> · source {d.source} · created {toDisplay(d.createdAt)} · {d.claimed ? "claimed" : "unclaimed"} · quality <b>{quality.score}</b></div>
        </div>
        <div className="quick" style={{ marginTop: 0 }}>
          <Link className="btn quiet" href={`/doctor/${d.slug}`} target="_blank">Public page ↗</Link>
          <Link className="btn quiet" href="/admin/doctors">All doctors</Link>
        </div>
      </div>

      {mergedInto ? <div className="notice alert" style={{ marginBottom: "14px" }}>This profile was merged into <Link href={`/admin/doctors/${mergedInto.id}`}>Dr {mergedInto.name}</Link>; its URL redirects there.</div> : null}
      {d.status === "suspended" && d.suspendedReason ? <div className="notice alert" style={{ marginBottom: "14px" }}><b>Suspended:</b> {d.suspendedReason}</div> : null}

      <div className="tiles" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "18px" }}>
        <div className="tile"><div className="l">Quality score</div><div className="v">{quality.score}</div><div className="d">gate {GATES.profileQuality}</div></div>
        <div className="tile"><div className="l">Views · 28 days</div><div className="v">{analytics.viewsTotal}</div><div className="d">{analytics.viewsPrevTotal} previous 28</div></div>
        <div className="tile"><div className="l">Calls + directions</div><div className="v">{analytics.actions.call + analytics.actions.directions}</div><div className="d">{analytics.actions.enquiry} enquiries</div></div>
        <div className="tile"><div className="l">Published reviews</div><div className="v">{d.reviews.filter((r) => r.status === "published" || r.status === "redacted").length}</div><div className="d">{d.reviews.filter((r) => r.status === "pending").length} pending</div></div>
      </div>

      <div className="two" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start", gap: "18px" }}>
        <div>
          {/* Identity and profile fields */}
          <ActionForm action={updateDoctorFieldsAction} submitLabel="Save fields" variant="solid" className="panel pad" style={{ marginBottom: "18px" }}>
            <input type="hidden" name="id" value={d.id} />
            <h3 style={{ marginTop: 0 }}>Profile fields</h3>
            <div className="two" style={{ gridTemplateColumns: "1fr 130px 1fr" }}>
              <div className="field"><label>Name</label><input type="text" name="name" defaultValue={d.name} required /><div className="hint">Renaming keeps the old URL working via a redirect.</div></div>
              <div className="field"><label>Gender</label><select name="gender" defaultValue={d.gender ?? ""}><option value="">Not stated</option><option value="F">Female</option><option value="M">Male</option><option value="X">Other</option></select></div>
              <div className="field"><label>Speciality</label><select name="specialty" defaultValue={d.specialtyKey}>{SPECIALTY_KEYS.map((k) => <option key={k} value={k}>{SPECIALTIES[k].name}</option>)}</select></div>
            </div>
            <div className="two">
              <div className="field"><label>Subspecialities</label><input type="text" name="subspecialties" defaultValue={d.subspecialties.join(", ")} /></div>
              <div className="field"><label>Practice start year</label><input type="number" name="start" defaultValue={d.practiceStartYear ?? ""} /></div>
            </div>
            <div className="two">
              <div className="field"><label>Languages</label><input type="text" name="languages" defaultValue={d.languages.join(", ")} /></div>
              <div className="field"><label>Modes</label><div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}><label className="fopt"><input type="checkbox" name="mode_inperson" defaultChecked={d.modes.includes("In person")} /> In person</label><label className="fopt"><input type="checkbox" name="mode_online" defaultChecked={d.modes.includes("Online")} /> Online</label></div></div>
            </div>
            <div className="field"><label>About</label><textarea name="about" defaultValue={d.about} style={{ minHeight: "90px" }} /></div>
            <div className="field"><label>Services</label><input type="text" name="services" defaultValue={d.services.join(", ")} /></div>
            <div className="two" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field"><label>HPR ID</label><input type="text" name="hprId" defaultValue={d.hprId ?? ""} /></div>
              <div className="field"><label>&nbsp;</label><label className="fopt"><input type="checkbox" name="hprVerified" defaultChecked={d.hprVerified} /> HPR match confirmed</label></div>
            </div>
            <div style={{ display: "flex", gap: "18px", marginBottom: "10px" }}>
              <label className="fopt"><input type="checkbox" name="photoConsent" defaultChecked={d.photoConsent} /> Photo consent on file</label>
              <label className="fopt"><input type="checkbox" name="phoneConsent" defaultChecked={d.phoneConsent} /> Practice phone may be shown</label>
            </div>
            <div className="field"><label>Reason (goes to the audit log)</label><input type="text" name="reason" placeholder="Corrected per council record" /></div>
          </ActionForm>

          {/* Practices */}
          <section className="panel pad" style={{ marginBottom: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Practices <span className="m" style={{ fontWeight: 400, color: "var(--muted)" }}>· {activePractices.length} active</span></h3>
            {d.practices.map((p) => (
              <ActionForm key={p.id} action={updatePracticeAdminAction} submitLabel="Save practice" variant="outline" style={{ borderTop: "1px solid var(--hair)", paddingTop: "12px", marginTop: "12px", opacity: p.active ? 1 : 0.55 }}>
                <input type="hidden" name="doctorId" value={d.id} />
                <input type="hidden" name="practiceId" value={p.id} />
                <input type="hidden" name="facilityId" value={p.facilityId} />
                <div className="qm" style={{ marginBottom: "8px" }}>
                  <span className="mono">{p.id.slice(0, 8)}</span> · {p.active ? "active" : "removed"} · confirmed {p.confirmedOn ? toDisplay(p.confirmedOn) : p.facility.confirmedOn ? `${toDisplay(p.facility.confirmedOn)} (facility)` : "never"} · fee checked {p.feeCheckedOn ? toDisplay(p.feeCheckedOn) : "never"}
                </div>
                <div className="field"><label>Facility</label><input type="text" name="facility" defaultValue={p.facility.name} /></div>
                <PlacePicker idPrefix={`practice-${p.id.slice(0, 8)}`} initial={{ stateSlug: p.facility.locality?.stateSlug, citySlug: p.facility.locality?.citySlug, localityKey: p.facility.localityKey }} required={false} />
                <div className="two" style={{ gridTemplateColumns: "1.6fr 140px" }}>
                  <div className="field"><label>Address</label><input type="text" name="address" defaultValue={p.facility.address} /></div>
                  <div className="field"><label>PIN</label><input type="text" name="postal" defaultValue={p.facility.postalCode ?? ""} /></div>
                </div>
                <div className="two" style={{ gridTemplateColumns: "1fr 1fr 110px 1fr" }}>
                  <div className="field"><label>Days</label><input type="text" name="days" defaultValue={p.days} /></div>
                  <div className="field"><label>Hours</label><input type="text" name="hours" defaultValue={p.hours} /></div>
                  <div className="field"><label>Fee ₹</label><input type="number" name="fee" defaultValue={p.feeInr ?? ""} /></div>
                  <div className="field"><label>Phone</label><input type="tel" name="phone" defaultValue={p.phone ?? ""} /></div>
                </div>
                <div className="two" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="field"><label>Coordinates (lat,lng)</label><input type="text" name="geo" className="mono" defaultValue={p.facility.lat && p.facility.lng ? `${p.facility.lat},${p.facility.lng}` : ""} placeholder="12.9784,77.6408" /><div className="hint">{p.facility.geocodeSource ? `${p.facility.geocodeSource} · confidence ${p.facility.geocodeConfidence ?? "—"}` : "Not geocoded — “near me” uses the locality centre. Paste from a maps app or run npm run db:geocode."}</div></div>
                </div>
                <div style={{ display: "flex", gap: "18px", marginBottom: "8px" }}>
                  <label className="fopt"><input type="checkbox" name="confirm" /> Confirmed with facility today</label>
                  {p.active ? <label className="fopt"><input type="checkbox" name="deactivate" /> Remove this practice</label> : null}
                </div>
              </ActionForm>
            ))}
            <details style={{ marginTop: "14px" }}>
              <summary style={{ cursor: "pointer", fontSize: "13.5px", color: "var(--accent)" }}>Add a practice</summary>
              <ActionForm action={addPracticeAdminAction} submitLabel="Add practice" variant="outline" resetOnSuccess style={{ marginTop: "10px" }}>
                <input type="hidden" name="doctorId" value={d.id} />
                <div className="field"><label>Facility</label><input type="text" name="facility" required /></div>
                <PlacePicker idPrefix="practice-new" />
                <div className="two" style={{ gridTemplateColumns: "1.6fr 140px" }}>
                  <div className="field"><label>Address</label><input type="text" name="address" required /></div>
                  <div className="field"><label>PIN</label><input type="text" name="postal" /></div>
                </div>
                <div className="two" style={{ gridTemplateColumns: "1fr 1fr 110px 1fr" }}>
                  <div className="field"><label>Days</label><input type="text" name="days" /></div>
                  <div className="field"><label>Hours</label><input type="text" name="hours" /></div>
                  <div className="field"><label>Fee ₹</label><input type="number" name="fee" /></div>
                  <div className="field"><label>Phone</label><input type="tel" name="phone" /></div>
                </div>
                <label className="fopt" style={{ marginBottom: "8px" }}><input type="checkbox" name="confirm" /> Confirmed with facility today</label>
              </ActionForm>
            </details>
          </section>

          {/* Reviews */}
          <section className="panel pad" style={{ marginBottom: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Reviews <span style={{ fontWeight: 400, color: "var(--muted)" }}>· {d.reviews.length}</span></h3>
            {d.reviews.length === 0 ? <div style={{ color: "var(--muted)", fontSize: "13.5px" }}>None yet.</div> : null}
            {d.reviews.map((r) => (
              <div key={r.id} style={{ borderTop: "1px solid var(--hair)", paddingTop: "10px", marginTop: "10px", fontSize: "13.5px" }}>
                <div className="qm"><span className={`pill ${pill(r.status)}`}>{r.status}</span> {r.authorLabel} · {r.visitMonth} · avg {((r.communication + r.explanation + r.waitTime + r.facility) / 4).toFixed(1)}/5 · evidence {r.evidence} · <Link href={`/admin/reviews?status=${r.status}`}>moderate</Link></div>
                <div style={{ marginTop: "4px" }}>“{r.publishedText ?? r.text}”</div>
                {r.response ? <div className="qm" style={{ marginTop: "4px" }}>Reply ({r.response.status}): “{r.response.text}”</div> : null}
              </div>
            ))}
          </section>

          {publicView ? <RankingBreakdown doctor={publicView} /> : null}

          {/* Audit trail */}
          <section className="panel pad">
            <h3 style={{ marginTop: 0 }}>Audit trail <span style={{ fontWeight: 400, color: "var(--muted)" }}>· last {audit.length}</span></h3>
            <table className="table" style={{ fontSize: "12.5px" }}>
              <thead><tr><th>When</th><th>Action</th><th>By</th><th>Reason</th></tr></thead>
              <tbody>
                {audit.map((a) => (
                  <tr key={a.id}><td className="mono">{toDisplay(a.createdAt)}</td><td className="mono">{a.action}</td><td>{a.actorRole ?? "system"}</td><td style={{ color: "var(--muted)" }}>{a.reason ?? ""}</td></tr>
                ))}
              </tbody>
            </table>
            <Link href={`/admin/audit?entity=${d.id}`} style={{ fontSize: "13px" }}>Full history with diffs →</Link>
          </section>
        </div>

        <div>
          {/* Status */}
          <ActionForm action={setStatusAction} submitLabel="Set status" variant="solid" className="panel pad" style={{ marginBottom: "18px" }} confirm="Change the publication status of this profile?">
            <input type="hidden" name="id" value={d.id} />
            <h3 style={{ marginTop: 0 }}>Publication</h3>
            <div className="field"><label>Status</label><select name="status" defaultValue={d.status}>{STATUSES.map((st) => <option key={st} value={st}>{st.replace("_", " ")}</option>)}</select></div>
            <div className="field"><label>Reason</label><input type="text" name="reason" placeholder="Required for suspend / retire" /></div>
            <div className="hint" style={{ marginBottom: "8px" }}>Indexable only when published, quality ≥ gate, and a practice was confirmed within the freshness window. Retiring keeps the page with a notice; archiving removes it.</div>
          </ActionForm>

          {/* Quality checklist */}
          <section className="panel" style={{ marginBottom: "18px" }}>
            <div className="pad" style={{ paddingBottom: "6px" }}><h3 style={{ margin: 0 }}>Quality checklist · {quality.score}</h3></div>
            {quality.checklist.map((c) => (
              <div className="check" key={c.label}>
                <div className="box" style={c.done ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" } : undefined}>{c.done ? "✓" : ""}</div>
                <div><div style={{ fontSize: "13.5px" }}>{c.label}</div><div style={{ fontSize: "12px", color: "var(--muted)" }}>{c.detail}</div></div>
                <div className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>{c.points}</div>
              </div>
            ))}
          </section>

          {/* Registration */}
          <ActionForm action={registrationCheckAction} submitLabel="Record check" variant="outline" className="panel pad" style={{ marginBottom: "18px" }}>
            <input type="hidden" name="id" value={d.id} />
            <h3 style={{ marginTop: 0 }}>Registration</h3>
            {reg ? (
              <dl className="kvi" style={{ marginBottom: "10px" }}>
                <dt>Council</dt><dd>{reg.council}</dd>
                <dt>Number</dt><dd className="mono">{reg.number}</dd>
                <dt>Year</dt><dd>{reg.registeredYear ?? "—"}</dd>
                <dt>Checked</dt><dd>{reg.checkedOn ? <span className="pill ok">{toDisplay(reg.checkedOn)}</span> : <span className="pill wait">unchecked</span>}</dd>
              </dl>
            ) : <div style={{ color: "var(--warn)", fontSize: "13.5px" }}>No registration on file.</div>}
            <div className="two" style={{ gridTemplateColumns: "150px 1fr" }}>
              <div className="field" style={{ marginBottom: 0 }}><label>Result</label><select name="result" defaultValue="verified"><option value="verified">Matched in register</option><option value="failed">Not found / mismatch</option></select></div>
              <div className="field" style={{ marginBottom: 0 }}><label>Note</label><input type="text" name="note" placeholder="Register entry checked on …" /></div>
            </div>
          </ActionForm>

          {/* Qualifications */}
          <section className="panel pad" style={{ marginBottom: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Qualifications</h3>
            {d.qualifications.map((q) => (
              <ActionForm key={q.id} action={qualificationStateAction} submitLabel="Set" variant="quiet" inline style={{ borderTop: "1px solid var(--hair)", paddingTop: "8px", marginTop: "8px" }}>
                <input type="hidden" name="id" value={q.id} />
                <input type="hidden" name="doctorId" value={d.id} />
                <div style={{ fontSize: "13.5px", flex: 1 }}><b>{q.degree}</b> · {q.institution}{q.year ? ` · ${q.year}` : ""} <span className={`pill ${pill(q.state)}`} style={{ marginLeft: "6px" }}>{q.state}</span></div>
                <select name="state" defaultValue={q.state} style={{ width: "auto" }}><option value="verified">verified</option><option value="submitted">submitted</option><option value="rejected">rejected</option></select>
              </ActionForm>
            ))}
            <details style={{ marginTop: "12px" }}>
              <summary style={{ cursor: "pointer", fontSize: "13.5px", color: "var(--accent)" }}>Add a qualification</summary>
              <ActionForm action={addQualificationAdminAction} submitLabel="Add" variant="outline" resetOnSuccess style={{ marginTop: "10px" }}>
                <input type="hidden" name="doctorId" value={d.id} />
                <div className="field"><label>Degree</label><input type="text" name="degree" required /></div>
                <div className="field"><label>Institution</label><input type="text" name="institution" required /></div>
                <div className="field"><label>Year</label><input type="number" name="year" /></div>
                <label className="fopt" style={{ marginBottom: "8px" }}><input type="checkbox" name="verified" /> Verified with the awarding body</label>
              </ActionForm>
            </details>
          </section>

          {/* Experience (read-only summary) */}
          {d.experience.length ? (
            <section className="panel pad" style={{ marginBottom: "18px" }}>
              <h3 style={{ marginTop: 0 }}>Experience</h3>
              {d.experience.map((e) => <div key={e.id} style={{ fontSize: "13.5px", padding: "3px 0" }}>{e.role}, {e.place} <span className="mono" style={{ color: "var(--muted)" }}>{e.fromYear}–{e.toYear ?? "present"}</span></div>)}
            </section>
          ) : null}

          {/* Photograph */}
          <section className="panel pad" style={{ marginBottom: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Photograph</h3>
            {d.photoFileId ? (
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/photos/${d.photoFileId}`} alt="" width={64} height={64} style={{ borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>consent {d.photoConsent ? "on file" : "missing — not served"}{d.status !== "published" ? " · profile not published, so not served" : ""}</div>
              </div>
            ) : <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>None.</div>}
            <ActionForm action={photoAdminAction} submitLabel="Set photograph" variant="outline">
              <input type="hidden" name="id" value={d.id} />
              <div className="field"><input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required /></div>
              <label className="fopt" style={{ marginBottom: "8px" }}><input type="checkbox" name="consent" /> Written consent from the doctor is on file</label>
            </ActionForm>
            {d.photoFileId ? (
              <ActionForm action={photoAdminAction} submitLabel="Remove" variant="quiet" inline style={{ marginTop: "6px" }}>
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="remove" value="1" />
                <input type="text" name="reason" placeholder="reason" style={{ width: "160px" }} />
              </ActionForm>
            ) : null}
          </section>

          {/* Ownership */}
          <section className="panel pad" style={{ marginBottom: "18px" }}>
            <h3 style={{ marginTop: 0 }}>Ownership</h3>
            <dl className="kvi">
              <dt>Claimed</dt><dd>{d.claimed ? "yes" : "no"}</dd>
              <dt>Managers</dt><dd>{d.managers.length ? d.managers.map((m) => `${m.email} (${m.status})`).join("; ") : "none"}</dd>
              <dt>Change requests</dt><dd>{d.changeRequests.filter((c) => c.status === "pending").length} pending · <Link href="/admin/changes">queue</Link></dd>
              <dt>Checks</dt><dd>{d.checks.length ? d.checks.slice(0, 5).map((c) => `${c.kind}: ${c.result} (${toDisplay(c.checkedOn)})`).join("; ") : "none recorded"}</dd>
            </dl>
          </section>

          {/* Merge */}
          <ActionForm action={mergeDoctorAction} submitLabel="Merge into target" variant="outline" className="panel pad" confirm="Archive this profile and redirect its URL to the target? This cannot be undone from the panel.">
            <input type="hidden" name="id" value={d.id} />
            <h3 style={{ marginTop: 0 }}>Merge duplicate</h3>
            <div className="field"><label>Target profile ID (the one to keep)</label><input type="text" name="targetId" placeholder="uuid from the doctor list" className="mono" /></div>
            <div className="field"><label>Reason</label><input type="text" name="reason" placeholder="Same council number as …" /></div>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
