import { fetchSearchResults, fetchRecord, fetchSpecialNodes } from './searchService';
import { ENDPOINT } from '../config/endpoints';
import { REST } from './index';
import { getUserId } from './userService';
import { specialNodes } from '../util/specialNodes';

jest.mock('./userService', () => ({
  getUserId: jest.fn()
}));

jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
    processArgs: jest.fn()
  }
}));

describe('searchService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSearchResults', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = '123456789';
      const mockRequest = {
        keyword: 'test',
        page: 1,
        domain: 'example.com',
        additionalParams: { foo: 'bar' }
      };

      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
      jest.spyOn(require('./index'), 'REST').mockReturnValue({
        apiCal: jest.fn(),
        processArgs: jest.fn().mockReturnValue(ENDPOINT.SearchWithPermissions)
      });

      await fetchSearchResults(mockRequest);

      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.SearchWithPermissions, {
        ...mockRequest,
        userSessionId: mockUserId
      });
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.SearchWithPermissions,
        method: 'GET'
      });
    });

    it('should call REST.apiCal with the correct parameters without additionalParams', async () => {
      const mockUserId = '123456789';
      const mockRequest = {
        keyword: 'test',
        page: 1,
        domain: 'example.com'
      };

      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
      jest.spyOn(require('./index'), 'REST').mockReturnValue({
        apiCal: jest.fn(),
        processArgs: jest.fn().mockReturnValue(ENDPOINT.Search)
      });

      await fetchSearchResults(mockRequest);

      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
        ...mockRequest,
        userSessionId: mockUserId
      });
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.Search,
        method: 'GET'
      });
    });

    it('should call recordUserClickData with the correct parameters', async () => {
      const mockUserId = '123456789';
      const mockRequest = {
        keyword: 'test',
        page: 1,
        domain: 'example.com',
        additionalParams: { foo: 'bar' }
      };

      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
      jest.spyOn(require('./index'), 'REST').mockReturnValue({
        apiCal: jest.fn(),
        processArgs: jest.fn().mockReturnValue(ENDPOINT.SearchWithPermissions)
      });
      jest.spyOn(require('./recordService'), 'recordUserClickData').mockReturnValue(Promise.resolve());

      await fetchSearchResults(mockRequest);

      expect(recordUserClickData).toHaveBeenCalledWith('search', mockRequest.keyword);
    });
  });

  describe('fetchRecord', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = '123456789';
      const mockRequest = {
        id: 'abc123',
        domain: 'example.com',
        additionalParams: { foo: 'bar' }
      };

      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

      await fetchRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchRecord}/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`,
        method: 'GET'
      });
    });

    it('should call REST.apiCal with the correct parameters without additionalParams', async () => {
      const mockUserId = '123456789';
      const mockRequest = {
        id: 'abc123',
        domain: 'example.com'
      };

      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

      await fetchRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
        method: 'GET'
      });
    });
  });

  describe('fetchSpecialNodes', () => {
    it('should return the specialNodes object', async () => {
      const result = await fetchSpecialNodes();

      expect(result).toEqual(specialNodes);
    });
  });
});
