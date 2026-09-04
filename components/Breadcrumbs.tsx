import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  name: string;
  path?: string;
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
            {item.path ? <Link href={item.path}>{item.name}</Link> : <span>{item.name}</span>}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
