import { I18n } from "@grammyjs/i18n";
import { PrivateContext } from "./composer.ts";

export const i18n = new I18n<PrivateContext>({
  defaultLocale: "en",
  useSession: true,
  directory: "locales",
});
