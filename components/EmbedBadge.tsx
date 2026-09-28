"use client";

import { useState } from "react";

import { BADGE_H, BADGE_W } from "@/lib/tdi/badge-size";

/**
 * Dashboard panel: the "verified on The Doctor Index" badge for the doctor's
 * own website, with the HTML to paste. Shown to claimed doctors next to the QR
 * card. The snippet is built on the server (badgeSnippet) and passed in.
 */
export function EmbedBadge({ tdiId, snippet, verified }: { tdiId: string; snippet: string; verified: boolean }) {
  const [note, setNote] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setNote("Code copied — paste it into your website's HTML");
    } catch {
      setNote("Select the code above and copy it");
    }
  }

  return (
    <div className="panel pad">
      <div className="eyebrow">Badge for your website</div>
      <p style={{ fontSize: "14px", color: "var(--ink-2)", margin: "6px 0 12px" }}>
        {verified
          ? "Shows patients your registration is checked against the council register, and links to your profile."
          : "Links patients to your profile. It changes to “Registration verified” once your registration is checked."}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/d/${tdiId}/badge`} alt="Badge preview" width={BADGE_W} height={BADGE_H} style={{ display: "block", marginBottom: 12 }} />
      <label htmlFor="badge-code" className="eyebrow">HTML</label>
      <textarea id="badge-code" readOnly value={snippet} rows={4} className="mono" style={{ width: "100%", fontSize: "12px", marginTop: 4 }} onFocus={(e) => e.currentTarget.select()} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="button" className="btn solid" onClick={copy}>Copy code</button>
      </div>
      {note ? <p className="mono" role="status" style={{ marginTop: 8 }}>{note}</p> : null}
    </div>
  );
}
