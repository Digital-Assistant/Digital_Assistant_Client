
// Import functions to be tested
import * as invokeNode from '../invokeNode';

// Mock dependencies
import { StorageUtil } from '../../storage';
import { CONFIG } from '../../../config';
import { removeToolTip, addNotification } from '../../notification';
import { trigger, getObjData, getAbsoluteOffsets, processDistanceOfNodes, searchNodes, nodeConfig } from '../../node';
import { delay } from '../delay';
import { matchAction } from '../matchAction';
import { UDAConsoleLogger } from '../../error';
import { translate } from '../../translate';

jest.mock('../../storage', () => ({
  StorageUtil: {
    getFromStore: jest.fn(),
    setToStore: jest.fn(),
  },
}));
jest.mock('../../notification', () => ({
  removeToolTip: jest.fn(),
  addNotification: jest.fn(),
}));
jest.mock('../../node', () => ({
  getObjData: jest.fn(),
  getAbsoluteOffsets: jest.fn(),
  processDistanceOfNodes: jest.fn(),
  searchNodes: jest.fn(),
  trigger: jest.fn(),
  nodeConfig: {
    commonTags: ['span', 'div'],
  },
}));
jest.mock('../delay', () => ({
  delay: jest.fn(),
}));
jest.mock('../matchAction', () => ({
  matchAction: jest.fn(),
}));
jest.mock('../../error', () => ({
  UDAConsoleLogger: {
    info: jest.fn(),
  },
}));
jest.mock('../../translate', () => ({
  translate: jest.fn(key => key),
}));

// Use fake timers for setTimeout
jest.useFakeTimers();

