"use client";

import { useState } from "react";

import { COUNCIL_GROUPS, COUNCIL_NAMES, OTHER_COUNCIL } from "@/lib/data/councils";

/**
 * Registering-body picker shared by the public add-doctor flow and the admin
 * create form. Grouped by how the profession is regulated; the last option
 * reveals a text box so a body missing from the list can still be entered.
 * Submits one field, `name`, carrying the chosen or typed name.
 */
export function CouncilSelect({ name = "council", id = "council", value, defaultValue, onChange }: { name?: string; id?: string; value?: string; defaultValue?: string; onChange?: (council: string) => void }) {
  const initial = value ?? defaultValue ?? COUNCIL_NAMES[0];
  const listed = COUNCIL_NAMES.includes(initial);
  const [choice, setChoice] = useState(listed ? initial : OTHER_COUNCIL);
  const [other, setOther] = useState(listed ? "" : initial);
  const current = choice === OTHER_COUNCIL ? other : choice;
  const group = COUNCIL_GROUPS.find((g) => g.councils.includes(choice));

  function emit(next: string) {
    onChange?.(next.trim());
  }

  return (
    <>
      <select
        id={id}
        value={choice}
        onChange={(e) => {
          const v = e.target.value;
          setChoice(v);
          emit(v === OTHER_COUNCIL ? other : v);
        }}
      >
        {COUNCIL_GROUPS.map((g) => (
          <optgroup key={g.kind} label={g.label}>
            {g.councils.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        ))}
        <optgroup label="Not listed">
          <option value={OTHER_COUNCIL}>Other council or registering body…</option>
        </optgroup>
      </select>
      {choice === OTHER_COUNCIL ? (
        <input
          type="text"
          id={`${id}-other`}
          aria-label="Name of the council or registering body"
          value={other}
          onChange={(e) => {
            setOther(e.target.value);
            emit(e.target.value);
          }}
          placeholder="Name of the council or registering body, as printed on your certificate"
          required
          style={{ marginTop: "8px" }}
        />
      ) : null}
      <input type="hidden" name={name} value={current} />
      <div className="hint">{group ? group.note : "Any statutory council or professional body. Staff check the number against that body's own register."}</div>
    </>
  );
}
