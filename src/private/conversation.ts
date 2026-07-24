import { ConversationBuilder } from "@grammyjs/conversations";
import { eq } from "drizzle-orm";
import { InlineKeyboard } from "grammy";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profilesTable } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

type ConvoHandler = ConversationBuilder<PrivateContext, PrivateContext>;

export const profileRegistration: ConvoHandler = async (convo, ctx) => {
  const [existingUser] = await db.select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, ctx.from.id))
    .limit(1);

  if (existingUser) {
    await ctx.reply(ctx.text.alreadyRegistered());
    return;
  }

  let username = "";
  let isUsernameValid = false;

  do {
    await ctx.reply(ctx.text.enterUsername());

    const messageCtx = await convo.waitFor("message:text", {
      otherwise: (ctx) => ctx.reply(ctx.text.sendTextMessage()),
    });

    username = messageCtx.msg.text.trim().toLowerCase();

    const [duplicateProfile] = await db.select()
      .from(profilesTable)
      .where(eq(profilesTable.username, username))
      .limit(1);

    if (duplicateProfile) {
      await ctx.reply(ctx.text.usernameTaken());
      continue;
    }

    const { errors } = await convo.external(async () =>
      await fetchLeetcodeProfile(username, 1)
    );

    if (errors) {
      for (const error of errors) {
        if (error.message === "That user does not exist.") {
          await ctx.reply(ctx.text.userNotFound());
          break;
        }
      }
      isUsernameValid = false;
    } else {
      isUsernameValid = true;
      await convo.external(async (ctx) =>
        (await ctx.session).lUsername = username
      );
    }
  } while (!isUsernameValid);

  const verifySubmissionButton = new InlineKeyboard()
    .text(ctx.text.verifySubmission(), "verifySubmissionOnTime");

  await ctx.reply(
    ctx.text.solveProblem(`https://leetcode.com/problems/${titleSlug}`),
    { reply_markup: verifySubmissionButton },
  );
};
