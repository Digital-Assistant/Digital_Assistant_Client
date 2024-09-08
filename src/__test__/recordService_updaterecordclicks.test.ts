/**
 * This code imports various modules and functions that are used in the `recordService_updaterecordclicks.test.ts` file. The imports include:
 * - `getSessionKey` and `getUserId` functions from the `userService` module
 * - `ENDPOINT` constant from the `config/endpoints` module
 * - `REST` module from the `services` module
 * - `domJSON` and `TSON` modules for JSON handling
 * - `fetchDomain` function from the `util/fetchDomain` module
 * - `UDAErrorLogger` from the `config/error-log` module
 * - `recordClicks` and `updateRecordClicks` functions from the `services/recordService` module
 *
 * These imports are used to set up the necessary dependencies for testing the `updateRecordClicks` function in the `recordService_updaterecordclicks.test.ts` file.
 */
import { getSessionKey } from "../services/userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import { fetchDomain } from "../util/fetchDomain";
import * as userService from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";
import { recordClicks, updateRecordClicks } from "../services/recordService";

/**
 * This code sets up mocks for various dependencies used in the `recordService_updaterecordclicks.test.ts` file. The mocks are used to simulate the behavior of these dependencies during testing.
 *
 * The mocks include:
 * - `domjson`: Mocks the `toJSON` function.
 * - `typescript-json`: Mocks the `stringify` function to return a mocked JSON string.
 * - `../config/error-log`: Mocks the `UDAConsoleLogger` and `UDAErrorLogger` objects.
 * - `../services/userService`: Mocks the `getSessionKey` and `getUserId` functions.
 * - `../services`: Mocks the `REST.apiCal` function.
 * - `../util/fetchDomain`: Mocks the `fetchDomain` function.
 *
 * These mocks are used to isolate the behavior of the `updateRecordClicks` function being tested, and to ensure that the test environment is controlled and predictable.
 */
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
}));
jest.mock("../config/error-log", () => ({
  UDAConsoleLogger: { info: jest.fn() },
  UDAErrorLogger: { error: jest.fn() },
}));
jest.mock("../services/userService", () => ({
  getSessionKey: jest.fn(),
  getUserId: jest.fn(),
}));
jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));
jest.mock("../util/fetchDomain", () => ({
  fetchDomain: jest.fn(),
}));

/**
 * Tests the behavior of the `updateRecordClicks` function when the `userService.getSessionKey` function fails.
 *
 * This test mocks the `userService.getSessionKey` function to throw an error, and then calls the `updateRecordClicks` function with a mock request object. It expects the `updateRecordClicks` function to reject with the same error that was thrown by the `userService.getSessionKey` function.
 *
 * @param {object} mockRequest - A mock request object containing information about a clicked UI element.
 * @param {string} mockRequest.domain - The domain of the website.
 * @param {string} mockRequest.urlpath - The URL path of the page.
 * @param {string} mockRequest.clickednodename - The name of the clicked UI element.
 * @param {number} mockRequest.html5 - The HTML5 value of the clicked UI element.
 * @param {string} mockRequest.clickedpath - The path of the clicked UI element.
 * @param {string} mockRequest.objectdata - A JSON string containing data about the clicked UI element.
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
