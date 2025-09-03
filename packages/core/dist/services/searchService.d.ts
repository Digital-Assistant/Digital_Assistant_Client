/**
 * To serve search results
 * @param request
 * @returns promise
 */
export declare const fetchSearchResults: (request?: {
    keyword?: string;
    page: number;
    domain?: string;
    additionalParams?: any;
    userSessionId?: any;
}) => Promise<any>;
/**
 * To serve search results
 * @param request
 * @returns promise
 */
export declare const fetchRecord: (request?: {
    id?: string;
    domain?: string;
    additionalParams?: any;
    userSessionId?: string;
}) => Promise<any>;
/**
 * Fetch special nodes processing from backend
 * @param request
 */
export declare const fetchSpecialNodes: (request?: any) => Promise<{
    include: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    exclude: {
        tags: string[];
        classes: string[];
        attributes: string[];
        ids: string[];
    };
    ignoreChildren: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    ignoreClicksOnNodes: {
        tags: string[];
        classes: string[];
        attributes: string[];
        ids: string[];
    };
    ignoreDuringCompare: {
        tags: never[];
        classes: never[];
        attributes: string[];
        ids: never[];
    };
    personalNodeIgnoreAttributes: string[];
    textEditors: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    dropDowns: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    datePicker: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    specialNodes: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    preventDefault: {
        tags: string[];
        classes: never[];
        attributes: string[];
    };
    iconNodes: {
        tags: string[];
        classes: never[];
        attributes: never[];
    };
}>;
