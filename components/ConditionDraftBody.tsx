import { anchorId } from "@/lib/blog/types";
import type { DraftSection } from "@/lib/conditions/types";

/**
 * Renders a compiled condition draft.
 *
 * Third-party text is rendered as plain text — never through the inline
 * link/emphasis syntax used for our own copy — so a stray `*` or `[` in a
 * source paragraph cannot turn into markup. Each source section carries a
 * small source tag so the reader can see whose words they are reading.
 */
export function ConditionDraftBody({ sections, sourceLabel }: { sections: DraftSection[]; sourceLabel: (id: string) => string | null }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = `s${i}`;
        const from = s.kind === "source" ? s.sourceIds.map(sourceLabel).filter(Boolean) : [];
        return (
          <section key={key}>
            <h2 id={anchorId(s.heading)}>{s.heading}</h2>
            {from.length ? (
              <p className="mono" style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "-4px" }}>
                From: {from.join(" · ")}
              </p>
            ) : null}
            {s.blocks.map((b, j) =>
              b.k === "p" ? (
                <p key={`${key}-${j}`}>{b.text}</p>
              ) : (
                <ul key={`${key}-${j}`}>
                  {b.items.map((item, n) => (
                    <li key={`${key}-${j}-${n}`}>{item}</li>
                  ))}
                </ul>
              ),
            )}
            {s.terms?.length ? (
              <dl className="termlist">
                {s.terms.map((t, n) => (
                  <div key={`${key}-t${n}`} className="term">
                    <dt>
                      {t.term}
                      {t.frequency ? <span className="mono freq"> · {t.frequency}</span> : null}
                    </dt>
                    {t.definition ? <dd>{t.definition}</dd> : null}
                  </div>
                ))}
              </dl>
            ) : null}
          </section>
        );
      })}
    </>
  );
}
