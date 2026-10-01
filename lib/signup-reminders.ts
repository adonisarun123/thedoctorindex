import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signup reminders — the pure rules. Who is owed which email, and what it says.
 * The database side (lib/services/signup-reminders.ts) feeds candidates in and
 * records what was sent; nothing here touches the network or the database.
 *
 * Two stages, each a sequence of at most three emails:
 *   setup          — got the one-time code, never finished the details form
 *   doctor_profile — finished the details form, never claimed or created a profile
 *
 * Only doctor journeys are reminded. A patient who abandons an enquiry is a
 * different problem with a different message, and is left alone here.
 */

export type ReminderStage = "setup" | "doctor_profile";

/** Days after the stage began (signup, or details completed) that each step becomes due. */
export const REMINDER_DAYS = [1, 3, 7] as const;
/** Never two reminders closer together than this, even when catching up on old signups. */
export const MIN_GAP_DAYS = 2;
/** A stage that began longer ago than this is not started now; it is stale. */
export const MAX_AGE_DAYS = 45;

const DAY = 86_400_000;

/** Signup journeys that mean "a doctor". Null is an account from before the journey was recorded. */
const DOCTOR_FLOWS = new Set(["claim", "add_doctor", "dashboard"]);

export function isDoctorJourney(flow: string | null): boolean {
  return flow === null || DOCTOR_FLOWS.has(flow);
}

export interface ReminderCandidate {
  userId: string;
  email: string | null;
  displayName: string | null;
  signupFlow: string | null;
  signupNext: string | null;
  createdAt: Date;
  profileCompletedAt: Date | null;
  optedOut: boolean;
  disabled: boolean;
  isStaff: boolean;
  /** Owns a profile, manages one, or has a claim or a submission on file. */
  hasDoctorActivity: boolean;
  /** Steps already sent for the stage the account is in now. */
  sentSteps: number[];
  lastSentAt: Date | null;
}

export function stageOf(c: Pick<ReminderCandidate, "profileCompletedAt" | "hasDoctorActivity">): ReminderStage | null {
  if (c.hasDoctorActivity) return null;
  return c.profileCompletedAt ? "doctor_profile" : "setup";
}

/** The step to send now, or null. One step per run, in order, never a skipped step. */
export function dueStep(c: ReminderCandidate, now: Date): { stage: ReminderStage; step: number } | null {
  if (!c.email || c.optedOut || c.disabled || c.isStaff) return null;
  if (!isDoctorJourney(c.signupFlow)) return null;
  const stage = stageOf(c);
  if (!stage) return null;
  const anchor = stage === "setup" ? c.createdAt : (c.profileCompletedAt as Date);
  const next = c.sentSteps.length + 1;
  if (next > REMINDER_DAYS.length) return null;
  const age = now.getTime() - anchor.getTime();
  if (next === 1 && age > MAX_AGE_DAYS * DAY) return null;
  if (age < REMINDER_DAYS[next - 1] * DAY) return null;
  if (c.lastSentAt && now.getTime() - c.lastSentAt.getTime() < MIN_GAP_DAYS * DAY) return null;
  return { stage, step: next };
}

/* ------------------------------------------------------------------------- */
/* Links                                                                     */
/* ------------------------------------------------------------------------- */

function safePath(p: string | null): string | null {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : null;
}

/** "Dr. Asha K Rao" → "Asha K Rao", for the register search box. */
export function searchName(displayName: string | null): string {
  return (displayName ?? "").replace(/^\s*dr\.?\s+/i, "").replace(/\s+/g, " ").trim();
}

function withUtm(url: string, stage: ReminderStage, step: number): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "tdi");
  u.searchParams.set("utm_medium", "email");
  u.searchParams.set("utm_campaign", `signup_${stage}_${step}`);
  return u.toString();
}

export function actionUrl(siteUrl: string, c: Pick<ReminderCandidate, "signupNext" | "displayName">, stage: ReminderStage, step: number): string {
  const base = siteUrl.replace(/\/$/, "");
  const name = searchName(c.displayName);
  const find = name.split(" ").length >= 2 ? `/claim-profile/find?q=${encodeURIComponent(name)}` : "/claim-profile/find";
  if (stage === "setup") {
    // Signing in with an unfinished account lands on the details form, then returns to `next`.
    const next = safePath(c.signupNext) ?? "/claim-profile/find";
    return withUtm(`${base}/sign-in?next=${encodeURIComponent(next)}`, stage, step);
  }
  return withUtm(`${base}${find}`, stage, step);
}

/* ------------------------------------------------------------------------- */
/* Unsubscribe token                                                         */
/* ------------------------------------------------------------------------- */

export function unsubscribeToken(userId: string, secret: string): string {
  return createHmac("sha256", secret).update(`signup-reminders:${userId}`).digest("base64url").slice(0, 32);
}

export function verifyUnsubscribeToken(userId: string, token: string, secret: string): boolean {
  const want = Buffer.from(unsubscribeToken(userId, secret));
  const got = Buffer.from(token);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function unsubscribeUrl(siteUrl: string, userId: string, secret: string): string {
  return `${siteUrl.replace(/\/$/, "")}/reminders/unsubscribe?u=${userId}&t=${unsubscribeToken(userId, secret)}`;
}

/* ------------------------------------------------------------------------- */
/* Copy                                                                      */
/* ------------------------------------------------------------------------- */

const SUBJECTS: Record<ReminderStage, [string, string, string]> = {
  setup: [
    "Finish creating your Doctor Index profile",
    "Two minutes to finish your Doctor Index profile",
    "Last reminder: your Doctor Index profile is not finished",
  ],
  doctor_profile: [
    "Claim your profile on The Doctor Index",
    "We may already hold a profile built from your registration",
    "Last reminder: claim your Doctor Index profile",
  ],
};

export function composeReminder(input: {
  stage: ReminderStage;
  step: number;
  displayName: string | null;
  actionUrl: string;
  unsubscribeUrl: string;
}): { subject: string; text: string } {
  const { stage, step } = input;
  const first = searchName(input.displayName).split(" ")[0];
  // No "Dr": allied-health professionals sign up too, and a patient may get this.
  const hi = first ? `Hello ${first},` : "Hello,";
  const last = step >= REMINDER_DAYS.length;

  const body =
    stage === "setup"
      ? [
          step === 1
            ? "You started creating an account on The Doctor Index but stopped before finishing."
            : "Your Doctor Index account is still unfinished.",
          "What is left takes about two minutes: your name, mobile number and city, then find your entry in the medical council register and claim your profile.",
          "Your profile is free, permanently, and you control what it shows.",
        ]
      : [
          "Your account is set up. The last step is to find your entry in the medical council register, by name or registration number, and claim your profile.",
          step === 1
            ? "For many registered doctors we already hold a private draft built from the register, so claiming it is a minute's work: check the details and confirm."
            : "If we hold a draft for your registration, you review it before anything is shown publicly. If we do not, you can create your profile from the same page.",
          "If you signed up as a patient rather than a doctor, ignore this email.",
        ];

  const text = [
    hi,
    "",
    ...body.flatMap((p) => [p, ""]),
    stage === "setup" ? `Finish your profile: ${input.actionUrl}` : `Find your registration: ${input.actionUrl}`,
    "",
    last ? "This is the last reminder we will send about this." : "We will send at most one or two more reminders, then stop.",
    "",
    "— The Doctor Index",
    "",
    `Stop these reminders: ${input.unsubscribeUrl}`,
  ].join("\n");

  return { subject: SUBJECTS[stage][Math.min(step, 3) - 1], text };
}
