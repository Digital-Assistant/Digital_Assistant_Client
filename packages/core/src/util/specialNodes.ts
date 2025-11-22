/**
 * This configuration object defines various categories of "special nodes" used for identifying
 * and handling specific DOM elements during recording, playback, and other utility operations.
 * These definitions help in resolving issues related to unwanted clicks, comparisons, and event attachments.
 */
export const specialNodes = {
  /**
   * List of nodes to explicitly include for attaching events.
   * Events will be attached to elements matching these criteria.
   */
  "include": {
    "tags": ['a', 'button', 'input', 'textarea', 'select', 'option', 'mat-select', 'ckeditor', 'ng-select', 'ngb-datepicker'],
    "classes": ['ng-select', 'ngb-datepicker', 'dropdown-toggle', 'expand-button', 'btn-pill', 'radio', 'replacement', 'select-dropdown', 'datepicker', 'fa-calendar', 'select2-selection', 'css-atn8fj-control'],
    "attributes": ['ng-click', 'onclick', 'contenteditable']
  },
  /**
   * List of nodes to explicitly exclude from attaching events.
   * Events will NOT be attached to elements matching these criteria.
   */
  "exclude": {
    "tags": ['body', 'link', 'meta', 'script', 'svg', 'style', 'path', 'circle', 'g', 'rect', 'stop', 'defs', 'linearGradient', 'mat-checkbox', 'table'],
    "classes": ['uda_exclude', 'datepicker-modal'],
    "attributes": ['uib-datepicker-popup-wrap', 'data-exclude'],
    "ids": ['content']
  },
  /**
   * Nodes whose children should be ignored when attaching event listeners.
   * This is useful for complex components where only the parent should be interactive.
   */
  "ignoreChildren": {
    "tags": ['ng-select', 'ngb-datepicker', 'ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'mat-datepicker-content'],
    "classes": ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'uda_exclude', 'jstBlock', 'datepicker', 'fa-calendar', 'drdn-content', 'dropdown-button', 'dropdown-trigger1', 'select2-selection', 'select2-container--open', 'module-item', 'css-atn8fj-control', 'e-multiselect', 'e-input-group', 'e-ddl'], //, 'e-popup'
    "attributes": ['uib-datepicker-popup-wrap']
  },
  /**
   * Nodes on which clicks should be ignored.
   * This is used to prevent recording clicks on certain interactive elements that are not relevant.
   */
  "ignoreClicksOnNodes": {
    "tags": ['ngx-daterangepicker-material'],
    "classes": ['drdn-content', 'datepicker-modal', 'parallel', 'tabs', 'dropdown-content', 'select2-container--open', 'modal-overlay', 'e-popup', 'e-query-builder'],
    "attributes": ['uib-datepicker-popup-wrap'],
    "ids": ['content']
  },
  /**
   * List of attributes to ignore when comparing nodes during playback.
   * This helps in making node comparisons more robust by disregarding dynamic or irrelevant attributes.
   */
  "ignoreDuringCompare": {
    "tags": [],
    "classes": [],
    "attributes": [
      'translate', 'draggable', 'spellcheck', 'tabindex', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth',
      'offsetHeight', 'offsetLeft', 'offsetTop', 'offsetWidth', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth',
      'baseURI', 'isConnected', 'ariaPressed', 'aria-pressed', 'nodePosition', 'outerHTML', 'innerHTML', 'style',
      'aria-controls', 'aria-activedescendant', 'ariaExpanded', 'autocomplete', 'aria-expanded', 'aria-owns', 'formAction',
      'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y', 'selectionStart', 'selectionEnd',
      'required', 'validationMessage', 'selectionDirection', 'naturalWidth', 'naturalHeight', 'complete', '_indexOf',
      'value', 'defaultValue', 'min', 'max', 'nodeInfo', 'data-tooltip-id', 'addedclickrecord', 'checked', 'data-tribute',
      'hasclick', 'addedClickRecord', 'hasClick', 'valueAsNumber', 'udaIgnoreChildren', 'udaIgnoreClick', 'udaignorechildren',
      'udaignoreclick', 'fdprocessedid', '__ngContext__', 'd', 'text', 'textContent', 'cdk-describedby-host', 'inert', 'fill', 'disabled', 'hidden',
      'aria-autocomplete', 'ariaAutoComplete', 'data-activates'
    ],
    "ids": []
  },
  /**
   * Attributes to ignore specifically for "personal" nodes during comparison.
   * These attributes often contain user-specific or dynamic data that should not affect node matching.
   */
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
  /**
   * Identifiers for text editor elements.
   * Used to recognize and handle text editors specifically (e.g., for tooltip messages).
   */
  "textEditors": {
    "tags": ['ckeditor'],
    "classes": ['jstBlock'],
    "attributes": []
  },
  /**
   * Identifiers for dropdown elements.
   * Used to recognize and handle dropdowns specifically.
   */
  "dropDowns": {
    "tags": ['ng-select', 'ng-dropdown-panel'],
    "classes": ['cke_notifications_area', 'aui-list', 'herknl', 'ghx-dropdown-trigger', 'select-wrapper', 'select2', 'select-dropdown', 'drdn-trigger', 'css-atn8fj-control', 'e-multiselect', 'e-ddl'],
    "attributes": []
  },
  /**
   * Identifiers for date picker elements.
   * Used to recognize and handle date pickers specifically.
   */
  "datePicker": {
    "tags": ['ngb-datepicker', 'ngb-datepicker', 'ngx-daterangepicker-material', 'mat-datepicker-content', 'datepicker-modal'],
    "classes": ['fa-calendar'],
    "attributes": ['uib-datepicker-popup-wrap']
  },
  /**
   * List of special nodes that should generally not be recorded or interacted with in a standard way.
   */
  "specialNodes": {
    "tags": ['fusioncharts'],
    "classes": ['gldp-default', 'ajs-layer', 'herknl'],
    "attributes": []
  },
  /**
   * Elements for which default event prevention should be considered (e.g., preventing default link behavior).
   */
  "preventDefault": {
    "tags": ['a', 'button'],
    "classes": [],
    "attributes": ['href']
  },
  /**
   * Identifiers for icon elements.
   * Used to recognize icons, which might be treated as "personal" nodes during recording.
   */
  "iconNodes": {
    "tags": ['i'],
    "classes": [],
    "attributes": []
  }
}
