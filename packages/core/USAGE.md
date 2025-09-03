# Digital Assistant Core SDK Usage Guide

This SDK provides a framework-agnostic interface to the Digital Assistant functionality with centralized state management.

## Installation

```bash
npm install @digital-assistant/core
```

## Framework-Agnostic Usage

### Basic Usage

```typescript
import DigitalAssistantCore, { setIsRecording, setUserData } from '@digital-assistant/core';

// Get current state
const currentState = DigitalAssistantCore.getState();
console.log('Current recording state:', currentState.recording.isRecording);

// Subscribe to state changes
const unsubscribe = DigitalAssistantCore.subscribe((state) => {
    console.log('Recording state changed:', state.recording.isRecording);
});

// Dispatch actions
DigitalAssistantCore.dispatch(setIsRecording(true));
DigitalAssistantCore.dispatch(setUserData({ id: '123', name: 'John Doe' }));

// Clean up subscription when done
unsubscribe();
```

### Available State Slices

- **`user`**: User authentication and session data
- **`recording`**: Recording controls and playback state
- **`flow`**: Search results and pagination
- **`editing`**: Step editing and validation state
- **`validation`**: Validation workflow state

## React Integration

### 1. Setup Provider

Wrap your app with the DigitalAssistantProvider:

```typescript
import React from 'react';
import { DigitalAssistantProvider } from '@digital-assistant/core/react';
import YourApp from './YourApp';

function App() {
    return (
        <DigitalAssistantProvider>
            <YourApp />
        </DigitalAssistantProvider>
    );
}

export default App;
```

### 2. Use in Components

```typescript
import React from 'react';
import { 
    useAppSelector, 
    useAppDispatch, 
    setIsRecording,
    setSearchKeyword,
    setUserData 
} from '@digital-assistant/core/react';

function MyComponent() {
    const dispatch = useAppDispatch();
    
    // Select state from different slices
    const isRecording = useAppSelector(state => state.recording.isRecording);
    const searchKeyword = useAppSelector(state => state.flow.searchKeyword);
    const userData = useAppSelector(state => state.user.userData);
    
    const handleStartRecording = () => {
        dispatch(setIsRecording(true));
    };
    
    const handleSearch = (keyword: string) => {
        dispatch(setSearchKeyword(keyword));
    };
    
    return (
        <div>
            <p>Recording: {isRecording ? 'ON' : 'OFF'}</p>
            <button onClick={handleStartRecording}>Start Recording</button>
            <input 
                value={searchKeyword} 
                onChange={(e) => handleSearch(e.target.value)} 
                placeholder="Search..."
            />
        </div>
    );
}
```

## Vue.js Integration

```javascript
import { createApp } from 'vue';
import DigitalAssistantCore, { setIsRecording } from '@digital-assistant/core';

const app = createApp({
    data() {
        return {
            isRecording: false
        };
    },
    mounted() {
        // Subscribe to state changes
        this.unsubscribe = DigitalAssistantCore.subscribe((state) => {
            this.isRecording = state.recording.isRecording;
        });
    },
    beforeUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    },
    methods: {
        startRecording() {
            DigitalAssistantCore.dispatch(setIsRecording(true));
        }
    }
});
```

## Angular Integration

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import DigitalAssistantCore, { setIsRecording, RootState } from '@digital-assistant/core';

@Component({
    selector: 'app-recording',
    template: `
        <div>
            <p>Recording: {{ isRecording ? 'ON' : 'OFF' }}</p>
            <button (click)="startRecording()">Start Recording</button>
        </div>
    `
})
export class RecordingComponent implements OnInit, OnDestroy {
    isRecording = false;
    private unsubscribe?: () => void;
    
    ngOnInit() {
        this.unsubscribe = DigitalAssistantCore.subscribe((state: RootState) => {
            this.isRecording = state.recording.isRecording;
        });
    }
    
    ngOnDestroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    
    startRecording() {
        DigitalAssistantCore.dispatch(setIsRecording(true));
    }
}
```

## Available Actions

### User Actions
- `setUserData(userData)`
- `setAuthenticated(boolean)`
- `setKeycloakSessionData(data)`
- `setUserSessionData(data)`
- `setUserSessionId(id)`
- `clearUserData()`

### Recording Actions
- `setIsRecording(boolean)`
- `setIsPlaying(string)`
- `setManualPlay(string)`
- `setPlayDelay(string)`
- `setRecSequenceData(array)`
- `addRecSequenceData(item)`
- `setSelectedRecordingDetails(details)`
- `setShowRecord(boolean)`
- `setShowLoader(boolean)`
- `resetRecordingState()`

### Flow Actions
- `setSearchKeyword(keyword)`
- `setSearchResults(results)`
- `appendSearchResults(results)`
- `setPage(number)`
- `incrementPage()`
- `setHasMorePages(boolean)`
- `setReFetchSearch(string)`
- `setShowSearch(boolean)`
- `setRecordSequenceDetailsVisibility(boolean)`
- `resetFlowState()`

### Editing Actions
- `startEditingStep({ recordingId, editingStepId, editingStepData })`
- `cancelEditingStep()`
- `startValidation()`
- `markValidationCompleted()`
- `resetValidationState()`

### Validation Actions
- `startValidation(recordingId)`
- `markValidationCompleted()`
- `resetValidationState()`
