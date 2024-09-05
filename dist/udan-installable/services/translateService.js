var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CONFIG } from "../config";
export const translateText = (text, sourceLang, targetLang = "en") => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { translate: { provider, apikey, apiurl }, } = CONFIG.multilingual;
    let posturl = "";
    switch (provider) {
        case "google":
            posturl = `${apiurl}?key=${encodeURIComponent(apikey)}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(text)}`;
            break;
    }
    const response = yield fetch(posturl);
    const jsonData = yield response.json();
    if (((_b = (_a = jsonData === null || jsonData === void 0 ? void 0 : jsonData.data) === null || _a === void 0 ? void 0 : _a.translations) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        return jsonData.data.translations[0].translatedText;
    }
    throw new Error("Failed to translate");
});
