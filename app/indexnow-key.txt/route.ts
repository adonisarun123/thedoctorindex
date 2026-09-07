import { indexNowKey } from "@/lib/seo/indexnow";

/** IndexNow key file: proves to the receiving engines that submissions for this host are ours. 404 until INDEXNOW_KEY is set. */
export const dynamic = "force-dynamic";

export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
