import { Bot } from "grammy";
import { privateChat, PrivateContext } from "./private/composer.ts";
import { getEnv } from "./util.ts";

const botToken = getEnv("BOT_TOKEN");
export type BotContext = PrivateContext;
export const bot = new Bot<BotContext>(botToken);

bot.chatType("private", privateChat);
