import {checkNodeValues} from "./checkNodeValues";
import {getSelectedRecordFromStore} from "./invokeNode";
import {setInputValue} from "./setInputValue";
import {invokeNextNode} from "./invokeNextNode";
import {addToolTip} from "./addToolTip";
import {translate} from "./translation";
import {getAbsoluteOffsets} from "./index";
import {processDistanceOfNodes} from "./processDistanceOfNodes";
import {searchNodes} from "./searchNodes";

export const matchLLMInputToNode = (node, selectedNode, selectedRecordingDetails: any, timeToInvoke: number)=>{

    console.log('llm input processing');

    const recordedNodeData = JSON.parse(selectedNode.objectdata);
    let llmInput: any = null;
    let performedAction = false;

    const navigationData = getSelectedRecordFromStore();

    if(recordedNodeData.meta && recordedNodeData.meta?.inputType && recordedNodeData.meta?.inputType !==''){
        if(selectedRecordingDetails?.matchedRecording?.inputValues && selectedRecordingDetails?.matchedRecording?.inputValues?.length > 0) {
            llmInput = Array.from(selectedRecordingDetails.matchedRecording.inputValues).find((inputValue: any) => inputValue.Input.trim() === recordedNodeData.meta?.inputType.trim());
        }
    }

    // If no LLM input found, fallback to old logic
    if(!llmInput) {
        console.log('llm input not found');
        return false;
    }

    if(llmInput && !llmInput.InputValue) {
        console.log('llm input value not provided');
        return false;
    }

    // adding tooltip to text editor elements
    if(checkNodeValues(node, 'textEditors')){
        // addToolTip(node, node, selectedNode, navigationData, false, false, false);
        // todo add handler for textEditors
        // performedAction = true;
    }

    // adding tooltip to drop down elements
    if(checkNodeValues(node, 'dropDowns')){
        // addToolTip(node, node, selectedNode, navigationData, false, false, false);
        // todo add handler for dropDowns
        // performedAction = true;
    }

    // adding tooltip to Date selector elements
    if(checkNodeValues(node, 'datePicker')){
        // addToolTip(node, node, selectedNode, navigationData, false, false, false);
        // todo add handler for datePickers
        // performedAction = true;
    }

    switch (node.nodeName.toLowerCase()) {
        case "input":
            // functionality for detecting multi select box and highlighting the recorded node
            if (node.hasAttribute('type')) {
                switch (node.getAttribute('type').toLowerCase()) {
                    case 'text':
                        addToolTip(node, node, selectedNode, navigationData, false, true, true);
                        setInputValue(node, llmInput.InputValue);
                        performedAction = true;
                        break;
                    case 'date':
                        addToolTip(node, node, selectedNode, navigationData, false, false, false);
                        setInputValue(node, llmInput.InputValue);
                        performedAction = true;
                        break;
                    case 'checkbox':
                        addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
                        const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="+${node.name}"]`);
                        checkboxes.forEach((checkbox: any) => {
                            if (checkbox.value === llmInput.InputValue) {
                                checkbox.checked = true;
                                performedAction = true;
                            }
                        });
                        break;
                    case 'radio':
                        addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
                        const radioBoxes = document.querySelectorAll(`input[type="radio"][name="+${node.name}"]`);
                        radioBoxes.forEach((radioBox: any) => {
                            if (radioBox.value === llmInput.InputValue) {
                                radioBox.checked = true;
                                performedAction = true;
                            }
                        });
                        break;
                    default:
                        performedAction=false;
                        break;
                }
            } else {
                addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            }
            break;
        case "select":
            addToolTip(node, node, selectedNode, navigationData, false, false, true);
            for (let i = 0; i < node.options.length; i++) {
                if (node.options[i].value === llmInput.inputValue) {
                    node.options[i].selected = true;
                    performedAction = true;
                }
            }
            break;
        case "textarea":
            addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            setInputValue(node, llmInput.InputValue);
            performedAction = true;
            break;
        default:
            performedAction = false;
            break;
    }

    if(performedAction) {
        console.log('performed action');
        console.log(performedAction);
        return performedAction;
    }

    let compareElements: any = []
    let matchedElements: any = [];
    let finalMatchElement: any = null;
    let originalElement = recordedNodeData?.node;

    // Finding the node based on the LLM input
    const nodes = document.querySelectorAll(recordedNodeData.node.nodeName.trim()); // Select all nodes

/**
     * Finds the node that matches the given LLM input value based on the recorded node data.
     *
     * This function iterates through all nodes with the same name as the original node, and checks if the text content matches the LLM input value. If a match is found, it also checks if the absolute offsets of the node match the original node's offsets. If a match is found, it sets the `finalMatchElement` variable and breaks out of the loop.
     *
     * If multiple elements match, it adds them to the `compareElements` and `matchedElements` arrays for further processing.
     */
        for (let i = 0; i < nodes.length; i++) {
        let compareElement = nodes[i];
        if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase() && (compareElement.textContent.trim().toLowerCase() === llmInput.InputValue.trim().toLowerCase())) {
            if (originalElement.offset) {
                const _offsets = getAbsoluteOffsets(compareElement);
                if (
                    _offsets.x == originalElement.offset.x &&
                    _offsets.y == originalElement.offset.y
                ) {
                    finalMatchElement = compareElement;
                    break;
                }
            }
            compareElements.push({nodeName: compareElement.nodeName, node: compareElement});
            matchedElements.push(compareElement);
        }
    }

    if (finalMatchElement === null) {
        if (matchedElements.length == 1) {
            // add to the variable as only one element matched
            finalMatchElement = matchedElements[0];
        } else if (matchedElements.length > 1) {
            // check the distance of the matched elements on the page
            console.log(matchedElements);
            finalMatchElement = processDistanceOfNodes(matchedElements, recordedNodeData.node);
        }


        if (finalMatchElement) {
            addToolTip(finalMatchElement, finalMatchElement, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
            invokeNextNode(finalMatchElement, timeToInvoke);
            performedAction = true;
        }
    }

    return performedAction;

}
