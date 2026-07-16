import { Bot, webhookCallback } from "grammy";

const botToken = Deno.env.get("BOT_TOKEN");
if (botToken === undefined) {
  console.error("BOT_TOKEN is not provided!");
  Deno.exit(1);
}

const bot = new Bot(botToken);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

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
