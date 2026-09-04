"use client";

import { useState } from "react";

/**
 * Doctor reply to a review. One reply, privacy-safe, moderated before it
 * appears. The dispute path is separate and goes to a person.
 */
export function ReplyBox({ reviewId, existing }: { reviewId: string; existing: string | null }) {
  const [text, setText] = useState(existing ?? "");
  const [state, setState] = useState<"idle" | "queued" | "disputed">(existing ? "queued" : "idle");

  if (existing && state === "queued") {
    return (
      <div className="reply" style={{ marginTop: "12px" }}>
        <div className="who">Your reply · published</div>
        <p className="txt">{existing}</p>
      </div>
    );
  }

  if (state === "queued") {
    return (
      <div className="notice good" style={{ marginTop: "12px", fontSize: "13px" }}>
        <b>Reply queued for moderation.</b> Checked for health information before it appears, usually within 48 hours.
      </div>
    );
  }

  if (state === "disputed") {
    return (
      <div className="notice" style={{ marginTop: "12px", fontSize: "13px" }}>
        <b>Dispute opened.</b> Reference {reviewId.toUpperCase()}. A moderator who did not approve this review will assess it within 48 hours. The review stays visible unless it breaches policy.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div className="field" style={{ marginBottom: "8px" }}>
        <label htmlFor={`reply-${reviewId}`}>Reply (one per review)</label>
        <textarea
          id={`reply-${reviewId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Thank the reviewer or address the point raised. Do not confirm they were your patient or mention any health detail."
          style={{ minHeight: "64px" }}
        />
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button className="btn solid" disabled={!text.trim()} onClick={() => setState("queued")}>
          Submit reply for moderation
        </button>
        <button className="btn quiet" onClick={() => setState("disputed")}>
          Dispute this review
        </button>
      </div>
    </div>
  );
}
