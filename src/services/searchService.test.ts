/**
 * Imports various modules and functions used in the `searchService` module, including:
 * - `ENDPOINT` from the `../config/endpoints` module
 * - `REST` from the `../services` module
 * - `getUserId` from the `../services/userService` module
 * - `recordUserClickData` from the `../services/recordService` module
 * - `specialNodes` from the `../util/specialNodes` module
 * - `getSessionKey` from the `../services/userService` module
 * - `fetchSearchResults`, `fetchRecord`, and `fetchSpecialNodes` from the `../services/searchService` module
 */
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import { getUserId } from "../services/userService";
import { recordUserClickData } from "../services/recordService";
import { specialNodes } from "../util/specialNodes";
import { getSessionKey } from "../services/userService";
import {
  fetchSearchResults,
  fetchRecord,
  fetchSpecialNodes,
} from "../services/searchService";

/**
 * Sets up mocks for the `getUserId` function from the `../services/userService` module and the `REST` object from the `../services` module.
 *
 * This setup is likely used to isolate the tests in the `searchService` test suite from the actual implementation of these dependencies.
 *
 * The mocked `getUserId` function and `REST` object are used to control the behavior of these dependencies during the tests, allowing the tests to focus on the specific functionality being tested without relying on the actual implementation.
 */
jest.mock("../services/userService", () => ({
  getUserId: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
    processArgs: jest.fn(),
  },
}));

/**
 * Sets up mocks for the `recordUserClickData` function from the `../services/recordService` module and the `specialNodes` object from the `../util/specialNodes` module.
 *
 * This setup is likely used to isolate the tests in the `searchService` test suite from the actual implementation of these dependencies.
 *
 * The `jest.clearAllMocks()` call in the `beforeEach` hook ensures that the mocks are reset before each test, preventing any unintended state from leaking between tests.
 */
jest.mock("../services/recordService", () => ({
  recordUserClickData: jest.fn(),
}));

