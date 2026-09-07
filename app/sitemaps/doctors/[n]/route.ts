import { XML_HEADERS, doctorEntriesFile, renderUrlset } from "@/lib/seo/sitemap";

/** Doctor profiles, file n (2…N) — see lib/seo/sitemap.ts. Beyond the last file: 404. Regenerated hourly. */
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ n: string }> {
  return [];
}

export async function GET(_req: Request, ctx: { params: Promise<{ n: string }> }) {
  const n = Number((await ctx.params).n);
  if (!Number.isInteger(n) || n < 2) return new Response("Not found", { status: 404 });
  const entries = await doctorEntriesFile(n);
  if (!entries) return new Response("Not found", { status: 404 });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
