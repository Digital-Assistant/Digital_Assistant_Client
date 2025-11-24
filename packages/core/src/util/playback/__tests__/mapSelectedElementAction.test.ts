
// Import the function to be tested
import { mapSelectedElementAction } from '../mapSelectedElementAction';

// Mock the dependencies
import { addToolTip } from '../../notification';
import { invokeNextNode } from '../invokeNextNode';
import { translate } from '../../translate';

jest.mock('../../notification', () => ({
  addToolTip: jest.fn(),
}));

jest.mock('../invokeNextNode', () => ({
  invokeNextNode: jest.fn(),
}));

jest.mock('../../translate', () => ({
  translate: jest.fn(key => key), // Mock translate to return the key
}));

describe('mapSelectedElementAction', () => {
  let node: HTMLElement;
  let recordedNode: any;
  let navigationCookieData: any;
  let recordedNodeData: any;
  const timeToInvoke = 1000;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock DOM element
    node = document.createElement('input');
    
    // Mock data structures
    recordedNode = { id: 'test-node' };
    navigationCookieData = { session: 'test-session' };
    recordedNodeData = {
      meta: {
        selectedElement: {
          systemTag: '', // This will be set in each test
        },
      },
    };
  });

  // Test cases for different systemTags
  const testCases = [
    { tag: 'text', tooltipArgs: [false, true, true] },
    { tag: 'date', tooltipArgs: [false, true, true] },
    { tag: 'range', tooltipArgs: [false, true, true] },
    { tag: 'file', tooltipArgs: [false, true, true] },
    { tag: 'telephone', tooltipArgs: [false, true, true] },
    { tag: 'email', tooltipArgs: [false, true, true] },
    { tag: 'number', tooltipArgs: [false, true, true] },
    { tag: 'password', tooltipArgs: [false, true, true] },
  ];

  testCases.forEach(({ tag, tooltipArgs }) => {
    it(`should handle '${tag}' systemTag by showing a tooltip`, () => {
      recordedNodeData.meta.selectedElement.systemTag = tag;
      const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);
      
      expect(addToolTip).toHaveBeenCalledWith(node, node, recordedNode, navigationCookieData, ...tooltipArgs);
      expect(invokeNextNode).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  it('should handle \'singleChoice\' systemTag', () => {
    recordedNodeData.meta.selectedElement.systemTag = 'singleChoice';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, node, recordedNode, navigationCookieData, false, false, true);
    expect(result).toBe(true);
  });

  it('should handle \'multipleChoice\' systemTag', () => {
    const parent = document.createElement('div');
    parent.appendChild(node);
    recordedNodeData.meta.selectedElement.systemTag = 'multipleChoice';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, parent, recordedNode, navigationCookieData, false, false, true);
    expect(result).toBe(true);
  });

  it('should handle \'button\' systemTag by showing a tooltip and invoking next node', () => {
    recordedNodeData.meta.selectedElement.systemTag = 'button';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, node, recordedNode, navigationCookieData, false, false, false, 'highLightText', false, true);
    expect(invokeNextNode).toHaveBeenCalledWith(node, timeToInvoke);
    expect(result).toBe(true);
  });

  it('should handle \'dropDown\' systemTag', () => {
    recordedNodeData.meta.selectedElement.systemTag = 'dropDown';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, node, recordedNode, navigationCookieData, false, false, true);
    expect(result).toBe(true);
  });

  it('should handle \'textArea\' systemTag', () => {
    const parent = document.createElement('div');
    parent.appendChild(node);
    recordedNodeData.meta.selectedElement.systemTag = 'textArea';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, parent, recordedNode, navigationCookieData, false, false, true);
    expect(result).toBe(true);
  });

  it('should handle \'highlight\' systemTag', () => {
    recordedNodeData.meta.selectedElement.systemTag = 'highlight';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).toHaveBeenCalledWith(node, node, recordedNode, navigationCookieData, false, false, true);
    expect(result).toBe(true);
  });

  it('should return false if the systemTag does not match any case', () => {
    recordedNodeData.meta.selectedElement.systemTag = 'unrecognized-tag';
    const result = mapSelectedElementAction(node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke);

    expect(addToolTip).not.toHaveBeenCalled();
    expect(invokeNextNode).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return false if recordedNodeData or its properties are null/undefined', () => {
    // Test with null recordedNodeData
    let result = mapSelectedElementAction(node, recordedNode, navigationCookieData, null, timeToInvoke);
    expect(result).toBe(false);

    // Test with null meta
    result = mapSelectedElementAction(node, recordedNode, navigationCookieData, { meta: null }, timeToInvoke);
    expect(result).toBe(false);

    // Test with null selectedElement
    result = mapSelectedElementAction(node, recordedNode, navigationCookieData, { meta: { selectedElement: null } }, timeToInvoke);
    expect(result).toBe(false);
  });
});
