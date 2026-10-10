import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { verifyNotifyEmail } from "@/lib/services/booking-notify";

export const metadata: Metadata = { title: "Confirm appointment emails", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function confirm(form: FormData) {
  "use server";
  const token = String(form.get("t") ?? "");
  const r = await verifyNotifyEmail(token);
  if (!r) redirect("/booking-emails/verify?bad=1");
  redirect(`/booking-emails/verify?done=1&d=${encodeURIComponent(r.doctorName)}`);
}

/** A button, not a one-click GET: mail scanners open every link and would verify addresses on their own. */
export default async function VerifyBookingEmail({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const done = sp.done === "1";
  const doctor = typeof sp.d === "string" ? sp.d.slice(0, 120) : "";
  const bad = sp.bad === "1" || (!done && !token);
  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Appointment emails</h1>
        <div className="panel pad">
          {done ? (
            <p style={{ margin: 0 }}>Confirmed. This address will now receive appointment requests, confirmations and cancellations{doctor ? ` for ${doctor}` : ""}. The doctor can remove it at any time from their calendar settings.</p>
          ) : bad ? (
            <p style={{ margin: 0 }}>This link is not valid or has expired. Ask the doctor to resend the verification email from their calendar settings.</p>
          ) : (
            <form action={confirm}>
              <input type="hidden" name="t" value={token} />
              <p style={{ marginTop: 0 }}>Receive appointment emails at this address? Each one includes the patient&rsquo;s name and mobile number, for this practice&rsquo;s use only.</p>
              <button type="submit" className="btn solid" style={{ width: "100%" }}>Confirm this address</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
