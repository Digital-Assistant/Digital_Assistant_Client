/**
 * Imports various modules and functions used in the `recordService_userclick.test.ts` file, including:
 * - `getUserId` from `../services/userService`
 * - `ENDPOINT` from `../config/endpoints`
 * - `REST` from `../services`
 * - `domJSON` from `domjson`
 * - `TSON` from `typescript-json`
 * - `UDAConsoleLogger` and `UDAErrorLogger` from `../config/error-log`
 * - `fetchDomain` from `../util/fetchDomain`
 * - `userService` from `../services/userService`
 * - `userClick` from `../services/recordService`
 *
 * These imports are used to set up mocks and simulate the behavior of the actual modules and functions during testing.
 */
import { getUserId } from "../services/userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import * as userService from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";
import { userClick } from "../services/recordService";

/**
 * This code sets up mocks for various modules and functions used in the `recordService_userclick.test.ts` file. These mocks are used to simulate the behavior of the actual modules and functions during testing.
 * The mocks include:
 * - `domjson.toJSON`: Mocked to be an empty function.
 * - `typescript-json.stringify`: Mocked to return a constant JSON string.
 * - `UDAConsoleLogger` and `UDAErrorLogger`: Mocked to have `info` and `error` functions that do nothing.
 * - `userService.getSessionKey` and `userService.getUserId`: Mocked to be functions that return a value.
 * - `services.REST.apiCal`: Mocked to be a function that returns a promise.
 * These mocks are used to isolate the testing of the `userClick` function from the actual implementation of the dependencies it uses.
 */
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

