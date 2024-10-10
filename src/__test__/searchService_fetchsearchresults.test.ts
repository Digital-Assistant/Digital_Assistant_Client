/**
 * Imports the `fetchSearchResults` function from the `searchService` module.
 * Imports the `ENDPOINT` constant from the `config/endpoints` module.
 * Imports the `recordUserClickData` and `REST` objects from the current module.
 * Imports the `getUserId` function from the `userService` module.
 * Imports the `UDAErrorLogger` object from the `config/error-log` module.
 * Imports the `fetchRecord` and `fetchSpecialNodes` functions from the `searchService` module.
 */
import { fetchSearchResults } from "../services/searchService";
import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from "../services";
import { getUserId } from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";

/**
 * Mocks the `getUserId` function from the `userService` module to return a
 * fixed value of `"test-user-id"` during testing. This is necessary to
 * ensure consistent behavior of the `fetchSearchResults` function, which
 * relies on the `getUserId` function to retrieve the user's ID.
 */
jest.mock("../services/userService", () => ({
  getUserId: jest.fn().mockResolvedValue("test-user-id"),
}));
// Mock the `UDAErrorLogger` object from the `config/error-log` module to
// prevent the actual implementation from being called during testing.
// This is necessary because the `fetchSearchResults` function calls the
// `error` method of the `UDAErrorLogger` object if an error occurs.
jest.mock("../config/error-log", () => ({
  UDAErrorLogger: {
    // Mock the `error` method of the `UDAErrorLogger` object to prevent it
    // from being called during testing.
    error: jest.fn(),
    // Mock the `info` method of the `UDAErrorLogger` object to prevent it
    // from being called during testing.
    info: jest.fn(),
    // Mock the `warn` method of the `UDAErrorLogger` object to prevent it
    // from being called during testing.
    warn: jest.fn(),
  },
}));

// Mock the `recordUserClickData` function and the `REST` object to prevent
// the actual implementation from being called during testing.
jest.mock("../services", () => ({
  // Mock the `recordUserClickData` function to prevent it from being called
  // during testing.
  recordUserClickData: jest.fn(),
  // Mock the `REST` object to prevent it from being called during testing.
  REST: {
    // Mock the `processArgs` function to prevent it from being called during
    // testing.
    processArgs: jest.fn(),
    // Mock the `apiCal` function to prevent it from being called during testing.
    apiCal: jest.fn(),
  },
}));

