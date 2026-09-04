"use client";

import { useState } from "react";

/**
 * A control that exists in the design but whose behaviour belongs to a service
 * this repository does not contain — telephony, maps, the enquiry queue, the
 * moderation queue. Clicking explains what the real implementation does rather
 * than pretending to do it. Replace these with real handlers as each service
 * lands; the call sites are the integration checklist.
 */
export function DemoAction({
  label,
  explains,
  variant = "quiet",
}: {
  label: string;
  explains: string;
  variant?: "solid" | "outline" | "quiet";
}) {
  const [shown, setShown] = useState(false);
  const cls = variant === "solid" ? "btn solid" : variant === "outline" ? "btn" : "btn quiet";

  return (
    <>
      <button type="button" className={cls} onClick={() => setShown((v) => !v)} aria-expanded={shown}>
        {label}
      </button>
      {shown ? (
        <p className="notice" style={{ fontSize: "12.5px", marginTop: "-2px" }}>
          {explains}
        </p>
      ) : null}
    </>
  );
}
