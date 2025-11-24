
// Import the function to be tested
import { recordUserClick } from '../recordUserClick';

// Mock dependencies
import { CONFIG } from '../../../config';
import { getClickedInputLabels } from '../../node/getClickedInputLabels';
import { saveClickData } from '../saveClickData';
import { checkNodeValues } from '../../node/checkNodeValues';
import { mapClickedElementToHtmlFormElement } from '../mapClickedElementToHtmlFormElement';
import { addNotification } from '../../notification/addNotification';
import { translate } from '../../translate/translation';
import { UDAErrorLogger } from '../../error/';
import { StorageUtil } from '../../storage';
import { clickableElementExists } from '../../node';
import { store, setRecSequenceData } from '../../../store';

jest.mock('../../../config', () => ({
  CONFIG: {
    RECORDING_SWITCH_KEY: 'isRecording',
    RECORDING_SEQUENCE: 'recSeq',
    lastClickedTime: 0,
  },
}));
jest.mock('../../node/getClickedInputLabels');
jest.mock('../saveClickData');
jest.mock('../../node/checkNodeValues');
jest.mock('../mapClickedElementToHtmlFormElement');
jest.mock('../../notification/addNotification');
jest.mock('../../translate/translation');
jest.mock('../../error/');
jest.mock('../../storage');
jest.mock('../../node', () => ({
  ...jest.requireActual('../../node'),
  clickableElementExists: jest.fn(),
}));
jest.mock('../../../store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  setRecSequenceData: jest.fn(data => ({ type: 'SET_REC_SEQUENCE_DATA', payload: data })),
}));

describe('recordUserClick', () => {
  let node: HTMLElement;
  let event: any; // Use 'any' to allow for a simple mock object

  beforeEach(() => {
    // Clear all mocks and reset global state for each test
    jest.clearAllMocks();
    (window as any).clickedNode = null;
    (window as any).udanSelectedNodes = [];
    (window as any).UDAGlobalConfig = { enableNodeTypeSelection: false };
    CONFIG.lastClickedTime = 0;

    node = document.createElement('button');
    // Create a simple mock object for the event, as isTrusted is non-configurable
    event = { isTrusted: true };

    // Default mock implementations
    (StorageUtil.getFromStore as jest.Mock).mockImplementation((key) => {
      if (key === CONFIG.RECORDING_SWITCH_KEY) return 'true';
      if (key === CONFIG.RECORDING_SEQUENCE) return [];
      return null;
    });
    (getClickedInputLabels as jest.Mock).mockReturnValue('Mocked Label');
    (saveClickData as jest.Mock).mockResolvedValue({ id: 'test-click' });
    (checkNodeValues as jest.Mock).mockReturnValue(false);
    (clickableElementExists as jest.Mock).mockReturnValue(false);
    (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({ systemTag: 'others' });
    (store.getState as jest.Mock).mockReturnValue({ recording: { recSequenceData: [] } });
  });

  it('should return false if no node is provided', async () => {
    const result = await recordUserClick(null, event);
    expect(result).toBe(false);
  });

  it('should return false if recording is not active', async () => {
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue('false');
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should return false for immediate duplicate clicks on the same node', async () => {
    (window as any).clickedNode = node;
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should return false if the click is debounced', async () => {
    CONFIG.lastClickedTime = Date.now();
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should return false for untrusted events', async () => {
    const untrustedEvent = { isTrusted: false };
    const result = await recordUserClick(node, untrustedEvent);
    expect(result).toBe(false);
  });

  it('should return false for nodes with udaIgnoreClick attribute', async () => {
    node.setAttribute('udaIgnoreClick', '');
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should return false for excluded nodes', async () => {
    (checkNodeValues as jest.Mock).mockReturnValue(true);
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should return false if the element is already considered clickable', async () => {
    (clickableElementExists as jest.Mock).mockReturnValue(true);
    const result = await recordUserClick(node, event);
    expect(result).toBe(false);
  });

  it('should successfully record a valid click', async () => {
    const result = await recordUserClick(node, event);

    expect(saveClickData).toHaveBeenCalledWith(node, 'Mocked Label', expect.any(Object));
    expect(StorageUtil.setToStore).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledWith(undefined, undefined, 'success');
    expect(result).toBe(true);
  });

  it('should handle parent nodes with udaIgnoreChildren', async () => {
    const parent = document.createElement('div');
    parent.setAttribute('udaIgnoreChildren', '');
    parent.appendChild(node);

    await recordUserClick(node, event);

    // Should record the parent, not the child
    expect(saveClickData).toHaveBeenCalledWith(parent, 'Mocked Label', expect.objectContaining({ isPersonal: true }));
  });

  it('should show an error notification if saveClickData fails', async () => {
    (saveClickData as jest.Mock).mockResolvedValue(null);
    const result = await recordUserClick(node, event);

    expect(addNotification).toHaveBeenCalledWith(undefined, undefined, 'error');
    expect(UDAErrorLogger.error).toHaveBeenCalled();
    expect(result).toBe(true); // The function still returns true after handling the error
  });

  it('should set isPersonal flag for nodes with long or empty labels', async () => {
    (getClickedInputLabels as jest.Mock).mockReturnValue(''); // Empty label
    await recordUserClick(node, event);
    expect(saveClickData).toHaveBeenCalledWith(node, 'BUTTON', expect.objectContaining({ isPersonal: true }));
  });
});
