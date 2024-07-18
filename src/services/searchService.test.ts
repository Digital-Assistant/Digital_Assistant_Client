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

/**
 * Clears all mocks after each test suite for the `searchService` module.
 */
describe('searchService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

  // Test suite for the fetchSearchResults function
describe('fetchSearchResults', () => {
  // Test case to verify REST.apiCal is called with correct parameters including additionalParams
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockUserId = '123456789';
    const mockRequest = {
      keyword: 'test',
      page: 1,
      domain: 'example.com',
      additionalParams: { foo: 'bar' }
    };

    // Mock dependencies
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
    jest.spyOn(require('./index'), 'REST').mockReturnValue({
      apiCal: jest.fn(),
      processArgs: jest.fn().mockReturnValue(ENDPOINT.SearchWithPermissions)
    });

    // Call the function being tested
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.SearchWithPermissions, {
      ...mockRequest,
      userSessionId: mockUserId
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.SearchWithPermissions,
      method: 'GET'
    });
  });

  // Test case to verify REST.apiCal is called with correct parameters without additionalParams
  it('should call REST.apiCal with the correct parameters without additionalParams', async () => {
    // Mock data setup
    const mockUserId = '123456789';
    const mockRequest = {
      keyword: 'test',
      page: 1,
      domain: 'example.com'
    };

    // Mock dependencies
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
    jest.spyOn(require('./index'), 'REST').mockReturnValue({
      apiCal: jest.fn(),
      processArgs: jest.fn().mockReturnValue(ENDPOINT.Search)
    });

    // Call the function being tested
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...mockRequest,
      userSessionId: mockUserId
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Search,
      method: 'GET'
    });
  });
});

// Test suite for fetchSearchResults (continued)
describe('fetchSearchResults', () => {
  // Test case to verify recordUserClickData is called with correct parameters
  it('should call recordUserClickData with the correct parameters', async () => {
    // Mock data setup
    const mockUserId = '123456789';
    const mockRequest = {
      keyword: 'test',
      page: 1,
      domain: 'example.com',
      additionalParams: { foo: 'bar' }
    };

    // Mock dependencies
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
    jest.spyOn(require('./index'), 'REST').mockReturnValue({
      apiCal: jest.fn(),
      processArgs: jest.fn().mockReturnValue(ENDPOINT.SearchWithPermissions)
    });
    jest.spyOn(require('./recordService'), 'recordUserClickData').mockReturnValue(Promise.resolve());

    // Call the function being tested
    await fetchSearchResults(mockRequest);

    // Assertion
    expect(recordUserClickData).toHaveBeenCalledWith('search', mockRequest.keyword);
  });
});

// Test suite for fetchRecord function
describe('fetchRecord', () => {
  // Test case to verify REST.apiCal is called with correct parameters
  it('should call REST.apiCal with the correct parameters', async () => {
    // Mock data setup
    const mockUserId = '123456789';
    const mockRequest = {
      id: 'abc123',
      domain: 'example.com',
      additionalParams: { foo: 'bar' }
    };

    // Mock dependency
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    // Call the function being tested
    await fetchRecord(mockRequest);

    // Assertion
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`,
      method: 'GET'
    });
  });
});

// Test suite for fetchRecord (continued)
describe('fetchRecord', () => {
  // Test case to verify REST.apiCal is called with correct parameters without additionalParams
  it('should call REST.apiCal with the correct parameters without additionalParams', async () => {
    // Mock data setup
    const mockUserId = '123456789';
    const mockRequest = {
      id: 'abc123',
      domain: 'example.com'
    };

    // Mock dependency
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    // Call the function being tested
    await fetchRecord(mockRequest);

    // Assertion
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
      method: 'GET'
    });
  });
});

// Test suite for fetchSpecialNodes function
describe('fetchSpecialNodes', () => {
  // Test case to verify fetchSpecialNodes returns the specialNodes object
  it('should return the specialNodes object', async () => {
    // Call the function being tested
    const result = await fetchSpecialNodes();

    // Assertion
    expect(result).toEqual(specialNodes);
  });
});

