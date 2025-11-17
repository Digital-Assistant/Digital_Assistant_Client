/**
 * To get selected text from list options
 * @param node
 * @returns
 */
export const getSelectedTextFromSelectBox = (node: any) => {
    try {
        return node?.options?.[node?.selectedIndex].text;
    } catch (e) {
    }
}