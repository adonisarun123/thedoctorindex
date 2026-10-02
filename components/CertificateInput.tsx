"use client";

import { useState } from "react";

/**
 * Certificate picker for one qualification. Uploads the file straight away to
 * /api/certificates (private storage) and keeps only the returned id in a hidden
 * input called `name`, so the surrounding form submits ids, not bytes.
 */
export function CertificateInput({ name, required = false, label = "Certificate" }: { name: string; required?: boolean; label?: string }) {
  const [state, setState] = useState<{ status: "idle" | "uploading" | "done" | "error"; id?: string; filename?: string; error?: string }>({ status: "idle" });

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setState({ status: "error", error: "Keep the file under 4 MB." });
      e.target.value = "";
      return;
    }
    setState({ status: "uploading", filename: file.name });
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/certificates", { method: "POST", body });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !json.id) throw new Error(json.error ?? "Upload failed.");
      setState({ status: "done", id: json.id, filename: file.name });
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "Upload failed." });
      e.target.value = "";
    }
  }

  return (
    <div className="cert-input" style={{ fontSize: "12.5px" }}>
      <label style={{ display: "block", color: "var(--muted)", marginBottom: "4px" }}>
        {label}
        {required ? "" : " (PDF or photo, recommended)"}
      </label>
      <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={onChange} disabled={state.status === "uploading"} />
      {/* The hidden input carries the id; `required` here blocks submit until an upload has finished. */}
      <input type="text" name={name} value={state.id ?? ""} readOnly required={required} tabIndex={-1} aria-hidden="true" style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none" }} />
      <div aria-live="polite" style={{ marginTop: "4px", color: state.status === "error" ? "var(--warn)" : "var(--muted)" }}>
        {state.status === "uploading" ? `Uploading ${state.filename}…` : state.status === "done" ? `✓ ${state.filename} uploaded (private)` : state.status === "error" ? state.error : null}
      </div>
    </div>
  );
}
