import { CallbackQueryMiddleware } from "grammy";
import { bot } from "../bot.ts";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profilesTable } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

type CallbackHandler = CallbackQueryMiddleware<PrivateContext>;

export const verifySubmissionOnTime: CallbackHandler = async (ctx) => {
  const { lUsername: username } = await ctx.session;

  if (!username) {
    await ctx.answerCallbackQuery(ctx.text.timeIsUp());
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    return;
  }

  const userId = ctx.from.id;
  const { data } = await fetchLeetcodeProfile(username, 1);

  for (const submission of data.recentSubmissionList) {
    if (
      submission.titleSlug === titleSlug &&
      submission.statusDisplay === "Accepted" &&
      /^(\d)\s+minutes?$/.test(submission.time)
    ) {
      await db.insert(profilesTable).values({ username, userId });
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
      await bot.api.sendMessage(userId, ctx.text.successfullyRegistered());
      return;
    }
  }
  await ctx.editMessageReplyMarkup({ reply_markup: undefined });
  await bot.api.sendMessage(userId, ctx.text.submissionTimeUp());
};
