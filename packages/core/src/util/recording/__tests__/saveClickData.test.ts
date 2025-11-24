
// Import the function to be tested
import { saveClickData } from '../saveClickData';

// Mock dependencies
import { inArray } from '../../inArray';
import { processNodeForClickData } from '../../node/processNodeForClickData';
import { CONFIG } from '../../../config';
import { getNodeInfo, nodeConfig } from '../../node';
import { getAbsoluteOffsets } from '../../node/getAbsoluteOffsets';
import { mapClickedElementToHtmlFormElement } from '../mapClickedElementToHtmlFormElement';
import { UDAErrorLogger } from '../../error/error-log';

jest.mock('../../inArray');
jest.mock('../../node/processNodeForClickData');
jest.mock('../../../config', () => ({
  CONFIG: {
    enableNodeTypeChangeSelection: false,
  },
}));
jest.mock('../../node', () => ({
  ...jest.requireActual('../../node'),
  getNodeInfo: jest.fn(),
  nodeConfig: {
    ignoreNodesFromIndexing: [],
    customNameForSpecialNodes: {},
  },
}));
jest.mock('../../node/getAbsoluteOffsets');
jest.mock('../mapClickedElementToHtmlFormElement');
jest.mock('../../error/error-log', () => ({
  UDAErrorLogger: {
    error: jest.fn(),
  },
  UDAConsoleLogger: {
    info: jest.fn(),
  }
}));

describe('saveClickData', () => {
  let node: HTMLElement;
  let text: string;
  let meta: any;

  beforeEach(() => {
    // Clear all mocks and set up default test data
    jest.clearAllMocks();
    node = document.createElement('button');
    text = 'Click Me';
    meta = { isPersonal: false };

    // Default mock implementations
    (processNodeForClickData as jest.Mock).mockResolvedValue({ node: {} });
    (getAbsoluteOffsets as jest.Mock).mockReturnValue({ x: 10, y: 20 });
    (getNodeInfo as jest.Mock).mockReturnValue({
      screenSize: { screen: { width: 1920, height: 1080 } },
    });
    (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({ systemTag: 'button' });
    (inArray as jest.Mock).mockReturnValue(-1);
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(saveClickData(null, text, meta)).rejects.toThrow('Required parameters are missing');
    // Use 'as any' to bypass TypeScript's strict type checking for this test case
    await expect(saveClickData(node, null as any, meta)).rejects.toThrow('Required parameters are missing');
    await expect(saveClickData(node, text, null)).rejects.toThrow('Required parameters are missing');
  });

  it('should process the node and return formatted click data', async () => {
    const result = await saveClickData(node, text, meta);

    // Add a type guard to ensure the result is not false
    expect(result).not.toBe(false);
    if (!result) {
      fail('Expected saveClickData to return an object, but it returned false.');
    }

    expect(processNodeForClickData).toHaveBeenCalledWith(node);
    expect(result.domain).toBe(window.location.host);
    expect(result.clickednodename).toBe(text);
    
    const objectData = JSON.parse(result.objectdata);
    expect(objectData.meta).toEqual(meta);
    expect(objectData.offset).toEqual({ x: 10, y: 20 });
  });

  it('should remove internal attributes from the node data', async () => {
    const processedNode = {
      node: {
        addedClickRecord: true,
        hasClick: true,
        udaIgnoreChildren: true,
        udaIgnoreClick: true,
        otherProp: 'test',
      },
    };
    (processNodeForClickData as jest.Mock).mockResolvedValue(processedNode);

    const result = await saveClickData(node, text, meta);
    
    expect(result).not.toBe(false);
    if (!result) {
      fail('Expected saveClickData to return an object, but it returned false.');
    }

    const objectData = JSON.parse(result.objectdata);

    expect(objectData.node).not.toHaveProperty('addedClickRecord');
    expect(objectData.node).not.toHaveProperty('hasClick');
    expect(objectData.node).not.toHaveProperty('udaIgnoreChildren');
    expect(objectData.node).not.toHaveProperty('udaIgnoreClick');
    expect(objectData.node.otherProp).toBe('test');
  });

  it('should return false if screen size information is missing', async () => {
    (getNodeInfo as jest.Mock).mockReturnValue({
      screenSize: { screen: { width: 0, height: 0 } },
    });
    const result = await saveClickData(node, text, meta);
    expect(result).toBe(false);
  });

  it('should map element type if enableNodeTypeChangeSelection is true', async () => {
    CONFIG.enableNodeTypeChangeSelection = true;
    (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({ inputElement: 'button', systemTag: 'button' });
    
    const result = await saveClickData(node, text, meta);

    expect(result).not.toBe(false);
    if (!result) {
      fail('Expected saveClickData to return an object, but it returned false.');
    }

    const objectData = JSON.parse(result.objectdata);

    expect(mapClickedElementToHtmlFormElement).toHaveBeenCalledWith(node);
    expect(objectData.meta.systemDetected).toBeDefined();
    expect(objectData.meta.selectedElement).toBeDefined();
  });

  it('should log and re-throw errors that occur during processing', async () => {
    const error = new Error('Processing failed');
    (processNodeForClickData as jest.Mock).mockRejectedValue(error);

    await expect(saveClickData(node, text, meta)).rejects.toThrow('Processing failed');
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error in saveClickData'), error);
  });
});
