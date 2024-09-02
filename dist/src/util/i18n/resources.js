import { TRANSLATIONS_EN } from "./locales/en";
export const RESOURCES = {
    // the translations
    resources: {
        en: {
            translation: TRANSLATIONS_EN,
        }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
};
//# sourceMappingURL=resources.js.map