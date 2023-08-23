import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {RESOURCES} from "./resources";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(RESOURCES);

export default i18n;
