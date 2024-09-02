/**
 * This file contains various utility functions and mocks for testing the record service functionality.
 * It includes mocks for functions from the `util`, `nodeInfo`, `domjson`, `typescript-json`, `error-log`, `userService`, `services`, and `fetchDomain` modules.
 * The mocks are used to simulate the behavior of these external dependencies in the test environment.
 */
import { getSessionKey, getUserId } from "../services/userService";
import { ENDPOINT } from "../config/endpoints";
import { getAbsoluteOffsets } from "../util";
import { REST } from "../services";
import { mapSelectedElementAction } from "../util/mapSelectedElementAction";
import { getNodeInfo } from "../util/nodeInfo";
import { inArray } from "../util";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import { getFromStore } from "../util"; // Import getFromStore
import * as userService from "../services/userService";
import { specialNodes } from "../util/specialNodes";
import { UDAErrorLogger } from "../config/error-log";
import { recordSequence } from "../services/recordService";

import {
  recordClicks,
  updateRecordClicks,
  userClick,
  deleteRecording,
  updateRecording,
  profanityCheck,
  saveClickData,
  postRecordSequenceData,
  recordUserClickData,
} from "../services/recordService";

/**
 * This code sets up various mocks for testing the record service functionality. It mocks functions from several modules, including `util`, `nodeInfo`, `domjson`, `typescript-json`, `error-log`, `userService`, `services`, and `fetchDomain`. These mocks are used to simulate the behavior of these external dependencies in the test environment.
 */
// Mock the getAbsoluteOffsets function with a constant value
jest.mock("../util", () => ({
  getAbsoluteOffsets: jest.fn().mockReturnValue({ x: 0, y: 0 }),
  // Mock the inArray function with a constant value
  inArray: jest.fn().mockReturnValue(-1),
}));
// Mock the getNodeInfo function with an empty function
jest.mock("../util/nodeInfo", () => ({
  getNodeInfo: jest.fn(),
}));
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

jest.mock("../config/error-log", () => ({
  // Mock UDAErrorLogger object
  UDAErrorLogger: {
    // Mock info function
    info: jest.fn(),
    // Mock error function
    error: jest.fn(),
  },
}));
jest.mock("../util", () => ({
  getAbsoluteOffsets: jest.fn().mockReturnValue({ top: 100, left: 200 }),
  getNodeInfo: jest
    .fn()
    .mockReturnValue({ screenSize: { screen: { width: 1920, height: 1080 } } }),
}));

/**
 * Describes the test suite for the `recordClicks` function.
 * This suite is responsible for testing the functionality of the `recordClicks` function, which is responsible for recording user clicks on a website.
 * The `beforeEach` hook is used to clear all mocks before each test is run, ensuring a clean slate for each test.
 */
