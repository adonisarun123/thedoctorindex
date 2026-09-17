import { anchorId, type Block, type Faq } from "@/lib/blog/types";
import { rich } from "@/lib/content/rich";

/**
 * Renders an editorial body from its block list.
 *
 * Every heading gets a stable id derived from its own text, so the contents
 * list, the in-page anchors and any link somebody shares all agree without a
 * separate id being maintained by hand.
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `b${i}`;
        switch (block.k) {
          case "p":
            return <p key={key}>{rich(block.text, key)}</p>;
          case "h2":
            return (
              <h2 key={key} id={anchorId(block.text)}>
                {rich(block.text, key)}
              </h2>
            );
          case "h3":
            return <h3 key={key}>{rich(block.text, key)}</h3>;
          case "ul":
            return (
              <ul key={key}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{rich(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{rich(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <div key={key} className={`notice${block.tone && block.tone !== "info" ? ` ${block.tone}` : ""}`} style={{ margin: "18px 0" }}>
                {block.title ? <b>{rich(block.title, `${key}-t`)} </b> : null}
                {rich(block.text, key)}
              </div>
            );
          case "quote":
            return (
              <blockquote key={key} className="pull">
                <p>{rich(block.text, key)}</p>
                {block.source ? <cite>{rich(block.source, `${key}-s`)}</cite> : null}
              </blockquote>
            );
          case "steps":
            return (
              <ol key={key} className="procedure">
                {block.items.map((step, j) => (
                  <li key={`${key}-${j}`}>
                    <b>{rich(step.title, `${key}-${j}-t`)}</b>
                    <span>{rich(step.text, `${key}-${j}-d`)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={key} className="tablewrap">
                <table>
                  {block.caption ? <caption>{rich(block.caption, `${key}-c`)}</caption> : null}
                  <thead>
                    <tr>
                      {block.head.map((h, j) => (
                        <th key={`${key}-h${j}`} scope="col">
                          {rich(h, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={`${key}-r${j}`}>
                        {row.map((cell, c) => (
                          // data-h carries the column heading so a narrow
                          // screen can restack the row as a labelled card
                          // instead of forcing a horizontal scroll.
                          <td key={`${key}-r${j}c${c}`} data-h={block.head[c]}>
                            {rich(cell, `${key}-r${j}c${c}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

/** Jump list built from the h2 headings. Hidden on short pieces by the caller. */
export function Contents({ items }: { items: Array<{ id: string; text: string }> }) {
  if (items.length < 3) return null;
  return (
    <nav className="toc" aria-label="On this page">
      <div className="eyebrow">On this page</div>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The questions, rendered as real content rather than a collapsed widget.
 *
 * Google restricts FAQ rich results to authoritative government and health
 * sources, so these are not here for a snippet. They are here because they are
 * the questions people actually type, and because answer engines and
 * assistants read the visible text — which is also why the matching FAQPage
 * markup never says anything the page does not show.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section className="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Questions people ask</h2>
      <dl>
        {faqs.map((f, i) => (
          <div key={`faq-${i}`}>
            <dt>{rich(f.q, `faq-q${i}`)}</dt>
            <dd>{rich(f.a, `faq-a${i}`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
