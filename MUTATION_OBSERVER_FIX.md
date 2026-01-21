# MutationObserver Lazy Initialization Fix

## Problem
Service worker was throwing:
```
Uncaught ReferenceError: MutationObserver is not defined
```

## Root Cause
The file `packages/core/src/util/recording/domChanges.ts` was creating a `MutationObserver` instance at the **module level** (top-level code that runs when the file is imported):

```typescript
// ❌ Runs immediately when module is imported
export const observer = new MutationObserver((mutationList, observer) => {
    // ...
});
```

Since this file is exported through:
- `util/recording/index.ts` → `export * from './domChanges'`
- `util/index.ts` → `export * from './recording'`
- `packages/core/src/index.ts` → `export * from './util'`

When the service worker imports the core package, this code executes immediately, but `MutationObserver` doesn't exist in service worker contexts (it's a DOM API).

## Solution
Changed from **eager initialization** to **lazy initialization** using a getter pattern:

### Before (Eager - Crashes)
```typescript
// ❌ Created immediately at module load
export const observer = new MutationObserver((mutationList, observer) => {
    // callback logic
});

export function initializeDomChanges() {
    observer.observe(document.body, { /* options */ });
}
```

### After (Lazy - Safe)
```typescript
// Private instance, not created until needed
let _observer: MutationObserver | null = null;

// Getter function - creates observer only when called
function getObserver(): MutationObserver {
    if (!_observer) {
        if (typeof MutationObserver === 'undefined') {
            throw new Error('MutationObserver is not available in this context');
        }

        _observer = new MutationObserver((mutationList, observer) => {
            // callback logic
        });
    }
    return _observer;
}

// Export a proxy object for backward compatibility
export const observer = {
    observe: (target: Node, options?: MutationObserverInit) => {
        return getObserver().observe(target, options);
    },
    disconnect: () => {
        return getObserver().disconnect();
    },
    takeRecords: () => {
        return getObserver().takeRecords();
    }
};

export function initializeDomChanges() {
    // getObserver() creates the instance on first call
    getObserver().observe(document.body, { /* options */ });
}
```

## How It Works

### Service Worker Context
```typescript
import { observer } from '@digital-assistant/core';
// ✅ No error - MutationObserver not created yet

// If someone tried to use it (they won't):
// observer.observe(...) → getObserver() → throws clear error
```

### Web Page Context (Content Scripts)
```typescript
import { initializeDomChanges } from '@digital-assistant/core';

// First call to initializeDomChanges()
initializeDomChanges();
// → getObserver() is called
// → MutationObserver exists in browser context
// → Creates _observer instance
// → Starts observing DOM changes
// ✅ Works perfectly
```

## Key Design Decisions

### 1. Backward Compatibility
The exported `observer` object maintains the same API:
```typescript
// Old code still works
observer.observe(element, options);
observer.disconnect();
observer.takeRecords();
```

### 2. Singleton Pattern
The `_observer` variable ensures only one `MutationObserver` instance is created:
```typescript
let _observer: MutationObserver | null = null;

function getObserver(): MutationObserver {
    if (!_observer) {
        _observer = new MutationObserver(/* ... */);
    }
    return _observer;  // Reuse same instance
}
```

### 3. Clear Error Messages
If someone tries to use it in an invalid context:
```typescript
if (typeof MutationObserver === 'undefined') {
    throw new Error('MutationObserver is not available in this context');
}
```

## Why This Pattern?

### Alternative 1: Remove from Exports
**Rejected** - Other parts of the codebase need `observer` for DOM change tracking during recording.

### Alternative 2: Conditional Export
```typescript
export const observer = typeof MutationObserver !== 'undefined'
    ? new MutationObserver(/* ... */)
    : null;
```
**Rejected** - Check happens at module load time, still crashes in service worker.

### Alternative 3: Lazy Initialization (Chosen) ✅
- **Pro**: MutationObserver only created when actually used
- **Pro**: Service worker can import module safely
- **Pro**: Backward compatible API
- **Pro**: Clear error if misused
- **Con**: Tiny overhead on first call (negligible)

## Files Modified

**File**: `packages/core/src/util/recording/domChanges.ts`

**Changes**:
1. Removed top-level `new MutationObserver(...)` call
2. Added private `_observer` variable
3. Added `getObserver()` getter function with lazy initialization
4. Exported `observer` as a proxy object with `observe`, `disconnect`, `takeRecords` methods
5. Updated `initializeDomChanges()` to call `getObserver()`

## Testing

After rebuilding:
```bash
cd packages/core && npm run build
cd ../.. && npm run build
```

Verify:
1. ✅ Service worker loads without MutationObserver error
2. ✅ Recording still works (observer created when `initializeDomChanges()` called)
3. ✅ DOM changes are tracked correctly during recording

## Pattern for Other DOM APIs

This same lazy initialization pattern should be used for any DOM API accessed at module level:

### DOM APIs That Don't Exist in Service Workers:
- `MutationObserver` ✅ Fixed
- `IntersectionObserver`
- `ResizeObserver`
- `PerformanceObserver`
- `document` object
- `window` object (when not checked with `typeof`)
- `localStorage` ✅ Already fixed with storageHelper
- `DOM APIs` (createElement, querySelector, etc.) - Only used inside functions ✅

### Check Performed:
Searched the codebase for top-level usage of these APIs - **only `MutationObserver` was found**, now fixed.

## Related Fixes

This is part of a series of service worker compatibility fixes:
- **localStorage errors** → `REDUX_STORAGE_FIX.md`
- **window undefined** → `WINDOW_UNDEFINED_FIX.md`
- **domJSON library** → `DOMJSON_DYNAMIC_IMPORT_FIX.md`
- **MutationObserver** → This document (lazy initialization)

## Summary

**Problem**: `MutationObserver` created at module load time crashes in service workers

**Solution**: Lazy initialization - create the observer only when it's actually used

**Result**: Core package can be safely imported in service workers, observer works in web contexts
