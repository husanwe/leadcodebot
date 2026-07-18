import { eq } from "drizzle-orm";
import { CommandMiddleware } from "grammy";
import { PrivateChatContext } from "./composer.ts";
import { usersTable } from "../schema.ts";
import { db } from "../db.ts";

type CommandHandler = CommandMiddleware<PrivateChatContext>;

export const handleStartCommand: CommandHandler = async (ctx) => {
  const users = await db.select().from(usersTable)
    .where(eq(usersTable.id, ctx.from.id));

  if (!users.length) {
    await db.insert(usersTable).values({ id: ctx.from.id });
  }

  await ctx.reply("Welcome!");
};
