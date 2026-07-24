import { ConversationBuilder } from "@grammyjs/conversations";
import { eq } from "drizzle-orm";
import { ChatTypeContext, Context, InlineKeyboard } from "grammy";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profiles } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

const problemSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";

type ConversationHandler = ConversationBuilder<
  PrivateContext,
  ChatTypeContext<Context, "private">
>;

export const registerProfile: ConversationHandler = async (convo, ctx) => {
  const [existingUser] = await db.select()
    .from(profiles)
    .where(eq(profiles.userId, ctx.from.id))
    .limit(1);

  if (existingUser) {
    await ctx.reply(
      await convo.external((ctx) => ctx.text.alreadyRegistered()),
    );
    return;
  }

  let username = "";
  let isValid = false;

  do {
    await ctx.reply(await convo.external((ctx) => ctx.text.enterUsername()));

    const message = await convo.waitFor("message:text", {
      otherwise: async (ctx) =>
        ctx.reply(await convo.external((ctx) => ctx.text.sendTextMessage())),
    });

    username = message.msg.text.trim().toLowerCase();

    const [existingProfile] = await db.select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1);

    if (existingProfile) {
      await ctx.reply(await convo.external((ctx) => ctx.text.usernameTaken()));
      continue;
    }

    const { errors } = await convo.external(async () =>
      await fetchLeetcodeProfile(username, 1)
    );

    if (errors) {
      for (const error of errors) {
        if (error.message === "That user does not exist.") {
          await ctx.reply(
            await convo.external((ctx) => ctx.text.userNotFound()),
          );
          break;
        }
      }
      isValid = false;
    } else {
      isValid = true;
      await convo.external(async (ctx) =>
        (await ctx.session).username = username
      );
    }
  } while (!isValid);

  const verifyButton = new InlineKeyboard()
    .text(
      await convo.external((ctx) => ctx.text.verifySubmission()),
      "verify-submission",
    );

  await ctx.reply(
    await convo.external((ctx) =>
      ctx.text.solveProblem(`https://leetcode.com/problems/${problemSlug}`)
    ),
    { reply_markup: verifyButton },
  );
};
