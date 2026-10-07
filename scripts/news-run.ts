import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Run the newsroom pipeline from the command line.
 *   npm run news:run              discover, draft, store — and fill today's slots
 *   npm run news:run -- --no-publish   discover, draft, store only
 *   npm run news:run -- --check   the afternoon safety net only
 *   npm run news:run -- --urls <url> [<url>…]   draft one story from given reports
 */
async function main() {
  const { draftFromUrls, runNewsPipeline, runNewsSafetyNet } = await import("../lib/news/pipeline");
  const { revalidateSite } = await import("./revalidate-site");
  const at = process.argv.indexOf("--urls");
  if (at > 0) console.log(JSON.stringify(await draftFromUrls(process.argv.slice(at + 1)), null, 2));
  else if (process.argv.includes("--check")) console.log(JSON.stringify(await runNewsSafetyNet(), null, 2));
  else console.log(JSON.stringify(await runNewsPipeline({ publish: !process.argv.includes("--no-publish") }), null, 2));
  await revalidateSite();
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
