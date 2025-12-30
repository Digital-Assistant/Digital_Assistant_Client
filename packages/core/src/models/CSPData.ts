export class CSPData {
    cspEnabled: boolean;
    udaAllowed: boolean;
    domain: string|null;
    constructor(cspEnabled: boolean=false, udaAllowed: boolean=true, domain: string|null=null) {
        this.cspEnabled = cspEnabled;
        this.udaAllowed = udaAllowed;
        this.domain = domain;
    }
}
