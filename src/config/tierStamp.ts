/**
 * Reader of the tier stamp: `tier.json` at the root of the extension package, written by the
 * store packaging (`{"tier":"TEST"}` or `{"tier":"PROD"}`, nothing else in it). It sets the
 * default environment of a store install (TEST item or PROD item) from the same bundle.
 * Rules and precedence: ./runtimeEnvironment.ts. The file holds no secret and no URL.
 *
 * Worker side only: the worker fetches its own package file. Any failure (file missing, as in
 * an unpacked development build; fetch error; invalid content) gives `undefined`, which means
 * "no stamp" (install type, then PROD). The result is cached: the stamp cannot change while the
 * extension runs.
 */
import { parseTierStamp, type Environment } from "./runtimeEnvironment";

export const TIER_STAMP_FILE = "tier.json";

export interface TierStampDeps {
    /** `chrome.runtime.getURL` */
    getURL: (path: string) => string;
    fetchText: (url: string) => Promise<string>;
}

export async function readTierStamp(deps: TierStampDeps): Promise<Environment | undefined> {
    try {
        return parseTierStamp(await deps.fetchText(deps.getURL(TIER_STAMP_FILE)));
    } catch {
        return undefined;
    }
}

let cached: Promise<Environment | undefined> | undefined;

/** The stamp of this installed extension (read once per worker start). */
export function getTierStamp(getURL: TierStampDeps["getURL"]): Promise<Environment | undefined> {
    return (cached ??= readTierStamp({
        getURL,
        fetchText: async (url) => {
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        },
    }));
}
