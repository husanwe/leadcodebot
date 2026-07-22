import { ConversationBuilder } from "@grammyjs/conversations";
import { eq } from "drizzle-orm";
import { InlineKeyboard } from "grammy";
import { db } from "../db.ts";
import { profilesTable } from "../schema.ts";
import { PrivateBaseContext, PrivateContext } from "./composer.ts";

type ConvoHandler = ConversationBuilder<PrivateContext, PrivateBaseContext>;
const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

export const profileRegistration: ConvoHandler = async (convo, ctx) => {
  const existingProfile = await db.select().from(profilesTable).where(
    eq(profilesTable.userId, ctx.from.id),
  );
  if (existingProfile.length) {
    await ctx.reply("You are already registered.");
    return;
  }

  let usernameMsg, usernameCheck;
  do {
    await ctx.reply("Enter your leetcode username:");
    usernameMsg = await convo.waitFor("message:text", {
      otherwise: (ctx) => ctx.reply("Please send a text message!"),
    });
    usernameCheck = await db.select().from(profilesTable).where(
      eq(profilesTable.username, usernameMsg.msg.text),
    );
    if (usernameCheck.length) {
      await ctx.reply("The username is already registered.");
    }
  } while (usernameCheck.length);

  await convo.external(async (ctx) =>
    (await ctx.session).profile = usernameMsg.msg.text
  );

  const verifySubmissionButton = new InlineKeyboard();
  verifySubmissionButton.text(
    "I've just solved the problem",
    "verifySubmissionOnTime",
  );
  await ctx.reply(
    `Solve the problem in ten minutes.\nhttps://leetcode.com/problems/${titleSlug}`,
    { reply_markup: verifySubmissionButton },
  );
};
