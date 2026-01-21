# DomJSON Dynamic Import Fix for Service Workers

## Problem
Service worker registration was failing with status code 15. The error trace showed the `domjson` library was accessing `window.navigator` without checking if `window` exists, causing crashes in service worker contexts.

## Root Cause
The `domjson` library (third-party npm package) has initialization code that runs when the module is imported:

```javascript
var metadata = {
    href: win?.location?.href || null,
    userAgent: window.navigator && window.navigator.userAgent ? window.navigator.userAgent : null,
    version: "0.1.2"
};
```

**Issue**: It uses `win?.location?.href` (safe) but then directly accesses `window.navigator` (unsafe).

This code executed immediately when the module was imported at the top level:
```typescript
import domJSON from "domjson";  // ❌ Executes immediately, crashes in service worker
```

Since the core package imports these modules, and the service worker imports the core package, `domjson` was being loaded in the service worker context where `window` doesn't exist.

## Solution
Changed from static imports to **dynamic imports** using `import()` syntax. Dynamic imports only execute when the function is called, not when the module loads.

### Files Modified

#### 1. processNodeForClickData.ts
**Location**: `packages/core/src/util/node/processNodeForClickData.ts`

**Before:**
```typescript
// @ts-ignore
import domJSON from "domjson";  // ❌ Runs at module load time

export const processNodeForClickData = async (node: any) => {
    const processedNode = await node.cloneNode(true);
    let objectData: any = domJSON.toJSON(processedNode, {
        serialProperties: true,
    });
    return objectData;
};
```

**After:**
```typescript
// No top-level import ✅

export const processNodeForClickData = async (node: any) => {
    const processedNode = await node.cloneNode(true);

    // ✅ Dynamic import - only loads when function is called
    // @ts-ignore
    const domJSON = await import("domjson");
    const domJSONModule = domJSON.default || domJSON;

    let objectData: any = domJSONModule.toJSON(processedNode, {
        serialProperties: true,
    });
    return objectData;
};
```

#### 2. searchNodes.ts
**Location**: `packages/core/src/util/node/searchNodes.ts`

**Before:**
```typescript
import domJSON from "domjson";  // ❌ Runs at module load time

export const searchNodes = (recordedNode: any, compareElements: any) => {
    // ... sync function
    let compareNode = domJSON.toJSON(searchNode.node, { serialProperties: true });
    // ...
}
```

**After:**
```typescript
// No top-level import ✅

// Cache to avoid repeated imports
let domJSONModule: any = null;

// ✅ Changed to async to support dynamic import
export const searchNodes = async (recordedNode: any, compareElements: any) => {
    // ✅ Load domJSON dynamically (only once, then cached)
    if (!domJSONModule) {
        // @ts-ignore
        const domJSON = await import("domjson");
        domJSONModule = domJSON.default || domJSON;
    }

    // ... rest of function
    let compareNode = domJSONModule.toJSON(searchNode.node, { serialProperties: true });
    // ...
}
```

**Key changes:**
- Removed top-level `import domJSON from "domjson"`
- Added module-level cache variable `domJSONModule`
- Changed function signature from sync to `async`
- Added dynamic import with caching on first call
- Handles both CommonJS (`default`) and ES module exports

#### 3. invokeNode.ts
**Location**: `packages/core/src/util/playback/invokeNode.ts:142`

**Before:**
```typescript
finalMatchElement = searchNodes(recordedNode, compareElements);  // ❌ Missing await
```

**After:**
```typescript
finalMatchElement = await searchNodes(recordedNode, compareElements);  // ✅ Added await
```

Updated the call site to `await` the now-async `searchNodes` function.

## How Dynamic Imports Work

### Static Import (Old Way)
```typescript
import domJSON from "domjson";
// Module executes IMMEDIATELY when file is imported
// ❌ Crashes if window doesn't exist
```

### Dynamic Import (New Way)
```typescript
const domJSON = await import("domjson");
// Module only executes when import() is called
// ✅ Won't load in service worker since these functions aren't called there
```

## Why This Works

1. **Service Worker Context**:
   - Background.ts doesn't call `processNodeForClickData` or `searchNodes`
   - These functions are only called from web page contexts (during recording/playback)
   - Dynamic import means `domjson` never loads in service worker

2. **Web Page Context**:
   - When recording or playback happens, these functions are called
   - Dynamic import loads `domjson` at that time
   - `window` exists in web pages, so `domjson` works correctly

## Performance Optimization

Added caching in `searchNodes.ts` to avoid repeated imports:
```typescript
let domJSONModule: any = null;  // Module-level cache

if (!domJSONModule) {
    const domJSON = await import("domjson");
    domJSONModule = domJSON.default || domJSON;
}
```

**Benefits:**
- First call: Loads module (small async overhead)
- Subsequent calls: Uses cached module (no overhead)

## Testing

After rebuilding:
```bash
cd packages/core && npm run build
cd ../.. && npm run build
```

Verify:
1. ✅ Service worker loads successfully (no status code 15)
2. ✅ Recording still works (domJSON loads in content scripts)
3. ✅ Playback still works (domJSON loads during playback)

## Related Fixes

This is part of a series of service worker compatibility fixes:
- **localStorage errors** → `REDUX_STORAGE_FIX.md`
- **window undefined** → `WINDOW_UNDEFINED_FIX.md`
- **domJSON third-party lib** → This document (dynamic imports)

## Pattern for Future Third-Party Libraries

If a third-party library accesses browser-only APIs (window, document, DOM):

1. **Don't import at top level** if the library might load in service workers
2. **Use dynamic imports** inside functions that only run in browser contexts
3. **Cache the module** to avoid repeated import overhead
4. **Make function async** if it wasn't already

Example pattern:
```typescript
// Module-level cache
let someLibModule: any = null;

export const myFunction = async () => {
    // Load on first call
    if (!someLibModule) {
        const lib = await import("some-browser-lib");
        someLibModule = lib.default || lib;
    }

    // Use the library
    return someLibModule.doSomething();
};
```

## Why Not Fix domjson Library?

The `domjson` library is a third-party dependency. Options considered:

1. **Fork and fix**: Maintenance burden, need to publish to npm
2. **Submit PR**: Slow, uncertain acceptance
3. **Dynamic import workaround**: ✅ Quick, no external dependencies, future-proof

Dynamic imports solve the problem without waiting for upstream fixes.
