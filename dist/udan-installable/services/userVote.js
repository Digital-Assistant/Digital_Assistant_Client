var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "./index";
/**
 * To vote/de-vote the recording
 * @param request
 * @param type
 * @returns promise
 */
export const vote = (request, type) => __awaiter(void 0, void 0, void 0, function* () {
    let usersessionid = yield getUserId();
    const payload = {
        usersessionid: usersessionid,
        sequenceid: request.id,
        upvote: type == "up" ? 1 : 0,
        downvote: type == "down" ? 1 : 0,
    };
    const parameters = {
        url: ENDPOINT.VoteRecord,
        method: "POST",
        body: payload,
    };
    return REST.apiCal(parameters);
});
export const getVoteRecord = (request, type) => __awaiter(void 0, void 0, void 0, function* () {
    let userSessionId = yield getUserId();
    const parameters = {
        url: ENDPOINT.fetchVoteRecord + request.id + '/' + userSessionId,
        method: "GET"
    };
    return REST.apiCal(parameters);
});
