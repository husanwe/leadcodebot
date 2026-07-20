import { Bot, webhookCallback } from "grammy";
import { BotContext } from "./bot.ts";
import { getEnv } from "./util.ts";

const webhookUrl = getEnv("WEBHOOK_URL");
export const startWebhook = async (bot: Bot<BotContext>) => {
  const handleUpdate = webhookCallback(bot, "std/http");
  Deno.serve(async (req) => {
    if (req.method === "POST") {
      const url = new URL(req.url);
      if (url.pathname === "/bot") {
        try {
          return await handleUpdate(req);
        } catch (err) {
          console.error(err);
        }
      }
    }
    return new Response("Not found", { status: 404 });
  });
  await bot.api.setWebhook(webhookUrl + "/bot");
};
