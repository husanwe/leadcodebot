import { migrate } from "drizzle-orm/neon-http/migrator";
import { bot } from "./bot.ts";
import { db } from "./db.ts";
import { getEnv } from "./util.ts";

await migrate(db, { migrationsFolder: "../drizzle.config.ts" });

if (getEnv("DENO_DEPLOY", false) === "true") {
  const { startWebhook } = await import("./webhook.ts");
  startWebhook(bot);
} else {
  const { startPolling } = await import("./polling.ts");
  startPolling(bot);
}
