import {AuthData} from "./AuthData";
import {CSPData} from "./CSPData";

export class UDASessionData {
    sessionKey: string;
    authenticated: boolean;
    authenticationSource: string;
    authData: AuthData;
    csp: CSPData;

    constructor(sessionKey: string=null, authenticated: boolean=false, authenticationSource: string=null, authData: AuthData = new AuthData(), csp: CSPData=new CSPData()) {
        this.sessionKey = sessionKey;
        this.authenticated = authenticated;
        this.authenticationSource = authenticationSource;
        this.authData = authData;
        this.csp = csp;
    }

}
