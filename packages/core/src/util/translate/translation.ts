import i18next from "i18next";

/**
 * Translates a given attribute (key) using the i18next internationalization framework.
 * This function acts as a simple wrapper around `i18next.t()`.
 *
 * @param attr The translation key (attribute) to look up.
 * @returns The translated string corresponding to the given key.
 */
export const translate = (attr: any) => {
  return i18next.t(attr);
}
