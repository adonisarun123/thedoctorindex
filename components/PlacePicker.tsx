"use client";

import { useEffect, useState } from "react";

type Opt = { slug: string; name: string };
type Loc = { key: string; slug: string; name: string };

/**
 * State → city → locality selects fed by /api/places. Submits:
 *   locality        existing locality key (when one is chosen)
 *   placeState, placeCity, placeLocality   names, when the person picks
 *                   "somewhere else" — the server creates the row.
 * `level="city"` stops at the city (patient registration).
 */
export function PlacePicker({
  level = "locality",
  initial,
  idPrefix = "place",
  required = true,
  allowNew = true,
  labels = {},
}: {
  level?: "city" | "locality";
  initial?: { stateSlug?: string; citySlug?: string; localityKey?: string };
  idPrefix?: string;
  required?: boolean;
  allowNew?: boolean;
  labels?: { state?: string; city?: string; locality?: string };
}) {
  const [states, setStates] = useState<Opt[]>([]);
  const [cities, setCities] = useState<Opt[]>([]);
  const [localities, setLocalities] = useState<Loc[]>([]);
  const [state, setState] = useState(initial?.stateSlug ?? "");
  const [city, setCity] = useState(initial?.citySlug ?? "");
  const [locality, setLocality] = useState(initial?.localityKey ?? "");
  const [newCity, setNewCity] = useState("");
  const [newLocality, setNewLocality] = useState("");

  useEffect(() => {
    fetch("/api/places").then((r) => r.json()).then(setStates).catch(() => setStates([]));
  }, []);
  useEffect(() => {
    if (!state) return setCities([]);
    fetch(`/api/places?state=${encodeURIComponent(state)}`).then((r) => r.json()).then(setCities).catch(() => setCities([]));
  }, [state]);
  useEffect(() => {
    if (!state || !city || city === "__new") return setLocalities([]);
    fetch(`/api/places?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`).then((r) => r.json()).then(setLocalities).catch(() => setLocalities([]));
  }, [state, city]);

  const stateName = states.find((s) => s.slug === state)?.name ?? "";
  const cityName = city === "__new" ? newCity : cities.find((c) => c.slug === city)?.name ?? "";
  const usingNew = city === "__new" || locality === "__new";

  return (
    <div className="placepicker">
      <div className="field">
        <label htmlFor={`${idPrefix}-state`}>{labels.state ?? "State"}</label>
        <select id={`${idPrefix}-state`} value={state} required={required} onChange={(e) => { setState(e.target.value); setCity(""); setLocality(""); }}>
          <option value="">Choose a state</option>
          {states.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-city`}>{labels.city ?? "City / district"}</label>
        <select id={`${idPrefix}-city`} value={city} required={required} disabled={!state} onChange={(e) => { setCity(e.target.value); setLocality(""); }}>
          <option value="">{state ? "Choose a city" : "Choose a state first"}</option>
          {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          {allowNew && state ? <option value="__new">Another city in {stateName}…</option> : null}
        </select>
        {city === "__new" ? <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="City or district name" required maxLength={80} style={{ marginTop: "6px" }} aria-label="New city name" /> : null}
      </div>
      {level === "locality" ? (
        <div className="field">
          <label htmlFor={`${idPrefix}-locality`}>{labels.locality ?? "Locality / area"}</label>
          <select id={`${idPrefix}-locality`} value={locality} disabled={!city} onChange={(e) => setLocality(e.target.value)}>
            <option value="">{city && city !== "__new" ? `Anywhere in ${cityName}` : "Choose a city first"}</option>
            {localities.map((l) => <option key={l.key} value={l.key}>{l.name}</option>)}
            {allowNew && city ? <option value="__new">Another locality…</option> : null}
          </select>
          {locality === "__new" ? <input type="text" value={newLocality} onChange={(e) => setNewLocality(e.target.value)} placeholder="Locality or area name" required maxLength={80} style={{ marginTop: "6px" }} aria-label="New locality name" /> : null}
        </div>
      ) : null}
      {/* What the server reads. An existing key wins; otherwise names. */}
      <input type="hidden" name="locality" value={usingNew || !locality ? "" : locality} />
      <input type="hidden" name="placeState" value={stateName} />
      <input type="hidden" name="placeCity" value={cityName} />
      <input type="hidden" name="placeLocality" value={locality === "__new" ? newLocality : ""} />
    </div>
  );
}
