"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { RouteMetaData } from "@/components/RouteMeta";

/**
 * Route inspector.
 *
 * Shows what the current page declared to search engines: canonical, index
 * rule, the gate arithmetic behind that rule, and the structured-data type.
 * Visible in development, or anywhere with ?inspect=1 — so a technical SEO
 * review on staging needs no build flag and no crawl.
 */
export function RouteInspector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<RouteMetaData | null>(null);
  const [open, setOpen] = useState(false);

  const enabled = process.env.NODE_ENV !== "production" || searchParams.get("inspect") === "1";

  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById("__route_meta");
    if (!el?.textContent) {
      setData(null);
      return;
    }
    try {
      setData(JSON.parse(el.textContent) as RouteMetaData);
    } catch {
      setData(null);
    }
  }, [pathname, searchParams, enabled]);

  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <button
        className="seotoggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="route-inspector"
      >
        Route inspector
      </button>
      <aside
        id="route-inspector"
        className={`seopanel${open ? " open" : ""}`}
        aria-label="Route inspector"
        aria-hidden={!open}
      >
        <div className="ph">
          <span className="t">Route inspector</span>
          <button onClick={() => setOpen(false)} aria-label="Close inspector">
            &times;
          </button>
        </div>
        <div className="seobody">
          {!data ? (
            <div className="seoitem">
              <div className="k">No declaration</div>
              <div className="n">
                This route did not render a RouteMeta block. Every indexable route should.
              </div>
            </div>
          ) : (
            <>
              <Item k="Route" v={data.route} />
              <Item k="Title" v={data.title} />
              {data.h1 ? <Item k="H1" v={data.h1} /> : null}
              <Item k="Canonical" v={data.canonical} />
              <div className="seoitem">
                <div className="k">Index rule</div>
                <div className="v">
                  <span className={`verdict ${data.index ? "idx" : "no"}`}>
                    {data.index ? "index, follow" : "noindex, follow"}
                  </span>
                </div>
              </div>
              {data.gate ? (
                <div className="seoitem">
                  <div className="k">{data.gate.name}</div>
                  <div className="gate">
                    {data.gate.checks.map((c) => (
                      <div key={c.label}>
                        <span className={c.pass ? "pass" : "fail"}>{c.pass ? "PASS" : "FAIL"}</span>{" "}
                        {c.label} — <i>{c.detail}</i>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <Item k="Structured data" v={data.structuredData} />
              {data.lastmod ? <Item k="lastmod" v={data.lastmod} /> : null}
              {(data.notes ?? []).map((n) => (
                <div className="seoitem" key={n.label}>
                  <div className="k">{n.label}</div>
                  <div className="n">{n.text}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="seoitem">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}
