export class CSPData {
    cspEnabled: boolean;
    udaAllowed: boolean;
    domain: String;
    constructor(cspEnabled: boolean=false, udaAllowed: boolean=true, domain: string=null) {
        this.cspEnabled = cspEnabled;
        this.udaAllowed = udaAllowed;
        this.domain = domain;
    }
}
