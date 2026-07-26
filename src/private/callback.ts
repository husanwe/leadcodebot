import { eq } from "drizzle-orm";
import { CallbackQueryMiddleware } from "grammy";
import { bot } from "../bot.ts";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profiles, users } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

const problemSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

type CallbackHandler = CallbackQueryMiddleware<PrivateContext>;

export const handleVerifySubmission: CallbackHandler = async (ctx) => {
  const { username } = await ctx.session;

  if (!username) {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(ctx.text.timeIsUp(), { reply_markup: undefined });
    return;
  }

  const userId = ctx.from.id;
  const { data } = await fetchLeetcodeProfile(username, 1);

  for (const submission of data.recentSubmissionList) {
    if (
      submission.titleSlug === problemSlug &&
      submission.statusDisplay === "Accepted" &&
      /^(\d)\s+minutes?$/.test(submission.time)
    ) {
      await db.insert(profiles).values({ username, userId });
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
      await bot.api.sendMessage(userId, ctx.text.successfullyRegistered());
      return;
    }
  }

  (await ctx.session).username = undefined;
  await ctx.editMessageReplyMarkup({ reply_markup: undefined });
  await bot.api.sendMessage(userId, ctx.text.submissionTimeUp());
};

export const handleSetUzbek: CallbackHandler = async (ctx) => {
  await ctx.i18n.setLocale("uz");
  await db.update(users)
    .set({ locale: "uz" })
    .where(eq(users.id, ctx.from.id));
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(ctx.text.languageSet(), {
    reply_markup: undefined,
  });
};

export const handleSetEnglish: CallbackHandler = async (ctx) => {
  await ctx.i18n.setLocale("en");
  await db.update(users)
    .set({ locale: "en" })
    .where(eq(users.id, ctx.from.id));
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(ctx.text.languageSet(), {
    reply_markup: undefined,
  });
};

export const handleSetRussian: CallbackHandler = async (ctx) => {
  await ctx.i18n.setLocale("ru");
  await db.update(users)
    .set({ locale: "ru" })
    .where(eq(users.id, ctx.from.id));
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(ctx.text.languageSet(), {
    reply_markup: undefined,
  });
};
