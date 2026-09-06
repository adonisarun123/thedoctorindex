import { XML_HEADERS, directoryEntries, renderUrlset } from "@/lib/seo/sitemap";

/**
 * Homepage, national speciality pages, and the city and locality combinations
 * that clear their inventory gate. Combinations below threshold are absent —
 * they are still served to people, just not submitted.
 */
/** Regenerated hourly so a newly cleared gate reaches the sitemap without a deploy. */
export const revalidate = 3600;

export async function GET() {
  return new Response(renderUrlset(await directoryEntries()), { headers: XML_HEADERS });
}
