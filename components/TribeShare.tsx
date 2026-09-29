"use client";

import { useState } from "react";

import { inviteMessage, joinUrl, linkedinShareUrl, mailtoShareUrl, whatsappShareUrl } from "@/lib/tribe";

/**
 * Share controls for Grow Your Tribe. Every button produces the same message
 * with the same link; only the `ch` tag on the link differs, so the dashboard
 * can show which channel actually brings colleagues in.
 *
 * Nothing here talks to a server: the code is in the page, the links are
 * built in the browser, and WhatsApp / LinkedIn open in a new tab.
 */
export function TribeShare({ code, origin, inviterName, colleague, compact = false }: { code: string; origin: string; inviterName: string; colleague?: { slug: string; name: string } | null; compact?: boolean }) {
  const [note, setNote] = useState<string | null>(null);
  const link = (ch: string) => `${joinUrl(origin, code, colleague?.slug)}&ch=${ch}`;
  const text = (ch: string) => inviteMessage({ inviterName, url: link(ch), colleagueName: colleague?.name ?? null });

  async function copy() {
    try {
      await navigator.clipboard.writeText(text("link"));
      setNote("Message and link copied");
    } catch {
      setNote(link("link"));
    }
  }

  async function share() {
    setNote(null);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "The Doctor Index", text: text("other") });
        return;
      }
      await copy();
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") await copy();
    }
  }

  return (
    <div>
      {!compact ? (
        <div className="field" style={{ marginBottom: 10 }}>
          <label>Your invite link</label>
          <input type="text" readOnly value={link("link")} onFocus={(e) => e.currentTarget.select()} className="mono" style={{ fontSize: 14 }} />
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <a className={`btn ${compact ? "quiet" : "solid"}`} href={whatsappShareUrl(text("whatsapp"))} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a className="btn quiet" href={linkedinShareUrl(link("linkedin"))} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="btn quiet" href={mailtoShareUrl("Your profile on The Doctor Index", text("email"))}>
          Email
        </a>
        <button type="button" className="btn quiet" onClick={copy}>
          Copy
        </button>
        {!compact ? (
          <button type="button" className="btn quiet" onClick={share}>
            Share…
          </button>
        ) : null}
      </div>
      {note ? (
        <p className="mono" role="status" style={{ marginTop: 8, fontSize: 13 }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}
