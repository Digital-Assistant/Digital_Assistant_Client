import { TRANSLATIONS_EN } from "./locales/en";
import { TRANSLATIONS_FR } from "./locales/fr";

export const RESOURCES = {
  // the translations
  resources: {
    en: {
      translation: TRANSLATIONS_EN,
    },
    fr: {
      translation: TRANSLATIONS_FR,
    },
  },
  lng: "en", // if you're using a language detector, do not define the lng option
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
};
