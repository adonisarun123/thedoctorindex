/**
 * Short, enumerable codes for why a claim or a profile submission was turned
 * back — sent to GA4 as error_code so drop-offs can be grouped by cause. The
 * user-facing message stays as it is; only the code leaves the site.
 */
export function workflowErrorCode(message: string): string {
  if (/do not match this profile/i.test(message)) return "registration_mismatch";
  if (/claim is already under review/i.test(message)) return "claim_pending";
  if (/already control this profile/i.test(message)) return "already_owner";
  if (/profile not found/i.test(message)) return "profile_gone";
  if (/already exists for this registration/i.test(message)) return "duplicate_registration";
  if (/already have a submission/i.test(message)) return "submission_pending";
  if (/registration number/i.test(message)) return "no_registration";
  return "server_error";
}
