import { recordClicks, updateRecordClicks, recordSequence, userClick, deleteRecording, updateRecording, profanityCheck, saveClickData, postRecordSequenceData, recordUserClickData } from './recordService';
import { getSessionKey, getUserId } from './userService';
import { ENDPOINT } from '../config/endpoints';
import { REST } from '.';
import { getFromStore } from '../util';
import { CONFIG } from '../config';

/**
 * Mocks the `userService` module, providing jest.fn() implementations for the `getSessionKey` and `getUserId` functions.
 * This is used for testing purposes to isolate the `recordService` module from the actual implementation of the `userService` module.
 */
jest.mock('./userService', () => ({
  getSessionKey: jest.fn(),
  getUserId: jest.fn(),
}));

jest.mock('.', () => ({
  /**
   * A mock implementation of the REST API client, used for testing purposes.
   */
  REST: {
    apiCal: jest.fn(),
  },
}));

/**
 * Mocks the `getFromStore` function from the `../util` module for testing purposes.
 */
jest.mock('../util', () => ({
  getFromStore: jest.fn(),
}));

/**
 * Tests for the `recordService` module, which handles various recording-related functionality.
 */
describe('recordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test suite for the recordClicks function
describe('recordClicks', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'click123' };
    const mockSessionKey = 'session123';
    (getSessionKey as jest.Mock).mockResolvedValueOnce(mockSessionKey);

    // Call the function being tested
    await recordClicks(mockRequest);

    // Assertions
    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Record,
      method: 'POST',
      body: {
        ...mockRequest,
        sessionid: mockSessionKey,
      },
    });
  });
});

// Test suite for the updateRecordClicks function
describe('updateRecordClicks', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'click123' };
    const mockSessionKey = 'session123';
    (getSessionKey as jest.Mock).mockResolvedValueOnce(mockSessionKey);

    // Call the function being tested
    await updateRecordClicks(mockRequest);

    // Assertions
    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UpdateRecord,
      method: 'POST',
      body: {
        ...mockRequest,
        sessionid: mockSessionKey,
      },
    });
  });
});

// Test suite for the recordSequence function
describe('recordSequence', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'sequence123' };
    const mockUserId = 'user123';
    (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

    // Call the function being tested
    await recordSequence(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.RecordSequence,
      method: 'POST',
      body: {
        ...mockRequest,
        usersessionid: mockUserId,
      },
    });
  });
});

  // Test suite for the userClick function
describe('userClick', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'click123' };
    const mockUserId = 'user123';
    (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

    // Call the function being tested
    await userClick(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: 'PUT',
      body: {
        ...mockRequest,
        usersessionid: mockUserId,
        clickedname: window.location.host,
      },
    });
  });
});

// Test suite for the deleteRecording function
describe('deleteRecording', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'sequence123' };
    const mockUserId = 'user123';
    (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

    // Call the function being tested
    await deleteRecording(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: 'POST',
      body: {
        ...mockRequest,
        usersessionid: mockUserId,
      },
    });
  });
});

// Test suite for the updateRecording function
describe('updateRecording', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockRequest = { id: 'sequence123' };
    const mockUserId = 'user123';
    (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

    // Call the function being tested
    await updateRecording(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: 'POST',
      body: {
        ...mockRequest,
        usersessionid: mockUserId,
      },
    });
  });
});

  // Test suite for the profanityCheck function
describe('profanityCheck', () => {
  // Test case to verify that REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    const mockRequest = 'test text';

    await profanityCheck(mockRequest);

    // Expect REST.apiCal to be called with specific arguments
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: 'POST',
      body: mockRequest,
      headers: expect.any(Headers),
    });
  });
});

// Test suite for the saveClickData function
describe('saveClickData', () => {
  // Test case to check behavior when screen size is not available
  it('should return false if screen size is not available', async () => {
    const mockNode = document.createElement('div');
    const mockText = 'test text';
    const mockMeta = {};

    // Call saveClickData with mock arguments
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // Expect the function to return false
    expect(result).toBe(false);
  });
});


  

  /*The test mocks the getFromStore function to return a predefined set of user click nodes
  * and checks if the recordSequence function is called with the mock request.
  */
  describe('postRecordSequenceData', () => {
    it('should call recordSequence with the correct parameters', async () => {
      const mockRequest = { id: 'sequence123' };
      const mockUserClickNodes = [{ id: 'click1' }, { id: 'click2' }];
      (getFromStore as jest.Mock).mockReturnValueOnce(mockUserClickNodes);

      await postRecordSequenceData(mockRequest);

      expect(getFromStore).toHaveBeenCalled();
      expect(recordSequence).toHaveBeenCalledWith(mockRequest);
    });
  });
});

