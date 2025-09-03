/**
 * Example Usage of Digital Assistant Core SDK
 * This file demonstrates how to use the SDK in different scenarios
 */

// Import the core SDK and actions
import DigitalAssistantCore, { 
    setIsRecording, 
    setUserData, 
    setSearchKeyword,
    RootState
} from './src/index';

// Example 1: Basic usage with state management
console.log('=== Example 1: Basic Usage ===');

// Get initial state
const initialState = DigitalAssistantCore.getState();
console.log('Initial recording state:', initialState.recording.isRecording);

// Subscribe to state changes
const unsubscribe = DigitalAssistantCore.subscribe((state: RootState) => {
    console.log('State changed!');
    console.log('Recording:', state.recording.isRecording);
    console.log('Search keyword:', state.flow.searchKeyword);
    console.log('User data:', state.user.userData);
});

// Dispatch some actions
console.log('Dispatching setIsRecording(true)...');
DigitalAssistantCore.dispatch(setIsRecording(true));

console.log('Dispatching setUserData...');
DigitalAssistantCore.dispatch(setUserData({ 
    id: '123', 
    name: 'John Doe', 
    email: 'john@example.com' 
}));

console.log('Dispatching setSearchKeyword...');
DigitalAssistantCore.dispatch(setSearchKeyword('test search'));

// Get specific slice state
console.log('=== Example 2: Slice-specific access ===');
const recordingState = DigitalAssistantCore.getSliceState('recording');
console.log('Recording slice state:', recordingState);

const userState = DigitalAssistantCore.getSliceState('user');
console.log('User slice state:', userState);

// Clean up
setTimeout(() => {
    console.log('Cleaning up subscription...');
    unsubscribe();
    console.log('Example completed!');
}, 1000);

export default {};
