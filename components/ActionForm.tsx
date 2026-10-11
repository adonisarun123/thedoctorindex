"use client";

import { startTransition, useActionState, useEffect } from "react";

import { toast } from "@/components/admin/Toaster";

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
  submitKey,
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
  /** Keyboard shortcut shown on the button and wired by components/admin/QueueKeys.tsx. */
  submitKey?: string;
}) {
  const [state, act, pending] = useActionState<FormState, FormData>(action, {});
  const cls = variant === "solid" ? "btn solid" : variant === "outline" ? "btn" : "btn quiet";
  // In the console the result also lands as a toast, so a decision made at
  // the bottom of a long card is confirmed where the eye is.
  useEffect(() => {
    if (!document.querySelector(".admin-shell")) return;
    if (state.error) toast(state.error, "err");
    else if (state.ok && state.message) toast(state.message, state.queued ? "info" : "ok");
  }, [state]);

  return (
    <form
      action={act}
      className={className}
      style={style}
      onSubmit={(e) => {
        // Submit through the action ourselves instead of letting <form action>
        // do it: React resets every uncontrolled field after a form action, so
        // a validation error would wipe what the person typed. resetOnSuccess
        // still clears the form, via the key below, when the save succeeds.
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        const data = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => act(data));
      }}
      key={resetOnSuccess && state.ok ? String(Date.now()) : "form"}
    >
      {children}
      <div style={inline ? { display: "inline-flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } : { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: children ? "12px" : 0 }}>
        <button type="submit" className={cls} disabled={pending} data-key={submitKey}>
          {pending ? "Working…" : submitLabel}
          {submitKey ? <kbd className="btn-kbd" aria-hidden="true">{submitKey}</kbd> : null}
        </button>
        {state.error ? <span className="notice alert" style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.error}</span> : null}
        {state.ok && state.message ? <span className={`notice af-ok ${state.queued ? "" : "good"}`} style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.message}</span> : null}
      </div>
    </form>
  );
}