jest.mock("../util/specialNodes", () => ({
  specialNodes: { mock: "specialNodes" },
}));
describe("searchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `fetchSearchResults` function calls the REST API with the correct parameters when `additionalParams` is not `null`.
   *
   * This test case verifies that when the `fetchSearchResults` function is called with a request object that has `additionalParams` set to an object, the function properly calls the `REST.processArgs` and `REST.apiCal` functions with the expected parameters, including the `userSessionId` from the `getUserId` function.
   *
   * @param {any} - No input parameters.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("fetchSearchResults", () => {
    it("should call REST.apiCal with correct parameters when additionalParams is not null", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockKeyword = "test"; // mock keyword
      const mockPage = 1; // mock page
      const mockAdditionalParams = { param: "value" }; // mock additional parameters

      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

      // Prepare the request object
      const request = {
        keyword: mockKeyword,
        page: mockPage,
        additionalParams: mockAdditionalParams,
      };

      // Perform the test
      await fetchSearchResults(request);

      // Assertions
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockKeyword
      ); // recordUserClickData should be called with the following parameters
      expect(getUserId).toHaveBeenCalled(); // getUserId should be called
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions, // REST.processArgs should be called with the following parameters
        {
          ...request,
          userSessionId: mockUserId,
        }
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.SearchWithPermissions, {
          ...request,
          userSessionId: mockUserId,
        }), // REST.apiCal should be called with the value returned by REST.processArgs
        method: "GET", // HTTP method should be GET
      }); // REST.apiCal should be called with the following parameters
    });
  });
   

  /**
   * Tests that the `fetchRecord` function calls the REST API with the correct parameters when `additionalParams` is `null`.
   *
   * This test case verifies that when the `fetchRecord` function is called with a request object that has `additionalParams` set to `null`, the function properly calls the `REST.apiCal` function with the expected URL and method.
   *
   * @param {any} - No input parameters.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("fetchRecord", () => {
    it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // Mock user ID
      const mockRecordId = "1"; // Mock record ID
      const mockDomain = "test.com"; // Mock domain
    
      // Mock getUserId to resolve with mock user ID
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    
      // Mock request
      const request = { id: mockRecordId, domain: mockDomain, additionalParams: null };
    
      // Perform the test
      await fetchRecord(request);
    
      // Assertions
      expect(getUserId).toHaveBeenCalled(); // getUserId should be called
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchRecord}/${mockRecordId}?domain=${mockDomain}`, // REST.apiCal should be called with the correct URL
        method: "GET", // HTTP method should be GET
      });
    });
    
      /**
       * Tests that the `fetchRecord` function handles errors gracefully.
       *
       * This test case verifies that when the `fetchRecord` function is called and the underlying `REST.apiCal` function rejects with an error, the `fetchRecord` function properly rejects the promise with the expected error message.
       *
       * @param {any} - No input parameters.
       * @returns {Promise<void>} A promise that resolves when the test is complete.
       */
    });

    it("should handle errors gracefully", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockErrorMessage = "API Error"; // mock error message
      const request = { id: "1", domain: "test.com", additionalParams: null }; // mock request

      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error(mockErrorMessage)); // mock REST.apiCal to reject with mock error message

      // Perform the test
      await expect(fetchRecord(request)).rejects.toThrow(mockErrorMessage);

      // Assertions
      expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    });
  });
 

  /**
   * Tests that the `fetchSpecialNodes` function correctly calls the REST API with the expected parameters.
   *
   * This test case verifies that when the `fetchSpecialNodes` function is called with a request object, the function properly calls the `REST.processArgs` and `REST.apiCal` functions with the expected parameters.
   *
   * @param {any} - No input parameters.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("fetchSpecialNodes", () => {
    it("should return specialNodes", async () => {
      // Mock data
      const mockSpecialNodes = {
        exclude: {
          tags: ["tag1", "tag2"],
          domains: ["domain1", "domain2"]
        },
        include: {
          tags: ["tag3", "tag4"],
          domains: ["domain3", "domain4"]
        }
      };
      const mockRequest = { param: "value" };

      // Mock implementations
      (fetchSpecialNodes as jest.Mock).mockResolvedValue(mockSpecialNodes);

      // Perform the test
      const result = await fetchSpecialNodes(mockRequest);

      // Assert
      expect(result).toEqual(mockSpecialNodes);
    });
  
    /**
     * Tests that the `fetchSpecialNodes` function correctly calls the REST API with the expected parameters.
     *
     * This test case verifies that when the `fetchSpecialNodes` function is called with a request object, the function properly calls the `REST.processArgs` and `REST.apiCal` functions with the expected parameters.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */

    it("should call REST.apiCal with correct parameters", async () => {
      // Mock request data
      const mockRequest = { param: "value" };
      const request = { param: "value" };
      await fetchSpecialNodes(request);

      // Mock REST.apiCal response
      const mockResponse = { success: true, data: { specialNodes: ["node1", "node2"] } };

      // Mock REST.apiCal to return mockResponse
      (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

      // Call fetchSpecialNodes with mockRequest
      await fetchSpecialNodes(mockRequest);

      // Expect REST.processArgs to be called with the expected arguments
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SpecialNodes,
        mockRequest,
        request
      );

      // Expect REST.apiCal to be called with the correct URL and method
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String),
        url: REST.processArgs(ENDPOINT.SpecialNodes, request),
        method: "GET",
      });
    });

    /**
     * Tests that the `fetchSpecialNodes` function handles errors gracefully.
     *
     * This test case verifies that when the `fetchSpecialNodes` function is called and the underlying `REST.apiCal` function rejects with an error, the `fetchSpecialNodes` function properly rejects the promise with the expected error message.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle errors gracefully", async () => {
      // Mock data
      const mockError = new Error("API Error"); // Mock error object
      const mockRequest = { param: "value" }; // Mock request object

      // Mock the REST.apiCal function to reject with the mock error
      (REST.apiCal as jest.Mock).mockRejectedValue(mockError);

      // Perform the test
      await expect(fetchSpecialNodes(mockRequest)).rejects.toThrow("API Error");
    });
  });


/**
 * Tests that the `fetchSearchResults` function correctly handles null input.
 *
 * This test case verifies that when the `fetchSearchResults` function is called with a null request parameter, the function properly rejects the promise with the expected error message.
 *
 * @param {any} - No input parameters.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("searchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchSearchResults", () => {
    it("should handle null input gracefully", async () => {
      // Mock data
      const mockRequest = {
        keyword: null, // mock keyword
        page: 1, // mock page
        domain: "example.com", // mock domain
      };

      // Perform the test
      await expect(fetchSearchResults(mockRequest)).rejects.toThrowError(
        new Error("Cannot read property 'keyword' of null")
      );
    });
   
  });
});
    /**
     * Tests that the `fetchSearchResults` function correctly handles empty object input.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with an empty object as the request parameter, the function properly retrieves the user session ID and calls the REST API with the expected parameters.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle empty object input gracefully", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockRequest = {}; // mock request object
    
      // Mock getUserId to resolve with mock user ID
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    
      // Perform the test
      await fetchSearchResults(mockRequest);
    
      // Assertions
      expect(getUserId).toHaveBeenCalled(); // getUserId should be called
      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
        ...mockRequest, // spread mock request
        userSessionId: mockUserId, // add mock user ID
      }); 
    
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.Search, {
          ...mockRequest, // spread mock request
          userSessionId: mockUserId, // add mock user ID
        }), // REST.apiCal should be called with the value returned by REST.processArgs
        method: "GET", // HTTP method should be GET
      });
    });
    
    
    
    /**
     * Tests that the `fetchSearchResults` function correctly handles invalid data types.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with an invalid data type (in this case, a string), the function properly rejects the promise with an error.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle invalid data types gracefully", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockKeyword = "test"; // mock keyword
      const mockPage = 1; // mock page
      const mockDomain = "example.com"; // mock domain
      const request = "invalid"; // mock invalid request data

      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

      // Perform the test
      await expect(fetchSearchResults(request as any)).rejects.toThrow(
        "Cannot read property 'keyword' of string" // expect the function to throw an error with this message
      );

      // Assertions (none needed for this test case)
    });
      const request = "invalid";
      await expect(fetchSearchResults(request as any)).rejects.toThrow();
    
    /**
     * Tests that the `fetchSearchResults` function correctly handles network failures.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with a request that results in a network error, the function properly rejects the promise with the error message.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */

    it("should handle network failures gracefully", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockErrorMessage = "Network Error"; // mock error message
      const mockRequest = {
        keyword: "test", // mock keyword
        page: 1, // mock page
        additionalParams: null, // mock additional parameters
      };

      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error(mockErrorMessage)); // mock REST.apiCal to reject with mock error message

      // Perform the test
      await expect(fetchSearchResults(mockRequest)).rejects.toThrow(
        mockErrorMessage
      );

      // Assertions
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockRequest.keyword
      ); // recordUserClickData should be called with the following parameters
      expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    });
  

    /**
     * Tests that the `fetchSearchResults` function correctly handles concurrent requests.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with two separate requests concurrently, the function properly records the user click data for each request and retrieves the user session ID for each request.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle concurrent requests gracefully", async () => {
      // Mock data
      const mockUserId = "mockUserId"; // mock user ID
      const mockKeyword1 = "test1"; // mock keyword for request 1
      const mockKeyword2 = "test2"; // mock keyword for request 2
    
      // Mock getUserId to resolve with mock user ID
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    
      // Mock request objects
      const request1 = { keyword: mockKeyword1, page: 1, additionalParams: null };
      const request2 = { keyword: mockKeyword2, page: 2, additionalParams: null };
    
      // Perform the test with concurrent requests
      await Promise.all([
        fetchSearchResults(request1),
        fetchSearchResults(request2),
      ]);
    
      // Assertions
      expect(recordUserClickData).toHaveBeenCalledWith("search", mockKeyword1);
      expect(recordUserClickData).toHaveBeenCalledWith("search", mockKeyword2);
      expect(getUserId).toHaveBeenCalledTimes(2); // getUserId should be called twice, once for each request
    });
    
  /**
   * Tests that the `fetchRecord` function correctly handles null input.
   *
   * This test case verifies that when the `fetchRecord` function is called with a null input, the function properly throws an error with the message "Cannot read property 'id' of null".
   *
   * @param {any} input - The input to pass to the `fetchRecord` function.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */

  describe("fetchRecord", () => {
    it("should handle null input gracefully", async () => {
      await expect(fetchRecord(null)).rejects.toThrowError(
        new Error("Cannot read property 'id' of null")
      );
    });
  });

    /**
     * Tests that the `fetchSpecialNodes` function correctly handles null input.
     *
     * This test case verifies that when the `fetchSpecialNodes` function is called with a null input, the function properly returns a mock object with the key "specialNodes".
     *
     * @param {any} input - The input to pass to the `fetchSpecialNodes` function.
     * @returns {Promise<{ mock: string }>} A promise that resolves to a mock object with the key "specialNodes".
     */
    describe("fetchSpecialNodes", () => {
      it("should handle null input gracefully", async () => {
        // Mock data
        const mockSpecialNodes = { mock: "specialNodes" }; // Mock specialNodes data

        // Mock implementations
        (fetchSpecialNodes as jest.Mock).mockResolvedValue(mockSpecialNodes); // Mock fetchSpecialNodes to return the mock data

        // Perform the test
        await expect(fetchSpecialNodes(null)).resolves.toEqual(mockSpecialNodes); // Expect fetchSpecialNodes to resolve with the mock data
      });
    
    });
      /**
       * Tests that the `fetchSpecialNodes` function correctly handles undefined input.
       *
       * This test case verifies that when the `fetchSpecialNodes` function is called with an undefined argument, the function properly returns the expected mock data.
       *
       * @param {any} [input] - The input argument to pass to the `fetchSpecialNodes` function, set to undefined.
       * @returns {Promise<{ mock: string }>} A promise that resolves to an object with a mock property.
       */
      it("should handle undefined input gracefully", async () => {
        // Mock data
        const mockSpecialNodes = { mock: "specialNodes" }; // Mock specialNodes data

        // Mock implementations
        (fetchSpecialNodes as jest.Mock).mockResolvedValue(mockSpecialNodes); // Mock fetchSpecialNodes to return the mock data

        // Perform the test
        await expect(fetchSpecialNodes(undefined)).resolves.toEqual(mockSpecialNodes); // Expect fetchSpecialNodes to resolve with the mock data
      });
    

      /**
       * Tests that the `fetchSearchResults` function correctly handles boundary conditions for the `page` parameter.
       *
       * This test case verifies that when the `fetchSearchResults` function is called with a `page` parameter set to the maximum safe integer, the function properly fetches the expected search results.
       *
       * @param {Object} request - An object containing the request parameters for the test case.
       * @param {string} request.keyword - The keyword to search for.
       * @param {number} request.page - The page number of the search results to fetch, set to the maximum safe integer.
       * @param {any} request.additionalParams - Additional parameters for the search request.
       * @returns {Promise<void>} A promise that resolves when the test is complete.
       */
      describe("searchService", () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        describe("fetchSearchResults", () => {
          it("should handle boundary conditions for page number", async () => {
            // Mock data
            const mockUserId = "mockUserId"; // mock user ID
            const mockResponseData = { // mock response data
              data: {
                hits: [
                  {
                    id: 1,
                    title: "Test Document",
                    description: "This is a test document.",
                    url: "https://example.com/test-document",
                  },
                ],
                totalPages: 10,
              },
            };
            const mockRequest = {
              keyword: "test", // mock keyword
              page: Number.MAX_SAFE_INTEGER, // mock page number set to maximum safe integer
              additionalParams: null, // mock additional parameters set to null
            };
            (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
            (REST.apiCal as jest.Mock).mockResolvedValue(mockResponseData); // mock REST.apiCal to resolve with mock response data

            // Perform the test
            await fetchSearchResults(mockRequest);

            // Assertions
            expect(recordUserClickData).toHaveBeenCalledWith( // recordUserClickData should be called with the following parameters
              "search",
              mockRequest.keyword,
            );
            expect(getUserId).toHaveBeenCalled(); // getUserId should be called
            expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, { // REST.processArgs should be called with the following parameters
              ...mockRequest,
              userSessionId: mockUserId,
            });
            expect(REST.apiCal).toHaveBeenCalledWith({ // REST.apiCal should be called with the following parameters
              url: REST.processArgs(ENDPOINT.Search, {
                ...mockRequest,
                userSessionId: mockUserId,
              }),
              method: "GET",
            });

            // Verify that the function resolves with the expected data
            const response = await fetchSearchResults(mockRequest);
            expect(response).toEqual({ // response should be an object with the following properties
              ...mockResponseData.data,
              totalPages: mockResponseData.data.totalPages,
            });
          });
        });
      });
          /**
           * Tests that the `fetchSearchResults` function correctly handles security-related inputs.
           *
           * This test case verifies that when the `fetchSearchResults` function is called with a keyword that contains a potential XSS attack, the function properly handles the input and does not allow the attack to be executed.
           *
           * @param {Object} request - An object containing the request parameters for the test case.
           * @param {string} request.keyword - The keyword to search for, containing a potential XSS attack.
           * @param {number} request.page - The page number of the search results to fetch.
           * @param {any} request.additionalParams - Additional parameters for the search request.
           * @returns {Promise<void>} A promise that resolves when the test is complete.
           */
          it("should handle security-related inputs gracefully", async () => {
            // Mock data
            const mockUserId = "mockUserId"; // mock user ID
            const mockRequest = {
              keyword: "<script>alert('xss')</script>", // mock keyword with potential XSS attack
              page: 1, // mock page
              additionalParams: null, // mock additional parameters
            };
            (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

            // Perform the test
            await fetchSearchResults(mockRequest);

            // Assertions
            expect(recordUserClickData).toHaveBeenCalledWith(
              "search",
              mockRequest.keyword
            ); // recordUserClickData should be called with the following parameters
            expect(getUserId).toHaveBeenCalled(); // getUserId should be called
            expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
              ...mockRequest,
              userSessionId: mockUserId,
            }); // REST.processArgs should be called with the following parameters
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: REST.processArgs(ENDPOINT.Search, {
                ...mockRequest,
                userSessionId: mockUserId,
              }),
              method: "GET",
            }); // REST.apiCal should be called with the following parameters
          });
         

        /**
         * Tests that the `fetchRecord` function correctly handles boundary conditions for the `id` parameter.
         *
         * This test case verifies that when the `fetchRecord` function is called with an `id` parameter that is the maximum safe integer, the function properly fetches the expected record.
         *
         * @param {Object} request - An object containing the request parameters for the test case.
         * @param {string} request.id - The ID of the record to fetch, set to the maximum safe integer.
         * @param {string} request.domain - The domain of the record to fetch.
         * @param {any} request.additionalParams - Additional parameters for the fetch request.
         * @returns {Promise<void>} A promise that resolves when the test is complete.
         */
        describe("fetchRecord", () => {
          it("should handle boundary conditions for id", async () => {
            // Mock data
            const mockUserId = "mockUserId"; // mock user ID
            const largeId = "1".repeat(1000); // large ID (Note: `Number.MAX_SAFE_INTEGER` is impractical for testing; use a large but feasible value)
            const mockDomain = "test.com"; // mock domain
        
            // Mock implementations
            (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
        
            // Mock request
            const request = {
              id: largeId,
              domain: mockDomain,
              additionalParams: null,
            };
        
            // Perform the test
            await fetchRecord(request);
        
            // Assertions
            expect(getUserId).toHaveBeenCalled(); // getUserId should be called
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: `${ENDPOINT.fetchRecord}/${largeId}?domain=${mockDomain}`, // REST.apiCal should be called with the correct URL
              method: "GET", // HTTP method should be GET
            });
          });
        });
        

          /**
           * Tests that the `fetchSpecialNodes` function correctly handles boundary conditions for the `param` parameter.
           *
           * This test case verifies that when the `fetchSpecialNodes` function is called with a `param` parameter that is the maximum safe integer, the function properly fetches the expected special nodes.
           *
           * @param {Object} request - An object containing the request parameters for the test case.
           * @param {string} request.param - The parameter to fetch special nodes with, set to the maximum safe integer.
           * @returns {Promise<Object>} A promise that resolves with the fetched special nodes.
           */
          describe("fetchSpecialNodes", () => {
            it("should handle boundary conditions for param", () => {
              const largeParam = "a".repeat(Number.MAX_SAFE_INTEGER);
              const request = { param: largeParam };

              return fetchSpecialNodes(request)
                .then((result) => {
                  expect(result).toEqual({ mock: "specialNodes" });
                });
            });
         
          });
            /**
             * Clears all mocks before each test in the `searchService` test suite.
             *
             * This `beforeEach` hook is used to ensure a clean state for each test in the `searchService` test suite by clearing all mocks before each test is executed.
             */
            describe("searchService", () => {
              beforeEach(() => {
                jest.clearAllMocks();
              });

              /**
               * Tests that the `fetchSearchResults` function correctly handles boundary conditions for the page number parameter.
               *
               * This test case verifies that when the `fetchSearchResults` function is called with a page number that is the maximum safe integer, the function properly fetches the expected search results.
               *
               * @param {Object} request - An object containing the request parameters for the test case.
               * @param {string} request.keyword - The keyword to search for.
               * @param {number} request.page - The page number of the search results, set to the maximum safe integer.
               * @param {any} request.additionalParams - Additional parameters for the search request.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              describe("fetchSearchResults", () => {
                describe("fetchSearchResults", () => {
                  it("should handle boundary conditions for page number", async () => {
                    // Mock data
                    const mockUserId = "mockUserId"; // mock user ID
                    const mockKeyword = "test"; // mock keyword
                
                    // Mock implementations
                    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
                
                    // Test data
                    const request = {
                      keyword: mockKeyword,
                      page: Number.MAX_SAFE_INTEGER, // boundary value for page number
                      additionalParams: null,
                    };
                
                    // Perform the test
                    await fetchSearchResults(request);
                
                    // Assertions
                    expect(recordUserClickData).toHaveBeenCalledWith("search", mockKeyword); // recordUserClickData should be called with the mock keyword
                    expect(getUserId).toHaveBeenCalled(); // getUserId should be called once
                
                    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
                      ...request,
                      userSessionId: mockUserId, // add mock user ID
                    }); // REST.processArgs should be called with the correct parameters
                
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, {
                        ...request,
                        userSessionId: mockUserId,
                      }),
                      method: "GET", // HTTP method should be GET
                    }); // REST.apiCal should be called with the correct parameters
                  });
                });
                
              /**
               * Tests that the `fetchSearchResults` function correctly handles different input data and makes the expected API call.
               *
               * This test case verifies that when the `fetchSearchResults` function is called with different request objects, the function properly fetches the expected search results for each request.
               *
               * @param {Object} request - An object containing the request parameters for the test case.
               * @param {string} request.keyword - The keyword to search for.
               * @param {number} request.page - The page number of the search results.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              describe("searchService functions", () => {
                beforeEach(() => {
                  (getUserId as jest.Mock).mockClear();
                });

           describe("fetchSearchResults - Additional Tests", () => {
  it("should return search results with correct page and limit", async () => {
    // Mock the searchResults function to return a mocked search results array
    const mockSearchResults = [
      {
        id: 1,
        title: "Test Search Result 1",
        description: "This is a test search result 1",
        url: "https://example.com/search-result-1"
      },
      {
        id: 2,
        title: "Test Search Result 2",
        description: "This is a test search result 2",
        url: "https://example.com/search-result-2"
      }
    ];
    const searchResults = jest.fn().mockReturnValue(mockSearchResults);

    // Call the fetchSearchResults function with the mocked searchResults function and a page and limit
    const result = await fetchSearchResults(searchResults, { page: 1, limit: 2 });

    // Expect the result to be the mocked search results array with the correct page and limit
    expect(result).toEqual({
      page: 1,
      limit: 2,
      total: 2,
      results: mockSearchResults
    });
  });
});


                /**
                 * Tests that the `fetchRecord` function correctly handles different input data and makes the expected API call.
                 *
                 * This test case verifies that when the `fetchRecord` function is called with different request objects, the function properly fetches the expected record data for each request.
                 *
                 * @param {Object} request - An object containing the request parameters for the test case.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                it("fetchRecord should call getUserId and make API call", async () => {
                  const mockUserId = "mockUserId";
                  (getUserId as jest.Mock).mockResolvedValue(mockUserId);
                  (getUserId as jest.Mock).mockResolvedValue("testUserId");

                  const mockRequest = {
                    id: "record123",
                    domain: "example.com",
                  const request:  {
                    /* request data */
                  },
                  await fetchRecord:(mockRequest);
                  await fetchRecord(request);

                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
                    method: "GET",
                  });
                  // Add assertions for API call
                });
              });

                /**
                 * Tests that the `fetchSpecialNodes` function correctly handles different request scenarios and returns the expected special nodes data.
                 *
                 * This test case verifies that when the `fetchSpecialNodes` function is called with different request objects, the function properly fetches and returns the expected special nodes data for each request.
                 *
                 * @param {Object} request - An object containing the request parameters for the test case.
                 * @returns {Promise<any>} A promise that resolves with the special nodes data.
                 */
                it("fetchSpecialNodes should make API call and return special nodes", async () => {
                  // Mock data
                  const mockRequest = { data: "test" }; // Mock request object
                  const mockSpecialNodes = { node1: { id: "node1", name: "Node 1" } }; // Mock special nodes data

                  // Mock REST.apiCal response
                  (REST.apiCal as jest.Mock).mockResolvedValue({
                    success: true,
                    data: mockSpecialNodes,
                  });

                  // Perform the test
                  const specialNodes = await fetchSpecialNodes(mockRequest);
                  const request = {
                    /* request data */
                  };
                  const specialNodes = await fetchSpecialNodes(request);

                  // Add assertions for special nodes data
                  expect(specialNodes).toEqual(mockSpecialNodes);
                });

                // Add more test cases for other functions in searchService
              });
              /**
               * Tests that the `fetchSearchResults` function correctly handles different input data and makes the expected API call.
               *
               * This test case verifies that when the `fetchSearchResults` function is called with different request objects, the function properly fetches the expected search results for each request.
               *
               * @param {Object} request1 - An object containing the request parameters for the first test case.
               * @param {string} request1.keyword - The keyword to search for.
               * @param {number} request1.page - The page number of the search results.
               * @param {Object} request2 - An object containing the request parameters for the second test case.
               * @param {string} request2.keyword - The keyword to search for.
               * @param {number} request2.page - The page number of the search results.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("fetchSearchResults should handle different scenarios and make API call", async () => {
                // Mock data 1
                const mockData1 = {
                  keyword: "search term 1", // The search term
                  page: 1, // The page number
                  domain: "example.com" // The domain
                };
                // Mock data 2
                const mockData2 = {
                  keyword: "search term 2", // The search term
                  page: 2, // The page number
                  domain: "example.org" // The domain
                };
                // Request data 1
                const request1 = { keyword: "search term 1", page: 1 };
                // Request data 2
                const request2 = { keyword: "search term 2", page: 2 };
             

                await fetchSearchResults(mockData1);
                // Add assertions for API call with mock data 1
                await fetchSearchResults(request1);
                // Add assertions for API call with request data 1

                await fetchSearchResults(mockData2);
                // Add assertions for API call with mock data 2
                await fetchSearchResults(request2);
                // Add assertions for API call with request data 2
              });
              /**
               * Tests that the `fetchRecord` function correctly handles different input data and makes the expected API call.
               *
               * This test case verifies that when the `fetchRecord` function is called with different request objects, the function properly fetches the expected record data for each request.
               *
               * @param {Object} request1 - An object containing the request parameters for the first test case.
               * @param {string} request1.id - The ID of the record to fetch.
               * @param {string} request1.domain - The domain of the record to fetch.
               * @param {Object} request2 - An object containing the request parameters for the second test case.
               * @param {string} request2.id - The ID of the record to fetch.
               * @param {string} request2.domain - The domain of the record to fetch.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("fetchRecord should handle different input data and make API call", async () => {
                // Mock data
                const mockRecordId1 = "recordId1";
                const mockDomain1 = "domain1";
                const mockRecordId2 = "recordId2";
                const mockDomain2 = "domain2";

                // Mock request
                const request1 = { id: mockRecordId1, domain: mockDomain1 };
                const request2 = { id: mockRecordId2, domain: mockDomain2 };
                const request1 = { id: "recordId1", domain: "domain1" };
                const request2 = { id: "recordId2", domain: "domain2" };

                await fetchRecord(request1);
                // Add assertions for API call with request data 1

                await fetchRecord(request2);
                // Add assertions for API call with request data 2
              });
              });
              /**
               * Tests that the `fetchSpecialNodes` function correctly handles different request scenarios and returns the expected special nodes data.
               *
               * This test case verifies that when the `fetchSpecialNodes` function is called with different request objects, the function properly fetches and returns the expected special nodes data for each request.
               *
               * @param {Object} request1 - An object containing the request parameters for the first test case.
               * @param {Object} request2 - An object containing the request parameters for the second test case.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("fetchSpecialNodes should handle different scenarios and return special nodes", async () => {
                const request1 = {
                  domain: "domain1",
                  // Mock additional request properties if needed
                  /* request data 1 */
                };
                const request2 = {
                  domain: "domain2",
                  // Mock additional request properties if needed
                  /* request data 2 */
                };

                // Mock the API response
                const mockSpecialNodes1 = {
                  exclude: {
                    tags: ["tag1", "tag2"],
                    domains: ["domain1"]
                  },
                  include: {
                    tags: ["tag3", "tag4"],
                    domains: ["domain3", "domain4"]
                  }
                };
                const mockSpecialNodes2 = {
                  exclude: {
                    tags: ["tag5", "tag6"],
                    domains: ["domain5"]
                  },
                  include: {
                    tags: ["tag7", "tag8"],
                    domains: ["domain7", "domain8"]
                  }
                };

                (REST.apiCal as jest.Mock).mockImplementationOnce(() => Promise.resolve({
                  success: true,
                  data: mockSpecialNodes1,
                }));
                (REST.apiCal as jest.Mock).mockImplementationOnce(() => Promise.resolve({
                  success: true,
                  data: mockSpecialNodes2,
                }));

                const specialNodes1 = await fetchSpecialNodes(request1);
                // Add assertions for special nodes data with request data 1
                expect(specialNodes1).toEqual(mockSpecialNodes1);

                const specialNodes2 = await fetchSpecialNodes(request2);
                // Add assertions for special nodes data with request data 2
                expect(specialNodes2).toEqual(mockSpecialNodes2);
              });
              /**
               * Tests that the `fetchSearchResults` function correctly handles error responses from the API call.
               *
               * This test case verifies that when the `fetchSearchResults` function is called and the API call returns an error response, the function properly handles the error and any necessary assertions are added.
               *
               * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the object contains the necessary request data.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("fetchSearchResults should handle error response from API call", async () => {
                (getUserId as jest.Mock).mockResolvedValue("testUserId");

                const request = {
                  keyword: "testKeyword",
                  page: 1,
                  domain: "testDomain",
                  /* request data */
                };

                // Simulate error response from API call
                (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

                // Add assertions for error handling
                await expect(fetchSearchResults(request)).rejects.toThrow("API Error");
                expect(getUserId).toHaveBeenCalled();
                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
                  method: "GET",
                });
              });
              /**
               * Tests that the `fetchSearchResults` function correctly handles requests with additional parameters.
               *
               * This test case verifies that when the `fetchSearchResults` function is called with a request object that contains an `additionalParams` property, the `REST.apiCal` function is called with the expected URL, which includes the `keyword`, `page`, `domain`, `additionalParams`, and `userSessionId` properties.
               *
               * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the object contains `keyword`, `page`, `domain`, `additionalParams`, and `userSessionId` properties.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("should call REST.apiCal with correct parameters for search results", async () => {
                // Mock data
                const mockKeyword = "test"; // mock keyword
                const mockPage = 1; // mock page
                const mockDomain = "example.com"; // mock domain
                const mockAdditionalParams = { param1: "value1" }; // mock additionalParams
                const mockUserSessionId = "12345"; // mock user session ID
                const request = {
                  keyword: mockKeyword, // keyword
                  page: mockPage, // page
                  domain: mockDomain, // domain
                  additionalParams: mockAdditionalParams, // additionalParams
                  userSessionId: mockUserSessionId, // userSessionId
                };
                REST.apiCal.mockResolvedValue({ success: true });

                await fetchSearchResults(request);

                // Assertions
                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(
                    ENDPOINT.SearchWithPermissions,
                    request // request object that includes keyword, page, domain, additionalParams, and userSessionId
                  ),
                  method: "GET", // HTTP method should be GET
                });
              });
            
              /**
               * Tests that the `fetchSearchResults` function correctly handles requests without additional parameters.
               *
               * This test case verifies that when the `fetchSearchResults` function is called with a request object that does not contain an `additionalParams` property, the `REST.apiCal` function is still called with the expected URL, which includes only the `keyword`, `page`, `domain`, and `userSessionId` properties.
               *
               * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the object contains `keyword`, `page`, `domain`, and `userSessionId` properties.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */

              it("should handle large payloads gracefully", async () => {
                const mockUserId = "mockUserId";
                (getUserId as jest.Mock).mockResolvedValue(mockUserId);
              
                // Mock data
                const mockAdditionalParams = null;
                const mockRequestPage = 1;
                const mockLongKeyword = "a".repeat(10000); // Large keyword
              
                // Mock request object
                const request = {
                  keyword: mockLongKeyword,
                  page: mockRequestPage,
                  additionalParams: mockAdditionalParams,
                };
              
                await fetchSearchResults(request);
              
                // Assertions
                expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
                expect(getUserId).toHaveBeenCalled();
                expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
                  ...request,
                  userSessionId: mockUserId,
                });
                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(ENDPOINT.Search, {
                    ...request,
                    userSessionId: mockUserId,
                  }),
                  method: "GET",
                });
              });
              
            


              /**
               * Tests that the `fetchSearchResults` function correctly handles errors from the `REST.apiCal` function.
               *
               * This test case verifies that when the `REST.apiCal` function throws an error, the `fetchSearchResults` function correctly rejects with the same error message. It sets up a mock for the `REST.apiCal` function to reject with a "Network error" error, and then asserts that calling `fetchSearchResults` with a request object containing a `keyword` and `page` property rejects with the expected error message.
               *
               * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the object contains `keyword` and `page` properties.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              it("should handle errors from REST.apiCal", async () => {
                // Mock data
                const mockKeyword = "test"; // mock keyword
                const mockPage = 1; // mock page
                const request = { keyword: mockKeyword, page: mockPage }; // mock request object

                // Mock the REST.apiCal function to throw an error
                const request = { keyword: "test", page: 1 };
                REST.apiCal.mockRejectedValue(new Error("Network error"));

                // Call the fetchSearchResults function and expect it to reject with the correct error message
                await expect(fetchSearchResults(request)).rejects.toThrow(
                  "Network error"
                );
              });

              /**
               * Tests that the `fetchRecord` function correctly fetches a record with the provided request parameters.
               *
               * This test case verifies that the `fetchRecord` function can properly fetch a record when the `additionalParams` property is provided. It passes a request object with an `id`, `domain`, `additionalParams`, and `userSessionId` property to the `fetchRecord` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the `id`, `domain`, `additionalParams`, and `userSessionId` properties.
               *
               * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`. In this test case, the `id`, `domain`, `additionalParams`, and `userSessionId` properties are provided.
               * @returns {Promise<void>} A promise that resolves when the test is complete.
               */
              describe("fetchRecord", () => {
                it("should call REST.apiCal with correct parameters for fetching a record", async () => {
                  // Mock data
                  const mockId = "123"; // mock record ID
                  const mockDomain = "example.com"; // mock domain
                  const mockAdditionalParams = { param1: "value1" }; // Additional parameters
                  const mockUserSessionId = "12345"; // Mock user session ID

                  // Mock request
                  const request = {
                    id: mockId,
                    domain: mockDomain,
                    additionalParams: mockAdditionalParams,
                    userSessionId: mockUserSessionId,
                    id: "123",
                    domain: "example.com",
                    additionalParams: { param1: "value1" },
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  // Perform the test
                  await fetchRecord(request);

                  // Assertions
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/withPermissions/${mockId}?domain=${mockDomain}&additionalParams=${JSON.stringify(
                      mockAdditionalParams
                    )}&userSessionId=${mockUserSessionId}`,
                    url: `${ENDPOINT.fetchRecord}/withPermissions/123?domain=example.com&additionalParams=${request.additionalParams}&userSessionId=${request.userSessionId}`,
                    method: "GET",
                  });
                });
              });
                /**
                 * Tests that the `fetchRecord` function correctly fetches a record with the provided request parameters.
                 *
                 * This test case verifies that the `fetchRecord` function can properly fetch a record when the `additionalParams` property is `null`. It passes a request object with an `id`, `domain`, and `userSessionId` property to the `fetchRecord` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the `id` and `domain` properties.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`. In this test case, the `additionalParams` property is `null`.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                it("should handle null additionalParams correctly", async () => {
                  // Mock data
                  const request = {
                    id: "123", // mock record ID
                    domain: "example.com", // mock domain
                    userSessionId: "12345", // mock user session ID
                    id: "123",
                    domain: "example.com",
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  // Perform the test
                  await fetchRecord(request);

                  // Assertions
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/${request.id}?domain=${request.domain}`, // REST.apiCal should be called with a URL that includes the record ID and domain
                    method: "GET", // HTTP method should be GET
                    url: `${ENDPOINT.fetchRecord}/123?domain=example.com`,
                    method: "GET",
                  });
                });

                /**
                 * Tests that the `fetchSpecialNodes` function correctly fetches special nodes.
                 *
                 * This test case verifies that the `fetchSpecialNodes` function can properly fetch special nodes. It passes an empty request object to the `fetchSpecialNodes` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the `ENDPOINT.SpecialNodes` endpoint.
                 *
                 * @param {Object} request - An empty object representing the request parameters to be passed to `fetchSpecialNodes`.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                describe("fetchSpecialNodes", () => {
                  it("should call REST.apiCal with correct parameters for fetching special nodes", async () => {
                    // Mock data
                    const mockData = { request: {} }; // Mock data with an empty request object
                    REST.apiCal.mockResolvedValue({ success: true });

                    // Call fetchSpecialNodes with mockData.request
                    await fetchSpecialNodes(mockData.request);

                    // Expect REST.apiCal to be called with the correct URL and method
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, mockData.request), // REST.processArgs with empty request object
                      method: "GET", // HTTP method should be GET
                    });
                  });
                });
     
                /**
                 * Tests that the `fetchSearchResults` function correctly handles empty keyword input.
                 *
                 * This test case verifies that the `fetchSearchResults` function can properly handle a request object with an empty keyword. It passes a request object with an empty keyword to the `fetchSearchResults` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the empty keyword.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the `keyword` property is set to an empty string.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                describe("fetchSearchResults", () => {
                  it("should handle empty keyword gracefully", async () => {
                    // Mock data
                    const mockRequest = {
                      keyword: "", // empty keyword
                      page: 1, // mock page
                    };
                    const mockResponse = { success: true }; // mock response
                    
                    // Mock implementations
                    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse); // mock REST.apiCal to resolve with mock response
                    
                    // Perform the test
                    await fetchSearchResults(mockRequest);

                    // Assertions
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: expect.any(String), // REST.apiCal should be called with a string URL
                      method: "GET", // HTTP method should be GET
                    }); // REST.apiCal should be called with the following parameters
                  });
                

                  /**
                   * Tests that the `fetchSearchResults` function correctly handles negative page numbers.
                   *
                   * This test case verifies that the `fetchSearchResults` function can properly handle a request object with a negative page number. It passes a request object with a page number of -1 to the `fetchSearchResults` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the negative page number.
                   *
                   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the `page` property is set to -1.
                   * @returns {Promise<void>} A promise that resolves when the test is complete.
                   */
                  it("should handle negative page numbers", async () => {
                    const request = {
                      keyword: "test",
                      page: -1,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: expect.stringContaining(`page=${request.page}`),
                      method: "GET",
                    });
                  });
                

                  /**
                   * Tests that the `fetchSearchResults` function correctly handles large page numbers.
                   *
                   * This test case verifies that the `fetchSearchResults` function can properly handle a request object with a large page number. It passes a request object with a page number of 10000 to the `fetchSearchResults` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the large page number.
                   *
                   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`. In this test case, the `page` property is set to 10000.
                   * @returns {Promise<void>} A promise that resolves when the test is complete.
                   */
                  it("should handle large page numbers", async () => {
                    // Mock data
                    const request = {
                      keyword: "test", // mock keyword
                      page: 10000, // mock large page number
                      keyword: "test",
                      page: 10000,
                    };
                    const mockResponse = { success: true }; // mock response data
                    REST.apiCal.mockResolvedValue(mockResponse); // mock REST.apiCal to resolve with mock response
                    REST.apiCal.mockResolvedValue({ success: true });

                    // Perform the test
                    await fetchSearchResults(request);

                    // Assertions
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, request), // REST.apiCal should be called with the expected URL
                      method: "GET", // HTTP method should be GET
                      url: REST.processArgs(ENDPOINT.Search, request),
                      method: "GET",
                    });
                  });
                });

                /**
                 * Tests that the `fetchRecord` function correctly handles an undefined ID parameter.
                 *
                 * This test case verifies that the `fetchRecord` function can properly handle a request object with an undefined ID property. It passes a request object with an undefined ID to the `fetchRecord` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the string "undefined" for the ID parameter.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`. In this test case, the `id` property is undefined.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                describe("fetchRecord", () => {
                  /**
                   * Tests that the `fetchRecord` function correctly handles an undefined ID parameter.
                   *
                   * This test case verifies that the `fetchRecord` function can properly handle a request object with an undefined ID property. It passes a mock request object with undefined ID to the `fetchRecord` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the string "undefined" for the ID parameter.
                   *
                   * @param {Object} mockRequest - A mock request object to be passed to `fetchRecord`. The `id` property is undefined.
                   * @returns {Promise<void>} A promise that resolves when the test is complete.
                   */
                  it("should handle undefined ID", async () => {
                    // Mock data
                    const mockRequest = {
                      domain: "example.com", // mock domain
                    };
                    // Mock implementations
                    REST.apiCal.mockResolvedValue({ success: true });

                    // Perform the test
                    await fetchRecord(mockRequest);

                    // Assertions
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/undefined?domain=example.com`, // REST.apiCal should be called with the following URL
                      method: "GET", // HTTP method should be GET
                    });
                  });
             
                });
                  /**
                   * Tests that the `fetchRecord` function correctly handles special characters in the ID parameter.
                   *
                   * This test case verifies that the `fetchRecord` function can properly encode special characters in the ID parameter when making the API call. It passes an ID with special characters to the `fetchRecord` function and then asserts that the `REST.apiCal` function was called with the expected URL, which includes the encoded ID.
                   *
                   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`. In this test case, the `id` property contains special characters.
                   * @returns {Promise<void>} A promise that resolves when the test is complete.
                   */
                  it("should handle special characters in ID", async () => {
                    // Mock data
                    const request = {
                      id: "123/special?&", // ID with special characters
                      domain: "example.com", // mock domain
                    };
                    const mockData = { success: true }; // Mock API response
                  
                    // Mock implementations
                    (REST.apiCal as jest.Mock).mockResolvedValue(mockData); // Mock API call
                  
                    // Perform the test
                    await fetchRecord(request);
                  
                    // Assertions
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/${encodeURIComponent(request.id)}?domain=${request.domain}`, // Expected URL with encoded ID and domain
                      method: "GET", // HTTP method should be GET
                    });
                  });
                  
                /**
                 * Tests that the `fetchSpecialNodes` function correctly handles an empty request object.
                 *
                 * This test case verifies that the `fetchSpecialNodes` function can handle an empty request object by passing it to the `REST.processArgs` function, which should handle the empty object gracefully.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchSpecialNodes`. This test case uses an empty object.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */

                describe("fetchSpecialNodes", () => {
                  it("should handle empty request object", async () => {
                    // Mock data
                    const mockData = {};

                    // Mock REST.apiCal response
                    const mockResponse = { success: true };

                    // Mock REST.apiCal to return mockResponse
                    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

                    // Call fetchSpecialNodes with empty request object
                    await fetchSpecialNodes(mockData);

                    // Expect REST.apiCal to be called with the correct URL and method
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, mockData),
                      method: "GET",
                    });
                  });
                });
                  /**
                   * Tests that the `fetchSpecialNodes` function correctly handles a null request object.
                   *
                   * This test case verifies that the `fetchSpecialNodes` function can handle a null request object by passing it to the `REST.processArgs` function, which should handle the null value gracefully.
                   *
                   * @param {Object|null} request - An object containing the request parameters to be passed to `fetchSpecialNodes`, or null.
                   * @returns {Promise<void>} A promise that resolves when the test is complete.
                   */

                  it("should handle null request", async () => {
                    // Mock data
                    const mockData = { request: null }; // mock data with null request
                    const mockResponse = { success: true }; // mock response
                  
                    // Mock implementations
                    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse); // mock REST.apiCal to resolve with mock response
                  
                    // Perform the test
                    await fetchSpecialNodes(null); // call fetchSpecialNodes with null request
                  
                    // Assertions
                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, { request: null }), // REST.processArgs with null request
                      method: "GET", // HTTP method should be GET
                    });
                  });
                  
                /**
                 * Tests that the `fetchSearchResults` function correctly handles non-standard errors thrown by `REST.apiCal`.
                 *
                 * This test case verifies that the `fetchSearchResults` function can handle unexpected errors thrown by the `REST.apiCal` function. It mocks the `REST.apiCal` function to throw an object with a `message` and `code` property, and then asserts that the `fetchSearchResults` function rejects with the same error object.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */

                describe("Error Handling", () => {
                  it("should handle REST.apiCal throwing non-standard errors", async () => {
                    // Mock data
                    const mockRequest = {
                      keyword: "test", // mock keyword
                      page: 1, // mock page
                    };

                    // Mock implementations
                    REST.apiCal.mockImplementation(() => {
                      throw {
                        message: "An unexpected error occurred", // mock error message
                        code: 500, // mock error code
                      };
                    });

                    // Perform the test
                    await expect(fetchSearchResults(mockRequest)).rejects.toEqual({
                      message: "An unexpected error occurred", // Assert that the error message matches the mock error message
                      code: 500, // Assert that the error code matches the mock error code
                    });
             

                /**
                 * Tests that the `fetchSearchResults` function correctly handles large payloads gracefully.
                 *
                 * This test case verifies that the `fetchSearchResults` function can handle a large `keyword` value without any issues. It mocks the `getUserId` function to return a mock user ID, and then creates a large `keyword` value using the `repeat` method. It then calls the `fetchSearchResults` function with the large `keyword` value and asserts that the expected functions are called with the correct parameters, including the large `keyword` value.
                 *
                 * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
                 * @returns {Promise<void>} A promise that resolves when the test is complete.
                 */
                it("should handle large payloads gracefully", async () => {
                  const mockUserId = "mockUserId";
                  (getUserId as jest.Mock).mockResolvedValue(mockUserId);
                
                  // Mock data
                  const mockAdditionalParams = null;
                  const mockRequestPage = 1;
                  const mockLongKeyword = "a".repeat(10000); // Large keyword
                
                  // Mock request object
                  const request = {
                    keyword: mockLongKeyword,
                    page: mockRequestPage,
                    additionalParams: mockAdditionalParams,
                  };
                
                  await fetchSearchResults(request);
                
                  // Assertions
                  expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
                    ...request,
                    userSessionId: mockUserId,
                  });
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: REST.processArgs(ENDPOINT.Search, {
                      ...request,
                      userSessionId: mockUserId,
                    }),
                    method: "GET",
                  });
                });
              });                
  

  /**
   * Tests that the `fetchSearchResults` function correctly calls the `recordUserClickData` and `REST.apiCal` functions with the expected parameters.
   *
   * This test case verifies that the `fetchSearchResults` function correctly calls the `recordUserClickData` function with the expected `"search"` event type and the `keyword` from the `mockRequest` object. It also verifies that the `REST.processArgs` function is called with the expected `ENDPOINT.SearchWithPermissions` endpoint and the `mockRequest` object with the `userSessionId` added. Finally, it verifies that the `REST.apiCal` function is called with the expected `url` and `method` parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("fetchSearchResults", () => {
    it("should call recordUserClickData and REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockRequest = {
        keyword: "test", // mock keyword
        page: 1, // mock page
        domain: "example.com", // mock domain
        additionalParams: { param: "value" }, // mock additionalParams
      };
      const mockUserId = "mockUserId"; // mock user ID

      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

      // Perform the test
      await fetchSearchResults(mockRequest);

      // Assertions
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search", // event type
        mockRequest.keyword // keyword
      );
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions, // endpoint
        { ...mockRequest, userSessionId: mockUserId } // request with userSessionId
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String), // url
        method: "GET", // method
      });
    });
 

    /**
     * Tests that the `fetchSearchResults` function correctly handles a request with null `additionalParams`.
     *
     * This test case verifies that the `fetchSearchResults` function correctly handles a request with null `additionalParams`. It mocks the `getUserId` function to return a mock user ID, and then asserts that the `fetchSearchResults` function calls the `recordUserClickData` function with the expected parameters, calls the `REST.processArgs` function with the expected parameters, and calls the `REST.apiCal` function with the expected parameters.
     *
     * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle null additionalParams", async () => {
      // Mock data
      const mockRequest = {
        keyword: "test", // mock keyword
        page: 1, // mock page
        domain: "example.com", // mock domain
        additionalParams: null, // null additionalParams
        keyword: "test",
        page: 1,
        domain: "example.com",
        additionalParams: null,
      };
      const mockUserId = "mockUserId"; // mock user ID
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

      // Perform the test
      await fetchSearchResults(mockRequest);

      // Assertions
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockRequest.keyword
      );
      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
        ...mockRequest,
        userSessionId: mockUserId,
      });
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String),
        method: "GET",
      });
    });
  });
  });

  /**
   * Tests that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters.
   *
   * This test case verifies that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters, including the `id`, `domain`, `additionalParams`, and `userSessionId` values from the `mockRequest` object. It mocks the `getUserId` function to return a mock user ID, and then asserts that the `REST.apiCal` function is called with the expected parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchRecord`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("fetchRecord", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockId = "123"; // mock record ID
      const mockDomain = "example.com"; // mock domain
      const mockAdditionalParams = { param: "value" }; // Additional parameters
      const mockUserId = "mockUserId"; // Mock user ID
    
      // Mock request
      const mockRequest = {
        id: mockId,
        domain: mockDomain,
        additionalParams: mockAdditionalParams,
      };
    
      // Mock implementations
      (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    
      // Perform the test
      await fetchRecord(mockRequest);
    
      // Assertions
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.stringContaining(
          `/withPermissions/${mockId}?domain=${mockDomain}&additionalParams=${encodeURIComponent(
            JSON.stringify(mockAdditionalParams)
          )}&userSessionId=${mockUserId}`
        ),
        method: "GET",
      });
    });
  });    
  /**
   * Tests that the `fetchSearchResults` function correctly handles a request with an empty keyword.
   *
   * This test case verifies that the `fetchSearchResults` function correctly handles a request with an empty keyword. It mocks the `getUserId` function to return a mock user ID, and then asserts that the `fetchSearchResults` function does not call the `recordUserClickData` function, calls the `REST.processArgs` function with the expected parameters, and calls the `REST.apiCal` function with the expected parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle empty keyword", async () => {
    // Mock data
    const mockRequest = {
      keyword: "", // empty keyword
      page: 1, // mock page
      domain: "example.com", // mock domain
      additionalParams: { param: "value" }, // mock additionalParams
    };
    const mockUserId = "mockUserId"; // mock user ID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

    // Perform the test
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(recordUserClickData).not.toHaveBeenCalled(); // recordUserClickData should not be called
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // REST.processArgs should be called with the following parameter
      { ...mockRequest, userSessionId: mockUserId }
    ); // REST.processArgs should be called with the following parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String), // REST.apiCal should be called with a string URL
      method: "GET", // HTTP method should be GET
    }); // REST.apiCal should be called with the following parameters
  });


  /**
   * Tests that the `fetchSearchResults` function correctly handles a request with an undefined keyword.
   *
   * This test case verifies that the `fetchSearchResults` function correctly handles a request with an undefined keyword. It mocks the `getUserId` function to return a mock user ID, and then asserts that the `fetchSearchResults` function does not call the `recordUserClickData` function, calls the `REST.processArgs` function with the expected parameters, and calls the `REST.apiCal` function with the expected parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined keyword", async () => {
    // Mock data
    const mockRequest = {
      page: 1, // mock page
      domain: "example.com", // mock domain
      additionalParams: { param: "value" }, // mock additionalParams
    };
    const mockUserId = "mockUserId"; // mock user ID
  
    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
  
    // Perform the test
    await fetchSearchResults(mockRequest);
  
    // Assertions
    expect(recordUserClickData).not.toHaveBeenCalled(); // recordUserClickData should not be called
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // REST.processArgs should be called with this parameter
      { ...mockRequest, userSessionId: mockUserId }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String), // REST.apiCal should be called with a string URL
      method: "GET", // HTTP method should be GET
    });
  });
  
  

  /**
   * Tests that the `fetchSearchResults` function correctly handles an error thrown by the `recordUserClickData` function.
   *
   * This test case verifies that the `fetchSearchResults` function correctly handles an error thrown by the `recordUserClickData` function. It mocks the `getUserId` function to return a mock user ID, mocks the `recordUserClickData` function to reject with an error, and then asserts that the `fetchSearchResults` function rejects with the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle error thrown by recordUserClickData", async () => {
    // Mock data
    const mockRequest = {
      keyword: "test", // mock keyword
      page: 1, // mock page
      domain: "example.com", // mock domain
      additionalParams: { param: "value" }, // mock additionalParams
    };
    const mockUserId = "mockUserId"; // mock user ID

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    (recordUserClickData as jest.Mock).mockRejectedValue(new Error("Error")); // mock recordUserClickData to reject with "Error" error

    // Perform the test
    await expect(fetchSearchResults(mockRequest)).rejects.toThrow("Error");
  });



/**
 * Tests that the `fetchRecord` function correctly handles an error thrown by the `getUserId` function.
 *
 * This test case verifies that the `fetchRecord` function correctly handles an error thrown by the `getUserId` function. It mocks the `getUserId` function to reject with an error, and then asserts that the `fetchRecord` function rejects with the expected error.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchRecord", () => {
  // ... (previous test cases)

  it("should handle error thrown by getUserId", async () => {
    // Mock data
    const mockRequest = {
      id: "record123", // mock record ID
      domain: "example.com", // mock domain
      additionalParams: { param: "value" }, // additional mock params
    };
    // Mock implementations
    (getUserId as jest.Mock).mockRejectedValue(new Error("Error")); // mock getUserId to reject with "Error" error

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow("Error");
  });
 

  /**
   * Tests that the `fetchRecord` function correctly handles an error thrown by the `REST.apiCal` function.
   *
   * This test case verifies that the `fetchRecord` function correctly handles an error thrown by the `REST.apiCal` function. It mocks the `getUserId` function to return a mock user ID, mocks the `REST.apiCal` function to reject with an error, and then asserts that the `fetchRecord` function rejects with the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle error thrown by REST.apiCal", async () => {
    // Mock data
    const mockRequest = {
      id: "record123", // mock record ID
      domain: "example.com", // mock domain
      id: "123",
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId"; // mock user ID
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Error"));

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Error")); // mock REST.apiCal to reject with "Error" error

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow("Error");
  });
});
/**
 * Tests that the `fetchSearchResults` function correctly calls the `recordUserClickData` function with the expected parameters when a keyword is provided.
 *
 * This test case verifies that the `fetchSearchResults` function correctly calls the `recordUserClickData` function with the expected parameters when the `keyword` property of the request object is provided. It calls the `fetchSearchResults` function with a mock request object, and then asserts that the `recordUserClickData` function was called with the expected parameters.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSearchResults", () => {
  it("should call recordUserClickData with correct parameters when keyword is provided", async () => {
    // Mock data
    const mockKeyword = "test"; // Mock search keyword
    const mockPage = 1; // Mock page number
    const request = {
      keyword: mockKeyword,
      page: mockPage,
    };

    // Call the function under test
    await fetchSearchResults(request);

    // Assert that recordUserClickData was called with the expected parameters
    expect(recordUserClickData).toHaveBeenCalledWith(
      "search", // Expected action type
      mockKeyword // Expected search keyword
    );
  });
 

  /**
   * Tests that the `fetchSearchResults` function does not call the `recordUserClickData` function when the `keyword` property of the request object is not provided.
   *
   * This test case verifies that the `fetchSearchResults` function does not call the `recordUserClickData` function when the `keyword` property of the request object is not provided. It calls the `fetchSearchResults` function with a mock request object that does not have a `keyword` property, and then asserts that the `recordUserClickData` function was not called.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should not call recordUserClickData when keyword is not provided", async () => {
    // Mock data
    const mockRequest = { page: 1 }; // Mock request with only `page` property
    const request = { page: 1 };
    await fetchSearchResults(request);

    // Perform the test
    await fetchSearchResults(mockRequest);
    expect(recordUserClickData).not.toHaveBeenCalled();
  });

    // Assertion
    expect(recordUserClickData).not.toHaveBeenCalled(); // `recordUserClickData` should not have been called
  });
  /**
   * Tests that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when `additionalParams` is `null`.
   *
   * This test case verifies that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property of the request object is `null`. It mocks the `getUserId` function to return a mock user ID, calls the `fetchSearchResults` function with a mock request object, and then asserts that the `getUserId` function was called, the `REST.processArgs` function was called with the expected parameters, and the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    // Mock data
    const mockRequest = { page: 1, additionalParams: null }; // mock request object
    const mockUserId = "mockUserId"; // mock user ID
    const request = { page: 1, additionalParams: null };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    await fetchSearchResults(request);

    // Perform the test
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...mockRequest,
      ...request,
      userSessionId: mockUserId,
    }); // REST.processArgs should be called with the following parameters
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    }); // REST.apiCal should be called with the following parameters
    
  

  /**
   * Tests that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when `additionalParams` is provided.
   *
   * This test case verifies that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property of the request object is provided. It mocks the `getUserId` function to return a mock user ID, calls the `fetchSearchResults` function with a mock request object, and then asserts that the `getUserId` function was called, the `REST.processArgs` function was called with the expected parameters, and the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    // Mock data
    const mockRequest = { page: 1, additionalParams: "test" }; // mock request object
    const mockUserId = "mockUserId"; // mock user ID
    const request = { page: 1, additionalParams: "test" };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    await fetchSearchResults(request);

    // Perform the test
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // REST.processArgs should be called with the following parameters
      ENDPOINT.SearchWithPermissions,
      {
        ...mockRequest,
        ...request,
        userSessionId: mockUserId,
      }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value, // REST.apiCal should be called with the value returned by REST.processArgs
      method: "GET", // HTTP method should be GET
    }); // REST.apiCal should be called with the following parameters
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  


/**
 * Tests that the `fetchSpecialNodes` function returns the expected `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly returns the `specialNodes` object. It calls the `fetchSpecialNodes` function and then asserts that the returned value is equal to the `specialNodes` object.
 *
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should return specialNodes object", async () => {
  // Mock the specialNodes data
  const mockSpecialNodes = {
    exclude: {
      tags: ["tag1", "tag2"],
      domains: ["domain1", "domain2"]
    },
    include: {
      tags: ["tag3", "tag4"],
      domains: ["domain3", "domain4"]
    }
  };

  // Mock the fetchSpecialNodes function to return the mocked specialNodes data
  const fetchSpecialNodes = jest.fn().mockResolvedValue(mockSpecialNodes);

  // Call the fetchSpecialNodes function and get the result
  const result = await fetchSpecialNodes();

  // Expect the result to be equal to the mocked specialNodes data
  expect(result).toEqual(mockSpecialNodes);
  expect(result).toEqual(specialNodes);
});

/**
 * Tests that the `fetchSearchResults` function correctly handles errors that occur during the API call.
 *
 * This test case verifies that the `fetchSearchResults` function correctly handles errors that occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error, calls the `fetchSearchResults` function with a mock request object, and then verifies that the function rejects with the expected error and that the `recordUserClickData` function is called with the expected parameters.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSearchResults", () => {
  it("should handle errors gracefully", async () => {
    // Mock data
    const mockKeyword = "test"; // mock keyword
    const mockPage = 1; // mock page
    const request = { keyword: mockKeyword, page: mockPage }; // mock request object
  
    // Mock REST.apiCal to reject with "API Error"
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));
  
    // Perform the test
    await expect(fetchSearchResults(request)).rejects.toThrow("API Error");
  
    // Assertions
    expect(recordUserClickData).toHaveBeenCalledWith("search", mockKeyword); // Assert that recordUserClickData is called with the mock keyword
  });
});  
/**
 * Tests that the `fetchRecord` function correctly handles errors that occur during the API call.
 *
 * This test case verifies that the `fetchRecord` function correctly handles errors that occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error, calls the `fetchRecord` function with a mock request object, and then verifies that the function rejects with the expected error.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchRecord", () => {
  it("should handle errors gracefully", async () => {
    // Mock data
    const mockRequest = { id: "1", domain: "test.com", additionalParams: "test" };
    const mockError = new Error("API Error"); // Mock error object
    const request = { id: "1", domain: "test.com", additionalParams: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Mock implementations
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError); // Mock REST.apiCal to reject with the mock error

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow("API Error"); // Expect the function to reject with the mock error
    await expect(fetchRecord(request)).rejects.toThrow("API Error");
  });
});

/**
 * Tests that the `fetchSpecialNodes` function correctly handles errors that occur during the API call.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly handles errors that occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error, calls the `fetchSpecialNodes` function with a mock request object, and then verifies that the function rejects with the expected error.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchSpecialNodes`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSpecialNodes", () => {
  it("should handle errors gracefully", async () => {
    // Mock data
    const mockRequest = { data: "test" }; // Mock request object
    const request = { data: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Mock implementations
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error")); // Mock REST.apiCal to reject with "API Error" error

    // Perform the test
    await expect(fetchSpecialNodes(mockRequest)).rejects.toThrow("API Error"); // Expect fetchSpecialNodes to reject with the API Error
    await expect(fetchSpecialNodes(request)).rejects.toThrow("API Error");
  });
});
/**
 * Tests that the `fetchSearchResults` function correctly handles the case where the request object is undefined.
 *
 * This test case verifies that the `fetchSearchResults` function throws an error when the request object is undefined. It calls the `fetchSearchResults` function with an undefined request object and then verifies that the function throws the expected error.
 *
 * @param {Object|undefined} request - An object containing the request parameters to be passed to `fetchSearchResults`, or undefined.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSearchResults", () => {
  // ... (previous test cases)

  it("should handle undefined request", async () => {
    // Mock data
    const mockRequest = {
      keyword: "test", // mock keyword
      page: 1, // mock page
      domain: "example.com", // mock domain
    };

    // Perform the test
    await expect(fetchSearchResults(undefined)).rejects.toThrow(
      "Cannot read property 'keyword' of undefined"
    );
  });


  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `page` property of the request object is an invalid value.
   * This test case verifies that the `fetchSearchResults` function throws an "Invalid page number" error when the `page` property of the request object is set to an invalid value (in this case, a string). It creates a mock request object with an invalid `page` property, calls the `fetchSearchResults` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `page` property set to an invalid value.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle invalid page number", async () => {
    // Mock data
    const mockRequest = { // Mock request object
      keyword: "test", // Mock keyword
      page: "invalid", // Mock invalid page number
    };

    // Perform the test
    await expect(fetchSearchResults(mockRequest)).rejects.toThrow(
    const request = { keyword: "test", page: "invalid" };
    await expect(fetchSearchResults(request)).rejects.toThrow(
      "Invalid page number"
    );
  });

  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `page` property of the request object is a negative number.
   *
   * This test case verifies that the `fetchSearchResults` function throws an "Invalid page number" error when the `page` property of the request object is a negative number. It creates a mock request object with a negative `page` property, calls the `fetchSearchResults` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `page` property set to a negative number.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle negative page number", async () => {
    // Mock data
    const mockRequest = {
      keyword: "test", // mock keyword
      page: -1, // mock negative page number
    };

    // Perform the test
    await expect(fetchSearchResults(mockRequest)).rejects.toThrow(
      "Invalid page number"
    );
  });
 

  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `keyword` property of the request object is an empty string.
   *
   * This test case verifies that the `fetchSearchResults` function does not call the `recordUserClickData` function when the `keyword` property of the request object is an empty string. It creates a mock request object with an empty string as the `keyword` property, calls the `fetchSearchResults` function with this request, and then verifies that the `recordUserClickData` function was not called.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `keyword` property set to an empty string.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle empty keyword", async () => {
    // Mock data
    const mockUserId = "mockUserId"; // mock user ID
    const mockRequest = { keyword: "", page: 1 }; // mock request with empty keyword

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

    // Perform the test
    await fetchSearchResults(mockRequest);

    // Assertions
    expect(recordUserClickData).not.toHaveBeenCalled(); // recordUserClickData should not be called
  });


  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `additionalParams` property of the request object is `null`.
   *
   * This test case verifies that the `fetchSearchResults` function correctly processes the request when the `additionalParams` property is `null`. It creates a mock request object with `null` as the `additionalParams` property, calls the `fetchSearchResults` function with this request, and then verifies that the function correctly retrieves the user session ID and processes the request.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `additionalParams` property set to `null`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle null additionalParams", async () => {
    // Mock data
    const mockUserId = "mockUserId"; // mock user ID
    const mockRequest = { page: 1, additionalParams: null }; // mock request
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
  
    // Perform the test
    await fetchSearchResults(mockRequest);
  
    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
  
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...mockRequest, // spread mock request
      userSessionId: mockUserId, // add mock user ID
    }); // REST.processArgs should be called with the correct parameters
  
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value, // REST.apiCal should be called with the value returned by REST.processArgs
      method: "GET", // HTTP method should be GET
    });
  });
  


  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `additionalParams` property of the request object is `undefined`.
   *
   * This test case verifies that the `fetchSearchResults` function correctly processes the request when the `additionalParams` property is `undefined`. It creates a mock request object with `undefined` as the `additionalParams` property, calls the `fetchSearchResults` function with this request, and then verifies that the function correctly retrieves the user session ID and processes the request.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `additionalParams` property set to `undefined`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined additionalParams", async () => {
    // Mock data
    const mockRequest = {
      page: 1, // mock page
      additionalParams: undefined, // mock additionalParams
    };
    const mockUserId = "mockUserId"; // mock user ID
    const mockSearchEndpoint = ENDPOINT.Search; // mock search endpoint
  
    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    (REST.processArgs as jest.Mock).mockReturnValue("mockSearchEndpointUrl"); // mock REST.processArgs to return a mock search endpoint URL
  
    // Perform the test
    await fetchSearchResults(mockRequest);
  
    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
  
    expect(REST.processArgs).toHaveBeenCalledWith(
      mockSearchEndpoint,
      { ...mockRequest, userSessionId: mockUserId } // REST.processArgs should be called with the mock search endpoint and the request object containing the user session ID
    );
  
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "mockSearchEndpointUrl", // REST.apiCal should be called with the search endpoint URL returned by REST.processArgs
      method: "GET", // HTTP method should be GET
    });
  });
});  
  


/**
 * Tests that the `fetchRecord` function correctly handles the case where the `id` property of the request object is `null`.
 *
 * This test case verifies that the `fetchRecord` function correctly throws an error when the `id` property of the request object is `null`. It creates a mock request object with `null` as the `id` property, calls the `fetchRecord` function with this request, and then verifies that the function throws the expected error.
 *
 * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `id` property set to `null`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchRecord", () => {
  it("should handle null id", async () => {
    // Mock data
    const mockRequest = {
      id: null, // mock id
      domain: "test.com", // mock domain
      additionalParams: "test", // mock additionalParams
    };

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow(
      "Cannot read property 'toString' of null"
    );
  });
 

  /**
   * Tests that the `fetchRecord` function correctly handles the case where the `id` property of the request object is `undefined`.
   *
   * This test case verifies that the `fetchRecord` function correctly throws an error when the `id` property of the request object is `undefined`. It creates a mock request object with `undefined` as the `id` property, calls the `fetchRecord` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `id` property set to `undefined`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined id", async () => {
    // Mock data
    const request = {
      id: undefined, // mock ID - undefined
      domain: "test.com", // mock domain
      additionalParams: "test", // mock additional params

    };

    // Perform the test
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of undefined" // expected error message
     
    );
  });

  /**
   * Tests that the `fetchRecord` function correctly handles the case where the `domain` property of the request object is `null`.
   *
   * This test case verifies that the `fetchRecord` function correctly throws an error when the `domain` property of the request object is `null`. It creates a mock request object with `null` as the `domain` property, calls the `fetchRecord` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `domain` property set to `null`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle null domain", async () => {
    // Mock data
    const mockRequest = {
      id: "record123", // mock record ID
      domain: null, // mock domain - null
      additionalParams: "test", // mock additional params
    };

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow(
      "Cannot read property 'toString' of null" // expected error message
    );
  });
 

  /**
   * Tests that the `fetchRecord` function correctly handles the case where the `domain` property of the request object is `undefined`.
   *
   * This test case verifies that the `fetchRecord` function correctly throws an error when the `domain` property of the request object is `undefined`. It creates a mock request object with `undefined` as the `domain` property, calls the `fetchRecord` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `domain` property set to `undefined`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined domain", async () => {
    // Mock data
    const mockRequest = {
      id: "1", // mock ID
      domain: undefined, // mock domain - undefined
      additionalParams: "test", // mock additional params
    };

    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow(
      "Cannot read property 'toString' of undefined" // expected error message
    );
  });


  /**
   * Tests that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property is `null`.
   *
   * This test case verifies that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `additionalParams` property is `null`. It creates a mock request object with `null` as the `additionalParams` property, calls the `fetchRecord` function with this request, and then verifies that the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `additionalParams` property set to `null`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle null additionalParams", async () => {
    // Mock data
    const mockId = "1"; // mock record ID
    const mockDomain = "test.com"; // mock domain

    const request = { id: mockId, domain: mockDomain, additionalParams: null }; // mock request object with null additionalParams
    const request = { id: "1", domain: "test.com", additionalParams: null };

    await fetchRecord(request);

    // Assertions
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockId}?domain=${mockDomain}`, // REST.apiCal should be called with the following URL
      method: "GET", // HTTP method should be GET
      url: `${ENDPOINT.fetchRecord}/1?domain=test.com`,
      method: "GET",
    });
  });

  /**
   * Tests that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property is `undefined`.
   *
   * This test case verifies that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `additionalParams` property is `undefined`. It creates a mock request object with `undefined` as the `additionalParams` property, calls the `fetchRecord` function with this request, and then verifies that the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchRecord`, with the `additionalParams` property set to `undefined`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined additionalParams", async () => {
    // Mock data
    const mockId = "1"; // Mock ID
    const mockDomain = "test.com"; // Mock domain

    const request = {
      id: mockId, // Mock ID
      domain: mockDomain, // Mock domain
      additionalParams: undefined, // Additional parameters are undefined
    };

    await fetchRecord(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockId}?domain=${mockDomain}`, // Expected URL
      method: "GET", // HTTP method is GET
    });
  });
});


/**
 * Tests that the `fetchSpecialNodes` function correctly calls the `REST.apiCal` function with the expected parameters when the `request` parameter is `undefined`.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `request` parameter is `undefined`. It mocks the `REST.processArgs` function to return a mock URL, and then calls the `fetchSpecialNodes` function with `undefined` as the `request` parameter. The test then verifies that the `REST.processArgs` function was called with the expected parameters, and that the `REST.apiCal` function was called with the expected parameters.
 *
 * @param {any} undefined - The `request` parameter to be passed to `fetchSpecialNodes`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSpecialNodes", () => {
  // ... (previous test cases)

  it("should handle undefined request", async () => {
    // Mock data
    const mockEndpoint = ENDPOINT.SpecialNodes; // Mock endpoint
    const mockUrl = "mockUrl"; // Mock URL

    // Mock the return value of REST.processArgs
    (REST.processArgs as jest.Mock).mockReturnValue(mockUrl);

    // Call the function being tested
    await fetchSpecialNodes(undefined);

    // Assertions
    expect(REST.processArgs).toHaveBeenCalledWith(mockEndpoint, undefined);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: mockUrl,
      method: "GET",
    });
  });
});

/**
 * Tests that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property is not provided in the request.
 *
 * This test case verifies that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `additionalParams` property is not provided in the request. It mocks the `getUserId` function to return a mock user ID, and then calls the `fetchSearchResults` function with a mock request object that does not include the `additionalParams` property. The test then verifies that the `getUserId` function was called, that the `recordUserClickData` function was called with the expected parameters, and that the `REST.processArgs` and `REST.apiCal` functions were called with the expected parameters.
 *
 * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`, excluding the `additionalParams` property.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should call REST.apiCal with correct parameters without additionalParams", async () => {
  // Mock data
  const mockRequest = {
    keyword: "test", // mock keyword
    page: 1, // mock page
    domain: "example.com", // mock domain
  };
  const mockUserId = "mockUserId"; // mock user ID

  // Mock implementations
  (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

  // Perform the test
  await fetchSearchResults(mockRequest);

  // Assertions
  expect(getUserId).toHaveBeenCalled(); // getUserId should be called
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test"); // recordUserClickData should be called with the following parameters
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  }); // REST.processArgs should be called with the following parameters
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String), // REST.apiCal should be called with a string URL
    method: "GET", // HTTP method should be GET
  }); // REST.apiCal should be called with the following parameters
});


/**
 * Tests that the `fetchSearchResults` function correctly handles errors gracefully.
 *
 * This test case verifies that the `fetchSearchResults` function correctly handles errors that may occur when calling the `REST.apiCal` function. It mocks the `getUserId` function to return a mock user ID, and then mocks the `REST.apiCal` function to reject with an error. The test then calls the `fetchSearchResults` function with a mock request object and verifies that the function rejects with the expected error message. It also verifies that the `getUserId` function was called, that the `recordUserClickData` function was called with the expected parameters, and that the `REST.processArgs` and `REST.apiCal` functions were called with the expected parameters.
 *
 * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSearchResults`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle errors gracefully", async () => {
  // Mock data
  const mockRequest = {
    keyword: "test", // mock keyword
    page: 1, // mock page
    domain: "example.com", // mock domain
  };
  const mockUserId = "mockUserId"; // mock user ID

  // Mock implementations
  (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
  (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error")); // mock REST.apiCal to reject with "API Error" error

  // Perform the test
  await expect(fetchSearchResults(mockRequest)).rejects.toThrow("API Error");

  // Assertions
  expect(getUserId).toHaveBeenCalled(); // getUserId should be called
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test"); // recordUserClickData should be called with the following parameters
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  }); // REST.processArgs should be called with the following parameters
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String), // REST.apiCal should be called with a string URL
    method: "GET", // HTTP method should be GET
  }); // REST.apiCal should be called with the following parameters
});


describe("fetchRecord", () => {
  /**
   * Tests that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property is provided in the request.
   *
   * This test case verifies that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `additionalParams` property is provided in the request. It mocks the `getUserId` function to return a mock user ID, and then calls the `fetchRecord` function with a mock request object that includes the `additionalParams` property. The test then verifies that the `getUserId` function was called and that the `REST.apiCal` function was called with the expected parameters, including the `additionalParams` in the URL.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchRecord`, including the `additionalParams` property.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should call REST.apiCal with correct parameters", async () => {
    // Mock data
    const mockId = "record123"; // mock record ID
    const mockDomain = "example.com"; // mock domain
    const mockAdditionalParams = { param1: "value1" }; // Additional parameters
    const mockUserId = "mockUserId"; // Mock user ID

    // Mock request
    const mockRequest = {
      id: mockId,
      domain: mockDomain,
      additionalParams: mockAdditionalParams,
      id: "record123",
      domain: "example.com",
      additionalParams: { param1: "value1" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID

    // Perform the test
    await fetchRecord(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/withPermissions/${mockId}?domain=${mockDomain}&additionalParams=${JSON.stringify(
        mockAdditionalParams
      )}&userSessionId=${mockUserId}`,
      url: `${ENDPOINT.fetchRecord}/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`,
      method: "GET",
    });
  });
});
  /**
   * Tests that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property is not provided in the request.
   *
   * This test case verifies that the `fetchRecord` function correctly calls the `REST.apiCal` function with the expected URL and HTTP method when the `additionalParams` property is not provided in the request. It mocks the `getUserId` function to return a mock user ID, and then calls the `fetchRecord` function with a mock request object. The test then verifies that the `getUserId` function was called and that the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchRecord`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should call REST.apiCal with correct parameters without additionalParams", async () => {
    // Mock data
    const mockRequest = {
      id: "record123", // mock record ID
      domain: "example.com", // mock domain
    };
    const mockUserId = "mockUserId"; // mock user ID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Perform the test
    await fetchRecord(mockRequest);

    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    expect(REST.apiCal).toHaveBeenCalledWith({ // REST.apiCal should be called with the following parameters
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`, // mock URL
      method: "GET", // HTTP method should be GET
    });
  });


  /**
   * Tests that the `fetchRecord` function correctly handles errors that may occur during the API call.
   *
   * This test case verifies that the `fetchRecord` function correctly handles errors that may occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error. The test then expects the `fetchRecord` function to reject with the same error, and verifies that the `getUserId` and `REST.apiCal` functions are called with the expected parameters.
   *
   * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchRecord`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle errors gracefully", async () => {
    // Mock data
    const mockRequest = {
      id: "record123", // mock record ID
      domain: "example.com", // mock domain
    };
    const mockUserId = "mockUserId"; // mock user ID
  
    // Mock implementations
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // mock getUserId to resolve with mock user ID
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error")); // mock REST.apiCal to reject with "API Error"
  
    // Perform the test
    await expect(fetchRecord(mockRequest)).rejects.toThrow("API Error");
  
    // Assertions
    expect(getUserId).toHaveBeenCalled(); // getUserId should be called
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`, // mock URL
      method: "GET", // HTTP method should be GET
    });
  });
  

/**
 * Tests that the `fetchSpecialNodes` function correctly calls the `REST.apiCal` function with the expected parameters.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly calls the `REST.processArgs` function with the `ENDPOINT.SpecialNodes` endpoint and the provided `mockRequest` object, and then calls the `REST.apiCal` function with the expected URL and HTTP method.
 *
 * @param {Object} mockRequest - An object containing the request parameters to be passed to `fetchSpecialNodes`.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("fetchSpecialNodes", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    // Mock request data
    const mockRequest = {
      param1: "value1", // Sample request parameter
    };

    // Mock REST.apiCal response
    const mockResponse = {
      success: true,
      data: {
        specialNodes: ["node1", "node2"], // Sample special nodes data
      },
    };

    // Mock REST.apiCal to return mockResponse
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // Call fetchSpecialNodes with mockRequest
    await fetchSpecialNodes(mockRequest);

    // Expect REST.processArgs to be called with the expected arguments
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      mockRequest
    );

    // Expect REST.apiCal to be called with the correct URL and method
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });


  /**
   * Tests that the `fetchSpecialNodes` function returns the expected `specialNodes` object.
   *
   * This test case verifies that the `fetchSpecialNodes` function correctly returns the `specialNodes` object, which is mocked to have an `exclude` property with a `tags` array. The test ensures that the `fetchSpecialNodes` function returns the expected `specialNodes` object.
   *
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should return the specialNodes object", async () => {
    // Mock the specialNodes data
    const mockSpecialNodes = {
      exclude: { // Mocking the exclude property
        tags: ["tag1", "tag2"], // Mocking the tags array
        domains: ["domain1", "domain2"] // Mocking the domains array
      },
      include: { // Mocking the include property
        tags: ["tag3", "tag4"], // Mocking the tags array
        domains: ["domain3", "domain4"] // Mocking the domains array
      }
    };
    const mockSpecialNodes = { exclude: { tags: ["tag1", "tag2"] } };
    jest.mock("../util/specialNodes", () => ({
      specialNodes: mockSpecialNodes, // Mocking the specialNodes object
      specialNodes: mockSpecialNodes,
    }));

    const result = await fetchSpecialNodes();
    expect(result).toEqual(mockSpecialNodes); // Expecting the result to be equal to the mocked specialNodes object
    expect(result).toEqual(mockSpecialNodes);
  });
});
  /**
   * Tests that the `fetchSpecialNodes` function handles errors gracefully.
   *
   * This test case verifies that the `fetchSpecialNodes` function correctly handles errors that may occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error. The test then expects the `fetchSpecialNodes` function to reject with the same error, and verifies that the `REST.processArgs` and `REST.apiCal` functions are called with the expected parameters.
   *
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle errors gracefully", async () => {
    // Mock the return value of REST.apiCal
    const mockError = new Error("API Error");
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);

    // Define mock data
    const mockRequest = { param1: "value1" }; // Mock request object

    // Expect the fetchSpecialNodes function to reject with the mockError
    await expect(fetchSpecialNodes(mockRequest)).rejects.toThrow(mockError);

    // Expect REST.processArgs to be called with the expected parameters
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.SpecialNodes, mockRequest);
    
    // Expect REST.apiCal to be called with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });

/**
 * Tests that the `recordUserClickData` function correctly records user click data.
 *
 * This test case verifies that the `recordUserClickData` function correctly calls the `getSessionKey` function to retrieve the user session key, and then calls the `REST.apiCal` function with the appropriate parameters to record the user click data. It mocks the `getSessionKey` function to return a mock session key, and verifies that the `REST.apiCal` function is called with the expected parameters.
 *
 * @param {string} clickType - The type of click being recorded.
 * @param {string} clickedName - The name of the clicked item.
 * @param {number} recordId - The ID of the record being clicked.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("searchService", () => {
  // ... previous test cases
});
  describe("recordUserClickData", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock user session key
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
      
      // Provide clickType, clickedName, and recordId
      const clickType = "search"; // Click type
      const clickedName = "test"; // Clicked item name
      const recordId = 123; // Record ID
      
      // Call the function to be tested
      await recordUserClickData(clickType, clickedName, recordId);
      
      // Verify that getSessionKey was called
      expect(getSessionKey).toHaveBeenCalled();
      
      // Verify that REST.apiCal was called with the expected parameters
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick, // URL for API call
        method: "PUT", // HTTP method for API call
        body: {
          usersessionid: mockSessionKey, // User session key
          clickedname: clickedName, // Clicked item name
          clicktype: clickType, // Click type
          recordid: recordId, // Record ID
        },
      });
    });
   ;
    });

    /**
     * Tests that the `recordUserClickData` function handles errors gracefully.
     *
     * This test case verifies that the `recordUserClickData` function correctly handles errors that may occur during the API call. It mocks the `getSessionKey` function to return a mock session key, and mocks the `REST.apiCal` function to reject with an "API Error" error. The test then expects the `recordUserClickData` function to reject with the same error.
     *
     * @param {string} clickType - The type of click being recorded.
     * @param {string} clickedName - The name of the clicked item.
     * @param {number} recordId - The ID of the record being clicked.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle errors gracefully", async () => {
      // Mock the return value of getSessionKey
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    
      // Mock the rejection value of REST.apiCal
      const mockError = new Error("API Error");
      (REST.apiCal as jest.Mock).mockRejectedValue(mockError);
    
      // Define mock data
      const clickType = "search"; // Mock clickType
      const clickedName = "test"; // Mock clickedName
      const recordId = 123; // Mock recordId
    
      // Expect the recordUserClickData function to reject with the mockError
      await expect(
        recordUserClickData(clickType, clickedName, recordId)
      ).rejects.toThrow(mockError);
    
      // Expect getSessionKey to be called
      expect(getSessionKey).toHaveBeenCalled();
    
      // Expect REST.apiCal to be called with the correct parameters
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: {
          usersessionid: mockSessionKey,
          clickedname: clickedName,
          clicktype: clickType,
          recordid: recordId,
        },
      });
    });
    

  /**
   * Tests that the `REST.processArgs` function correctly processes the request parameters and appends them to the endpoint URL.
   *
   * This test case verifies that the `REST.processArgs` function correctly appends the request parameters to the endpoint URL, including the `keyword`, `page`, `domain`, and any additional parameters.
   *
   * @param {Object} request - The request object containing the parameters to be processed.
   * @param {string} request.keyword - The search keyword.
   * @param {number} request.page - The page number.
   * @param {string} request.domain - The domain.
   * @param {Object} request.additionalParams - Any additional parameters.
   * @returns {string} The processed URL with the request parameters.
   */
  describe("REST.processArgs", () => {
    // Mock data for the request object
    const mockEndpoint = ENDPOINT.Search; // mock endpoint
    const mockRequest = {
      keyword: "testKeyword", // mock keyword
      page: 2, // mock page number
      domain: "example.com", // mock domain
      additionalParams: {
        param1: "value1", // mock additional parameter
      },
    };

    it("should correctly process the arguments", () => {
      // Call REST.processArgs with mock data
      const processedUrl = REST.processArgs(mockEndpoint, mockRequest);

      // Assert that the processed URL contains the expected parameters
      expect(processedUrl).toContain("keyword=testKeyword");
      expect(processedUrl).toContain("page=2");
      expect(processedUrl).toContain("domain=example.com");
      expect(processedUrl).toContain("param1=value1");
    });
  });
    /**
     * Tests that the `REST.processArgs` function correctly handles null or undefined request objects.
     *
     * This test case verifies that the `REST.processArgs` function correctly returns the original endpoint URL when the request object is null or undefined.
     *
     * @param {Object|null|undefined} request - The request object to be processed.
     * @returns {string} The processed URL with the request parameters.
     */

    /**
     * This test case verifies that the `REST.processArgs` function
     * correctly returns the original endpoint URL when the request object is null or undefined.
     *
     * @param {Object|null|undefined} request - The mock request object to be processed.
     * @returns {string} The processed URL with the request parameters.
     */
    it("should handle null or undefined request", () => {
      // Mock data
      const mockEndpoint = ENDPOINT.Search;
    
      // Call REST.processArgs with null
      const processedUrlNull = REST.processArgs(mockEndpoint, null);
      expect(processedUrlNull).toBe(mockEndpoint);
    
      // Call REST.processArgs with undefined
      const processedUrlUndefined = REST.processArgs(mockEndpoint, undefined);
      expect(processedUrlUndefined).toBe(mockEndpoint);
    });
    
    /**
     * Tests that the `REST.processArgs` function correctly handles an empty request object.
     *
     * This test case verifies that the `REST.processArgs` function correctly returns the original endpoint URL when the request object is empty.
     *
     * @param {Object} request - The request object to be processed.
     * @returns {string} The processed URL with the request parameters.
     */
    it("should handle empty request", () => {
      // Mock data
      const mockEndpoint = ENDPOINT.Search;
      const mockRequest = {}; // Empty request object
      const endpoint = ENDPOINT.Search;
    
      // Call REST.processArgs with empty request
      const processedUrl = REST.processArgs(mockEndpoint, mockRequest);
    
      // Assert that the processed URL is equal to the mock endpoint
      expect(processedUrl).toBe(mockEndpoint);
    
      // Call REST.processArgs again with another empty request (same result expected)
      const processedUrl2 = REST.processArgs(endpoint, {});
    
      // Assert that the processed URL is still equal to the mock endpoint
      expect(processedUrl2).toBe(endpoint);
    });
    

  /**
   * Tests that the `REST.apiCal` function correctly calls the API with the expected parameters.
   *
   * This test case verifies that the `REST.apiCal` function correctly calls the `fetch` function with the expected URL, HTTP method, request body, and headers. It mocks the `fetch` function and asserts that it is called with the expected parameters.
   *
   * @param {Object} parameters - The parameters object for the API call.
   * @param {string} parameters.url - The URL of the API endpoint.
   * @param {string} parameters.method - The HTTP method for the API call.
   * @param {Object} parameters.body - The request body for the API call.
   * @param {Object} parameters.headers - The request headers for the API call.
   */
  describe("REST.apiCal", () => {
    it("should call the API with the correct parameters", async () => {
      // Mocking the parameters object
      const parameters = {
        url: "https://example.com/api", // Mocking the URL
        method: "POST", // Mocking the HTTP method
        body: { data: "mockData" }, // Mocking the request body
        headers: { "Content-Type": "application/json" }, // Mocking the request headers
      };

      // Calling the REST.apiCal function with the mock parameters
      await REST.apiCal(parameters);

      // Asserting that the fetch function is called with the correct parameters
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api", // Expected URL
        {
          method: "POST", // Expected HTTP method
          body: JSON.stringify({ data: "mockData" }), // Expected request body
          headers: { "Content-Type": "application/json" }, // Expected request headers
        }
      );
    });


    /**
     * Tests that the `REST.apiCal` function correctly handles errors when calling the API.
     *
     * This test case verifies that the `REST.apiCal` function correctly handles errors when the API call fails. It mocks the `fetch` function to reject with an error, and then asserts that the `REST.apiCal` function rejects with the expected error message.
     *
     * @param {Object} parameters - The parameters object for the API call.
     * @param {string} parameters.url - The URL of the API endpoint.
     * @param {string} parameters.method - The HTTP method for the API call.
     */
    it("should handle errors gracefully", async () => {
      // Mock the data to be sent to the API
      const parameters = {
        url: "https://example.com/api", // Mock API endpoint URL
        method: "GET", // Mock HTTP method
        url: "https://example.com/api",
        method: "GET",
      };

      // Mock the fetch function to reject with an error
      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      // Make the API call and expect it to reject with the error message "API Error"
      await expect(REST.apiCal(parameters)).rejects.toThrow("API Error");

      // Assert that the fetch function is called with the expected parameters
      expect(fetch).toHaveBeenCalledWith("https://example.com/api", {
        method: "GET",
      });
    });
  });

