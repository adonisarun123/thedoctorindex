import { absoluteUrl } from "@/lib/site";

/**
 * IndexNow: push changed URLs to Bing, Yandex, Naver, Seznam and Yep the moment
 * they change, instead of waiting for a crawl. Google does not take part (it
 * reads the sitemaps' lastmod instead), so both mechanisms run.
 *
 * Needs INDEXNOW_KEY (any 8–128 hex/alphanumeric string). The key is served at
 * /indexnow-key.txt (app/indexnow-key.txt/route.ts) and passed as keyLocation,
 * which is how the protocol proves the submitter controls the host. Without a
 * key every call is a no-op that reports 0 — never an error.
 */

const ENDPOINT = () => process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
export const KEY_PATH = "/indexnow-key.txt";
const BATCH = 10_000;

export function indexNowKey(): string | null {
  const k = (process.env.INDEXNOW_KEY ?? "").trim();
  return /^[a-zA-Z0-9-]{8,128}$/.test(k) ? k : null;
}

export interface IndexNowResult {
  submitted: number;
  batches: number;
  status: number[];
  skipped: "no-key" | "no-urls" | null;
}

export async function submitToIndexNow(urls: string[], fetchImpl: typeof fetch = fetch): Promise<IndexNowResult> {
  const key = indexNowKey();
  const unique = [...new Set(urls.filter((u) => /^https?:\/\//.test(u)))];
  if (!key) return { submitted: 0, batches: 0, status: [], skipped: "no-key" };
  if (!unique.length) return { submitted: 0, batches: 0, status: [], skipped: "no-urls" };
  const host = new URL(absoluteUrl("/")).host;
  const status: number[] = [];
  let submitted = 0;
  for (let i = 0; i < unique.length; i += BATCH) {
    const urlList = unique.slice(i, i + BATCH);
    try {
      const res = await fetchImpl(ENDPOINT(), {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key, keyLocation: absoluteUrl(KEY_PATH), urlList }),
      });
      status.push(res.status);
      // 200 OK, 202 Accepted (key pending validation). Anything else is reported, not retried.
      if (res.status === 200 || res.status === 202) submitted += urlList.length;
    } catch {
      status.push(0);
    }
  }
  return { submitted, batches: status.length, status, skipped: null };
}
