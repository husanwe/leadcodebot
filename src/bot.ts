import { Bot } from "grammy";
import { privateChat } from "./private/composer.ts";

const botToken = Deno.env.get("BOT_TOKEN");
if (botToken === undefined) {
  console.error("BOT_TOKEN is not provided!");
  Deno.exit(1);
}

export const bot = new Bot(botToken);

bot.chatType("private", privateChat);
