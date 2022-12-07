export const specialNodes = {
  include: {
    tags: ["a", "button", "input", "textarea", "select", "mat-select"],
    classes: ["ng-select", "ngb-datepicker", "select2-selection", "dropdown-toggle", "expand-button", "btn-pill"],
  },
  exclude: {
    tags: [
      "link",
      "meta",
      "script",
      "svg",
      "style",
      "path",
      "circle",
      "g",
      "rect",
      "stop",
      "defs",
      "linearGradient",
      "mat-checkbox"
    ],
    classes: ["uda_exclude", "ngx-daterangepicker-material"],
  },
  EXCLUDE_ATTRIB: "data-exclude"
}