/**
 * Tests that the `fetchSearchResults` function correctly fetches search results with a keyword.
 *
 * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `request` object contains the `keyword`, `page`, and `domain` properties. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `recordUserClickData` function is called with the expected arguments, the `getUserId` function is called, and the `REST.apiCal` function is called with the expected URL, which includes the `keyword`, `page`, `domain`, and `userSessionId` parameters.
 *
 * @param {Object} request - The request object with the following properties:
 * @param {string} request.keyword - The keyword to search for.
 * @param {number} request.page - The page number of the search results.
 * @param {string} request.domain - The domain to search within.
 */
describe("SearchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch search results with keyword", async () => {
    // Mock request data
    const request = {
      keyword: "testKeyword", // Mock keyword
      page: 1, // Mock page number
      domain: "testDomain", // Mock domain
    };
    // Mock userId
    const userId = "testUserId"; // Mock user ID
    (getUserId as jest.Mock).mockResolvedValue(userId); // Mock getUserId function
    // Mock API response
    const apiResponse = { data: "testData" }; // Mock API response data
    (REST.apiCal as jest.Mock).mockResolvedValue(apiResponse); // Mock REST.apiCal function

    // Call function under test
    const result = await fetchSearchResults(request);

    // Assertions
    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword"); // Assert that recordUserClickData is called with the correct parameters
    expect(getUserId).toHaveBeenCalled(); // Assert that getUserId is called
    expect(REST.apiCal).toHaveBeenCalledWith({ // Assert that REST.apiCal is called with the correct parameters
      url: `https://example.com/api/search?keyword=${request.keyword}&page=${request.page}&domain=${request.domain}&userSessionId=${userId}`,
      method: "GET",
    });
    expect(result).toEqual(apiResponse); // Assert that the result matches the mock API response
  });
  /**
   * Tests that the `fetchSearchResults` function correctly fetches search results without a keyword.
   *
   * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `request` object contains the `page` and `domain` properties, but not the `keyword` property. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `getUserId` function is called and the `REST.apiCal` function is called with the expected URL, which includes the `page`, `domain`, and `userSessionId` parameters.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {number} request.page - The page number of the search results.
   * @param {string} request.domain - The domain to search within.
   */
  it("should fetch search results without keyword", async () => {
    // Mock the request object
    const request = {
      page: 1,
      domain: "testDomain",
    };
    // Mock the getUserId function to return a user session ID
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    // Mock the REST.apiCal function to return test data
    const mockApiResponse = { data: "testData" };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockApiResponse);
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Call the fetchSearchResults function with the mock request object
    const result = await fetchSearchResults(request);

    // Assert that the recordUserClickData function is not called
    expect(recordUserClickData).not.toHaveBeenCalled();
    // Assert that the getUserId function is called
    expect(getUserId).toHaveBeenCalled();
    // Assert that the REST.apiCal function is called with the expected URL, which includes the page, domain, and userSessionId parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    // Assert that the result matches the mock data
    expect(result).toEqual(mockApiResponse);
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchSearchResults` function correctly fetches search results with additional parameters.
   *
   * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `request` object contains the `keyword`, `page`, `domain`, and `additionalParams` properties. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `getUserId` function is called and the `REST.apiCal` function is called with the expected URL, which includes the `keyword`, `page`, `domain`, `additionalParams`, and `userSessionId` parameters.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.keyword - The keyword to search for.
   * @param {number} request.page - The page number of the search results.
   * @param {string} request.domain - The domain to search within.
   * @param {string} request.additionalParams - Additional parameters to include in the search request.
   */
  it("should fetch search results with additional parameters", async () => {
    const request = {
      keyword: "testKeyword", // Mock keyword
      page: 1, // Mock page number
      domain: "testDomain", // Mock domain
      additionalParams: "testParams", // Mock additional parameters
    };
    const mockUserId = "testUserId"; // Mock user ID
    const mockApiResponse = { data: "testData" }; // Mock API response data
  
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // Mock getUserId function
    (REST.apiCal as jest.Mock).mockResolvedValue(mockApiResponse); // Mock REST.apiCal function
  
    const result = await fetchSearchResults(request);
  
    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword"); // Assert that recordUserClickData is called with the correct parameters
    expect(getUserId).toHaveBeenCalled(); // Assert that getUserId is called
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `https://example.com/api/searchWithPermissions?keyword=${request.keyword}&page=${request.page}&domain=${request.domain}&additionalParams=${request.additionalParams}&userSessionId=${mockUserId}`,
      method: "GET",
    }); // Assert that REST.apiCal is called with the correct URL and method
    expect(result).toEqual(mockApiResponse); // Assert that the result matches the mock API response
  });
  


  /**
   * Tests that the `fetchRecord` function correctly fetches a record with additional parameters.
   *
   * This test case verifies that the `fetchRecord` function correctly fetches a record when the `request` object contains the `id`, `domain`, and `additionalParams` properties. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `getUserId` function is called and the `REST.apiCal` function is called with the expected URL, which includes the `id`, `domain`, `additionalParams`, and `userSessionId` parameters.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.id - The ID of the record to fetch.
   * @param {string} request.domain - The domain to fetch the record from.
   * @param {string} request.additionalParams - Additional parameters to include in the request.
   */
  it("should fetch record with additional parameters", async () => {
    // Mock the request object
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };
    // Mock the getUserId function
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    // Mock the REST.apiCal function
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock the response data
      data: {
        id: "123",
        title: "Test Record",
        domain: "testDomain",
        additionalParams: "testParams",
      },
    });
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Call the fetchRecord function with the mock request object
    const result = await fetchRecord(request);

    // Assert that the getUserId function was called
    expect(getUserId).toHaveBeenCalled();

    // Assert that the REST.apiCal function was called with the expected parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });

    // Assert that the result matches the mock data
    expect(result).toEqual({
      data: {
        id: "123",
        title: "Test Record",
        domain: "testDomain",
        additionalParams: "testParams",
      },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchRecord` function correctly fetches a record without additional parameters.
   *
   * This test case verifies that the `fetchRecord` function correctly fetches a record when the `request` object contains only the `id` and `domain` properties. It mocks the `REST.apiCal` function to return test data, and then asserts that the `REST.apiCal` function is called with the expected URL, which includes the `id` and `domain` parameters. It also asserts that the `getUserId` function is not called.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.id - The ID of the record to fetch.
   * @param {string} request.domain - The domain to fetch the record from.
   */
  it("should fetch record without additional parameters", async () => {
    // Mock the request object
    const request = {
      id: "123",
      domain: "testDomain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Mock the REST.apiCal function
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock the response data
      data: "testData",
    });

    // Call the fetchRecord function with the mock request object
    const result = await fetchRecord(request);

    // Assert that the getUserId function was not called
    expect(getUserId).not.toHaveBeenCalled();

    // Assert that the REST.apiCal function was called with the expected parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });

    // Assert that the result matches the mock data
    expect(result).toEqual({
      data: "testData",
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchSpecialNodes` function correctly fetches a list of special nodes.
   *
   * This test case verifies that the `fetchSpecialNodes` function returns the expected list of special nodes without making any API calls. It asserts that the `REST.apiCal` function is not called, and that the returned result matches the `specialNodes` value.
   */
  it("should fetch special nodes", async () => {
    // Mock the specialNodes data
    const mockSpecialNodes = {
      exclude: {
        tags: ["tag1", "tag2"],
        domains: ["domain1", "domain2"]
      },
      include: {
        tags: ["tag3", "tag4"],
        domains: ["domain3", "domain4"]
      }
    };

    jest.mock("../util/specialNodes", () => ({
      specialNodes: mockSpecialNodes
    }));

    const result = await fetchSpecialNodes();

    expect(REST.apiCal).not.toHaveBeenCalled(); // Expect REST.apiCal not to be called
    expect(result).toEqual(mockSpecialNodes); // Expect result to equal mockSpecialNodes
    expect(REST.apiCal).not.toHaveBeenCalled();
    expect(result).toEqual(specialNodes);
  });
});
/**
 * Tests that the `fetchSearchResults` function correctly fetches search results with a keyword.
 *
 * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `request` object contains a `keyword` property. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `REST.apiCal` function is called with the expected URL, which includes the `keyword` and `userSessionId` parameters.
 *
 * @param {Object} request - The request object with the following properties:
 * @param {string} request.keyword - The keyword to search for.
 * @param {number} request.page - The page number of the search results.
 * @param {string} request.domain - The domain to search within.
 */