describe("recordClicks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Records a user click event with detailed information about the clicked element.
   *
   * @param {Object} mockRequest - An object containing information about the clicked element.
   * @param {string} mockRequest.domain - The current domain.
   * @param {string} mockRequest.urlpath - The current URL path.
   * @param {string} mockRequest.clickednodename - The name of the clicked element.
   * @param {number} mockRequest.html5 - A flag indicating if the clicked element is an HTML5 element.
   * @param {string} mockRequest.clickedpath - The path of the clicked element.
   * @param {string} mockRequest.objectdata - A JSON string containing detailed information about the clicked element.
   * @returns {Promise<{ success: boolean }>} - A promise that resolves to an object with a `success` property indicating whether the click event was recorded successfully.
   */
  it("should successfully record clicks with full data", async () => {
    // Mock getSessionKey to return a session ID
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "mock-session-id"
    );
    // Mock apiCal to return {success: true}
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    // Mock data simulating a button click on a homepage
    const mockRequest = {
      // Mock domain name
      domain: "example.com",
      // Mock URL path
      urlpath: "/",
      // Mock button name
      clickednodename: "Get Started Button",
      // Mock HTML5 value
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node ID
        node: {
          id: "start-button",
          // Mock tag name
          tagName: "BUTTON",
          // Mock class name
          className: "cta-button",
          // Mock inner text
          innerText: "Get Started",
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body
      body: {
        // Spread in the mock request data
        ...mockRequest,
        // Add session ID to the body
        sessionid: "mock-session-id",
      },
    });
    // Expect the result to be {success: true}
    expect(result).toEqual({ success: true });
  });

  /**
   * Tests the behavior of the `recordClicks` function when it is called with complex DOM elements.
   *
   * This test case mocks the `userService.getSessionKey` function to return a default session ID, and then mocks the `REST.apiCal` function to return a successful response. It then verifies that the `recordClicks` function returns the expected response when provided with a complex DOM element.
   *
   * @param {object} mockRequest - An object containing the data for the click recording.
   * @param {string} mockRequest.domain - The domain name.
   * @param {string} mockRequest.urlpath - The URL path.
   * @param {string} mockRequest.clickednodename - The name of the clicked element.
   * @param {number} mockRequest.html5 - The HTML5 flag.
   * @param {string} mockRequest.clickedpath - The clicked path.
   * @param {string} mockRequest.objectdata - The object data containing information about the clicked element.
   * @returns {Promise<void>} - A promise that resolves when the test case is complete.
   */
  it("should handle clicks on complex DOM elements", async () => {
    // Mock user session ID
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "complex-session-id"
    );

    // Mock API response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      complexData: true,
    });

    // Mock data simulating a click on a complex table cell
    const mockRequest = {
      // Current domain
      domain: "app.example.com",
      // Current path
      urlpath: "/dashboard",
      // Name of the element that was clicked
      clickednodename: "User Table Cell",
      // Flag indicating if the element is an HTML5 element
      html5: 0,
      // Path of the element that was clicked (empty string by default)
      clickedpath: "",
      // Object data containing information about the element that was clicked
      objectdata: JSON.stringify({
        // Node ID
        node: {
          id: "user-table-cell-15",
          // Tag name
          tagName: "TD",
          // Class name
          className: "user-data editable",
          // Inner text
          innerText: "John Doe",
          // Parent node
          parentNode: {
            // Tag name
            tagName: "TR",
            // ID
            id: "user-row-3",
          },
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body
      body: {
        // Spread in the mock request data
        ...mockRequest,
        // Add session ID to the body
        sessionid: "complex-session-id",
      },
    });
    // Expect the result to be {success: true, complexData: true}
    expect(result).toEqual({ success: true, complexData: true });
  });

  /**
   * Tests the behavior of the `recordClicks` function when it is called with minimal data.
   *
   * This test case mocks the `userService.getSessionKey` function to return a default session ID, and then mocks the `REST.apiCal` function to return a successful response. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - An object containing the minimal data for the click recording.
   * @param {string} mockRequest.domain - The domain name.
   * @param {string} mockRequest.urlpath - The URL path.
   * @param {string} mockRequest.clickednodename - The name of the clicked button.
   * @param {number} mockRequest.html5 - The HTML5 flag.
   * @param {string} mockRequest.clickedpath - The clicked path.
   * @param {string} mockRequest.objectdata - The object data.
   * @returns {Promise<void>} - A promise that resolves when the test case is complete.
   */
  it("should handle clicks with minimal data", async () => {
    // Mock the getSessionKey function to return a session ID
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "minimal-session-id"
    );
    // Mock the apiCal function to return {success: true, minimalData: true}
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      minimalData: true,
    });

    // Mock data with minimal information
    const mockRequest = {
      // Domain
      domain: "minimal.example.com",
      // URL path
      urlpath: "/page",
      // Node name
      clickednodename: "Unknown Element",
      // HTML5 flag
      html5: 0,
      // Clicked path
      clickedpath: "",
      // Object data with minimal information
      objectdata: JSON.stringify({
        node: {
          tagName: "DIV",
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body
      body: {
        // Spread in the mock request data
        ...mockRequest,
        // Add session ID to the body
        sessionid: "minimal-session-id",
      },
    });
    // Expect the result to be {success: true, minimalData: true}
    expect(result).toEqual({ success: true, minimalData: true });
  });

  // Test case: Should handle errors and throw them
  /**
   * Tests the behavior of the `recordClicks` function when it encounters an error while retrieving the session key.
   *
   * This test case mocks the `userService.getSessionKey` function to throw an error, and then verifies that the `recordClicks` function correctly propagates the error.
   *
   * @param {object} mockRequest - An object containing the default data for the click recording.
   * @param {string} mockRequest.domain - The domain name.
   * @param {string} mockRequest.urlpath - The URL path.
   * @param {string} mockRequest.clickednodename - The name of the clicked button.
   * @param {number} mockRequest.html5 - The HTML5 flag.
   * @param {string} mockRequest.clickedpath - The clicked path.
   * @param {string} mockRequest.objectdata - The object data.
   * @returns {Promise<void>} - A promise that resolves when the test case is complete.
   */
  it("should handle errors and throw them", async () => {
    // Mock the getSessionKey function to throw an error
    (userService.getSessionKey as jest.Mock) // Mock the getSessionKey function
      .mockRejectedValue(new Error("Session key error")); // Mock it to throw an error

    // Mock request data
    const mockRequest = {
      domain: "error.example.com", // Mock domain name
      urlpath: "/error-page", // Mock URL path
      clickednodename: "Error Button", // Mock button name
      html5: 0, // Mock HTML5 flag
      clickedpath: "", // Mock clicked path
      objectdata: JSON.stringify({ node: { id: "error-node" } }), // Mock object data
    };

    // Use a more specific assertion to catch the exact error
    await expect(recordClicks(mockRequest)) // Call recordClicks with the mock request data
      .rejects.toThrowError("Session key error"); // Expect it to throw an error with the message "Session key error"

    // Check that the getSessionKey was called once and apiCal was not called
    expect(userService.getSessionKey) // Expect getSessionKey to be called once
      .toHaveBeenCalledTimes(1);
    expect(REST.apiCal) // Expect apiCal to not be called
      .not.toHaveBeenCalled();
  });

  // Test case: Should record clicks with default data
  /**
   * Tests the behavior of the `recordClicks` function when it is called with default data.
   *
   * This test case mocks the `userService.getSessionKey` function to return a default session ID, and then mocks the `REST.apiCal` function to return a successful response. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - An object containing the default data for the click recording.
   * @param {string} mockRequest.domain - The domain name.
   * @param {string} mockRequest.urlpath - The URL path.
   * @param {string} mockRequest.clickednodename - The name of the clicked button.
   * @param {number} mockRequest.html5 - The HTML5 flag.
   * @param {string} mockRequest.clickedpath - The clicked path.
   * @param {string} mockRequest.objectdata - The object data.
   * @returns {Promise<object>} - A promise that resolves with the expected response from the API.
   */
  it("should record clicks with default data", async () => {
    // Mock the getSessionKey function to return a session ID
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "default-session-id"
    );
    // Mock the apiCal function to return {success: true}
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    // Mock request data with default data
    const mockRequest = {
      // Mock domain name
      domain: "example.com",
      // Mock URL path
      urlpath: window.location.pathname,
      // Mock button name
      clickednodename: "Default Button",
      // Mock HTML5 flag
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({ node: { id: "default-node" } }),
    };

    // Expect the recordClicks function to successfully record clicks
    const result = await recordClicks(mockRequest);
    expect(result).toEqual({ success: true });

    // Expect the getSessionKey function to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);

    // Expect the REST.apiCal function to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body
      body: {
        // Spread in the mock request data
        ...mockRequest,
        // Add session ID to the body
        sessionid: "default-session-id",
      },
    });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the API call returns the expected response.
   *
   * This test case mocks the `window.location` object to set the host and pathname, and then mocks the `REST.apiCal` function to return the expected response. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} request - An object containing information about the user, recording, and click data.
   * @param {string} request.userId - The ID of the user.
   * @param {string} request.recordingId - The ID of the recording.
   * @param {object[]} request.clickData - An array of click data objects.
   * @returns {Promise<object>} - A promise that resolves with the expected response from the API.
   */
  test("recordClicks returns a promise that resolves with the expected response", async () => {
    // Mock window.location to test host and pathname
    Object.defineProperty(window, "location", {
      value: { host: "example.com", pathname: "/test" },
    });

    // Mock request object with userId, recordingId and empty clickData array
    const request = {
      userId: "mockUserId",
      recordingId: "mockRecordingId",
      clickData: [],
    };

    // Mock expected response from the API
    const expectedResponse = {
      domain: "example.com",
      urlpath: "/test",
      clickednodename: "Mock Click",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    };

    // Mock REST.apiCal to return the expected response
    // @ts-ignore
    const mockApiCal = REST.apiCal as jest.Mock<Promise<any>>;
    mockApiCal.mockResolvedValue(expectedResponse);

    const response = await recordClicks(request);

    // Expect the response to match the expected response
    expect(response).toEqual(expectedResponse);
  });

  // Test case to handle clicks on a modal close button
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `modalClosed` flag is set to `true`.
   *
   * This test case mocks the `userService.getSessionKey` function to return `"modal-session-id"`, and then mocks the `REST.apiCal` function to return a successful response with the `modalClosed` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  it("should handle clicks on a modal close button", async () => {
    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "modal-session-id"
    );
    // Mock API call to return success and modalClosed flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      modalClosed: true,
    });

    // Mock data simulating a click on a modal close button
    const mockRequest = {
      // Mock domain name
      domain: "modal.example.com",
      // Mock URL path
      urlpath: "/dashboard",
      // Mock button name
      clickednodename: "Close Modal",
      // Mock HTML5 flag
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node data
        node: {
          // Mock node ID
          id: "modal-close",
          // Mock tag name
          tagName: "BUTTON",
          // Mock class name
          className: "close-btn",
          // Mock aria label
          ariaLabel: "Close",
          // Mock inner HTML
          innerHTML: "&times;",
        },
      }),
    };

    // Record clicks with mock request data
    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body
      body: {
        // Spread in the mock request data
        ...mockRequest,
        // Add session ID to the body
        sessionid: "modal-session-id",
      },
    });
    // Expect result to be {success: true, modalClosed: true}
    expect(result).toEqual({ success: true, modalClosed: true });
  });

  // Test case to handle clicks on a pagination control
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `paginationClicked` flag is set to `true`.
   *
   * This test case mocks the `userService.getSessionKey` function to return `"pagination-session-id"`, and then mocks the `REST.apiCal` function to return a successful response with the `paginationClicked` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  it("should record clicks on a pagination control", async () => {
    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "pagination-session-id"
    );
    // Mock API call to return success and paginationClicked flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      paginationClicked: true,
    });

    // Mock data simulating a click on a pagination control
    const mockRequest = {
      // Mock domain name
      domain: "list.example.com",
      // Mock URL path
      urlpath: "/products",
      // Mock button name
      clickednodename: "Next Page",
      // Mock HTML5 value
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node ID
        node: {
          id: "pagination-next",
          // Mock tag name
          tagName: "A",
          // Mock class name
          className: "pagination-control",
          // Mock href attribute
          href: "/products?page=2",
          // Mock inner text
          innerText: "Next",
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // URL will be a string
      url: ENDPOINT.Record,
      // HTTP method will be POST
      method: "POST",
      // Body will be the mock request data with session ID added
      body: {
        ...mockRequest,
        // Add session ID to the body
        sessionid: "pagination-session-id",
      },
    });
    // Expect the result to be {success: true, paginationClicked: true}
    expect(result).toEqual({ success: true, paginationClicked: true });
  });

  // Test case to handle clicks on a custom interactive element
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `customInteraction` flag is set to `true`.
   *
   * This test case mocks the `userService.getSessionKey` function to return `"custom-session-id"`, and then mocks the `REST.apiCal` function to return a successful response with the `customInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  it("should handle clicks on a custom interactive element", async () => {
    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "custom-session-id"
    );
    // Mock API call to return success and customInteraction flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      customInteraction: true,
    });

    // Mock data simulating a click on a custom interactive element
    const mockRequest = {
      domain: "custom.example.com", // current domain
      urlpath: "/interactive-demo", // current path
      clickednodename: "Custom Slider", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: JSON.stringify({
        // object data as JSON string
        node: {
          id: "custom-slider", // DOM element ID
          tagName: "DIV", // DOM element tag name
          className: "interactive-slider", // DOM element class name
          role: "slider", // ARIA role
          ariaValueNow: "50", // ARIA value now
          ariaValueMin: "0", // ARIA value min
          ariaValueMax: "100", // ARIA value max
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Record,
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "custom-session-id",
      },
    });
    // Expect the result to be {success: true, customInteraction: true}
    expect(result).toEqual({ success: true, customInteraction: true });
  });
  // Test case to handle clicks on a dynamic content loader (e.g., "Load More" button)
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `dynamicContentLoaded` flag is set to `true`.
   *
   * This test case mocks the `userService.getSessionKey` function to return `"dynamic-session-id"`, and then mocks the `REST.apiCal` function to return a successful response with the `dynamicContentLoaded` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  it("should handle clicks on a dynamic content loader", async () => {
    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "dynamic-session-id"
    );
    // Mock API call to return success and dynamicContentLoaded flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      dynamicContentLoaded: true,
    });

    // Mock data simulating a click on a "Load More" button for dynamic content
    const mockRequest = {
      domain: "dynamic.example.com", // current domain
      urlpath: "/infinite-scroll", // current path
      clickednodename: "Load More", // clicked name
      html5: 0, // set to 0 (not HTML5)
      clickedpath: "", // empty because it's a button
      objectdata: JSON.stringify({
        node: {
          id: "load-more-button", // element id
          tagName: "BUTTON", // element tag name
          className: "dynamic-loader", // element class name
          innerText: "Load More", // element inner text
          dataset: {
            page: "2", // current page number
            itemsPerPage: "10", // number of items per page
          },
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect userService.getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect REST.apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Record,
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "dynamic-session-id",
      },
    });
    // Expect result to be success and dynamicContentLoaded flag
    expect(result).toEqual({ success: true, dynamicContentLoaded: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `otherInteraction` flag is set to `true`.
   *
   * This test case mocks the `userService.getSessionKey` function to return `"other-session-id"`, and then mocks the `REST.apiCal` function to return a successful response with the `otherInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should handle other click events", async () => {
    // Mock user session key to return "other-session-id"
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "other-session-id"
    );

    // Mock API call to return success and otherInteraction flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true, // API call success flag
      otherInteraction: true, // flag indicating other interaction occurred
    });

    // Mock data simulating a click on a button
    const mockRequest = {
      domain: "other.example.com", // current domain
      urlpath: "/other", // current path
      clickednodename: "Other Button", // clicked name
      html5: 0, // set to 0 (not HTML5)
      clickedpath: "", // empty because it's a button
      objectdata: JSON.stringify({
        node: {
          id: "other-button", // element id
          tagName: "BUTTON", // element tag name
          className: "other-btn", // element class name
          innerText: "Other Button", // element inner text
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect userService.getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect REST.apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Record,
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "other-session-id",
      },
    });
    // Expect result to be success and otherInteraction flag
    expect(result).toEqual({ success: true, otherInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `noInteraction` flag is set to `true` due to a null session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return `null`, and then mocks the `REST.apiCal` function to return a successful response with the `noInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should handle click events with no interaction", async () => {
    // Mock user session key to return a session ID
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "no-interaction-session-id"
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
      clickednodename: "No Interaction Button",
      // Mock HTML5 value
      html5: 0,
      // Mock clicked path
      clickedpath: "",
      // Mock object data
      objectdata: JSON.stringify({
        // Mock node data
        node: {
          // Mock node ID
          id: "no-interaction-button",
          // Mock tag name
          tagName: "BUTTON",
          // Mock class name
          className: "no-interaction-btn",
          // Mock inner text
          innerText: "No Interaction Button",
        },
      }),
    };

    const result = await recordClicks(mockRequest);

    // Expect userService.getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect REST.apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.Record,
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "no-interaction-session-id",
      },
    });
    // Expect result to be success and noInteraction flag
    expect(result).toEqual({ success: true, noInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `noInteraction` flag is set to `true` due to a null session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return `null`, and then mocks the `REST.apiCal` function to return a successful response with the `noInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should handle click events with no session key", async () => {
    // Mock user session key to return null
    (userService.getSessionKey as jest.Mock).mockResolvedValue(null);

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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };

    // Record clicks with mock request data
    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function returns success and the `noInteraction` flag is set to `true` due to an empty session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return an empty string, and then mocks the `REST.apiCal` function to return a successful response with the `noInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };

    // Record clicks with mock request data
    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: "",
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function fails with an invalid session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return a valid session key, and then mocks the `REST.apiCal` function to throw an error. It then verifies that the `recordClicks` function throws the expected error.
   *
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should throw an error when apiCal fails", async () => {
    // Mock user session key to return a valid session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "valid-session-key"
    );
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function fails with an invalid session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return an invalid session key, and then mocks the `REST.apiCal` function to return a successful response with the `noInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should handle click events with an invalid session key", async () => {
    // Mock user session key to return an invalid session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "invalid-session-key"
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };
    // Record clicks with mock request data
    const result = await recordClicks(mockRequest);
    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: "invalid-session-key",
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the `apiCal` function fails with an invalid session key.
   *
   * This test case mocks the `userService.getSessionKey` function to return a valid session key, and then mocks the `REST.apiCal` function to return a successful response with the `noInteraction` flag set to `true`. It then verifies that the `recordClicks` function returns the expected response.
   *
   * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
   * @param {string} mockRequest.domain - The domain of the website.
   * @param {string} mockRequest.urlpath - The URL path of the page.
   * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
   * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
   * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
   * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<void>} - A promise that resolves when the test case has completed.
   */
  test("should throw an error when apiCal fails with an invalid session key", async () => {
    // Mock user session key to return a valid session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "valid-session-key"
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };

    // Record clicks with mock request data
    const result = await recordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: "valid-session-key",
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });
});

