import 'setimmediate';
import './util/translate/i18n/';
import type {AppDispatch, RootState} from './store';
import {store} from './store';
import {apiClient} from './services';
import {TranslateService} from './services/TranslateService';
import {ErrorLoggerService} from './services/ErrorLoggerService';
import {DigitalAssistantConfiguration} from './DigitalAssistantConfiguration';

// Export the store and types for external consumption
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export all slice actions and types
export * from './store/slices';

// Export API client services
export * from './services';

// Export configurations and utilities
export * from './config';
export * from './util';
// Export selectors
export * from './store/selectors';
 
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
        return (store as any).subscribe(() => {
            callback((store as any).getState());
        });
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
}
