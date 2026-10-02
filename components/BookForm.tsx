"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { bookAction } from "@/app/doctor/[slug]/book/actions";
import type { ActionState } from "@/app/doctor/[slug]/actions";

export interface DaySlots {
  day: string;
  label: string;
  slots: Array<{ value: string; time: string; practice: string }>;
}

/** Day tabs, then the times for that day. One form value: "practiceId|ISO start". */
export function BookForm({ slug, profilePath, days, contact, multiPractice }: { slug: string; profilePath: string; days: DaySlots[]; contact: { name: string; phone: string }; multiPractice: boolean }) {
  const [state, act, pending] = useActionState<ActionState, FormData>(bookAction, {});
  const [day, setDay] = useState(days[0]?.day ?? "");
  const current = days.find((d) => d.day === day) ?? days[0];

  if (state.ok) {
    return (
      <div className="panel pad">
        <div className="notice good" style={{ marginBottom: "16px" }}><b>Request sent.</b> {state.message}</div>
        <div className="flowacts">
          <Link className="btn quiet" href={profilePath}>Back to the profile</Link>
          <Link className="btn solid" href="/account">My appointments</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="panel pad" action={act}>
      <input type="hidden" name="slug" value={slug} />
      {state.error ? <div className="notice alert" style={{ marginBottom: "16px" }}>{state.error}</div> : null}

      <div className="field">
        <label>Day</label>
        <div className="quick" style={{ marginTop: 0, flexWrap: "wrap" }}>
          {days.map((d) => (
            <button type="button" key={d.day} className="chip" onClick={() => setDay(d.day)} aria-pressed={d.day === current?.day} style={d.day === current?.day ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>
              {d.label} <span style={{ color: "var(--muted)" }}>· {d.slots.length}</span>
            </button>
          ))}
        </div>
      </div>

      {current ? (
        <div className="field">
          <label>Time (IST)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "8px" }}>
            {current.slots.map((s) => (
              <label key={s.value} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", padding: "8px 6px", border: "1px solid var(--hair, #d6dee8)", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><input type="radio" name="slot" value={s.value} required style={{ margin: 0 }} />{s.time}</span>
                {multiPractice ? <span style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center" }}>{s.practice}</span> : null}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="field">
        <label>For</label>
        <div className="seg">
          <label><input type="radio" name="for" value="self" defaultChecked />Myself</label>
          <label><input type="radio" name="for" value="other" />Someone else</label>
        </div>
      </div>
      <div className="field">
        <label htmlFor="reason">Reason for visit (optional)</label>
        <input id="reason" name="reason" type="text" maxLength={200} placeholder="One line is enough. Please do not include reports or diagnoses." />
      </div>
      <div className="notice" style={{ marginBottom: "12px" }}>
        The practice will receive <b>{contact.name}</b>, <span className="mono">{contact.phone}</span>, the time and the reason above — nothing else.{" "}
        Wrong number? <Link href="/account">Update your details</Link> first.
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        Share my name and mobile number with this practice for this appointment.
      </label>
      <div className="flowacts">
        <Link className="btn quiet" href={profilePath}>Cancel</Link>
        <button type="submit" className="btn solid" style={{ flex: 1 }} disabled={pending}>{pending ? "Sending…" : "Request appointment"}</button>
      </div>
    </form>
  );
}
