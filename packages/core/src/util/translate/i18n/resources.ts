import {TRANSLATIONS_EN} from "./locales/en";

/**
 * Configuration object for i18next, defining translation resources and settings.
 * This object specifies the available languages, their translation files,
 * the default language, and fallback mechanisms.
 */
export const RESOURCES = {
  // Defines the translation resources for each language.
  resources: {
    // English language resources.
    en: {
      translation: TRANSLATIONS_EN, // Imports English translations from a separate file.
    }
  },
  lng: "en", // The default language to use. If a language detector is used, this option should not be defined.
  fallbackLng: "en", // The language to fall back to if a translation is missing in the primary language.
  interpolation: {
    escapeValue: false, // Disables escaping of interpolated values, as React (or similar frameworks) handles XSS protection.
  },
};
