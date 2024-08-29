import { AuthData } from "./AuthData";
import { CSPData } from "./CSPData";
export class UDASessionData {
    constructor(sessionKey = null, authenticated = false, authenticationSource = null, authData = new AuthData(), csp = new CSPData()) {
        this.sessionKey = sessionKey;
        this.authenticated = authenticated;
        this.authenticationSource = authenticationSource;
        this.authData = authData;
        this.csp = csp;
    }
}