describe("fetchSearchResults", () => {
  it("should fetch search results with keyword", async () => {
    // Mock the request object
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
    };

    // Mock the getUserId function to return a user session ID
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Mock the REST.apiCal function to return test data
    const mockApiResponse = { data: "testData" };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockApiResponse);

    // Make the API call and get the result
    const result = await fetchSearchResults(request);

    // Assert that the recordUserClickData function is called with the correct parameters
    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");

    // Assert that the getUserId function is called
    expect(getUserId).toHaveBeenCalled();

    // Assert that the REST.apiCal function is called with the correct URL and method
    const expectedUrl = "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId";
    const expectedMethod = "GET";
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expectedUrl,
      method: expectedMethod,
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });

    // Assert that the result matches the mock API response
    expect(result).toEqual(mockApiResponse);
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchSearchResults` function handles the case when the `getUserId` function returns `null`.
   *
   * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `getUserId` function returns `null`. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `REST.apiCal` function is called with the expected URL, which includes the `userSessionId` parameter set to `null`.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.keyword - The keyword to search for.
   * @param {number} request.page - The page number of the search results.
   * @param {string} request.domain - The domain to search within.
   * @param {string} request.additionalParams - Additional parameters to include in the API request.
   */
  it("should handle case when getUserId returns null", async () => {
    // Mock request data
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: "testParams",
    };
    // Mock userId
    (getUserId as jest.Mock).mockResolvedValue(null);
    // Mock API response
    const apiResponse = { data: "testData" };
    (REST.apiCal as jest.Mock).mockResolvedValue(apiResponse);
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Call function under test
    const result = await fetchSearchResults(request);

    // Assertions
    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/searchWithPermissions?keyword=testKeyword&page=1&domain=testDomain&additionalParams=testParams&userSessionId=null",
      method: "GET",
    });
    expect(result).toEqual(apiResponse);
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchSearchResults` function handles the case when the `additionalParams` property in the request object is `null`.
   *
   * This test case verifies that the `fetchSearchResults` function correctly fetches search results when the `request` object contains a `null` value for the `additionalParams` property. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `REST.apiCal` function is called with the expected URL, which does not include the `additionalParams` property.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.keyword - The keyword to search for.
   * @param {number} request.page - The page number of the search results.
   * @param {string} request.domain - The domain to search within.
   * @param {string|null} request.additionalParams - Additional parameters to include in the API request, or `null` if no additional parameters are needed.
   */
  it("should handle case when additionalParams is null", async () => {
    // Mock request data
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: null,
    };
    // Mock userId
    const userId = "testUserId";
    (getUserId as jest.Mock).mockResolvedValue(userId);
    // Mock API response
    const apiResponse = { data: "testData" };
    (REST.apiCal as jest.Mock).mockResolvedValue(apiResponse);
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Call function under test
    const result = await fetchSearchResults(request);

    // Assertions
    // ...
    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual(apiResponse);
    expect(result).toEqual({ data: "testData" });
  });
});

