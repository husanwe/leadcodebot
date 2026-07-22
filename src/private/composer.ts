import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { DenoKVAdapter } from "@grammyjs/storage-denokv";
import {
  ChatTypeContext,
  Composer,
  Context,
  enhanceStorage,
  lazySession,
  LazySessionFlavor,
} from "grammy";
import { kv } from "../db.ts";
import { verifySubmissionOnTime } from "./callback.ts";
import { handleRegisterCommand, handleStartCommand } from "./command.ts";
import { profileRegistration } from "./conversation.ts";

export type PrivateBaseContext = ChatTypeContext<Context, "private">;
export type PrivateContext = ChatTypeContext<
  ConversationFlavor<Context> & LazySessionFlavor<SessionData>,
  "private"
>;

export const privateChat = new Composer<PrivateContext>();

interface SessionData {
  profile?: string;
}

privateChat.use(lazySession({
  initial: () => ({ profile: undefined }),
  storage: enhanceStorage({
    storage: new DenoKVAdapter(kv),
    millisecondsToLive: 7 * 24 * 3600 * 1000,
  }),
}));
privateChat.use(conversations());
privateChat.use(createConversation(profileRegistration));
privateChat.command("start", handleStartCommand);
privateChat.command("register", handleRegisterCommand);
privateChat.callbackQuery("verifySubmissionOnTime", verifySubmissionOnTime);
