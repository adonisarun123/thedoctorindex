import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * `npm run seo:indexnow -- --site https://www.thedoctorindex.com [--dry] [--only doctors|directory|editorial]`
 *
 * Submits every URL the sitemaps publish to IndexNow (Bing, Yandex, Naver,
 * Seznam, Yep — not Google). `db:maintenance` only pushes profiles changed in
 * the last two days; this is the full-corpus push to run after an import or a
 * gate change. It was done once by hand on 21 Sep (28,480 URLs); this makes it
 * repeatable.
 *
 * Before sending anything it fetches the live key file and checks it matches
 * INDEXNOW_KEY, so a run against the wrong host (NEXT_PUBLIC_SITE_URL still on
 * the .in default, a preview URL) stops instead of submitting URLs the
 * protocol will reject. Needs outbound HTTPS — run it from a normal terminal.
 */
async function main() {
  const dry = process.argv.includes("--dry");
  // Set before lib/env is imported: .env.local usually points at localhost.
  const si = process.argv.indexOf("--site");
  if (si >= 0 && process.argv[si + 1]) process.env.NEXT_PUBLIC_SITE_URL = process.argv[si + 1];
  const oi = process.argv.indexOf("--only");
  const only = oi >= 0 ? process.argv[oi + 1] : null;
  (globalThis as unknown as { React?: unknown }).React = (await import("react")).default;
  const { conditionEntries, directoryEntries, doctorEntries, editorialEntries } = await import("../lib/seo/sitemap");
  const { indexNowKey, KEY_PATH, submitToIndexNow } = await import("../lib/seo/indexnow");
  const { absoluteUrl } = await import("../lib/site");

  const key = indexNowKey();
  if (!key) throw new Error("INDEXNOW_KEY is not set (or not a valid key) in .env.local");
  const keyUrl = absoluteUrl(KEY_PATH);
  const live = await fetch(keyUrl).then((r) => (r.ok ? r.text() : `HTTP ${r.status}`)).catch((e: Error) => `unreachable: ${e.message}`);
  if (live.trim() !== key) throw new Error(`${keyUrl} does not serve INDEXNOW_KEY (got "${live.trim().slice(0, 40)}"). Check NEXT_PUBLIC_SITE_URL.`);

  const [doctors, directory, editorial, conditions] = await Promise.all([
    !only || only === "doctors" ? doctorEntries() : Promise.resolve([]),
    !only || only === "directory" ? directoryEntries() : Promise.resolve([]),
    !only || only === "editorial" ? Promise.resolve(editorialEntries()) : Promise.resolve([]),
    !only || only === "conditions" ? Promise.resolve(conditionEntries()) : Promise.resolve([]),
  ]);
  const urls = [...new Set([...doctors, ...directory, ...editorial, ...conditions].map((e) => e.loc))];
  console.log(`key verified at ${keyUrl}`);
  console.log(`profiles ${doctors.length} · directory ${directory.length} · editorial ${editorial.length} · conditions ${conditions.length} · unique ${urls.length}`);
  if (dry) return console.log("dry run: nothing submitted");
  const res = await submitToIndexNow(urls);
  console.log(`submitted ${res.submitted} in ${res.batches} batch(es), HTTP ${res.status.join(", ") || "—"}${res.skipped ? ` (skipped: ${res.skipped})` : ""}`);
  if (res.status.some((s) => s >= 400)) process.exitCode = 1;
}

main().then(() => process.exit(process.exitCode ?? 0)).catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
