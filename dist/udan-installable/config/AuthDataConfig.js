var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthConfig } from "./UserAuthConfig";
import { UDADigestMessage } from "../util/UDADigestMessage";
import { trigger } from "../util/events";
//Setting the custom variable
export const AuthDataConfig = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const oldData = Object.assign({}, AuthConfig);
    for (const [key, value] of Object.entries(AuthConfig)) {
        if (data[key] !== undefined) {
            if (data[key] === '') {
                AuthConfig[key] = data[key];
            }
            else if (typeof AuthConfig[key] === typeof data[key]) {
                let encrypted = yield UDADigestMessage(data[key], 'SHA-512');
                AuthConfig[key] = encrypted;
            }
            else {
                console.log(key + ' accepts only ' + typeof AuthConfig[key] + ' data type.');
            }
        }
    }
    if (AuthConfig.id === '' || (oldData.id !== '' && oldData.id !== AuthConfig.id)) {
        trigger('UDAClearSessionData', {});
    }
    else if (AuthConfig.id !== '') {
        trigger("RequestUDASessionData", { detail: { data: "getusersessiondata" }, bubbles: false, cancelable: false });
    }
    return AuthConfig;
});
