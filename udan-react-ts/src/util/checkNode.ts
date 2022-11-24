export const isInputNode = (node: any) => {
  switch (node.nodeName.toLowerCase()) {
    case "input":
    case "textarea":
    case "select":
    case "option":
    case "checkbox":
      return true;
      break;
    case "button":
      if (typeof node.hasAttribute !== 'undefined' && node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
        return true;
      } else {
        return false;
      }
      break;
    case 'span':
      if (node.className && node.className.indexOf('select2-selection') !== -1) {
        return true;
      } else {
        return false;
      }
      break;
    case 'div':
      if (node.className && (node.className.indexOf('mat-form-field-flex') !== -1 || node.className.indexOf('mat-select-trigger') !== -1)) {
        return true;
      } else {
        return '';
      }
      break;
    case 'ckeditor':
      return true;
      break;
    case 'ng-select':
      return true;
      break;
    default:
      return false;
      break;
  }
}
