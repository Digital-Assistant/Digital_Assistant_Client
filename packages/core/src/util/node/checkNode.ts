export const isHighlightNode = (nodeData: any) => {
  try {
    const sel = nodeData?.meta?.selectedElement;
    if (sel && typeof sel.systemTag === 'string' && sel.systemTag.trim() === 'highlight') {
      return true;
    }
  } catch (_) {
    // ignore
  }
  return undefined;
}
