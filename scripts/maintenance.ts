import { config } from "dotenv";

config({ path: ".env.local" });
config();

/** `npm run db:maintenance` — same job the cron endpoint runs. */
async function main() {
  const { runMaintenance } = await import("../lib/services/maintenance");
  const r = await runMaintenance(null);
  console.log(JSON.stringify(r, null, 2));
}
main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
