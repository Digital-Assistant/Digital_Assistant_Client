/**
 * This code imports various modules and functions used in the `recordService_profanityCheck.test.ts` file. These imports are used to set up mocks and simulate the behavior of these modules and functions during testing.
 *
 * The imported modules and functions include:
 * - `ENDPOINT` from `../config/endpoints`: Used to access the API endpoint configuration.
 * - `REST` from `../services`: Used to mock the `apiCal` function for testing.
 * - `domJSON` from `domjson`: Used to mock the `toJSON` function for testing.
 * - `TSON` from `typescript-json`: Used to mock the `stringify` function for testing.
 * - `UDAConsoleLogger` and `UDAErrorLogger` from `../config/error-log`: Used to mock the console and error logging functions for testing.
 * - `fetchDomain` from `../util/fetchDomain`: Used to mock the `fetchDomain` function for testing.
 * - `CONFIG` from `../config`: Used to access the application configuration.
 * - `userService` from `../services/userService`: Used to mock the `getSessionKey` and `getUserId` functions for testing.
 * - `profanityCheck` from `../services/recordService`: The function being tested.
 */
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import * as userService from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";
import { profanityCheck } from "../services/recordService";

/**
 * This code sets up mocks for various modules and functions used in the `recordService_profanityCheck.test.ts` file. The mocks are used to simulate the behavior of these modules and functions during testing.
 *
 * The mocked modules and functions include:
 * - `domjson`: The `toJSON` function is mocked to return an empty function.
 * - `typescript-json`: The `stringify` function is mocked to return a constant JSON string.
 * - `../config/error-log`: The `UDAConsoleLogger` and `UDAErrorLogger` objects are mocked with jest.fn() functions.
 * - `../services/userService`: The `getSessionKey` and `getUserId` functions are mocked with jest.fn() functions.
 * - `../services`: The `REST` object and its `apiCal` function are mocked with jest.fn() functions.
 * - `../util/fetchDomain`: The `fetchDomain` function is mocked with jest.fn().
 *
 * These mocks are used to isolate the testing of the `profanityCheck` function from the actual implementation of these modules and functions, allowing for more focused and controlled testing.
 */
// Mock the domjson function with an empty function
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
// Mock the TSON.stringify function with a constant value
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
}));
// Mock the UDAConsoleLogger and UDAErrorLogger objects
jest.mock("../config/error-log", () => ({
  UDAConsoleLogger: { info: jest.fn() },
  UDAErrorLogger: { error: jest.fn() },
}));
jest.mock("../services/userService", () => ({
  // Mock getSessionKey function
  getSessionKey: jest.fn(),
  // Mock getUserId function
  getUserId: jest.fn(),
}));
// Mock services module
jest.mock("../services", () => ({
  // Mock REST object
  REST: {
    // Mock apiCal function
    apiCal: jest.fn(),
  },
}));
// Mock fetchDomain module
jest.mock("../util/fetchDomain", () => ({
  // Mock fetchDomain function
  fetchDomain: jest.fn(),
}));

