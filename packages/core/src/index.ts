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
 * 2. React integration:
 *    ```typescript
 *    // In your App.tsx
 *    import { DigitalAssistantProvider } from '@digital-assistant/core/react';
 *    
 *    function App() {
 *        return (
 *            <DigitalAssistantProvider>
 *                <YourComponents />
 *            </DigitalAssistantProvider>
 *        );
 *    }
 *    
 *    // In your components
 *    import { useAppSelector, useAppDispatch, setIsRecording } from '@digital-assistant/core/react';
 *    
 *    function MyComponent() {
 *        const isRecording = useAppSelector(state => state.recording.isRecording);
 *        const dispatch = useAppDispatch();
 *        
 *        const startRecording = () => dispatch(setIsRecording(true));
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
        return store.getState();
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
        const unsubscribe = store.subscribe(() => {
            callback(store.getState());
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
        return store.getState()[sliceName];
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
