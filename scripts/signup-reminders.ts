import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Preview or run the signup reminders from a terminal.
 *
 *   npm run reminders:signup              # dry run: who is due today, nothing sent
 *   npm run reminders:signup -- --preview # dry run plus the full text of each email
 *   npm run reminders:signup -- --send    # actually send (uses EMAIL_PROVIDER)
 */
async function main() {
  const { runSignupReminders, stalledSignups, reminderSecret, registerMatches } = await import("../lib/services/signup-reminders");
  const { actionUrl, composeReminder, dueStep, matchUrl, unsubscribeUrl } = await import("../lib/signup-reminders");
  const { env } = await import("../lib/env");
  const send = process.argv.includes("--send");
  const preview = process.argv.includes("--preview");

  const report = await runSignupReminders({ send });
  console.log(JSON.stringify({ ...report, items: undefined }, null, 2));
  for (const i of report.items) console.log(`${i.result.padEnd(12)} ${i.stage.padEnd(15)} step ${i.step}  ${i.email}`);

  if (preview) {
    const now = new Date();
    for (const c of await stalledSignups()) {
      const due = dueStep(c, now);
      if (!due) continue;
      const matches = (await registerMatches(c.displayName).catch(() => [])).map((x) => ({ ...x, url: matchUrl(env.siteUrl, x, due.stage, due.step) }));
      const m = composeReminder({ ...due, matches, displayName: c.displayName, actionUrl: actionUrl(env.siteUrl, c, due.stage, due.step), unsubscribeUrl: unsubscribeUrl(env.siteUrl, c.userId, reminderSecret()) });
      console.log(`\n────────── to ${c.email}\nSubject: ${m.subject}\n\n${m.text}`);
    }
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
