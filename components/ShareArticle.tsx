"use client";

import { useState } from "react";

/**
 * Share panel for a published article: ready-made images in each network's
 * size, a caption to paste, and one-click share links. Instagram has no web
 * share URL, so for it the doctor downloads the portrait image and pastes the
 * caption in the app.
 */
export function ShareArticle({ url, slug, title, caption }: { url: string; slug: string; title: string; caption: string }) {
  const [note, setNote] = useState<string | null>(null);
  const enc = encodeURIComponent;
  const card = (size: string, download = false) => `/articles/${slug}/card?size=${size}${download ? "&download=1" : ""}`;
  const text = `${caption}\n\n${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setNote("Caption copied");
    } catch {
      setNote("Select the caption and copy it");
    }
  }

  return (
    <section className="panel pad" style={{ marginBottom: "18px" }}>
      <div className="eyebrow">Share this article</div>
      <p style={{ fontSize: "14px", color: "var(--ink-2)", margin: "6px 0 12px" }}>
        Every image carries your registration number. Colleagues who see it can claim their own profile from the link.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card("landscape")} alt={`Share card for ${title}`} width={480} height={251} style={{ display: "block", maxWidth: "100%", height: "auto", border: "1px solid var(--hair)", borderRadius: 8, marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <a className="btn" href={card("portrait", true)}>Instagram image (1080×1350)</a>
        <a className="btn" href={card("square", true)}>Square (1080×1080)</a>
        <a className="btn" href={card("landscape", true)}>LinkedIn image (1200×627)</a>
      </div>
      <label htmlFor="share-caption" className="eyebrow">Caption</label>
      <textarea id="share-caption" readOnly value={text} rows={4} style={{ width: "100%", fontSize: "13.5px", marginTop: 4 }} onFocus={(e) => e.currentTarget.select()} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
        <button type="button" className="btn solid" onClick={copy}>Copy caption</button>
        <a className="btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener">Share on LinkedIn</a>
        <a className="btn" href={`https://wa.me/?text=${enc(text)}`} target="_blank" rel="noopener">Send on WhatsApp</a>
        <a className="btn" href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener">Post on X</a>
        {note ? <span className="mono" role="status" style={{ fontSize: "13px" }}>{note}</span> : null}
      </div>
    </section>
  );
}
