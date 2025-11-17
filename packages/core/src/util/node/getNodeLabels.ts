export const getNodeLabels = (node: any, inputlabels: any, iterationno: any, iterate = true, getchildlabels = true, fromclick = false, iteratelimit = 3, ignorenode: any = []) => {

    if (!node) return inputlabels;

    try {
        if (Array.isArray(ignorenode)) {
            ignorenode = node;
        }

        if (
            (node.nodeName.toLowerCase() === "select" ||
                node.nodeName.toLowerCase() === "checkbox") &&
            iterate &&
            inputlabels.length === 0
        ) {
            iterationno++;
            inputlabels = getNodeLabels(
                node?.parentNode,
                inputlabels,
                iterationno,
                iterate,
                true,
                fromclick,
                iteratelimit,
                ignorenode
            );
            if (fromclick) {
                //todo need to rework
            }
        }

        if (
            node.nodeName.toLowerCase() === "input" ||
            node.nodeName.toLowerCase() === "textarea" ||
            node.nodeName.toLowerCase() === "img"
        ) {
            if (
                node.getAttribute("placeholder") &&
                node.getAttribute("placeholder") !== ""
            ) {
                inputlabels.push({
                    text: node.getAttribute("placeholder").toString(),
                    match: false,
                });
            }
            if (
                node.getAttribute("type") &&
                (node.getAttribute("type").toLowerCase() === "submit" ||
                    node.getAttribute("type").toLowerCase() === "file")
            ) {
                if (node.getAttribute("value")) {
                    inputlabels.push({
                        text: node.getAttribute("value").toString(),
                        match: false,
                    });
                    iterate = false;
                }
            }
            if (node.getAttribute("alt")) {
                inputlabels.push({
                    text: node.getAttribute("alt").toString(),
                    match: false,
                });
            }
        }

        if (getchildlabels && node.childNodes.length > 0) {
            let childNodes = node.childNodes;
            childNodes?.forEach(function (childNode: any) {
                if (
                    childNode.nodeName.toLowerCase() !== "script" &&
                    childNode.nodeName.toLowerCase() !== "select" &&
                    childNode.nodeName.toLowerCase() !== "#comment"
                ) {
                    let textcontent = childNode.textContent
                        .replace(/[\n\r]+|[\s]{2,}/g, " ")
                        .trim();

                    if (
                        textcontent !== "" &&
                        typeof ignorenode?.isSameNode === "function" &&
                        ignorenode?.isSameNode(childNode) === false
                    ) {
                        inputlabels.push({text: textcontent, match: false});
                    }
                }
            });
        }

        if (inputlabels.length === 0 && node.getAttribute("data-tooltip")) {
            inputlabels.push({
                text: node.getAttribute("data-tooltip").toString(),
                match: false,
            });
        }

        if (inputlabels.length === 0 && node.getAttribute("aria-label")) {
            inputlabels.push({
                text: node.getAttribute("aria-label").toString(),
                match: false,
            });
        }

        //todo fix for image tags
        if (
            iterate &&
            node.nodeName.toLowerCase() !== "img" &&
            inputlabels.length === 0 &&
            iterationno <= iteratelimit
        ) {
            iterationno++;
            inputlabels = getNodeLabels(
                node.parentNode,
                [],
                iterationno,
                iterate,
                getchildlabels,
                fromclick,
                iteratelimit,
                null
            );
        }

        if (inputlabels.length === 0 && node.id !== "") {
            inputlabels.push({
                text: node.nodeName.toLowerCase() + "-" + node.id,
                match: false,
            });
        } else if (
            inputlabels.length === 0 &&
            node.hasAttribute("class") &&
            node.className &&
            node.className !== ""
        ) {
            let classname = node.className.toString();
            inputlabels.push({
                text: node.nodeName.toLowerCase() + "-" + classname.replace(" ", "-"),
                match: false,
            });
        } else if (inputlabels.length === 0) {
            inputlabels.push({text: node.nodeName.toLowerCase(), match: false});
        }
    } catch (e) {
        // console.log(e);
    }
    return inputlabels;

}