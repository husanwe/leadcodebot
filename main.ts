import { Bot } from "grammy";

const botToken = Deno.env.get("BOT_TOKEN");
if (botToken === undefined) {
  throw new Error("Bot token is not provided!");
}

const bot = new Bot(botToken);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
