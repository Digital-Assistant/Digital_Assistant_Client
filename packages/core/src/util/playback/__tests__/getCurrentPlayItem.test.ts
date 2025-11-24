
// Import the function to be tested
import { getCurrentPlayItem } from '../getCurrentPlayItem';

// Mock dependencies
import { StorageUtil } from '../../storage';
import { CONFIG } from '../../../config';

jest.mock('../../storage', () => ({
  StorageUtil: {
    getFromStore: jest.fn(),
  },
}));

describe('getCurrentPlayItem', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (StorageUtil.getFromStore as jest.Mock).mockClear();
  });

  it('should return a default object if no recording is found in storage', () => {
    // Arrange: Mock storage to return null
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(null);

    // Act: Call the function
    const result = getCurrentPlayItem();

    // Assert: Check that the default object is returned
    expect(StorageUtil.getFromStore).toHaveBeenCalledWith(CONFIG.SELECTED_RECORDING, false);
    expect(result).toEqual({ index: 0, node: null });
  });

  it('should return a default object if the recording has no userclicknodesSet', () => {
    // Arrange: Mock storage to return a recording without the node set
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue({ additionalParams: {} });

    // Act
    const result = getCurrentPlayItem();

    // Assert
    expect(result).toEqual({ index: 0, node: null });
  });

  it('should return the first uncompleted item from the list', () => {
    // Arrange: Mock a recording with a mix of completed and uncompleted nodes
    const mockRecording = {
      userclicknodesSet: [
        { status: 'completed' },
        { status: 'pending', data: 'node2' },
        { status: 'pending', data: 'node3' },
      ],
      additionalParams: { speed: 'normal' },
    };
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(mockRecording);

    // Act
    const result = getCurrentPlayItem();

    // Assert: It should find the item at index 1
    expect(result).toEqual({
      index: 1,
      node: { status: 'pending', data: 'node2' },
      additionalParams: { speed: 'normal' },
    });
  });

  it('should return the very first item if it is not completed', () => {
    // Arrange
    const mockRecording = {
      userclicknodesSet: [
        { status: 'pending', data: 'node1' },
        { status: 'completed', data: 'node2' },
      ],
      additionalParams: { speed: 'fast' },
    };
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(mockRecording);

    // Act
    const result = getCurrentPlayItem();

    // Assert: It should find the item at index 0
    expect(result).toEqual({
      index: 0,
      node: { status: 'pending', data: 'node1' },
      additionalParams: { speed: 'fast' },
    });
  });

  it('should return a default object if all items are completed', () => {
    // Arrange
    const mockRecording = {
      userclicknodesSet: [
        { status: 'completed' },
        { status: 'completed' },
      ],
    };
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(mockRecording);

    // Act
    const result = getCurrentPlayItem();

    // Assert: No uncompleted nodes, so should return default
    expect(result).toEqual({ index: 0, node: null });
  });

  it('should handle an empty userclicknodesSet array', () => {
    // Arrange
    const mockRecording = {
      userclicknodesSet: [],
    };
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(mockRecording);

    // Act
    const result = getCurrentPlayItem();

    // Assert
    expect(result).toEqual({ index: 0, node: null });
  });
});
