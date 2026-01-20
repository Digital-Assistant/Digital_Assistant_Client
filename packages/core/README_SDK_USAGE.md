# @digital-assistant/core - SDK Usage Guide

## Platform-Agnostic Digital Assistant Core SDK

This package contains the core business logic for the Universal Digital Assistant (UDA), designed to work in **multiple environments**:

- ✅ Browser Extensions (Chrome, Edge, etc.)
- ✅ Standalone Web Applications
- ✅ Node.js Environments (where applicable)

---

## Installation

### In Browser Extension
Already included via local file reference:
```json
{
  "dependencies": {
    "@digital-assistant/core": "file:./packages/core"
  }
}
```

### In Standalone Application
```bash
npm install @digital-assistant/core
# or
yarn add @digital-assistant/core
```

---

## Usage Examples

### 1. Basic SDK Initialization

```typescript
import { DigitalAssistantCore } from '@digital-assistant/core';

const config = {
    apiUrl: 'https://your-api.com',
    realm: 'your-realm',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
};

const sdk = new DigitalAssistantCore(config);
```

### 2. Session Management

```typescript
import {
    UDASessionData,
    UDAGetSessionKey,
    UDAStorageService
} from '@digital-assistant/core';

// Create new session
const sessionData = new UDASessionData();
await UDAGetSessionKey(sessionData);

// Store session
await UDAStorageService.set('sessionKey', sessionData);

// Retrieve session
const storedSession = await UDAStorageService.get('sessionKey');
```

### 3. Keycloak Authentication (Platform-Agnostic)

```typescript
import {
    UDASessionData,
    keyCloakStore
} from '@digital-assistant/core';

// Initialize session
const sessionData = new UDASessionData();

// Keycloak authentication data
const keycloakData = {
    id: 'user-id',
    email: 'user@example.com',
    token: 'keycloak-token',
    // ... other keycloak data
};

// Store and authenticate
await keyCloakStore(sessionData, keycloakData);

console.log('Authenticated:', sessionData.authenticated);
console.log('Auth Source:', sessionData.authenticationSource); // 'keycloak'
```

### 4. Custom Authentication

```typescript
import {
    UDASessionData,
    UDABindAuthenticatedAccount,
    UDADigestMessage
} from '@digital-assistant/core';

// Create session
const sessionData = new UDASessionData();

// Custom authentication data
const userId = 'your-user-id';
const userEmail = 'user@example.com';

// Encrypt sensitive data
const encryptedId = await UDADigestMessage(userId, 'SHA-512');
const encryptedEmail = await UDADigestMessage(userEmail, 'SHA-512');

// Set authentication data
sessionData.authenticated = true;
sessionData.authenticationSource = 'custom';
sessionData.authData = {
    id: encryptedId,
    email: encryptedEmail,
    token: 'your-auth-token'
};

// Bind account
await UDABindAuthenticatedAccount(sessionData, false);
```

### 5. OAuth 2.0 Integration Example

```typescript
import {
    UDASessionData,
    UDAGetSessionKey,
    UDABindAuthenticatedAccount
} from '@digital-assistant/core';

async function authenticateWithOAuth() {
    // Get OAuth token (your implementation)
    const oauthToken = await yourOAuthFlow();

    // Initialize UDA session
    const sessionData = new UDASessionData();
    await UDAGetSessionKey(sessionData);

    // Set OAuth data
    sessionData.authenticated = true;
    sessionData.authenticationSource = 'oauth';
    sessionData.authData = {
        id: oauthToken.userId,
        email: oauthToken.email,
        token: oauthToken.accessToken
    };

    // Bind account
    await UDABindAuthenticatedAccount(sessionData, false);

    return sessionData;
}
```

### 6. Working with Redux Store

```typescript
import { store, AppDispatch, RootState } from '@digital-assistant/core';

// Get current state
const state: RootState = store.getState();

// Dispatch actions
const dispatch: AppDispatch = store.dispatch;
dispatch(someAction());

// Subscribe to changes
const unsubscribe = store.subscribe(() => {
    const newState = store.getState();
    console.log('State updated:', newState);
});

// Unsubscribe when done
unsubscribe();
```

### 7. Using Services

```typescript
import { apiClient, TranslateService, ErrorLoggerService } from '@digital-assistant/core';

// API Client
const response = await apiClient.get('/endpoint');
const data = await apiClient.post('/endpoint', { payload });

// Translation Service
const translateService = new TranslateService(apiClient, config, errorLogger);
const translated = await translateService.translate('Hello', 'es');

// Error Logging
const errorLogger = new ErrorLoggerService(config);
errorLogger.logError('Something went wrong', error);
```

---

