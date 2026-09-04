import { XML_HEADERS, doctorEntries, renderUrlset } from "@/lib/seo/sitemap";

/** Indexable doctor profiles only. A profile that fails its gate never appears here. */
export function GET() {
  return new Response(renderUrlset(doctorEntries()), { headers: XML_HEADERS });
}
