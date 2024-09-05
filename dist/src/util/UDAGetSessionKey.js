var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//getting session key from backend server
import { invokeApi } from "./invokeApi";
import { ENDPOINT } from "../config/endpoints";
export const UDAGetSessionKey = (UDASessionData) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield invokeApi(ENDPOINT.GetSessionKey, "GET", null, false);
    if (!response) {
        return response;
    }
    UDASessionData.sessionKey = response;
    return UDASessionData;
});
//# sourceMappingURL=UDAGetSessionKey.js.map