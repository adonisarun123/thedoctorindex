/**
 * `node scripts/e2e-env.cjs <command>` — runs a command against E2E_DATABASE_URL
 * instead of DATABASE_URL, with the console mailer and its test-only delivery
 * flag. Refuses to run if the two URLs share a host, so a mistyped branch can
 * never point a data-creating test run at production.
 *
 * Runs a command with DATABASE_URL swapped to the e2e branch, so nothing that
 * follows can touch production. The URL is never printed.
 */
const { spawn } = require("node:child_process");
require("dotenv").config({ path: ".env.local", quiet: true });

const branch = process.env.E2E_DATABASE_URL;
if (!branch) { console.error("E2E_DATABASE_URL is not set"); process.exit(1); }
if (branch === process.env.DATABASE_URL) { console.error("REFUSING: e2e URL equals production URL"); process.exit(1); }
if (new URL(branch).host === new URL(process.env.DATABASE_URL).host) { console.error("REFUSING: same host as production"); process.exit(1); }

const env = { ...process.env, DATABASE_URL: branch, DIRECT_URL: branch, EMAIL_PROVIDER: "console", EMAIL_CONSOLE_DELIVERS: "1" };
delete env.SMTP_HOST; // belt and braces: no real mail from a test run
const [cmd, ...args] = process.argv.slice(2);
console.log(`→ ${cmd} ${args.join(" ")}  [db: ${new URL(branch).host.split(".")[0]}, mail: console]`);
spawn(cmd, args, { env, stdio: "inherit", shell: true }).on("exit", (c) => process.exit(c ?? 1));
