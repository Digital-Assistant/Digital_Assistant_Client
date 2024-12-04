/**
 * This code imports various modules and functions that are used in the `recordService_deleterecording.test.ts` file. The imports include:
 * - `getUserId` from `../services/userService`: Used to get the user's ID.
 * - `ENDPOINT` from `../config/endpoints`: Likely contains API endpoint configurations.
 * - `REST` from `../services`: Provides a REST API client.
 * - `domJSON` from `domjson`: Provides JSON serialization/deserialization functionality.
 * - `TSON` from `typescript-json`: Provides TypeScript-specific JSON serialization/deserialization.
 * - `UDAConsoleLogger` and `UDAErrorLogger` from `../config/error-log`: Provide logging functionality.
 * - `fetchDomain` from `../util/fetchDomain`: Likely provides a way to fetch data from a domain.
 * - `userService` from `../services/userService`: Provides user-related functionality.
 * - `deleteRecording` from `../services/recordService`: Provides a function to delete a recording.
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
import { deleteRecording } from "../services/recordService";

/**
 * This code sets up mocks for various dependencies used in the `recordService_deleterecording.test.ts` file. The mocks are used to simulate the behavior of these dependencies during testing.
 *
 * The mocks include:
 * - `domjson.toJSON`: Mocked to be an empty function.
 * - `TSON.stringify`: Mocked to return a constant JSON string.
 * - `UDAConsoleLogger` and `UDAErrorLogger`: Mocked to have `info` and `error` functions that do nothing.
 * - `userService.getSessionKey` and `userService.getUserId`: Mocked to be empty functions.
 * - `REST.apiCal`: Mocked to be an empty function.
 * - `fetchDomain`: Mocked to be an empty function.
 *
 * These mocks allow the tests in the `recordService_deleterecording.test.ts` file to run without relying on the actual implementation of these dependencies, which can help isolate the behavior being tested.
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

describe("deleteRecording", () => {
  it("should throw an error if request object is not provided", async () => {
    // Mock data: No request object provided
    const request = undefined;
    // Expect an error to be thrown
    await expect(deleteRecording(request)).rejects.toThrowError(
      "Request object is required"
    );
  });

  /**
   * Tests that the `deleteRecording` function handles errors gracefully.
   *
   * This test sets up a mock request object with valid data, mocks the user ID returned by `getUserId`, and mocks the `REST.apiCal` function to throw an error. It then calls the `deleteRecording` function with the mock request object and asserts that:
   * - An error is thrown with the expected message
   * - The error is logged using the `UDAErrorLogger.error` function
   *
   * @async
   * @param {object} request - The mock request data to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle errors gracefully", async () => {
    // Mock data: Error thrown by REST.apiCal
    const request = {
      id: "123456789",
      sequenceid: "123456789",
    };
    // Mock getUserId to return a valid user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue("user123");
    // Mock REST.apiCal to throw an error
    jest.spyOn(REST, "apiCal").mockRejectedValue(new Error("API call failed"));
    // Expect an error to be thrown and logged
    await expect(deleteRecording(request)).rejects.toThrowError(
      "API call failed"
    );
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/^Error in deleteRecording:/),
      expect.any(Error)
    );
  });

  /**
   * Tests that the `deleteRecording` function returns the result of the `REST.apiCal` function.
   *
   * This test sets up a mock request object with valid data, mocks the user ID returned by `getUserId`, and mocks the response from `REST.apiCal`. It then calls the `deleteRecording` function with the mock request object and asserts that the result of `REST.apiCal` is returned.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should return the result of REST.apiCal", async () => {
    // Mock data: Request object with valid data and mock response from REST.apiCal
    const request = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
    };
    // Mock getUserId to return a valid user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue("user123");
    // Mock REST.apiCal to return a promise with a mock response
    jest
      .spyOn(REST, "apiCal")
      .mockReturnValue(Promise.resolve({ success: true }));
    // Call the function and expect the result of REST.apiCal to be returned
    const result = await deleteRecording(request);
    expect(result).toEqual({ success: true });
  });
  /**
   * Tests that the `deleteRecording` function successfully deletes a recording.
   *
   * This test sets up a mock request object with valid data, mocks the user ID returned by `getUserId`, and mocks the response from `REST.apiCal`. It then calls the `deleteRecording` function with the mock request object and asserts that:
   * - `getUserId` was called
   * - `REST.apiCal` was called with the correct parameters, including the mock user ID in the request body
   * - The result of `REST.apiCal` was returned
   *
   * @async
   * @param {object} request - The mock request data to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should successfully delete a recording", async () => {
    // Mock request object with valid data
    const request = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
    };

    // Mock the user ID returned by getUserId
    const userId = "user123";

    // Mock the response from REST.apiCal
    const apiResponse = { success: true };

    // Call the deleteRecording function with the mock request object
    const result = await deleteRecording(request);

    // Assert that getUserId was called
    expect(getUserId).toHaveBeenCalled();

    // Assert that REST.apiCal was called with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...request, usersessionid: userId },
    });

    // Assert that the result of REST.apiCal was returned
    expect(result).toEqual(apiResponse);
  });
  /**
   * Tests that the `deleteRecording` function sets the correct `usersessionid` field in the request body when making an API call.
   *
   * This test sets up a mock request object and a mock user ID, and then calls the `deleteRecording` function with the mock request. It then asserts that the `REST.apiCal` function was called with a request body that contains the mock user ID in the `usersessionid` field.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should set the correct usersessionid in the request", async () => {
    const mockRequest = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
    };

    const mockUserId = "user123";

    // Call the function and assert that the correct userId is used in the request
    await deleteRecording(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Ensure that the usersessionid field is set in the request body
        body: expect.objectContaining({ usersessionid: mockUserId }),
      })
    );
  });

  /**
   * Tests that the `deleteRecording` function uses the correct endpoint and HTTP method when making an API call.
   *
   * This test sets up a mock request object and calls the `deleteRecording` function with it. It then asserts that the `REST.apiCal` function was called with the correct endpoint (`ENDPOINT.DeleteSequence`) and HTTP method (`"POST"`), and that the request body contains the mock request data.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should use the correct endpoint and method for the API call", async () => {
    const mockRequest = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
    };

    // Call the function with the mock request and assert that the correct
    // endpoint and method are used in the API call
    await deleteRecording(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Ensure the correct endpoint is used
        url: ENDPOINT.DeleteSequence,
        // Ensure the correct method is used
        method: "POST",
        // Ensure the request body contains the mock request data
        body: expect.objectContaining(mockRequest),
      })
    );
  });

  /**
   * Tests that the `deleteRecording` function successfully deletes a recording with an empty request object.
   *
   * This test sets up an empty mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `deleteRecording` with the empty mock request and asserts that the `getUserId` function was called, the `REST.apiCal` function was called with the correct parameters (including the user ID), and the result of the API call is an object with a 'success' property set to true.
   *
   * @async
   * @param {object} emptyRequest - An empty mock request object to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle empty request object", async () => {
    // Mock an empty request object
    const emptyRequest = {};

    // Call the function with the empty request and assert that the correct
    // userId is used in the request
    const result = await deleteRecording(emptyRequest);

    // Assert that the getUserId function was called
    expect(getUserId).toHaveBeenCalled();

    // Assert that the REST.apiCal function was called with the correct endpoint
    // and method, and that the request body contains the userId
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Ensure the correct endpoint is used
      url: ENDPOINT.DeleteSequence,
      // Ensure the correct method is used
      method: "POST",
      // Ensure the request body contains the userId
      body: { usersessionid: await getUserId() },
    });

    // Assert that the result of the function is an object with a 'success' property
    // set to true
    expect(result).toEqual({ success: true });
  });

  /**
   * Tests that the `deleteRecording` function successfully deletes a recording with a request containing additional properties.
   *
   * This test sets up a mock request object with an additional property, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `deleteRecording` with the mock request and asserts that the `getUserId` function was called, the `REST.apiCal` function was called with the correct parameters (including the additional property), and the result of the API call is the mock response.
   *
   * @async
   * @param {object} extendedRequest - The mock request data with an additional property to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle request object with additional properties", async () => {
    // Mock request with an additional property
    const extendedRequest = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      // This property is not expected to be part of the request
      extraProp: "value",
    };
    const mockUserId = "user123";
    const mockApiResponse = { success: true };

    const result = await deleteRecording(extendedRequest);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    // Verify that REST.apiCal was called with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      // Verify that the request body contains all properties of the request object
      // except for the additional property
      body: {
        ...extendedRequest,
        usersessionid: mockUserId,
        extraProp: undefined,
      },
    });
    // Verify that the result of REST.apiCal was returned
    expect(result).toEqual(mockApiResponse);
  });
  /**
   * Tests that the `deleteRecording` function successfully deletes a recording with a request containing a missing property.
   *
   * This test sets up a mock request object with a missing property, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `deleteRecording` with the mock request and asserts that the `getUserId` function was called, the `REST.apiCal` function was called with the correct parameters (including the missing property), and the result of the API call is the mock response.
   *
   * @async
   * @param {object} requestWithMissingProperty - The mock request data with a missing property to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a request with a missing property", async () => {
    // Request with a missing property
    const requestWithMissingProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      // Missing property
    };

    // Mock user ID returned by getUserId
    const mockUserId = "user123";
    // Mock API response
    const mockApiResponse = { success: true };
    // Call deleteRecording with the request containing a missing property
    const result = await deleteRecording(requestWithMissingProperty);
    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: {
        ...requestWithMissingProperty,
        usersessionid: mockUserId,
        someProperty: undefined,
      },
    });
    expect(result).toEqual(mockApiResponse);
  });

  /**
   * Tests that the `deleteRecording` function successfully deletes a recording with a request containing a null property.
   *
   * This test sets up a mock request object with a null property, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `deleteRecording` with the mock request and asserts that the `getUserId` function was called, the `REST.apiCal` function was called with the correct parameters (including the null property), and the result of the API call is the mock response.
   *
   * @async
   * @param {object} requestWithNull - The mock request data with a null property to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a request with a null property", async () => {
    // Request with a null property
    const requestWithNull = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: null,
    };

    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a null property
    const result = await deleteRecording(requestWithNull);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a null property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithNull, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing an empty object.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with an empty object. It sets up a mock request with an empty object, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the empty object and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   *
   * @async
   * @param {object} requestWithEmptyObject - The mock request data with an empty object to be passed to `deleteRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a request with an empty object", async () => {
    // Request with an empty object
    const requestWithEmptyObject = {};
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing an empty object
    const result = await deleteRecording(requestWithEmptyObject);
    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing an empty object and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithEmptyObject, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing an empty array.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with an empty array. It sets up a mock request with an empty array, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the empty array and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   */
  test("should handle a request with an empty array", async () => {
    // Request with an empty array
    const requestWithEmptyArray = [];
    // Mock user ID returned by getUserId
    const mockUserId = "user123";
    // Mock API response
    const mockApiResponse = { success: true };
    // Call deleteRecording with the request containing an empty array
    const result = await deleteRecording(requestWithEmptyArray);
    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing an empty array and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithEmptyArray, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing an undefined property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with an undefined property. It sets up a mock request with an undefined property, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the undefined property and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   */
  test("should handle a request with an undefined property", async () => {
    // Request with an undefined property
    const requestWithUndefinedProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: undefined,
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing an undefined property
    const result = await deleteRecording(requestWithUndefinedProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing an undefined property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithUndefinedProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing a boolean property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with a boolean property. It sets up a mock request with a boolean property, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the boolean property and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   */
  test("should handle a request with a boolean property", async () => {
    // Request with a boolean property
    const requestWithBooleanProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: true,
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a boolean property
    const result = await deleteRecording(requestWithBooleanProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a boolean property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithBooleanProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing a number property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with a number property. It sets up a mock request with a number property, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the number property and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   */
  test("should handle a request with a number property", async () => {
    const requestWithNumberProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: 123,
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a number property
    const result = await deleteRecording(requestWithNumberProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a number property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithNumberProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing an object property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with an object property. It sets up a mock request with an object property, a mock user ID, and a mock API response. It then calls the `deleteRecording` function with the mock request and verifies that the function calls `getUserId` and `REST.apiCal` with the correct parameters, including the object property and the mock user ID. Finally, it verifies that the result of the API call matches the mock response.
   */
  test("should handle a request with an object property", async () => {
    // Request with an object property
    const requestWithObjectProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: { test: "test" },
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing an object property
    const result = await deleteRecording(requestWithObjectProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing an object property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithObjectProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing an array property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with an array property, and that the API call is made with the correct parameters, including the user session ID.
   *
   * @param {Object} requestWithArrayProperty - The request object with an array property.
   * @param {string} requestWithArrayProperty.id - The ID of the recording to be deleted.
   * @param {string} requestWithArrayProperty.sequenceid - The ID of the sequence associated with the recording.
   * @param {string} requestWithArrayProperty.timestamp - The timestamp of the recording.
   * @param {string} requestWithArrayProperty.url - The URL of the recording.
   * @param {Array} requestWithArrayProperty.someProperty - An array property.
   * @returns {Promise<Object>} - The response from the API call.
   */
  test("should handle a request with an array property", async () => {
    // Request with an array property
    const requestWithArrayProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: ["test", "test"],
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing an array property
    const result = await deleteRecording(requestWithArrayProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing an array property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithArrayProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing a nested object property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with a nested object property, and that the API call is made with the correct parameters, including the user session ID.
   *
   * @param {Object} requestWithNestedObjectProperty - The request object with a nested object property.
   * @param {string} requestWithNestedObjectProperty.id - The ID of the recording to be deleted.
   * @param {string} requestWithNestedObjectProperty.sequenceid - The ID of the sequence associated with the recording.
   * @param {string} requestWithNestedObjectProperty.timestamp - The timestamp of the recording.
   * @param {string} requestWithNestedObjectProperty.url - The URL of the recording.
   * @param {Object} requestWithNestedObjectProperty.someProperty - A nested object property.
   * @param {Object} requestWithNestedObjectProperty.someProperty.nested - A nested object property.
   * @returns {Promise<Object>} - The response from the API call.
   */
  test("should handle a request with a nested object property", async () => {
    // Request with a nested object property
    const requestWithNestedObjectProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: { nested: { test: "test" } },
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a nested object property
    const result = await deleteRecording(requestWithNestedObjectProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a nested object property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithNestedObjectProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });

  /**
   * Tests the `deleteRecording` function with a request containing a nested array property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with a nested array property, and that the API call is made with the correct parameters, including the user session ID.
   *
   * @param {Object} requestWithNestedArrayProperty - The request object with a nested array property.
   * @param {string} requestWithNestedArrayProperty.id - The ID of the recording to be deleted.
   * @param {string} requestWithNestedArrayProperty.sequenceid - The ID of the sequence associated with the recording.
   * @param {string} requestWithNestedArrayProperty.timestamp - The timestamp of the recording.
   * @param {string} requestWithNestedArrayProperty.url - The URL of the recording.
   * @param {Object} requestWithNestedArrayProperty.someProperty - A nested object property.
   * @param {Array} requestWithNestedArrayProperty.someProperty.nested - A nested array property.
   * @returns {Promise<Object>} - The response from the API call.
   */
  test("should handle a request with a nested array property", async () => {
    // Request with a nested array property
    const requestWithNestedArrayProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: { nested: ["test", "test"] },
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a nested array property
    const result = await deleteRecording(requestWithNestedArrayProperty);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a nested array property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...requestWithNestedArrayProperty, usersessionid: mockUserId },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
  /**
   * Tests the `deleteRecording` function with a request containing a nested object and array property.
   *
   * This test case verifies that the `deleteRecording` function correctly handles a request with a nested object and array property, and that the API call is made with the correct parameters, including the user session ID.
   *
   * @param {Object} requestWithNestedObjectAndArrayProperty - The request object with a nested object and array property.
   * @param {string} requestWithNestedObjectAndArrayProperty.id - The ID of the recording to be deleted.
   * @param {string} requestWithNestedObjectAndArrayProperty.sequenceid - The ID of the sequence associated with the recording.
   * @param {string} requestWithNestedObjectAndArrayProperty.timestamp - The timestamp of the recording.
   * @param {string} requestWithNestedObjectAndArrayProperty.url - The URL of the recording.
   * @param {Object} requestWithNestedObjectAndArrayProperty.someProperty - A nested object property.
   * @param {Array} requestWithNestedObjectAndArrayProperty.someProperty.nested - A nested array property.
   * @returns {Promise<Object>} - The response from the API call.
   */
  test("should handle a request with a nested object and array property", async () => {
    // Request with a nested object and array property
    const requestWithNestedObjectAndArrayProperty = {
      id: "123456789",
      sequenceid: "123456789",
      timestamp: "2022-01-01T12:00:00.000Z",
      url: "https://example.com",
      someProperty: { nested: ["test", "test"] },
    };
    // Mock user ID returned by getUserId
    const mockUserId = "user123";

    // Mock API response
    const mockApiResponse = { success: true };

    // Call deleteRecording with the request containing a nested object and array property
    const result = await deleteRecording(
      requestWithNestedObjectAndArrayProperty
    );

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that REST.apiCal was called with the request containing a nested object and array property and the correct user ID
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: {
        ...requestWithNestedObjectAndArrayProperty,
        usersessionid: mockUserId,
      },
    });
    expect(result).toEqual(mockApiResponse);
    // Verify that the result of the API call is the mock response
  });
});
