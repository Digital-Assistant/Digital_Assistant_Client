const _nodeConfig = {
    JARO_WEIGHT: 0.95,
    JARO_WEIGHT_PERSONAL: 0.90,
    // personal node ignore attributes
    personalNodeIgnoreAttributes: [
        "innerText",
        "innerHTML",
        "outerText",
        "outerHTML",
        "nodeValue",
        "src",
        "naturalWidth",
        "naturalHeight",
        "currentSrc",
    ],
    ignoreElements: ["script", "h1", "h2", "h3", "link", "noscript", "style"],
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
    innerTextWeight: 5,
    ignoreNodesFromIndexing: ['ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'uda-panel', 'mat-datepicker-content', 'ng-select'],
    ignoreNodesContainingClassNames: ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'jstBlock'],
    cancelRecordingDuringRecordingNodes: [],
    addClickToSpecialNodes: ['ng-select', 'ngb-datepicker'],
    ignoreClicksOnSpecialNodes: ['ngx-daterangepicker-material'],
    customNameForSpecialNodes: {
        'ngb-datepicker': 'Date selector',
        'mat-datepicker-content': 'Date selector',
        'ngx-daterangepicker-material': 'Date Range Selector'
    },
    specialInputClickClassNames: ['ghx-dropdown-trigger', 'aui-list', 'jstBlock', 'mat-form-field-flex', 'mat-select-trigger'],
    commonTags: ['span', 'div'],
    tooltipDisplayedNodes: [],
    ignoreDynamicAttributeText: ['_ng','__context', '__zone_symbol','']
}

// Deep clone to provide a fresh immutable snapshot on demand
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
// the named export available for type-checking and TS import syntax.
export const nodeConfig: any = deepClone(_nodeConfig);

// Provide a dynamic export so that requiring the module again returns a fresh copy
// suitable for snapshot comparison after attempted mutations.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Object.defineProperty(exports, 'nodeConfig', {
    enumerable: true,
    get: () => deepClone(_nodeConfig)
});