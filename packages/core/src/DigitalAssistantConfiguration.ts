export class DigitalAssistantConfiguration {
    multilingual: {
        translate: {
            provider: string;
            apikey: string;
            apiurl: string;
        };
    };
    logging?: {
        host: string;
        path: string;
        port?: number;
        ssl?: boolean;
    };

    constructor(config: any) {
        this.multilingual = config.multilingual;
        this.logging = config.logging;
    }
}