describe('invokeNode', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock global config
    (window as any).UDAGlobalConfig = {
      enableSlowReplay: false,
    };
  });

  describe('getSelectedRecordFromStore', () => {
    it('should get the selected recording from storage', async () => {
      const mockRecording = { id: 'rec-1' };
      (StorageUtil.getFromStore as jest.Mock).mockResolvedValue(mockRecording);

      const result = await invokeNode.getSelectedRecordFromStore();

      expect(StorageUtil.getFromStore).toHaveBeenCalledWith(CONFIG.SELECTED_RECORDING, false);
      expect(result).toEqual(mockRecording);
    });
  });

  describe('updateRecordToStore', () => {
    it('should update the status of a node and save it to storage', async () => {
      const mockRecording = {
        userclicknodesSet: [{ status: 'pending' }, { status: 'pending' }],
      };
      (StorageUtil.getFromStore as jest.Mock).mockResolvedValue(mockRecording);

      await invokeNode.updateRecordToStore(0);

      expect(StorageUtil.getFromStore).toHaveBeenCalledWith(CONFIG.SELECTED_RECORDING, false);

      const updatedRecording = {
        userclicknodesSet: [{ status: 'completed' }, { status: 'pending' }],
      };
      expect(StorageUtil.setToStore).toHaveBeenCalledWith(updatedRecording, CONFIG.SELECTED_RECORDING, false);
    });

    it('should not fail if the recording or node set is invalid', async () => {
      (StorageUtil.getFromStore as jest.Mock).mockResolvedValue(null);
      await invokeNode.updateRecordToStore(0);
      expect(StorageUtil.setToStore).not.toHaveBeenCalled();
    });

    it('should not fail if the node index is out of bounds', async () => {
      const mockRecording = {
        userclicknodesSet: [{ status: 'pending' }],
      };
      (StorageUtil.getFromStore as jest.Mock).mockResolvedValue(mockRecording);
      await invokeNode.updateRecordToStore(5); // Out of bounds index
      expect(StorageUtil.setToStore).not.toHaveBeenCalled();
    });

    it('should not fail if userclicknodesSet is missing', async () => {
      const mockRecording = {};
      (StorageUtil.getFromStore as jest.Mock).mockResolvedValue(mockRecording);
      await invokeNode.updateRecordToStore(0);
      expect(StorageUtil.setToStore).not.toHaveBeenCalled();
    });
  });

  describe('playNextNode', () => {
    it('should remove tooltip and trigger ContinuePlay after a delay', () => {
      invokeNode.playNextNode();

      expect(removeToolTip).not.toHaveBeenCalled();
      expect(trigger).not.toHaveBeenCalled();

      // Fast-forward time
      jest.advanceTimersByTime(CONFIG.DEBOUNCE_INTERVAL);

      expect(removeToolTip).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveBeenCalledWith('ContinuePlay', { action: 'ContinuePlay' });
    });
  });

  describe('matchNode', () => {
    let recordedNode: any;
    let originalNodeData: any;
    let playNextNodeSpy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on playNextNode to track its calls within the same module
      playNextNodeSpy = jest.spyOn(invokeNode, 'playNextNode').mockImplementation(() => { });

      // Basic setup for a recorded node with selectedRecordingDetails
      recordedNode = {
        node: {
          objectdata: '{}',
        },
        additionalParams: {},
        selectedRecordingDetails: {
          id: 'rec-1',
          additionalParams: {
            slowPlaybackTime: 2
          }
        },
      };

      originalNodeData = {
        meta: {},
        node: {
          nodeName: 'BUTTON',
        },
      };

      (getObjData as jest.Mock).mockReturnValue(originalNodeData);

      // Mock document queries
      document.getElementsByTagName = jest.fn().mockReturnValue([]);
      document.querySelectorAll = jest.fn().mockReturnValue([]);
    });

    afterEach(() => {
      // Restore the original implementation
      playNextNodeSpy.mockRestore();
    });

    it('should return true if recordedNode.node is null', async () => {
      const result = await invokeNode.matchNode({ node: null });
      expect(result).toBe(true);
    });

    it('should return true if recordedNode.node is undefined', async () => {
      const result = await invokeNode.matchNode({ node: undefined });
      expect(result).toBe(true);
    });

    it('should skip playback if skipDuringPlay is true', async () => {
      originalNodeData.meta.skipDuringPlay = true;
      const result = await invokeNode.matchNode(recordedNode);

      expect(playNextNodeSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should apply a delay if slow replay is enabled', async () => {
      (window as any).UDAGlobalConfig.enableSlowReplay = true;
      originalNodeData.meta.slowPlaybackTime = '2'; // 2 seconds

      await invokeNode.matchNode(recordedNode);

      expect(delay).toHaveBeenCalledWith(2000);
    });

    it('should not apply delay if slowPlaybackTime is 0', async () => {
      (window as any).UDAGlobalConfig.enableSlowReplay = true;
      originalNodeData.meta.slowPlaybackTime = '0';

      await invokeNode.matchNode(recordedNode);

      expect(delay).not.toHaveBeenCalled();
    });

    it('should not apply delay if slowPlaybackTime is not present', async () => {
      (window as any).UDAGlobalConfig.enableSlowReplay = true;

      await invokeNode.matchNode(recordedNode);

      expect(delay).not.toHaveBeenCalled();
    });

    it('should find an exact match using offsets', async () => {
      const matchingElement = document.createElement('button');
      originalNodeData.node.offset = { x: 100, y: 150 };

      (document.getElementsByTagName as jest.Mock).mockReturnValue([matchingElement]);
      (getAbsoluteOffsets as jest.Mock).mockReturnValue({ x: 100, y: 150 });

      const result = await invokeNode.matchNode(recordedNode);

      expect(matchAction).toHaveBeenCalledWith(matchingElement, recordedNode.node, recordedNode.selectedRecordingDetails);
      expect(result).toBe(true);
    });

    it('should pass selectedRecordingDetails to matchAction', async () => {
      const matchingElement = document.createElement('button');
      const customRecordingDetails = { id: 'custom-rec', custom: true };
      recordedNode.selectedRecordingDetails = customRecordingDetails;
      originalNodeData.node.offset = { x: 100, y: 150 };

      (document.getElementsByTagName as jest.Mock).mockReturnValue([matchingElement]);
      (getAbsoluteOffsets as jest.Mock).mockReturnValue({ x: 100, y: 150 });

      await invokeNode.matchNode(recordedNode);

      expect(matchAction).toHaveBeenCalledWith(matchingElement, recordedNode.node, customRecordingDetails);
    });

    it('should use searchNodes as a fallback if no other match is found', async () => {
      const nonMatchingElement = document.createElement('button');
      const finalElement = document.createElement('button');

      (document.getElementsByTagName as jest.Mock).mockReturnValue([nonMatchingElement]);
      (getAbsoluteOffsets as jest.Mock).mockReturnValue({ x: 0, y: 0 }); // No offset match
      (searchNodes as jest.Mock).mockReturnValue(finalElement);

      const result = await invokeNode.matchNode(recordedNode);

      expect(searchNodes).toHaveBeenCalled();
      expect(matchAction).toHaveBeenCalledWith(finalElement, recordedNode.node, recordedNode.selectedRecordingDetails);
      expect(result).toBe(true);
    });

    it('should show an error notification if no match is found', async () => {
      (document.getElementsByTagName as jest.Mock).mockReturnValue([]);
      (searchNodes as jest.Mock).mockReturnValue(null);

      const result = await invokeNode.matchNode(recordedNode);

      expect(addNotification).toHaveBeenCalledWith('playBackTittle', 'playBackError', 'error');
      expect(matchAction).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should use querySelectorAll for common tags with classNames', async () => {
      const matchingElement = document.createElement('span');
      originalNodeData.node.nodeName = 'SPAN';
      originalNodeData.node.className = 'my-class';

      (document.querySelectorAll as jest.Mock).mockReturnValue([matchingElement]);
      // Mock searchNodes to return the element, as this is the actual logic path
      (searchNodes as jest.Mock).mockReturnValue(matchingElement);

      const result = await invokeNode.matchNode(recordedNode);

      expect(document.querySelectorAll).toHaveBeenCalledWith('span.my-class');
      expect(searchNodes).toHaveBeenCalled(); // Verify the logic path
      expect(matchAction).toHaveBeenCalledWith(matchingElement, recordedNode.node, recordedNode.selectedRecordingDetails);
      expect(result).toBe(true);
    });

    it('should handle multiple class names separated by spaces', async () => {
      const matchingElement = document.createElement('div');
      originalNodeData.node.nodeName = 'DIV';
      originalNodeData.node.className = 'class-one class-two';

      (document.querySelectorAll as jest.Mock).mockReturnValue([matchingElement]);
      (searchNodes as jest.Mock).mockReturnValue(matchingElement);

      const result = await invokeNode.matchNode(recordedNode);

      expect(document.querySelectorAll).toHaveBeenCalledWith('div.class-one, div.class-two');
      expect(result).toBe(true);
    });

    it('should skip empty class names', async () => {
      const matchingElement = document.createElement('span');
      originalNodeData.node.nodeName = 'SPAN';
      originalNodeData.node.className = 'my-class  '; // Extra spaces

      (document.querySelectorAll as jest.Mock).mockReturnValue([matchingElement]);
      (searchNodes as jest.Mock).mockReturnValue(matchingElement);

      await invokeNode.matchNode(recordedNode);

      expect(document.querySelectorAll).toHaveBeenCalledWith('span.my-class');
    });

    it('should fall back to getElementsByTagName if querySelectorAll returns empty', async () => {
      const matchingElement = document.createElement('span');
      originalNodeData.node.nodeName = 'SPAN';
      originalNodeData.node.className = 'my-class';

      (document.querySelectorAll as jest.Mock).mockReturnValue([]);
      (document.getElementsByTagName as jest.Mock).mockReturnValue([matchingElement]);
      (searchNodes as jest.Mock).mockReturnValue(matchingElement);

      const result = await invokeNode.matchNode(recordedNode);

      expect(document.querySelectorAll).toHaveBeenCalled();
      expect(document.getElementsByTagName).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle undefined selectedRecordingDetails', async () => {
      const matchingElement = document.createElement('button');
      originalNodeData.node.offset = { x: 100, y: 150 };
      recordedNode.selectedRecordingDetails = undefined;

      (document.getElementsByTagName as jest.Mock).mockReturnValue([matchingElement]);
      (getAbsoluteOffsets as jest.Mock).mockReturnValue({ x: 100, y: 150 });

      const result = await invokeNode.matchNode(recordedNode);

      expect(matchAction).toHaveBeenCalledWith(matchingElement, recordedNode.node, undefined);
      expect(result).toBe(true);
    });

    it('should not use className search for non-common tags', async () => {
      const matchingElement = document.createElement('button');
      originalNodeData.node.nodeName = 'BUTTON';
      originalNodeData.node.className = 'my-class';

      (document.getElementsByTagName as jest.Mock).mockReturnValue([matchingElement]);
      (searchNodes as jest.Mock).mockReturnValue(matchingElement);

      await invokeNode.matchNode(recordedNode);

      // Should not call querySelectorAll for button (not a common tag)
      expect(document.querySelectorAll).not.toHaveBeenCalledWith('button.my-class');
      expect(document.getElementsByTagName).toHaveBeenCalledWith('BUTTON');
    });
  });
});