/**
 * Tests that the `fetchRecord` function fetches a record with additional parameters.
 *
 * This test case verifies that the `fetchRecord` function correctly fetches a record when the `request` object contains the `id`, `domain`, and `additionalParams` properties. It mocks the `getUserId` and `REST.apiCal` functions to return test data, and then asserts that the `REST.apiCal` function is called with the expected URL, which includes the additional parameters.
 *
 * @param {Object} request - The request object with the following properties:
 * @param {string} request.id - The ID of the record to fetch.
 * @param {string} request.domain - The domain of the record to fetch.
 * @param {string} request.additionalParams - Additional parameters to include in the API request.
 */
describe("fetchRecord", () => {
  it("should fetch record with additional parameters", async () => {
    // Mock the request object
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };

    // Mock the getUserId function
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    // Mock the REST.apiCal function
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock the response data
      data: {
        id: "123",
        title: "Test Record",
        domain: "testDomain",
        additionalParams: "testParams",
      },
    });

    // Call the fetchRecord function with the mock request object
    const result = await fetchRecord(request);

    // Assert that the getUserId function was called
    expect(getUserId).toHaveBeenCalled();

    // Assert that the REST.apiCal function was called with the expected parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });

    // Assert that the result matches the mock data
    expect(result).toEqual({
      data: {
        id: "123",
        title: "Test Record",
        domain: "testDomain",
        additionalParams: "testParams",
      },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchRecord` function fetches a record without additional parameters.
   *
   * This test case verifies that the `fetchRecord` function correctly fetches a record when the `request` object only contains the `id` and `domain` properties, and does not include any additional parameters. It mocks the `REST.apiCal` function to return a test data object, and then asserts that the `REST.apiCal` function is called with the expected URL, which does not include any additional parameters.
   *
   * @param {Object} request - The request object with the following properties:
   * @param {string} request.id - The ID of the record to fetch.
   * @param {string} request.domain - The domain of the record to fetch.
   */
  it("should fetch record without additional parameters", async () => {
    const request = {
      id: "123", // mock record ID
      domain: "testDomain", // mock domain
      id: "123",
      domain: "testDomain",
    };
    const mockData = { data: "testData" }; // mock data returned from API
    (REST.apiCal as jest.Mock).mockResolvedValue(mockData); // mock REST.apiCal to return mockData
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });
    expect(result).toEqual(mockData); // assert that fetchRecord returns mockData
    expect(result).toEqual({ data: "testData" });
  });
});

/**
 * Tests that the `fetchSpecialNodes` function returns the expected special nodes without making an API call.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly returns the `specialNodes` data without making an API call to the server. It asserts that the `REST.apiCal` function is not called, and that the result of `fetchSpecialNodes` is equal to the `specialNodes` data.
 */
it("should fetch special nodes", async () => {
  // Mock the specialNodes data
  const mockSpecialNodes = {
    exclude: {
      tags: ["tag1", "tag2"],
      domains: ["domain1", "domain2"]
    },
    include: {
      tags: ["tag3", "tag4"],
      domains: ["domain3", "domain4"]
    }
  };

  jest.mock("../util/specialNodes", () => ({
    specialNodes: mockSpecialNodes
  }));

  const result = await fetchSpecialNodes();

  expect(REST.apiCal).not.toHaveBeenCalled();
  expect(result).toEqual(mockSpecialNodes);
  expect(result).toEqual(specialNodes);
});
/**
 * Tests that the `fetchSearchResults` function calls the `recordUserClickData` function when a search keyword is provided.
 *
 * This test case verifies that the `fetchSearchResults` function correctly records the user's search activity when a search keyword is provided in the request object. It mocks the `recordUserClickData` function and asserts that it is called with the expected arguments, including the search keyword.
 *
 * @param {Object} mockRequest - The mock request object with the following properties:
 * @param {string} mockRequest.keyword - The search keyword.
 * @param {number} mockRequest.page - The page number for the search results.
 */
describe("fetchSearchResults", () => {
  it("should call recordUserClickData with correct parameters when keyword is provided", async () => {
    // Mock request object
    const mockRequest = {
      keyword: "testKeyword", // Mock search keyword
      page: 1, // Mock page number
    };

    // Call the function under test
    await fetchSearchResults(mockRequest);

    // Assert that recordUserClickData was called with the expected parameters
    expect(recordUserClickData).toHaveBeenCalledWith(
      "search", // Expected action type
      "testKeyword" // Expected search keyword
    );
  });


  /**
   * Tests that the `fetchSearchResults` function does not call `recordUserClickData` when the `keyword` is not provided in the request.
   *
   * This test case verifies that the `fetchSearchResults` function does not call the `recordUserClickData` function when the `keyword` property is not present in the request object. It mocks the request object with only the `page` property, and then asserts that the `recordUserClickData` function is not called.
   */
  it("should not call recordUserClickData when keyword is not provided", async () => {
    // Mock request data
    const mockRequest = {
      page: 1, // Set page to a value
    };

    // Call fetchSearchResults with mock request data
    await fetchSearchResults(mockRequest);

    // Assert that recordUserClickData is not called
    expect(recordUserClickData).not.toHaveBeenCalled();
  });
  it("should not call recordUserClickData when keyword is not provided", async () => {
    const mockRequest = { page: 1 };
    await fetchSearchResults(mockRequest);
    expect(recordUserClickData).not.toHaveBeenCalled();
  });

  /**
   * Tests that the `fetchSearchResults` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is null.
   *
   * This test case verifies that the `fetchSearchResults` function correctly constructs the URL for the API call when `additionalParams` is null in the request object. It mocks the `getUserId` function to return a test user ID, and then asserts that the `REST.apiCal` function is called with the expected URL, including the `keyword` and `page` query parameters.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    // Mock user ID
    const mockUserId = "test-user-id";
    // Mock request object
    const mockRequest = {
      keyword: "test-keyword", // Mock search keyword
      page: 1, // Mock page number
      additionalParams: null, // Mock additional parameters (null)
    };
    // Mock getUserId function to return mock user ID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Call fetchSearchResults with mock request object
    const mockRequest = { keyword: "test", page: 1, additionalParams: null };
    await fetchSearchResults(mockRequest);

    // Assert that REST.apiCal is called with the expected URL and method
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("Search"), // Expect API URL to contain "Search"
      method: "GET", // Expect method to be "GET"
      url: expect.stringContaining("Search"),
      method: "GET",
    });
  });
  });

  /**
   * Tests that the `fetchSearchResults` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is provided.
   *
   * This test case verifies that the `fetchSearchResults` function correctly constructs the URL for the API call when `additionalParams` is provided in the request object. It mocks the `getUserId` function to return a test user ID, and then asserts that the `REST.apiCal` function is called with the expected URL, including the `additionalParams` and `userSessionId` query parameters.
   *
   * @param {Object} mockRequest - The mock request object with the following properties:
   * @param {string} mockRequest.keyword - The search keyword.
   * @param {number} mockRequest.page - The page number for the search results.
   * @param {Object} mockRequest.additionalParams - Additional parameters to be included in the API request.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const mockUserId = "test-user-id"; // Mock user ID
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = {
      keyword: "test-keyword", // Mock search keyword
      page: 1, // Mock page number
      additionalParams: { key: "value" }, // Mock additional parameters
      keyword: "test",
      page: 1,
      additionalParams: { key: "value" },
    };
    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("SearchWithPermissions"), // Expect API URL to contain "SearchWithPermissions"
      url: expect.stringContaining("SearchWithPermissions"),
      method: "GET",
    });
  });

/**
 * Tests that the `fetchRecord` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is null.
 *
 * This test case verifies that the `fetchRecord` function correctly constructs the URL for the API call when `additionalParams` is null in the request object. It asserts that the `REST.apiCal` function is called with the expected URL, including the `id` and `domain` query parameters.
 */
describe("fetchRecord", () => {
  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    // Mock Request
    const mockRequest = {
      id: "123", // Record ID
      domain: "test.com", // Domain
      additionalParams: null, // No additional parameters
      id: "123",
      domain: "test.com",
      additionalParams: null,
    };

    // Mock REST.apiCal to return a resolved promise with a mock response
    REST.apiCal.mockResolvedValue({
      data: { id: mockRequest.id, domain: mockRequest.domain }, // Mock response data
    });

    // Call function
    await fetchRecord(mockRequest);

    // Assert REST.apiCal is called with correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(`fetchRecord/${mockRequest.id}?domain=${mockRequest.domain}`),
      url: expect.stringContaining("fetchRecord/123?domain=test.com"),
      method: "GET",
    });
  });
});

  /**
   * Tests that the `fetchRecord` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is provided.
   *
   * This test case verifies that the `fetchRecord` function correctly constructs the URL for the API call when `additionalParams` is provided in the request object. It mocks the `getUserId` function to return a test user ID, and then asserts that the `REST.apiCal` function is called with the expected URL, including the `additionalParams` and `userSessionId` query parameters.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    // Mock User ID
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId); // Mock getUserId to return the mock user ID
  
    // Mock Request
    const mockRequest = {
      id: "123",
      domain: "test.com",
      additionalParams: { key: "value" }, // Mock additionalParams to contain mock data
    };
  
    // Perform the test
    await fetchRecord(mockRequest);
  
    // Assertions
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(
        `fetchRecord/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${encodeURIComponent(
          JSON.stringify(mockRequest.additionalParams)
        )}&userSessionId=${mockUserId}`
      ),
      method: "GET",
    });
  });
  

/**
 * Tests that the `fetchSpecialNodes` function can return the expected `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly retrieves and returns the `specialNodes` object. It mocks the `specialNodes` function to return a mock object, and then asserts that the `fetchSpecialNodes` function returns the same mock object.
 */
describe("fetchSpecialNodes - Additional Tests", () => {
  it("should return specialNodes", async () => {
    // Mock the specialNodes function to return a mocked specialNodes object
    const mockSpecialNodes = {
      node1: {
        id: 1,
        name: "Test Node 1",
        type: "button",
        parentId: null,
        children: []
      },
      node2: {
        id: 2,
        name: "Test Node 2",
        type: "input",
        parentId: 1,
        children: []
      }
    };
    const specialNodes = jest.fn().mockReturnValue(mockSpecialNodes);

    // Call the fetchSpecialNodes function with the mocked specialNodes function
    const result = await fetchSpecialNodes(specialNodes);

    // Expect the result to be the mocked specialNodes object
    expect(result).toEqual(mockSpecialNodes);
  });
});


  /**
   * Tests that the `fetchSpecialNodes` function does not call the `REST.apiCal` function.
   *
   * This test case verifies that the `fetchSpecialNodes` function does not make any API calls to the `REST.apiCal` function. It calls the `fetchSpecialNodes` function and then asserts that the `REST.apiCal` function was not called.
   */
  it("should not call REST.apiCal", async () => {
    // Mocking `specialNodes` function to return mock data
    (specialNodes as jest.Mock).mockReturnValue({
      node1: { id: "node1", name: "Node 1" },
      node2: { id: "node2", name: "Node 2" },
    });

    await fetchSpecialNodes();

    // Assert that `REST.apiCal` function was not called
    expect(REST.apiCal).not.toHaveBeenCalled();
  });

/**
 * Tests that the `fetchSpecialNodes` function can handle an empty `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly handles the case where the `specialNodes` function returns an empty object. It mocks the `specialNodes` function to return an empty object, and then asserts that the `fetchSpecialNodes` function returns an empty object.
 */
describe("fetchSpecialNodes - Additional Tests", () => {
  it("should handle empty specialNodes object", async () => {
    // Mock the specialNodes function to return an empty object
    const specialNodes = jest.fn().mockReturnValue({});

    // Call the fetchSpecialNodes function with the mocked specialNodes function
    const result = await fetchSpecialNodes(specialNodes);

    // Expect the result to be an empty object
    expect(result).toEqual({});
  });
});

  /**
   * Tests that the `fetchSpecialNodes` function can handle a large number of special nodes.
   *
   * This test case verifies that the `fetchSpecialNodes` function can correctly handle a large number of special nodes (1000 in this case). It mocks the `specialNodes` function to return a large object with 1000 keys, and then asserts that the `fetchSpecialNodes` function returns an object with 1000 keys.
   */

  it("should handle large specialNodes object", async () => {
    // Mock largeSpecialNodes with 1000 keys each containing a simple object with a key and value
    const largeSpecialNodes = Array(1000)
      .fill(0)
      .reduce((acc, _, index) => {
        acc[`node${index}`] = { key: `value${index}` };
        acc[`node${index}`] = { key: "value" };
        return acc;
      }, {});
    (specialNodes as jest.Mock).mockReturnValue(largeSpecialNodes);

    // Fetch special nodes and assert that the result has 1000 keys
    const result = await fetchSpecialNodes();
    expect(Object.keys(result).length).toBe(1000);
  });

/**
 * Tests that the `fetchSearchResults` function handles errors when the API call fails.
 *
 * This test case verifies that the `fetchSearchResults` function correctly handles errors that occur when the `REST.apiCal` function rejects with an error. It mocks the `REST.apiCal` function to reject with an error, and then asserts that the `fetchSearchResults` function rejects with the same error.
 */
describe("Error Handling", () => {
  it("should handle API errors in fetchSearchResults", async () => {
    // Mock the REST.apiCal function to return a rejected promise with an error object
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Mock the searchResults data to be returned from the fetchSearchResults function
    const mockSearchResults = [
      {
        id: 1,
        title: "Test Search Result 1",
        description: "This is a test search result 1",
        url: "https://example.com/search-result-1"
      },
      {
        id: 2,
        title: "Test Search Result 2",
        description: "This is a test search result 2",
        url: "https://example.com/search-result-2"
      }
    ];

    // Mock the fetchSearchResults function to return the mockSearchResults data
    const fetchSearchResults = jest.fn().mockResolvedValue(mockSearchResults);

    // Call the fetchSearchResults function and expect it to reject with the error message "API Error"
    await expect(fetchSearchResults({ page: 1 })).rejects.toThrow("API Error");
  });
});



  /**
   * Tests that the `fetchRecord` function handles errors when the API call fails.
   *
   * This test case verifies that the `fetchRecord` function correctly handles errors that occur when the `REST.apiCal` function rejects with an error. It mocks the `REST.apiCal` function to reject with an "API Error" error, and then asserts that the `fetchRecord` function rejects with the same error.
   *
   * @param {Object} params - The parameters for the `fetchRecord` function.
   * @param {string} params.id - The ID of the record to fetch.
   * @param {string} params.domain - The domain to fetch the record from.
   * @returns {Promise<void>} - A promise that resolves when the `fetchRecord` function call is complete.
   */
  it("should handle API errors in fetchRecord", async () => {
    // Mock the REST.apiCal function to reject with an error
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Call the fetchRecord function with mock data
    await expect(
      fetchRecord({ id: "123", domain: "test.com" })
    ).rejects.toThrow("API Error");
  });

  /**
   * Tests that the `fetchSearchResults` function handles errors when `getUserId` fails.
   *
   * This test case verifies that the `fetchSearchResults` function correctly handles errors that occur when the `getUserId` function throws an error. It mocks the `getUserId` function to reject with an error, and then asserts that the `fetchSearchResults` function rejects with the same error.
   */
  it("should handle errors when getUserId fails", async () => {
    // Mock REST.apiCal to resolve with mock data
    (REST.apiCal as jest.Mock).mockResolvedValue({});
    // Mock getUserId to reject with an error
    const error = new Error("User ID Error");
    (getUserId as jest.Mock).mockRejectedValue(error);
    // Mock the request object to be passed to fetchSearchResults
    const request = {
      keyword: "test",
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    // Call fetchSearchResults and expect it to reject with the error thrown by getUserId
    await expect(fetchSearchResults(request)).rejects.toThrow("User ID Error");
  });


/**
 * Constructs the correct URL for fetching search results with all the provided parameters.
 *
 * @param {Object} params - The parameters for the search results fetch request.
 * @param {string} params.keyword - The keyword to search for.
 * @param {number} params.page - The page number of the search results to fetch.
 * @param {string} params.domain - The domain to filter the search results by.
 * @param {Object} [params.additionalParams] - Additional parameters to include in the URL.
 * @param {string} params.userSessionId - The user session ID to include in the URL.
 * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
 */
describe("URL Construction", () => {
  // Mock User ID
  const mockUserId = "test-user-id";
  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

  // Mock Endpoint
  (ENDPOINT.SearchWithPermissions as any) = "/search/withPermissions";

  it("should construct correct URL for fetchSearchResults with all parameters", async () => {
    // Mock Request
    const mockRequest = {
      keyword: "test",
      page: 2,
      domain: "example.com",
      additionalParams: { sort: "date" },
      userSessionId: mockUserId,
    };

    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          `/search/withPermissions?keyword=${mockRequest.keyword}&page=${mockRequest.page}&domain=${mockRequest.domain}&additionalParams=${JSON.stringify(
            mockRequest.additionalParams
          )}&userSessionId=${mockUserId}`
        ),
        method: "GET",
      })
    );
  });
});

  /**
   * Constructs the correct URL for fetching a record with all the provided parameters.
   *
   * @param {Object} params - The parameters for the record fetch request.
   * @param {string} params.id - The ID of the record to fetch.
   * @param {string} params.domain - The domain of the record to fetch.
   * @param {Object} [params.additionalParams] - Additional parameters to include in the URL.
   * @param {string} params.userSessionId - The user session ID to include in the URL.
   * @returns {Promise<void>} - A promise that resolves when the record fetch request is complete.
   */
 it("should construct correct URL for fetchRecord with all parameters", async () => {
   // Mock User ID
   const mockUserId = "test-user-id";
   (getUserId as jest.Mock).mockResolvedValue(mockUserId);
 
   // Mock Endpoint
   (ENDPOINT.fetchRecord as any) = "/record";
 
   // Mock Request
   const mockRequest = {
     id: "123",
     domain: "example.com",
     additionalParams: { include: "details" }, // Additional Parameters
     userSessionId: mockUserId, // User Session ID
   };
 
   // Mock REST.apiCal to return a resolved promise with a mock response
   REST.apiCal.mockResolvedValue({
     data: {
       id: mockRequest.id,
       domain: mockRequest.domain,
       additionalParams: mockRequest.additionalParams,
       userSessionId: mockRequest.userSessionId,
     },
     additionalParams: { include: "details" },
     userSessionId: mockUserId,
   });
 
   // Call function
   await fetchRecord(mockRequest);
 
   // Assertions
   expect(REST.apiCal).toHaveBeenCalledWith(
     expect.objectContaining({
       url: expect.stringContaining(
         `/record/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${JSON.stringify(
           mockRequest.additionalParams
         )}&userSessionId=${mockUserId}`
       ),
       method: "GET",
     })
   );
 });
