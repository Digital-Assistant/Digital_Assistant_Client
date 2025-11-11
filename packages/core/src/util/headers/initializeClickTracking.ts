/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration of src/Headers.js click tracking into the Core SDK.
 *
 * This utility patches EventTarget.prototype.addEventListener to capture any
 * element that registers a 'click' handler and stores it in the global
 * UDAClickObjects array. This mirrors the original behavior exactly, with
 * additional safety guards (idempotency, browser checks) and a teardown method
 * to restore the original implementation when needed (e.g., in tests).
 */

// Keep reference to the original addEventListener so we can restore it later
let originalAddEventListener: any | null = null;
let initialized = false;

/** Ensure global arrays exist (as in original Headers.js) */
const ensureGlobals = () => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (!Array.isArray(w.UDAClickObjects)) {
    w.UDAClickObjects = [];
  }
  if (!Array.isArray(w.UDARemovedClickObjects)) {
    w.UDARemovedClickObjects = [];
  }
};

/**
 * Initialize the click tracking prototype patch.
 * Safe to call multiple times; subsequent calls are no-ops.
 */
export const initClickTracking = (): void => {
  if (initialized) return;
  if (typeof window === 'undefined' || typeof EventTarget === 'undefined') return;

  ensureGlobals();

  const w = window as any;

  // Store original to allow teardown
  if (!originalAddEventListener) {
    originalAddEventListener = (EventTarget.prototype as any).addEventListener;
  }

  // Avoid double wrapping by checking a flag on the function
  const current = (EventTarget.prototype as any).addEventListener as any;
  if ((current as any).__uda_patched__) {
    initialized = true;
    return;
  }

  // Import helper lazily to avoid circular deps and keep bundle lean
  const AddToClickObjects = (node: any) => {
    try {
      const ignoreTags = [
        'body','document','window','html','script','style','iframe','doctype','link','svg',
        'path','meta','circle','rect','stop','defs','linearGradient','g'
      ];

      const clickObject: any = { element: node, id: '' };
      if (clickObject.element === window) return;
      if (typeof clickObject?.element?.tagName === 'undefined') return;

      const tag = clickObject?.element?.tagName;
      if (tag && ignoreTags.indexOf(String(tag).toLowerCase()) !== -1) return;

      if (node?.classList && node.classList.contains('uda_exclude')) return;

      const list = (w.UDAClickObjects || []) as any[];
      for (let i = 0; i < list.length; i++) {
        if (list[i].element?.isSameNode?.(clickObject.element)) {
          return; // already tracked
        }
      }
      clickObject.id = list.length;
      list.push(clickObject);
      w.UDAClickObjects = list;
    } catch (e) {
      // Swallow errors to avoid breaking host app
      // console.log('Unable to process clickable object', e);
    }
  };

  // Patch addEventListener
  (EventTarget.prototype as any).addEventListener = function patchedAddEventListener(
    this: any,
    type: string,
    listener: any,
    options?: any
  ) {
    try {
      if (type === 'click') {
        AddToClickObjects(this);
      }
    } catch {
      // ignore errors in tracking
    }
    return originalAddEventListener!.call(this, type, listener, options);
  };
  (EventTarget.prototype as any).addEventListener.__uda_patched__ = true;

  initialized = true;
};

/**
 * Restore the original EventTarget.prototype.addEventListener.
 * Safe to call even if initClickTracking() was never called.
 */
export const teardownClickTracking = (): void => {
  if (typeof window === 'undefined' || typeof EventTarget === 'undefined') return;
  if (originalAddEventListener) {
    (EventTarget.prototype as any).addEventListener = originalAddEventListener;
    (EventTarget.prototype as any).addEventListener.__uda_patched__ = undefined;
  }
  initialized = false;
};
