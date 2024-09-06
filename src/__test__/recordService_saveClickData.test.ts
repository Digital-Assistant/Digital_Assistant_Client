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

describe("saveClickData", () => {
  // Mock a DOM node
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
  test("should save click data", async () => {
    // Call saveClickData with mock data
    await saveClickData(mockNode, mockText, mockMeta);
    // Assert that the domJSON.toJSON function was called with the mock node
    expect(domJSON.toJSON).toHaveBeenCalledWith(mockNode);
    // Assert that the updateRecordClicks function was called with the correct arguments
    expect(updateRecordClicks).toHaveBeenCalledWith(mockText, mockMeta);
  });
  test("should not save click data if node is ignored", async () => {
    // Mock the node as ignored
    (mockNode as any).udaIgnoreClick = true;
    // Call saveClickData with mock data
    await saveClickData(mockNode, mockText, mockMeta);
    // Assert that the domJSON.toJSON function was not called
    expect(domJSON.toJSON).not.toHaveBeenCalled();
    // Assert that the updateRecordClicks function was not called
    expect(updateRecordClicks).not.toHaveBeenCalled();
    // Assert that the UDAErrorLogger.error function was called with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Node is ignored",
      expect.any(Error)
    );
  });
  test("should not save click data if node is not a highlight node", async () => {
    // Call saveClickData with mock data
    await saveClickData(mockNode, mockText, mockMeta);
    // Assert that the domJSON.toJSON function was not called
    expect(domJSON.toJSON).not.toHaveBeenCalled();
    // Assert that the updateRecordClicks function was not called
    expect(updateRecordClicks).not.toHaveBeenCalled();
    // Assert that the UDAErrorLogger.error function was called with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Node is not a highlight node"
    );
  });
  /**
   * Tests that `saveClickData` returns `false` if the screen size is not available.
   * This is a test case that verifies the behavior of the `saveClickData` function
   * when the necessary screen size information is not provided.
   */
  it("should return false if screen size is not available", async () => {
    // Mock the getNodeInfo function to return a screen size with width and height of 0
    (getNodeInfo as jest.Mock).mockReturnValue({
      screenSize: { screen: { width: 0, height: 0 } },
    });
    // Call saveClickData with the mock node, text and meta
    const result = await saveClickData(mockNode, mockText, mockMeta);
    // Assert that the result is false
    expect(result).toBe(false);
  });

  it("should process node and return correct object structure", async () => {
    const result = await saveClickData(mockNode, mockText, mockMeta);
    // Call the saveClickData function with the mock node, text and meta
    expect(result).toEqual({
      // Assert that the result is an object with the correct structure
      domain: expect.any(String),
      // The domain property should be a string
      urlpath: expect.any(String),
      // The urlpath property should be a string
      clickednodename: mockText,
      // The clickednodename property should be the mock text
      html5: 0,
      // The html5 property should be 0
      clickedpath: "",
      // The clickedpath property should be an empty string
      objectdata: expect.any(String),
      // The objectdata property should be a JSON string
    });
  });

  /**
   * Tests that `saveClickData` handles ignored nodes correctly.
   * This test case verifies that the `saveClickData` function correctly handles nodes that are configured to be ignored, and that the correct display text is used for special node types.
   */
  it("should handle ignored nodes correctly", async () => {
    // Set the node name to a value that is ignored
    mockNode.nodeName = "IGNORED";
    // Set the ignored nodes to include the node name
    CONFIG.ignoreNodesFromIndexing = ["ignored"];
    // Set the custom names for special nodes
    CONFIG.customNameForSpecialNodes = {
      "ngb-datepicker": "Custom Name",
      "mat-datepicker-content": "Mat Datepicker",
      "ngx-daterangepicker-material": "Ngx Daterangepicker",
    };

    const result = await saveClickData(mockNode, mockText, mockMeta);
    if (result !== false) {
      // Parse the object data to get the display text
      const parsedObjectData = JSON.parse(result.objectdata);
      expect(parsedObjectData.meta.displayText).toBe("Custom Name");
    } else {
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that `saveClickData` includes the node information in the result.
   * This test case verifies that the `saveClickData` function correctly includes the node information in the result object when the function returns an object.
   */

  it("should include node info in the result", async () => {
    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(mockNode, mockText, mockMeta);
    if (result !== false) {
      // Parse the object data to get the node info
      const parsedObjectData = JSON.parse(result.objectdata);
      expect(parsedObjectData.node.nodeInfo).toBeDefined();
      // Verify that the node info is defined
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });

  /**
   * Tests that `saveClickData` correctly handles the case where `enableNodeTypeChangeSelection` is set to `true`.
   * This test case verifies that when `enableNodeTypeChangeSelection` is set to `true`, the `saveClickData` function correctly includes the `systemDetected` property in the result object when the function returns an object.
   */
  it("should handle enableNodeTypeChangeSelection when true", async () => {
    // Set enableNodeTypeChangeSelection to true
    CONFIG.enableNodeTypeChangeSelection = true;
    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(mockNode, mockText, mockMeta);
    if (result !== false) {
      // Parse the object data to get the meta information
      const parsedObjectData = JSON.parse(result.objectdata);
      // Verify that the systemDetected property is defined in the meta information
      expect(parsedObjectData.meta.systemDetected).toBeDefined();
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that the `saveClickData` function correctly removes unwanted attributes from the `node` object in the result.
   * The test creates a mock `node` object with additional unwanted attributes, and then verifies that these attributes are not present in the `node` object of the result.
   */
  it("should remove unwanted attributes from objectData.node", async () => {
    // Create a mock node with unwanted attributes
    const mockNodeWithUnwantedAttrs = {
      ...mockNode,
      addedClickRecord: true,
      hasClick: true,
      udaIgnoreChildren: true,
      udaIgnoreClick: true,
    };
    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(
      mockNodeWithUnwantedAttrs,
      mockText,
      mockMeta
    );
    if (result !== false) {
      // Parse the object data to get the node object
      const parsedObjectData = JSON.parse(result.objectdata);
      // Verify that the unwanted attributes are not present in the node object
      expect(parsedObjectData.node.addedClickRecord).toBeUndefined();
      expect(parsedObjectData.node.hasClick).toBeUndefined();
      expect(parsedObjectData.node.udaIgnoreChildren).toBeUndefined();
      expect(parsedObjectData.node.udaIgnoreClick).toBeUndefined();
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });

  /**
   * Tests that the `saveClickData` function correctly handles nodes with an existing `meta` property.
   * The test creates a mock `node` object and mocks the `domJSON.toJSON` function to return an object with a `meta` property containing an `existingProp`. It then calls `saveClickData` and verifies that the `existingProp` property of the `meta` object in the result matches the mocked value.
   */
  it("should handle nodes with existing meta property", async () => {
    // Mock bounding client rect to return a valid rectangle
    const mockBoundingClientRect = { top: 0, left: 0, right: 100, bottom: 100 };
    mockNode.getBoundingClientRect = jest
      .fn()
      .mockReturnValue(mockBoundingClientRect);

    // Mock domJSON.toJSON to return an object with a meta property containing an existingProp
    domJSON.toJSON.mockReturnValue({
      node: {},
      meta: { existingProp: "value" },
    });
    const result = await saveClickData(mockNode, mockText, mockMeta);
    if (result !== false) {
      // Parse the object data to get the meta object
      const parsedObjectData = JSON.parse(result.objectdata);
      // Verify that the existingProp property of the meta object in the result matches the mocked value
      expect(parsedObjectData.meta).toEqual({
        ...mockMeta,
        existingProp: "value",
      });
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that the `saveClickData` function includes the `outerHTML` property of the `node` object in the result if it is not already present.
   * The test creates a mock `node` object and mocks the `domJSON.toJSON` function to return an object with an empty `node` property. It then calls `saveClickData` and verifies that the `outerHTML` property of the `node` object in the result matches the `outerHTML` property of the mock `node` object.
   */
  it("should include outerHTML in objectData.node if not present", async () => {
    // Mock domJSON.toJSON to return an empty object
    domJSON.toJSON.mockReturnValue({ node: {} });
    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(mockNode, mockText, mockMeta);
    // If the result is not false, parse the object data to get the node object
    if (result !== false) {
      const parsedObjectData = JSON.parse(result.objectdata);
      // Verify that the outerHTML property of the node object in the result matches the outerHTML property of the mock node object
      expect(parsedObjectData.node.outerHTML).toBe(mockNode.outerHTML);
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that the `saveClickData` function handles nodes with no `outerHTML` property.
   * The test creates a mock node object without the `outerHTML` property, and then verifies that the `outerHTML` property is undefined in the `node` object of the result.
   */
  it("should handle nodes with no outerHTML property", async () => {
    // Create a mock node that does not have the outerHTML property
    const nodeWithoutOuterHTML = { ...mockNode };
    delete nodeWithoutOuterHTML.outerHTML;
    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(
      nodeWithoutOuterHTML,
      mockText,
      mockMeta
    );
    // If the result is not false, parse the object data to get the node object
    if (result !== false) {
      const parsedObjectData = JSON.parse(result.objectdata);
      // Verify that the outerHTML property of the node object in the result is undefined
      expect(parsedObjectData.node.outerHTML).toBeUndefined();
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });

  /**
   * Tests that the `saveClickData` function uses the `mapClickedElementToHtmlFormElement` function when `enableNodeTypeChangeSelection` is true.
   * The test mocks the `mapClickedElementToHtmlFormElement` function to return a `mockSystemDetected` object with `inputElement` set to "text", and then verifies that the `systemDetected` and `selectedElement` properties in the `meta` object of the result match the mocked `mockSystemDetected` object.
   */
  it("should use mapClickedElementToHtmlFormElement when enableNodeTypeChangeSelection is true", async () => {
    // Set the config to enable node type change selection
    CONFIG.enableNodeTypeChangeSelection = true;

    // Mock the mapClickedElementToHtmlFormElement function to return a mock system detected object
    const mockSystemDetected = { inputElement: "text" };
    jest.mock(
      "../util/recording-utils/mapClickedElementToHtmlFormElement",
      () => jest.fn().mockReturnValue(mockSystemDetected)
    );

    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // If the result is not false, parse the object data and verify that the systemDetected and selectedElement properties match the mocked systemDetected object
    if (result !== false) {
      const parsedObjectData = JSON.parse(result.objectdata);
      expect(parsedObjectData.meta.systemDetected).toEqual(mockSystemDetected);
      expect(parsedObjectData.meta.selectedElement).toEqual(mockSystemDetected);
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that the `saveClickData` function does not set the `selectedElement` property in the `meta` object if the `systemDetected.inputElement` is "others".
   * The test mocks the `mapClickedElementToHtmlFormElement` function to return a `mockSystemDetected` object with `inputElement` set to "others", and then verifies that the `selectedElement` property is undefined in the `meta` object of the result.
   */
  it('should not set selectedElement if systemDetected.inputElement is "others"', async () => {
    // Set the config to enable node type change selection
    CONFIG.enableNodeTypeChangeSelection = true;

    // Mock the mapClickedElementToHtmlFormElement function to return a mock system detected object
    const mockSystemDetected = { inputElement: "others" };
    jest.mock(
      "../util/recording-utils/mapClickedElementToHtmlFormElement",
      () => jest.fn().mockReturnValue(mockSystemDetected)
    );

    // Call the saveClickData function with the mock node, text, and meta data
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // If the result is not false, parse the object data and verify that the systemDetected property exists
    // and that the selectedElement property is undefined
    if (result !== false) {
      const parsedObjectData = JSON.parse(result.objectdata);
      expect(parsedObjectData.meta.systemDetected).toEqual(mockSystemDetected);
      expect(parsedObjectData.meta.selectedElement).toBeUndefined();
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });
  /**
   * Tests that the `saveClickData` function uses the `window.location.pathname` for the `urlpath` property of the result.
   * The test mocks the `window.location` object to have a specific `pathname` value, and then verifies that the `urlpath` property of the result matches the mocked `pathname`.
   */
  it("should use window.location.pathname for urlpath", async () => {
    // Mock window.location to have a specific pathname
    const mockPathname = "/test-path";
    Object.defineProperty(window, "location", {
      value: { host: "example.com", pathname: mockPathname },
      writable: true,
    });

    // Call the saveClickData function
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // If the result is not false, verify that the urlpath property matches the mocked pathname
    if (result !== false) {
      expect(result.urlpath).toBe(mockPathname);
    } else {
      // If the result is false, fail the test
      fail("Expected result to be an object, but got false");
    }
  });

  /**
   * Tests that the `saveClickData` function logs the `objectData` using the `UDAConsoleLogger`.
   */
  it("should log objectData using UDAConsoleLogger", async () => {
    // Create a mock logger that tracks the number of times its `info` method is called
    const mockLogger = { info: jest.fn() };
    // Mock the `error-log` module to return the mock logger
    jest.mock("../config/error-log", () => ({
      UDAConsoleLogger: mockLogger,
    }));
    // Call `saveClickData` with the mock node, text, and meta data
    await saveClickData(mockNode, mockText, mockMeta);
    // Verify that the `info` method of the mock logger was called twice
    expect(mockLogger.info).toHaveBeenCalledTimes(2);
  });
});
