import { bot } from "./bot.ts";

if (Deno.env.get("DENO_DEPLOY") === "true") {
  const { startWebhook } = await import("./webhook.ts");
  startWebhook(bot);
} else {
  const { startPolling } = await import("./polling.ts");
  startPolling(bot);
}
