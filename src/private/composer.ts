import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { ChatTypeContext, Composer, Context } from "grammy";
import { handleRegisterCommand, handleStartCommand } from "./command.ts";
import { profileRegistration } from "./conversation.ts";

export type PrivateBaseContext = ChatTypeContext<Context, "private">;
export type PrivateContext = ChatTypeContext<
  ConversationFlavor<Context>,
  "private"
>;

export const privateChat = new Composer<PrivateContext>();

privateChat.use(conversations());
privateChat.use(createConversation(profileRegistration));
privateChat.command("start", handleStartCommand);
privateChat.command("register", handleRegisterCommand);
