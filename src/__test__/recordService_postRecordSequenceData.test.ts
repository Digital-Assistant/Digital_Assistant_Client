/**
 * This code imports various utility functions, services, and configuration objects that are used in the `recordService_postRecordSequenceData.test.ts` file.
 *
 * - `getAbsoluteOffsets` is a utility function that retrieves the absolute offsets of an element.
 * - `domJSON` is a library for converting DOM elements to JSON.
 * - `TSON` is a library for converting TypeScript objects to JSON.
 * - `UDAConsoleLogger` and `UDAErrorLogger` are logging utilities.
 * - `fetchDomain` is a utility function for fetching domain-specific data.
 * - `CONFIG` is a configuration object.
 * - `getFromStore` is a utility function for retrieving data from a store.
 * - `postRecordSequenceData` is a function from the `recordService` module.
 */
import { getAbsoluteOffsets } from "../util";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import { getFromStore } from "../util"; // Import getFromStore
import { UDAErrorLogger } from "../config/error-log";
import { postRecordSequenceData } from "../services/recordService";

/**
 * This code sets up a series of mocks for various utility functions, services, and configuration objects used in the `recordService_postRecordSequenceData.test.ts` file. These mocks are used to simulate the behavior of these dependencies during testing.
 *
 * The mocks include:
 * - Mocking the `domjson.toJSON` function to return an empty function.
 * - Mocking the `TSON.stringify` function to return a constant JSON string.
 * - Mocking the `UDAConsoleLogger` and `UDAErrorLogger` objects to have mocked `info` and `error` functions.
 * - Mocking the `getSessionKey` and `getUserId` functions from the `userService` module.
 * - Mocking the `REST.apiCal` function from the `services` module.
 * - Mocking the `fetchDomain` function from the `fetchDomain` module.
 * - Mocking the `getFromStore` and `apiCal` functions from the `util` module.
 * - Mocking the `getAbsoluteOffsets` and `getNodeInfo` functions from the `util` module.
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

// Mock util module
jest.mock("../util/index", () => ({
  // Mock getFromStore function
  getFromStore: jest.fn(),
  apiCal: jest.fn(),
}));

jest.mock("../util", () => ({
  getAbsoluteOffsets: jest.fn().mockReturnValue({ top: 100, left: 200 }),
  getNodeInfo: jest
    .fn()
    .mockReturnValue({ screenSize: { screen: { width: 1920, height: 1080 } } }),
}));
describe("postRecordSequenceData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.window = Object.create(window);
    Object.defineProperty(window, "udanSelectedNodes", {
      value: [],
      writable: true,
    });
  });
  /**
   * Tests that the `postRecordSequenceData` function successfully posts record sequence data.
   *
   * This test sets up a mock request object, mocks the behavior of `getFromStore`, `fetchDomain`, and `getAbsoluteOffsets`, and then calls `postRecordSequenceData` with the mock request. It expects the function to return a success response.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @returns {Promise<{ success: boolean }>} - A promise that resolves to a success response.
   */

  it("should successfully post record sequence data", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock user click nodes set
    const mockUserClickNodesSet = [{ id: "1" }, { id: "2" }];
    // Mock domain
    const mockDomain = "example.com";

    // Mock getFromStore to return the mock user click nodes set
    const getFromStoreMock = jest.fn((key, isRaw) => {
      if (key === CONFIG.RECORDING_SEQUENCE && !isRaw) {
        return mockUserClickNodesSet;
      }
      return undefined;
    });
    (getFromStore as jest.Mock) = getFromStoreMock;

    // Mock fetchDomain to return the mock domain
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);

    // Mock getAbsoluteOffsets to return a success response
    (getAbsoluteOffsets as jest.Mock).mockImplementation(() =>
      Promise.resolve({ success: true })
    );

    // Call postRecordSequenceData with the mock request
    const result = await postRecordSequenceData(mockRequest);

    // Verify that getFromStore was called with the correct arguments
    expect(getFromStoreMock).toHaveBeenCalledWith(
      CONFIG.RECORDING_SEQUENCE,
      false
    );

    // Verify that fetchDomain was called
    expect(fetchDomain).toHaveBeenCalled();

    // Verify that udanSelectedNodes is cleared
    expect(window.udanSelectedNodes).toEqual([]);
  });

  // Test that postRecordSequenceData throws an error if request is not provided
  /**
   * Tests that the `postRecordSequenceData` function throws an error if the request object is not provided.
   *
   * This test sets up a mock request object to be `undefined`, and then calls `postRecordSequenceData` with the mock request. It expects the function to reject with an error indicating that the request object is required.
   *
   * @async
   * @param {Object|undefined} mockRequest - A mock request object, or `undefined` to test the error case.
   * @throws {Error} - An error indicating that the request object is required.
   */
  it("should throw an error if request is not provided", async () => {
    const mockRequest = undefined;
    // Expect an error to be thrown
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Request object is required"
    );
    // Verify that error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in postRecordSequenceData: Request object is required",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `postRecordSequenceData` function handles errors thrown by `getFromStore`.
   *
   * This test sets up a mock request object, mocks the behavior of `getFromStore` to throw an error, and then calls `postRecordSequenceData` with the mock request. It expects the function to reject with the error thrown by `getFromStore`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @throws {Error} - The error thrown by `getFromStore`.
   */
  it("should handle errors during execution", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };

    // Mock error to throw from getFromStore
    const mockError = new Error("Test error");

    // Mock getFromStore to throw the error
    (getFromStore as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in postRecordSequenceData: Test error",
      mockError
    );
  });
  /**
   * Tests that the `postRecordSequenceData` function handles errors thrown by `recordSequence`.
   *
   * This test sets up a mock request object, mocks the behavior of `recordSequence` to throw an error, and then calls `postRecordSequenceData` with the mock request. It expects the function to reject with the error thrown by `recordSequence`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @throws {Error} - The error thrown by `recordSequence`.
   */
  test("should handle errors thrown by recordSequence", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock error to throw from recordSequence
    const mockError = new Error("Test error");
    // Mock recordSequence to throw the error
    (getFromStore as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );
    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in postRecordSequenceData: Test error",
      mockError
    );
  });
  /**
   * Tests that the `postRecordSequenceData` function handles errors thrown by `getFromStore`.
   *
   * This test sets up a mock request object, mocks the behavior of `getFromStore` to throw an error, and then calls `postRecordSequenceData` with the mock request. It expects the function to reject with the error thrown by `getFromStore`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @throws {Error} - The error thrown by `getFromStore`.
   */
  test("should handle errors thrown by getFromStore", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock error to throw from getFromStore
    const mockError = new Error("Test error");
    // Mock getFromStore to throw the error
    (getFromStore as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );
    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in postRecordSequenceData: Test error",
      mockError
    );
  });
  /**
   * Tests the error handling behavior of the `postRecordSequenceData` function when `fetchDomain` throws an error.
   *
   * This test sets up a mock request object, mocks the behavior of `fetchDomain` to throw an error, and then calls `postRecordSequenceData` with the mock request. It expects the function to reject with the error thrown by `fetchDomain`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @throws {Error} - The error thrown by `fetchDomain`.
   */
  test("should handle errors thrown by fetchDomain", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock error to throw from fetchDomain
    const mockError = new Error("Test error");
    // Mock fetchDomain to throw the error
    (fetchDomain as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );
    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in postRecordSequenceData: Test error",
      mockError
    );
  });
  /**
   * Tests that the `udanSelectedNodes` array is cleared after a successful execution of `postRecordSequenceData`.
   *
   * This test sets up a mock request object, a mock user click nodes set, and mocks the behavior of `getFromStore`, `fetchDomain`, and `getAbsoluteOffsets`. It then calls `postRecordSequenceData` with the mock request and expects the `udanSelectedNodes` array to be cleared.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @param {Array<{id: string}>} mockUserClickNodesSet - A mock set of user click nodes.
   * @throws {Error} - Any errors thrown by the mocked functions.
   */
  it("should clear udanSelectedNodes after successful execution", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock user click nodes set
    const mockUserClickNodesSet = [{ id: "1" }];
    // Set udanSelectedNodes to a non-empty array
    window.udanSelectedNodes = ["node1", "node2"];

    // Mock getFromStore to return the mock user click nodes set
    (getFromStore as jest.Mock).mockImplementation((key, isRaw) => {
      if (key === CONFIG.RECORDING_SEQUENCE && !isRaw) {
        return mockUserClickNodesSet;
      }
      return undefined;
    });
    // Mock fetchDomain to return a domain
    (fetchDomain as jest.Mock).mockImplementation(() => "example.com");
    // Mock getAbsoluteOffsets to return a success response
    (getAbsoluteOffsets as jest.Mock).mockImplementation(() =>
      Promise.resolve({ success: true })
    );

    // Call postRecordSequenceData with the mock request
    await postRecordSequenceData(mockRequest);

    // Check that udanSelectedNodes is cleared
    expect(window.udanSelectedNodes).toEqual([]);
  });

  /**
   * Tests the error handling behavior of the `postRecordSequenceData` function when it throws an error.
   *
   * This test sets up a mock request object, a mock user click nodes set, and mocks the behavior of `getFromStore`, `fetchDomain`, and `getAbsoluteOffsets`. It then calls `postRecordSequenceData` with the mock request and expects the function to reject with the error thrown by `postRecordSequenceData`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @param {Array<{id: string}>} mockUserClickNodesSet - A mock set of user click nodes.
   * @throws {Error} - The error thrown by `postRecordSequenceData`.
   */
  test("should handle errors thrown by postRecordSequenceData", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock user click nodes set
    const mockUserClickNodesSet = [{ id: "1" }];
    // Set udanSelectedNodes to a non-empty array
    window.udanSelectedNodes = ["node1", "node2"];
    // Mock getFromStore to return the mock user click nodes set
    (getFromStore as jest.Mock).mockImplementation((key, isRaw) => {
      if (key === CONFIG.RECORDING_SEQUENCE && !isRaw) {
        return mockUserClickNodesSet;
      }
      return undefined;
    });
    // Mock fetchDomain to return a domain
    (fetchDomain as jest.Mock).mockImplementation(() => "example.com");
    // Mock getAbsoluteOffsets to return a success response
    (getAbsoluteOffsets as jest.Mock).mockImplementation(() =>
      Promise.resolve({ success: true })
    );
    // Mock postRecordSequenceData to throw an error
    (getFromStore as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });
    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );
  });
  /**
   * Tests that the `postRecordSequenceData` function handles errors thrown by the `getFromStore` function.
   * This test sets up a mock `getFromStore` function that throws an error, and then calls `postRecordSequenceData`
   * with a mock request object. The test expects the `postRecordSequenceData` function to reject with the error
   * thrown by `getFromStore`.
   */
  test("should handle errors thrown by getFromStore", async () => {
    // Mock request object
    const mockRequest = { someData: "testData" };
    // Mock user click nodes set
    const mockUserClickNodesSet = [{ id: "1" }];
    // Set udanSelectedNodes to a non-empty array
    window.udanSelectedNodes = ["node1", "node2"];
    // Mock getFromStore to throw an error
    (getFromStore as jest.Mock).mockImplementation((key, isRaw) => {
      if (key === CONFIG.RECORDING_SEQUENCE && !isRaw) {
        throw new Error("Test error");
      }
      return undefined;
    });
    // Mock fetchDomain to return a domain
    (fetchDomain as jest.Mock).mockImplementation(() => "example.com");
    // Mock getAbsoluteOffsets to return a success response
    (getAbsoluteOffsets as jest.Mock).mockImplementation(() =>
      Promise.resolve({ success: true })
    );
  });
});
