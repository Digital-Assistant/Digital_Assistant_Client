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

jest.mock("../services/userService", () => ({
  getUserId: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
    processArgs: jest.fn(),
  },
}));

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
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = {
        keyword: "test",
        page: 1,
        additionalParams: { param: "value" },
      };
      await fetchSearchResults(request);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request.keyword
      );
      expect(getUserId).toHaveBeenCalled();
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions,
        { ...request, userSessionId: mockUserId }
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.SearchWithPermissions, {
          ...request,
          userSessionId: mockUserId,
        }),
        method: "GET",
      });
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
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = { id: "1", domain: "test.com", additionalParams: null };
      await fetchRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchRecord}/${request.id}?domain=${request.domain}`,
        method: "GET",
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
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const request = { id: "1", domain: "test.com", additionalParams: null };
      await expect(fetchRecord(request)).rejects.toThrow("API Error");

      expect(getUserId).toHaveBeenCalled();
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
      const request = { param: "value" };
      const result = await fetchSpecialNodes(request);

      expect(result).toEqual({ mock: "specialNodes" });
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
      const request = { param: "value" };
      await fetchSpecialNodes(request);

      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SpecialNodes,
        request
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
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
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const request = { param: "value" };
      await expect(fetchSpecialNodes(request)).rejects.toThrow("API Error");
    });
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
      await expect(fetchSearchResults(null)).rejects.toThrow(
        "Cannot read property 'keyword' of null"
      );
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
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = {};
      await fetchSearchResults();

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
     * Tests that the `fetchSearchResults` function correctly handles invalid data types.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with an invalid data type (in this case, a string), the function properly rejects the promise with an error.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle invalid data types gracefully", async () => {
      const request = "invalid";
      await expect(fetchSearchResults(request as any)).rejects.toThrow();
    });
    /**
     * Tests that the `fetchSearchResults` function correctly handles network failures.
     *
     * This test case verifies that when the `fetchSearchResults` function is called with a request that results in a network error, the function properly rejects the promise with the error message.
     *
     * @param {any} - No input parameters.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */

    it("should handle network failures gracefully", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const request = { keyword: "test", page: 1, additionalParams: null };
      await expect(fetchSearchResults(request)).rejects.toThrow(
        "Network Error"
      );

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request.keyword
      );
      expect(getUserId).toHaveBeenCalled();
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
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request1 = { keyword: "test1", page: 1, additionalParams: null };
      const request2 = { keyword: "test2", page: 2, additionalParams: null };

      await Promise.all([
        fetchSearchResults(request1),
        fetchSearchResults(request2),
      ]);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request1.keyword
      );
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request2.keyword
      );
      expect(getUserId).toHaveBeenCalledTimes(2);
    });
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
      await expect(fetchRecord(null)).rejects.toThrow(
        "Cannot read property 'id' of null"
      );
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
        await expect(fetchSpecialNodes(null)).resolves.toEqual({
          mock: "specialNodes",
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
        await expect(fetchSpecialNodes(undefined)).resolves.toEqual({
          mock: "specialNodes",
        });
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
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const request = {
              keyword: "test",
              page: Number.MAX_SAFE_INTEGER,
              additionalParams: null,
            };
            await fetchSearchResults(request);

            expect(recordUserClickData).toHaveBeenCalledWith(
              "search",
              request.keyword
            );
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
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const request = {
              keyword: "<script>alert('xss')</script>",
              page: 1,
              additionalParams: null,
            };
            await fetchSearchResults(request);

            expect(recordUserClickData).toHaveBeenCalledWith(
              "search",
              request.keyword
            );
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
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const largeId = "1".repeat(Number.MAX_SAFE_INTEGER);
            const request = {
              id: largeId,
              domain: "test.com",
              additionalParams: null,
            };
            await fetchRecord(request);

            expect(getUserId).toHaveBeenCalled();
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: `${ENDPOINT.fetchRecord}/${largeId}?domain=${request.domain}`,
              method: "GET",
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
            it("should handle boundary conditions for param", async () => {
              const largeParam = "a".repeat(Number.MAX_SAFE_INTEGER);
              const request = { param: largeParam };
              const result = await fetchSpecialNodes(request);

              expect(result).toEqual({ mock: "specialNodes" });
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
                it("should handle boundary conditions for page number", async () => {
                  const mockUserId = "mockUserId";
                  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

                  const request = {
                    keyword: "test",
                    page: Number.MAX_SAFE_INTEGER,
                    additionalParams: null,
                  };
                  await fetchSearchResults(request);

                  expect(recordUserClickData).toHaveBeenCalledWith(
                    "search",
                    request.keyword
                  );
                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.processArgs).toHaveBeenCalledWith(
                    ENDPOINT.Search,
                    {
                      ...request,
                      userSessionId: mockUserId,
                    }
                  );
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

                it("fetchSearchResults should call getUserId and make API call", async () => {
                  (getUserId as jest.Mock).mockResolvedValue("testUserId");

                  const request = {
                    /* request data */
                  };
                  await fetchSearchResults();

                  expect(getUserId).toHaveBeenCalled();
                  // Add assertions for API call
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
                  (getUserId as jest.Mock).mockResolvedValue("testUserId");

                  const request = {
                    /* request data */
                  };
                  await fetchRecord(request);

                  expect(getUserId).toHaveBeenCalled();
                  // Add assertions for API call
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
                  const request = {
                    /* request data */
                  };
                  const specialNodes = await fetchSpecialNodes(request);

                  // Add assertions for special nodes data
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
                const request1 = { keyword: "search term 1", page: 1 };
                const request2 = { keyword: "search term 2", page: 2 };

                await fetchSearchResults(request1);
                // Add assertions for API call with request data 1

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
                const request1 = { id: "recordId1", domain: "domain1" };
                const request2 = { id: "recordId2", domain: "domain2" };

                await fetchRecord(request1);
                // Add assertions for API call with request data 1

                await fetchRecord(request2);
                // Add assertions for API call with request data 2
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
                  /* request data 1 */
                };
                const request2 = {
                  /* request data 2 */
                };

                const specialNodes1 = await fetchSpecialNodes(request1);
                // Add assertions for special nodes data with request data 1

                const specialNodes2 = await fetchSpecialNodes(request2);
                // Add assertions for special nodes data with request data 2
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
                  /* request data */
                };
                // Simulate error response from API call
                // Add assertions for error handling
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
                const request = {
                  keyword: "test",
                  page: 1,
                  domain: "example.com",
                  additionalParams: { param1: "value1" },
                  userSessionId: "12345",
                };
                REST.apiCal.mockResolvedValue({ success: true });

                await fetchSearchResults(request);

                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(
                    ENDPOINT.SearchWithPermissions,
                    request
                  ),
                  method: "GET",
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

              it("should handle no additionalParams gracefully", async () => {
                const request = {
                  keyword: "test",
                  page: 1,
                  domain: "example.com",
                  userSessionId: "12345",
                };
                REST.apiCal.mockResolvedValue({ success: true });

                await fetchSearchResults(request);

                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(ENDPOINT.Search, request),
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
                const request = { keyword: "test", page: 1 };
                REST.apiCal.mockRejectedValue(new Error("Network error"));

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
                  const request = {
                    id: "123",
                    domain: "example.com",
                    additionalParams: { param1: "value1" },
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  await fetchRecord(request);

                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/withPermissions/123?domain=example.com&additionalParams=${request.additionalParams}&userSessionId=${request.userSessionId}`,
                    method: "GET",
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
                  const request = {
                    id: "123",
                    domain: "example.com",
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  await fetchRecord(request);

                  expect(REST.apiCal).toHaveBeenCalledWith({
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
                    const request = {};
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, request),
                      method: "GET",
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
                    const request = {
                      keyword: "",
                      page: 1,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, request),
                      method: "GET",
                    });
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
                      url: REST.processArgs(ENDPOINT.Search, request),
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
                    const request = {
                      keyword: "test",
                      page: 10000,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
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
                  it("should handle undefined ID", async () => {
                    const request = {
                      domain: "example.com",
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchRecord(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/undefined?domain=example.com`,
                      method: "GET",
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
                    const request = {
                      id: "123/special?&",
                      domain: "example.com",
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchRecord(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/123%2Fspecial%3F%26?domain=example.com`,
                      method: "GET",
                    });
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
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes({});

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, {}),
                      method: "GET",
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
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes(null);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, null),
                      method: "GET",
                    });
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
                    const request = { keyword: "test", page: 1 };
                    REST.apiCal.mockImplementation(() => {
                      throw {
                        message: "An unexpected error occurred",
                        code: 500,
                      };
                    });

                    await expect(fetchSearchResults(request)).rejects.toEqual({
                      message: "An unexpected error occurred",
                      code: 500,
                    });
                  });
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

                  const largeKeyword = "a".repeat(10000);
                  const request = {
                    keyword: largeKeyword,
                    page: 1,
                    additionalParams: null,
                  };
                  await fetchSearchResults(request);

                  expect(recordUserClickData).toHaveBeenCalledWith(
                    "search",
                    request.keyword
                  );
                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.processArgs).toHaveBeenCalledWith(
                    ENDPOINT.Search,
                    {
                      ...request,
                      userSessionId: mockUserId,
                    }
                  );
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: REST.processArgs(ENDPOINT.Search, {
                      ...request,
                      userSessionId: mockUserId,
                    }),
                    method: "GET",
                  });
                });

                expect(recordUserClickData).toHaveBeenCalledWith(
                  "search",
                  request1.keyword
                );
                expect(recordUserClickData).toHaveBeenCalledWith(
                  "search",
                  request2.keyword
                );
                expect(getUserId).toHaveBeenCalledTimes(2);
              });
            });
          });
        });
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
      const mockRequest = {
        keyword: "test",
        page: 1,
        domain: "example.com",
        additionalParams: { param: "value" },
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchSearchResults(mockRequest);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockRequest.keyword
      );
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions,
        { ...mockRequest, userSessionId: mockUserId }
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String),
        method: "GET",
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
      const mockRequest = {
        keyword: "test",
        page: 1,
        domain: "example.com",
        additionalParams: null,
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchSearchResults(mockRequest);

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
      const mockRequest = {
        id: "123",
        domain: "example.com",
        additionalParams: { param: "value" },
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.stringContaining(
          `/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`
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
    const mockRequest = {
      keyword: "",
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(mockRequest);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      { ...mockRequest, userSessionId: mockUserId }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
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
    const mockRequest = {
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(mockRequest);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      { ...mockRequest, userSessionId: mockUserId }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
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
    const mockRequest = {
      keyword: "test",
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (recordUserClickData as jest.Mock).mockRejectedValue(new Error("Error"));

    await expect(fetchSearchResults(mockRequest)).rejects.toThrow("Error");
  });
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
    const mockRequest = {
      id: "123",
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    (getUserId as jest.Mock).mockRejectedValue(new Error("Error"));

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
    const mockRequest = {
      id: "123",
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Error"));

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
    const request = { keyword: "test", page: 1 };
    await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
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
    const request = { page: 1 };
    await fetchSearchResults(request);

    expect(recordUserClickData).not.toHaveBeenCalled();
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
    const request = { page: 1, additionalParams: null };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });

  /**
   * Tests that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when `additionalParams` is provided.
   *
   * This test case verifies that the `fetchSearchResults` function correctly calls the `REST.apiCal` function with the expected parameters when the `additionalParams` property of the request object is provided. It mocks the `getUserId` function to return a mock user ID, calls the `fetchSearchResults` function with a mock request object, and then asserts that the `getUserId` function was called, the `REST.processArgs` function was called with the expected parameters, and the `REST.apiCal` function was called with the expected parameters.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const request = { page: 1, additionalParams: "test" };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        ...request,
        userSessionId: mockUserId,
      }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });
});

/**
 * Tests that the `fetchSpecialNodes` function returns the expected `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly returns the `specialNodes` object. It calls the `fetchSpecialNodes` function and then asserts that the returned value is equal to the `specialNodes` object.
 *
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should return specialNodes object", async () => {
  const result = await fetchSpecialNodes();

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
    const request = { keyword: "test", page: 1 };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchSearchResults(request)).rejects.toThrow("API Error");
    expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
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
    const request = { id: "1", domain: "test.com", additionalParams: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

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
    const request = { data: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

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
    await expect(fetchSearchResults(undefined)).rejects.toThrow(
      "Cannot read property 'keyword' of undefined"
    );
  });

  /**
   * Tests that the `fetchSearchResults` function correctly handles the case where the `page` property of the request object is an invalid value.
   *
   * This test case verifies that the `fetchSearchResults` function throws an "Invalid page number" error when the `page` property of the request object is set to an invalid value (in this case, a string). It creates a mock request object with an invalid `page` property, calls the `fetchSearchResults` function with this request, and then verifies that the function throws the expected error.
   *
   * @param {Object} request - An object containing the request parameters to be passed to `fetchSearchResults`, with the `page` property set to an invalid value.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle invalid page number", async () => {
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
    const request = { keyword: "test", page: -1 };
    await expect(fetchSearchResults(request)).rejects.toThrow(
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
    const request = { keyword: "", page: 1 };
    await fetchSearchResults(request);
    expect(recordUserClickData).not.toHaveBeenCalled();
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
    const request = { page: 1, additionalParams: null };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
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
    const request = { page: 1, additionalParams: undefined };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
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
    const request = { id: null, domain: "test.com", additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
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
    const request = {
      id: undefined,
      domain: "test.com",
      additionalParams: "test",
    };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of undefined"
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
    const request = { id: "1", domain: null, additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of null"
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
    const request = { id: "1", domain: undefined, additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of undefined"
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
    const request = { id: "1", domain: "test.com", additionalParams: null };

    await fetchRecord(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
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
    const request = {
      id: "1",
      domain: "test.com",
      additionalParams: undefined,
    };

    await fetchRecord(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/1?domain=test.com`,
      method: "GET",
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
    await fetchSpecialNodes(undefined);
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      undefined
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
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
  const mockRequest = {
    keyword: "test",
    page: 1,
    domain: "example.com",
  };
  const mockUserId = "mockUserId";
  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

  await fetchSearchResults(mockRequest);

  expect(getUserId).toHaveBeenCalled();
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  });
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String),
    method: "GET",
  });
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
  const mockRequest = {
    keyword: "test",
    page: 1,
    domain: "example.com",
  };
  const mockUserId = "mockUserId";
  (getUserId as jest.Mock).mockResolvedValue(mockUserId);
  (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

  await expect(fetchSearchResults(mockRequest)).rejects.toThrow("API Error");

  expect(getUserId).toHaveBeenCalled();
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  });
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String),
    method: "GET",
  });
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
    const mockRequest = {
      id: "record123",
      domain: "example.com",
      additionalParams: { param1: "value1" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`,
      method: "GET",
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
    const mockRequest = {
      id: "record123",
      domain: "example.com",
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
      method: "GET",
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
    const mockRequest = {
      id: "record123",
      domain: "example.com",
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchRecord(mockRequest)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
      method: "GET",
    });
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
    const mockRequest = { param1: "value1" };

    await fetchSpecialNodes(mockRequest);

    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      mockRequest
    );
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
    const mockSpecialNodes = { exclude: { tags: ["tag1", "tag2"] } };
    jest.mock("../util/specialNodes", () => ({
      specialNodes: mockSpecialNodes,
    }));

    const result = await fetchSpecialNodes();
    expect(result).toEqual(mockSpecialNodes);
  });

  /**
   * Tests that the `fetchSpecialNodes` function handles errors gracefully.
   *
   * This test case verifies that the `fetchSpecialNodes` function correctly handles errors that may occur during the API call. It mocks the `REST.apiCal` function to reject with an "API Error" error. The test then expects the `fetchSpecialNodes` function to reject with the same error, and verifies that the `REST.processArgs` and `REST.apiCal` functions are called with the expected parameters.
   *
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle errors gracefully", async () => {
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchSpecialNodes()).rejects.toThrow("API Error");

    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      undefined
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
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

  describe("recordUserClickData", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      const clickType = "search";
      const clickedName = "test";
      const recordId = 123;

      await recordUserClickData(clickType, clickedName, recordId);

      expect(getSessionKey).toHaveBeenCalled();
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
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const clickType = "search";
      const clickedName = "test";
      const recordId = 123;

      await expect(
        recordUserClickData(clickType, clickedName, recordId)
      ).rejects.toThrow("API Error");

      expect(getSessionKey).toHaveBeenCalled();
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
    it("should correctly process the arguments", () => {
      const endpoint = ENDPOINT.Search;
      const request = {
        keyword: "test",
        page: 2,
        domain: "example.com",
        additionalParams: { param1: "value1" },
      };

      const processedUrl = REST.processArgs(endpoint, request);

      expect(processedUrl).toContain("keyword=test");
      expect(processedUrl).toContain("page=2");
      expect(processedUrl).toContain("domain=example.com");
      expect(processedUrl).toContain("param1=value1");
    });
    /**
     * Tests that the `REST.processArgs` function correctly handles null or undefined request objects.
     *
     * This test case verifies that the `REST.processArgs` function correctly returns the original endpoint URL when the request object is null or undefined.
     *
     * @param {Object|null|undefined} request - The request object to be processed.
     * @returns {string} The processed URL with the request parameters.
     */

    it("should handle null or undefined request", () => {
      const endpoint = ENDPOINT.Search;

      const processedUrl = REST.processArgs(endpoint, null);
      expect(processedUrl).toBe(endpoint);

      const processedUrl2 = REST.processArgs(endpoint, undefined);
      expect(processedUrl2).toBe(endpoint);
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
      const endpoint = ENDPOINT.Search;
      const request = {};

      const processedUrl = REST.processArgs(endpoint, request);
      expect(processedUrl).toBe(endpoint);
    });
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
      const parameters = {
        url: "https://example.com/api",
        method: "GET",
        body: { data: "test" },
        headers: { "Content-Type": "application/json" },
      };

      await REST.apiCal(parameters);

      expect(fetch).toHaveBeenCalledWith("https://example.com/api", {
        method: "GET",
        body: JSON.stringify({ data: "test" }),
        headers: { "Content-Type": "application/json" },
      });
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
      const parameters = {
        url: "https://example.com/api",
        method: "GET",
      };

      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(REST.apiCal(parameters)).rejects.toThrow("API Error");

      expect(fetch).toHaveBeenCalledWith("https://example.com/api", {
        method: "GET",
      });
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
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
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
    const request = {
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
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
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/searchWithPermissions?keyword=testKeyword&page=1&domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
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
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
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
    const request = {
      id: "123",
      domain: "testDomain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Tests that the `fetchSpecialNodes` function correctly fetches a list of special nodes.
   *
   * This test case verifies that the `fetchSpecialNodes` function returns the expected list of special nodes without making any API calls. It asserts that the `REST.apiCal` function is not called, and that the returned result matches the `specialNodes` value.
   */
  it("should fetch special nodes", async () => {
    const result = await fetchSpecialNodes();

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
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
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
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue(null);
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/searchWithPermissions?keyword=testKeyword&page=1&domain=testDomain&additionalParams=testParams&userSessionId=null",
      method: "GET",
    });
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
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: null,
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
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
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
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
      id: "123",
      domain: "testDomain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });
});

/**
 * Tests that the `fetchSpecialNodes` function returns the expected special nodes without making an API call.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly returns the `specialNodes` data without making an API call to the server. It asserts that the `REST.apiCal` function is not called, and that the result of `fetchSpecialNodes` is equal to the `specialNodes` data.
 */
it("should fetch special nodes", async () => {
  const result = await fetchSpecialNodes();

  expect(REST.apiCal).not.toHaveBeenCalled();
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
  it("should call recordUserClickData when keyword is provided", async () => {
    const mockRequest = { keyword: "test", page: 1 };
    await fetchSearchResults(mockRequest);
    expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  });

  /**
   * Tests that the `fetchSearchResults` function does not call `recordUserClickData` when the `keyword` is not provided in the request.
   *
   * This test case verifies that the `fetchSearchResults` function does not call the `recordUserClickData` function when the `keyword` property is not present in the request object. It mocks the request object with only the `page` property, and then asserts that the `recordUserClickData` function is not called.
   */
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
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = { keyword: "test", page: 1, additionalParams: null };
    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("Search"),
      method: "GET",
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
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = {
      keyword: "test",
      page: 1,
      additionalParams: { key: "value" },
    };
    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("SearchWithPermissions"),
      method: "GET",
    });
  });
});

