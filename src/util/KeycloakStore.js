import {UDAGetSessionKey} from "./UDAGetSessionKey";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";

/**
 * Store keycloak data in chrome extension storage for retrival for other sites
 */
export async function keyCloakStore(UDASessionData, data) {
    UDASessionData = await UDAGetSessionKey(UDASessionData);
    UDASessionData.authdata = data;
    UDASessionData.authenticated=true;
    UDASessionData.authenticationsource = 'keycloak';
    await UDABindAuthenticatedAccount(UDASessionData);
}