describe("userClick", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a successful request", async () => {
    // Inline comment: Mock data for the request object
    const mockSuccessRequest = {
      // Inline comment: The domain property is set to the domain from the request
      domain: "example.com",
      // Inline comment: The urlpath property is set to the path from the request
      urlpath: window.location.pathname,
      // Inline comment: The clickednodename property is set to the name from the request
      clickednodename: 'Button with <special> & "characters"',
      // Inline comment: The html5 property is set to 0
      html5: 0,
      // Inline comment: The clickedpath property is an empty string
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's an object with an id, class, and attributes.
      objectdata: JSON.stringify({
        id: "special-btn",
        class: "special-btn",
        attributes: { "data-special": "true" },
      }),
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("mock-user-id");
    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
    });

    // Inline comment: Call the userClick function with the mocked request data
    const result = await userClick(mockSuccessRequest);

    // Inline comment: Assert that the result is as expected
    expect(result).toEqual({
      success: true,
    });
    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: "PUT",
      body: {
        usersessionid: "mock-user-id",
        ...mockSuccessRequest,
      },
    });
  });

  /**
   * Tests that the `userClick` function correctly sets the `usersessionid` property in the request object.
   *
   * This test sets up mock data for the request object, including a mock user ID and a mock response from the `REST.apiCal` function. It then calls the `userClick` function with the mock request object and asserts that the `usersessionid` property is set to the mock user ID.
   *
   * @async
   * @param {object} mockSuccessRequest - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should set the usersessionid in the request object", async () => {
    // Mock the getUserId function to return a mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue("mock-user-id");
    // Mock the REST.apiCal function to return a mock response
    jest.spyOn(REST, "apiCal").mockResolvedValue({
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: 'Button with <special> & "characters"',
      html5: 0,
      clickedpath: "",
      objectdata: expect.stringContaining("special-btn"),
    });

    const mockSuccessRequest: Record<string, unknown> = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: 'Button with <special> & "characters"',
      html5: 0,
      clickedpath: "",
      objectdata: expect.stringContaining("special-btn"),
    };

    await userClick(mockSuccessRequest);

    expect(mockSuccessRequest.usersessionid).toBe("mock-user-id");
  });

  /**
   * Tests that the `userClick` function correctly sets the `clickedname` property in the request object.
   *
   * This test sets up mock data for the request object, including a mock user ID and a mock response from the `REST.apiCal` function. It then calls the `userClick` function with the mock request object and asserts that the `clickedname` property is set to the host of the current window.
   *
   * @async
   * @param {object} mockSuccessRequest - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should set the clickedname in the request object", async () => {
    // Mock the getUserId function to return a mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue("mock-user-id");
    // Mock the REST.apiCal function to return a mock response
    jest.spyOn(REST, "apiCal").mockResolvedValue({
      // Mock response data
      domain: "example.com", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: 'Button with <special> & "characters"', // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: JSON.stringify({ test: "test" }), // empty object as JSON string by default
    });

    const mockSuccessRequest: Record<string, unknown> = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: 'Button with <special> & "characters"',
      html5: 0,
      clickedpath: "",
      objectdata: expect.stringContaining("special-btn"),
    };

    await userClick(mockSuccessRequest);

    expect(mockSuccessRequest.clickedname).toBe(window.location.host);
  });

  /**
   * Tests that the `userClick` function throws an error when an invalid endpoint is used.
   *
   * This test sets up mock data for the request object, including an invalid endpoint. It then mocks the `getUserId` and `REST.apiCal` functions to return the mock data and throw an error for the invalid endpoint. It calls the `userClick` function with the mock request object and asserts that the function rejects with the expected error message.
   *
   * @async
   * @param {object} mockInvalidEndpointRequest - The mock request data with an invalid endpoint to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should throw an error if an invalid endpoint is used", async () => {
    // Mock the getUserId function to return a mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue("mock-user-id");
    // Mock the REST.apiCal function to throw an error for invalid endpoint
    jest.spyOn(REST, "apiCal").mockRejectedValue(new Error("Invalid endpoint"));

    const mockInvalidEndpointRequest = {
      usersessionid: "mock-user-id",
      clickedname: "mock-clicked-name",
      endpoint: "invalid-endpoint",
      domain: "example.com", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "mock-clicked-name", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: JSON.stringify({ test: "test" }), // empty object as JSON string by default
    };

    await expect(userClick(mockInvalidEndpointRequest)).rejects.toThrow(
      "Invalid endpoint"
    );
  });

  /**
   * Tests that the `userClick` function correctly calls the `getUserId` and `REST.apiCal` functions with the expected parameters when a request object is provided.
   *
   * This test sets up mock data for the request object, user ID, domain name, and clicked name. It then mocks the `getUserId` and `REST.apiCal` functions to return the mock data. It calls the `userClick` function with the mock request object and asserts that the `getUserId` and `REST.apiCal` functions are called with the expected parameters.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should call getUserId and apiCal with correct parameters when request object is provided", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock user ID to be used in the API call
    const userId = "testUserId";
    // Mock domain name
    const domain = "example.com"; // current domain
    // Mock button name
    const text = "testText"; // clicked name
    // Mock object data
    const jsonString = JSON.stringify({ test: "test" }); // empty object as JSON string by default
    // Spy on user service getUserId to return mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);
    // Spy on REST apiCal to return mock data
    jest.spyOn(REST, "apiCal").mockResolvedValue({
      data: {
        domain,
        urlpath: window.location.pathname,
        clickednodename: text,
        html5: 0,
        clickedpath: "",
        objectdata: jsonString,
      },
    });
    // Call userClick with mock request and await result
    await userClick(request);
    // Expect user service getUserId to be called once
    expect(userService.getUserId).toHaveBeenCalledTimes(1);
    // Expect REST apiCal to be called with correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: "PUT",
      body: {
        // Spread in the mock request data
        ...request,
        // Add user ID to the body
        usersessionid: userId,
        // Add clicked name to the body
        clickedname: window.location.host,
      },
    });
  });

  /**
   * Tests that the `userClick` function re-throws the error when the API call fails.
   *
   * This test sets up a mock request object, mocks the user ID returned by `getUserId`, and mocks the `REST.apiCal` function to throw an error. It then calls the `userClick` function with the mock request object and asserts that the function re-throws the expected error.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should re-throw error when apiCal fails", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock user ID
    const userId = "testUserId";
    // Mock error message
    const errorMessage = "API call failed";
    // Mock error object
    const error = new Error(errorMessage);
    // Mock user service getUserId to return mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);
    // Mock REST apiCal to throw error
    jest.spyOn(REST, "apiCal").mockRejectedValue(error);
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
  });

  /**
   * Tests that the `userClick` function returns the expected response when the API call is successful.
   *
   * This test sets up a mock request object with valid data, mocks the user ID returned by `getUserId`, and mocks the `REST.apiCal` function to return a successful response. It then calls the `userClick` function with the mock request object and asserts that the result is the expected response.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should return apiCal response when apiCal is successful", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock user ID
    const userId = "testUserId";
    // Mock successful API call response
    const response = { status: 200 };
    // Mock user service getUserId to return mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);
    // Mock REST apiCal to return mock data
    jest.spyOn(REST, "apiCal").mockResolvedValue(response);
    // Call userClick with mock request and await result
    const result = await userClick(request);
    // Assert that the result is as expected
    expect(result).toEqual(response);
  });
  /**
   * Tests that the `userClick` function throws an error when the API call is not successful.
   *
   * This test mocks the request data, user ID, error message, and error object, and calls the `userClick` function,
   * expecting it to throw an error with the correct message. It then asserts that the error message is as expected.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should return error message when apiCal fails", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock user ID
    const userId = "testUserId";
    // Mock error message
    const errorMessage = "API call failed";
    // Mock error object
    const error = new Error(errorMessage);
    // Mock user service getUserId to return mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);
    // Mock REST apiCal to throw error
    jest.spyOn(REST, "apiCal").mockRejectedValue(error);
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
    // Assert that the result is as expected
    expect(error.message).toEqual(errorMessage);
  });
  /**
   * Tests that the `userClick` function throws an error when the user ID is not found.
   *
   * This test mocks the request data, error message, and error object, and calls the `userClick` function,
   * expecting it to throw an error with the correct message. It then asserts that the error message is as expected.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should throw error when userId is not found", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock error message
    const errorMessage = "User ID not found";
    // Mock error object
    const error = new Error(errorMessage);
    // Mock user service getUserId to throw error
    jest.spyOn(userService, "getUserId").mockRejectedValue(error);
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
    // Assert that the result is as expected
    expect(error.message).toEqual(errorMessage);
  });
  /**
   * Tests that the `userClick` function throws an error when the API call is not successful.
   *
   * This test mocks the request data, user ID, error message, and error object, and calls the `userClick` function,
   * expecting it to throw an error with the correct message. It then asserts that the error message is as expected.
   */
  test("should throw error when apiCal is not successful", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock user ID
    const userId = "testUserId";
    // Mock error message
    const errorMessage = "API call failed";
    // Mock error object
    const error = new Error(errorMessage);
    // Mock user service getUserId to return mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);
    // Mock REST apiCal to throw error
    jest.spyOn(REST, "apiCal").mockRejectedValue(error);
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
    // Assert that the result is as expected
    expect(error.message).toEqual(errorMessage);
  });
  /**
   * Tests that the `userClick` function throws an error when the request data is not valid.
   *
   * This test mocks the request data and error message, and calls the `userClick` function,
   * expecting it to throw an error with the correct message. It then asserts that the
   * error message is as expected.
   */
  test("should throw error when request is not valid", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock error message
    const errorMessage = "API call failed";
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
    // Assert that the result is as expected
    expect(errorMessage).toEqual("API call failed");
  });
  /**
   * Tests that the `userClick` function throws an error when the `userId` is not a string.
   *
   * This test mocks the request data, error message, and calls the `userClick` function,
   * expecting it to throw an error with the correct message. It then asserts that the
   * error message is as expected.
   */
  test("should throw error when userId is not a string", async () => {
    // Mock request data
    const request = { test: "test" };
    // Mock error message
    const errorMessage = "API call failed";
    // Call userClick and expect it to throw the error with the correct message
    await expect(userClick(request)).rejects.toThrowError(errorMessage);
    // Assert that the result is as expected
    expect(errorMessage).toEqual("API call failed");
  });
});
