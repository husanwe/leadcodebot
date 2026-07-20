import { bot } from "./bot.ts";
import { getEnv } from "./util.ts";

if (getEnv("DENO_DEPLOY") === "true") {
  const { startWebhook } = await import("./webhook.ts");
  startWebhook(bot);
} else {
  const { startPolling } = await import("./polling.ts");
  startPolling(bot);
}
