import { recordClicks, updateRecordClicks, recordSequence, userClick, deleteRecording, updateRecording, profanityCheck, saveClickData, postRecordSequenceData, recordUserClickData } from './recordService';
import { getSessionKey, getUserId } from './userService';
import { ENDPOINT } from '../config/endpoints';
import { REST } from '.';
import { getFromStore } from '../util';
import { CONFIG } from '../config';

jest.mock('./userService', () => ({
  getSessionKey: jest.fn(),
  getUserId: jest.fn(),
}));

jest.mock('.', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

jest.mock('../util', () => ({
  getFromStore: jest.fn(),
}));

describe('recordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordClicks', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'click123' };
      const mockSessionKey = 'session123';
      (getSessionKey as jest.Mock).mockResolvedValueOnce(mockSessionKey);

      await recordClicks(mockRequest);

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

  describe('updateRecordClicks', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'click123' };
      const mockSessionKey = 'session123';
      (getSessionKey as jest.Mock).mockResolvedValueOnce(mockSessionKey);

      await updateRecordClicks(mockRequest);

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

  describe('recordSequence', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'sequence123' };
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await recordSequence(mockRequest);

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

  describe('userClick', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'click123' };
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await userClick(mockRequest);

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

  describe('deleteRecording', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'sequence123' };
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await deleteRecording(mockRequest);

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

  describe('updateRecording', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = { id: 'sequence123' };
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await updateRecording(mockRequest);

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

  describe('profanityCheck', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockRequest = 'test text';

      await profanityCheck(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.ProfanityCheck,
        method: 'POST',
        body: mockRequest,
        headers: expect.any(Headers),
      });
    });
  });

  describe('saveClickData', () => {
    it('should return false if screen size is not available', async () => {
      const mockNode = document.createElement('div');
      const mockText = 'test text';
      const mockMeta = {};

      const result = await saveClickData(mockNode, mockText, mockMeta);

      expect(result).toBe(false);
    });
  });

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

