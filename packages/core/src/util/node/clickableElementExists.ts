/**
 * To check if a given element is already captured / recorded
 * @returns boolean
 * @param compareNode
 */

declare const window: any;
export const clickableElementExists = (compareNode: HTMLElement) => {
    let existFlag = false;
    if (!window.udanSelectedNodes) window.udanSelectedNodes = [];
    window?.udanSelectedNodes?.forEach((element: any) => {
        if (element.isSameNode(compareNode)) existFlag = true;
    });
    return existFlag;
}