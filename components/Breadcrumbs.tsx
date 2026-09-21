import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  name: string;
  /**
   * Every crumb carries its own URL, the current page included. The trail
   * below renders the last one as plain text, but BreadcrumbList must emit an
   * `item` for every ListItem: Search Console reports a missing `item` as an
   * error, and a trail whose ancestors have no URL is not a trail.
   */
  path: string;
}

/**
 * Crawlable breadcrumb trail. Paired with BreadcrumbList JSON-LD on every page
 * that renders it, so the visible trail and the markup always match.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        {items.map((item, i) => (
          <Fragment key={`${item.name}-${i}`}>
            {i > 0 ? <span className="sep">/</span> : null}
            {i < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