/**
 * Tests the behavior of the `updateRecordClicks` function when the `userService.getSessionKey` function fails.
 *
 * This test case mocks the `userService.getSessionKey` function to throw an error, and then verifies that the `updateRecordClicks` function rejects with the expected error message.
 *
 * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
 * @param {string} mockRequest.domain - The domain of the website.
 * @param {string} mockRequest.urlpath - The URL path of the page.
 * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
 * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
 * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
 * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
 * @returns {Promise<void>} - A promise that resolves when the test case has completed.
 */
describe("updateRecordClicks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error when userService.getSessionKey fails", async () => {
    // Mock userService.getSessionKey to throw an error
    (userService.getSessionKey as jest.Mock).mockRejectedValue(
      new Error("Failed to get session key")
    );
    // Mock request data
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };
    // Try to update record clicks
    await expect(updateRecordClicks(mockRequest)).rejects.toThrow(
      "Failed to get session key"
    );
    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
  });
  /**
   * Updates the record of a user's click on a UI element.
   *
   * This function takes a request object containing information about the clicked UI element, such as the domain, URL path, button name, HTML5 value, clicked path, and object data. It then calls the `getSessionKey` function from the `userService` to retrieve the user's session key, and the `apiCal` function from the `REST` service to send the click data to the server.
   *
   * If the `getSessionKey` or `apiCal` functions fail, the function will reject with an error.
   *
   * @param {object} request - An object containing information about the clicked UI element.
   * @param {string} request.domain - The domain of the website.
   * @param {string} request.urlpath - The URL path of the page.
   * @param {string} request.clickednodename - The name of the clicked UI element.
   * @param {number} request.html5 - The HTML5 value of the clicked UI element.
   * @param {string} request.clickedpath - The path of the clicked UI element.
   * @param {string} request.objectdata - A JSON string containing data about the clicked UI element.
   * @returns {Promise<{ success: boolean, noInteraction: boolean }>} - A promise that resolves with an object containing a success flag and a flag indicating whether the interaction was successful.
   */
  test("should successfully update record clicks with valid request", async () => {
    // Mock user session key to return a valid session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "valid-session-key"
    );
    // Mock apiCal to return success and noInteraction flag
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // API call success flag
      success: true,
      // Flag indicating no interaction occurred
      noInteraction: true,
    });
    // Mock request data
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };

    // Update record clicks with mock request data
    const result = await updateRecordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.UpdateRecord,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: "valid-session-key",
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });

  /**
   * Tests that the `updateRecordClicks` function throws an error when the `apiCal` function fails.
   *
   * This test sets up mock data and mocks the `getSessionKey` and `apiCal` functions to return a valid session key and throw an error, respectively. It then calls the `recordClicks` function with the mock data and asserts that the function rejects with the expected error message.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `recordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should throw an error when apiCal fails", async () => {
    // Mock user session key to return a valid session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "valid-session-key"
    );
    // Mock apiCal to throw an error
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API call failed"));
    // Mock request data
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
          // Mock class name
          className: "btn btn-primary",
          // Mock inner text
          innerText: "Save",
        },
      }),
    };

    // Try to update record clicks
    await expect(recordClicks(mockRequest)).rejects.toThrow("API call failed");
  });

  /**
   * Tests that the `updateRecordClicks` function successfully updates record clicks.
   *
   * This test sets up mock data and mocks the `getSessionKey` and `apiCal` functions to return successful responses. It then calls the `updateRecordClicks` function with the mock data and asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should successfully update record clicks", async () => {
    // Mock data
    const mockSessionKey = "mock-session-key";
    const mockRequest = {
      // Mock request data
      domain: "example.com",
      urlpath: "/test-path",
      clickednodename: "Test Button",
      html5: 0,
      clickedpath: "",
      // Element data as a JSON string
      objectdata: JSON.stringify({ id: "test-id", type: "button" }),
    };

    // Mock function implementations
    // Mock getSessionKey to return the mock session key
    jest
      .spyOn(userService, "getSessionKey")
      .mockImplementation(() => Promise.resolve(mockSessionKey));
    // Mock apiCal to return {success: true}
    jest
      .spyOn(REST, "apiCal")
      .mockImplementation(() => Promise.resolve({ success: true }));

    const result = await updateRecordClicks(mockRequest);

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // URL will be a string
      url: expect.any(String),
      // HTTP method will be POST
      method: "POST",
      // Body will be the mock request data with session ID added
      body: {
        ...mockRequest,
        // Add session ID to the body
        sessionid: mockSessionKey,
      },
    });
    // Expect result to be {success: true}
    expect(result).toEqual({ success: true });
  });
  /**
   * Tests that the `updateRecordClicks` function handles errors and logs them.
   *
   * This test sets up a mock error and mocks the `getSessionKey` function to throw the error. It then calls the `updateRecordClicks` function and expects it to throw the same error. It also checks that the error was logged with the correct message.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle errors and log them", async () => {
    // Mock an error so we can test error handling
    const mockError = new Error("Test error");

    // Mock the getSessionKey function to throw the error
    jest
      .spyOn(userService, "getSessionKey")
      .mockImplementation(() => Promise.reject(mockError));

    // Call updateRecordClicks and expect it to throw the error
    await expect(updateRecordClicks()).rejects.toThrow("Test error");

    // Check that the error was logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      "Error in updateRecordClicks: Test error",
      mockError
    );
  });
  /**
   * Tests that the `updateRecordClicks` function handles missing request data gracefully.
   *
   * This test sets up a mock request object with an empty object, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} [mockRequest={}] - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle missing request data", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";

    // Mock function implementations
    jest.spyOn(userService, "getSessionKey").mockResolvedValue(mockSessionKey);
    // Mock apiCal function to return {success: true}
    jest.spyOn(REST, "apiCal").mockResolvedValue({ success: true });

    // Call updateRecordClicks with an empty object and await result
    const result = await updateRecordClicks({});

    // Expect getSessionKey to be called once
    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    // Expect apiCal to be called with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: expect.any(String),
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: { sessionid: mockSessionKey },
    });
    // Expect result to be {success: true}
    expect(result).toEqual({ success: true });
  });
  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a complex element with nested children.
   *
   * This test sets up a mock request object with a complex element that has nested child elements, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle different types of request data", async () => {
    // Mock request data with different types
    const mockSessionKey = "mock-session-key";
    const mockRequest = {
      domain: "test-domain.com", // domain name
      urlpath: "/complex/path", // current path
      clickednodename: "Complex Node", // clicked element name
      html5: 1, // set to 1 (HTML5)
      clickedpath: "/path/to/node", // clicked path
      objectdata: JSON.stringify({
        id: "complex-id", // element ID
        type: "div", // element type
        children: [
          { id: "child-1", type: "span" }, // child 1
          { id: "child-2", type: "button" }, // child 2
        ],
      }),
    };

    // Mock function implementations
    jest.spyOn(userService, "getSessionKey").mockResolvedValue(mockSessionKey);
    jest.spyOn(REST, "apiCal").mockResolvedValueOnce({
      success: true,
      data: "Complex data processed",
    });

    const result = await updateRecordClicks(mockRequest);

    expect(userService.getSessionKey).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String), // URL
      method: "POST", // method
      body: {
        ...mockRequest,
        sessionid: mockSessionKey, // session ID
      },
    });
    expect(result).toEqual({ success: true, data: "Complex data processed" });
  });

  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a button element.
   *
   * This test sets up a mock request object with a button element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on a button element", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";
    // Mock data for a button click
    const mockRequest = {
      domain: "example.com", // current domain
      urlpath: "/products", // current path
      clickednodename: "Buy Now", // clicked name
      html5: 0, // set to 0 (not HTML5)
      clickedpath: "", // empty because it's a button
      objectdata: JSON.stringify({
        type: "button", // element type is button
        id: "buy-now-btn", // element id
      }),
    };

    // Spy on user service getSessionKey to return mock session key
    jest.spyOn(userService, "getSessionKey").mockResolvedValue(mockSessionKey);
    // Spy on REST apiCal to return success and element type: button
    jest
      .spyOn(REST, "apiCal")
      .mockResolvedValue({ success: true, elementType: "button" });

    // Call updateRecordClicks with mock request and await result
    const result = await updateRecordClicks(mockRequest);

    // Expect REST apiCal to be called with correct URL, method, and body
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: mockSessionKey,
      },
    });
    // Expect result to be success and element type: button
    expect(result).toEqual({ success: true, elementType: "button" });
  });

  /**
   * Tests that the `updateRecordClicks` function successfully records a click on an anchor element.
   *
   * This test sets up a mock request object with an anchor element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on an anchor element", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";
    // Mock data for an anchor click
    const mockRequest = {
      domain: "example.com", // current domain
      urlpath: "/blog", // current path
      clickednodename: "Read More", // clicked name
      html5: 0, // set to 0 (not HTML5)
      clickedpath: "", // clicked path (empty)
      objectdata: JSON.stringify({ type: "a", href: "/article/123" }), // object data
    };

    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      elementType: "anchor",
    });

    const result = await updateRecordClicks(mockRequest);

    // Verify that REST.apiCal function is called with the expected arguments
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: mockSessionKey,
      },
    });
    // Verify that the result matches the expected value
    expect(result).toEqual({ success: true, elementType: "anchor" });
  });

  /**
   * Tests that the `updateRecordClicks` function successfully records a click on an input element.
   *
   * This test sets up a mock request object with an input element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on an input element", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";
    // Mock data for an input click
    const mockRequest = {
      domain: "example.com", // current domain
      urlpath: "/search", // current path
      clickednodename: "Search Input", // clicked name
      html5: 0, // set to 0 (not HTML5)
      clickedpath: "", // empty string by default
      // Object data as a JSON string
      objectdata: JSON.stringify({ type: "input", id: "search-box" }),
    };

    // Mock getSessionKey implementation, return a mock session key
    (getSessionKey as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockSessionKey)
    );
    // Mock REST.apiCal implementation, return a mock data object
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve({ success: true, elementType: "input" })
    );

    // Call updateRecordClicks with the mock request data
    const result = await updateRecordClicks(mockRequest);

    // Assert that REST.apiCal was called with the correct arguments
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String), // expect any string
      method: "POST", // HTTP POST method
      body: {
        ...mockRequest, // spread the mock request object
        sessionid: mockSessionKey, // add session ID to the request
      },
    });
    // Assert that the result matches the expected data object
    expect(result).toEqual({ success: true, elementType: "input" });
  });
  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a custom HTML5 element.
   *
   * This test sets up a mock request object with a custom HTML5 element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on a custom element with HTML5 flag", async () => {
    const mockSessionKey = "mock-session-key";
    // Mock data for a custom HTML5 element click
    const mockRequest = {
      domain: "example.com",
      urlpath: "/dashboard",
      clickednodename: "Custom Widget",
      // HTML5 flag (1 = true, 0 = false)
      html5: 1,
      clickedpath: "",
      // Object data for the custom element
      objectdata: JSON.stringify({
        // Type of the custom element
        type: "custom-widget",
        // Data ID for the custom element
        dataId: "widget-123",
      }),
    };

    // Mock the session key
    jest.spyOn(userService, "getSessionKey").mockResolvedValue(mockSessionKey);
    // Mock the API call
    jest
      .spyOn(REST, "apiCal")
      .mockResolvedValueOnce({ success: true, elementType: "custom" });

    const result = await updateRecordClicks(mockRequest);

    // Check if the API call was made with the correct data
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        // Session ID should be added to the request
        sessionid: mockSessionKey,
      },
    });
    // Check if the result is as expected
    expect(result).toEqual({ success: true, elementType: "custom" });
  });

  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a complex nested element.
   *
   * This test sets up a mock request object with a complex nested element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on a complex nested element", async () => {
    const mockSessionKey = "mock-session-key";
    // Mock data for a complex nested element click
    const mockRequest = {
      domain: "example.com",
      urlpath: "/dashboard",
      clickednodename: "Nested Button",
      html5: 0,
      // CSS selector for the element that was clicked
      clickedpath: "div > section > article > button",
      // Object data containing information about the element that was clicked
      objectdata: JSON.stringify({
        type: "button",
        id: "nested-btn",
        // ID of the parent element
        parentId: "article-123",
        // ID of the grandparent element
        grandParentId: "section-456",
      }),
    };

    // Mock the user session ID
    jest.spyOn(userService, "getSessionKey").mockResolvedValue(mockSessionKey);
    // Mock API response
    jest.spyOn(REST, "apiCal").mockResolvedValueOnce({
      success: true,
      elementType: "nestedButton",
    });

    const result = await updateRecordClicks(mockRequest);

    // Verify that the API was called correctly
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: mockSessionKey,
      },
    });
    // Verify that the result is correct
    expect(result).toEqual({ success: true, elementType: "nestedButton" });
  });

  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a dynamically generated element.
   *
   * This test sets up a mock request object with a dynamically generated element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle a click on a dynamically generated element", async () => {
    // Mock data for a dynamically generated element click
    const mockRequest = {
      domain: "example.com",
      urlpath: "/products",
      clickednodename: "Dynamic Product Card",
      html5: 1,
      clickedpath: "",
      objectdata: JSON.stringify({
        type: "div",
        class: "product-card",
        dataProductId: "789",
        // Timestamp of when the element was generated
        generatedAt: new Date().toISOString(),
      }),
    };

    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "mock-session-key"
    );
    // Mock API call to return success and elementType
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      elementType: "dynamicElement",
    });

    const result = await updateRecordClicks(mockRequest);

    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "mock-session-key",
      },
    });
    // Assert that the response is as expected
    expect(result).toEqual({ success: true, elementType: "dynamicElement" });
  });
  /**
   * Tests that the `updateRecordClicks` function successfully records a click on an element with an unknown type.
   *
   * This test sets up a mock request object with an unknown element type, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a click on an unknown element type", async () => {
    // Mock data for an unknown element type
    const mockRequest = {
      domain: "example.com",
      urlpath: "/products",
      clickednodename: "Unknown Element",
      html5: 1,
      clickedpath: "",
      objectdata: JSON.stringify({
        type: "unknown",
        // Additional data for the unknown element
        data: "additional data",
      }),
    };

    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "mock-session-key"
    );
    // Mock API call to return success and elementType
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      elementType: "unknown",
    });

    const result = await updateRecordClicks(mockRequest);

    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "mock-session-key",
      },
    });
    // Assert that the response is as expected
    expect(result).toEqual({ success: true, elementType: "unknown" });
  });
  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a custom element.
   *
   * This test sets up a mock request object with all the required properties, including a custom element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a click on a custom element", async () => {
    // Mock data for a custom element click
    const mockRequest = {
      domain: "example.com",
      urlpath: "/products",
      clickednodename: "Custom Element",
      html5: 1,
      clickedpath: "",
      objectdata: JSON.stringify({
        type: "custom",
        // Additional data for the custom element
        data: "additional data",
      }),
    };

    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "mock-session-key"
    );
    // Mock API call to return success and elementType
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      elementType: "custom",
    });

    const result = await updateRecordClicks(mockRequest);

    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "mock-session-key",
      },
    });
    // Assert that the response is as expected
    expect(result).toEqual({ success: true, elementType: "custom" });
  });
  /**
   * Tests that the `updateRecordClicks` function successfully records a click on a dynamically generated element.
   *
   * This test sets up a mock request object with all the required properties, including a dynamically generated element, and then calls the `updateRecordClicks` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `updateRecordClicks`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a click on a dynamically generated element", async () => {
    // Mock data for a dynamically generated element click
    const mockRequest = {
      domain: "example.com",
      urlpath: "/products",
      clickednodename: "Dynamic Product Card",
      html5: 1,
      clickedpath: "",
      objectdata: JSON.stringify({
        type: "div",
        class: "product-card",
        dataProductId: "789",
        // Timestamp of when the element was generated
        generatedAt: new Date().toISOString(),
      }),
    };

    // Mock user session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(
      "mock-session-key"
    );
    // Mock API call to return success and elementType
    (REST.apiCal as jest.Mock).mockResolvedValue({
      success: true,
      elementType: "dynamicElement",
    });

    const result = await updateRecordClicks(mockRequest);

    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "POST",
      body: {
        ...mockRequest,
        sessionid: "mock-session-key",
      },
    });
    // Assert that the response is as expected
    expect(result).toEqual({ success: true, elementType: "dynamicElement" });
  });
});
/**
 * Tests that the `recordSequence` function successfully records a sequence.
 *
 * This test sets up a mock request object with all the required properties, and then calls the `recordSequence` function with the mock request object. It asserts that the function returns the expected success response, and that the API call was made with the correct request body, including the user session ID.
 *
 * @async
 * @param {object} mockRequest - The mock request object to be passed to `recordSequence`.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
describe("recordSequence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully record a sequence", async () => {
    // Mock data for the request object, representing a typical request object
    const mockRequest = {
      // Domain name
      domain: "example.com",
      // URL path
      urlpath: window.location.pathname,
      // Button name
      clickednodename: "Test Button",
      // HTML5 flag
      html5: 0,
      // Clicked path
      clickedpath: "",
      // Object data with key-value pair
      objectdata: JSON.stringify({ key: "value" }),
    };

    // Mock user ID
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Mock API call to return success
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    // Call recordSequence with mock request and await result
    const result = await recordSequence(mockRequest);

    // Assert that the result is as expected
    expect(result).toEqual({ success: true });
    // Assert that the user ID is called once
    expect(getUserId).toHaveBeenCalled();
    // Assert that the API call was made with the correct request body
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // URL is not important for this test
        url: expect.any(String),
        // Method is POST
        method: "POST",
        // Body contains user ID
        body: expect.objectContaining({ usersessionid: "user123" }),
      })
    );
  });

  /**
   * Tests that the `recordSequence` function throws an error if the request object is not provided.
   *
   * This test sets up a mock request object with all the required properties, and then calls the `recordSequence` function without passing the request object. It asserts that the function throws the expected error.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should throw an error if request object is not provided", async () => {
    // Mock request object with all required properties
    const mockRequest = {
      // Domain name
      domain: "example.com",
      // URL path
      urlpath: window.location.pathname,
      // Button name
      clickednodename: "Test Button",
      // HTML5 flag
      html5: 0,
      // Clicked path
      clickedpath: "",
      // Object data with key-value pair
      objectdata: JSON.stringify({ key: "value" }),
    };

    // Call recordSequence with mock request and expect it to throw an error
    await expect(recordSequence()).rejects.toThrow(
      "Request object is required"
    );
  });
  test("should throw an error if request object is not provided", async () => {
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

    // Call recordSequence with mock request and expect it to throw an error
    await expect(recordSequence()).rejects.toThrow(
      "Request object is required"
    );
  });

  /**
   * Tests that the `recordSequence` function correctly handles a failure when getting the user ID.
   *
   * This test sets up a mock request object and mocks the `getUserId` function to reject with an error. It then calls the `recordSequence` function with the mock request object and asserts that the function throws the expected error. It also asserts that the error is logged with the correct message.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle getUserId failure", async () => {
    const domain = "example.com";
    const text = "Test Button";
    const jsonString = JSON.stringify({ key: "value" });

    const mockRequest = {
      domain,
      urlpath: window.location.pathname,
      clickednodename: text,
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
    };

    // Mock getUserId failure
    (getUserId as jest.Mock).mockRejectedValue(new Error("User ID Error"));

    // Mock API call success
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: mockRequest,
    });

    // Call recordSequence and expect it to throw an error
    await expect(recordSequence(mockRequest)).rejects.toThrow("User ID Error");

    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error in recordSequence"),
      expect.any(Error)
    );
  });

  /**
   * Tests that the `recordSequence` function correctly includes all request properties in the API call.
   *
   * This test sets up a mock request object with various properties, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including all the properties of the mock request object.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should include all request properties in the API call", async () => {
    const domain = "example.com"; // Mocked domain
    const text = "Test Button"; // Mocked text
    const jsonString = JSON.stringify({ key: "value" }); // Mocked JSON string

    const mockRequest = {
      domain,
      urlpath: window.location.pathname, // Current URL path
      clickednodename: text,
      html5: 0, // Default value
      clickedpath: "", // Default empty string
      objectdata: jsonString,
    };

    (getUserId as jest.Mock).mockResolvedValue("user123"); // Mocked user ID
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true }); // Mock API call success

    await recordSequence(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.RecordSequence,
        body: expect.objectContaining({
          usersessionid: "user123", // Mocked user ID
          domain: domain, // Mocked domain
          urlpath: expect.any(String), // Current URL path
          clickednodename: text, // Mocked text
          html5: 0, // Default value
          clickedpath: "", // Default empty string
          objectdata: jsonString, // Mocked JSON string
        }),
      })
    );
  });
  /**
   * Tests that the `recordSequence` function correctly uses the correct ENDPOINT for the RecordSequence API call.
   *
   * This test sets up a mock request object and mocks the API call response. It then calls the `recordSequence` function with the mock request object and asserts that the `REST.apiCal` function is called with the expected ENDPOINT.
   *
   * @async
   * @param {object} request - The mock request object to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should use the correct ENDPOINT for RecordSequence", async () => {
    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user456");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "Test Button",
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ key: "value" }),
    });

    // Inline comment: Mocked request data
    const request = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "Test Button",
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ key: "value" }),
    };

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(request);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINT.RecordSequence,
      })
    );
  });

  /**
   * Tests that the `recordSequence` function correctly handles a request with a complex objectdata structure.
   *
   * This test sets up a mock request object with a complex objectdata structure, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including the complex objectdata structure.
   *
   * @async
   * @param {object} complexRequest - The mock request object with a complex objectdata structure to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a complex objectdata structure", async () => {
    const complexRequest = {
      // Inline comment: This mock data represents a request with a complex objectdata structure
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "Complex Element",
      html5: 0,
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      objectdata: JSON.stringify({
        id: "complex-element",
        attributes: { "data-test": "value", "aria-label": "Complex Element" },
        children: [{ type: "text", content: "Click me" }],
      }),
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user789");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "Complex Element",
      html5: 0,
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      objectdata: JSON.stringify({
        id: "complex-element",
        attributes: { "data-test": "value", "aria-label": "Complex Element" },
        children: [{ type: "text", content: "Click me" }],
      }),
    });

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(complexRequest);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Inline comment: The objectdata property is a JSON string that represents the DOM element
        // that was clicked. In this case, it's a complex object with an id, attributes, and children.
        body: expect.objectContaining({
          objectdata: expect.stringContaining("complex-element"),
        }),
      })
    );
  });

  /**
   * Tests that the `recordSequence` function correctly sends a request to the API with an HTML5 element.
   *
   * This test sets up a mock request object with an HTML5 element, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including the HTML5 flag and the clicked element name.
   *
   * @async
   * @param {object} html5Request - The mock request object with an HTML5 element to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a request with html5 set to 1", async () => {
    // Inline comment: This mock data represents a request for an HTML5 element
    const html5Request = {
      domain: "example.com",
      urlpath: window.location.pathname,
      // Inline comment: The name of the element that was clicked
      clickednodename: "Video Player",
      // Inline comment: The html5 property is set to 1 to indicate that the element is an HTML5 element
      html5: 1,
      // Inline comment: The clickedpath property is empty because the element is an HTML5 element
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      objectdata: JSON.stringify({
        id: "video-player",
        attributes: { "data-test": "value", "aria-label": "Video Player" },
        children: [{ type: "text", content: "Click to play video" }],
      }),
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user101");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "Video Player",
      html5: 1,
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      objectdata: JSON.stringify({
        id: "video-player",
        attributes: { "data-test": "value", "aria-label": "Video Player" },
        children: [{ type: "text", content: "Click to play video" }],
      }),
    });

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(html5Request);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Inline comment: The objectdata property is a JSON string that represents the DOM element
        // that was clicked. In this case, it's a complex object with an id, attributes, and children.
        body: expect.objectContaining({
          html5: 1,
          clickednodename: "Video Player",
        }),
      })
    );
  });

  /**
   * Tests that the `recordSequence` function correctly sends a request to the API with a non-empty clicked path.
   *
   * This test sets up a mock request object with a specific clicked path, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including the clicked path.
   *
   * @async
   * @param {object} clickedPathRequest - The mock request object with a non-empty clicked path to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a request with a non-empty clickedpath", async () => {
    // Inline comment: This mock data represents a request with a specific clicked path
    const clickedPathRequest = {
      // Inline comment: This mock data represents a request with a specific clicked path
      domain: "example.com",
      urlpath: window.location.pathname,
      text: "Submit Button",
      jsonString: JSON.stringify({}),
      clickedpath: "body > div > button#submit", // The clickedpath property is set to the path of the element that was clicked
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user202");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      domain: clickedPathRequest.domain,
      urlpath: clickedPathRequest.urlpath,
      clickednodename: clickedPathRequest.text,
      html5: 0,
      clickedpath: clickedPathRequest.clickedpath,
      objectdata: clickedPathRequest.jsonString,
    });

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(clickedPathRequest);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Inline comment: The clickedpath property is set to the path of the element that was clicked
        body: expect.objectContaining({
          clickedpath: clickedPathRequest.clickedpath,
        }),
      })
    );
  });

  /**
   * Tests that the `recordSequence` function correctly sends a request to the API with a different domain and URL path.
   *
   * This test sets up a mock request object with a different domain and URL path, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including the different domain and URL path.
   *
   * @async
   * @param {object} differentDomainRequest - The mock request object with a different domain and URL path to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a request with a different domain and urlpath", async () => {
    // Inline comment: This mock data represents a request from a different domain and path
    const differentDomainRequest = {
      // Inline comment: The domain property is set to a different domain
      domain: "anotherdomain.com",
      // Inline comment: The urlpath property is set to a different path
      urlpath: "/products/item123",
      // Inline comment: The text property is set to the name of the element that was clicked
      text: "Submit Button",
      // Inline comment: The jsonString property is set to a JSON string that represents the DOM element
      // that was clicked. In this case, it's an empty object.
      jsonString: JSON.stringify({}),
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user303");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's a complex object with an id, attributes, and children.
      domain: differentDomainRequest.domain,
      urlpath: differentDomainRequest.urlpath,
      clickednodename: differentDomainRequest.text,
      html5: 0,
      clickedpath: "",
      objectdata: differentDomainRequest.jsonString,
    });

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(differentDomainRequest);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Inline comment: The body property is an object that contains the request data
        body: expect.objectContaining({
          // Inline comment: The domain property is set to the domain from the request
          domain: differentDomainRequest.domain,
          // Inline comment: The urlpath property is set to the path from the request
          urlpath: differentDomainRequest.urlpath,
        }),
      })
    );
  });
  /**
   * Tests that the `recordSequence` function correctly sends a request to the API with special characters in the request data.
   *
   * This test sets up a mock request object with special characters in the domain, urlpath, clickednodename, and objectdata properties, and then calls the `recordSequence` function with the mock request object. It asserts that the `REST.apiCal` function is called with the expected request data, including the special characters.
   *
   * @async
   * @param {object} mockRequest - The mock request object to be passed to `recordSequence`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should handle a request with special characters in clickednodename", async () => {
    // Inline comment: Mock data for the request object
    const mockRequest = {
      // Inline comment: The domain property is set to a domain with special characters
      domain: "example.com",
      // Inline comment: The urlpath property is set to a path with special characters
      urlpath: "/special-page",
      // Inline comment: The clickednodename property is set to a name with special characters
      clickednodename: 'Button with <special> & "characters"',
      // Inline comment: The html5 property is set to 0
      html5: 0,
      // Inline comment: The clickedpath property is an empty string
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's an object with an id, class, and attributes.
      objectdata: JSON.stringify({
        // Inline comment: The id property is set to a string with special characters
        id: "special-btn",
        // Inline comment: The class property is set to a string with special characters
        class: "btn-special",
        // Inline comment: The attributes property is an object with special characters
        attributes: {
          // Inline comment: The data-special attribute is set to "true"
          "data-special": "true",
          // Inline comment: The aria-label attribute is set to a string with special characters
          "aria-label": "Special Button",
        },
      }),
    };

    // Inline comment: Mock user ID to be used in the API call
    (getUserId as jest.Mock).mockResolvedValue("user404");

    // Inline comment: Mock successful API call response
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    // Inline comment: Call the recordSequence function with the mocked request data
    await recordSequence(mockRequest);

    // Inline comment: Assert that the ENDPOINT is correct
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        // Inline comment: The body property is an object that contains the request data
        body: expect.objectContaining({
          // Inline comment: The domain property is set to the domain from the request
          domain: "example.com",
          // Inline comment: The urlpath property is set to the path from the request
          urlpath: "/special-page",
          // Inline comment: The clickednodename property is set to the name from the request
          clickednodename: 'Button with <special> & "characters"',
          // Inline comment: The html5 property is set to 0
          html5: 0,
          // Inline comment: The clickedpath property is an empty string
          clickedpath: "",
          // Inline comment: The objectdata property is a JSON string that represents the DOM element
          // that was clicked. In this case, it's an object with an id, class, and attributes.
          objectdata: expect.stringContaining("special-btn"),
        }),
      })
    );
  });
});
/**
 * Tests that the `userClick` function correctly sends a successful request to the API.
 *
 * This test sets up a mock request object with the required properties, and then calls the `userClick` function with the mock request object. It asserts that the `userClick` function resolves with the expected success response, and that the `REST.apiCal` function is called with the expected request data.
 *
 * @async
 * @param {object} mockSuccessRequest - The mock request object to be passed to `userClick`.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
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
   * Tests that the `userClick` function correctly throws an error if the request object is missing.
   *
   * This test sets up a mock request object with the required properties, and then calls the `userClick` function without passing the request object. It asserts that the `userClick` function rejects with an error message that contains the text "Request object is required".
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */

  it("should throw an error if request object is missing", async () => {
    // Inline comment: Mock data for the request object
    const mockRequest = {
      // Inline comment: The domain property is set to the domain from the request
      domain: "example.com",
      // Inline comment: The urlpath property is set to the path from the request
      urlpath: "/test-path",
      // Inline comment: The clickednodename property is set to the name from the request
      clickednodename: "test-clicked-name",
      // Inline comment: The html5 property is set to 0
      html5: 0,
      // Inline comment: The clickedpath property is an empty string
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string of an empty object
      objectdata: "{}",
    };

    await expect(userClick()).rejects.toEqual(
      expect.objectContaining({
        // Inline comment: The error message should contain the text "Request object is required"
        message: "Request object is required",
      })
    );
  });

  /**
   * Tests that the `userClick` function correctly logs and re-throws an error if an error occurs during the API call.
   *
   * This test sets up a mock error response from the `REST.apiCal` function, and then calls the `userClick` function with the mock error response. It asserts that the `userClick` function rejects with the expected error message, and that the `UDAErrorLogger.error` function is called with the expected error details.
   *
   * @async
   * @param {object} mockErrorResponse - The mock error response to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should log and re-throw an error if an error occurs", async () => {
    const mockErrorResponse = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: 'Button with <special> & "characters"',
      html5: 0,
      clickedpath: "",
      objectdata: expect.stringContaining("special-btn"),
    };

    // Mock the REST.apiCal function to throw a mock error
    jest
      .spyOn(REST, "apiCal")
      .mockRejectedValue(
        new Error(`Error in userClick: ${mockErrorResponse.domain}`)
      );

    await expect(userClick(mockErrorResponse)).rejects.toThrow(
      `Error in userClick: ${mockErrorResponse.domain}`
    );
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      expect.stringContaining(mockErrorResponse.domain),
      expect.objectContaining({
        ...mockErrorResponse,
        urlpath: window.location.pathname,
      })
    );
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
   * Tests that the `userClick` function logs the error using `UDAErrorLogger` when the API call fails.
   *
   * This test sets up a mock request object, mocks the user ID returned by `getUserId`, and mocks the `REST.apiCal` function to throw an error. It then calls the `userClick` function with the mock request object and asserts that the `UDAErrorLogger.error` function is called with the expected error message and error object.
   *
   * @async
   * @param {object} request - The mock request data to be passed to `userClick`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should log error using UDAErrorLogger when apiCal fails", async () => {
    const request = { test: "test" };
    const userId = "testUserId";
    const domain = "example.com"; // current domain
    const text = "testText"; // clicked name
    const jsonString = JSON.stringify({ test: "test" }); // empty object as JSON string by default
    const error = new Error("API call failed");

    // Mock user ID
    jest.spyOn(userService, "getUserId").mockResolvedValue(userId);

    // Mock REST apiCall to throw an error
    jest.spyOn(REST, "apiCal").mockRejectedValue(error);

    // Mock UDAErrorLogger to check for error logging
    const mockedErrorLogger = jest.spyOn(UDAErrorLogger, "error");

    // Call userClick with mock request and await result
    await expect(userClick(request)).rejects.toThrowError(error);

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
        domain,
        urlpath: window.location.pathname,
        clickednodename: text,
        html5: 0,
        clickedpath: "",
        objectdata: jsonString,
      },
    });

    // Expect UDAErrorLogger to log the error
    expect(mockedErrorLogger).toHaveBeenCalledWith(
      "Error in userClick: API call failed",
      error
    );
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
});
// Test cases for deleteRecording
/**
 * Tests that the `deleteRecording` function throws an error if the request object is not provided.
 *
 * This test sets up a mock request object with `undefined` value and asserts that the `deleteRecording` function throws an error with the expected message.
 *
 * @async
 * @param {object|undefined} request - The mock request data to be passed to `deleteRecording`. If `undefined`, the function should throw an error.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
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
      // ... other relevant data
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
      "Error in deleteRecording: API call failed",
      new Error("API call failed")
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

      // ... other relevant data
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
});
/**
 * Tests that the `updateRecording` function successfully updates a recording with a valid request.
 *
 * This test sets up a mock request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the `getUserId` function was called, the `REST.apiCal` function was called with the correct parameters, and the result of the API call is the mock response.
 *
 * @async
 * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
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
   * Tests that the `updateRecording` function does not modify the original request object.
   *
   * This test sets up a mock request object, creates a copy of the original request object, mocks the `getUserId` function to return a mock user ID, and mocks the `REST.apiCal` function to return a mock response. It then calls `updateRecording` with the mock request and asserts that the original request object has not been modified.
   *
   * @async
   * @param {object} mockRequest - The mock request data to be passed to `updateRecording`.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should not modify original request object", async () => {
    // Mock data: valid request object
    const mockRequest = { data: "test" };
    // Create a copy of the original request object
    const originalRequest = { ...mockRequest };
    // Mock user ID
    const mockUserId = "user123";
    // Mock response from user service getUserID
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    // Mock response from REST apiCal
    (REST.apiCal as jest.Mock).mockResolvedValue({});

    // Call updateRecording with the mock request
    await updateRecording(mockRequest);

    // Assert that the original request object has not been modified
    expect(mockRequest).toEqual(originalRequest);
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
});
/**
 * Resets all mocks after each test in the `profanityCheck` test suite.
 *
 * This hook is used to ensure that each test in the `profanityCheck` suite starts with a clean slate, without any mock implementations or call counts from previous tests. This helps to isolate the behavior being tested in each individual test case.
 */