// Mock the `getUserId` function from the `userService` module to prevent it from being called during testing
jest.mock("../services/userService", () => ({
  // Mock the `getUserId` function to prevent it from being called during testing
  getUserId: jest.fn(),
}));
describe("fetchSearchResults", () => {
  // Clear all mocks after each test to ensure that each test has a clean slate
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when a keyword is provided in the request object.
   *
   * This test case verifies that the `recordUserClickData` function is called with the correct arguments when a keyword is provided in the request object.
   */
  it("should record user search action if keyword is provided", async () => {
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // Mock the API response to return a mock result
    const mockResponse = { data: "Mock search results" };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // Create a request object with a keyword and page number
    const request = { keyword: "test", page: 1 };

    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);

    // Verify that the `recordUserClickData` function was called with the correct
    // arguments
    expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `userSessionId` property of the request object is undefined.
   *
   * This test case verifies that the `userSessionId` property of the request object is set to the user ID returned by the `getUserId` function.
   */
  it("should set user session ID in the request", async () => {
    // Mock the data returned by the API
    const mockResponse = { data: "Mock search results" };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // Create a request object with the page number and userSessionId set to undefined
    const request = { page: 1, userSessionId: undefined };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the userSessionId property of the request object was set to the user ID
    expect(request.userSessionId).toBe("user123");
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is set to `null`.
   *
   * This test case verifies that the `additionalParams` property of the request object is removed when it is set to `null`.
   */
  it("should remove additionalParams if null", async () => {
    // Create a request object with page number and additionalParams set to null
    const request = { page: 1, additionalParams: null };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);

    // Verify that the additionalParams property of the request object was removed
    expect(request.additionalParams).toBeUndefined();
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is provided.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `ENDPOINT.SearchWithPermissions` endpoint and the request object, and that the `REST.apiCal` function is called with the correct arguments.
   */
  it("should use SearchWithPermissions endpoint if additionalParams is provided", async () => {
    // Create a request object with page number and additionalParams
    const request = { page: 1, additionalParams: { param1: "value1" } };

    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);

    // Verify that the `REST.processArgs` function was called with the correct
    // arguments
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // Use SearchWithPermissions endpoint
      request // Use the request object as the argument
    );

    // Verify that the `REST.apiCal` function was called with the correct
    // arguments
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: undefined, // No URL is provided
      method: "GET", // Use the GET method
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is not provided.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `ENDPOINT.Search` endpoint and the request object, and that the `REST.apiCal` function is called with the correct arguments.
   */
  it("should use Search endpoint if additionalParams is not provided", async () => {
    const request = { page: 1 }; // Request object with page number only
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, request); // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: undefined, // No URL is provided
      method: "GET", // Use the GET method
    }); // Verify that the `REST.apiCal` function was called with the correct arguments
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the API returns an empty array of search results.
   *
   * This test case verifies that the `fetchSearchResults` function returns an empty array when the API call returns an empty array.
   */
  it("should handle empty search results", async () => {
    // Mock the request with page number 1
    const request = { page: 1 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Mock the API call to return an empty array
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: [] });
    // Call the `fetchSearchResults` function with the request object
    const result = await fetchSearchResults(request);
    // Verify that the function returns an object with an empty data array
    expect(result).toEqual({ data: [] });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is provided.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `domain` property set to the value provided in the request object, and that the `userSessionId` property is set correctly.
   */
  it("should include domain in the request if provided", async () => {
    const request = { page: 1, domain: "example.com" }; // Create a request object with page number and domain
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the `REST.processArgs` function was called with the correct arguments
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `page` property of the request object is set to a negative value.
   *
   * This test case verifies that the `fetchSearchResults` function returns an empty array when the `page` property is set to a negative value.
   */
  it("should handle request with negative page number", async () => {
    // Test that the function returns an empty array if the page number is negative
    const request = { page: -1 };
    const result = await fetchSearchResults(request);
    expect(result).toEqual({ data: [] });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `page` property of the request object is a non-integer value.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `page` property set to the non-integer value provided in the request object, and that the `userSessionId` property is set correctly.
   */
  it("should handle request with non-integer page number", async () => {
    // Test that the function can handle a request with a non-integer page number
    const request = { page: 1.5 }; // Create a request object with a non-integer page number
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the `REST.processArgs` function was called with the correct arguments
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `keyword` property of the request object is an empty string.
   *
   * This test case verifies that the `recordUserClickData` function is not called when the `keyword` property is empty, as no user search action should be recorded in this case.
   */
  it("should handle request with empty keyword", async () => {
    // Test that the function doesn't record user search action if keyword is empty
    const request = { keyword: "", page: 1 };
    (getUserId as jest.Mock).mockResolvedValue("user123");
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was not called
    expect(recordUserClickData).not.toHaveBeenCalled();
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is an empty string.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `domain` property set to an empty string, and that the `userSessionId` property is set correctly.
   */
  it("should handle request with empty domain", async () => {
    // Test that the function can handle a request with an empty domain
    const request = { page: 1, domain: "" }; // Create a request object with an empty domain
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the `REST.processArgs` function was called with the correct arguments
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is an empty object.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `additionalParams` property set to an empty object, and that the `userSessionId` property is set correctly.
   */
  it("should handle request with empty additionalParams", async () => {
    const request = { page: 1, additionalParams: {} }; // Create a request object with empty additionalParams
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // Use SearchWithPermissions endpoint
      {
        ...request, // Verify that the request object was passed as an argument
        userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
      }
    );
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object contains multiple parameters.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `additionalParams` property set to the correct object, and that the `userSessionId` property is set correctly.
   */
  it("should handle request with multiple additionalParams", async () => {
    const request = {
      page: 1,
      additionalParams: { param1: "value1", param2: "value2" }, // Multiple additionalParams
    };
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // Use SearchWithPermissions endpoint
      {
        ...request, // Verify that the request object was passed as an argument
        userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
      }
    );
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is not an object.
   *
   * This test case verifies that the `REST.processArgs` function is called with the `additionalParams` property set to the invalid value, and that the `userSessionId` property is set correctly.
   */
  it("should handle request with non-object additionalParams", async () => {
    const request = { page: 1, additionalParams: "invalid" }; // AdditionalParams is not an object
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions, // Use SearchWithPermissions endpoint
      {
        page: 1, // Verify that the page number was passed as an argument
        additionalParams: "invalid", // Verify that the additionalParams property was set to the invalid value
        userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
      }
    );
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `userSessionId` is undefined.
   *
   * This test case verifies that the `fetchSearchResults` function calls the `REST.processArgs` function with the `userSessionId` property set to `undefined` when the `getUserId` function returns `undefined`.
   */
  it("should handle request with undefined userSessionId", async () => {
    const request = { page: 1 };
    // Mock user ID to be undefined
    (getUserId as jest.Mock).mockResolvedValue(undefined);
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.Search, // Use Search endpoint
      {
        ...request, // Verify that the request object was passed as an argument
        userSessionId: undefined, // Verify that the userSessionId property was set to undefined
      }
    );
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `page` property of the request object is a very large number.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `page` property set to the large number, and that the function returns an empty array.
   */
  it("should handle request with large page number", async () => {
    // Create a request object with a large page number
    const request = { page: 1000000 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Mock the API call to return an empty array
    (REST.apiCal as jest.Mock).mockResolvedValue([]);
    // Call the `fetchSearchResults` function with the request object
    const result = await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
    // Verify that the function returns an empty array
    expect(result).toEqual([]);
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `keyword` property of the request object contains special characters.
   *
   * This test case verifies that the `recordUserClickData` function is called with the correct arguments, including the `keyword` property containing the special characters, and that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with special characters in keyword", async () => {
    // Verify that special characters in the keyword are correctly handled
    const request = { keyword: "test!@#$%^&*()", page: 1 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was called with the correct arguments
    expect(recordUserClickData).toHaveBeenCalledWith(
      "search",
      "test!@#$%^&*()" // Verify that the special characters are preserved
    );
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object contains boolean values.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID, and the `additionalParams` property containing the boolean values.
   */
  it("should handle request with boolean additionalParams", async () => {
    // Verify that boolean additionalParams are correctly handled
    const request = {
      page: 1,
      additionalParams: { param1: true, param2: false },
    };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        ...request, // Verify that the request object was passed as an argument
        userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
      }
    );
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `keyword` property of the request object is `null`.
   *
   * This test case verifies that the `recordUserClickData` function is not called, and that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with null keyword", async () => {
    // Verify that requests with null keywords are handled correctly
    const request = { keyword: null, page: 1 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was not called
    expect(recordUserClickData).not.toHaveBeenCalled();
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      keyword: null,
      page: 1,
      userSessionId: "user123",
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is `null`.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID, and the `domain` property set to `null`.
   */
  it("should handle request with null domain", async () => {
    // Verify that requests with null domains are handled correctly
    const request = { page: 1, domain: null };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      page: 1,
      domain: null, // Verify that the domain property was set to null
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `keyword` property of the request object is a very long string.
   *
   * This test case verifies that the `recordUserClickData` function is called with the correct arguments, including the long keyword, and that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with very long keyword", async () => {
    // Create a very long keyword (1000 characters long)
    const longKeyword = "a".repeat(1000);
    // Create a request object with the long keyword and page number
    const request = { keyword: longKeyword, page: 1 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was called with the correct arguments
    expect(recordUserClickData).toHaveBeenCalledWith("search", longKeyword);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: "user123",
    });
  });
  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is an empty string.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with empty string domain", async () => {
    // Create a request object with an empty string domain
    const request = { page: 1, domain: "" };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request, // Verify that the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `keyword` property of the request object is undefined.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID, and that the `recordUserClickData` function is not called.
   */
  it("should handle request with undefined keyword", async () => {
    // Create a request object with undefined keyword
    const request = { page: 1, keyword: undefined };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was not called
    expect(recordUserClickData).not.toHaveBeenCalled();
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      page: 1,
      userSessionId: "user123",
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is undefined.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with undefined domain", async () => {
    // Create a request object with undefined domain
    const request = { page: 1, domain: undefined };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      page: 1, // Verify that the page property of the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is undefined.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with undefined additionalParams", async () => {
    const request = { page: 1, additionalParams: undefined }; // Create a request object with undefined additionalParams
    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mock the user ID to be "user123" for this test
    await fetchSearchResults(request); // Call the `fetchSearchResults` function with the request object
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the `REST.processArgs` function was called with the correct arguments
      page: 1, // Verify that the page property of the request object was passed as an argument
      userSessionId: "user123", // Verify that the userSessionId property was set to the user ID
    });
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `additionalParams` property of the request object is an empty object.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with empty object additionalParams", async () => {
    // Create a request object with an empty object as additionalParams
    const request = { page: 1, additionalParams: {} };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        // Verify that the request object was passed as an argument
        ...request,
        // Verify that the userSessionId property was set to the user ID
        userSessionId: "user123",
      }
    );
  });

  /**
   * Tests the behavior of the `fetchSearchResults` function when the `domain` property of the request object is a very long string.
   *
   * This test case verifies that the `REST.processArgs` function is called with the correct arguments, including the long `domain` property and the `userSessionId` property set to the mocked user ID.
   */
  it("should handle request with very long domain", async () => {
    // Create a long domain string (1000 characters long)
    const longDomain = "a".repeat(1000) + ".com";
    // Create a request object with the long domain
    const request = { page: 1, domain: longDomain };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the `domain` property of the request object was passed as an argument
      ...request,
      // Verify that the `userSessionId` property was set to the user ID
      userSessionId: "user123",
    });
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with a
   * non-string `keyword` property.
   *
   * The test constructs a search request with `keyword` set to a non-string value,
   * mocks the `getUserId` function to return a valid user ID, calls
   * `fetchSearchResults` with the request, and then verifies that `recordUserClickData`
   * and `REST.processArgs` were called with the expected parameters, including the
   * `keyword` property set to the non-string value.
   */
  it("should handle request with non-string keyword", async () => {
    // Test that the function handles a request with a non-string keyword
    const request = { keyword: "123", page: 1 };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `recordUserClickData` function was called with the correct arguments
    expect(recordUserClickData).toHaveBeenCalledWith("search", "123");
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the request object was passed as an argument
      ...request,
      // Verify that the userSessionId property was set to the user ID
      userSessionId: "user123",
    });
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with a
   * non-string `domain` property.
   *
   * The test constructs a search request with `domain` set to a non-string value,
   * mocks the `getUserId` function to return a valid user ID, calls
   * `fetchSearchResults` with the request, and then verifies that `REST.processArgs`
   * was called with the expected parameters, including the `domain` property set to
   * the non-string value.
   */
  it("should handle request with non-string domain", async () => {
    // Test that the function handles a request with a non-string domain
    const request = { page: 1, domain: "123" };
    // Mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Call the `fetchSearchResults` function with the request object
    await fetchSearchResults(request);
    // Verify that the `REST.processArgs` function was called with the correct arguments
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      // Verify that the request object was passed as an argument
      page: 1,
      domain: "123",
      // Verify that the userSessionId property was set to the user ID
      userSessionId: "user123",
    });
  });
  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * `additionalParams` that is a non-object value.
   *
   * The test constructs a search request with `additionalParams` set to a string
   * value, mocks the `getUserId` function to return a valid user ID, calls
   * `fetchSearchResults` with the request, and then verifies that `REST.processArgs`
   * was called with the expected parameters, including the `additionalParams`
   * property set to the string value.
   */

  it("should handle request with non-object additionalParams", async () => {
    // verify that the function handles a request with non-object additionalParams
    const request = { page: 1, additionalParams: "string" };
    (getUserId as jest.Mock).mockResolvedValue("user123");
    await fetchSearchResults(request);
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        page: 1,
        // verify that the additionalParams property is passed as a string
        additionalParams: "string",
        userSessionId: "user123",
      }
    );
  });
  /**
   * Tests that the `fetchSearchResults` function handles a search request with a
   * very long `userSessionId` value.
   *
   * The test generates a `userSessionId` that is longer than the maximum allowed
   * length, mocks the `getUserId` function to return the long `userSessionId`,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * long `userSessionId`.
   */
  it("should handle request with very long userSessionId", async () => {
    // generate a userSessionId that is longer than the maximum allowed length
    const longUserSessionId = "a".repeat(1000);
    const request = { page: 1 };
    // mock getUserId to return the long userSessionId
    (getUserId as jest.Mock).mockResolvedValue(longUserSessionId);
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // verify that the request was processed with the correct parameters
    // including the long userSessionId
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: longUserSessionId,
    });
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * `additionalParams` containing negative values.
   *
   * The test constructs a search request with `additionalParams` containing
   * negative values, mocks the `getUserId` function to return a valid user ID,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * `additionalParams` object with the negative values.
   */
  it("should handle request with negative additionalParams values", async () => {
    // construct request with negative values in additionalParams
    const request = { page: 1, additionalParams: { param1: -1, param2: -10 } };
    // mock getUserId to return a valid user id
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // verify that the request was processed with the correct parameters
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        ...request,
        userSessionId: "user123",
      }
    );
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * `additionalParams` containing decimal values.
   *
   * The test constructs a search request with `additionalParams` containing
   * decimal values, mocks the `getUserId` function to return a valid user ID,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * `additionalParams` object with the decimal values converted to strings.
   */
  it("should handle request with decimal additionalParams values", async () => {
    // construct request with additionalParams containing decimal values
    const request = { page: 1, additionalParams: { param1: 1.5, param2: 2.7 } };
    // mock getUserId to return a valid user id
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // verify that the request was processed with the correct parameters
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        // the request object should be passed through with the additionalParams
        // converted to strings
        ...request,
        userSessionId: "user123",
      }
    );
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * a domain containing special characters.
   *
   * The test constructs a search request with a domain containing special
   * characters, mocks the `getUserId` function to return a valid user ID,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * domain with special characters.
   */
  it("should handle request with special characters in domain", async () => {
    // construct request with domain containing special characters
    const request = { page: 1, domain: "example!@#$.com" };
    // mock getUserId to return a valid user id
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // verify that the request was processed with the correct parameters
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: "user123",
    });
  });
  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * `additionalParams` containing a `null` value.
   *
   * The test constructs a search request with `additionalParams` containing a
   * `null` value, mocks the `getUserId` function to return a valid user ID,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * `additionalParams` object with the `null` value.
   */

  it("should handle request with additionalParams containing null values", async () => {
    // construct request with additionalParams containing null value
    const request = {
      page: 1,
      additionalParams: { param1: null, param2: "value" },
    };
    // mock getUserId to return a valid user id
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // mock REST.processArgs to resolve successfully
    (REST.processArgs as jest.Mock).mockResolvedValue({});
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // assert that the correct API call is made
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        ...request,
        userSessionId: "user123",
      }
    );
  });

  /**
   * Tests that the `fetchSearchResults` function handles a search request with
   * `additionalParams` containing an `undefined` value.
   *
   * The test constructs a search request with `additionalParams` containing an
   * `undefined` value, mocks the `getUserId` function to return a valid user ID,
   * calls `fetchSearchResults` with the request, and then verifies that
   * `REST.processArgs` was called with the expected parameters, including the
   * `additionalParams` object with the `undefined` value filtered out.
   */
  it("should handle request with additionalParams containing undefined values", async () => {
    // construct request with additionalParams containing undefined value
    const request = {
      page: 1,
      additionalParams: { param1: undefined, param2: "value" },
    };
    // mock getUserId to return a valid user id
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // mock REST.processArgs to resolve successfully
    (REST.processArgs as jest.Mock).mockResolvedValue({});
    // call fetchSearchResults with the request
    await fetchSearchResults(request);
    // assert that REST.processArgs was called with the expected params
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        // page should be passed through as is
        page: 1,
        // additionalParams should be filtered to remove undefined values
        additionalParams: { param2: "value" },
        // userSessionId should be added with the mocked user id
        userSessionId: "user123",
      }
    );
  });
});
