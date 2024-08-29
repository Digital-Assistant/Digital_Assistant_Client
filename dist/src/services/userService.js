/**
 * @author Yureswar Ravuri
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFromStore } from "../util";
import { CONFIG } from "../config";
/**
 * For getting user id from the storage
 */
export const getUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    let userSessionData = yield getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (userSessionData && userSessionData.authData) {
        return userSessionData.authData.id;
    }
    else {
        return null;
    }
});
/**
 * For getting session id from the storage
 */
export const getSessionKey = () => __awaiter(void 0, void 0, void 0, function* () {
    let userSessionData = yield getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (userSessionData && userSessionData.sessionKey) {
        return userSessionData.sessionKey;
    }
    else {
        return null;
    }
});
//# sourceMappingURL=userService.js.map