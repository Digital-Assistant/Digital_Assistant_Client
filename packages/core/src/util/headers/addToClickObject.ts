// This module defines a function to add DOM elements to a global click tracking array.
// It includes a list of HTML tags that should be ignored to avoid tracking irrelevant elements.

// An array of HTML tags that should be ignored when tracking click events.
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

/**
 * Adds a DOM element to the global `UDAClickObjects` array for tracking.
 * @param node The DOM element to be added.
 */
export const AddToClickObjects = (node: any) => {
  try {
    // Ensure that the global `UDAClickObjects` store exists and is an array.
    // @ts-ignore - This is provided by the runtime environment (headers.ts also initializes it in the browser).
    if (!Array.isArray(window.UDAClickObjects)) {
      // @ts-ignore
      window.UDAClickObjects = [];
    }

    // Create a click object to store the element and its ID.
    let clickObject: any = { element: node, id: "" };

    // Do not track the window object itself.
    if (clickObject.element === window) {
      return;
    }

    // The element must have a tagName to be considered for tracking. This filters out plain objects.
    if (typeof clickObject?.element?.tagName === "undefined") {
      return;
    }

    // Normalize the tag name to lowercase for consistent checking.
    const tag: string = String(clickObject?.element?.tagName || "").toLowerCase();
    // If the tag is in the ignore list, do not track it.
    if (tag && ignoreTags.indexOf(tag) !== -1) {
      return;
    }

    // If the element has the 'uda_exclude' class, do not track it.
    if (node?.classList && node.classList.contains("uda_exclude")) {
      return;
    }

    // Prevent duplicate entries in the tracking array.
    // Prefer using `isSameNode` for comparison if available, otherwise fall back to strict equality.
    for (let i = 0; i < window.UDAClickObjects.length; i++) {
      try {
        const existing = window.UDAClickObjects[i]?.element;
        if (!existing) continue;
        // Use `isSameNode` if it's a function on the existing element.
        if (typeof existing.isSameNode === "function") {
          if (existing.isSameNode(clickObject.element)) {
            return; // The element is already in the array.
          }
        } else if (existing === clickObject.element) {
          return; // Fallback to strict equality for older environments.
        }
      } catch (_) {
        // Ignore any unexpected or invalid entries and continue checking others.
      }
    }

    // Assign a unique ID to the click object based on its position in the array.
    clickObject.id = window.UDAClickObjects.length;
    // Add the new click object to the global tracking array.
    window.UDAClickObjects.push(clickObject);
  } catch (e) {
    // Log an error if the clickable object cannot be processed.
    // eslint-disable-next-line no-console
    console.log("Unable to process clickable object - " + node, e);
  }
}
