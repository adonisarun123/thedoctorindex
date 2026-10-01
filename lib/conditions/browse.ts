/** Pure helpers shared by the condition hubs and their tests. */

export const LETTERS = [..."abcdefghijklmnopqrstuvwxyz", "0-9"] as const;
export type Letter = (typeof LETTERS)[number];

/** First-letter bucket for the A–Z browse: a–z, or "0-9" for anything else. */
export function letterOf(name: string): Letter {
  const c = name.trim().charAt(0).toLowerCase();
  return (c >= "a" && c <= "z" ? c : "0-9") as Letter;
}

export function isLetter(v: string): v is Letter {
  return (LETTERS as readonly string[]).includes(v);
}

export function letterLabel(l: Letter): string {
  return l === "0-9" ? "0–9" : l.toUpperCase();
}

export const paths = {
  hub: () => "/conditions",
  condition: (slug: string) => `/conditions/${slug}`,
  department: (slug: string) => `/conditions/department/${slug}`,
  letter: (l: Letter) => `/conditions/browse/${l}`,
};