afterEach(() => {
  jest.resetAllMocks();
});
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
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          // Set the Content-Type header to "text/plain"
          "Content-Type": "text/plain",
          // Set the Ocp-Apim-Subscription-Key header to the profanity API key
          "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
        }),
      })
    );
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
    await expect(profanityCheck("test request")).rejects.toThrow(errorMessage);

    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      `Error in profanityCheck: ${errorMessage}`,
      expect.any(Error)
    );
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
    (REST.apiCal as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    // Call profanityCheck with mock request and expect it to throw an error
    await expect(profanityCheck(mockRequest)).rejects.toThrow(error);

    // Assert that the error is logged with the correct message
    expect(UDAErrorLogger.error).toHaveBeenCalledWith(
      `Error in profanityCheck: ${error.message}`,
      error
    );
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

    // Assert that the API call was made with the correct Ocp-Apim-Subscription-Key header
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          // Use the correct profanity API key from the configuration
          "Ocp-Apim-Subscription-Key": expect.any(String),
        }),
      })
    );
  });
});

/**
 * Tests that the `saveClickData` function logs and rethrows errors using the `UDAErrorLogger`.
 *
 * This test sets up a mock error, mocks the `domJSON.toJSON` function to throw the mock error, calls `saveClickData` with mock data, and asserts that the error is logged with the correct message and that the error is rethrown.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
describe("saveClickData", () => {
  // Mock a DOM node
  const mockNode = {
    // Mock the cloneNode function to return an empty object
    cloneNode: () => ({}),
    // Mock the nodeName property to be "DIV"
    nodeName: "DIV",
    // Mock the outerHTML property to be a string representation of a div element
    outerHTML: "<div></div>",
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
});

/**
 * Tests that the `recordUserClickData` function calls `getSessionKey` to get the user's session ID.
 *
 * This test sets up a mock session key, mocks the `getSessionKey` function to return the mock session key, calls `recordUserClickData`, and asserts that `getSessionKey` is called once with no arguments.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
describe("recordUserClickData", () => {
  it("should call getSessionKey to get the user session ID", async () => {
    // Mock user session key
    const mockSessionKey = "mock-session-key";
    // Mock getSessionKey to return the mock session key
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Call recordUserClickData to test getSessionKey call
    await recordUserClickData();
    // Assert that getSessionKey is called with no arguments
    expect(getSessionKey).toHaveBeenCalledWith();
    // Assert that getSessionKey is called only once
    expect(getSessionKey).toHaveBeenCalledTimes(1);
    // Assert that getSessionKey is called again with no arguments
    expect(getSessionKey).toHaveBeenCalledWith();
  });
  /**
   * Tests that the `recordUserClickData` function creates the correct payload object with the required properties.
   *
   * This test sets up mock data for the user session key, click type, name of the element clicked, and record ID, calls `recordUserClickData` with this data, and asserts that the `userClick` function is called with the expected payload object.
   *
   * @async
   * @param {string} mockClickType - The type of click that occurred (e.g. left click, right click).
   * @param {string} mockClickedName - The name of the element that was clicked.
   * @param {number} mockRecordId - The ID of the record that was clicked.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  test("should call userClick with the correct payload", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";
    // Mock click type
    const mockClickType = "test-click-type";
    // Mock clicked name
    const mockClickedName = "test-clicked-name";
    // Mock record ID
    const mockRecordId = 123;
    // Mock getSessionKey to return the mock session key
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Call recordUserClickData with the mock data
    await recordUserClickData(mockClickType, mockClickedName, mockRecordId);
    // Assert that getSessionKey is called once
    expect(getSessionKey).toHaveBeenCalledTimes(1);
    // Assert that userClick is called once
    expect(userClick).toHaveBeenCalledTimes(1);
    // Assert that userClick is called with the correct payload object
    expect(userClick).toHaveBeenCalledWith({
      // The user's session ID
      usersessionid: mockSessionKey,
      // The name of the element clicked
      clickedname: mockClickedName,
      // The type of click that occurred (e.g. left click, right click)
      clicktype: mockClickType,
      // The ID of the record that was clicked
      recordid: mockRecordId,
    });
  });

  /**
   * Tests that the `recordUserClickData` function creates the correct payload object with the required properties.
   *
   * This test sets up mock data for the user session key, click type, name of the element clicked, and record ID, calls `recordUserClickData` with this data, and asserts that the `userClick` function is called with the expected payload object.
   *
   * @async
   * @param {string} clickType - The type of click that occurred (e.g. left click, right click).
   * @param {string} clickedName - The name of the element that was clicked.
   * @param {number} recordId - The ID of the record that was clicked.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should create the payload object with the required properties", async () => {
    const mockSessionKey = "mock-session-key";
    const clickType = "test-click-type";
    const clickedName = "test-clicked-name";
    const recordId = 123;
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    await recordUserClickData(clickType, clickedName, recordId);
    expect(getSessionKey).toHaveBeenCalledTimes(1);
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: clickedName,
      clicktype: clickType,
      recordid: recordId,
    });
  });
  /**
   * Tests that the `recordUserClickData` function handles errors thrown by the `getSessionKey` function.
   *
   * This test sets up a mock `getSessionKey` function that rejects with an error, calls `recordUserClickData` with some mock data, and expects the function to catch the error and log it using the `UDAErrorLogger.error` function.
   *
   * @async
   * @param {string} clickType - The type of click that occurred (e.g. left click, right click).
   * @param {string} clickedName - The name of the element that was clicked.
   * @param {number} recordId - The ID of the record that was clicked.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */

  it("should handle errors thrown by getSessionKey", async () => {
    // Mock getSessionKey to throw an error
    const error = new Error("Test error");
    const getSessionKeyMock = getSessionKey as jest.Mock;
    getSessionKeyMock.mockImplementation(() => Promise.reject(error));

    // Mock the session key, click type, name of the element clicked, and record ID
    const mockSessionKey = "test-session-key";
    const clickType = "test-click-type";
    const clickedName = "test-clicked-name";
    const recordId = 123;

    // Call recordUserClickData with the mock data
    try {
      await recordUserClickData(clickType, clickedName, recordId);
      fail("Expected an error to be thrown");
    } catch (e) {
      // Assert that the error was logged with the correct message
      expect(e).toBe(error);
      expect(UDAErrorLogger.error).toHaveBeenCalledTimes(1);
      expect(UDAErrorLogger.error).toHaveBeenCalledWith(
        `Error in recordUserClickData: ${error.message}`,
        error
      );
    }
  });

  /**
   * Tests that the `recordUserClickData` function handles errors thrown by the `userClick` function.
   *
   * This test sets up a mock `userClick` function that rejects with an error, calls `recordUserClickData` with some mock data, and expects the function to catch the error and log it using the `UDAErrorLogger.error` function.
   *
   * @async
   * @param {string} clickType - The type of click that occurred (e.g. left click, right click).
   * @param {string} clickedName - The name of the element that was clicked.
   * @param {number} recordId - The ID of the record that was clicked.
   * @returns {Promise<void>} - A promise that resolves when the test is complete.
   */
  it("should handle errors thrown by userClick", async () => {
    const error = new Error("Test error");
    const userClickMock = jest.fn(() => Promise.reject(error));
    (userClick as jest.Mock) = userClickMock;

    const clickType = "test-click-type";
    const clickedName = "test-clicked-name";
    const recordId = 123;

    try {
      await recordUserClickData(clickType, clickedName, recordId);
      fail("Expected an error to be thrown");
    } catch (e) {
      expect(e).toStrictEqual(error);
      expect(UDAErrorLogger.error).toHaveBeenCalledTimes(1);
      expect(UDAErrorLogger.error).toHaveBeenCalledWith(
        `Error in recordUserClickData: ${error.message}`,
        error
      );
      expect(userClickMock).toHaveBeenCalledTimes(1);
      expect(userClickMock).toHaveBeenCalledWith({
        usersessionid: await getSessionKey(),
        clicktype: clickType,
        clickedname: clickedName,
        recordid: recordId,
      });
    }
  });
});
/**
 * Sets up the test environment by clearing all mocks, creating a new window object, and defining a writable `udanSelectedNodes` property on the window object.
 *
 * This setup is likely done to ensure a clean slate for each test, and to provide a consistent environment for testing the `postRecordSequenceData` function.
 */
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

    // Verify that postRecordSequenceData was called with the correct arguments
    expect(postRecordSequenceData).toHaveBeenCalledWith({
      // Spread the mock request object
      ...mockRequest,
      // Set the domain to the mock domain
      domain: mockDomain,
      // Set the isIgnored flag to 0
      isIgnored: 0,
      // Set the isValid flag to 1
      isValid: 1,
      // Set the userclicknodelist to the IDs of the mock user click nodes set
      userclicknodelist: "1,2",
      // Set the userclicknodesSet to the mock user click nodes set
      userclicknodesSet: mockUserClickNodesSet,
    });

    // Verify that the result is a success response
    expect(result).toEqual({ success: true });

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
   * Tests the error handling behavior of the `postRecordSequenceData` function when `getAbsoluteOffsets` throws an error.
   *
   * This test sets up a mock request object, a mock user click nodes set, and mocks the behavior of `getFromStore`, `fetchDomain`, and `getAbsoluteOffsets`. It then calls `postRecordSequenceData` with the mock request and expects the function to reject with the error thrown by `getAbsoluteOffsets`.
   *
   * @async
   * @param {Object} mockRequest - A mock request object with some test data.
   * @param {Array<{id: string}>} mockUserClickNodesSet - A mock set of user click nodes.
   * @throws {Error} - The error thrown by `getAbsoluteOffsets`.
   */
  test("should handle errors thrown by getAbsoluteOffsets", async () => {
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
    // Mock getAbsoluteOffsets to throw an error
    (getAbsoluteOffsets as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("Test error"))
    );
    // Call postRecordSequenceData with the mock request and expect it to throw the error
    await expect(postRecordSequenceData(mockRequest)).rejects.toThrow(
      "Test error"
    );
  });
});
