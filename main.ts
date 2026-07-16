import { bot } from "./bot.ts";
import { startWebhook } from "./webhook.ts";

if (Deno.env.get("DENO_DEPLOY") === "true") {
  await startWebhook(bot);
}
