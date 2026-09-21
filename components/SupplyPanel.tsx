import type { SupplyFact } from "@/lib/content/supply";

/**
 * The measured-composition block used by state, city and listing pages.
 *
 * It renders only what it is handed. Callers build their sentences with the
 * helpers in lib/content/supply.ts, which return null wherever the data is
 * absent, so a page with sparse records shows a short block rather than a long
 * one full of zeroes and em dashes. `facts` may be empty, `sentences` may be
 * entirely nulls, and the component renders nothing at all if both are.
 */
export function SupplyPanel({
  heading,
  sentences,
  facts,
  footnote,
  children,
}: {
  heading: string;
  sentences: Array<string | null>;
  facts: SupplyFact[];
  footnote?: string | null;
  children?: React.ReactNode;
}) {
  const text = sentences.filter((s): s is string => Boolean(s));
  if (text.length === 0 && facts.length === 0 && !children) return null;

  return (
    <section className="panel pad supply" aria-labelledby="supply-heading">
      <h2 id="supply-heading" style={{ fontSize: "1.22rem", marginBottom: "10px", marginTop: 0 }}>
        {heading}
      </h2>

      {facts.length > 0 ? (
        <dl className="supply-facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                <span className="v">{f.value}</span>
                {f.note ? <span className="note">{f.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {text.map((s) => (
        <p key={s} className="supply-p">
          {s}
        </p>
      ))}

      {children}

      {footnote ? <p className="supply-foot">{footnote}</p> : null}
    </section>
  );
}