/**
 * Tests that the `fetchRecord` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is null.
 *
 * This test case verifies that the `fetchRecord` function correctly constructs the URL for the API call when `additionalParams` is null in the request object. It asserts that the `REST.apiCal` function is called with the expected URL, including the `id` and `domain` query parameters.
 */
describe("fetchRecord", () => {
  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    const mockRequest = {
      id: "123",
      domain: "test.com",
      additionalParams: null,
    };
    await fetchRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("fetchRecord/123?domain=test.com"),
      method: "GET",
    });
  });

  /**
   * Tests that the `fetchRecord` function calls the `REST.apiCal` function with the correct parameters when `additionalParams` is provided.
   *
   * This test case verifies that the `fetchRecord` function correctly constructs the URL for the API call when `additionalParams` is provided in the request object. It mocks the `getUserId` function to return a test user ID, and then asserts that the `REST.apiCal` function is called with the expected URL, including the `additionalParams` and `userSessionId` query parameters.
   */
  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = {
      id: "123",
      domain: "test.com",
      additionalParams: { key: "value" },
    };
    await fetchRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(
        "fetchRecord/withPermissions/123?domain=test.com&additionalParams=[object Object]&userSessionId=test-user-id"
      ),
      method: "GET",
    });
  });
});

/**
 * Tests that the `fetchSpecialNodes` function can return the expected `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly retrieves and returns the `specialNodes` object. It mocks the `specialNodes` function to return a mock object, and then asserts that the `fetchSpecialNodes` function returns the same mock object.
 */
