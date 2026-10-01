import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { optOutOfReminders, reminderSecret } from "@/lib/services/signup-reminders";
import { verifyUnsubscribeToken } from "@/lib/signup-reminders";

export const metadata: Metadata = { title: "Stop signup reminders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function valid(u: string, t: string): boolean {
  return UUID.test(u) && t.length > 0 && t.length < 100 && verifyUnsubscribeToken(u, t, reminderSecret());
}

async function unsubscribe(form: FormData) {
  "use server";
  const u = String(form.get("u") ?? "");
  const t = String(form.get("t") ?? "");
  if (!valid(u, t)) redirect("/reminders/unsubscribe?bad=1");
  await optOutOfReminders(u);
  redirect("/reminders/unsubscribe?done=1");
}

/**
 * Confirmation step, not a one-click GET: mail scanners open every link in a
 * message, and a GET that unsubscribed would opt people out on delivery.
 */
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = typeof sp.u === "string" ? sp.u : "";
  const t = typeof sp.t === "string" ? sp.t : "";
  const done = sp.done === "1";
  const bad = sp.bad === "1" || (!done && !valid(u, t));

  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Signup reminders</h1>
        <div className="panel pad">
          {done ? (
            <p style={{ margin: 0 }}>Done. We will not send you any more reminders about finishing your profile.</p>
          ) : bad ? (
            <p style={{ margin: 0 }}>This link is not valid. Use the link from the most recent reminder email, or write to us and we will stop them.</p>
          ) : (
            <form action={unsubscribe}>
              <input type="hidden" name="u" value={u} />
              <input type="hidden" name="t" value={t} />
              <p style={{ marginTop: 0 }}>Stop the emails reminding you to finish your Doctor Index profile? Your account stays as it is.</p>
              <button type="submit" className="btn solid" style={{ width: "100%" }}>Stop reminders</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
