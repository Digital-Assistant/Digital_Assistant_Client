// Click tracking for UDAHeaders.js. Self-contained on purpose: this file loads at document_start
// (extension) and in the <head> of host pages, so it must not import the SDK (the SDK root pulls in
// the logger, auth and the rest, ~800 KB, and defines the SDK globals too early).
// Same behavior as initializeClickTracking in the SDK (src/util/headers); same Symbol.for keys, so
// the SDK skips prototypes already wrapped here.

const ignoreTags = ["body", "document", "window", "html", "script", "style", "iframe", "doctype", "link", "svg", "path", "meta", "circle", "rect", "stop", "defs", "lineargradient", "g"];
const WRAPPED_FLAG = Symbol.for("__udaAddEventListenerWrapped");
const ORIGINAL_KEY = Symbol.for("__udaOriginalAddEventListener");

window.UDAClickObjects = window.UDAClickObjects || [];
window.UDARemovedClickObjects = window.UDARemovedClickObjects || [];

function addToClickObjects(node) {
    try {
        if (!Array.isArray(window.UDAClickObjects)) window.UDAClickObjects = [];
        if (node === window || typeof node?.tagName === "undefined") return;
        const tag = String(node.tagName || "").toLowerCase();
        if (tag && ignoreTags.indexOf(tag) !== -1) return;
        if (node.classList && node.classList.contains("uda_exclude")) return;
        for (let i = 0; i < window.UDAClickObjects.length; i++) {
            try {
                const existing = window.UDAClickObjects[i]?.element;
                if (!existing) continue;
                if (typeof existing.isSameNode === "function" ? existing.isSameNode(node) : existing === node) return;
            } catch (_) { /* skip invalid entries */ }
        }
        window.UDAClickObjects.push({ element: node, id: window.UDAClickObjects.length });
    } catch (e) {
        console.log("Unable to process clickable object - " + node, e);
    }
}

function wrapPrototype(proto) {
    if (!proto || Object.prototype.hasOwnProperty.call(proto, WRAPPED_FLAG)) return;
    const original = proto.addEventListener;
    if (typeof original !== "function") return;
    try {
        Object.defineProperty(proto, ORIGINAL_KEY, { value: original, configurable: true, writable: false, enumerable: false });
        Object.defineProperty(proto, WRAPPED_FLAG, { value: true, configurable: true, writable: false, enumerable: false });
    } catch (_) {
        proto[ORIGINAL_KEY] = original;
        proto[WRAPPED_FLAG] = true;
    }
    proto.addEventListener = function (type, listener, options) {
        if (type === "click") addToClickObjects(this);
        return (proto[ORIGINAL_KEY] || original).call(this, type, listener, options);
    };
}

export function initClickTracking() {
    [typeof EventTarget !== "undefined" && EventTarget.prototype,
     typeof Node !== "undefined" && Node.prototype,
     typeof Element !== "undefined" && Element.prototype,
     typeof Document !== "undefined" && Document.prototype,
     typeof Window !== "undefined" && Window.prototype].forEach(wrapPrototype);
}
