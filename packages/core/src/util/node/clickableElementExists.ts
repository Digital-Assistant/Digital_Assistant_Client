/**
 * This module provides a function to check if a given element is already captured/recorded
 * or is inherently clickable.
 */

declare const window: any;

/**
 * Checks if a clickable element exists corresponding to the provided node.
 * It returns `true` if the node is already present in the recorded list of selected nodes,
 * or if it is inherently clickable based on its tag name, ARIA role, or other attributes.
 *
 * @param compareNode The HTML element to check.
 * @returns `true` if the element is considered to exist as a clickable element, `false` otherwise.
 */
export const clickableElementExists = (compareNode: HTMLElement): boolean => {
    if (!compareNode) return false;

    // 1. Check if the node has been previously selected (legacy behavior).
    let existFlag = false;
    try {
        if (!window.udanSelectedNodes) window.udanSelectedNodes = [];
        window?.udanSelectedNodes?.forEach((element: any) => {
            try {
                if (typeof element?.isSameNode === 'function' && element.isSameNode(compareNode)) {
                    existFlag = true;
                }
            } catch (_) {/* ignore errors during comparison */}
        });
    } catch (_) {/* ignore errors accessing global state */}
    if (existFlag) return true;

    // 2. Use heuristics to determine if the element is inherently clickable.
    try {
        const tag = String((compareNode as any).tagName || '').toLowerCase();
        const role = String((compareNode as any).getAttribute?.('role') || '').toLowerCase();
        const hasOnClick = typeof (compareNode as any).onclick === 'function';
        const tabIndex = Number((compareNode as any).tabIndex ?? -1);

        // Check for native interactive HTML tags.
        if (tag === 'button') return true;
        if (tag === 'a' && (compareNode as any).getAttribute?.('href')) return true;
        if (tag === 'input' || tag === 'select' || tag === 'textarea') return true;
        if (tag === 'summary') return true;
        if ((tag === 'area') && (compareNode as any).getAttribute?.('href')) return true;
        if ((tag === 'video' || tag === 'audio') && (compareNode as any).getAttribute?.('controls') !== null) return true;

        // Check for ARIA roles that are commonly used for clickable elements.
        const clickableRoles = new Set(['button', 'link', 'tab', 'menuitem', 'checkbox', 'radio', 'switch']);
        if (role && clickableRoles.has(role)) return true;

        // Check for generic interactivity indicators like an `onclick` handler or a non-negative `tabIndex`.
        if (hasOnClick) return true;
        if (!Number.isNaN(tabIndex) && tabIndex >= 0) return true;
    } catch (_) {/* ignore errors during heuristic checks */}

    return false;
}
