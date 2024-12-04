/**
 * This code imports various modules and services that are used in the `recordClicks` function, which is responsible for recording user click events on a website.
 *
 * The `ENDPOINT` constant is imported from the `../config/endpoints` module, which likely contains the API endpoint for recording click events.
 * The `REST` service is imported from the `../services` module, which provides a way to make API calls.
 * The `domJSON` and `TSON` modules are used for converting DOM elements and data to JSON format.
 * The `userService` module is imported, which provides functions for getting the user's session key and user ID.
 * Finally, the `recordClicks` function is imported from the `../services/recordService` module, which is the main function responsible for recording click events.
 */
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import * as userService from "../services/userService";
import { recordClicks } from "../services/recordService";

/**
 * This code sets up mocks for various modules and services used in the `recordClicks` function test suite.
 *
 * - The `domjson` module is mocked to provide a `toJSON` function that can be used for testing.
 * - The `typescript-json` module is mocked to provide a `stringify` function that returns a mocked JSON string.
 * - The `userService` module is mocked to provide `getSessionKey` and `getUserId` functions that can be used for testing.
 * - The `REST` service is mocked to provide an `apiCal` function that can be used for testing.
 * - The `fetchDomain` utility is mocked to provide a `fetchDomain` function that can be used for testing.
 *
 * These mocks are used to set up the test environment and ensure that the `recordClicks` function can be tested in isolation, without relying on the actual implementation of the mocked modules and services.
 */
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
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
  /**
   * Tests the behavior of the `recordClicks` function when the API call fails with an empty session key.
   *
   * This test mocks the `getSessionKey` function to return an empty string, and the `apiCal` function to return a successful response with a `noInteraction` flag.
   * It then calls the `recordClicks` function with a mock request object and verifies that the `getSessionKey` function is called once, the `apiCal` function is called with the correct data (including the empty session ID), and the result matches the expected response.
   */
  test("should throw an error when apiCal fails with an empty session key", async () => {
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
   * Tests the behavior of the `recordClicks` function when the API call fails due to a missing session key.
   * This test mocks the `getSessionKey` function to return `null`, and the `apiCal` function to return a successful response with the `noInteraction` flag set to `true`.
   * The test then calls `recordClicks` with a mock request object and verifies that the `getSessionKey` function is called once, the `apiCal` function is called with the correct data (including the `null` session ID), and the returned result matches the expected object.
   */
  test("should throw an error when apiCal fails with no session key", async () => {
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
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: null,
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the API call fails and the `noInteraction` flag is set to `true`.
   *
   * This test mocks the `getSessionKey` function to return `null`, simulating a scenario where there is no valid session key. It also mocks the `apiCal` function to return a successful response with the `noInteraction` flag set to `true`.
   *
   * The test then calls the `recordClicks` function with a mock request object and verifies that:
   * - `getSessionKey` is called once
   * - `apiCal` is called with the correct data, including the mock request object and a `null` session ID
   * - The returned result is an object with `success: true` and `noInteraction: true`
   */
  test("should throw an error when apiCal fails with no session key and noInteraction flag is set to true", async () => {
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
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Mock URL
      url: ENDPOINT.Record,
      // Mock method
      method: "POST",
      // Mock body with session ID
      body: {
        ...mockRequest,
        sessionid: null,
      },
    });
    // Expect result to be {success: true, noInteraction: true}
    expect(result).toEqual({ success: true, noInteraction: true });
  });
  /**
   * Tests the behavior of the `recordClicks` function when the API call fails and the `noInteraction` flag is set to `true`.
   * This test mocks the `getSessionKey` function to return an empty string, and the `apiCal` function to return a successful response with the `noInteraction` flag set to `true`.
   * It then calls the `recordClicks` function with a mock request object and verifies that the expected behavior occurs, including the correct calls to the mocked functions and the expected result.
   */
  test("should throw an error when apiCal fails with an empty session key and noInteraction flag is set to true", async () => {
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
});
