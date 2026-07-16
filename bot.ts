import { Bot } from "grammy";

const botToken = Deno.env.get("BOT_TOKEN");
if (botToken === undefined) {
  console.error("BOT_TOKEN is not provided!");
  Deno.exit(1);
}

export const bot = new Bot(botToken);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));
