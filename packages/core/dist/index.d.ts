import type { RootState } from './store';
export { store } from './store';
export type { RootState, AppDispatch } from './store';
export * from './store/slices';
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
export declare class DigitalAssistantCore {
    private unsubscribeCallback;
    constructor();
    /**
     * Get the current state of the Digital Assistant
     * @returns The current state object containing all slice states
     */
    getState(): RootState;
    /**
     * Dispatch an action to the store
     * @param action - Redux action to dispatch
     * @returns The dispatched action
     */
    dispatch(action: any): any;
    /**
     * Subscribe to store changes
     * @param callback - Function to call when state changes
     * @returns Unsubscribe function
     */
    subscribe(callback: (state: RootState) => void): () => void;
    /**
     * Unsubscribe from store changes (if using instance method)
     */
    unsubscribe(): void;
    /**
     * Get specific slice state
     * @param sliceName - Name of the slice to retrieve
     */
    getSliceState<T extends keyof RootState>(sliceName: T): RootState[T];
}
declare const digitalAssistantCore: DigitalAssistantCore;
export default digitalAssistantCore;
