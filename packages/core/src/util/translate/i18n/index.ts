import i18n from "i18next";
// import {initReactI18next} from "react-i18next"; // This import is commented out, indicating React integration is not active.
import {RESOURCES} from "./resources";

/**
 * Initializes the i18next internationalization framework.
 * This setup configures i18next with translation resources.
 * The `initReactI18next` plugin is commented out, suggesting that
 * this i18n instance is used independently of React components,
 * or React integration is handled elsewhere.
 */
i18n
  // .use(initReactI18next) // Passes i18n down to react-i18next (currently commented out).
  .init(RESOURCES); // Initializes i18next with the defined translation resources.

export default i18n;
