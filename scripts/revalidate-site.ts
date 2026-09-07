import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Drops the deployed site's public data cache.
 *
 * A CLI import writes straight to Postgres, where the running site cannot see
 * it: the data cache holds counts and listings for an hour and the browse
 * pages sit in a shared cache for a minute. Until both are dropped a hub page
 * can advertise a count the listing under it no longer has — which is exactly
 * what a bulk import produces. `npm run db:revalidate` posts to the site's
 * revalidation route with the same bearer secret the cron uses.
 *
 * Needs SITE_REVALIDATE_URL (or NEXT_PUBLIC_SITE_URL) and CRON_SECRET. Missing
 * either is a warning, not a failure: an import into a local database has no
 * deployed site to notify.
 */
export async function revalidateSite(): Promise<boolean> {
  const base = process.env.SITE_REVALIDATE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.warn("revalidate: skipped (set NEXT_PUBLIC_SITE_URL and CRON_SECRET to refresh the deployed site)");
    return false;
  }
  const url = new URL("/api/revalidate", base).toString();
  try {
    const res = await fetch(url, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
    if (!res.ok) {
      console.warn(`revalidate: ${url} returned ${res.status}`);
      return false;
    }
    console.log(`revalidate: ${url} ok`);
    return true;
  } catch (e) {
    console.warn(`revalidate: ${url} unreachable — ${(e as Error).message}`);
    return false;
  }
}

if (process.argv[1] && process.argv[1].endsWith("revalidate-site.ts")) {
  revalidateSite().then((ok) => process.exit(ok ? 0 : 1));
}
