import type { Doctor } from "@/lib/types";

/**
 * Derived verification states, shared by badges, the profile's verification
 * record, the profile gate and the social card, so the same record can never
 * be labelled two ways. "—" is the data layer's spelling of "no date".
 */
export type RegistrationState = "verified" | "submitted" | "none";

export function registrationState(d: Pick<Doctor, "registration">): RegistrationState {
  const r = d.registration;
  if (!r.number || r.number === "—") return "none";
  return r.checkedOn && r.checkedOn !== "—" ? "verified" : "submitted";
}

export function registrationLabel(d: Pick<Doctor, "registration">): string {
  switch (registrationState(d)) {
    case "verified":
      return "Registration verified";
    case "submitted":
      return "Registration not yet checked";
    default:
      return "No registration on record";
  }
}

export function registrationSource(d: Pick<Doctor, "registration">): string {
  const r = d.registration;
  switch (registrationState(d)) {
    case "verified":
      return `${r.council} · ${r.number}${r.registeredYear ? ` · registered ${r.registeredYear}` : ""}`;
    case "submitted":
      return `${r.council} · ${r.number} as supplied, awaiting a check against the register`;
    default:
      return "The doctor or a permitted source has not supplied a council registration number";
  }
}

export const hasDate = (v: string | null | undefined) => Boolean(v && v !== "—");
