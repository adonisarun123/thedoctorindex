"use client";

import { useState } from "react";

/**
 * TDI ID panel: the doctor's QR card with download and share.
 *
 * Share sends the card image itself where the browser can (phones: WhatsApp,
 * Instagram, email), falls back to sharing the short link, and on desktop
 * copies the link. The short link, not the profile URL, is what gets shared:
 * it outlives any rename.
 */
export function QrShare({ tdiId, name, origin, compact = false }: { tdiId: string; name: string; origin: string; compact?: boolean }) {
  const [note, setNote] = useState<string | null>(null);
  const shortUrl = `${origin}/d/${tdiId}`;
  const card = `/d/${tdiId}/card`;
  const title = `${name} · ${tdiId}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setNote("Link copied");
    } catch {
      setNote(shortUrl);
    }
  }

  async function share() {
    setNote(null);
    try {
      if (typeof navigator.share === "function") {
        try {
          const blob = await (await fetch(`${card}?format=png`)).blob();
          const file = new File([blob], `${tdiId}-QR.png`, { type: "image/png" });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title, text: `${title}\n${shortUrl}` });
            return;
          }
        } catch (e) {
          if ((e as Error)?.name === "AbortError") return;
        }
        await navigator.share({ title, text: title, url: shortUrl });
        return;
      }
      await copy();
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") await copy();
    }
  }

  return (
    <div className="panel pad">
      <div className="eyebrow">TDI ID</div>
      <p className="mono" style={{ fontSize: "1.05rem", margin: "4px 0 10px" }}>{tdiId}</p>
      {!compact ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${card}?format=png`} alt={`QR card for ${name}, ${tdiId}`} width={270} height={338} loading="lazy" style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid var(--hair, #d6dee8)" }} />
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <button type="button" className="btn solid" onClick={share}>Share</button>
        <a className="btn quiet" href={`${card}?format=png&download=1`} download>Download PNG</a>
        <a className="btn quiet" href={`${card}?format=svg&download=1`} download>SVG for print</a>
        <button type="button" className="btn quiet" onClick={copy}>Copy link</button>
      </div>
      {note ? <p className="mono" role="status" style={{ marginTop: 8 }}>{note}</p> : null}
    </div>
  );
}
