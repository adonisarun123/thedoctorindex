import { XML_HEADERS, doctorEntriesFile, renderUrlset } from "@/lib/seo/sitemap";

/** Indexable doctor profiles, file 1 of N. A profile that fails its gate never appears here. Regenerated hourly. */
export const revalidate = 3600;

export async function GET() {
  return new Response(renderUrlset((await doctorEntriesFile(1)) ?? []), { headers: XML_HEADERS });
}
