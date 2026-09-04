import { XML_HEADERS, directoryEntries, renderUrlset } from "@/lib/seo/sitemap";

/**
 * Homepage, national speciality pages, and the city and locality combinations
 * that clear their inventory gate. Combinations below threshold are absent —
 * they are still served to people, just not submitted.
 */
export async function GET() {
  return new Response(renderUrlset(await directoryEntries()), { headers: XML_HEADERS });
}
