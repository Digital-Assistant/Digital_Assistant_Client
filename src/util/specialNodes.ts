export const specialNodes = {
  // list of including nodes for attaching events
  "include": {
    "tags": ['a', 'button', 'input', 'textarea', 'select', 'option', 'mat-select', 'ckeditor', 'ng-select', 'ngb-datepicker'],
    "classes": ['ng-select', 'ngb-datepicker', 'dropdown-toggle', 'expand-button', 'btn-pill', 'radio', 'replacement', 'select-dropdown', 'datepicker', 'fa-calendar', 'select2-selection'],
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
    "classes": ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'uda_exclude', 'jstBlock', 'datepicker', 'fa-calendar', 'drdn-content', 'dropdown-button', 'dropdown-trigger1', 'select2-selection', 'select2-container--open'],
    "attributes": ['uib-datepicker-popup-wrap']
  },
  // ignore clicks on special nodes
  "ignoreClicksOnNodes": {
    "tags": ['ngx-daterangepicker-material', 'i'],
    "classes": ['drdn-content', 'datepicker-modal', 'parallel', 'tabs', 'dropdown-content', 'select2-container--open'],
    "attributes": ['uib-datepicker-popup-wrap'],
    "ids": ['content']
  },
  // list of text editor identifications
  "textEditors": {
    "tags": ['ckeditor'],
    "classes": ['jstBlock'],
    "attributes": []
  },
  // list of dropdown identifications
  "dropDowns": {
    "tags": ['ng-select', 'ng-dropdown-panel'],
    "classes": ['cke_notifications_area', 'aui-list', 'herknl', 'ghx-dropdown-trigger', 'select-wrapper', 'select2', 'select-dropdown', 'drdn-trigger'],
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
  }
}
