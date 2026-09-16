import Link from "next/link";
import type { ReactNode } from "react";

export { hrefs, plain, words } from "@/lib/content/text";

/**
 * A deliberately small inline syntax for editorial copy.
 *
 * Editorial bodies are stored as data (plain strings in a block list), not as
 * JSX. That is what makes it possible to count a post's words, pull its
 * headings into a contents list, extract every internal link for a test, and
 * emit an honest `wordCount` and description in structured data — none of
 * which you can do against an opaque ReactNode.
 *
 * The cost is that prose needs some way to carry emphasis and links, so this
 * module implements exactly four inline forms and nothing else:
 *
 *   **bold**        strong emphasis
 *   *italic*        emphasis
 *   `code`          literal strings, registration numbers, URLs to type
 *   [label](/path)  a link — internal paths use next/link, anything with a
 *                   scheme opens in a new tab and is not endorsed with follow
 *
 * There is no raw HTML escape hatch on purpose: a body that needs one is a
 * body that should be a component instead.
 */

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/** Render one string of inline copy. */
export function rich(text: string, keyPrefix = "r"): ReactNode[] {
  return text
    .split(TOKEN)
    .filter((part) => part !== "")
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      const link = LINK.exec(part);
      if (link) {
        const [, label, href] = link;
        if (href.startsWith("/")) {
          return (
            <Link key={key} href={href}>
              {label}
            </Link>
          );
        }
        return (
          <a key={key} href={href} target="_blank" rel="noopener nofollow">
            {label}
          </a>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) return <b key={key}>{part.slice(2, -2)}</b>;
      if (part.startsWith("`") && part.endsWith("`")) return <code key={key} className="mono">{part.slice(1, -1)}</code>;
      if (part.startsWith("*") && part.endsWith("*")) return <i key={key}>{part.slice(1, -1)}</i>;
      return part;
    });
}
