export const specialNodes = {
  include: {
    tags: ['a', 'button', 'input', 'textarea', 'select', 'option', 'mat-select', 'ckeditor', 'ng-select', 'ngb-datepicker'],
    classes: ['ng-select', 'ngb-datepicker', 'select2-selection', 'dropdown-toggle', 'expand-button', 'btn-pill', 'radio', 'replacement'],
    attributes: ['ng-click', 'onclick', 'contenteditable']
  },
  exclude: {
    tags: ['link', 'meta', 'script', 'svg', 'style', 'path', 'circle', 'g', 'rect', 'stop', 'defs', 'linearGradient', 'mat-checkbox'],
    classes: ['uda_exclude', 'select2-container--open'],
    attributes: ['uib-datepicker-popup-wrap', 'data-exclude']
  },
  ignoreChildren: {
    tags: ['ng-select', 'ngb-datepicker', 'ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'mat-datepicker-content'],
    classes: ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'uda_exclude', 'jstBlock'],
    attributes: ['uib-datepicker-popup-wrap']
  }
}
