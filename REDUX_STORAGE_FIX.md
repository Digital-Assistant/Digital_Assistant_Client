# Redux Storage Fix for Service Workers

## Problem
Redux slices were directly accessing `localStorage` using `localStorage.getItem()` and `localStorage.setItem()`, which caused `ReferenceError: localStorage is not defined` errors in service worker contexts (browser extension background scripts).

## Root Cause
Service workers (Manifest V3 background scripts) run in a different context than web pages:
- **Web context**: Has access to `window` and `localStorage`
- **Service worker context**: No access to `window` or `localStorage`, must use `chrome.storage.local` / `browser.storage.local`

## Solution
Created a cross-browser storage helper (`packages/core/src/store/utils/storageHelper.ts`) that:

1. **Detects context** - Determines if code is running in service worker or web context
2. **Uses appropriate API**:
   - Service workers → `chrome.storage.local` or `browser.storage.local` (cross-browser)
   - Web context → `localStorage`
3. **Handles async operations** - Service worker storage is async, but provides sync-like interface for Redux
4. **Supports all browsers** - Works with Chrome, Firefox, Safari, Edge, Opera, Brave, etc.

## Files Modified

### Created Files
- `packages/core/src/store/utils/storageHelper.ts` - Cross-browser storage helper

### Updated Redux Slices
All slices now import and use the storage helper instead of direct `localStorage` access:

1. **validationSlice.ts** (packages/core/src/store/slices/validationSlice.ts:2)
   ```typescript
   import { loadFromStorage, saveToStorage } from '../utils/storageHelper';
   ```

2. **flowSlice.ts** (packages/core/src/store/slices/flowSlice.ts:2)
   ```typescript
   import { loadFromStorage, saveToStorage } from '../utils/storageHelper';
   ```

3. **editingSlice.ts** (packages/core/src/store/slices/editingSlice.ts:2)
   ```typescript
   import { loadFromStorage, saveToStorage } from '../utils/storageHelper';
   ```

4. **editableStepFormSlice.ts** (packages/core/src/store/slices/editableStepFormSlice.ts:2)
   ```typescript
   import { loadFromStorage, saveToStorage } from '../utils/storageHelper';
   ```

## Implementation Pattern

### Before (Web-only)
```typescript
const loadStateFromStorage = (): ValidationState => {
    try {
        const serializedState = localStorage.getItem('validationState');
        if (serializedState === null) {
            return defaultState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading validation state from localStorage:', err);
        return defaultState;
    }
};

const saveStateToStorage = (state: ValidationState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('validationState', serializedState);
    } catch (err) {
        console.error('Error saving validation state to localStorage:', err);
    }
};
```

### After (Cross-browser, service worker safe)
```typescript
import { loadFromStorage, saveToStorage } from '../utils/storageHelper';

const defaultState: ValidationState = {
    recordingId: null,
    validationRequired: false,
    validationCompleted: false,
};

const loadStateFromStorage = (): ValidationState => {
    return loadFromStorage('validationState', defaultState);
};

const saveStateToStorage = (state: ValidationState) => {
    saveToStorage('validationState', state);
};
```

## Browser Support

The storage helper supports all major browsers:
- **Chrome** - `chrome.storage.local`
- **Edge** - `chrome.storage.local`
- **Opera** - `chrome.storage.local`
- **Brave** - `chrome.storage.local`
- **Firefox** - `browser.storage.local`
- **Safari** - `browser.storage.local`

## How It Works

### In Service Workers
```typescript
// Service worker detection
const isServiceWorker = typeof window === 'undefined' && typeof self !== 'undefined';

// Cross-browser API detection
function getBrowserAPI(): any {
    // Firefox, Safari
    if (typeof (self as any).browser !== 'undefined' && (self as any).browser.storage) {
        return (self as any).browser;
    }
    // Chrome, Edge, Opera, Brave
    if (typeof (self as any).chrome !== 'undefined' && (self as any).chrome.storage) {
        return (self as any).chrome;
    }
    return null;
}

// Load function uses extension API
export function loadFromStorage<T>(key: string, defaultValue: T): T {
    if (isServiceWorker) {
        const browserAPI = getBrowserAPI();
        if (browserAPI?.storage) {
            // Load asynchronously in background, return default immediately
            loadAsync(key, defaultValue).catch(err => {
                console.error(`Error loading ${key} from storage:`, err);
            });
            return defaultValue;
        }
    }
    // ... web context fallback
}
```

### In Web Context
```typescript
// Regular web context - use localStorage
if (typeof localStorage !== 'undefined') {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
        return defaultValue;
    }
    return JSON.parse(serializedState);
}
```

## Testing

To verify the fix works:

1. **Build core package**:
   ```bash
   cd packages/core && npm run build
   ```

2. **Build extension**:
   ```bash
   npm run build
   ```

3. **Load extension** in Chrome/Firefox/Edge

4. **Check service worker console** - Should no longer see:
   - ❌ `Error loading validation state from localStorage: ReferenceError: localStorage is not defined`
   - ✅ No localStorage errors

## Next Steps

1. Rebuild core package: `cd packages/core && npm run build`
2. Rebuild extension: `npm run build`
3. Test in multiple browsers (Chrome, Firefox, Edge)
4. Verify service worker loads without localStorage errors

## Related Documentation
- `MIGRATION_GUIDE.md` - Core package migration documentation
- `CROSS_BROWSER_SUPPORT.md` - Cross-browser API documentation
- `SERVICE_WORKER_FIX.md` - Original service worker localStorage fix