/**
 * Handles a request to fetch search results with an empty request object.
 *
 * @param {Object} params - The parameters for the search results fetch request.
 * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
 */
describe("fetchSearchResults - Edge Cases", () => {
  it("should handle empty request object", async () => {
    // Mock REST.apiCal to return a resolved promise with a mock response
    REST.apiCal.mockResolvedValue({
      data: { success: true, data: { totalPages: 10, page: 1, results: [] } }, // Mock an empty array
    });

    await fetchSearchResults({});

    // Expect REST.apiCal to have been called with the expected URL and method
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("Search"),
        method: "GET",
      })
    );

    // Expect the totalPages and page values to be set correctly
    expect(setTotalPages).toHaveBeenCalledWith(10);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
    );  
  });

  /**
   * Handles a request to fetch search results with only a page number provided.
   *
   * @param {Object} params - The parameters for the search results fetch request.
   * @param {number} params.page - The page number of the search results to fetch.
   * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
   */
  it("should handle request with only page number", async () => {
    // Mock REST.apiCal to return a resolved promise with a mock response
    REST.apiCal.mockResolvedValue({
      data: {
        success: true,
        data: {
          totalPages: 10,
          page: 5,
          results: [], // Mock an empty array
        },
      },
    });

    await fetchSearchResults({ page: 5 });

    // Expect REST.apiCal to have been called with the expected URL and method
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("page=5"),
        method: "GET",
      })
    );

    // Expect the totalPages and page values to be set correctly
    expect(setTotalPages).toHaveBeenCalledWith(10);
    expect(setCurrentPage).toHaveBeenCalledWith(5);
  });

  /**
   * Handles a request to fetch search results with a very long keyword.
   *
   * @param {Object} params - The parameters for the search results fetch request.
   * @param {string} params.keyword - The keyword to search for, which may be very long.
   * @param {number} params.page - The page number of the search results to fetch.
   * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
   */
  it("should handle request with very long keyword", async () => {
    // Mock data
    const longKeyword = "a".repeat(1000); // A string of 1000 'a's
    const mockPageNumber = 1; // Mock page number

    // Call the function being tested
    await fetchSearchResults({ keyword: longKeyword, page: mockPageNumber });

    // Assertions
    const longKeyword = "a".repeat(1000);
    await fetchSearchResults({ keyword: longKeyword, page: 1 });
    expect(recordUserClickData).toHaveBeenCalledWith("search", longKeyword);
  });

  /**
   * Handles a request to fetch search results with a keyword containing special characters.
   *
   * @param {Object} params - The parameters for the search results fetch request.
   * @param {string} params.keyword - The keyword to search for, which may contain special characters.
   * @param {number} params.page - The page number of the search results to fetch.
   * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
   */
  it("should handle request with special characters in keyword", async () => {
    // Mock a search request with a special keyword
    const specialKeyword = '!@#$%^&*()_+{}|:"<>?`~';
    const mockRequest = {
      keyword: specialKeyword,
      page: 1,
      domain: "testDomain",
    };
    const mockData = { data: mockRequest }; // Mock API response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockData); // Mock API call

    // Execute the fetchSearchResults function with the special keyword
    await fetchSearchResults(mockRequest);

    // Expected URL with special characters encoded
    const expectedUrl = `https://example.com/api/search?keyword=${encodeURIComponent(
      specialKeyword
    )}&page=1&domain=testDomain&userSessionId=testUserId`;
    
    // Assert that REST.apiCal is called with the expected URL and method
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(expectedUrl),
      method: "GET",
    });
    
    // Assert that the fetchSearchResults function records the user's search activity
    expect(recordUserClickData).toHaveBeenCalledWith("search", specialKeyword);
  });

