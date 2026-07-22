import { ConversationBuilder } from "@grammyjs/conversations";
import { eq } from "drizzle-orm";
import { InlineKeyboard } from "grammy";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profilesTable } from "../schema.ts";
import { ConversationContext, PrivateContext } from "./composer.ts";

const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

type ConvoHandler = ConversationBuilder<PrivateContext, ConversationContext>;

export const profileRegistration: ConvoHandler = async (convo, ctx) => {
  const [existingUser] = await db.select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, ctx.from.id))
    .limit(1);

  if (existingUser) {
    await ctx.reply("You are already registered.");
    return;
  }

  let username = "";
  let isUsernameValid = false;

  do {
    await ctx.reply("Enter your leetcode username:");

    const messageCtx = await convo.waitFor("message:text", {
      otherwise: (ctx) => ctx.reply("Please send a text message!"),
    });

    username = messageCtx.msg.text.trim().toLowerCase();

    const [duplicateProfile] = await db.select()
      .from(profilesTable)
      .where(eq(profilesTable.username, username))
      .limit(1);

    if (duplicateProfile) {
      await ctx.reply("The username is already registered by someone else.");
      continue;
    }

    const { errors } = await convo.external(async () =>
      await fetchLeetcodeProfile(username, 1)
    );

    if (errors) {
      for (const error of errors) {
        if (error.message === "That user does not exist.") {
          await ctx.reply(
            "That LeetCode user does not exist. Please check the spelling.",
          );
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
    .text("I've just solved the problem", "verifySubmissionOnTime");

  await ctx.reply(
    `Solve the problem in ten minutes.\nhttps://leetcode.com/problems/${titleSlug}`,
    { reply_markup: verifySubmissionButton },
  );
};
