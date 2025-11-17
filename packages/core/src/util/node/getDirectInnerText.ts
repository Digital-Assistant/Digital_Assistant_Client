export const getDirectInnerText = (element: any) => {
    const x = [];
    let child = element.firstChild;
    while (child) {
        if (child.nodeType == 3) {
            x.push(child.nodeValue);
        } else if (child.nodeType == 1) {
            let ii: any = getDirectInnerText(child);
            if (ii.length > 0) x.push(ii);
        }
        child = child.nextSibling;
    }
    return x.join(" ");
}