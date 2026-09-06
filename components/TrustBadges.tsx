import type { DoctorView } from "@/lib/types";
import { hasDate, registrationLabel, registrationState } from "@/lib/verification";

/**
 * Verification labels.
 *
 * Each badge is a separate dimension with its own evidence. There is
 * deliberately no single "verified" badge: one tick would imply we had checked
 * more than we have. Wording here is the wording published at
 * /policies/verification, and the two must be changed together.
 */
export function TrustBadges({ doctor }: { doctor: DoctorView }) {
  const reg = registrationState(doctor);
  const qualsVerified = doctor.qualifications.length > 0 && doctor.qualifications.every((q) => q.state === "verified");
  const qualsNone = doctor.qualifications.length === 0;
  const stale = doctor.status === "stale";
  const confirmedOn = doctor.practices[0]?.confirmedOn;

  return (
    <div className="badges">
      <span className={`badge ${reg === "verified" ? "ok" : reg === "submitted" ? "wait" : "neut"}`}>{registrationLabel(doctor)}</span>
      <span className={`badge ${qualsVerified ? "ok" : qualsNone ? "neut" : "wait"}`}>
        {qualsVerified ? "Qualification verified" : qualsNone ? "No qualification on record" : doctor.qualifications.some((q) => q.state === "verified") ? "Qualification partly pending" : "Qualification not yet checked"}
      </span>
      <span className={`badge ${stale ? "warn" : "ok"}`}>
        {stale ? (hasDate(confirmedOn) ? `Practice not confirmed since ${confirmedOn}` : "Practice not yet confirmed") : "Practice confirmed"}
      </span>
      <span className={`badge ${doctor.claimed ? "ok" : "neut"}`}>
        {doctor.claimed ? "Claimed by doctor" : "Unclaimed"}
      </span>
      {doctor.hprVerified ? <span className="badge ok">HPR ID verified</span> : null}
    </div>
  );
}
