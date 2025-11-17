export const getAbsoluteOffsets = (element: HTMLElement) => {
    let cords = {x: 0, y: 0};
    try {
        let currentElement: any = element;

        while (currentElement !== null) {
            cords.x += currentElement.offsetLeft;
            cords.x -= currentElement.scrollLeft;
            cords.y += currentElement.offsetTop;
            cords.y -= currentElement.scrollTop;
            currentElement = currentElement.offsetParent;
        }
    } catch (e) {
        console.log(e)
    }

    return cords;
}