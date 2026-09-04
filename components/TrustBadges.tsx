import type { DoctorView } from "@/lib/types";

/**
 * Verification labels.
 *
 * Each badge is a separate dimension with its own evidence. There is
 * deliberately no single "verified" badge: one tick would imply we had checked
 * more than we have. Wording here is the wording published at
 * /policies/verification, and the two must be changed together.
 */
export function TrustBadges({ doctor }: { doctor: DoctorView }) {
  const qualificationsPending = doctor.qualifications.some((q) => q.state === "submitted");
  const stale = doctor.status === "stale";

  return (
    <div className="badges">
      <span className="badge ok">Registration verified</span>
      <span className={`badge ${qualificationsPending ? "wait" : "ok"}`}>
        {qualificationsPending ? "Qualification partly pending" : "Qualification verified"}
      </span>
      <span className={`badge ${stale ? "warn" : "ok"}`}>
        {stale
          ? `Practice not confirmed since ${doctor.practices[0]?.confirmedOn}`
          : "Practice confirmed"}
      </span>
      <span className={`badge ${doctor.claimed ? "ok" : "neut"}`}>
        {doctor.claimed ? "Claimed by doctor" : "Unclaimed"}
      </span>
      {doctor.hprVerified ? <span className="badge ok">HPR ID verified</span> : null}
    </div>
  );
}
