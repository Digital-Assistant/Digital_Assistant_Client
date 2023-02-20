import {hasClass} from "./hasClass";

export const checkNodeObjectKeyValue = (node: any, key: string, objectValues: Array<string>, checkType: string) => {
  let exists = false;
  switch (key.toLowerCase()) {
    case 'tags':
      if (objectValues.includes(node?.tagName?.trim().toLowerCase())) {
        exists = true;
      }
      break;
    case 'classes':
      if(hasClass(node, objectValues)){
        exists = true;
      }
      break;
    case 'attributes':
      attributeLoop:
      for(const attribute of objectValues){
        if(node.hasAttribute(attribute)){
          exists = true;
          break attributeLoop;
        }
      }
      break;
    case 'ids':
      if(node.id && objectValues.includes(node.id.trim().toLowerCase())){
        exists=true;
      }
      break;
  }
  return exists;
}
