
// Import the function to be tested
import { matchAction } from '../matchAction';

// Import and mock dependencies
import { mapSelectedElementAction } from '../mapSelectedElementAction';
import { invokeNextNode } from '../invokeNextNode';
import { getSelectedRecordFromStore } from '../invokeNode';
import { checkNodeValues, nodeConfig, simulateHover, simulateMouseLeave } from '../../node';
import { translate } from '../../translate';
import { addToolTip, removeToolTip } from '../../notification';
import { inArray } from '../../inArray';
import { CONFIG } from '../../../config';

// Mock the dependencies
jest.mock('../mapSelectedElementAction');
jest.mock('../invokeNextNode');
jest.mock('../invokeNode');
jest.mock('../../node', () => ({
  ...jest.requireActual('../../node'), // Import and retain default exports
  checkNodeValues: jest.fn(),
  simulateHover: jest.fn(),
  simulateMouseLeave: jest.fn(),
  nodeConfig: {
    ignoreNodesFromIndexing: ['p', 'div'],
    specialInputClickClassNames: [],
  },
}));
jest.mock('../../translate');
jest.mock('../../notification', () => ({
  addToolTip: jest.fn((node, toolTipElement) => {
    // A more robust mock that returns a value for toolTipElement
    return toolTipElement || node;
  }),
  removeToolTip: jest.fn(),
}));
jest.mock('../../inArray');
jest.mock('../../../config', () => ({
  CONFIG: {
    playNextAction: true,
  },
}));

describe('matchAction', () => {
  let node: HTMLElement;
  let selectedNode: any;

  // Before each test, reset mocks and create default test data
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock implementation details
    (getSelectedRecordFromStore as jest.Mock).mockReturnValue({ id: 'test-record' });
    (translate as jest.Mock).mockImplementation(key => key); // Simple pass-through mock
    (inArray as jest.Mock).mockReturnValue(false); // Default to not found
    (checkNodeValues as jest.Mock).mockReturnValue(false); // Default to false

    // Create a mock DOM element
    node = document.createElement('button');
    
    // Create a mock selectedNode
    selectedNode = {
      objectdata: JSON.stringify({
        meta: {
          selectedElement: {
            systemTag: 'others'
          }
        }
      })
    };

    // Mock global config
    (window as any).UDAGlobalConfig = {
      enableNodeTypeSelection: false,
    };

    // Reset CONFIG property before each test
    CONFIG.playNextAction = true;
  });

  it('should do nothing if node is null', () => {
    matchAction(null, selectedNode);
    expect(removeToolTip).not.toHaveBeenCalled();
  });

  it('should do nothing if selectedNode.objectdata is not a string', () => {
    selectedNode.objectdata = { a: 1 }; // Not a string
    matchAction(node, selectedNode);
    expect(removeToolTip).not.toHaveBeenCalled();
  });

  it('should call basic setup functions for a valid node', () => {
    matchAction(node, selectedNode);
    expect(removeToolTip).toHaveBeenCalledTimes(1);
    expect(simulateHover).toHaveBeenCalledWith(node);
    expect(simulateMouseLeave).toHaveBeenCalledWith(node);
    expect(getSelectedRecordFromStore).toHaveBeenCalledTimes(1);
  });

  it('should handle a standard button element', () => {
    node = document.createElement('button');
    matchAction(node, selectedNode);
    expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, false, 'highLightText', false, true);
    expect(invokeNextNode).toHaveBeenCalledWith(node, 1000);
  });

  it('should handle a textarea and prevent next action', () => {
    node = document.createElement('textarea');
    const parent = document.createElement('div');
    parent.appendChild(node);

    matchAction(node, selectedNode);
    
    expect(CONFIG.playNextAction).toBe(false);
    expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, true);
    expect(invokeNextNode).not.toHaveBeenCalled();
  });

  it('should handle an input element of type text', () => {
    node = document.createElement('input');
    node.setAttribute('type', 'text');
    matchAction(node, selectedNode);
    expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, true, true);
  });
  
  it('should handle an input element of type submit', () => {
    node = document.createElement('input');
    node.setAttribute('type', 'submit');
    matchAction(node, selectedNode);
    expect(addToolTip).toHaveBeenCalled();
    expect(invokeNextNode).toHaveBeenCalledWith(node, 1000);
  });

  it('should use mapSelectedElementAction when enabled and a specific systemTag is present', () => {
    (window as any).UDAGlobalConfig.enableNodeTypeSelection = true;
    selectedNode.objectdata = JSON.stringify({
      meta: {
        selectedElement: {
          systemTag: 'custom-tag'
        }
      }
    });
    (mapSelectedElementAction as jest.Mock).mockReturnValue(true); // Simulate action was performed

    matchAction(node, selectedNode);

    expect(mapSelectedElementAction).toHaveBeenCalled();
    // Since mapSelectedElementAction returned true, other actions should not be called.
    expect(addToolTip).not.toHaveBeenCalled();
  });

  it('should show tooltip on parent for ignored nodes', () => {
    node = document.createElement('p'); // An ignored node type
    const parent = document.createElement('div');
    parent.appendChild(node);
    (inArray as jest.Mock).mockImplementation((val, arr) => (arr as string[]).includes(val));
    
    matchAction(node, selectedNode);

    expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, false);
    expect(invokeNextNode).not.toHaveBeenCalled();
  });

  it('should handle text editor elements via checkNodeValues', () => {
    (checkNodeValues as jest.Mock).mockReturnValue(true);
    
    matchAction(node, selectedNode);

    expect(checkNodeValues).toHaveBeenCalledWith(node, 'textEditors');
    expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, false);
    expect(invokeNextNode).not.toHaveBeenCalled();
  });

  it('should handle span with select2-selection class', () => {
    node = document.createElement('span');
    node.className = 'select2-selection';
    const grandParent = document.createElement('div');
    const parent = document.createElement('div');
    grandParent.appendChild(parent);
    parent.appendChild(node);

    matchAction(node, selectedNode);

    expect(addToolTip).toHaveBeenCalledWith(node, grandParent, selectedNode, expect.any(Object), true, false);
  });
});
