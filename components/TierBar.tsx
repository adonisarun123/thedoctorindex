import Link from "next/link";

/**
 * Listed → Verified → Bookable. The doctor's place on the path, so a locked
 * calendar reads as the next step rather than a fault. Pure presentation.
 */
export type Tier = "listed" | "verified" | "bookable";

export function TierBar({ tier, verifiedHint, bookableHint }: { tier: Tier; verifiedHint: string; bookableHint: string }) {
  const steps: Array<{ key: Tier; label: string; hint: string; href: string }> = [
    { key: "listed", label: "Listed", hint: "Your profile is live on The Doctor Index.", href: "/dashboard/profile" },
    { key: "verified", label: "Verified", hint: verifiedHint, href: "/dashboard/verification" },
    { key: "bookable", label: "Bookable", hint: bookableHint, href: "/dashboard/calendar" },
  ];
  const reached = steps.findIndex((s) => s.key === tier);
  return (
    <ol className="tierbar" aria-label="Profile stage">
      {steps.map((s, i) => {
        const state = i < reached ? "done" : i === reached ? "here" : "next";
        return (
          <li key={s.key} className={`tier ${state}`}>
            <Link href={s.href}>
              <span className="dot" aria-hidden="true">{state === "done" ? "✓" : i + 1}</span>
              <span className="lbl">{s.label}</span>
              <span className="hnt">{s.hint}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
