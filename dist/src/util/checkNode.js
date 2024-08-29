export const isHighlightNode = (nodeData) => {
    if (nodeData.meta && nodeData.meta.hasOwnProperty('selectedElement') && nodeData.meta.selectedElement && nodeData.meta.selectedElement.systemTag.trim() === 'highlight') {
        return true;
    }
};
//# sourceMappingURL=checkNode.js.map