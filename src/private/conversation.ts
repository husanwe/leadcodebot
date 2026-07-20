import { ConversationBuilder } from "@grammyjs/conversations";
import { eq } from "drizzle-orm";
import { db } from "../db.ts";
import { profilesTable } from "../schema.ts";
import { PrivateBaseContext, PrivateContext } from "./composer.ts";

type ConvoBuilder = ConversationBuilder<PrivateContext, PrivateBaseContext>;
const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

export const profileRegistration: ConvoBuilder = async (convo, ctx) => {
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
      await ctx.reply("The username already registered.");
    }
  } while (usernameCheck.length);

  await ctx.reply(
    `Solve the problem in two minutes.\nhttps://leetcode.com/problems/${titleSlug}`,
  );
};
