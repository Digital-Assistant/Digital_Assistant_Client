import {nodeConfig} from "./nodeConfig";

/**
 * Recursively removes properties from a node data object that may cause circular references
 * or are otherwise undesirable for serialization. This is particularly useful for cleaning up
 * JSON objects representing DOM nodes before they are stringified.
 *
 * @param nodeData The node data object to clean.
 * @returns The cleaned node data object.
 */
export const removeCircularReference = (nodeData: any) => {
    // Iterate over the keys in the node data object.
    for (let key in nodeData) {
        let ignoreAttribute: boolean = false;
        // Check if the key matches any of the configured dynamic attribute texts to be ignored.
        for (let ignoreText of nodeConfig.ignoreDynamicAttributeText) {
            if (key.indexOf(ignoreText) !== -1) {
                ignoreAttribute = true;
                break; // Exit the inner loop once a match is found.
            }
        }
        // If the attribute is marked for ignoring, delete it from the object.
        if(ignoreAttribute === true){
            delete nodeData[key];
        }
        // If the key is 'childNodes', recursively call this function for each child.
        if(key==='childNodes') {
            for(let index in nodeData[key]){
                nodeData[key][index] = removeCircularReference(nodeData[key][index]);
            }
        }
    }
    return nodeData;
}
