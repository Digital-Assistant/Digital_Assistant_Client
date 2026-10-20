// Helper to remove tooltip
export const removeToolTip = () => {
    const shadowRoot = document.getElementById('udan-react-root')?.shadowRoot;
    const toolTipExists = shadowRoot?.getElementById("uda-tooltip");
    if (toolTipExists && shadowRoot) {
        shadowRoot.removeChild(toolTipExists);
    }
};
