import {CONFIG, ENDPOINT} from "../config/endpoints";
import {getFromStore} from "../util";
import {REST} from "./index";

export const getUserId = async () => {
    let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if(userSessionData && userSessionData.userId){
        return userSessionData.userId;
    } else {
        const response = await REST.apiCal({
            url: REST.processArgs(ENDPOINT.UserId, {}),
            method: 'GET'
        });
        return response.userId;
    }
};

export const getSessionKey = async () => {
    return await REST.apiCal({
        url: REST.processArgs(ENDPOINT.SessionKey, {}),
        method: 'GET'
    });
};
