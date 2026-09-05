"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { LOCALITIES, LOCALITY_KEYS } from "@/lib/data/taxonomy";

/**
 * Filters are query parameters on the canonical listing URL, applied on the
 * server. Two consequences, both deliberate:
 *
 *  - the filtered result list is still real HTML, so it degrades gracefully and
 *    is readable without JavaScript;
 *  - any parameter turns the page into a facet, and the route sets
 *    noindex,follow for it (see lib/seo/gates.ts). We never expose an unlimited
 *    crawlable parameter space.
 */
export function FilterRail({ languages }: { languages: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const get = (k: string) => params.get(k) ?? "";
  const [open, setOpen] = useState(false);
  const active = ["locality", "online", "gender", "language", "experience", "fee", "claimed", "evidence"].filter((k) => get(k)).length;

  return (
    <div className="filters-wrap">
      <button
        type="button"
        className="btn quiet filters-toggle"
        aria-expanded={open}
        aria-controls="filters"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide filters" : `Filters${active ? ` (${active})` : ""}`}
      </button>
    <aside id="filters" className={`panel filters${open ? " show" : ""}`} aria-label="Filter results">
      <div className="fgroup">
        <div className="ftitle">Locality</div>
        <select
          value={get("locality")}
          onChange={(e) => set("locality", e.target.value || null)}
          aria-label="Locality"
        >
          <option value="">All of Bengaluru</option>
          {LOCALITY_KEYS.map((k) => (
            <option key={k} value={k}>
              {LOCALITIES[k].name}
            </option>
          ))}
        </select>
      </div>

      <div className="fgroup">
        <div className="ftitle">Consultation</div>
        <label className="fopt">
          <input
            type="checkbox"
            checked={get("online") === "1"}
            onChange={(e) => set("online", e.target.checked ? "1" : null)}
          />
          Offers online consultation
        </label>
      </div>

      <div className="fgroup">
        <div className="ftitle">Gender</div>
        {[
          ["", "Any"],
          ["F", "Female"],
          ["M", "Male"],
        ].map(([value, label]) => (
          <label className="fopt" key={label}>
            <input
              type="radio"
              name="gender"
              checked={get("gender") === value}
              onChange={() => set("gender", value || null)}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="fgroup">
        <div className="ftitle">Language</div>
        <select
          value={get("language")}
          onChange={(e) => set("language", e.target.value || null)}
          aria-label="Language"
        >
          <option value="">Any language</option>
          {languages.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="fgroup">
        <div className="ftitle">Experience</div>
        <select
          value={get("experience")}
          onChange={(e) => set("experience", e.target.value || null)}
          aria-label="Minimum years of experience"
        >
          <option value="">Any</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
          <option value="20">20+ years</option>
        </select>
      </div>

      <div className="fgroup">
        <div className="ftitle">Fee</div>
        <select
          value={get("fee")}
          onChange={(e) => set("fee", e.target.value || null)}
          aria-label="Maximum consultation fee"
        >
          <option value="">Any</option>
          <option value="600">Up to ₹600</option>
          <option value="800">Up to ₹800</option>
          <option value="1000">Up to ₹1,000</option>
        </select>
        <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "6px" }}>
          Applied only where the fee was reconfirmed in the last 90 days.
        </div>
      </div>

      <div className="fgroup">
        <div className="ftitle">Trust</div>
        <label className="fopt">
          <input
            type="checkbox"
            checked={get("claimed") === "1"}
            onChange={(e) => set("claimed", e.target.checked ? "1" : null)}
          />
          Claimed by the doctor
        </label>
        <label className="fopt">
          <input
            type="checkbox"
            checked={get("evidence") === "1"}
            onChange={(e) => set("evidence", e.target.checked ? "1" : null)}
          />
          Has visit-evidence reviews
        </label>
      </div>

      <div className="fgroup">
        <button
          type="button"
          className="btn quiet"
          style={{ width: "100%" }}
          onClick={() => router.push(pathname, { scroll: false })}
        >
          Clear filters
        </button>
      </div>
    </aside>
    </div>
  );
}
