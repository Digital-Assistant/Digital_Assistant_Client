/**
 * Common API call functionality
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
import { CustomConfig } from "../config/CustomConfig";
global.UDAGlobalConfig = CustomConfig;
export const invokeApi = (url, method, data, parseJson = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'charset': 'UTF-8'
            }
        };
        if (data) {
            config.body = JSON.stringify(data);
        }
        const baseProdURL = process.env.baseProdURL;
        const baseTestURL = process.env.baseTestURL;
        let baseURL = baseProdURL;
        if (url.indexOf("http") === -1) {
            if (global.UDAGlobalConfig.environment === 'TEST') {
                baseURL = baseTestURL;
            }
            url = baseURL + url;
        }
        let response = yield fetch(url, config);
        if (response.ok) {
            if (parseJson) {
                return response.json();
            }
            else {
                return response.text();
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
