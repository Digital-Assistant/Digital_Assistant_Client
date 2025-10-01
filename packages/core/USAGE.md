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

## API Client Usage

The SDK includes a central API client with automatic JWT authentication for making HTTP requests.

### Basic API Client Usage

```typescript
import DigitalAssistantCore, { apiClient } from '@digital-assistant/core';

// Option 1: Using the SDK instance
const client = DigitalAssistantCore.getApiClient();

// Option 2: Direct import
import { apiClient } from '@digital-assistant/core';

// Make authenticated requests
try {
    const response = await apiClient.get('/api/user/profile');
    console.log('User profile:', response.data);
} catch (error) {
    console.error('API Error:', error.message);
}
```

### Available HTTP Methods

```typescript
// GET request
const getResponse = await apiClient.get<UserProfile>('/api/user/123');

// POST request  
const postResponse = await apiClient.post<CreateUserResponse>('/api/users', {
    name: 'John Doe',
    email: 'john@example.com'
});

// PUT request
const putResponse = await apiClient.put<UpdateUserResponse>('/api/users/123', {
    name: 'Jane Doe'
});

// PATCH request
const patchResponse = await apiClient.patch<User>('/api/users/123', {
    status: 'active'
});

// DELETE request
const deleteResponse = await apiClient.delete('/api/users/123');
```

### Custom API Client Configuration

```typescript
import { ApiClient } from '@digital-assistant/core';

// Create custom client with configuration
const customClient = new ApiClient({
    baseURL: 'https://api.example.com',
    timeout: 60000,
    additionalHeaders: {
        'X-Custom-Header': 'value',
        'X-App-Version': '1.0.0'
    }
});

// Update configuration after creation
customClient.updateBaseURL('https://new-api.example.com');
customClient.updateHeaders({ 'X-New-Header': 'new-value' });
```

### Authentication Token Management

The API client automatically:
- Reads JWT tokens from the Redux store's user state
- Attaches `Authorization: Bearer <token>` header to all requests
- Prioritizes tokens in this order:
  1. `keycloakSessionData.token`
  2. `userSessionData.authData.token`
  3. `userData.token`

```typescript
import { setKeycloakSessionData } from '@digital-assistant/core';

// Set authentication data - API client will automatically use it
DigitalAssistantCore.dispatch(setKeycloakSessionData({
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'refresh-token-here',
    userInfo: { id: '123', email: 'user@example.com' }
}));

// All subsequent API calls will be authenticated
const userProfile = await apiClient.get('/api/user/profile');
```

### Error Handling

```typescript
import { ApiError } from '@digital-assistant/core';

try {
    const response = await apiClient.get('/api/protected-resource');
    return response.data;
} catch (error) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
        case 401:
            console.log('User needs to re-authenticate');
            // Handle token refresh or redirect to login
            break;
        case 403:
            console.log('User lacks permissions');
            break;
        case 404:
            console.log('Resource not found');
            break;
        default:
            console.error('API Error:', apiError.message);
    }
}
```

### Custom Events

The API client dispatches custom events for handling authentication errors:

```typescript
// Listen for unauthorized events
window.addEventListener('digital-assistant:unauthorized', (event) => {
    console.log('Unauthorized API request detected:', event.detail);
    // Handle token refresh or redirect to login
});
```

### Advanced Usage

```typescript
import { apiClient } from '@digital-assistant/core';

// Access underlying Axios instance for advanced usage
const axiosInstance = apiClient.getAxiosInstance();

// Add custom interceptors
axiosInstance.interceptors.request.use((config) => {
    // Custom request logic
    config.metadata = { startTime: Date.now() };
    return config;
});

// Get current configuration
const config = apiClient.getConfig();
console.log('Current timeout:', config.timeout);
```

### Framework-Specific Examples

#### React Hook for API Calls

```typescript
import { useState, useEffect } from 'react';
import { apiClient, ApiError } from '@digital-assistant/core';

function useApiData<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<T>(url);
                setData(response.data);
            } catch (err) {
                setError(err as ApiError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

// Usage in component
function UserProfile({ userId }: { userId: string }) {
    const { data: user, loading, error } = useApiData<User>(`/api/users/${userId}`);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return <div>Welcome, {user?.name}!</div>;
}
```

#### Vue Composition API

```typescript
import { ref, onMounted } from 'vue';
import { apiClient } from '@digital-assistant/core';

export function useApiData<T>(url: string) {
    const data = ref<T | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const fetchData = async () => {
        try {
            loading.value = true;
            const response = await apiClient.get<T>(url);
            data.value = response.data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchData);

    return { data, loading, error, refetch: fetchData };
}
```

## TypeScript Support

The SDK provides full TypeScript support with proper type definitions:

```typescript
import type { 
    RootState, 
    ApiResponse, 
    ApiError, 
    ApiClientConfig 
} from '@digital-assistant/core';

// Type-safe state access
const state: RootState = DigitalAssistantCore.getState();
const isRecording: boolean = state.recording.isRecording;

// Type-safe API responses
interface UserProfile {
    id: string;
    name: string;
    email: string;
}

const response: ApiResponse<UserProfile> = await apiClient.get('/api/user/profile');
const user: UserProfile = response.data;
```
