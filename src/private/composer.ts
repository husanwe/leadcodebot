import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { I18nFlavor } from "@grammyjs/i18n";
import { RedisAdapter } from "@grammyjs/storage-redis";
import { eq } from "drizzle-orm";
import {
  ChatTypeContext,
  Composer,
  Context,
  lazySession,
  LazySessionFlavor,
} from "grammy";
import { db, redis } from "../db.ts";
import { users } from "../schema.ts";
import { createText, Text } from "../text.ts";
import {
  handleSetEnglish,
  handleSetRussian,
  handleSetUzbek,
  handleVerifySubmission,
} from "./callback.ts";
import {
  handleLanguageCommand,
  handleRegisterCommand,
  handleStartCommand,
} from "./command.ts";
import { registerProfile } from "./conversation.ts";
import { i18n } from "./i18n.ts";

type BaseContext =
  & Context
  & ConversationFlavor<Context>
  & LazySessionFlavor<Session>
  & I18nFlavor
  & { text: Text };

export type PrivateContext = ChatTypeContext<BaseContext, "private">;

export const privateChat = new Composer<PrivateContext>();

type Session = {
  username?: string;
  __language_code?: string;
};

privateChat.use(lazySession<Session, PrivateContext>({
  initial: () => ({ username: undefined }),
  storage: new RedisAdapter({ instance: redis, ttl: 3 * 24 * 3600 }),
}));

privateChat.use(async (ctx, next) => {
  const session = await ctx.session;
  if (!session.__language_code) {
    const [user] = await db.select({ locale: users.locale })
      .from(users)
      .where(eq(users.id, ctx.from.id))
      .limit(1);

    if (user?.locale) {
      session.__language_code = user.locale;
    }
  }
  return next();
});

privateChat.use(i18n);
privateChat.use((ctx, next) => {
  ctx.text = createText(ctx.t.bind(ctx));
  return next();
});

privateChat.use(conversations());
privateChat.use(
  createConversation(registerProfile, {
    maxMillisecondsToWait: 5 * 60 * 1000,
  }),
);

privateChat.command("start", handleStartCommand);
privateChat.command("register", handleRegisterCommand);
privateChat.command("language", handleLanguageCommand);
privateChat.callbackQuery("verify-submission", handleVerifySubmission);
privateChat.callbackQuery("set-uzbek", handleSetUzbek);
privateChat.callbackQuery("set-english", handleSetEnglish);
privateChat.callbackQuery("set-russian", handleSetRussian);