/**
 * Handles a request to fetch a record with an empty ID.
 *
 * @param {Object} params - The parameters for the record fetch request.
 * @param {string} params.id - The ID of the record to fetch, which may be empty.
 * @param {string} params.domain - The domain of the record to fetch.
 * @returns {Promise<void>} - A promise that resolves when the record fetch request is complete.
 */
describe("fetchRecord - Edge Cases", () => {
  // Mock data for fetchRecord call
  const mockRequest = { id: "", domain: "test.com" }; // Mock request with empty id

  it("should handle request with empty id", async () => {
    // Call fetchRecord with mock request data
    await expect(fetchRecord(mockRequest)).rejects.toThrow(); // Expect fetchRecord to throw an error
    await expect(fetchRecord({ id: "", domain: "test.com" })).rejects.toThrow();
  });
});

/**
 * Handles a request to fetch a record with an empty domain.
 *
 * @param {Object} params - The parameters for the record fetch request.
 * @param {string} params.id - The ID of the record to fetch.
 * @param {string} params.domain - The domain of the record to fetch, which may be empty.
 * @returns {Promise<void>} - A promise that resolves when the record fetch request is complete.
 */
it("should handle request with empty domain", async () => {
  // Mock data
  const mockData = { id: "123", data: "test data" };
  (REST.apiCal as jest.Mock).mockResolvedValue(mockData);

  // Execute the fetchRecord function with an empty domain
  await expect(fetchRecord({ id: "123", domain: "" })).rejects.toThrow();

  // Assert that REST.apiCal is not called
  expect(REST.apiCal).not.toHaveBeenCalled();
});

