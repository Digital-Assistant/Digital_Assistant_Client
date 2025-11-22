/**
 * Recursively traverses the DOM to find descriptive labels for a given node.
 * This function is used to identify a node by its associated text, which can be in various places
 * like placeholders, attributes, or nearby text nodes.
 *
 * @param node The starting DOM node for which to find labels.
 * @param inputlabels An array to accumulate the found labels.
 * @param iterationno The current iteration number to prevent infinite recursion.
 * @param iterate A boolean to control whether to traverse up to the parent node.
 * @param getchildlabels A boolean to control whether to get labels from child nodes.
 * @param fromclick A boolean indicating if the function was called from a click event.
 * @param iteratelimit The maximum number of iterations to prevent infinite loops.
 * @param ignorenode A node to be ignored during traversal.
 * @returns An array of objects, where each object contains the `text` of a found label and a `match` flag.
 */
export const getNodeLabels = (node: any, inputlabels: any, iterationno: any, iterate = true, getchildlabels = true, fromclick = false, iteratelimit = 3, ignorenode: any = []) => {

    if (!node) return inputlabels;

    try {
        if (Array.isArray(ignorenode)) {
            ignorenode = node;
        }

        // For <select> and <checkbox> elements, start by looking at the parent node for labels.
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
                // TODO: Rework this part for click events.
            }
        }

        // For <input>, <textarea>, and <img> elements, check for specific attributes.
        if (
            node.nodeName.toLowerCase() === "input" ||
            node.nodeName.toLowerCase() === "textarea" ||
            node.nodeName.toLowerCase() === "img"
        ) {
            // Use the placeholder attribute as a label.
            if (
                node.getAttribute("placeholder") &&
                node.getAttribute("placeholder") !== ""
            ) {
                inputlabels.push({
                    text: node.getAttribute("placeholder").toString(),
                    match: false,
                });
            }
            // For submit and file inputs, use the value attribute.
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
            // For images, use the alt attribute.
            if (node.getAttribute("alt")) {
                inputlabels.push({
                    text: node.getAttribute("alt").toString(),
                    match: false,
                });
            }
        }

        // Get labels from child nodes.
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

        // If no labels are found, check for tooltip attributes.
        if (inputlabels.length === 0 && node.getAttribute("data-tooltip")) {
            inputlabels.push({
                text: node.getAttribute("data-tooltip").toString(),
                match: false,
            });
        }

        // If still no labels, check for aria-label.
        if (inputlabels.length === 0 && node.getAttribute("aria-label")) {
            inputlabels.push({
                text: node.getAttribute("aria-label").toString(),
                match: false,
            });
        }

        // If no labels are found and iteration is allowed, move to the parent node.
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

        // As a last resort, use the node's ID, class, or tag name as a label.
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
