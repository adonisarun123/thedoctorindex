import { resolve } from "node:path";

import { articleWordCount } from "../lib/conditions/article";
import { articleProblems } from "../lib/conditions/article-checks";

/**
 * Check one or more article modules against the editorial bar before they
 * are registered:  npx tsx scripts/check-condition-article.ts lib/conditions/articles/asthma.ts …
 */
async function main() {
  let bad = 0;
  for (const file of process.argv.slice(2)) {
    const mod = await import(resolve(file));
    const a = mod.article;
    const problems = articleProblems(a);
    console.log(`${problems.length ? "FAIL" : "ok  "} ${a.slug} (${articleWordCount(a)} words)${problems.map((p) => `\n     - ${p}`).join("")}`);
    if (problems.length) bad++;
  }
  process.exit(bad ? 1 : 0);
}
main();
