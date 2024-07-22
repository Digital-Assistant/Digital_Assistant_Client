import { fetchSearchResults, fetchRecord, fetchSpecialNodes } from './searchService';
import { ENDPOINT } from '../config/endpoints';
import { REST } from './index';
import { getUserId } from './userService';
import { specialNodes } from '../util/specialNodes';


// Mocking the userService module by replacing it with a mocked version
jest.mock('./userService', () => ({
   getUserId: jest.fn()
  }));
  
  // Mocking the index module by replacing it with a mocked version
  jest.mock('./index', () => ({
   REST: {
  // Mocking the apiCal function inside the REST object
  apiCal: jest.fn(),
   // Mocking the processArgs function inside the REST object
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
    // Using jest.spyOn to spy on the getUserId function of the userService module and mock it to return a resolved value of mockUserId
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
    
    // Using jest.spyOn to spy on the REST object of the index module and mock it to return an object with mocked functions
    jest.spyOn(require('./index'), 'REST').mockReturnValue({
   // Mocking the apiCal function inside the REST object
    apiCal: jest.fn(),
   // Mocking the processArgs function inside the REST object and setting it to return the value ENDPOINT.SearchWithPermissions
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
    // Using jest.spyOn to spy on the getUserId function of the userService module and mock it to return a resolved value of mockUserId
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
    
    // Using jest.spyOn to spy on the REST object of the index module and mock it to return an object with mocked functions
    jest.spyOn(require('./index'), 'REST').mockReturnValue({
    // Mocking the apiCal function inside the REST object
    apiCal: jest.fn(),
    // Mocking the processArgs function inside the REST object and setting it to return the value ENDPOINT.Search
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
   // Using jest.spyOn to spy on the getUserId function of the userService module and mock it to return a resolved value of mockUserId
   jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
   
   // Using jest.spyOn to spy on the REST object of the index module and mock it to return an object with mocked functions
   jest.spyOn(require('./index'), 'REST').mockReturnValue({
   // Mocking the apiCal function inside the REST object
   apiCal: jest.fn(),
   // Mocking the processArgs function inside the REST object and setting it to return the value ENDPOINT.SearchWithPermissions
   processArgs: jest.fn().mockReturnValue(ENDPOINT.SearchWithPermissions)
   });
   
   // Using jest.spyOn to spy on the recordUserClickData function of the recordService module and mock it to return a resolved Promise
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

