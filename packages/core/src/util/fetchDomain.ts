import { parseDomain, ParseResultType } from "parse-domain";

/**
 * Fetches the top-level domain of the current window's host.
 * If `window.UDAGlobalConfig.enableForAllDomains` is true, it uses `parse-domain`
 * to extract the top-level domain; otherwise, it returns the full host.
 *
 * Note: This function only works in browser contexts with window.location.
 * Returns null in service worker or Node.js contexts.
 *
 * @returns The top-level domain, the full host, or null if not in browser context.
 */
export const fetchDomain = (): string | null => {
    // Check if we're in a browser context with window.location
    if (typeof window === 'undefined' || !window.location) {
        return null;
    }

    let finalDomain = window.location.host; // Default to the full host.

    // If the global configuration enables processing for all domains, parse the top-level domain.
    // @ts-ignore - UDAGlobalConfig is added at runtime
    if(window.UDAGlobalConfig && window.UDAGlobalConfig.enableForAllDomains){
        const parseResult = parseDomain(finalDomain); // Parse the domain using `parse-domain` library.

        switch (parseResult.type) {
            case ParseResultType.Listed: {
                // If the domain is listed, reconstruct the top-level domain.
                const { domain, topLevelDomains } = parseResult;
                finalDomain = domain+'.'+topLevelDomains.join('.');
                break;
            }
            case ParseResultType.Reserved:
            case ParseResultType.NotListed: {
                // For reserved or unlisted domains, log a message and keep the full hostname.
                const { hostname } = parseResult;
                console.log(`${hostname} is a reserved or unknown domain`);
                // `finalDomain` remains `window.location.host` in this case.
                break;
            }
            default:
                // For any other parse result type, log the hostname.
                const { hostname } = parseResult;
                console.log(hostname);
                // `finalDomain` remains `window.location.host` in this case.
        }
    }
    return finalDomain;
}
