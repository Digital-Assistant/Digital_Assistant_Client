export declare const fetchSearchResults: (params: {
    keyword: string;
    page: number;
    domain: string;
    additionalParams?: string | null;
}) => Promise<any>;
export declare const fetchRecord: (request?: {
    id?: string;
    domain?: string;
    additionalParams?: any;
    userSessionId?: string;
}) => Promise<any>;
export declare const fetchSpecialNodes: (request?: any) => Promise<{
    type: string;
    key: string;
    value: string;
}[]>;
