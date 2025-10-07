import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { apiClient } from './services';

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

/**
 * Digital Assistant Core SDK
 * 
 * This class provides a framework-agnostic interface to the Digital Assistant functionality.
 * It manages the Redux store internally and exposes methods for state management and subscriptions.
 * 
 * Usage Examples:
 * 
 * 1. Basic usage:
 *    ```typescript
 *    import DigitalAssistantCore from '@digital-assistant/core';
 *    
 *    // Get current state
 *    const currentState = DigitalAssistantCore.getState();
 *    
 *    // Subscribe to state changes
 *    const unsubscribe = DigitalAssistantCore.subscribe((state) => {
 *        console.log('State changed:', state);
 *    });
 *    
 *    // Dispatch an action
 *    DigitalAssistantCore.dispatch(setIsRecording(true));
 *    ```
 * 
 * 2. Framework integration (React example):
 *    ```typescript
 *    // In your App.tsx
 *    import DigitalAssistantCore from '@digital-assistant/core';
 *    import { setIsRecording } from '@digital-assistant/core';
 *    
 *    function App() {
 *        const [sdkState, setSdkState] = useState(DigitalAssistantCore.getState());
 *        
 *        useEffect(() => {
 *            const unsubscribe = DigitalAssistantCore.subscribe((newState) => {
 *                setSdkState(newState);
 *            });
 *            return unsubscribe;
 *        }, []);
 *        
 *        const startRecording = () => DigitalAssistantCore.dispatch(setIsRecording(true));
 *        const isRecording = sdkState.recording.isRecording;
 *    }
 *    ```
 */
export class DigitalAssistantCore {
    private unsubscribeCallback: (() => void) | null = null;

    constructor() {
        // Initialize the SDK
        console.log("Digital Assistant SDK Core initialized");
    }

    /**
     * Get the current state of the Digital Assistant
     * @returns The current state object containing all slice states
     */
    getState(): RootState {
        return (store as any).getState();
    }

    /**
     * Dispatch an action to the store
     * @param action - Redux action to dispatch
     * @returns The dispatched action
     */
    dispatch(action: any): any {
        return store.dispatch(action);
    }

    /**
     * Subscribe to store changes
     * @param callback - Function to call when state changes
     * @returns Unsubscribe function
     */
    subscribe(callback: (state: RootState) => void): () => void {
        const unsubscribe = (store as any).subscribe(() => {
            callback((store as any).getState());
        });
        
        return unsubscribe;
    }

    /**
     * Unsubscribe from store changes (if using instance method)
     */
    unsubscribe(): void {
        if (this.unsubscribeCallback) {
            this.unsubscribeCallback();
            this.unsubscribeCallback = null;
        }
    }

    /**
     * Get specific slice state
     * @param sliceName - Name of the slice to retrieve
     */
    getSliceState<T extends keyof RootState>(sliceName: T): RootState[T] {
        return (store as any).getState()[sliceName];
    }

    /**
     * Get the API client instance for making authenticated requests
     * @returns The central API client with automatic authentication
     */
    getApiClient() {
        return apiClient;
    }
}

// Create a default instance
const digitalAssistantCore = new DigitalAssistantCore();

// Export the default instance
export default digitalAssistantCore;
