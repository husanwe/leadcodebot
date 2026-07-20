import { Bot } from "grammy";
import { BotContext } from "./bot.ts";

export const startPolling = (bot: Bot<BotContext>) => bot.start();
