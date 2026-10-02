/**
 * Appointment booking rules. Pure: no database, so they are unit-tested.
 *
 * All wall-clock times are Asia/Kolkata (UTC+05:30, no daylight saving), which
 * lets slot maths stay in plain arithmetic instead of a timezone library.
 */

export const IST_OFFSET_MIN = 330;
export const BOOKING_WINDOW_DAYS = 14;
/** A patient cannot book a slot starting sooner than this. */
export const MIN_LEAD_MINUTES = 60;

/* ---------------------------------------------------------------------- */
/* Unlock: the calendar opens once the profile is complete                 */
/* ---------------------------------------------------------------------- */

export interface UnlockFacts {
  registrationVerified: boolean;
  practices: number;
  practicesWithFee: number;
  aboutChars: number;
  aboutHasSuperlative: boolean;
  services: number;
  languages: number;
  modes: number;
}

export interface Requirement {
  key: string;
  label: string;
  detail: string;
  done: boolean;
  href: string;
}

/**
 * What "a completed profile" means for unlocking the calendar. Deliberately
 * limited to what the doctor can do themselves today — not HPR linking or
 * staff-side qualification checks, which would keep the calendar locked for
 * reasons outside the doctor's control.
 */
export function bookingRequirements(f: UnlockFacts): Requirement[] {
  return [
    { key: "registration", label: "Registration verified", detail: f.registrationVerified ? "Matched in the register" : "Your registration has not been matched in the register yet", done: f.registrationVerified, href: "/dashboard/verification" },
    { key: "practice", label: "A practice location", detail: f.practices ? `${f.practices} on record` : "Add where you consult", done: f.practices > 0, href: "/dashboard/practices" },
    { key: "fee", label: "Consultation fee for every practice", detail: f.practices ? `${f.practicesWithFee} of ${f.practices} have a fee` : "Add a practice first", done: f.practices > 0 && f.practicesWithFee === f.practices, href: "/dashboard/practices" },
    { key: "about", label: "Professional introduction", detail: f.aboutChars >= 80 && !f.aboutHasSuperlative ? "Done" : "2–4 factual sentences, 80+ characters, no superlatives", done: f.aboutChars >= 80 && !f.aboutHasSuperlative, href: "/dashboard/profile" },
    { key: "services", label: "At least 3 services", detail: `${f.services} listed`, done: f.services >= 3, href: "/dashboard/profile" },
    { key: "languages", label: "Languages and consultation modes", detail: f.languages && f.modes ? "Done" : "Add the languages you consult in", done: f.languages > 0 && f.modes > 0, href: "/dashboard/profile" },
  ];
}

export const isUnlocked = (reqs: Requirement[]) => reqs.every((r) => r.done);

/* ---------------------------------------------------------------------- */
/* Weekly hours                                                            */
/* ---------------------------------------------------------------------- */

export interface Rule {
  practiceId: string;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
}

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const toMinutes = (t: string) => {
  const m = HHMM.exec(t);
  if (!m) throw new Error(`"${t}" is not a time. Use 24-hour HH:MM, e.g. 09:30 or 17:00.`);
  return Number(m[1]) * 60 + Number(m[2]);
};

export function validateRules(rules: Rule[]): void {
  for (const r of rules) {
    if (!(Number.isInteger(r.weekday) && r.weekday >= 0 && r.weekday <= 6)) throw new Error("Day of week out of range.");
    if (![10, 15, 20, 30, 45, 60].includes(r.slotMinutes)) throw new Error("Slot length must be 10, 15, 20, 30, 45 or 60 minutes.");
    const a = toMinutes(r.startTime);
    const b = toMinutes(r.endTime);
    if (b <= a) throw new Error(`${r.startTime}–${r.endTime}: the session must end after it starts.`);
    if (b - a < r.slotMinutes) throw new Error(`${r.startTime}–${r.endTime} is shorter than one ${r.slotMinutes}-minute slot.`);
  }
  // A doctor is in one place at a time: sessions on the same day must not overlap, across practices too.
  for (let d = 0; d < 7; d++) {
    const day = rules.filter((r) => r.weekday === d).map((r) => [toMinutes(r.startTime), toMinutes(r.endTime)] as const).sort((x, y) => x[0] - y[0]);
    for (let i = 1; i < day.length; i++) if (day[i][0] < day[i - 1][1]) throw new Error(`Two sessions overlap on ${WEEKDAYS[d]}.`);
  }
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------------------------------------------------------------------- */
/* Slots                                                                   */
/* ---------------------------------------------------------------------- */

export interface Slot {
  practiceId: string;
  startsAt: Date;
  endsAt: Date;
  /** "2026-10-05" in IST */
  day: string;
  /** "09:30" in IST */
  time: string;
}

/** IST calendar date (YYYY-MM-DD) and weekday of an instant. */
export function istDay(at: Date): { day: string; weekday: number } {
  const t = new Date(at.getTime() + IST_OFFSET_MIN * 60_000);
  return { day: t.toISOString().slice(0, 10), weekday: t.getUTCDay() };
}

/** The instant of an IST wall-clock time on an IST date. */
export function istInstant(day: string, minutes: number): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, minutes) - IST_OFFSET_MIN * 60_000);
}

export function generateSlots(opts: {
  rules: Rule[];
  /** IST dates with no bookings */
  blockedDays: string[];
  /** startsAt of live (requested/confirmed) appointments */
  taken: Date[];
  now: Date;
  days?: number;
  leadMinutes?: number;
}): Slot[] {
  const days = opts.days ?? BOOKING_WINDOW_DAYS;
  const earliest = opts.now.getTime() + (opts.leadMinutes ?? MIN_LEAD_MINUTES) * 60_000;
  const blocked = new Set(opts.blockedDays);
  const taken = new Set(opts.taken.map((d) => d.getTime()));
  const out: Slot[] = [];
  const today = istDay(opts.now).day;
  for (let i = 0; i < days; i++) {
    const day = istInstant(today, 0);
    const date = new Date(day.getTime() + i * 86_400_000);
    const { day: ds, weekday } = istDay(date);
    if (blocked.has(ds)) continue;
    for (const r of opts.rules.filter((x) => x.weekday === weekday)) {
      const end = toMinutes(r.endTime);
      for (let m = toMinutes(r.startTime); m + r.slotMinutes <= end; m += r.slotMinutes) {
        const startsAt = istInstant(ds, m);
        if (startsAt.getTime() < earliest || taken.has(startsAt.getTime())) continue;
        out.push({ practiceId: r.practiceId, startsAt, endsAt: new Date(startsAt.getTime() + r.slotMinutes * 60_000), day: ds, time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}` });
      }
    }
  }
  return out.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

/** "Mon 5 Oct, 09:30" in IST. */
export function formatIst(at: Date): string {
  return at.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}
