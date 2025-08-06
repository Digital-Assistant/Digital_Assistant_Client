export declare const REST: {
    processArgs: (url: string, args: Record<string, any>) => string;
    apiCal: (parameters: {
        url: string;
        method: string;
        data?: any;
    }) => Promise<any>;
};
export declare const recordUserClickData: (type: string, value?: string, recordingId?: number, stepId?: number) => Promise<void>;
