export const clickableElementExists = (compareNode: HTMLElement) => {
  // Ensure window exists and udanSelectedNodes is an array
  if (typeof window !== 'undefined') {
    if (!window.udanSelectedNodes) {
      window.udanSelectedNodes = [];
    }

    // Now iterate through the array efficiently
    for (const element of window.udanSelectedNodes) {
      if (element.isSameNode(compareNode)) {
        return true; // Found a match, no need to continue
      }
    }
  }
  return false; // No match found or window not available
}
