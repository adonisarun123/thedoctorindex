"use client";

import { useEffect, useState } from "react";

export type ThemeChoice = "auto" | "light" | "dark";
const KEY = "tdi-theme";
const ORDER: ThemeChoice[] = ["auto", "light", "dark"];
const LABEL: Record<ThemeChoice, string> = { auto: "Theme: follows your system", light: "Theme: light", dark: "Theme: dark" };

/**
 * Inline script for <head>: applies the stored choice before first paint so
 * there is no flash. "auto" removes the attribute and lets the
 * prefers-color-scheme media query in globals.css decide.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(KEY)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}else{document.documentElement.removeAttribute("data-theme");}}catch(e){}})();`;

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
  try {
    if (choice === "auto") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    /* private mode; the choice lasts for this page only */
  }
}

export function ThemeToggle({ compact = true }: { compact?: boolean }) {
  const [choice, setChoice] = useState<ThemeChoice>("auto");
  useEffect(() => {
    try {
      const t = localStorage.getItem(KEY);
      if (t === "light" || t === "dark") setChoice(t);
    } catch {
      /* ignore */
    }
  }, []);
  const next = ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
  const glyph = choice === "auto" ? "◐" : choice === "light" ? "☀" : "☾";
  return (
    <button
      type="button"
      className={`themebtn${compact ? "" : " wide"}`}
      title={`${LABEL[choice]} — click for ${next}`}
      aria-label={`${LABEL[choice]}. Switch to ${next}.`}
      onClick={() => {
        setChoice(next);
        applyTheme(next);
      }}
    >
      <span aria-hidden="true">{glyph}</span>
      {compact ? null : <span>{choice === "auto" ? "Auto" : choice === "light" ? "Light" : "Dark"}</span>}
    </button>
  );
}
