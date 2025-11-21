export const ignoreTags = [
  "body",
  "document",
  "window",
  "html",
  "script",
  "style",
  "iframe",
  "doctype",
  "link",
  "svg",
  "path",
  "meta",
  "circle",
  "rect",
  "stop",
  "defs",
  "lineargradient",
  "g",
];

export const AddToClickObjects = (node: any) => {
  try {
    // Ensure the global store exists and is an array
    // @ts-ignore - provided by runtime (headers.ts also initializes in browser)
    if (!Array.isArray(window.UDAClickObjects)) {
      // @ts-ignore
      window.UDAClickObjects = [];
    }

    let clickObject: any = { element: node, id: "" };

    //checking whether the element is window or not
    if (clickObject.element === window) {
      return;
    }

    // Must have a tagName to proceed (filters out plain objects)
    if (typeof clickObject?.element?.tagName === "undefined") {
      return;
    }

    // Normalize tag name defensively
    const tag: string = String(clickObject?.element?.tagName || "").toLowerCase();
    if (tag && ignoreTags.indexOf(tag) !== -1) {
      return;
    }

    if (node?.classList && node.classList.contains("uda_exclude")) {
      return;
    }

    // Prevent duplicates: prefer isSameNode when available; fallback to strict equality
    for (let i = 0; i < window.UDAClickObjects.length; i++) {
      try {
        const existing = window.UDAClickObjects[i]?.element;
        if (!existing) continue;
        // Use isSameNode if present on existing element
        if (typeof existing.isSameNode === "function") {
          if (existing.isSameNode(clickObject.element)) {
            return;
          }
        } else if (existing === clickObject.element) {
          return;
        }
      } catch (_) {
        // Ignore any unexpected entries and continue checking others
      }
    }

    clickObject.id = window.UDAClickObjects.length;
    window.UDAClickObjects.push(clickObject);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Unable to process clickable object - " + node, e);
  }
}