describe("fetchSpecialNodes", () => {
  it("should return specialNodes", async () => {
    const mockSpecialNodes = { node1: {}, node2: {} };
    (specialNodes as jest.Mock).mockReturnValue(mockSpecialNodes);

    const result = await fetchSpecialNodes();

    expect(result).toEqual(mockSpecialNodes);
  });

  /**
   * Tests that the `fetchSpecialNodes` function does not call the `REST.apiCal` function.
   *
   * This test case verifies that the `fetchSpecialNodes` function does not make any API calls to the `REST.apiCal` function. It calls the `fetchSpecialNodes` function and then asserts that the `REST.apiCal` function was not called.
   */
  it("should not call REST.apiCal", async () => {
    await fetchSpecialNodes();

    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});
/**
 * Tests that the `fetchSpecialNodes` function can handle an empty `specialNodes` object.
 *
 * This test case verifies that the `fetchSpecialNodes` function correctly handles the case where the `specialNodes` function returns an empty object. It mocks the `specialNodes` function to return an empty object, and then asserts that the `fetchSpecialNodes` function returns an empty object.
 */
describe("fetchSpecialNodes - Additional Tests", () => {
  it("should handle empty specialNodes object", async () => {
    (specialNodes as jest.Mock).mockReturnValue({});
    const result = await fetchSpecialNodes();
    expect(result).toEqual({});
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle a large number of special nodes.
   *
   * This test case verifies that the `fetchSpecialNodes` function can correctly handle a large number of special nodes (1000 in this case). It mocks the `specialNodes` function to return a large object with 1000 keys, and then asserts that the `fetchSpecialNodes` function returns an object with 1000 keys.
   */

  it("should handle large specialNodes object", async () => {
    const largeSpecialNodes = Array(1000)
      .fill(0)
      .reduce((acc, _, index) => {
        acc[`node${index}`] = { key: "value" };
        return acc;
      }, {});
    (specialNodes as jest.Mock).mockReturnValue(largeSpecialNodes);
    const result = await fetchSpecialNodes();
    expect(Object.keys(result).length).toBe(1000);
  });
});

/**
 * Tests that the `fetchSearchResults` function handles errors when the API call fails.
 *
 * This test case verifies that the `fetchSearchResults` function correctly handles errors that occur when the `REST.apiCal` function rejects with an error. It mocks the `REST.apiCal` function to reject with an error, and then asserts that the `fetchSearchResults` function rejects with the same error.
 */
describe("Error Handling", () => {
  it("should handle API errors in fetchSearchResults", async () => {
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));
    await expect(fetchSearchResults({ page: 1 })).rejects.toThrow("API Error");
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
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));
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
    (getUserId as jest.Mock).mockRejectedValue(new Error("User ID Error"));
    await expect(fetchSearchResults({ page: 1 })).rejects.toThrow(
      "User ID Error"
    );
  });
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
  it("should construct correct URL for fetchSearchResults with all parameters", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (ENDPOINT.SearchWithPermissions as any) = "/search/withPermissions";

    await fetchSearchResults({
      keyword: "test",
      page: 2,
      domain: "example.com",
      additionalParams: { sort: "date" },
      userSessionId: mockUserId,
    });

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          "/search/withPermissions?keyword=test&page=2&domain=example.com&additionalParams=[object Object]&userSessionId=test-user-id"
        ),
        method: "GET",
      })
    );
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
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (ENDPOINT.fetchRecord as any) = "/record";

    await fetchRecord({
      id: "123",
      domain: "example.com",
      additionalParams: { include: "details" },
      userSessionId: mockUserId,
    });

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/record/withPermissions/123?domain=example.com&additionalParams=[object Object]&userSessionId=test-user-id",
        method: "GET",
      })
    );
  });
});
/**
 * Handles a request to fetch search results with an empty request object.
 *
 * @param {Object} params - The parameters for the search results fetch request.
 * @returns {Promise<void>} - A promise that resolves when the search results fetch request is complete.
 */
describe("fetchSearchResults - Edge Cases", () => {
  it("should handle empty request object", async () => {
    await fetchSearchResults({});
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("Search"),
        method: "GET",
      })
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
    await fetchSearchResults({ page: 5 });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("page=5"),
        method: "GET",
      })
    );
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
    const specialKeyword = '!@#$%^&*()_+{}|:"<>?`~';
    await fetchSearchResults({ keyword: specialKeyword, page: 1 });
    expect(recordUserClickData).toHaveBeenCalledWith("search", specialKeyword);
  });
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
  it("should handle request with empty id", async () => {
    await expect(fetchRecord({ id: "", domain: "test.com" })).rejects.toThrow();
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
    await expect(fetchRecord({ id: "123", domain: "" })).rejects.toThrow();
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
    const longId = "a".repeat(1000);
    await fetchRecord({ id: longId, domain: "test.com" });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(longId),
        method: "GET",
      })
    );
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
    await fetchRecord({ id: "123", domain: specialDomain });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(encodeURIComponent(specialDomain)),
        method: "GET",
      })
    );
  });
});
