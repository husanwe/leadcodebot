import { eq } from "drizzle-orm";
import { CommandMiddleware } from "grammy";
import { db } from "../db.ts";
import { usersTable } from "../schema.ts";
import { PrivateContext } from "./composer.ts";

type CommandHandler = CommandMiddleware<PrivateContext>;

export const handleStartCommand: CommandHandler = async (ctx) => {
  const [existingUser] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.id, ctx.from.id))
    .limit(1);

  if (!existingUser) {
    await db.insert(usersTable).values({ id: ctx.from.id });
  }

  await ctx.reply(ctx.text.startMsg());
};

export const handleRegisterCommand: CommandHandler = async (ctx) => {
  await ctx.conversation.enter("profileRegistration");
};
