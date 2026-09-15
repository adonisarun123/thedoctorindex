"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SuggestItem {
  id: string;
  /** Section heading the item is shown under ("Specialities", "Doctors", "Places"). */
  group: string;
  label: string;
  detail?: string;
  /** What the input shows once the item is picked. */
  text: string;
  /** Where picking the item goes directly (a profile), when it is a destination rather than a value. */
  href?: string;
}

/**
 * A text input with a suggestion list under it — an ARIA combobox. The
 * caller supplies `load(query, signal)`; this handles debouncing, the
 * in-flight abort, a per-query cache, keyboard navigation and dismissal.
 * Enter with nothing highlighted submits the surrounding form as before,
 * so the box still works exactly like a plain input when the list is
 * empty or ignored.
 */
export function SuggestInput({
  value,
  onChange,
  onPick,
  load,
  placeholder,
  ariaLabel,
  id,
  scope = "",
  minLength = 2,
}: {
  value: string;
  onChange: (text: string) => void;
  onPick: (item: SuggestItem) => void;
  load: (query: string, signal: AbortSignal, scope: string) => Promise<SuggestItem[]>;
  /** Extra context the loader needs (the other field's value); part of the cache key. */
  scope?: string;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  minLength?: number;
}) {
  const reactId = useId();
  const listId = `${id ?? reactId}-list`;
  const [items, setItems] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const cache = useRef(new Map<string, SuggestItem[]>());
  const abort = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const picked = useRef<string | null>(null);
  /** Nothing is fetched for a pre-filled value until the person types or focuses the field. */
  const touched = useRef(false);
  const focused = useRef(false);

  useEffect(() => {
    const q = value.trim();
    if (timer.current) clearTimeout(timer.current);
    abort.current?.abort();
    if (!touched.current || q.length < minLength || picked.current === q) {
      setItems([]);
      setActive(-1);
      return;
    }
    const key = `${scope.trim().toLowerCase()}|${q.toLowerCase()}`;
    const hit = cache.current.get(key);
    if (hit) {
      setItems(hit);
      setActive(-1);
      return;
    }
    timer.current = setTimeout(() => {
      const ctl = new AbortController();
      abort.current = ctl;
      load(q, ctl.signal, scope)
        .then((got) => {
          if (ctl.signal.aborted) return;
          cache.current.set(key, got);
          setItems(got);
          setActive(-1);
          if (focused.current) setOpen(true);
        })
        .catch(() => {
          /* aborted or offline: keep whatever is shown */
        });
    }, 120);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, minLength, load, scope]);

  function pick(item: SuggestItem) {
    picked.current = item.text.trim();
    setOpen(false);
    setItems([]);
    setActive(-1);
    onPick(item);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !items.length) {
      if (e.key === "ArrowDown" && items.length) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      if (active >= 0) {
        e.preventDefault();
        pick(items[active]);
      } else {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const show = open && items.length > 0;
  let lastGroup = "";

  return (
    <div className="sfield">
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => {
          picked.current = null;
          touched.current = true;
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          focused.current = true;
          if (items.length) setOpen(true);
        }}
        onBlur={() => {
          focused.current = false;
          setOpen(false);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={listId}
        aria-activedescendant={show && active >= 0 ? `${listId}-${active}` : undefined}
      />
      {show ? (
        <ul className="sugg" id={listId} role="listbox" onMouseDown={(e) => e.preventDefault()}>
          {items.map((it, i) => {
            const head = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <li key={it.id} role="presentation">
                {head ? <div className="sugg-h">{head}</div> : null}
                <div
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "sugg-o on" : "sugg-o"}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(it)}
                >
                  <span className="sugg-l">{it.label}</span>
                  {it.detail ? <span className="sugg-d">{it.detail}</span> : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
