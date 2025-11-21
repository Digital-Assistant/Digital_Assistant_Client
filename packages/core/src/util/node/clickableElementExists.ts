/**
 * To check if a given element is already captured / recorded
 * @returns boolean
 * @param compareNode
 */

declare const window: any;

/**
 * Checks if a clickable element exists corresponding to the provided node.
 * Returns true if the node is already present in the recorded list OR
 * if it is inherently clickable (button, link, input, etc.).
 */
export const clickableElementExists = (compareNode: HTMLElement): boolean => {
    if (!compareNode) return false;

    // 1) Previously selected nodes (legacy behavior)
    let existFlag = false;
    try {
        if (!window.udanSelectedNodes) window.udanSelectedNodes = [];
        window?.udanSelectedNodes?.forEach((element: any) => {
            try {
                if (typeof element?.isSameNode === 'function' && element.isSameNode(compareNode)) existFlag = true;
            } catch (_) {/* ignore */}
        });
    } catch (_) {/* ignore */}
    if (existFlag) return true;

    // 2) Inherently clickable heuristic
    try {
        const tag = String((compareNode as any).tagName || '').toLowerCase();
        const role = String((compareNode as any).getAttribute?.('role') || '').toLowerCase();
        const hasOnClick = typeof (compareNode as any).onclick === 'function';
        const tabIndex = Number((compareNode as any).tabIndex ?? -1);

        // Native interactive tags
        if (tag === 'button') return true;
        if (tag === 'a' && (compareNode as any).getAttribute?.('href')) return true;
        if (tag === 'input' || tag === 'select' || tag === 'textarea') return true;
        if (tag === 'summary') return true;
        if ((tag === 'area') && (compareNode as any).getAttribute?.('href')) return true;
        if ((tag === 'video' || tag === 'audio') && (compareNode as any).getAttribute?.('controls') !== null) return true;

        // ARIA roles commonly used for clickable elements
        const clickableRoles = new Set(['button', 'link', 'tab', 'menuitem', 'checkbox', 'radio', 'switch']);
        if (role && clickableRoles.has(role)) return true;

        // Generic interactivity indicators
        if (hasOnClick) return true;
        if (!Number.isNaN(tabIndex) && tabIndex >= 0) return true;
    } catch (_) {/* ignore */}

    return false;
}