## API Reference

### Core Exports

#### Authentication & Session
- `UDASessionData` - Session data model
- `UDAGetSessionKey` - Get session key from backend
- `UDABindAuthenticatedAccount` - Bind authenticated account
- `UDASendSessionData` - Send session data
- `UDABindAccount` - Account binding logic
- `UDADigestMessage` - SHA-512 encryption
- `keyCloakStore` - Keycloak authentication handler

#### Browser Utilities
- `getBrowserVar()` - Get browser API object
- `getUDASessionName()` - Get session name
- `updateActiveTabId()` - Update active tab
- `updateBrowserPlugin()` - Update plugin state

#### Storage
- `UDAStorageService` - Cross-platform storage abstraction
  - `.get(key)` - Retrieve data
  - `.set(key, value)` - Store data
  - `.remove(key)` - Remove data

#### Configuration
- `AuthDataConfig` - Authentication configuration
- `AuthConfig` - Auth config utilities
- `AppConfig` - Application configuration
- `CustomConfig` - Custom configuration

#### State Management
- `store` - Redux store instance
- `AppDispatch` - TypeScript type for dispatch
- `RootState` - TypeScript type for state

---

## Environment Support

### Browser Extension
```typescript
import { getBrowserVar, updateBrowserPlugin } from '@digital-assistant/core';

const browserVar = getBrowserVar();
updateBrowserPlugin(true);

// Access extension APIs
browserVar.tabs.query({ active: true });
browserVar.storage.local.get('key');
```

### Standalone Web App
```typescript
import { DigitalAssistantCore, keyCloakStore } from '@digital-assistant/core';

// No browser extension APIs used
const sdk = new DigitalAssistantCore(config);
```

### Node.js (Backend)
```typescript
import { UDADigestMessage, apiClient } from '@digital-assistant/core';

// Use utility functions
const hashed = await UDADigestMessage('data', 'SHA-512');
```

---

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type {
    RootState,
    AppDispatch,
    UDASessionData
} from '@digital-assistant/core';

function useTypedSelector<T>(selector: (state: RootState) => T): T {
    // Your implementation
}
```

---

## Build Outputs

### ES Module (Recommended)
```javascript
import { ... } from '@digital-assistant/core';
```
Uses: `dist/index.esm.js`

### CommonJS
```javascript
const { ... } = require('@digital-assistant/core');
```
Uses: `dist/index.cjs.js`

### TypeScript Definitions
```typescript
import type { ... } from '@digital-assistant/core';
```
Uses: `dist/index.d.ts`

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 88+ | ✅ Full |
| Edge | 88+ | ✅ Full |
| Firefox | 78+ | ⚠️ Limited (no chrome.identity) |
| Safari | 14+ | ⚠️ Limited (no chrome.identity) |
| Opera | 74+ | ✅ Full |

**Note:** `chrome.identity` API is only available in Chrome/Edge extensions.

---

## Best Practices

### 1. Error Handling
```typescript
try {
    await UDABindAuthenticatedAccount(sessionData, false);
} catch (error) {
    console.error('Authentication failed:', error);
    // Handle error
}
```

### 2. Session Persistence
```typescript
// Always store session after authentication
await UDAStorageService.set('udaUserData', sessionData);

// Restore on app init
const restored = await UDAStorageService.get('udaUserData');
if (restored) {
    // Session exists
}
```

### 3. Token Renewal
```typescript
// Renew token when needed
await UDABindAuthenticatedAccount(sessionData, true); // renewToken = true
```

---

## Migration from Browser Extension

If migrating from browser extension code:

### Before (Extension-Specific)
```typescript
// Extension background script
import { LoginWithBrowser } from './util/LoginWithBrowser';
await LoginWithBrowser(sessionData, false);
```

### After (Platform-Agnostic)
```typescript
// Standalone app
import { keyCloakStore } from '@digital-assistant/core';
await keyCloakStore(sessionData, keycloakData);
```

---

## Troubleshooting

### Import Errors
```bash
# Rebuild the package
cd packages/core
npm run build
```

### Missing Types
```bash
# Ensure TypeScript definitions are generated
npm run build
ls dist/index.d.ts
```

### Browser API Not Available
```typescript
// Check if running in browser extension
import { getUDABrowserPlugin } from '@digital-assistant/core';

if (getUDABrowserPlugin()) {
    // Extension-specific code
} else {
    // Standalone app code
}
```

---

## Contributing

See main repository README for contribution guidelines.

## License

ISC

## Support

- Email: yureshwar@gmail.com
- Documentation: See `MIGRATION_GUIDE.md`

---

**Version:** 1.0.0
**Last Updated:** January 2026
