import {compareArrays} from "./compareArrays";

export const checkNodeObjectKeyValue = (node, key, objectValues) => {
  switch (key.toLowerCase()) {
    case 'tags':
      if (objectValues.includes(node.tagName.toLowerCase())) {
        return true;
      }
      break;
    case 'classes':
    case 'attributes':
      if (compareArrays(objectValues, node.classList)) {
        return true;
      }
      break;
  }
  return false;
}
