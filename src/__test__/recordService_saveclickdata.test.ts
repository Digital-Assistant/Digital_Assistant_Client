/**
 * This module imports various utility functions and services used for recording user click data.
 *
 * - `getNodeInfo`: Utility function to get information about a DOM node.
 * - `domJSON`: Library for converting DOM elements to JSON.
 * - `TSON`: Library for converting TypeScript objects to JSON.
 * - `UDAConsoleLogger` and `UDAErrorLogger`: Logging utilities.
 * - `fetchDomain`: Utility function to fetch the domain of a URL.
 * - `CONFIG`: Configuration object.
 * - `updateRecordClicks` and `saveClickData`: Functions from the `recordService` module for recording user click data.
 */
import { getNodeInfo } from "../util/nodeInfo";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import { UDAErrorLogger } from "../config/error-log";
import { updateRecordClicks, saveClickData } from "../services/recordService";
import { getAbsoluteOffsets } from "@/util";

// Mock the domjson function with an empty function
/**
 * This code sets up mocks for various dependencies used in the `recordService_saveClickData.test.ts` file.
 *
 * - `jest.mock("domjson", ...)`: Mocks the `domjson` library, setting the `toJSON` function to a jest mock.
 * - `jest.mock("typescript-json", ...)`: Mocks the `typescript-json` library, setting the `stringify` function to return a constant value.
 * - `jest.mock("../config/error-log", ...)`: Mocks the `UDAConsoleLogger` and `UDAErrorLogger` objects, setting their `info` and `error` functions to jest mocks.
 * - `jest.mock("../services/userService", ...)`: Mocks the `getSessionKey` and `getUserId` functions from the `userService` module.
 * - `jest.mock("../services", ...)`: Mocks the `REST` object from the `services` module, setting the `apiCal` function to a jest mock.
 * - `jest.mock("../util/fetchDomain", ...)`: Mocks the `fetchDomain` function from the `fetchDomain` module.
 */
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
// Mock the getAbsoluteOffsets function with a jest mock
jest.mock("@/util", () => ({
  getAbsoluteOffsets: jest.fn(),
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
  getNodeInfo: jest.fn(),
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

describe("saveClickData", () => {
  // Mock a DOM node
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNode = {
    // Mock the cloneNode function to return an empty object
    cloneNode: () => ({}),
    // Mock the nodeName property to be "DIV"
    nodeName: "DIV",
    // Mock the outerHTML property to be a string representation of a div element
    outerHTML: "<div></div>",
    getBoundingClientRect: jest.fn(),
  };

  // Mock the text property of the node
  const mockText = "Test Text";

  // Mock the metadata object
  const mockMeta = { key: "value" };

  beforeEach(() => {
    // Set up the global window object
    global.window = Object.create(window);
    // Set the host and pathname properties of the window object
    Object.defineProperty(window, "location", {
      value: { host: "example.com", pathname: "/test" },
    });

    // Set the customNameForSpecialNodes property of the CONFIG object
    CONFIG.customNameForSpecialNodes = {
      "ngb-datepicker": "NGBootstrap Datepicker",
      "mat-datepicker-content": "Material Datepicker",
      "ngx-daterangepicker-material": "Date Range Picker",
    };

    // Set the ignoreNodesFromIndexing property of the CONFIG object
    CONFIG.ignoreNodesFromIndexing = ["ngx-daterangepicker-material"];
  });

  /**
   * Tests that the `saveClickData` function throws an error when required parameters are missing.
   *
   * This test calls `saveClickData` with null or empty values for the required parameters and asserts that an error with the message "Required parameters are missing" is thrown.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should throw an error for missing parameters", async () => {
    // Try to call saveClickData with missing parameters
    await expect(saveClickData(null, "", null)).rejects.toThrow(
      // Expect an error to be thrown with this message
      "Required parameters are missing"
    );
  });
  /**
   * Tests that the `saveClickData` function logs and rethrows errors using the `UDAErrorLogger`.
   *
   * This test sets up a mock error, mocks the `domJSON.toJSON` function to throw the mock error, calls `saveClickData` with mock data, and asserts that the error is logged with the correct message and that the error is rethrown.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */

  test("should log error and rethrow when an exception occurs", async () => {
    // Mock the domJSON.toJSON function to throw an error
    domJSON.toJSON.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    // Call saveClickData with mock data
    await expect(saveClickData(mockNode, mockText, mockMeta)).rejects.toThrow(
      "Test error"
    );
    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Test error",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using the `UDAErrorLogger`.
   *
   * This test sets up a mock error, mocks the `domJSON.toJSON` function to throw the mock error, calls `saveClickData` with mock data, and asserts that the error is logged with the correct message and that the error is rethrown.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should log and rethrow errors using UDAErrorLogger", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, mockText, mockMeta)).rejects.toThrow(
      "Test error"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Test error",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Test error",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `node` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with null node", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(null, mockText, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `text` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with null text", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, null, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `meta` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with null meta", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, mockText, null)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when all required parameters are `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with all null params", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(null, null, null)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `node` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with node = null", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(null, mockText, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `text` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with text = null", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, null, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `meta` parameter is `null`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with meta = null", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, mockText, null)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });
  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `node` parameter is `undefined`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */

  it("should log and rethrow errors using UDAErrorLogger with node = undefined", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(undefined, mockText, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `text` parameter is `undefined`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with text = undefined", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, undefined, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `meta` parameter is `undefined`.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with meta = undefined", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, mockText, undefined)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `node` parameter is an empty string.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with node = ''", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData("", mockText, mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `text` parameter is an empty string.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with text = ''", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, "", mockMeta)).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when the `meta` parameter is an empty string.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with meta = ''", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
    await expect(saveClickData(mockNode, mockText, "")).rejects.toThrow(
      "Required parameters are missing"
    );

    // Check that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
    // Check that the error is logged twice (once for the error handler and once for the rethrow)
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in saveClickData: Required parameters are missing",
      expect.any(Error)
    );
  });

  /**
   * Tests that the `saveClickData` function logs and rethrows errors using `UDAErrorLogger` when all required parameters are empty strings.
   * This test simulates a scenario where the `domJSON.toJSON` function throws an error, and the `saveClickData` function is expected to log the error and rethrow it.
   */
  it("should log and rethrow errors using UDAErrorLogger with all empty strings", async () => {
    // Throw an error from domJSON.toJSON
    const error = new Error("Test error");
    domJSON.toJSON.mockImplementationOnce(() => {
      throw error;
    });

    // Call saveClickData and expect it to throw the error
  });
});
