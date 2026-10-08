"use client";

import { useState, useTransition } from "react";

import { draftAboutAction } from "@/app/dashboard/draft-actions";

/**
 * "Draft it for me" under the Professional introduction field. The draft is
 * shown for the doctor to read first; it only goes into the field when they
 * choose to use it, and only reaches the profile when they save the form.
 */
export function AboutDrafter({ fieldId = "about" }: { fieldId?: string }) {
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function run() {
    setError("");
    start(async () => {
      const r = await draftAboutAction();
      if (r.error) setError(r.error);
      setDraft(r.draft ?? "");
    });
  }

  function use() {
    const el = document.getElementById(fieldId) as HTMLTextAreaElement | null;
    if (el) {
      el.value = draft;
      el.focus();
    }
    setDraft("");
  }

  return (
    <div style={{ marginTop: "8px" }}>
      <button type="button" className="btn quiet" onClick={run} disabled={pending}>
        {pending ? "Drafting…" : "Draft from my profile details"}
      </button>
      <span className="hint" style={{ marginLeft: "8px" }}>Written only from the facts on this page. You review and edit it before anything is published.</span>
      {error ? <div className="notice alert" style={{ marginTop: "8px" }}>{error}</div> : null}
      {draft ? (
        <div className="notice" style={{ marginTop: "8px" }}>
          <p style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" }}>{draft}</p>
          <button type="button" className="btn outline" onClick={use}>Use this draft</button>{" "}
          <button type="button" className="btn quiet" onClick={() => setDraft("")}>Discard</button>
          <div className="hint" style={{ marginTop: "6px" }}>Check every fact before you save. You are the author of what is published.</div>
        </div>
      ) : null}
    </div>
  );
}
