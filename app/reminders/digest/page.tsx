import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { verifyDigestToken } from "@/lib/doctor-digest";
import { optOutOfDigest } from "@/lib/services/doctor-digest";
import { reminderSecret } from "@/lib/services/signup-reminders";

export const metadata: Metadata = { title: "Stop monthly emails", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function valid(u: string, t: string): boolean {
  return UUID.test(u) && t.length > 0 && t.length < 100 && verifyDigestToken(u, t, reminderSecret());
}

async function unsubscribe(form: FormData) {
  "use server";
  const u = String(form.get("u") ?? "");
  const t = String(form.get("t") ?? "");
  if (!valid(u, t)) redirect("/reminders/digest?bad=1");
  await optOutOfDigest(u);
  redirect("/reminders/digest?done=1");
}

/** Confirmation step, not a one-click GET: mail scanners open every link. */
export default async function DigestUnsubscribe({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = typeof sp.u === "string" ? sp.u : "";
  const t = typeof sp.t === "string" ? sp.t : "";
  const done = sp.done === "1";
  const bad = sp.bad === "1" || (!done && !valid(u, t));
  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Monthly profile emails</h1>
        <div className="panel pad">
          {done ? (
            <p style={{ margin: 0 }}>Done. We will not send you the monthly profile email again. Enquiry and review notifications are unaffected.</p>
          ) : bad ? (
            <p style={{ margin: 0 }}>This link is not valid. Use the link from the most recent email, or write to us and we will stop them.</p>
          ) : (
            <form action={unsubscribe}>
              <input type="hidden" name="u" value={u} />
              <input type="hidden" name="t" value={t} />
              <p style={{ marginTop: 0 }}>Stop the monthly email about how patients find your profile?</p>
              <button type="submit" className="btn solid" style={{ width: "100%" }}>Stop monthly emails</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
