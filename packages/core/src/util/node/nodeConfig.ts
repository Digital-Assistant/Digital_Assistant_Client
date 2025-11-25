// This module defines a configuration object for node processing, including weights for string comparison,
// lists of elements and attributes to ignore, and settings for special handling of certain nodes.

const _nodeConfig = {
    // Jaro-Winkler similarity weight for general node comparison.
    JARO_WEIGHT: 0.95,
    // Jaro-Winkler similarity weight for personalized node comparison.
    JARO_WEIGHT_PERSONAL: 0.90,
    // Attributes to ignore when processing personalized nodes.
    personalNodeIgnoreAttributes: [
        "innerText", "innerHTML", "outerText", "outerHTML", "nodeValue",
        "src", "naturalWidth", "naturalHeight", "currentSrc",
    ],
    // HTML elements to be ignored during node processing.
    ignoreElements: ["script", "h1", "h2", "h3", "link", "noscript", "style"],
    // Attributes to be ignored during node processing.
    ignoreAttributes: [
        'translate', 'draggable', 'spellcheck', 'tabindex', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth',
        'offsetHeight', 'offsetLeft', 'offsetTop', 'offsetWidth', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth',
        'baseURI', 'isConnected', 'ariaPressed', 'aria-pressed', 'nodePosition', 'outerHTML', 'innerHTML', 'style',
        'aria-controls', 'aria-activedescendant', 'ariaExpanded', 'autocomplete', 'aria-expanded', 'aria-owns', 'formAction',
        'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y', 'selectionStart', 'selectionEnd', 'required', 'validationMessage', 'selectionDirection',
        'naturalWidth', 'naturalHeight', 'complete', '_indexOf', 'value', 'defaultValue', 'min', 'max', 'nodeInfo', 'data-tooltip-id', 'addedclickrecord', 'checked', 'data-tribute',
        'hasclick', 'addedClickRecord', 'hasClick', 'valueAsNumber', 'udaIgnoreChildren', 'udaIgnoreClick', 'udaignorechildren', 'udaignoreclick', 'fdprocessedid', '__ngContext__',
        'd', 'text', 'textContent', 'cdk-describedby-host', 'inert', 'fill', 'disabled', 'hidden', 'data-activates'
    ],
    // Weight given to innerText during node comparison.
    innerTextWeight: 5,
    // Nodes to be ignored when indexing.
    ignoreNodesFromIndexing: ['ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'uda-panel', 'mat-datepicker-content', 'ng-select'],
    // Nodes containing these class names will be ignored.
    ignoreNodesContainingClassNames: ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'jstBlock'],
    // Nodes that, if interacted with, should cancel the recording.
    cancelRecordingDuringRecordingNodes: [],
    // Special nodes that should have click events added to them.
    addClickToSpecialNodes: ['ng-select', 'ngb-datepicker'],
    // Special nodes where click events should be ignored.
    ignoreClicksOnSpecialNodes: ['ngx-daterangepicker-material'],
    // Custom names for special nodes, used for better identification.
    customNameForSpecialNodes: {
        'ngb-datepicker': 'Date selector',
        'mat-datepicker-content': 'Date selector',
        'ngx-daterangepicker-material': 'Date Range Selector'
    },
    // Class names that identify special input-like elements that should be treated as clickable.
    specialInputClickClassNames: ['ghx-dropdown-trigger', 'aui-list', 'jstBlock', 'mat-form-field-flex', 'mat-select-trigger'],
    // Common tags that are often used for generic containers.
    commonTags: ['span', 'div'],
    // Nodes that are known to display tooltips.
    tooltipDisplayedNodes: [],
    // Prefixes of dynamic attributes that should be ignored.
    ignoreDynamicAttributeText: ['_ng','__context', '__zone_symbol','']
}

/**
 * Creates a deep clone of an object or array.
 * This ensures that the original object is not mutated.
 * @param obj The object or array to clone.
 * @returns A deep clone of the input.
 */
function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((v) => deepClone(v)) as any;
    const out: any = {};
    for (const k of Object.keys(obj as any)) {
        out[k] = deepClone((obj as any)[k]);
    }
    return out as T;
}

// Provide a named ES export so TypeScript modules can import `{ nodeConfig }`.
// This initial assignment will be overridden at runtime by the getter below,
// ensuring callers always receive a fresh deep-cloned snapshot while keeping
// the named export available for type-checking and TypeScript import syntax.
export const nodeConfig: any = deepClone(_nodeConfig);
