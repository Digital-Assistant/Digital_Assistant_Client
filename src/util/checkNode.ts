import {mapSelectedElementAction} from "./mapSelectedElementAction";

export const isHighlightNode = (nodeData: any) => {
  if (nodeData.meta && nodeData.meta.hasOwnProperty('selectedElement') && nodeData.meta.selectedElement && nodeData.meta.selectedElement.systemTag.trim() === 'highlight') {
    return true;
  }
}
