/**
 * Checks if a given node data object represents a "highlight" node.
 * A highlight node is identified by a specific `systemTag` in its metadata.
 *
 * @param nodeData The node data object to check. This object is expected to have a `meta.selectedElement.systemTag` property.
 * @returns `true` if the node is a highlight node, `undefined` otherwise.
 *          It returns `undefined` instead of `false` to indicate that the check might not have been conclusive
 *          if an error occurred or the property was not found.
 */
export const isHighlightNode = (nodeData: any) => {
  try {
    // Safely access the `systemTag` from the nested properties of the node data.
    const sel = nodeData?.meta?.selectedElement;
    // Check if the `systemTag` is a string and if its trimmed value is 'highlight'.
    if (sel && typeof sel.systemTag === 'string' && sel.systemTag.trim() === 'highlight') {
      return true;
    }
  } catch (_) {
    // If any error occurs during property access, ignore it and proceed to the default return.
  }
  // Return `undefined` if the node is not a highlight node or if an error occurred.
  return undefined;
}
