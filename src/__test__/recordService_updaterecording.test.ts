/**
 * This code imports various modules and functions that are used in the `recordService_updaterecording.test.ts` file. These imports are necessary for the unit tests related to updating recordings.
 *
 * The imported modules and functions include:
 * - `getUserId` from `../services/userService`: Used to get the user ID.
 * - `ENDPOINT` from `../config/endpoints`: Provides the API endpoint for updating recordings.
 * - `REST` from `../services`: Provides the API call functionality.
 * - `domJSON` from `domjson`: Used for converting objects to JSON.
 * - `TSON` from `typescript-json`: Used for stringifying JSON data.
 * - `UDAConsoleLogger` and `UDAErrorLogger` from `../config/error-log`: Provide logging functionality.
 * - `fetchDomain` from `../util/fetchDomain`: Used for fetching data from the API.
 * - `updateRecording` from `../services/recordService`: The main function for updating recordings.
 */
import { getUserId } from "../services/userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { UDAErrorLogger } from "../config/error-log";
import { updateRecording } from "../services/recordService";

/**
 * This code sets up mocks for various dependencies used in the `recordService_updaterecording.test.ts` file.
 *
 * The mocks include:
 * - `domjson.toJSON`: Mocked to be a jest.fn().
 * - `typescript-json.stringify`: Mocked to return a constant value `{"mocked":"json"}`.
 * - `UDAConsoleLogger` and `UDAErrorLogger`: Mocked to have `info` and `error` functions that are jest.fn().
 * - `userService.getSessionKey` and `userService.getUserId`: Mocked to be jest.fn().
 * - `services.REST.apiCal`: Mocked to be a jest.fn().
 * - `fetchDomain.fetchDomain`: Mocked to be a jest.fn().
 *
 * These mocks are used to isolate the unit tests from the actual implementation of these dependencies, allowing for more controlled testing.
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

describe("updateRecording", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully update recording with valid request", async () => {
    // Mock data: valid request and user ID
    const mockRequest = { data: "test" };
    const mockUserId = "user123";

    // Mock response from REST.apiCal
    const mockResponse = { success: true };

    // Mock user service getUserId and REST apiCal
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // Call updateRecording with the mock request
    const result = await updateRecording(mockRequest);

    // Verify that getUserId was called
    expect(getUserId).toHaveBeenCalled();
    // Verify that REST.apiCal was called with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: { ...mockRequest, usersessionid: mockUserId },
    });
    // Verify that the result of the API call is the mock response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests that the `updateRecording` function throws an error when the request object is not provided.
   *
   * This test calls `updateRecording` with an undefined request object and asserts that the function throws an error with the message "Request object is required".
   *
   * @async
   * @param {object|undefined} request - The request object to be passed to `updateRecording`. This is set to `undefined` to test the error case.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should throw an error when request is not provided", async () => {
    // Mock data: no request object provided
    const request = undefined;

    // Expect an error to be thrown
    await expect(updateRecording(request)).rejects.toThrow(
      "Request object is required"
    );
  });

  /**
   * Tests that the `updateRecording` function logs and rethrows an error when the `REST.apiCal` function fails.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to throw a mock error. It then calls `updateRecording` with the mock request and asserts that the error is logged with the correct message and that the error is rethrown.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should log and rethrow error when REST.apiCal fails", async () => {
    // Mock data: valid request and user ID
    const mockRequest = { data: "test" };
    const mockUserId = "user123";

    // Mock error from REST.apiCal
    const mockError = new Error("API call failed");

    // Mock user service getUserId and REST apiCal
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);

    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );

    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });

  /**
   * Tests that the `updateRecording` function sets the `usersessionid` property in the request object sent to the API.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the request object sent to `apiCal` has the correct `usersessionid` value.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should set usersessionid in the request object", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "user456";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the request object sent to apiCal has the correct usersessionid
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ usersessionid: mockUserId }),
      })
    );
  });

  /**
   * Tests that the `updateRecording` function uses the POST method for the API call.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the request object sent to `apiCal` has the correct `POST` method.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should use POST method for the API call", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "user789";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the request object sent to apiCal has the correct method
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
      })
    );
  });
  /**
   * Tests that the `updateRecording` function uses the correct endpoint URL.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the request object sent to `apiCal` has the correct `ENDPOINT.updateRecordSequence` URL.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should use the correct endpoint URL", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "user123";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the request object sent to apiCal has the correct ENDPOINT
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.updateRecordSequence,
      })
    );
  });

  /**
   * Tests that the `updateRecording` function handles an empty request object.
   *
   * This test sets up a mock request object with an empty object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the request object sent to `apiCal` has the correct user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle empty request object", async () => {
    // Mock request data: empty object
    const mockRequest = {};
    // Mock user ID
    const mockUserId = "user123";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the request object sent to apiCal has the correct ENDPOINT and user ID
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { usersessionid: mockUserId },
      })
    );
  });

  /**
   * Tests that the `updateRecording` function handles a rejection from the `getUserId` function.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to reject with a mock error, and then calls `updateRecording` with the mock request. It asserts that `updateRecording` rejects with the expected error message, and that the error is logged with the correct message and the mock error object.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle getUserId rejection", async () => {
    // Mock request data: valid request object
    const mockRequest = { data: "test" };
    // Mock error from user service getUserID
    const mockError = new Error("Failed to get user ID");
    // Mock user service getUserID to throw the error
    (getUserId as jest.Mock).mockRejectedValue(mockError);

    // Call updateRecording with the mock request and expect it to throw an error
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "Failed to get user ID"
    );

    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: Failed to get user ID",
      mockError
    );
  });

  /**
   * Tests that the `updateRecording` function passes through additional properties in the request object.
   *
   * This test sets up a mock request object with additional properties, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the request object sent to `REST.apiCal` contains the expected properties, including the additional properties from the original request.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should pass through additional properties in request", async () => {
    // Mock data: valid request object with additional properties
    const mockRequest = { data: "test", additionalProp: "value" };
    // Mock user ID
    const mockUserId = "user123";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the request object sent to apiCal has the correct ENDPOINT, method, and user ID
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.updateRecordSequence,
        method: "POST",
        body: expect.objectContaining({
          data: "test",
          additionalProp: "value",
          usersessionid: mockUserId,
        }),
      })
    );
  });
  /**
   * Tests that the `updateRecording` function handles a rejection from the REST API call.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to reject with a mock error. It then calls `updateRecording` with the mock request and asserts that the function rejects with the expected error message, and that the error is logged with the correct message and the mock error object.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle REST apiCal rejection", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "user123";
    // Mock error from REST.apiCal
    const mockError = new Error("API call failed");
    // Mock user service getUserId and REST apiCal
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function handles a rejection from the `getUserId` function.
   *
   * This test sets up a mock request object, mocks the `getUserId` function to reject with a mock error, and then calls `updateRecording` with the mock request. It asserts that the function rejects with the expected error message, and that the error is logged with the correct message and the mock error object.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a rejection from the getUserId function", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock error from getUserId
    const mockError = new Error("Failed to get user ID");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockRejectedValue(mockError);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "Failed to get user ID"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: Failed to get user ID",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function includes all the expected properties in the API call.
   *
   * This test sets up a mock request object with various properties, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to resolve with a success response. It then calls `updateRecording` with the mock request and asserts that the `REST.apiCal` function was called with an object containing all the expected properties from the mock request.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should include all request properties in the API call", async () => {
    const domain = "example.com"; // Mocked domain
    const mockRequest = {
      domain,
      urlpath: window.location.pathname, // Current URL path
      clickednodename: "Test Button",
      html5: 0, // Default value
      clickedpath: "", // Default empty string
      objectdata: JSON.stringify({ key: "value" }), // Mocked JSON string
    };

    // Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Mock API call to return success
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.updateRecordSequence,
        method: "POST",
        body: expect.objectContaining({
          // Mocked domain
          domain,
          // Current URL path
          urlpath: window.location.pathname,
          // Mocked button name
          clickednodename: "Test Button",
          // Default value
          html5: 0,
          // Default empty string
          clickedpath: "",
          // Mocked JSON string
          objectdata: JSON.stringify({ key: "value" }),
          // Mocked user ID
          usersessionid: "user123",
        }),
      })
    );
  });
  /**
   * Tests that the `updateRecording` function throws an error if the API call fails.
   *
   * This test sets up a mock request with data, a mock user ID, and a mock error from the `REST.apiCal` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should throw an error if the API call fails", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "user123";
    // Mock error from REST.apiCal
    const mockError = new Error("API call failed");
    // Mock user service getUserId and REST apiCal
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });

  /**
   * Tests that the `updateRecording` function throws an error if the user ID cannot be retrieved.
   *
   * This test sets up a mock request with data, and a mock error from the `getUserId` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   */
  test("should throw an error if the user ID cannot be retrieved", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock error from getUserId
    const mockError = new Error("Failed to get user ID");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockRejectedValue(mockError);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "Failed to get user ID"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: Failed to get user ID",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function throws an error if the user ID is not a string.
   *
   * This test sets up a mock request with data, a mock user ID of a number, and a mock error from the `getUserId` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   */
  test("should throw an error if the user ID is not a string", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = 123;
    // Mock error from getUserId
    const mockError = new Error("API call failed");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function throws an error if the user ID is empty.
   *
   * This test sets up a mock request with data, a mock user ID of an empty string, and a mock error from the `getUserId` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   */
  test("should throw an error if the user ID is empty", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = "";
    // Mock error from getUserId
    const mockError = new Error("API call failed");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function throws an error if the user ID is null.
   *
   * This test sets up a mock request with data, a mock user ID of `null`, and a mock error from the `getUserId` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   */
  test("should throw an error if the user ID is null", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = null;
    // Mock error from getUserId
    const mockError = new Error("API call failed");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });
  /**
   * Tests that the `updateRecording` function throws an error if the user ID is undefined.
   *
   * This test sets up a mock request with data, a mock user ID of `undefined`, and a mock error from the `getUserId` function. It then calls the `updateRecording` function with the mock request and asserts that the function rejects with the expected error message. It also asserts that the error is logged with the correct message.
   */
  test("should throw an error if the user ID is undefined", async () => {
    // Mock request data
    const mockRequest = { data: "test" };
    // Mock user ID
    const mockUserId = undefined;
    // Mock error from getUserId
    const mockError = new Error("API call failed");
    // Mock user service getUserId
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Call updateRecording with the mock request
    await expect(updateRecording(mockRequest)).rejects.toThrow(
      "API call failed"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecording: API call failed",
      mockError
    );
  });
});
