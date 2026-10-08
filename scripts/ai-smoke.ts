/**
 * npm run ai:smoke — checks the live model calls behind plain-language search
 * (lib/search/interpret.ts). Uses ANTHROPIC_API_KEY from .env.local. Prints
 * what each sample query was read as, and the latency; exits 1 on any failure.
 */
import "dotenv/config";
import { config } from "dotenv";

config({ path: ".env.local", override: true });

const SAMPLES = [
  "my son has had fever for three days, near HSR layout",
  "पेट में दर्द और उल्टी",
  "ಮೊಣಕಾಲು ನೋವು ಜಯನಗರ",
  "Dr Ravi Joshi bone marrow transplant",
  "sudden weakness on left side of body",
];

async function main() {
  const { readQuery } = await import("../lib/search/interpret");
  let failed = 0;
  for (const q of SAMPLES) {
    const t = Date.now();
    try {
      const r = await readQuery(q.toLowerCase());
      console.log(`OK  ${Date.now() - t}ms  ${q}\n    → ${JSON.stringify(r)}`);
    } catch (e) {
      failed++;
      console.log(`ERR ${q}\n    → ${(e as Error).message.slice(0, 300)}`);
    }
  }
  // The dashboard bio drafter's model (app/dashboard/draft-actions.ts).
  const { askJson } = await import("../lib/news/llm");
  const t = Date.now();
  try {
    const r = await askJson<{ about?: string }>({
      system: 'Write a two-sentence professional introduction from the facts given. Reply with one JSON object: {"about": "..."}',
      user: JSON.stringify({ name: "Dr Test Example", speciality: "Dermatology", practices: ["Example Clinic, Jayanagar, Bengaluru"], languages: ["English", "Kannada"] }),
      model: process.env.DRAFT_MODEL || "claude-sonnet-5-5",
      maxTokens: 600,
      timeoutMs: 30_000,
      noThinking: true,
    });
    console.log(`OK  ${Date.now() - t}ms  bio drafter\n    → ${r.about}`);
  } catch (e) {
    failed++;
    console.log(`ERR bio drafter\n    → ${(e as Error).message.slice(0, 300)}`);
  }
  process.exit(failed ? 1 : 0);
}

main();
