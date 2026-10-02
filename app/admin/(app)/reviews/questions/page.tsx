import Link from "next/link";

import { saveReviewQuestionAction } from "@/app/admin/review-question-actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaff } from "@/lib/auth/session";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { listAllQuestions } from "@/lib/reviews/questions";

export const metadata = { title: "Review questions" };

const SPECS = SPECIALTIES as unknown as Record<string, { name: string }>;
const specName = (k: string | null) => (k ? (SPECS[k]?.name ?? k) : "All doctors (core)");

export default async function ReviewQuestions() {
  await requireStaff();
  const rows = await listAllQuestions();
  const specs = Object.entries(SPECS).sort((a, b) => a[1].name.localeCompare(b[1].name));

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Review questions</h1>
          <div className="sub">
            Core questions are asked of every doctor; speciality questions are added for that speciality and are optional for the patient.
            Reviewers must rate at least 3 core questions. A key keeps its meaning forever: to change what a question asks, retire it and add a new key.{" "}
            <Link href="/admin/reviews">← Moderation queue</Link>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Add a question</span></div>
        <ActionForm action={saveReviewQuestionAction} submitLabel="Add question" variant="solid" resetOnSuccess>
          <div className="two">
            <div className="field"><label>Key</label><input type="text" name="key" required placeholder="orthopaedics.pain_relief" /></div>
            <div className="field">
              <label>Asked for</label>
              <select name="specialtyKey" defaultValue="">
                <option value="">All doctors (core)</option>
                {specs.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Question</label><input type="text" name="label" required placeholder="Pain relief" /></div>
          <div className="field"><label>Help text</label><input type="text" name="help" placeholder="Was your pain managed and explained?" /></div>
          <div className="two">
            <div className="field"><label>Order</label><input type="number" name="sort" defaultValue={100} /></div>
            <label className="consent" style={{ alignSelf: "end" }}><input type="checkbox" name="active" defaultChecked /> Active</label>
          </div>
        </ActionForm>
      </section>

      <section>
        <div className="chart-head"><span className="t">All questions</span><span className="m">{rows.filter((r) => r.active).length} active of {rows.length}</span></div>
        {rows.map((q) => (
          <div className="qcard" key={q.key}>
            <div className="qh">
              <div>
                <div className="qt">{q.label} {q.active ? null : <span className="pill neut">retired</span>}</div>
                <div className="qm"><span className="mono">{q.key}</span> · {specName(q.specialtyKey)}</div>
              </div>
            </div>
            <ActionForm action={saveReviewQuestionAction} submitLabel="Save" variant="outline" style={{ marginTop: "8px" }}>
              <input type="hidden" name="key" value={q.key} />
              <input type="hidden" name="specialtyKey" value={q.specialtyKey ?? ""} />
              <div className="two">
                <div className="field" style={{ marginBottom: 0 }}><label>Question</label><input type="text" name="label" defaultValue={q.label} required /></div>
                <div className="field" style={{ marginBottom: 0 }}><label>Help text</label><input type="text" name="help" defaultValue={q.help} /></div>
              </div>
              <div className="two" style={{ gridTemplateColumns: "120px 1fr" }}>
                <div className="field" style={{ marginBottom: 0 }}><label>Order</label><input type="number" name="sort" defaultValue={q.sort} /></div>
                <label className="consent" style={{ alignSelf: "end" }}><input type="checkbox" name="active" defaultChecked={q.active} /> Active</label>
              </div>
            </ActionForm>
          </div>
        ))}
      </section>
    </>
  );
}
