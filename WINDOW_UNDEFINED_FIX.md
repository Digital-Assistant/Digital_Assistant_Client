# Window Undefined Fix for Service Workers

## Problem
Service worker (background script) was throwing:
```
Uncaught ReferenceError: window is not defined
Context: assets/UDABackground.js
```

## Root Cause
Two files in the core package were accessing `window` object without checking if it exists:

1. **fetchDomain.ts** - Directly accessed `window.location.host` and `window.UDAGlobalConfig`
2. **AuthManager.ts** - Accessed `window.location.origin` when initializing Keycloak

Service workers don't have access to the `window` object - only web pages do.

## Solution

### 1. Fixed fetchDomain.ts
**Location**: `packages/core/src/util/fetchDomain.ts:13-23`

**Before:**
```typescript
export const fetchDomain = () => {
    let finalDomain = window.location.host; // ❌ Crashes in service worker

    if(window.UDAGlobalConfig.enableForAllDomains){
        // ...
    }
    return finalDomain;
}
```

**After:**
```typescript
export const fetchDomain = (): string | null => {
    // ✅ Check if we're in a browser context with window.location
    if (typeof window === 'undefined' || !window.location) {
        return null;
    }

    let finalDomain = window.location.host;

    // ✅ Check UDAGlobalConfig exists before accessing
    // @ts-ignore - UDAGlobalConfig is added at runtime
    if(window.UDAGlobalConfig && window.UDAGlobalConfig.enableForAllDomains){
        const parseResult = parseDomain(finalDomain);
        // ...
    }
    return finalDomain;
}
```

**Changes:**
- Added `window` existence check at the start
- Returns `null` in service worker/Node.js contexts
- Added null check for `window.UDAGlobalConfig`
- Updated return type to `string | null`

### 2. Fixed AuthManager.ts
**Location**: `packages/core/src/services/AuthManager.ts:59-68`

**Before:**
```typescript
this.keycloak = new Keycloak(keycloakConfig);

try {
    this.authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // ❌ Crashes
        pkceMethod: 'S256',
    });
}
```

**After:**
```typescript
this.keycloak = new Keycloak(keycloakConfig);

try {
    // ✅ Build redirect URI - only use window.location in browser context
    const redirectUri = (typeof window !== 'undefined' && window.location)
        ? window.location.origin + '/silent-check-sso.html'
        : undefined;

    this.authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: redirectUri,
        pkceMethod: 'S256',
    });
}
```

**Changes:**
- Extract redirect URI building to a separate conditional expression
- Only build URI when `window.location` is available
- Pass `undefined` in service worker context (Keycloak will handle gracefully)

## Context Detection Pattern

The fix uses a consistent pattern for detecting the execution context:

```typescript
// Service worker detection
if (typeof window === 'undefined' || !window.location) {
    // Service worker or Node.js context
    return null; // or handle appropriately
}

// Browser web page context
// Safe to use window.location, window.document, etc.
```

## Files Modified

1. `packages/core/src/util/fetchDomain.ts` - Added window existence checks
2. `packages/core/src/services/AuthManager.ts` - Added window.location check for Keycloak redirect URI

## Testing

After rebuilding:
```bash
cd packages/core && npm run build
cd ../.. && npm run build
```

The service worker should now load without "window is not defined" errors.

## Related Fixes

This is part of a series of service worker compatibility fixes:
- **localStorage errors** → Fixed in `REDUX_STORAGE_FIX.md` (storage helper)
- **window undefined** → Fixed in this document
- **Cross-browser support** → Documented in `CROSS_BROWSER_SUPPORT.md`

## Why These Files?

Both `fetchDomain` and `AuthManager` are:
1. Exported from the core package's main entry point
2. May be imported/initialized when the background script loads
3. Previously assumed they would always run in a browser web page context

Service workers are a different JavaScript context that don't have access to:
- `window` object
- `document` object
- `localStorage`
- DOM APIs

But they DO have access to:
- `self` object (global in service workers)
- `chrome`/`browser` extension APIs
- `fetch` API
- IndexedDB
- Cache API
