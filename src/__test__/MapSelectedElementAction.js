import {mapSelectedElementAction} from "../util/mapSelectedElementAction";

describe('mapSelectedElementAction', () => {
    let node;
    let recordedNode;
    let navigationCookieData;
    let recordedNodeData;
    let timeToInvoke;

    beforeEach(() => {
        // Initialize test data before each test case
        node = document.createElement('div');
        recordedNode = { /* mock recorded node data */ };
        navigationCookieData = { /* mock navigation cookie data */ };
        recordedNodeData = { /* mock recorded node data */ };
        timeToInvoke = 1000;
    });

    it('should perform the action for a text system tag', () => {
        recordedNodeData.meta.selectedElement.systemTag = 'text';
        const performedAction = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);
        expect(performedAction).toBe(true);
        // Add assertions for the expected behavior of the action
    });

    it('should perform the action for a date system tag', () => {
        recordedNodeData.meta.selectedElement.systemTag = 'date';
        const performedAction = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);
        expect(performedAction).toBe(true);
        // Add assertions for the expected behavior of the action
    });

    // Add more test cases for other system tags

    it('should not perform the action for an unknown system tag', () => {
        recordedNodeData.meta.selectedElement.systemTag = 'unknown';
        const performedAction = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);
        expect(performedAction).toBe(false);
        // Add assertions for the expected behavior of the action
    });
});
