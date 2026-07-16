import { Bot, webhookCallback } from "grammy";

const webhookUrl = Deno.env.get("WEBHOOK_URL");
if (webhookUrl === undefined) {
  console.error("WEBHOOK_URL is not provided!");
  Deno.exit(1);
}
export const startWebhook = async (bot: Bot) => {
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
