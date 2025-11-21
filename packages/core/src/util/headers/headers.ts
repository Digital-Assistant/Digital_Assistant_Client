// Safely initialize globals only in browser-like environments
// adding the click object that is registered via javascript
if (typeof window !== "undefined") {
  // @ts-ignore - attach tracking arrays on window for runtime use
  window.UDAClickObjects = window.UDAClickObjects || [];
  // @ts-ignore
  window.UDARemovedClickObjects = window.UDARemovedClickObjects || [];
}

// Import as a module object so Jest spies on the export can intercept calls reliably
import * as AddToClickObjectModule from "./addToClickObject";

// Use symbols to avoid key collisions on the prototype
const WRAPPED_FLAG: symbol = Symbol.for("__udaAddEventListenerWrapped");
const ORIGINAL_KEY: symbol = Symbol.for("__udaOriginalAddEventListener");

function wrapPrototype(proto: any) {
  if (!proto) return;
  // Only consider flag on this prototype itself, not inherited from parent prototypes
  if (Object.prototype.hasOwnProperty.call(proto, WRAPPED_FLAG)) return;
  const original = proto.addEventListener;
  if (typeof original !== "function") return;

  try {
    Object.defineProperty(proto, ORIGINAL_KEY, {
      value: original,
      configurable: true,
      writable: false,
      enumerable: false,
    });
    Object.defineProperty(proto, WRAPPED_FLAG, {
      value: true,
      configurable: true,
      writable: false,
      enumerable: false,
    });
  } catch (_) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proto[ORIGINAL_KEY] = original;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proto[WRAPPED_FLAG] = true;
  }

  proto.addEventListener = function (type: any, listener: any, options: any) {
    if (type === "click") {
      // @ts-ignore - "this" is an EventTarget element
      AddToClickObjectModule.AddToClickObjects(this);
    }
    const orig: Function = proto[ORIGINAL_KEY] || original;
    return orig.call(this, type, listener, options);
  };
}

export const initializeClickTracking = () => {
  // Wrap common prototypes that provide addEventListener in jsdom/browsers
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

  for (const proto of targets) {
    wrapPrototype(proto);
  }
};

// Optional helper for tests or resets
export const resetClickTracking = () => {
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
  for (const Proto of protos) {
    if (!Proto) continue;
    if (Proto[WRAPPED_FLAG] && Proto[ORIGINAL_KEY]) {
      Proto.addEventListener = Proto[ORIGINAL_KEY];
      try {
        delete Proto[ORIGINAL_KEY];
        delete Proto[WRAPPED_FLAG];
      } catch (_) {
        // ignore
      }
    }
  }
};
