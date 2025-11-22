// This module is responsible for tracking click events by monkey-patching the `addEventListener` method on various DOM prototypes.
// It ensures that global tracking arrays are available in browser-like environments.

// Safely initialize global tracking arrays for click objects, but only in browser-like environments.
if (typeof window !== "undefined") {
  // @ts-ignore - Attaches a tracking array to the window object for runtime use.
  window.UDAClickObjects = window.UDAClickObjects || [];
  // @ts-ignore - Attaches an array for removed click objects to the window object.
  window.UDARemovedClickObjects = window.UDARemovedClickObjects || [];
}

// Import the AddToClickObjectModule as a module object.
// This allows Jest spies on the export to reliably intercept calls for testing purposes.
import * as AddToClickObjectModule from "./addToClickObject";

// Use unique symbols for keys to avoid property collisions on the object's prototype.
const WRAPPED_FLAG: symbol = Symbol.for("__udaAddEventListenerWrapped");
const ORIGINAL_KEY: symbol = Symbol.for("__udaOriginalAddEventListener");

/**
 * Wraps the `addEventListener` method on a given prototype to intercept 'click' events.
 * @param proto The prototype to wrap (e.g., Element.prototype).
 */
function wrapPrototype(proto: any) {
  // Do nothing if the prototype is not valid.
  if (!proto) return;
  // Check if the prototype has already been wrapped to prevent wrapping it multiple times.
  if (Object.prototype.hasOwnProperty.call(proto, WRAPPED_FLAG)) return;
  const original = proto.addEventListener;
  // Ensure that `addEventListener` is a function before proceeding.
  if (typeof original !== "function") return;

  try {
    // Store the original `addEventListener` method using a symbol key.
    Object.defineProperty(proto, ORIGINAL_KEY, {
      value: original,
      configurable: true,
      writable: false,
      enumerable: false,
    });
    // Set a flag to indicate that this prototype has been wrapped.
    Object.defineProperty(proto, WRAPPED_FLAG, {
      value: true,
      configurable: true,
      writable: false,
      enumerable: false,
    });
  } catch (_) {
    // Fallback for environments where Object.defineProperty might fail.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proto[ORIGINAL_KEY] = original;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proto[WRAPPED_FLAG] = true;
  }

  // Replace `addEventListener` with a wrapped version.
  proto.addEventListener = function (type: any, listener: any, options: any) {
    // If the event type is 'click', add the element to the click tracking object.
    if (type === "click") {
      // @ts-ignore - "this" refers to the EventTarget element.
      AddToClickObjectModule.AddToClickObjects(this);
    }
    // Call the original `addEventListener` method.
    const orig: Function = proto[ORIGINAL_KEY] || original;
    return orig.call(this, type, listener, options);
  };
}

/**
 * Initializes click tracking by wrapping the `addEventListener` method on common DOM prototypes.
 */
export const initializeClickTracking = () => {
  // A list of common prototypes that provide `addEventListener` in browsers and jsdom.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const targets: any[] = [
    typeof EventTarget !== "undefined" ? EventTarget.prototype : null,
    // @ts-ignore
    typeof Node !== "undefined" ? Node.prototype : null,
    // @ts-ignore
    typeof Element !== "undefined" ? Element.prototype : null,
    // @ts-ignore
    typeof Document !== "undefined" ? Document.prototype : null,
    // @ts-ignore
    typeof Window !== "undefined" ? Window.prototype : null,
  ];

  // Iterate over the target prototypes and wrap them.
  for (const proto of targets) {
    wrapPrototype(proto);
  }
};

/**
 * Resets click tracking by restoring the original `addEventListener` method.
 * This is an optional helper function, mainly for use in tests or for manual resets.
 */
export const resetClickTracking = () => {
  // The list of prototypes to reset.
  const protos: any[] = [
    // @ts-ignore
    typeof EventTarget !== "undefined" ? EventTarget.prototype : null,
    // @ts-ignore
    typeof Node !== "undefined" ? Node.prototype : null,
    // @ts-ignore
    typeof Element !== "undefined" ? Element.prototype : null,
    // @ts-ignore
    typeof Document !== "undefined" ? Document.prototype : null,
    // @ts-ignore
    typeof Window !== "undefined" ? Window.prototype : null,
  ];
  // Iterate over the prototypes and restore the original `addEventListener`.
  for (const Proto of protos) {
    if (!Proto) continue;
    // Check if the prototype was wrapped before trying to restore it.
    if (Proto[WRAPPED_FLAG] && Proto[ORIGINAL_KEY]) {
      Proto.addEventListener = Proto[ORIGINAL_KEY];
      try {
        // Clean up the properties added during wrapping.
        delete Proto[ORIGINAL_KEY];
        delete Proto[WRAPPED_FLAG];
      } catch (_) {
        // Ignore errors during cleanup, as they are not critical.
      }
    }
  }
};
