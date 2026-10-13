/**
 * What a reviewer is called on the public site. Pure, unit-tested.
 *
 * Default is first name plus surname initial ("Anita S."): a review signed by
 * a recognisable person is read as one, and the doctor can reply to a name.
 * The reviewer can tick "hide my name" and appear as "Reviewer A.S." instead.
 * Moderators see the account either way; the full name is never public.
 */

const TITLE = /^(dr|mr|mrs|ms|miss|prof|shri|smt)\.?$/i;

function nameWords(source: string): string[] {
  const base = source.includes("@") ? source.split("@")[0].replace(/[._\-+\d]+/g, " ") : source;
  return base
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}'-]/gu, ""))
    .filter((w) => w.length > 0 && !TITLE.test(w));
}

/** "Anita Sharma" → "Anita S."; "Anita" → "Anita"; an email → from its local part. */
export function firstNameLabel(source: string): string {
  const words = nameWords(source);
  if (words.length === 0) return "Reviewer";
  const first = words[0][0].toUpperCase() + words[0].slice(1).toLowerCase();
  if (words.length === 1) return first;
  return `${first} ${words[words.length - 1][0].toUpperCase()}.`;
}

/** "Anita Sharma" → "Reviewer A.S."; an email → initials of the local part. */
export function pseudonym(source: string): string {
  const initials = nameWords(source).map((w) => w[0].toUpperCase()).slice(0, 2).join(".");
  return `Reviewer ${initials || "A"}.`;
}

export function publicAuthorLabel(source: string, anonymous: boolean): string {
  return anonymous ? pseudonym(source) : firstNameLabel(source);
}
