import { resolve } from "@std/path";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { bot } from "./bot.ts";
import { db } from "./db.ts";
import { getEnv } from "./util.ts";

const baseDir = import.meta.dirname ?? Deno.cwd();

await migrate(db, {
  migrationsFolder: resolve(baseDir, "../drizzle"),
});

if (getEnv("DENO_DEPLOY", false) === "true") {
  const { startWebhook } = await import("./webhook.ts");
  startWebhook(bot);
} else {
  const { startPolling } = await import("./polling.ts");
  startPolling(bot);
}
