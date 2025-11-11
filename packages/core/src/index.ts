import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { apiClient } from './services';
import { TranslateService } from './services/TranslateService';
import { ErrorLoggerService } from './services/ErrorLoggerService';
import { DigitalAssistantConfiguration } from './DigitalAssistantConfiguration';

// Export the store and types for external consumption
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export all slice actions and types
export * from './store/slices';

// Export API client services
export * from './services';

// Export configurations and utilities
export * from './config';
export * from './util/storage';
export * from './util';
// Export selectors
export * from './store/selectors';

// Explicitly re-export frequently used low-level utils to aid IDE/module resolution
export { hasClass } from './util/hasClass';
export { getObjData, setToStore } from './util';
 
export class DigitalAssistantCore {
    private unsubscribeCallback: (() => void) | null = null;
    private translateService: TranslateService;
    private errorLogger: ErrorLoggerService;
    private lastRecordingRef: any = null;

    constructor(config: DigitalAssistantConfiguration) {
        console.log("Digital Assistant SDK Core initialized");
        this.errorLogger = new ErrorLoggerService(config);
        this.translateService = new TranslateService(apiClient, config, this.errorLogger);
    }

    getState(): RootState {
        return (store as any).getState();
    }

    dispatch(action: any): any {
        return store.dispatch(action);
    }

    subscribe(callback: (state: RootState) => void): () => void {
        const unsubscribe = (store as any).subscribe(() => {
            callback((store as any).getState());
        });
        
        return unsubscribe;
    }

    unsubscribe(): void {
        if (this.unsubscribeCallback) {
            this.unsubscribeCallback();
            this.unsubscribeCallback = null;
        }
    }

    getSliceState<T extends keyof RootState>(sliceName: T): RootState[T] {
        return (store as any).getState()[sliceName];
    }

    getApiClient() {
        return apiClient;
    }

    /**
     * Subscribe to changes of the recording slice only.
     * The callback is invoked whenever the recording state reference changes.
     * Returns an unsubscribe function.
     */
    onRecordingChange(callback: (recordingState: RootState['recording']) => void): () => void {
        // initialize previous reference
        let prev = (store as any).getState().recording;
        return (store as any).subscribe(() => {
            const next = (store as any).getState().recording;
            if (next !== prev) {
                prev = next;
                try {
                    callback(next);
                } catch {
                    // ignore callback errors
                }
            }
        });
    }

    public async translateText(
        text: string,
        sourceLang: string,
        targetLang: string = "en"
    ): Promise<string> {
        return this.translateService.translateText(text, sourceLang, targetLang);
    }
}

// Create a default instance
const config = new DigitalAssistantConfiguration({
    multilingual: {
        translate: {
            provider: "google",
            apikey: "your-api-key",
            apiurl: "https://translation.googleapis.com/language/translate/v2"
        }
    },
    logging: {
        host: "your-log-host.com",
        path: "/logging/error"
    }
});
const digitalAssistantCore = new DigitalAssistantCore(config);

export default digitalAssistantCore;
