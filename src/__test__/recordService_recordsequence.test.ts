/**
 * Imports various modules and functions required for the recordSequence functionality.
 * - `getUserId` from `../services/userService`: Retrieves the user's ID.
 * - `ENDPOINT` from `../config/endpoints`: Provides the API endpoint for recording the sequence.
 * - `REST` from `../services`: Provides the API call functionality.
 * - `domJSON` from `domjson`: Converts the request object to JSON format.
 * - `TSON` from `typescript-json`: Provides a way to stringify the request object.
 * - `fetchDomain` from `../util/fetchDomain`: Fetches the domain information.
 * - `CONFIG` from `../config`: Provides the configuration settings.
 * - `UDAErrorLogger` from `../config/error-log`: Provides an error logging utility.
 * - `recordSequence` from `../services/recordService`: The main function that records the sequence.
 */
import { getUserId } from "../services/userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import domJSON from "domjson";
import TSON from "typescript-json";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import { UDAErrorLogger } from "../config/error-log";
import { recordSequence } from "../services/recordService";

/**
 * This code sets up mocks for various dependencies used in the `recordService_recordsequence.test.ts` file.
 *
 * - `domjson`: Mocks the `toJSON` function to return a mock value.
 * - `typescript-json`: Mocks the `stringify` function to return a mock JSON string.
 * - `../config/error-log`: Mocks the `UDAConsoleLogger` and `UDAErrorLogger` to return mock functions.
 * - `../services/userService`: Mocks the `getSessionKey` and `getUserId` functions.
 * - `../services`: Mocks the `REST.apiCal` function.
 * - `../util/fetchDomain`: Mocks the `fetchDomain` function.
 *
 * These mocks are used to isolate the `recordSequence` function from its dependencies, allowing for more focused unit testing.
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
 * Tests that the `recordSequence` function successfully records a sequence.
 *
 * This test sets up a mock request object with all the required properties, mocks the `getUserId` and `REST.apiCal` functions, and then calls the `recordSequence` function with the mock request object. It asserts that the function returns the expected result, and that the `getUserId` and `REST.apiCal` functions were called with the expected arguments.
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
  /**
   * Tests the `recordSequence` function with a request object that contains special characters in the `objectdata` property.
   * The test mocks the `getUserId` and `REST.apiCal` functions, and then calls the `recordSequence` function with the mocked request data.
   * It then asserts that the `REST.apiCal` function was called with the expected request data, including the special characters in the `objectdata` property.
   */
  test("should handle a request with special characters in objectdata", async () => {
    // Inline comment: Mock data for the request object
    const mockRequest = {
      // Inline comment: The domain property is set to a domain with special characters
      domain: "example.com",
      // Inline comment: The urlpath property is set to a path with special characters
      urlpath: "/special-page",
      // Inline comment: The clickednodename property is set to a name with special characters
      clickednodename: "Save Button",
      // Inline comment: The html5 property is set to 0
      html5: 0,
      // Inline comment: The clickedpath property is an empty string
      clickedpath: "",
      // Inline comment: The objectdata property is a JSON string that represents the DOM element
      // that was clicked. In this case, it's an object with an id, class, and attributes.
      objectdata: JSON.stringify({
        // Inline comment: The id property is set to a string with special characters
        id: "save-btn",
        // Inline comment: The class property is set to a string with special characters
        class: "btn-save",
        // Inline comment: The attributes property is an object with special characters
        attributes: {
          // Inline comment: The data-special attribute is set to "true"
          "data-special": "true",
          // Inline comment: The aria-label attribute is set to a string with special characters
          "aria-label": "Save Button",
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
          clickednodename: "Save Button",
          // Inline comment: The html5 property is set to 0
          html5: 0,
          // Inline comment: The clickedpath property is an empty string
          clickedpath: "",
          // Inline comment: The objectdata property is a JSON string that represents the DOM element
          // that was clicked. In this case, it's an object with an id, class, and attributes.
          objectdata: expect.stringContaining("save-btn"),
        }),
      })
    );
  });
});
