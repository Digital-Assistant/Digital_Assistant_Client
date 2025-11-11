import {checkNodeObjectKeyValue} from "./checkNodeObjectKeyValue";

declare let udaSpecialNodes;

export const checkNodeValues = (node: any, checkType: string) => {
  let exists = false;
  if (udaSpecialNodes[checkType] && node) {
    checkNodeLoop:
    for (const key in udaSpecialNodes[checkType]) {
      if (checkNodeObjectKeyValue(node, key, udaSpecialNodes[checkType][key], checkType)) {
        exists = true;
        break checkNodeLoop;
      }
    }
  }
  return exists;
}
