import {UDAGetSessionKey} from "./UDAGetSessionKey";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";
import {UDASessionData} from "../models/UDASessionData";

/**
 * Store keycloak data in chrome extension storage for retrival for other sites
 */
export const keyCloakStore = async (sessionData: UDASessionData, data) => {
    sessionData = await UDAGetSessionKey(sessionData);
    sessionData.authData = data;
    sessionData.authenticated=true;
    sessionData.authenticationSource = 'keycloak';
    await UDABindAuthenticatedAccount(sessionData);
}
