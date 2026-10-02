"use client";

import { useState } from "react";

/**
 * "Your public links" card on the dashboard: the profile URL to put on the
 * doctor's Google Business Profile, the booking link, and the review link to
 * share with patients. Shared with every patient, never a chosen few — that
 * would be review gating, which the review policy rules out.
 */
export function ProfileLinks({ slug, origin, name, bookingEnabled }: { slug: string; origin: string; name: string; bookingEnabled: boolean }) {
  const [note, setNote] = useState<string | null>(null);
  const profile = `${origin}/doctor/${slug}`;
  const book = `${profile}/book`;
  const review = `${profile}/review`;
  const waText = `Thank you for visiting. If you have a moment, please share your experience of your consultation with ${name}. Reviews on The Doctor Index are from verified patients only: ${review}`;

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNote(`${label} copied`);
    } catch {
      setNote(text);
    }
  }

  const row = (label: string, url: string, hint: string) => (
    <div style={{ padding: "10px 0", borderTop: "1px solid var(--hair, #d6dee8)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div className="t" style={{ fontWeight: 600, fontSize: "14px" }}>{label}</div>
          <div className="mono" style={{ fontSize: "12.5px", overflowWrap: "anywhere" }}>{url}</div>
        </div>
        <button type="button" className="btn quiet" onClick={() => copy(url, label)}>Copy</button>
      </div>
      <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "4px" }}>{hint}</div>
    </div>
  );

  return (
    <section className="panel pad" style={{ marginBottom: "16px" }}>
      <div className="chart-head"><span className="t">Your public links</span></div>
      {row("Profile", profile, "Add this as the website link on your Google Business Profile, your clinic website and your social bios.")}
      {bookingEnabled
        ? row("Book an appointment", book, "Add this as the appointment link on your Google Business Profile so patients can book from Google Search and Maps.")
        : null}
      {row("Patient review link", review, "Share it with all your patients after their visit — print it, add it to prescriptions, or send it on WhatsApp. Only patients who upload their prescription can review, so every review here is genuine. Never offer anything in return, and do not pick only happy patients.")}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
        <a className="btn solid" href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener">Share review link on WhatsApp</a>
        <button type="button" className="btn quiet" onClick={() => copy(waText, "Message")}>Copy message</button>
      </div>
      {note ? <p className="mono" role="status" style={{ marginTop: 8, fontSize: "12.5px" }}>{note}</p> : null}
    </section>
  );
}
