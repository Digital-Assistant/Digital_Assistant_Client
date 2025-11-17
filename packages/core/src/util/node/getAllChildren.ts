/**
 * To get all the children of a given parent
 * @param htmlElement
 * @returns HTMLElements Collection
 */
export const getAllChildren = (htmlElement: any) => {
    let allChildElements = [];
    try {
        if (htmlElement?.children?.length === 0) return [htmlElement];

        for (let i = 0; i < htmlElement?.children?.length; i++) {
            let children: any = getAllChildren(htmlElement.children[i]);
            if (children) allChildElements.push(...children);
        }
        allChildElements.push(htmlElement);
    } catch (e) {
    }
    return allChildElements;
};