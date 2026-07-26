import { eq } from "drizzle-orm";
import { CommandMiddleware, InlineKeyboard } from "grammy";
import { db } from "../db.ts";
import { users } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

type CommandHandler = CommandMiddleware<PrivateContext>;

export const handleStartCommand: CommandHandler = async (ctx) => {
  const [existingUser] = await db.select()
    .from(users)
    .where(eq(users.id, ctx.from.id))
    .limit(1);

  if (!existingUser) {
    await db.insert(users).values({ id: ctx.from.id });
  }

  await ctx.reply(ctx.text.startMessage());
};

export const handleRegisterCommand: CommandHandler = async (ctx) => {
  await ctx.conversation.enter("registerProfile");
};

export const handleLanguageCommand: CommandHandler = async (ctx) => {
  const languageButtons = new InlineKeyboard()
    .text(ctx.text.languageUzbek(), "set-uzbek")
    .text(ctx.text.languageEnglish(), "set-english")
    .text(ctx.text.languageRussian(), "set-russian");

  await ctx.reply(ctx.text.selectLanguage(), {
    reply_markup: languageButtons,
  });
};
