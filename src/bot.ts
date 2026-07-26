import { Bot } from "grammy";
import { privateChat, PrivateContext } from "./private/composer.ts";
import { getEnv } from "./util.ts";

export type BotContext = PrivateContext;
export const bot = new Bot<BotContext>(getEnv("BOT_TOKEN"));

bot.chatType("private", privateChat);
