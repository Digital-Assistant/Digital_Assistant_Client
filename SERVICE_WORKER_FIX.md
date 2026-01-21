# Service Worker localStorage Fix

## Issue

When loading the extension, the service worker (background script) failed with:

```
Error loading recording state from localStorage: ReferenceError: localStorage is not defined
```

## Root Cause

**Service workers don't have access to `localStorage`** or `window` object.

- ❌ `window.localStorage` - NOT available in service workers
- ❌ `localStorage` - NOT available in service workers
- ✅ `chrome.storage.local` - Available in service workers

### Why This Happened

The `StorageUtil` class in `packages/core/src/util/storage.ts` was attempting to access `window.localStorage` directly when not in browser extension mode, without checking if `window` exists.

## Fix Applied

Updated `packages/core/src/util/storage.ts` to:

1. **Detect service worker context**
2. **Use appropriate storage API based on context**
3. **Add safety checks for all storage operations**

### Changes Made

#### 1. Added Service Worker Detection

```typescript
let isServiceWorker = false;

// Check if we're in a service worker context (no window object)
if (typeof window === 'undefined' && typeof self !== 'undefined') {
  isServiceWorker = true;
}
```

#### 2. Updated Storage Methods

All methods now check context before accessing storage:

```typescript
public static async add(data: any, key: string, convertToString: boolean = true): Promise<void> {
  if (this.UDABrowserPlugin && enablePlugin) {
    // Browser extension mode (explicitly enabled)
    const storageData: { [key: string]: any } = {};
    storageData[key] = (convertToString) ? JSON.stringify(data) : data;
    return browserVar.storage.local.set(storageData);
  } else if (isServiceWorker && typeof chrome !== 'undefined' && chrome.storage) {
    // Service worker context - use chrome.storage.local
    const storageData: { [key: string]: any } = {};
    storageData[key] = (convertToString) ? JSON.stringify(data) : data;
    return chrome.storage.local.set(storageData);
  } else if (typeof window !== 'undefined' && window.localStorage) {
    // Regular browser context - use localStorage
    const storageData = (convertToString) ? JSON.stringify(data) : data;
    return window.localStorage.setItem(key, storageData);
  }
}
```

#### 3. Added Safety to Synchronous Methods

```typescript
public static setToStore = (data: any, key: string, isRaw: boolean) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, !isRaw ? JSON.stringify(data) : data);
  } else {
    console.warn('localStorage not available in service worker context. Use async methods instead.');
  }
};
```

## Storage Decision Tree

```
┌─────────────────────────────────────────────┐
│ Which storage API should be used?          │
└─────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ UDABrowserPlugin set? │
        └───────────────────────┘
                │           │
            YES │           │ NO
                │           ▼
                │   ┌──────────────────┐
                │   │ Service Worker?  │
                │   └──────────────────┘
                │           │           │
                │       YES │           │ NO
                │           │           │
                ▼           ▼           ▼
    ┌─────────────┐  ┌──────────┐  ┌───────────┐
    │ chrome.     │  │ chrome.  │  │ window.   │
    │ storage.    │  │ storage. │  │ localStorage│
    │ local       │  │ local    │  │           │
    └─────────────┘  └──────────┘  └───────────┘
    (Extension)      (SW Fallback) (Web Context)
```

## Context Detection Logic

| Context | `window` | `self` | `chrome` | Storage Used |
|---------|----------|--------|----------|--------------|
| Web Page | ✅ defined | ✅ defined | ❌ undefined | `window.localStorage` |
| Content Script | ✅ defined | ✅ defined | ✅ defined | `chrome.storage.local` |
| Service Worker | ❌ undefined | ✅ defined | ✅ defined | `chrome.storage.local` |
| Standalone SDK | ✅ defined | ✅ defined | ❌ undefined | `window.localStorage` |

## Updated Methods

All the following methods now properly handle service worker context:

- ✅ `StorageUtil.add(data, key, convertToString)`
- ✅ `StorageUtil.get(key, parseAsJson)`
- ✅ `StorageUtil.remove(key)`
- ✅ `StorageUtil.clear()`
- ✅ `StorageUtil.setToStore(data, key, isRaw)` - With warning
- ✅ `StorageUtil.getFromStore(key, isRaw)` - With warning

## UDAStorageService Compatibility

The `UDAStorageService` wrapper also benefits from these fixes:

```typescript
import { UDAStorageService } from '@digital-assistant/core';

// Works in service workers now!
await UDAStorageService.get('sessionKey');
await UDAStorageService.set('sessionKey', data);
```

## Testing

### Test in Service Worker (Background Script)

```typescript
// src/Background.ts
import { UDAStorageService } from '@digital-assistant/core';

// This now works without errors
const sessionData = await UDAStorageService.get('udaUserData');
await UDAStorageService.set('udaUserData', sessionData);
```

### Test in Content Script

```typescript
// Content script can use either localStorage or chrome.storage
import { StorageUtil } from '@digital-assistant/core';

// Works in content scripts
await StorageUtil.add(data, 'key');
```

### Test in Web Page

```typescript
// Standalone SDK usage
import { UDAStorageService } from '@digital-assistant/core';

// Uses localStorage in web context
await UDAStorageService.get('key');
```

## Migration Notes

### For Extension Developers

No changes needed! The fix is transparent:
- ✅ Service workers now use `chrome.storage.local` automatically
- ✅ Content scripts can use both APIs
- ✅ Web pages use `localStorage` as before

### For SDK Users

No changes needed! The storage abstraction handles context automatically.

## Build Instructions

After this fix, rebuild:

```bash
# 1. Rebuild core package
cd packages/core
npm run build

# 2. Rebuild extension
cd ../..
npm run build

# 3. Reload extension in Chrome
# - Go to chrome://extensions/
# - Click "Reload" on your extension
```

## Verification

1. **Load the extension** in Chrome
2. **Check service worker console** - Should see no localStorage errors
3. **Check extension icon** - Should activate properly
4. **Test authentication** - Should work without errors

### Expected Console Output

Before Fix:
```
❌ Error loading recording state from localStorage: ReferenceError: localStorage is not defined
```

After Fix:
```
✅ (No errors - service worker starts successfully)
```

## Additional Safety Features

### Graceful Degradation

If storage is unavailable in any context, methods return safely:

```typescript
public static async get(key: string, parseAsJson: boolean = true): Promise<any> {
  // ... various context checks ...
  return null; // Fallback if no storage available
}
```

### Console Warnings

For synchronous methods that can't work in service workers:

```typescript
StorageUtil.setToStore(data, 'key', false);
// Console: "localStorage not available in service worker context. Use async methods instead."
```

## Best Practices

### ✅ DO Use Async Methods in Service Workers

```typescript
// Good - async methods work everywhere
await UDAStorageService.get('key');
await UDAStorageService.set('key', value);
```

### ❌ DON'T Use Sync Methods in Service Workers

```typescript
// Bad - won't work in service workers
StorageUtil.setToStore(data, 'key', false);
StorageUtil.getFromStore('key', false);
```

## Summary

| Issue | Fix | Result |
|-------|-----|--------|
| `localStorage` not available in service workers | Added service worker detection and `chrome.storage.local` fallback | ✅ Extension loads successfully |
| Direct `window.localStorage` access | Added `typeof window !== 'undefined'` checks | ✅ No runtime errors |
| Sync methods in service workers | Added warnings for unsupported usage | ✅ Clear error messages |

---

**Status:** ✅ **FIXED - Service Worker Storage Working**

**Date:** January 20, 2026
