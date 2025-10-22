import {
  recordClicks,
  updateRecordClicks,
  updateSequnceIndex,
  recordSequence,
  userClick,
  deleteRecording,
  updateRecording,
  fetchStatuses,
  profanityCheck,
} from '../RecordService';
import { apiClient } from '../apiClient';
import { getSessionKey, getUserId } from '../userService';
import { ENDPOINT } from '../../config/endpoints';
import { processUrlArgs } from '../../util/urlProcessing';

jest.mock('../apiClient');
jest.mock('../userService');
jest.mock('../../util/urlProcessing');

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPut = apiClient.put as jest.Mock;

describe('RecordService (core)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordClicks', () => {
    it('posts payload with sessionid and returns data', async () => {
      (getSessionKey as jest.Mock).mockResolvedValue('sess-123');
      mockPost.mockResolvedValue({ data: { ok: true } });

      const payload = { foo: 'bar' } as any;
      const result = await recordClicks(payload);

      expect(getSessionKey).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.Record, { foo: 'bar', sessionid: 'sess-123' });
      expect(result).toEqual({ ok: true });
    });
  });

  describe('updateRecordClicks', () => {
    it('posts to UpdateRecord and returns data', async () => {
      mockPost.mockResolvedValue({ data: { updated: 1 } });
      const req = { id: 5 } as any;
      const res = await updateRecordClicks(req);
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.UpdateRecord, req);
      expect(res).toEqual({ updated: 1 });
    });
  });

  describe('updateSequnceIndex', () => {
    it('posts to updateSequenceIndex/id and returns data', async () => {
      mockPost.mockResolvedValue({ data: { reindexed: true } });
      const res = await updateSequnceIndex(42);
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.updateSequenceIndex + '42');
      expect(res).toEqual({ reindexed: true });
    });
  });

  describe('recordSequence', () => {
    it('throws when request is missing', async () => {
      // @ts-expect-error intentionally missing request
      await expect(recordSequence()).rejects.toThrow('Request object is required');
    });

    it('throws when user id is not available', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      await expect(recordSequence({ a: 1 })).rejects.toThrow('User session ID could not be retrieved');
    });

    it('posts request with usersessionid and returns data', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user-9');
      mockPost.mockResolvedValue({ data: { saved: true } });
      const res = await recordSequence({ k: 'v' });
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.RecordSequence, { k: 'v', usersessionid: 'user-9' });
      expect(res).toEqual({ saved: true });
    });
  });

  describe('userClick', () => {
    it('throws when request is missing', async () => {
      // @ts-expect-error
      await expect(userClick()).rejects.toThrow('Request object is required');
    });

    it('puts request with usersessionid and returns data', async () => {
      (getUserId as jest.Mock).mockResolvedValue('u-7');
      mockPut.mockResolvedValue({ data: { ok: 1 } });
      const res = await userClick({ clickedname: 'abc' });
      expect(mockPut).toHaveBeenCalledWith(ENDPOINT.UserClick, { clickedname: 'abc', usersessionid: 'u-7' });
      expect(res).toEqual({ ok: 1 });
    });
  });

  describe('deleteRecording', () => {
    it('throws when request is missing', async () => {
      // @ts-expect-error
      await expect(deleteRecording()).rejects.toThrow('Request object is required');
    });

    it('posts to DeleteSequence with usersessionid', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user-x');
      mockPost.mockResolvedValue({ data: { deleted: true } });
      const req = { id: 1 };
      const res = await deleteRecording(req as any);
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.DeleteSequence, { id: 1, usersessionid: 'user-x' });
      expect(res).toEqual({ deleted: true });
    });
  });

  describe('updateRecording', () => {
    it('throws when request is missing', async () => {
      // @ts-expect-error
      await expect(updateRecording()).rejects.toThrow('Request object is required');
    });

    it('posts to updateRecordSequence with usersessionid', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user-y');
      mockPost.mockResolvedValue({ data: { updated: true } });
      const req = { id: 3 };
      const res = await updateRecording(req as any);
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.updateRecordSequence, { id: 3, usersessionid: 'user-y' });
      expect(res).toEqual({ updated: true });
    });
  });

  describe('fetchStatuses', () => {
    beforeEach(() => {
      (processUrlArgs as jest.Mock).mockImplementation((endpoint: string, req: any) => `${endpoint}:${req.category}`);
    });

    it('throws when category missing', async () => {
      // @ts-expect-error
      await expect(fetchStatuses({})).rejects.toThrow('Category is required');
    });

    it('gets from processed URL and returns data', async () => {
      mockGet.mockResolvedValue({ data: [{ id: 1 }] });
      const res = await fetchStatuses({ category: 'sequenceList' });
      expect(processUrlArgs).toHaveBeenCalledWith(ENDPOINT.statuses, { category: 'sequenceList' });
      expect(mockGet).toHaveBeenCalledWith(`${ENDPOINT.statuses}:sequenceList`);
      expect(res).toEqual([{ id: 1 }]);
    });
  });

  describe('profanityCheck', () => {
    it('throws when request missing', async () => {
      // @ts-expect-error
      await expect(profanityCheck()).rejects.toThrow('Request object is required');
    });

    it('posts request body to endpoint and returns data', async () => {
      mockPost.mockResolvedValue({ data: { clean: true } });
      const body = { text: 'hello' };
      const res = await profanityCheck(body as any);
      expect(mockPost).toHaveBeenCalledWith(ENDPOINT.ProfanityCheck, body);
      expect(res).toEqual({ clean: true });
    });
  });
});
