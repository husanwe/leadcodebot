import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { RedisAdapter } from "@grammyjs/storage-redis";
import {
  ChatTypeContext,
  Composer,
  Context,
  lazySession,
  LazySessionFlavor,
} from "grammy";
import { redis } from "../db.ts";
import { verifySubmissionOnTime } from "./callback.ts";
import { handleRegisterCommand, handleStartCommand } from "./command.ts";
import { profileRegistration } from "./conversation.ts";

type FlavoredContext =
  & Context
  & ConversationFlavor<Context>
  & LazySessionFlavor<SessionData>;

export type PrivateContext = ChatTypeContext<FlavoredContext, "private">;

export const privateChat = new Composer<PrivateContext>();

type SessionData = {
  lUsername?: string;
};

privateChat.use(lazySession<SessionData, PrivateContext>({
  initial: () => ({ lUsername: undefined }),
  storage: new RedisAdapter({ instance: redis, ttl: 3 * 24 * 3600 }),
}));
privateChat.use(conversations());
privateChat.use(createConversation(profileRegistration));
privateChat.command("start", handleStartCommand);
privateChat.command("register", handleRegisterCommand);
privateChat.callbackQuery("verifySubmissionOnTime", verifySubmissionOnTime);