describe("profanityCheck", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  /**
   * Tests that the `profanityCheck` function calls the REST API with the correct parameters.
   *
   * This test sets up a mock response from the REST API, calls `profanityCheck` with a mock request, and asserts that the request object sent to `REST.apiCal` has the correct `ENDPOINT`, `method`, and `body` properties.
   *
   * @async
   * @param {string} request - The mock request data to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */

  it("should call REST.apiCal with the correct parameters", async () => {
    // Mock request data
    const request = "test request";
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "mockedData" });

    // Call profanityCheck with the mock request
    await profanityCheck(request);

    // Assert that the request object sent to apiCal has the correct ENDPOINT, method, and request data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers: expect.any(Headers),
    });
  });

  /**
   * Tests that the profanity check API call sets the correct headers.
   *
   * This test sets up a mock request object, calls `profanityCheck` with the mock request, and asserts that the request object sent to `REST.apiCal` has the correct headers:
   * - Content-Type: "text/plain"
   * - Ocp-Apim-Subscription-Key: the profanity API key from the CONFIG object
   *
   * @async
   * @param {string} request - The mock request data to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should set the correct headers", async () => {
    // Mock request data
    const request = "test request";

    // Call profanityCheck with the mock request
    await profanityCheck(request);

    // Assert that the request object sent to apiCal has the correct headers
    expect.objectContaining({
      headers: expect.objectContaining({
        // Set the Content-Type header to "text/plain"
        "Content-Type": "text/plain",
        // Set the Ocp-Apim-Subscription-Key header to the profanity API key
        "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
      }),
    });
  });

  /**
   * Tests that the `profanityCheck` function throws an error if the request object is not provided.
   *
   * This test sets up a mock request object with all the required properties, and then calls `profanityCheck` without passing the request object. It expects the function to throw an error with the message "Request object is required".
   *
   * @async
   * @param {Object} mockRequest - The mock request object with all the required properties.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should throw an error if the request object is not provided", async () => {
    // Mock request object with all required properties
    const mockRequest = {
      // Domain name
      domain: "example.com", // current domain
      // URL path
      urlpath: window.location.pathname, // current path
      // Button name
      clickednodename: "Test Button", // button name
      // HTML5 flag
      html5: 0, // set to 0
      // Clicked path
      clickedpath: "", // empty string by default
      // Object data with key-value pair
      objectdata: JSON.stringify({ key: "value" }), // object data as JSON string
    };

    // Call profanityCheck with mock request and expect it to throw an error
    await expect(profanityCheck()).rejects.toThrow(
      "Request object is required"
    );
  });

  /**
   * Tests that the profanity check API call logs the correct error message when an error occurs.
   *
   * This test sets up a mock request object, mocks the `REST.apiCal` function to throw an error, calls `profanityCheck` with the mock request, and asserts that the error is logged with the correct message.
   *
   * @async
   * @param {Object} mockRequest - The mock request object to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should log and rethrow errors using UDAErrorLogger", async () => {
    // Mock error message
    const errorMessage = "Test error";
    // Mock REST.apiCal to throw the error
    (REST.apiCal as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    // Call profanityCheck with mock request and expect it to throw the error
    await expect(
      profanityCheck({
        domain: "example.com",
        urlpath: "/testPath",
        clickednodename: "Test Button",
        html5: 0,
        clickedpath: "",
        objectdata: JSON.stringify({ key: "value" }),
      })
    ).rejects.toThrow(errorMessage);

    expect.stringContaining(`Error in profanityCheck: ${errorMessage}`),
      expect.any(Error);
  });

  /**
   * Tests that the profanity check API call returns the expected result.
   *
   * This test sets up a mock response from the `REST.apiCal` function, calls `profanityCheck` with a test request, and asserts that the result matches the expected response.
   *
   * @async
   * @param {string} request - The request object to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should return the result from REST.apiCal", async () => {
    const expectedResult = {
      // Mock response from API with expected data
      data: "test data",
    };

    // Mock REST.apiCal to return the expected response
    (REST.apiCal as jest.Mock).mockResolvedValueOnce(expectedResult);

    // Call profanityCheck with a request and expect it to return the expected response
    const result = await profanityCheck("test request");
    expect(result).toEqual(expectedResult);
  });

  /**
   * Tests that the profanity check API call logs the correct error message when an error occurs.
   *
   * This test sets up a mock request object, mocks the `REST.apiCal` function to throw an error, calls `profanityCheck` with the mock request, and asserts that the error is logged with the correct message.
   *
   * @async
   * @param {Object} mockRequest - The mock request object to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should call UDAErrorLogger.error with the correct error message", async () => {
    // Mock data: invalid request with missing Ocp-Apim-Subscription-Key header
    const mockRequest = {
      domain: "example.com",
      urlpath: "/testPath",
      clickednodename: "testText",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    };

    // Mock error from REST.apiCal
    const error = new Error("Test error");
    (REST.apiCal as jest.Mock).mockRejectedValueOnce(error);

    // Mock UDAErrorLogger.error
    const errorLoggerSpy = jest
      .spyOn(UDAErrorLogger, "error")
      .mockImplementation(() => {});

    // Call profanityCheck with mock request and expect it to throw an error
    await expect(profanityCheck(mockRequest)).rejects.toThrow(error);

    // Clean up the spy
    errorLoggerSpy.mockRestore();
  });

  /**
   * Tests that the profanity check API call is made to the correct endpoint.
   *
   * This test sets up a mock request object, mocks the `REST.apiCal` function to return a mocked response, calls `profanityCheck` with the mock request, and asserts that the API call was made to the correct endpoint.
   *
   * @async
   * @param {Object} request - The request object to be passed to `profanityCheck`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should use the correct profanity API endpoint", async () => {
    // Mock request data
    const request = {
      domain: "example.com",
      urlpath: "/testPath",
      clickednodename: "testText",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    };

    // Mock response from API with expected data
    const expectedResult = {
      data: "test data",
    };

    // Mock REST.apiCal to return the expected response
    (REST.apiCal as jest.Mock).mockResolvedValueOnce(expectedResult);

    // Call profanityCheck with mock request and expect it to return the expected response
    const result = await profanityCheck(request);
    expect(result).toEqual(expectedResult);

    // Assert that the API call was made to the correct endpoint
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.ProfanityCheck,
      })
    );
  });

  /**
   * Tests that the profanity check API call is made using the correct HTTP method.
   *
   * This test sets up a mock request object, calls `profanityCheck` with the mock request, and asserts that the API call was made with the "POST" HTTP method.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should use the correct HTTP method for the profanity check", async () => {
    // Mock request data
    const request = {
      domain: "example.com",
      urlpath: "/testPath",
      clickednodename: "testText",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    };

    // Call profanityCheck with mock request
    await profanityCheck(request);

    // Assert that the API call was made with the correct HTTP method
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST", // HTTP method should be "POST"
      })
    );
  });

  /**
   * Tests that the profanity check API call is made with the request object passed as the body.
   *
   * This test sets up a mock request object, mocks the `REST.apiCal` function to return a mocked response, calls `profanityCheck` with the mock request, and asserts that the API call was made with the request object passed as the body.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should pass the request object as the body of the API call", async () => {
    // Mock request data
    const request = {
      domain: "example.com",
      urlpath: "/testPath",
      clickednodename: "testText",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    };

    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "test data" });

    // Call profanityCheck with mock request
    await profanityCheck(request);

    // Assert that the request object was passed as the body of the API call
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        body: request,
      })
    );
  });

  /**
   * Tests that the profanity check API call is made with the correct Ocp-Apim-Subscription-Key header, using the value from the configuration.
   *
   * This test sets up a mock request, mocks the `REST.apiCal` function to return a mocked response, calls `profanityCheck` with the mock request, and asserts that the API call was made with the correct Ocp-Apim-Subscription-Key header.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should use the correct profanity API key from the configuration", async () => {
    // Mock request data
    const request = "test request";

    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "mockedData" });

    // Call profanityCheck with mock request
    await profanityCheck(request);

    expect.objectContaining({
      headers: expect.objectContaining({
        // Use the correct profanity API key from the configuration
        "Ocp-Apim-Subscription-Key": expect.any(String),
      }),
    });
  });
  /**
   * Tests the profanityCheck function with an empty session key.
   *
   * This test mocks the user session key to return an empty string, and mocks the API call to return success and noInteraction flag. It then calls the profanityCheck function with a mock request object and asserts that the API call was made with the correct Ocp-Apim-Subscription-Key header.
   */
  test("should handle click events with an empty session key", async () => {
    // Mock user session key to return an empty string
    (userService.getSessionKey as jest.Mock).mockResolvedValue("");
    // Mock API call to return success and noInteraction flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // API call success flag
      success: true,
      // Flag indicating no interaction occurred
      noInteraction: true,
    });
    // Mock data simulating a click on a button
    const mockRequest = {
      // Mock domain name
      domain: "example.com",
      // Mock URL path
      urlpath: "/dashboard",
      // Mock button name
      clickednodename: "Save Button",
      // Mock HTML5 value
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node data
        node: {
          // Mock node ID
          id: "save-button",
          // Mock tag name
          tagName: "BUTTON",
        },
      }),
    };

    // Call profanityCheck with mock request
    await profanityCheck(mockRequest);

    expect.objectContaining({
      headers: expect.objectContaining({
        // Use the correct profanity API key from the configuration
        "Ocp-Apim-Subscription-Key": expect.any(String),
      }),
    });
  });
  /**
   * Tests the profanityCheck function with a non-empty session key.
   *
   * This test mocks the user session key to return a non-empty string, and mocks the API call to return success and noInteraction flag. It then calls the profanityCheck function with a mock request object and asserts that the API call was made with the correct Ocp-Apim-Subscription-Key header.
   */
  test("should handle click events with a non-empty session key", async () => {
    // Mock user session key to return a non-empty string
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "test-session-key"
    );
    // Mock API call to return success and noInteraction flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // API call success flag
      success: true,
      // Flag indicating no interaction occurred
      noInteraction: true,
    });
    // Mock data simulating a click on a button
    const mockRequest = {
      // Mock domain name
      domain: "example.com",
      // Mock URL path
      urlpath: "/dashboard",
      // Mock button name
      clickednodename: "Save Button",
      // Mock HTML5 value
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node data
        node: {
          // Mock node ID
          id: "save-button",
          // Mock tag name
          tagName: "BUTTON",
        },
      }),
    };

    expect.objectContaining({
      headers: expect.objectContaining({
        // Use the correct profanity API key from the configuration
        "Ocp-Apim-Subscription-Key": expect.any(String),
      }),
    });
  });
});
