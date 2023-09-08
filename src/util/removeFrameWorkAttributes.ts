/***
 * Functionality for removing unwanted attributes from the node properties
 */
import {FrameWorkAttributesConfig} from "../config/FrameWorkAttributesConfig";

/**
 * Remove properties from the original node
 * @param node
 */
export const removeFrameWorkAttributes = async (node: any) => {

    console.log({node});

    // cloning the node deeply to process it without effecting the original dom
    let copiedNode = node.cloneNode(true);

    // let copiedNode = node;

    for await (let frameWorkConfig of FrameWorkAttributesConfig) {
        // deleting dom node properties
        for await (let ignoreProperty of frameWorkConfig.list.domProperties) {
            if (copiedNode.hasOwnProperty(ignoreProperty)) {
                delete copiedNode[ignoreProperty];
            }
        }

        // deleting dom node properties that start with specified property name
        for await (let ignoreAttributeText of frameWorkConfig.list.domPropertiesStartsWith) {
            for (let key in copiedNode) {
                if (key.indexOf(ignoreAttributeText) !== -1) {
                    delete copiedNode[key];
                }
            }
        }

        // deleting attributes that are defined from element and from child elements

        // Get all the attributes on the element.
        const attributes = copiedNode.attributes;
        for await (let attribute of attributes){
            if(frameWorkConfig.list.attributes.indexOf(attribute) !== -1){
                copiedNode.removeAttribute(attribute);
            }
        }
        for await (let removeAttrib of frameWorkConfig.list.attributes) {
            copiedNode.querySelectorAll('[' + removeAttrib + ']').forEach((element) => {
                element.removeAttribute(removeAttrib);
            })
        }
    }

    console.log({copiedNode});
    return copiedNode;
}