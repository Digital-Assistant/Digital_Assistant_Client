import {checkNodeObjectKeyValue} from "./checkNodeObjectKeyValue";

export const checkNodeValues = (node: any, checkType: string) => {
  let exists = false;
  if (window.udaSpecialNodes[checkType] && node) {
    checkNodeLoop:
    for (const key in window.udaSpecialNodes[checkType]) {
      if (checkNodeObjectKeyValue(node, key, window.udaSpecialNodes[checkType][key], checkType)) {
        exists = true;
        break checkNodeLoop;
      }
    }
  }
  return exists;
}
