/**
 * Author: Yureswar Ravuri
 * Type: Service
 * Objective: To handle all the http calls
 */
import {getFromStore} from "../util";
import {CONFIG} from "../config/endpoints";
import {getUserId} from "./userService";
import {UDAGetSessionKey} from "../util/UDAGetSessionKey";

const processArgs = (url: string, args: Record<string, any>) => {
    for (const key in args) {
        url = url.replace(`:${key}`, args[key]);
    }
    return url;
};

const apiCal = async (parameters: {
    url: string;
    method: string;
    data?: any;
}) => {
    let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    let sessionKey = await UDAGetSessionKey();
    return await fetch(parameters.url, {
        method: parameters.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + userSessionData.token,
            "uda-session-key": sessionKey
        },
        body: JSON.stringify(parameters.data),
    }).then(async (response) => {
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // authenticationService.logout();
                // location.reload(true);
            }
            const error = response.statusText;
            return Promise.reject(error);
        }
        if(response.status === 200 || response.status === 201) {
            return response.json();
        }
    }).catch((e) => {
        console.log(e);
    });
};

export const REST = {
    processArgs,
    apiCal,
};

export const recordUserClickData = async (type: string, value?: string, recordingId?: number, stepId?: number) => {
    let userId = await getUserId();
    if (userId) {
        await REST.apiCal({
            url: REST.processArgs(
                `${CONFIG.apiHost}/api/userclick`,
                {}
            ),
            method: "POST",
            data: {
                userId: userId,
                type: type,
                value: value,
                recordingId: recordingId,
                stepId: stepId
            }
        });
    }
};
