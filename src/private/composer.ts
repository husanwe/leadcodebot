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
import { handleRegisterCommand, handleStartCommand } from "./command.ts";
import { profileRegistration } from "./conversation.ts";

interface SessionData {
  isUserExist: boolean;
}

export type PrivateBaseContext = ChatTypeContext<Context, "private">;
export type PrivateContext = ChatTypeContext<
  ConversationFlavor<Context> & LazySessionFlavor<SessionData>,
  "private"
>;

export const privateChat = new Composer<PrivateContext>();

privateChat.use(lazySession({
  initial: () => ({ isUserExist: false }),
  storage: enhanceStorage({
    storage: new DenoKVAdapter(kv),
    millisecondsToLive: 7 * 24 * 3600 * 1000,
  }),
}));
privateChat.use(conversations());
privateChat.use(createConversation(profileRegistration));
privateChat.command("start", handleStartCommand);
privateChat.command("register", handleRegisterCommand);
