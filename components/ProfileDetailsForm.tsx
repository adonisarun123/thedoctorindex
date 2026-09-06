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
export function ProfileDetailsForm({ user, next, submitLabel }: { user: ProfileDetailsUser; next?: string; submitLabel?: string }) {
  const first = !user.profileComplete;
  return (
    <ActionForm action={saveProfileDetailsAction} submitLabel={submitLabel ?? (first ? "Save and continue" : "Save details")} variant="solid" className="panel pad">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required minLength={3} maxLength={80} defaultValue={user.displayName ?? ""} placeholder="As on your ID" />
        <div className="hint">Shown to a practice you enquire with. Reviews are published under a pseudonym, never this name.</div>
      </div>
      <div className="two">
        <div className="field">
          <label htmlFor="phone">Mobile number</label>
          {user.phone && !user.email ? (
            <input id="phone" type="tel" value={user.phone} readOnly className="mono" aria-describedby="phone-hint" />
          ) : (
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={user.phone ?? ""} placeholder="+91 98765 43210" pattern="(\+?91[ -]?)?[6-9][0-9 -]{9,13}" />
          )}
          <div className="hint" id="phone-hint">{user.phone && !user.email ? "You signed in with this number." : "Practices reach you here. Indian mobile numbers only."}</div>
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
      <div className="two">
        <div className="field">
          <PlacePicker level="locality" idPrefix="home" initial={{ stateSlug: user.stateSlug ?? undefined, citySlug: user.citySlug ?? undefined, localityKey: user.localityKey ?? undefined }} labels={{ state: "Your state", city: "Your city / district", locality: "Your locality (optional)" }} />
          <div className="hint">Used to order results near you. Never shown publicly.</div>
        </div>
      </div>
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
