import { TranslateFunction } from "@grammyjs/i18n";

export type Text = ReturnType<typeof createText>;

export const createText = (t: TranslateFunction) => ({
  startMessage: () => t("start-message"),
  alreadyRegistered: () => t("already-registered"),
  enterUsername: () => t("enter-leetcode-username"),
  sendTextMessage: () => t("send-text-message"),
  usernameTaken: () => t("username-taken"),
  userNotFound: () => t("user-not-found"),
  solveProblem: (link: string) => t("solve-problem") + "\n" + link,
  verifySubmission: () => t("verify-submission"),
  successfullyRegistered: () => t("successfully-registered"),
  submissionTimeUp: () => t("submission-time-up"),
  timeIsUp: () => t("time-is-up"),
  selectLanguage: () => t("select-language"),
  languageUzbek: () => t("language-uzbek"),
  languageEnglish: () => t("language-english"),
  languageRussian: () => t("language-russian"),
  languageSet: () => t("language-set"),
});
