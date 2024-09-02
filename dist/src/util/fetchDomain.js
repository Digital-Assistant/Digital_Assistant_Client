import { parseDomain, ParseResultType } from "parse-domain";
export const fetchDomain = () => {
    let finalDomain = window.location.host;
    // fetching top level domain based on the flag provided.
    if (global.UDAGlobalConfig.enableForAllDomains) {
        const parseResult = parseDomain(finalDomain);
        switch (parseResult.type) {
            case ParseResultType.Listed: {
                const { hostname, domain, subDomains, topLevelDomains } = parseResult;
                finalDomain = domain + '.' + topLevelDomains.join('.');
                break;
            }
            case ParseResultType.Reserved:
            case ParseResultType.NotListed: {
                const { hostname } = parseResult;
                console.log(`${hostname} is a reserved or unknown domain`);
                break;
            }
            default:
                const { hostname } = parseResult;
                console.log(hostname);
        }
    }
    return finalDomain;
};
//# sourceMappingURL=fetchDomain.js.map