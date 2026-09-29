"use client";

import { useEffect, useRef, useState } from "react";

import type { LookupDoctor } from "@/app/api/doctor-lookup/route";
import { Avatar } from "@/components/Avatar";
import { sendConversion } from "@/lib/conversions";

/**
 * "Find your profile" on the doctor landing page. A doctor types their own
 * name; each match offers the one next step that will work for it:
 *   unclaimed → claim it (tagged with the ad channel)
 *   claimed   → sign in to the dashboard
 * and "none of these" leads to creating a new profile. Results are the public
 * directory only (app/api/doctor-lookup).
 */
export function DoctorLpSearch({ src, autoFocus = false }: { src: string; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<LookupDoctor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const searchedOnce = useRef(false);
  const seq = useRef(0);

  useEffect(() => {
    const term = q.trim();
    if (term.replace(/^dr\.?\s*/i, "").length < 3) {
      setResults(null);
      setLoading(false);
      return;
    }
    const mine = ++seq.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/doctor-lookup?q=${encodeURIComponent(term)}`);
        const data = (await r.json()) as { doctors: LookupDoctor[] };
        if (mine !== seq.current) return;
        setResults(data.doctors);
        if (!searchedOnce.current) {
          searchedOnce.current = true;
          sendConversion("doctor_lp_search", { src });
        }
      } catch {
        if (mine === seq.current) setResults([]);
      } finally {
        if (mine === seq.current) setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [q, src]);

  const tag = `src=${encodeURIComponent(src)}`;
  const createHref = `/add-doctor?${tag}`;

  return (
    <div className="lp-find">
      <label className="lp-find-label" htmlFor="lp-q">
        Search your name
      </label>
      <div className="lp-find-box">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="lp-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Dr Anita Sharma"
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="search"
          autoFocus={autoFocus}
          aria-describedby="lp-find-hint"
        />
        {loading ? <span className="lp-spin" aria-hidden="true" /> : null}
      </div>
      <div id="lp-find-hint" className="lp-find-hint">
        As it appears on your registration. At least 3 letters.
      </div>

      <div aria-live="polite">
        {results && results.length > 0 ? (
          <ul className="lp-results">
            {results.map((d) => (
              <li key={d.slug} className="lp-result">
                <Avatar name={d.name} id={d.id} photoUrl={d.photoUrl} size={44} />
                <div className="lp-result-t">
                  <div className="nm">{d.name}</div>
                  <div className="sub">{[d.specialty, d.city].filter(Boolean).join(" · ")}</div>
                </div>
                {d.claimed ? (
                  <a className="btn quiet lp-result-act" href="/sign-in?next=%2Fdashboard">
                    Claimed · Sign in
                  </a>
                ) : (
                  <a
                    className="btn solid lp-result-act"
                    href={`/claim-profile?profile=${encodeURIComponent(d.slug)}&${tag}`}
                    onClick={() => sendConversion("doctor_lp_claim_click", { src })}
                  >
                    This is me
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        {results && results.length === 0 && !loading ? (
          <div className="lp-empty">
            <b>No profile found for “{q.trim()}”.</b> Try a shorter spelling, or create one now — it takes a few minutes.
          </div>
        ) : null}
      </div>

      <div className="lp-find-foot">
        {results ? "Not in the list?" : "Not listed yet?"}{" "}
        <a href={createHref} onClick={() => sendConversion("doctor_lp_create_click", { src })}>
          Create your free profile →
        </a>
      </div>
    </div>
  );
}
