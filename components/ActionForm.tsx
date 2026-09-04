"use client";

import { useActionState } from "react";

export interface FormState {
  ok?: boolean;
  error?: string;
  message?: string;
  queued?: boolean;
}

/**
 * A form bound to a server action with the result rendered inline. Used
 * across the dashboard and the admin panel so every write shows the same
 * confirmation and error treatment.
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  variant = "solid",
  className,
  style,
  confirm,
  inline = false,
  resetOnSuccess = false,
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  children?: React.ReactNode;
  submitLabel: string;
  variant?: "solid" | "outline" | "quiet";
  className?: string;
  style?: React.CSSProperties;
  confirm?: string;
  inline?: boolean;
  resetOnSuccess?: boolean;
}) {
  const [state, act, pending] = useActionState<FormState, FormData>(action, {});
  const cls = variant === "solid" ? "btn solid" : variant === "outline" ? "btn" : "btn quiet";

  return (
    <form
      action={act}
      className={className}
      style={style}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      key={resetOnSuccess && state.ok ? String(Date.now()) : "form"}
    >
      {children}
      <div style={inline ? { display: "inline-flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } : { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: children ? "12px" : 0 }}>
        <button type="submit" className={cls} disabled={pending}>
          {pending ? "Working…" : submitLabel}
        </button>
        {state.error ? <span className="notice alert" style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.error}</span> : null}
        {state.ok && state.message ? <span className={`notice ${state.queued ? "" : "good"}`} style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.message}</span> : null}
      </div>
    </form>
  );
}
