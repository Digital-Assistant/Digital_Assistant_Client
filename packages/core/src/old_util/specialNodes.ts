/**
 * Special nodes identifications for recording.
 * These will be used for identification of node elements during recording and will resolve the bugs for unwanted clicks.
 * @returns specialNodes
 */
export const specialNodes = {
  // list of including nodes for attaching events
  "include": {
    "tags": ['a', 'button', 'input', 'textarea', 'select', 'option', 'mat-select', 'ckeditor', 'ng-select', 'ngb-datepicker'],
    "classes": ['ng-select', 'ngb-datepicker', 'dropdown-toggle', 'expand-button', 'btn-pill', 'radio', 'replacement', 'select-dropdown', 'datepicker', 'fa-calendar', 'select2-selection', 'css-atn8fj-control'],
    "attributes": ['ng-click', 'onclick', 'contenteditable']
  },
  // list of excluding nodes from attaching events
  "exclude": {
    "tags": ['body', 'link', 'meta', 'script', 'svg', 'style', 'path', 'circle', 'g', 'rect', 'stop', 'defs', 'linearGradient', 'mat-checkbox', 'table'],
    "classes": ['uda_exclude', 'datepicker-modal'],
    "attributes": ['uib-datepicker-popup-wrap', 'data-exclude'],
    "ids": ['content']
  },
  // ignore clickable nodes while attaching event listeners
  "ignoreChildren": {
    "tags": ['ng-select', 'ngb-datepicker', 'ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'mat-datepicker-content'],
    "classes": ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'uda_exclude', 'jstBlock', 'datepicker', 'fa-calendar', 'drdn-content', 'dropdown-button', 'dropdown-trigger1', 'select2-selection', 'select2-container--open', 'module-item', 'css-atn8fj-control', 'e-multiselect', 'e-input-group', 'e-ddl'], //, 'e-popup'
    "attributes": ['uib-datepicker-popup-wrap']
  },
  // ignore clicks on special nodes
  "ignoreClicksOnNodes": {
    "tags": ['ngx-daterangepicker-material'],
    "classes": ['drdn-content', 'datepicker-modal', 'parallel', 'tabs', 'dropdown-content', 'select2-container--open', 'modal-overlay', 'e-popup', 'e-query-builder'],
    "attributes": ['uib-datepicker-popup-wrap'],
    "ids": ['content']
  },
  // list of attributes to ignore while comparing
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
  // list of text editor identifications
  "textEditors": {
    "tags": ['ckeditor'],
    "classes": ['jstBlock'],
    "attributes": []
  },
  // list of dropdown identifications
  "dropDowns": {
    "tags": ['ng-select', 'ng-dropdown-panel'],
    "classes": ['cke_notifications_area', 'aui-list', 'herknl', 'ghx-dropdown-trigger', 'select-wrapper', 'select2', 'select-dropdown', 'drdn-trigger', 'css-atn8fj-control', 'e-multiselect', 'e-ddl'],
    "attributes": []
  },
  // list of datepicker identifications
  "datePicker": {
    "tags": ['ngb-datepicker', 'ngb-datepicker', 'ngx-daterangepicker-material', 'mat-datepicker-content', 'datepicker-modal'],
    "classes": ['fa-calendar'],
    "attributes": ['uib-datepicker-popup-wrap']
  },
  // list of special nodes which should not be recorded
  "specialNodes": {
    "tags": ['fusioncharts'],
    "classes": ['gldp-default', 'ajs-layer', 'herknl'],
    "attributes": []
  },
  // list of pausable elements for stopping click for recording
  "preventDefault": {
    "tags": ['a', 'button'],
    "classes": [],
    "attributes": ['href']
  },
  "iconNodes": {
    "tags": ['i'],
    "classes": [],
    "attributes": []
  }
}
