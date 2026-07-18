import { ChatTypeContext, Composer, Context } from "grammy";
import { handleStartCommand } from "./handler.ts";

export type PrivateChatContext = ChatTypeContext<Context, "private">;

export const privateChat = new Composer<PrivateChatContext>();

privateChat.command("start", handleStartCommand);
