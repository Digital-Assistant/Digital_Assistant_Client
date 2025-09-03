/**
 * A wrapper around axios for making API calls.
 * @param options - The request options.
 * @returns A promise that resolves with the response data.
 */
export declare const apiCal: (options: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
}) => Promise<any>;
