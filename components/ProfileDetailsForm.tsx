import Link from "next/link";

import { saveProfileDetailsAction } from "@/app/account/actions";
import { ActionForm } from "@/components/ActionForm";
import { PlacePicker } from "@/components/PlacePicker";
import { paths } from "@/lib/site";

export interface ProfileDetailsUser {
  email: string | null;
  phone: string | null;
  displayName: string | null;
  localityKey: string | null;
  city?: string | null;
  stateSlug?: string | null;
  citySlug?: string | null;
  marketingOptIn?: boolean;
  profileComplete: boolean;
}

/**
 * Registration / account details. Shared by the first-run setup page and
 * the account page. The channel used to sign in is fixed; the other is
 * collected here.
 */
export function ProfileDetailsForm({ user, next, submitLabel, doctor = false }: { user: ProfileDetailsUser; next?: string; submitLabel?: string; doctor?: boolean }) {
  const first = !user.profileComplete;
  // A doctor's first run asks only what a verification officer needs: name,
  // mobile, terms. Their practice location comes from the register entry they
  // claim, so a home locality is optional here and can be added later.
  const short = doctor && first;
  return (
    <ActionForm action={saveProfileDetailsAction} submitLabel={submitLabel ?? (first ? "Save and continue" : "Save details")} variant="solid" className="panel pad">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required minLength={3} maxLength={80} defaultValue={user.displayName ?? ""} placeholder={short ? "As on your council registration" : "As on your ID"} autoFocus={short} />
        <div className="hint">{short ? "We use it to find your entry in the medical council register on the next screen." : "Shown to a practice you enquire with. Reviews are published under a pseudonym, never this name."}</div>
      </div>
      <div className="two">
        <div className="field">
          <label htmlFor="phone">Mobile number</label>
          {user.phone && !user.email ? (
            <input id="phone" type="tel" value={user.phone} readOnly className="mono" aria-describedby="phone-hint" />
          ) : (
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={user.phone ?? ""} placeholder="+91 98765 43210" />
          )}
          <div className="hint" id="phone-hint">{user.phone && !user.email ? "You signed in with this number." : short ? "Only for a verification officer to reach you. Never shown publicly." : "Practices reach you here. Indian mobile numbers only."}</div>
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          {user.email ? (
            <input id="email" type="email" value={user.email} readOnly className="mono" />
          ) : (
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          )}
          <div className="hint">{user.email ? "Your sign-in address. Contact support to change it." : "For confirmations and decisions about anything you submit."}</div>
        </div>
      </div>
      {short ? (
        <details style={{ margin: "4px 0 12px" }}>
          <summary style={{ cursor: "pointer", fontSize: "13.5px", color: "var(--ink-2)" }}>Add your home locality (optional)</summary>
          <div className="two" style={{ marginTop: "10px" }}>
            <div className="field">
              <PlacePicker required={false} level="locality" idPrefix="home" initial={{ stateSlug: user.stateSlug ?? undefined, citySlug: user.citySlug ?? undefined, localityKey: user.localityKey ?? undefined }} labels={{ state: "Your state", city: "Your city / district", locality: "Your locality (optional)" }} />
            </div>
          </div>
        </details>
      ) : (
      <div className="two">
        <div className="field">
          <PlacePicker level="locality" idPrefix="home" initial={{ stateSlug: user.stateSlug ?? undefined, citySlug: user.citySlug ?? undefined, localityKey: user.localityKey ?? undefined }} labels={{ state: "Your state", city: "Your city / district", locality: "Your locality (optional)" }} />
          <div className="hint">Used to order results near you. Never shown publicly.</div>
        </div>
      </div>
      )}
      {first ? (
        <label className="consent">
          <input type="checkbox" name="terms" required />
          <span>I accept the <Link href={paths.policy("terms")} target="_blank">terms of use</Link> and have read the <Link href={paths.policy("privacy")} target="_blank">privacy notice</Link>. My contact details are used only for the enquiries, reviews and submissions I make, and are never published.</span>
        </label>
      ) : null}
      <label className="consent">
        <input type="checkbox" name="marketing" defaultChecked={user.marketingOptIn ?? false} />
        <span>Send me occasional updates about the directory (optional; you can turn this off any time).</span>
      </label>
    </ActionForm>
  );
}