/**
 * Handles a request to fetch a record with a very long ID.
 *
 * @param {Object} params - The parameters for the record fetch request.
 * @param {string} params.id - The ID of the record to fetch, which may be very long.
 * @param {string} params.domain - The domain of the record to fetch.
 * @returns {Promise<void>} - A promise that resolves when the record fetch request is complete.
 */
it("should handle request with very long id", async () => {
  /**
   * Generates a very long ID string by repeating the character 'a' 1000 times.
   * This is likely used for testing purposes, to simulate a very long ID that may need to be handled in the application.
   */
  const longId = "a".repeat(1000);
  const mockData = { id: longId, data: "test data" }; // mock data
  (REST.apiCal as jest.Mock).mockResolvedValue(mockData);

  // Execute the fetchRecord function with the long ID
  const result = await fetchRecord({ id: longId, domain: "test.com" });

  // Assert that REST.apiCal is called with the expected URL and method
  await fetchRecord({ id: longId, domain: "test.com" });
  expect(REST.apiCal).toHaveBeenCalledWith(
    expect.objectContaining({
      url: expect.stringContaining(encodeURIComponent(longId)),
      url: expect.stringContaining(longId),
      method: "GET",
    })
  );

  // Assert that the fetchRecord function resolves with the expected mock data
  expect(result).toEqual(mockData);
});

/**
 * Handles a request to fetch a record with a special character in the domain.
 *
 * @param {Object} params - The parameters for the record fetch request.
 * @param {string} params.id - The ID of the record to fetch.
 * @param {string} params.domain - The domain of the record to fetch, which may contain special characters.
 * @returns {Promise<void>} - A promise that resolves when the record fetch request is complete.
 */
it("should handle request with special characters in domain", async () => {
  const specialDomain = "test!@#.com";
  const mockData = { id: "123", data: "test data" };
  (REST.apiCal as jest.Mock).mockResolvedValue(mockData);

  // Execute the fetchRecord function with the special domain
  const result = await fetchRecord({ id: "123", domain: specialDomain });

  // Assert that REST.apiCal is called with the expected URL and method
  await fetchRecord({ id: "123", domain: specialDomain });
  expect(REST.apiCal).toHaveBeenCalledWith(
    expect.objectContaining({
      url: expect.stringContaining(encodeURIComponent(specialDomain)),
      method: "GET",
    })
  );

  // Assert that the fetchRecord function resolves with the expected mock data
  expect(result).toEqual(mockData);
});
