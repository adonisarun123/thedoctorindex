/**
 * Every page declares, in machine-readable form, what it told search engines
 * and why. The client-side RouteInspector renders it as a panel.
 *
 * This is not decoration. The same values are produced by the same gate
 * functions that drive generateMetadata, generateStaticParams and the
 * sitemaps, so if the panel says "noindex", the response header, the meta tag
 * and the sitemap agree with it. It makes an indexation bug visible in one
 * click instead of one crawl.
 */
export interface RouteMetaData {
  route: string;
  title: string;
  h1?: string;
  canonical: string;
  index: boolean;
  /** Why the index decision came out that way. */
  gate?: { name: string; checks: Array<{ label: string; pass: boolean; detail: string }> };
  structuredData: string;
  notes?: Array<{ label: string; text: string }>;
  lastmod?: string;
}

export function RouteMeta({ data }: { data: RouteMetaData }) {
  return (
    <script
      type="application/json"
      id="__route_meta"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
