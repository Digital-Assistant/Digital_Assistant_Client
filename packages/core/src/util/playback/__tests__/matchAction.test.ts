
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
import { matchLLMInputToNode } from '../matchLLMInputToNode';

// Mock the dependencies
jest.mock('../mapSelectedElementAction');
jest.mock('../invokeNextNode');
jest.mock('../invokeNode');
jest.mock('../matchLLMInputToNode');
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
  let selectedRecordingDetails: any;

  // Before each test, reset mocks and create default test data
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock implementation details
    (getSelectedRecordFromStore as jest.Mock).mockReturnValue({ id: 'test-record' });
    (translate as jest.Mock).mockImplementation(key => key); // Simple pass-through mock
    (inArray as jest.Mock).mockReturnValue(false); // Default to not found
    (checkNodeValues as jest.Mock).mockReturnValue(false); // Default to false
    (matchLLMInputToNode as jest.Mock).mockReturnValue(false); // Default to not handled by LLM

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

    // Create a mock selectedRecordingDetails
    selectedRecordingDetails = {
      additionalParams: {}
    };

    // Mock global config
    (window as any).UDAGlobalConfig = {
      enableNodeTypeSelection: false,
      enableAISearch: false,
    };

    // Reset CONFIG property before each test
    CONFIG.playNextAction = true;
  });

  it('should do nothing if node is null', () => {
    matchAction(null, selectedNode, selectedRecordingDetails);
    expect(removeToolTip).not.toHaveBeenCalled();
  });

  it('should throw an error if selectedNode.objectdata is not a valid JSON string', () => {
    selectedNode.objectdata = { a: 1 }; // Not a string - will cause JSON.parse to throw
    expect(() => matchAction(node, selectedNode, selectedRecordingDetails)).toThrow();
  });

  it('should call basic setup functions for a valid node', () => {
    matchAction(node, selectedNode, selectedRecordingDetails);
    expect(removeToolTip).toHaveBeenCalledTimes(1);
    expect(simulateHover).toHaveBeenCalledWith(node);
    expect(simulateMouseLeave).toHaveBeenCalledWith(node);
    expect(getSelectedRecordFromStore).toHaveBeenCalledTimes(1);
  });

  it('should handle a standard button element', () => {
    node = document.createElement('button');
    matchAction(node, selectedNode, selectedRecordingDetails);
    expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, false, 'highLightText', false, true);
    expect(invokeNextNode).toHaveBeenCalledWith(node, 2000);
  });

  it('should use custom slowPlaybackTime from selectedRecordingDetails', () => {
    node = document.createElement('button');
    selectedRecordingDetails.additionalParams.slowPlaybackTime = 5;
    matchAction(node, selectedNode, selectedRecordingDetails);
    expect(invokeNextNode).toHaveBeenCalledWith(node, 5000);
  });

  it('should handle a textarea and prevent next action', () => {
    node = document.createElement('textarea');
    const parent = document.createElement('div');
    parent.appendChild(node);

    matchAction(node, selectedNode, selectedRecordingDetails);

    expect(CONFIG.playNextAction).toBe(false);
    expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, true);
    expect(invokeNextNode).not.toHaveBeenCalled();
  });

  it('should handle an input element of type text', () => {
    node = document.createElement('input');
    node.setAttribute('type', 'text');
    matchAction(node, selectedNode, selectedRecordingDetails);
    expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, true, true);
  });

  it('should handle an input element of type submit', () => {
    node = document.createElement('input');
    node.setAttribute('type', 'submit');
    matchAction(node, selectedNode, selectedRecordingDetails);
    expect(addToolTip).toHaveBeenCalled();
    expect(invokeNextNode).toHaveBeenCalledWith(node, 2000);
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

    matchAction(node, selectedNode, selectedRecordingDetails);

    expect(mapSelectedElementAction).toHaveBeenCalled();
    // Since mapSelectedElementAction returned true, other actions should not be called.
    expect(addToolTip).not.toHaveBeenCalled();
  });

  it('should show tooltip on parent for ignored nodes', () => {
    node = document.createElement('p'); // An ignored node type
    const parent = document.createElement('div');
    parent.appendChild(node);
    (inArray as jest.Mock).mockImplementation((val, arr) => (arr as string[]).includes(val));

    matchAction(node, selectedNode, selectedRecordingDetails);

    expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, false);
    expect(invokeNextNode).not.toHaveBeenCalled();
  });

  it('should handle text editor elements via checkNodeValues', () => {
    (checkNodeValues as jest.Mock).mockReturnValue(true);

    matchAction(node, selectedNode, selectedRecordingDetails);

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

    matchAction(node, selectedNode, selectedRecordingDetails);

    expect(addToolTip).toHaveBeenCalledWith(node, grandParent, selectedNode, expect.any(Object), true, false);
  });

  describe('LLM Input Matching', () => {
    beforeEach(() => {
      (window as any).UDAGlobalConfig.enableAISearch = true;
    });

    it('should attempt LLM input matching when enableAISearch is true and inputType is present', () => {
      selectedNode.objectdata = JSON.stringify({
        meta: {
          inputType: 'text',
          selectedElement: {
            systemTag: 'others'
          }
        }
      });
      (matchLLMInputToNode as jest.Mock).mockReturnValue(true);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(matchLLMInputToNode).toHaveBeenCalledWith(node, selectedNode, selectedRecordingDetails, 2000);
      // Since matchLLMInputToNode returned true, no further processing should occur
      expect(addToolTip).not.toHaveBeenCalled();
    });

    it('should continue with normal processing if LLM matching fails', () => {
      selectedNode.objectdata = JSON.stringify({
        meta: {
          inputType: 'text',
          selectedElement: {
            systemTag: 'others'
          }
        }
      });
      (matchLLMInputToNode as jest.Mock).mockReturnValue(false);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(matchLLMInputToNode).toHaveBeenCalledWith(node, selectedNode, selectedRecordingDetails, 2000);
      // Normal processing should continue
      expect(addToolTip).toHaveBeenCalled();
    });

    it('should not attempt LLM matching when enableAISearch is false', () => {
      (window as any).UDAGlobalConfig.enableAISearch = false;
      selectedNode.objectdata = JSON.stringify({
        meta: {
          inputType: 'text',
          selectedElement: {
            systemTag: 'others'
          }
        }
      });

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(matchLLMInputToNode).not.toHaveBeenCalled();
    });

    it('should not attempt LLM matching when inputType is not present', () => {
      selectedNode.objectdata = JSON.stringify({
        meta: {
          selectedElement: {
            systemTag: 'others'
          }
        }
      });

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(matchLLMInputToNode).not.toHaveBeenCalled();
    });
  });

  describe('Input element edge cases', () => {
    it('should handle input with select2-search__field class', () => {
      node = document.createElement('input');
      node.classList.add('select2-search__field');

      // Create deep parent structure
      const parent1 = document.createElement('div');
      const parent2 = document.createElement('div');
      const parent3 = document.createElement('div');
      const parent4 = document.createElement('div');
      const parent5 = document.createElement('div');
      parent5.appendChild(parent4);
      parent4.appendChild(parent3);
      parent3.appendChild(parent2);
      parent2.appendChild(parent1);
      parent1.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, parent5, selectedNode, expect.any(Object), false, true);
    });

    it('should handle input with role combobox', () => {
      node = document.createElement('input');
      node.setAttribute('role', 'combobox');

      // Create deep parent structure
      const parent1 = document.createElement('div');
      const parent2 = document.createElement('div');
      const parent3 = document.createElement('div');
      const parent4 = document.createElement('div');
      parent4.appendChild(parent3);
      parent3.appendChild(parent2);
      parent2.appendChild(parent1);
      parent1.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, parent4, selectedNode, expect.any(Object), false, false, true);
    });

    it('should handle checkbox input', () => {
      node = document.createElement('input');
      node.setAttribute('type', 'checkbox');
      const parent = document.createElement('div');
      parent.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, true);
    });

    it('should handle radio input', () => {
      node = document.createElement('input');
      node.setAttribute('type', 'radio');
      const parent = document.createElement('div');
      parent.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), false, false, true);
    });

    it('should handle date input', () => {
      node = document.createElement('input');
      node.setAttribute('type', 'date');

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, false);
    });
  });

  describe('Select and option elements', () => {
    it('should handle select element', () => {
      node = document.createElement('select');

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, true);
    });

    it('should handle option element', () => {
      const selectNode = document.createElement('select');
      node = document.createElement('option');
      selectNode.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, selectNode, selectedNode, expect.any(Object), false, false, true);
    });
  });

  describe('Button edge cases', () => {
    it('should handle button with aria-label "open calendar"', () => {
      node = document.createElement('button');
      node.setAttribute('aria-label', 'Open Calendar');
      const parent = document.createElement('div');
      parent.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, parent, selectedNode, expect.any(Object), true, false);
    });

    it('should handle button with btn-pill class', () => {
      node = document.createElement('button');
      node.classList.add('btn-pill');

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false, false, 'highLightText', false, true);
      expect(invokeNextNode).toHaveBeenCalledWith(node, 2000);
    });
  });

  describe('Span element edge cases', () => {
    it('should handle span with radio and replacement classes', () => {
      node = document.createElement('span');
      node.classList.add('radio', 'replacement');
      const parent = document.createElement('div');
      const grandParent = document.createElement('div');
      grandParent.appendChild(parent);
      parent.appendChild(node);

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, grandParent, selectedNode, expect.any(Object), false, false, true);
    });
  });

  describe('Special node types', () => {
    it('should handle ckeditor element', () => {
      node = document.createElement('ckeditor');

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), true, false);
    });

    it('should handle ng-select element', () => {
      node = document.createElement('ng-select');

      matchAction(node, selectedNode, selectedRecordingDetails);

      expect(addToolTip).toHaveBeenCalledWith(node, node, selectedNode, expect.any(Object), false, false);
    });
  });
});
