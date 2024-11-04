import { checkNodeValues } from "./checkNodeValues";
import { getSelectedRecordFromStore } from "./invokeNode";
import { setInputValue } from "./setInputValue";
import { invokeNextNode } from "./invokeNextNode";
import { addToolTip } from "./addToolTip";
import { translate } from "./translation";
import { getAbsoluteOffsets } from "./index";
import { processDistanceOfNodes } from "./processDistanceOfNodes";
import {UDAConsoleLogger, UDAErrorLogger} from "../config/error-log";

/**
 * Matches LLM input to a DOM node and performs the appropriate action.
 *
 * @param node - The current DOM node to process.
 * @param selectedNode - The node data selected for matching.
 * @param selectedRecordingDetails - Details of the recording to match against.
 * @param timeToInvoke - Time delay before invoking the next node action.
 * @returns A boolean indicating if an action was performed.
 */
export const matchLLMInputToNode = (node, selectedNode, selectedRecordingDetails: any, timeToInvoke: number): boolean => {
    try {
        // Parse the recorded node data from the selected node
        const recordedNodeData = JSON.parse(selectedNode.objectdata);
        let llmInput: any = null;
        let performedAction = false;

        // Retrieve navigation data from the store
        const navigationData = getSelectedRecordFromStore();

        // Check if the recorded node has a specific input type and find matching LLM input
        if (recordedNodeData.meta && recordedNodeData.meta?.inputType && recordedNodeData.meta?.inputType !== '') {
            if (selectedRecordingDetails?.matchedRecording?.inputValues && selectedRecordingDetails?.matchedRecording?.inputValues?.length > 0) {
                llmInput = Array.from(selectedRecordingDetails.matchedRecording.inputValues).find((inputValue: any) => inputValue.Input.trim() === recordedNodeData.meta?.inputType.trim());
            }
        }

        // If no LLM input is found or input value is missing, log an error and return
        if (!llmInput) {
            UDAErrorLogger.error('LLM input not found');
            return false;
        }

        if (llmInput && !llmInput.InputValue) {
            UDAErrorLogger.error('LLM input value not provided');
            return false;
        }

        // Helper function to handle specific node types
        const handleNodeType = (nodeType: string, action: () => void) => {
            if (checkNodeValues(node, nodeType)) {
                action();
            }
        };

        // Handle specific node types like text editors, dropdowns, and date pickers
        handleNodeType('textEditors', () => {
            // Placeholder for future handlers for text editors
        });
        handleNodeType('dropDowns', () => {
            // Placeholder for future handlers for dropdowns
        });
        handleNodeType('datePicker', () => {
            // Placeholder for future handlers for date pickers
        });

        // Helper function to handle input elements based on their type
        const handleInputType = (type: string, action: () => void) => {
            if (node.hasAttribute('type') && node.getAttribute('type').toLowerCase() === type) {
                action();
            }
        };

        // Process the node based on its type and perform actions
        switch (node.nodeName.toLowerCase()) {
            case "input":
                handleInputType('text', () => {
                    addToolTip(node, node, selectedNode, navigationData, false, true, true);
                    setInputValue(node, llmInput.InputValue);
                    performedAction = true;
                });
                handleInputType('date', () => {
                    addToolTip(node, node, selectedNode, navigationData, false, false, false);
                    setInputValue(node, llmInput.InputValue);
                    performedAction = true;
                });
                handleInputType('checkbox', () => {
                    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
                    const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${node.name}"]`);
                    checkboxes.forEach((checkbox: HTMLInputElement) => {
                        if (checkbox.value === llmInput.InputValue) {
                            checkbox.checked = true;
                            performedAction = true;
                        }
                    });
                });
                handleInputType('radio', () => {
                    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
                    const radioBoxes = document.querySelectorAll(`input[type="radio"][name="${node.name}"]`);
                    radioBoxes.forEach((radioBox: HTMLInputElement) => {
                        if (radioBox.value === llmInput.InputValue) {
                            radioBox.checked = true;
                            performedAction = true;
                        }
                    });
                });
                break;
            case "select":
                addToolTip(node, node, selectedNode, navigationData, false, false, true);
                for (let i = 0; i < node.options.length; i++) {
                    if (node.options[i].value === llmInput.InputValue) {
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

        // If an action was performed, log and return
        if (performedAction) {
            UDAConsoleLogger.info('Performed action');
            return performedAction;
        }

        // Variables for node matching logic
        let compareElements: any[] = [];
        let matchedElements: any[] = [];
        let finalMatchElement: HTMLElement | null = null;
        const originalElement = recordedNodeData?.node;

        // Select all nodes with the same name as the recorded node
        const nodes = document.querySelectorAll(originalElement.nodeName.trim());

        // Iterate through nodes to find a match based on LLM input
        nodes.forEach((compareElement: HTMLElement) => {
            if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase() && (compareElement.textContent?.trim().toLowerCase() === llmInput.InputValue.trim().toLowerCase())) {
                if (originalElement.offset) {
                    const _offsets = getAbsoluteOffsets(compareElement);
                    if (_offsets.x === originalElement.offset.x && _offsets.y === originalElement.offset.y) {
                        finalMatchElement = compareElement;
                        return;
                    }
                }
                compareElements.push({ nodeName: compareElement.nodeName, node: compareElement });
                matchedElements.push(compareElement);
            }
        });

        // Determine the final matching element if not already found
        if (!finalMatchElement) {
            if (matchedElements.length === 1) {
                finalMatchElement = matchedElements[0];
            } else if (matchedElements.length > 1) {
                finalMatchElement = processDistanceOfNodes(matchedElements, originalElement);
            }

            // If a final match is found, add a tooltip and invoke the next node
            if (finalMatchElement) {
                addToolTip(finalMatchElement, finalMatchElement, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
                invokeNextNode(finalMatchElement, timeToInvoke);
                performedAction = true;
            }
        }

        return performedAction;
    } catch (error) {
        UDAErrorLogger.error('Error in matchLLMInputToNode:', error);
        return false;
    }
}
