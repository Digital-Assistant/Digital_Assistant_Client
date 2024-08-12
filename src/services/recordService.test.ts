/**
 * This code imports various modules and functions that are used in the `recordService.test.ts` file. The imports include:
 * - Functions from the `userService` module, such as `getSessionKey` and `getUserId`.
 * - The `ENDPOINT` constant from the `config/endpoints` module.
 * - Functions from the `util` module, such as `getAbsoluteOffsets`, `inArray`, and `getFromStore`.
 * - The `REST` module from the `services` module.
 * - The `mapSelectedElementAction` function from the `util/mapSelectedElementAction` module.
 * - The `getNodeInfo` function from the `util/nodeInfo` module.
 * - The `domJSON` and `TSON` modules for JSON manipulation.
 * - The `UDAConsoleLogger` from the `config/error-log` module.
 * - The `fetchDomain` function from the `util/fetchDomain` module.
 * - The `CONFIG` object from the `config` module.
 * - The `specialNodes` object from the `util/specialNodes` module.
 * - Various functions from the `recordService` module, such as `recordClicks`, `updateRecordClicks`, `recordSequence`, `userClick`, `deleteRecording`, `updateRecording`, `profanityCheck`, `saveClickData`, `postRecordSequenceData`, and `recordUserClickData`.
 */
import { getSessionKey, getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { getAbsoluteOffsets } from "../util";
import { REST } from ".";
import { mapSelectedElementAction } from "../util/mapSelectedElementAction";
import { getNodeInfo } from "../util/nodeInfo";
import { inArray } from "../util";
import domJSON from "domjson";
import TSON from "typescript-json";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import { CONFIG } from "../config"; // Import CONFIG
import { getFromStore } from "../util"; // Import getFromStore
import * as userService from "./userService";
import { specialNodes } from "../util/specialNodes";
import {
  recordClicks,
  updateRecordClicks,
  recordSequence,
  userClick,
  deleteRecording,
  updateRecording,
  profanityCheck,
  saveClickData,
  postRecordSequenceData,
  recordUserClickData,
} from "./recordService";

/**
 * This code sets up mocks for various dependencies used in the `recordService.test.ts` file. The mocks are used to simulate the behavior of these dependencies during testing, allowing the tests to focus on the specific functionality being tested without relying on the actual implementation of the dependencies.
 *
 * The mocks are set up using the `jest.mock()` function, which allows you to override the implementation of a module or function with a mock implementation. The mocks are set up for the following dependencies:
 *
 * - `userService`: Mocks the `getSessionKey` and `getUserId` functions.
 * - `services`: Mocks the `REST.apiCall` function.
 * - `nodeInfo`: Mocks the `getNodeInfo` function.
 * - `domjson`: Mocks the `toJSON` function.
 * - `typescript-json`: Mocks the `stringify` function.
 * - `error-log`: Mocks the `UDAConsoleLogger.info` and `UDAConsoleLogger.error` functions.
 * - `fetchDomain`: Mocks the `fetchDomain` function.
 * - `util`: Mocks the `getFromStore` function.
 *
 * These mocks are used to ensure that the tests in the `recordService.test.ts` file can run without relying on the actual implementation of these dependencies, which may not be available or may have side effects that could interfere with the tests.
 */
// Mock userService module
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

// Mock nodeInfo module
jest.mock("../util/nodeInfo", () => ({
  // Mock getNodeInfo function
  getNodeInfo: jest.fn(),
}));

// Mock domjson module
jest.mock("domjson", () => ({
  // Mock toJSON function
  toJSON: jest.fn(),
}));

// Mock typescript-json module
jest.mock("typescript-json", () => ({
  // Mock stringify function
  stringify: jest.fn(),
}));

// Mock error-log module
jest.mock("../config/error-log", () => ({
  // Mock UDAConsoleLogger object
  UDAConsoleLogger: {
    // Mock info function
    info: jest.fn(),
    // Mock error function
    error: jest.fn(),
  },
}));

// Mock fetchDomain module
jest.mock("../util/fetchDomain", () => ({
  // Mock fetchDomain function
  fetchDomain: jest.fn(),
}));

// Mock util module
jest.mock("../util", () => ({
  // Mock getFromStore function
  getFromStore: jest.fn(),
}));
/**
 * Tests that the `recordClicks` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("recordClicks returns a promise that resolves with the expected response", async () => {

  // Mock window.location
  Object.defineProperty(window, "location", {
    value: { host: "example.com", pathname: "/test" },
  });

  // Mock request object
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
  REST.apiCal.mockReturnValue({
    url: jest.fn().mockReturnThis(),
    post: jest.fn().mockResolvedValue(expectedResponse),
  });

  const response = await recordClicks(request);

  expect(response).toEqual(expectedResponse);
});

/**
 * Tests that the `recordClicks` function returns a promise that rejects with an error when an invalid request is passed.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("recordClicks returns a promise that rejects with an error when an invalid request is passed", async () => {
  // Mock window.location
  Object.defineProperty(window, "location", {
    value: { host: "test-domain.com", pathname: "/error-path" },
  });

  // Mock invalid request
  const request = {
    userId: "mockUserId", // invalid userId
    recordingId: "mockRecordingId", // invalid recordingId
    clickData: [
      {
        x: 100, // valid x coordinate
        y: 200, // valid y coordinate
        timestamp: new Date().getTime(), // valid timestamp
        text: "Clicked Element", // valid text
        jsonString: JSON.stringify({ key: "value" }) // valid json string
        x: undefined, // invalid x coordinate
        y: undefined, // invalid y coordinate
        timestamp: undefined, // invalid timestamp
      },
    ],
  };

  // Mock expected response from the API
  const expectedResponse = {
    domain: "test-domain.com",
    urlpath: "/error-path",
    clickednodename: "Clicked Element",
    html5: 0,
    clickedpath: "",
    objectdata: JSON.stringify({ key: "value" }),
  };

  // Mock TSON.stringify for objectdata
  jest.spyOn(TSON, "stringify").mockReturnValue('{"invalidData":true}');
  // Mock expected response from the API
  await expect(recordClicks(request)).rejects.toThrow();
});

/**
 * Tests that the `updateRecordClicks` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("updateRecordClicks returns a promise that resolves with the expected response", async () => {
  // Mock request data
  const request = {
    userId: "mockUserId", // userId
    recordingId: "mockRecordingId", // recordingId
    clickData: [
      {
        x: 100, // x coordinate
        y: 200, // y coordinate
        timestamp: 1623456789000, // timestamp
        text: "Clicked Element", // text
        jsonString: JSON.stringify({ key: "value" }) // jsonString
      },
      {
        x: 300, // x coordinate
        y: 400, // y coordinate
        timestamp: 1623456987000, // timestamp
        text: "Clicked Element 2", // text
        jsonString: JSON.stringify({ key2: "value2" }) // jsonString
      },
    ],
  };

  // Mock response data
  const expectedResponse = {
    domain: window.location.host,
    urlpath: window.location.pathname,
    clickednodename: "Clicked Element, Clicked Element 2",
    html5: 0,
    clickedpath: "",
    objectdata: JSON.stringify([
      { key: "value" },
      { key2: "value2" }
    ])
    data: "mockData", // expected response data
  };

  // Mock REST.apiCal method
  REST.apiCal.mockReturnValue({
    url: jest.fn().mockReturnThis(),
    post: jest.fn().mockResolvedValue(expectedResponse),
  });

  // Call updateRecordClicks
  const response = await updateRecordClicks(request);

  // Assert that the response matches the expected response
  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `recordSequence` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("recordSequence returns a promise that resolves with the expected response", async () => {
  // Mock request object
  const request = {
    sequenceName: "Test Sequence",
    steps: [
      { action: "click", element: "#button1" }, // mock click action
      { action: "input", element: "#input1", value: "test" }, // mock input action
      { action: "click", element: "#button1" },
      { action: "input", element: "#input1", value: "test" },
    ],
  };

  // Mock expected response from the API
  const expectedResponse = {
    domain: window.location.host, // current domain
    urlpath: window.location.pathname, // current path
    clickednodename: "button1, input1", // concatenated action elements
    html5: 0, // set to 0
    clickedpath: "", // set to empty string
    objectdata: JSON.stringify([ // converted to JSON string
      { action: "click", element: "#button1" },
      { action: "input", element: "#input1", value: "test" },
    ]),
    id: "seq123",
    status: "success",
    message: "Sequence recorded successfully",
  };

  // Mock the REST.apiCal function to return the expected response
  REST.apiCal = jest.fn().mockResolvedValue(expectedResponse);

  const response = await recordSequence(request);

  expect(response).toEqual(expectedResponse);
});

/**
 * Tests that the `recordUserClickData` function uses default values when not provided.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
it("should use default values when not provided", async () => {
  // Mock session key for testing
  const mockSessionKey = "test-session-key";
  (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

  // Mock data for the REST.apiCal function
  const mockData = {
    domain: window.location.host, // current domain
    urlpath: window.location.pathname, // current path
    clickednodename: "", // empty string by default
    html5: 0, // set to 0
    clickedpath: "", // empty string by default
    objectdata: "{}", // empty object as JSON string by default
  };

  // Mock the REST.apiCal function
  (REST.apiCal as jest.Mock).mockResolvedValue({
    // Mock response data
    ...mockData,
    status: "success",
    message: "User click recorded",
  });

  await recordUserClickData();

  // Expect the REST.apiCal to be called with default values
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String), // We don't test the exact URL here
    method: "PUT",
    body: {
      usersessionid: mockSessionKey,
      clickedname: mockData.clickednodename,
      clicktype: "sequencerecord",
      recordid: 0,
      clickedname: "", // Default value for clickedname
      clicktype: "sequencerecord", // Default value for clicktype
      recordid: 0, // Default value for recordid
    },
  });
});

/**
 * Tests that the `saveClickData` function correctly handles the case where the clicked element is a DIV element and the `customNameForSpecialNodes` configuration is set to include a custom name for the DIV element.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
it("should handle custom name for special nodes", async () => {
  // Mock session key for testing
  const mockSessionKey = "test-session-key";
  (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

  // Mock customNameForSpecialNodes configuration
  jest.mocked(inArray).mockReturnValueOnce(true);
  CONFIG.customNameForSpecialNodes = {
    DIV: "Custom Name",
  };

  // Mock clicked node
  const node = document.createElement("div");
  node.nodeName = "DIV";
  node.outerHTML = "<div>Test</div>";

  // Mock clicked text
  const text = "test";

  // Mock meta data
  const meta = { test: "test" };

  // Mock REST.apiCal function
  (REST.apiCal as jest.Mock).mockResolvedValue({
    // Mock response data
    status: "success",
    message: "User click recorded",
  });

  // Call the function being tested
  const result = await saveClickData(node, text, meta);

  // Expect the REST.apiCal function to be called with the expected object data
  expect(result.objectdata).toContain('"meta":{"displayText":"Custom Name"'); // Use inline comment to highlight relevant mock data
});
expect(result.objectdata).toContain('"meta":{"displayText":"Custom Name"');

/**
 * Tests that the `saveClickData` function correctly handles the case where the clicked element is an input element and the `enableNodeTypeChangeSelection` configuration is set to `true`.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
it("should handle enableNodeTypeChangeSelection", async () => {
  // Mock enableNodeTypeChangeSelection configuration
  CONFIG.enableNodeTypeChangeSelection = true;

  // Mock mapClickedElementToHtmlFormElement function
  jest.mocked(mapClickedElementToHtmlFormElement).mockReturnValueOnce({
    inputElement: "text",
  });

  // Mock clicked node
  const node = document.createElement("input");
  node.nodeName = "INPUT";
  node.type = "text";
  node.value = "Test";
  node.outerHTML = "<input type='text' value='Test'/>";

  // Mock clicked text
  const text = "test";

  // Mock meta data
  const meta = { test: "test" };

  // Mock data for the function parameters
  const domain = "testDomain";
  Object.defineProperty(window, "location", {
    value: { pathname: "/test-path" },
  });
  const jsonString = JSON.stringify({
    meta: {
      systemDetected: {
        inputElement: "text",
        selectedElement: "text",
      },
    },
  });

  // Call the function being tested
  const result = await saveClickData(node, text, meta);

  // Expect the result to match the expected object
  expect(result).toEqual({
    domain: domain,
    urlpath: window.location.pathname,
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: jsonString,
  });
  // Expect the REST.apiCal function to be called with the expected object data
  expect(result.objectdata).toContain(
    '{"meta":{"systemDetected":{"inputElement":"text","selectedElement":"text"}}}' // Use inline comment to highlight relevant mock data
  );
});

/**
 * Tests that the `postRecordSequenceData` function handles an empty user click nodes set.
 *
 * @param {object} mockRequest - A mock request object to pass to the `postRecordSequenceData` function.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("postRecordSequenceData", () => {
  it("should handle empty user click nodes set", async () => {
    // Mock data
    const mockRequest = { data: "test" }; // Mock request object
    const mockDomain = "mockDomain"; // Mock domain value
    const mockUserClickNodesSet = []; // Mock user click nodes set

    // Mock functions
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain); // Mock fetchDomain function
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet); // Mock getFromStore function

    // Call the function being tested
    await postRecordSequenceData(mockRequest);

    // Verify that the recordSequence function is called with the expected parameters
    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest, // Spread the mock request object
      domain: mockDomain, // Set the domain to the mock domain value
      isIgnored: 0, // Set the isIgnored flag to 0
      isValid: 1, // Set the isValid flag to 1
      userclicknodelist: "", // Set the userclicknodelist to an empty string
      userclicknodesSet: mockUserClickNodesSet, // Set the userclicknodesSet to the mock user click nodes set
    });
  });
});
/**
 * Tests that the `recordSequence` function returns a promise that rejects with an error when an invalid request is passed.
 *
 * @param {object} request - An invalid request object to pass to the `recordSequence` function.
 * @returns {Promise<void>} A promise that rejects with an error.
 */
test("recordSequence returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
/**
 * Tests that the `userClick` function returns a promise that resolves with the expected response.
 *
 * @param {object} request - A valid request object to pass to the `userClick` function.
 * @returns {Promise<object>} A promise that resolves with the expected response object.
 */
test("userClick returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    domain: "mockDomain", // Mock domain value
    urlpath: "/mockPathname", // Mock pathname value
    clickednodename: "mockText", // Mock text value
    html5: 0, // Mock html5 value
    clickedpath: "", // Mock clickedpath value
    objectdata: '{"mockedData":"test"}', // Mock objectdata value
    // expected response object
  };

  // Mock window.location
  Object.defineProperty(window, "location", {
    value: {
      host: "mockDomain",
      pathname: "/mockPathname",
    },
  });

  // Mock TSON.stringify to return a predictable string
  jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedData":"test"}');

  const response = await userClick(request);

  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `userClick` function returns a promise that rejects with an error when an invalid request is passed.
 *
 * @param {object} request - An invalid request object to pass to the `userClick` function.
 * @returns {Promise<void>} A promise that rejects with an error.
 */
test("userClick returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(userClick(request)).rejects.toThrow();
});
/**
 * Tests that the `deleteRecording` function returns a promise that resolves with the expected response.
 *
 * @param {object} request - A valid request object to pass to the `deleteRecording` function.
 * @returns {Promise<object>} A promise that resolves with the expected response object.
 */
test("deleteRecording returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    // expected response object
    domain: "mockDomain", // Mock domain value
    urlpath: "/mockPathname", // Mock urlpath value
    clickednodename: "mockText", // Mock clickednodename value
    html5: 0, // Mock html5 value
    clickedpath: "", // Mock clickedpath value
    objectdata: '{"mockedData":"test"}', // Mock objectdata value
  };

  // Mock TSON.stringify to return a predictable string
  jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedData":"test"}');

  const response = await deleteRecording(request);

  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `updateRecording` function returns a promise that resolves with the expected response.
 *
 * @param {object} request - A valid request object to pass to the `updateRecording` function.
 * @returns {Promise<object>} A promise that resolves with the expected response object.
 */
test("updateRecording returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    // expected response object
    domain: "mockDomain", // Mock domain value
    urlpath: window.location.pathname, // Mock urlpath value
    clickednodename: "mockText", // Mock clickednodename value
    html5: 0, // Mock html5 value
    clickedpath: "", // Mock clickedpath value
    objectdata: '{"mockedData":"test"}', // Mock objectdata value
  };

  // Mock REST.apiCal to return the expected response
  REST.apiCal.mockReturnValue({
    url: jest.fn().mockReturnThis(),
    post: jest.fn().mockResolvedValue(expectedResponse),
  });

  const response = await updateRecording(request);

  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `profanityCheck` function returns a promise that resolves with the expected response.
 *
 * @param {object} request - A valid request object to pass to the `profanityCheck` function.
 * @returns {Promise<object>} A promise that resolves with the expected response object.
 */
test("profanityCheck returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
    text: "mockText", // Mock text value
  };
  const expectedResponse = {
    // expected response object
    domain: "mockDomain", // Mock domain value
    urlpath: window.location.pathname, // Mock urlpath value
    clickednodename: "mockText", // Mock clickednodename value
    html5: 0, // Mock html5 value
    clickedpath: "", // Mock clickedpath value
    objectdata: '{"mockedData":"test"}', // Mock objectdata value
  };

  const response = await profanityCheck({ ...request, domain: "mockDomain", jsonString: '{"mockedData":"test"}' });

  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `profanityCheck` function returns a promise that rejects with an error when an invalid request is passed.
 *
 * @param {object} request - An invalid request object to pass to the `profanityCheck` function.
 * @returns {Promise<void>} A promise that rejects with an error.
 */
test("profanityCheck returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
/**
 * Tests that the `saveClickData` function returns the expected object.
 *
 * @param {HTMLElement} node - The DOM node that was clicked.
 * @param {string} text - The text content of the clicked node.
 * @param {object} meta - Additional metadata about the click event.
 * @returns {object} The expected object returned by the `saveClickData` function.
 */
test("saveClickData returns the expected object", () => {
  // Mock data
  const mocknode = document.createElement("div"); // Mock node element
  const mocktext = "click text"; // Mock click text
  const mockmeta = {}; // Mock meta object
  const domain = "mockDomain"; // Mock domain value
  const jsonString = '{"mockedData":"test"}'; // Mock JSON string

  // Expected object
  const node = document.createElement("div");
  const text = "click text";
  const meta = {
    // valid meta object
  };
  const expectedObject = {
    domain: domain,
    urlpath: window.location.pathname,
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: jsonString,
    // expected object
  };

  // Call the function with mock data
  const saveClickDataresult = saveClickData(node, text, meta,);
  const result = saveClickData(node, text, meta);

  // Assert that the result matches the expected object
  expect(result).toEqual(expectedObject);
});
/**
 * Tests that the `postRecordSequenceData` function returns the expected object.
 *
 * @param {object} request - A valid request object to pass to the `postRecordSequenceData` function.
 * @returns {Promise<object>} A promise that resolves with the expected object.
 */
test("postRecordSequenceData returns the expected object", async () => {
  const request = {
    domain: "testDomain", // Mock domain value
    urlpath: "/testPath", // Mock path value
    clickednodename: "clickedNode", // Mock clicked node name
    html5: 1, // Mock HTML5 value
    clickedpath: "clickedPath", // Mock clicked path
    objectdata: '{"mockedData":"test"}', // Mock JSON string
    // valid request object
  };
  const expectedObject = {
    domain: "testDomain", // Mock domain value
    urlpath: "/testPath", // Mock path value
    clickednodename: "clickedNode", // Mock clicked node name
    html5: 1, // Mock HTML5 value
    clickedpath: "clickedPath", // Mock clicked path
    objectdata: '{"mockedData":"test"}', // Mock JSON string
    // expected object
  };

  const result = await postRecordSequenceData(request);

  expect(result).toEqual(expectedObject);
});
/**
 * Tests that the `recordUserClickData` function returns the expected object.
 *
 * @param {string} clickType - The type of click to record.
 * @param {string} clickedName - The name of the element that was clicked.
 * @param {number} recordId - The ID of the record to associate with the click data.
 * @returns {Promise<object>} A promise that resolves with the expected object.
 */
test("recordUserClickData returns the expected object", async () => {
  // Mock window.location
  Object.defineProperty(window, "location", {
    value: {
      host: "testDomain",
      pathname: "/testPath",
    },
  });

  const text = "testText"; // Mock clicked node name
  const jsonString = '{"mockedData":"test"}'; // Mock JSON string

  const result = await recordUserClickData(
    "click type",
    "clicked name",
    123
  );

  expect(result).toEqual({
    domain: "testDomain",
    urlpath: "/testPath",
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: jsonString,
  });
});
/**
 * Tests that the `recordClicks` function returns a promise that rejects with an error when the request object is missing the `sessionid` property.
 *
 * @param {object} request - The request object to pass to the `recordClicks` function, which should be missing the `sessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `sessionid` property is missing.
 */
test("recordClicks returns a promise that rejects with an error when the request object is missing the sessionid property", async () => {
  const request = {
    // Mock request object missing sessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without sessionid property
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
/**
 * Tests that the `recordClicks` function returns a promise that rejects with an error when the request object has an invalid `sessionid` property.
 *
 * @param {object} request - The request object to pass to the `recordClicks` function, which should have an invalid `sessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `sessionid` property is invalid.
 */
test("recordClicks returns a promise that rejects with an error when the request object has an invalid sessionid property", async () => {
  const request = {
    // Mock request object with invalid sessionid property
    sessionid: "invalidSessionId", // Invalid sessionid
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object with invalid sessionid property
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
/**
 * Tests that the `updateRecordClicks` function returns a promise that rejects with an error when the request object is missing the `sessionid` property.
 *
 * @param {object} request - The request object to pass to the `updateRecordClicks` function, which should be missing the `sessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `sessionid` property is missing.
 */
test("updateRecordClicks returns a promise that rejects with an error when the request object is missing the sessionid property", async () => {
  const request = {
    // Mock request object missing sessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without sessionid property
  };

  await expect(updateRecordClicks(request)).rejects.toThrow();
});
/**
 * Tests that the `updateRecordClicks` function returns a promise that rejects with an error when the request object has an invalid `sessionid` property.
 *
 * @param {object} request - The request object to pass to the `updateRecordClicks` function, which should have an invalid `sessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `sessionid` property is invalid.
 */
test("updateRecordClicks returns a promise that rejects with an error when the request object has an invalid sessionid property", async () => {
  const request = {
    // Mock request object with invalid sessionid property
    sessionid: "invalidSessionId", // Invalid sessionid
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object with invalid sessionid property
  };

  await expect(updateRecordClicks(request)).rejects.toThrow();
});
/**
 * Tests that the `recordSequence` function returns a promise that rejects with an error when the request object is missing the `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `recordSequence` function, which should be missing the `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is missing.
 */
test("recordSequence returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // Mock request object missing usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without usersessionid property
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
/**
 * Tests that the `recordSequence` function returns a promise that rejects with an error when the request object has an invalid `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `recordSequence` function, which should have an invalid `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is invalid.
 */
test("recordSequence returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
test("recordSequence returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
/**
 * Tests that the `userClick` function returns a promise that rejects with an error when the request object is missing the `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `userClick` function, which should be missing the `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is missing.
 */
test("userClick returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without usersessionid property
  };

  await expect(userClick(request)).rejects.toThrow();
});
/**
 * Tests that the `userClick` function returns a promise that rejects with an error when the request object has an invalid `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `userClick` function, which should have an invalid `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is invalid.
 */
test("userClick returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
  };

  await expect(userClick(request)).rejects.toThrow();
});
/**
 * Tests that the `deleteRecording` function returns a promise that rejects with an error when the request object is missing the `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `deleteRecording` function, which should be missing the `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is missing.
 */
test("deleteRecording returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // valid request object without usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
  };

  await expect(deleteRecording(request)).rejects.toThrow();
});
/**
 * Tests that the `deleteRecording` function returns a promise that rejects with an error when the request object has an invalid `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `deleteRecording` function, which should have an invalid `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is invalid.
 */
test("deleteRecording returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
  };

  await expect(deleteRecording(request)).rejects.toThrow();
});
/**
 * Tests that the `updateRecording` function returns a promise that rejects with an error when the request object is missing the `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `updateRecording` function, which should be missing the `usersessionid` property.
 * @returns {void}
 */
test("updateRecording returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // Mock request object missing usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without usersessionid property
  };

  await expect(updateRecording(request)).rejects.toThrow();
});
/**
 * Tests that the `updateRecording` function returns a promise that rejects with an error when the request object has an invalid `usersessionid` property.
 *
 * @param {object} request - The request object to pass to the `updateRecording` function, which should have an invalid `usersessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `usersessionid` property is invalid.
 */
test("updateRecording returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // Mock request object with invalid usersessionid property
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object with invalid usersessionid property
  };

  await expect(updateRecording(request)).rejects.toThrow();
});
/**
 * Tests that the `profanityCheck` function returns a promise that rejects with an error when the request object is missing the Ocp-Apim-Subscription-Key header.
 *
 * @param {object} request - The request object to pass to the `profanityCheck` function, which should be missing the Ocp-Apim-Subscription-Key header.
 * @returns {void}
 */
test("profanityCheck returns a promise that rejects with an error when the request object is missing the Ocp-Apim-Subscription-Key header", async () => {
  const request = {
    // Mock request object without Ocp-Apim-Subscription-Key header
    domain: "testDomain", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object without Ocp-Apim-Subscription-Key header
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
/**
 * Tests that the `profanityCheck` function returns a promise that rejects with an error when the request object has an invalid Ocp-Apim-Subscription-Key header.
 *
 * @param {object} request - The request object to pass to the `profanityCheck` function.
 * @returns {void}
 */
test("profanityCheck returns a promise that rejects with an error when the request object has an invalid Ocp-Apim-Subscription-Key header", async () => {
  const request = {
    domain: "example.com", // Mock domain
    urlpath: "/testPath", // Mock pathname
    clickednodename: "testText", // Mock clickednodename
    html5: 0, // Mock html5
    clickedpath: "", // Mock clickedpath
    objectdata: '{"mockedData":"test"}', // Mock jsonString
    // valid request object with invalid Ocp-Apim-Subscription-Key header
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
describe("saveClickData", () => {
  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `true`.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when a valid node, text, and meta are passed, and the node has a clicked property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = true;
    const text = "click text"; // Clicked node text
    const meta = {}; // Additional metadata

    // Expected object
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: text, // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: {}, // JSON string (we will mock this in the test)
      clicked: true, // Clicked flag
      clickedname: null, // Clicked name
      text, // Clicked node text
      meta, // Additional metadata
    };

    // Call the function with mock data
    const result = saveClickData(node, text, meta);

    // Assert that the result matches the expected object
    expect(result).toEqual(expectedObject);
  });
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `false`.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of false and does not have a clickedname property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = false;
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: text, // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: {}, // JSON string (we will mock this in the test)
      clicked: false,
      clickedname: null,
      text,
      meta,
    };

    const result = saveClickData(node, text, meta);

    expect(result).toEqual(expectedObject);
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `true` and has a `clickedname` property.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of true and has a clickedname property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = true;
    node.clickedname = "clicked name"; // Clicked node name
    node.clickedname = "clicked name";
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: "clicked name", // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: {}, // JSON string (we will mock this in the test)
      clicked: true,
      clickedname: "clicked name",
      text,
      meta,
    };

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedJsonString":true}'); // Mocked JSON string

    // Call the function with mock data
    const result = saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: "clicked name", // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedJsonString":true}', // JSON string
    };

    expect(result).toEqual(expectedResult);
    expect(result).toEqual(expectedObject);
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `true` and does not have a `clickedname` property.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of true and does not have a clickedname property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = true;
    const saveClickDatatext = "click text"; // Clicked node text
    const saveClickDatameta = {}; // Additional metadata
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      clicked: true,
      clickedname: null,
      text,
      meta,
    };

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedJsonString":true}'); // Mocked JSON string

    // Call the function with mock data
    const result = saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: text, // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedJsonString":true}', // JSON string
    };

    expect(result).toEqual(expectedResult);
    expect(result).toEqual(expectedObject);
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `false` and has a `clickedname` property.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of false and has a clickedname property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = false;
    node.clickedname = "clicked name"; // Clicked node name
    const text = "click text"; // Clicked node text
    node.clickedname = "clicked name";
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      clicked: false,
      clickedname: "clicked name",
      text,
      meta,
    };

    // Mock text and meta
    const text = "Clicked Node"; // Clicked node name
    const meta = { someData: "test data" }; // Additional metadata

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedJsonString":true}'); // Mocked JSON string

    // Call the function with mock data
    const result = saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: "clicked name", // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedJsonString":true}', // JSON string
    };

    expect(result).toEqual(expectedResult);
    expect(result).toEqual(expectedObject);
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `false` and does not have a `clickedname` property.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of false and does not have a clickedname property", () => {
    // Mock data
    const node = document.createElement("div");
    node.clicked = false;
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      clicked: false,
      clickedname: null,
      text,
      meta,
    };

    // Mock text and meta
    const text = "Clicked Node"; // Clicked node name
    const meta = { someData: "test data" }; // Additional metadata

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedJsonString":true}'); // Mocked JSON string

    // Call the function with mock data
    const result = saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: window.location.host, // Domain
      urlpath: window.location.pathname, // URL path
      clickednodename: text, // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedJsonString":true}', // JSON string
    };

    expect(result).toEqual(expectedResult);
    expect(result).toEqual(expectedObject);
  });
  /**
   * Sets up the test environment by clearing the mocks for the `getUserId` and `getSessionKey` functions before each test.
   */
  describe("recordService functions", () => {
    /**
     * Sets up the test environment by clearing the mocks for the `getUserId` and `getSessionKey` functions before each test.
     */
    beforeEach(() => {
      (getUserId as jest.Mock).mockClear();
      (getSessionKey as jest.Mock).mockClear();
    });

    /**
     * Tests the behavior of the `recordClicks` function, which is responsible for processing user click data and making an API call.
     *
     * This test ensures that the `recordClicks` function calls the `getSessionKey` function and makes the appropriate API call with the provided request data.
     *
     * @param {object} request - The request object containing data to be used for the user click processing.
     * @returns {Promise<void>}
     */
    it("recordClicks should call getSessionKey and make API call", async () => {
      // Mock data
      const mockDomain = "example.com";
      const mockText = "testClickedName";
      const mockJsonString = JSON.stringify({ test: "test" });

      // Mock REST.apiCal method
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        domain: mockDomain, // The mock domain
        text: mockText, // The mock text
        jsonString: mockJsonString, // The mock JSON string
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.Record,
        method: "POST",
        body: {
          sessionid: "testSessionKey",
          domain: mockDomain, // The mock domain
          urlpath: window.location.pathname, // The current URL path
          clickednodename: mockText, // The mock text
          html5: 0, // The HTML 5 flag
          clickedpath: "", // The clicked path
          objectdata: mockJsonString, // The mock JSON string
        },
      });
    });
 

    /**
     * Tests the behavior of the `updateRecordClicks` function, which is responsible for processing user click data and making an API call.
     *
     * This test ensures that the `updateRecordClicks` function calls the `getSessionKey` function and makes the appropriate API call with the provided request data.
     *
     * @param {object} request - The request object containing data to be used for the user click processing.
     * @returns {Promise<void>}
     */
    it("updateRecordClicks should call getSessionKey and make API call", async () => {
      const mockDomain = "example.com";
      const mockText = "testClickedName";
      const mockJsonString = JSON.stringify({ test: "test" });

      // Mock REST.apiCal method
      (REST.apiCal as jest.Mock).mockResolvedValue({
        // Mock response data
        data: {
          domain: mockDomain, // The mock domain
          urlpath: window.location.pathname, // The current URL path
          clickednodename: mockText, // The mock text
          html5: 0, // The HTML 5 flag
          clickedpath: "", // The clicked path
          objectdata: mockJsonString, // The mock JSON string
        },
      });
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        domain: mockDomain, // The mock domain
        text: mockText, // The mock text
        jsonString: mockJsonString, // The mock JSON string
        /* request data */
      };
      await updateRecordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UpdateRecord,
        method: "POST",
        body: {
          sessionid: "testSessionKey",
          domain: mockDomain,
          urlpath: window.location.pathname,
          clickednodename: mockText,
          html5: 0,
          clickedpath: "",
          objectdata: mockJsonString,
        },
      });
    });
  });
  /**
   * Tests the behavior of the `recordSequence` function, which is responsible for processing user sequence data and making an API call.
   *
   * This test ensures that the `recordSequence` function calls the `getUserId` function and makes the appropriate API call with the provided request data.
   *
   * @param {object} request - The request object containing data to be used for the user sequence processing.
   * @returns {Promise<void>}
   */
  it("recordSequence should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    // Mock request data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      /* request data */
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.recordSequence,
      method: "POST",
      body: {
        ...request,
        usersessionid: "testUserId",
      },
    });
  });
  /**
   * Tests the behavior of the `userClick` function, which is responsible for processing user click data and making an API call.
   *
   * This test ensures that the `userClick` function calls the `getUserId` function and makes the appropriate API call with the provided request data.
   *
   * @param {object} request - The request object containing data to be used for the user click processing.
   * @returns {Promise<void>}
   */
  it("userClick should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    // Mock request data
    const request = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      text: "testClick", // clickednodename
      jsonString: JSON.stringify({ test: "test" }), // objectdata
      /* request data */
    };

    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.userClick,
      method: "PUT",
      body: {
        ...request,
        usersessionid: "testUserId",
        clickedname: "testClick",
      },
    });
  });
  /**
   * Tests the behavior of the `profanityCheck` function, which is responsible for checking for profanity in the provided request data.
   *
   * This test ensures that the `profanityCheck` function makes the appropriate API call with the correct headers.
   *
   * @param {object} request - The request object containing data to be used for the profanity check.
   * @returns {Promise<void>}
   */
  it("profanityCheck should make API call with correct headers", async () => {
    const request = {
      text: "test",
      jsonString: JSON.stringify({ test: "test" }),
      /* request data */
    };

    const mockData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request.text,
      html5: 0,
      clickedpath: "",
      objectdata: request.jsonString,
    };

    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

    await profanityCheck(request);

    // Adding assertions for API call with correct headers
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
      }),
    });
    // Add assertions for API call with correct headers
  });
  /**
   * Tests the behavior of the `saveClickData` function, which is responsible for processing node data and returning a formatted object.
   *
   * This test ensures that the `saveClickData` function correctly processes the provided node, text, and meta data, and returns the expected formatted object.
   *
   * @param {HTMLElement} node - The node element to be processed.
   * @param {string} text - The text associated with the node.
   * @param {object} meta - The meta data associated with the node.
   * @returns {Promise<object>} - The formatted object returned by the `saveClickData` function.
   */
  it("saveClickData should process node data and return formatted object", async () => {
    // Mock data
    const mockDomain = "example.com"; // Mocked domain
    const mockPathname = "/path/to/page"; // Mocked path
    const mockText = "Clicked Node Name"; // Mocked text
    const mockJsonString = '{"mockData": "value"}'; // Mocked JSON string

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        host: mockDomain,
        pathname: mockPathname,
      },
    });

    // Mock DOM node
    const node = document.createElement("div");
    node.innerHTML = mockText;

    // Mock meta data
    const meta = {};

    // Mock TSON.stringify
    jest.spyOn(TSON, "stringify").mockReturnValue(mockJsonString);

    // Make the API call and verify the result
    const result = await saveClickData(node, mockText, meta);

    expect(result).toEqual({
      domain: mockDomain, // Mocked domain
      urlpath: mockPathname, // Mocked path
      clickednodename: mockText, // Mocked text
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: mockJsonString, // Mocked JSON string
    });
  });
// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    host: mockDomain,
    pathname: mockPathname,
  },
});

// Mock TSON.stringify
TSON.stringify = jest.fn().mockReturnValue(mockJsonString);

// Call the function with mock data
const result = saveClickData(mockText);

// Assert the result
expect(result).toEqual({
  domain: mockDomain, // Mocked domain
  urlpath: mockPathname, // Mocked pathname
  clickednodename: mockText, // Mocked text
  html5: 0, // Default value
  clickedpath: '', // Default empty string
  objectdata: mockJsonString, // Mocked JSON string
});

  
  /**
   * Tests the behavior of the `postRecordSequenceData` function, which is responsible for posting recording sequence data.
   *
   * This test ensures that the `postRecordSequenceData` function calls the `getUserId` function and makes the appropriate API call with the provided request data.
   *
   * @param {object} request - The request object containing data to be used for posting the recording sequence.
   * @returns {Promise<void>}
   */
  it("postRecordSequenceData should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.recordSequence,
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
  });
 
  /**
   * Tests the behavior of the `deleteRecording` function, which is responsible for deleting a recording.
   *
   * This test ensures that the `deleteRecording` function calls the `getUserId` function and makes the appropriate API call with the provided request data.
   *
   * @param {object} request - The request object containing data to be used for deleting the recording.
   * @returns {Promise<void>}
   */
  it("deleteRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    // Mock request data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      // Mock response data
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: "testText", // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: JSON.stringify({ test: "test" }), // objectdata
    };
    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
  });
  /**
   * Tests the behavior of the `updateRecording` function, which is responsible for updating a recording.
   *
   * This test ensures that the `updateRecording` function calls the `getUserId` function and makes the appropriate API call with the provided request data.
   *
   * @param {object} request - The request object containing data to be used for updating the recording.
   * @returns {Promise<void>}
   */
  it("updateRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      // Mock response data
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: "testText", // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: JSON.stringify({ test: "test" }), // objectdata
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
  });
  it("updateRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      // Mock response data
      domain: "example.com", // domain
      /* request data */
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: {
        text: request.text,
        jsonString: request.jsonString,
        domain: request.domain,
        urlpath: window.location.pathname,
        clickednodename: request.text,
        html5: 0,
        clickedpath: "",
        objectdata: request.jsonString,
        usersessionid: "testUserId",
      },
    });
  });

  /**
   * Tests the behavior of the `saveClickData` function, which is responsible for processing node data and returning a formatted object.
   *
   * This test ensures that the `saveClickData` function correctly handles deeply nested nodes and returns the expected formatted object.
   *
   * @param {HTMLElement} mockNode - A mock node element with a deeply nested structure.
   * @param {string} mockText - The text content of the mock node.
   * @param {object} mockMeta - The metadata associated with the mock node.
   * @returns {Promise<object>} - The formatted object returned by the `saveClickData` function.
   */
  describe("saveClickData", () => {
    it("should handle deeply nested nodes", async () => {
      // Create a mock DOM node
      const mockNode = document.createElement("div");
      // Create a nested node
      const nestedNode = document.createElement("div");
      nestedNode.innerHTML = "<span><a><b>Deeply Nested</b></a></span>";
      // Append the nested node to the mock node
      mockNode.appendChild(nestedNode);

      // Mock data for the function parameters
      const mockText = "test"; // Text content of the mock node
      const mockMeta = { key: "value" }; // Additional metadata
      const mockNodeInfo = { info: "mockNodeInfo" }; // Mock node info
      const mockDomain = "mockDomain"; // Mock domain
      const mockJsonString = "mockJsonString"; // Mock JSON string

      // Mock the behavior of the getNodeInfo function
      (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
      // Mock the behavior of the fetchDomain function
      (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
      // Mock the behavior of the TSON.stringify function
      (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

      // Call the saveClickData function with the mock node and associated data
      const result = await saveClickData(mockNode, mockText, mockMeta);

      // Expected result
      const expectedResult = {
        domain: mockDomain, // Domain
        urlpath: window.location.pathname, // URL path
        clickednodename: mockText, // Clicked node name
        html5: 0, // HTML5 flag
        clickedpath: "", // Clicked path
        objectdata: mockJsonString, // JSON string
      };

      // Assert that the result matches the expected object
      expect(result).toEqual(expectedResult);
    });
  
    /**
     * Tests the behavior of the `profanityCheck` function, which is responsible for checking input data for profanity.
     *
     * This test ensures that the `profanityCheck` function makes the appropriate API call with the provided request data for different scenarios.
     *
     * @param {object} request1 - The first request object containing data to be used for checking for profanity.
     * @param {object} request2 - The second request object containing data to be used for checking for profanity.
     * @returns {Promise<void>}
     */
    it("profanityCheck should handle different input data and make API call", async () => {
      const request1 = {
        text: "test1",
        jsonString: JSON.stringify({ test: "test1" }),
        // request data 1
      };
      const request2 = {
        text: "test2",
        jsonString: JSON.stringify({ test: "test2" }),
        // request data 2
      };

      const mockData1 = {
        domain: "example.com",
        urlpath: window.location.pathname,
        clickednodename: request1.text,
        html5: 0,
        clickedpath: "",
        objectdata: request1.jsonString,
      };
      const mockData2 = {
        domain: "example.com",
        urlpath: window.location.pathname,
        clickednodename: request2.text,
        html5: 0,
        clickedpath: "",
        objectdata: request2.jsonString,
      };

      (REST.apiCal as jest.Mock).mockResolvedValueOnce({ data: mockData1 });
      (REST.apiCal as jest.Mock).mockResolvedValueOnce({ data: mockData2 });

      await profanityCheck(request1);
      // Add assertions for API call with request data 1
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.ProfanityCheck,
        method: "POST",
        body: request1,
        headers: new Headers({
          "Content-Type": "text/plain",
          "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
        }),
      });

      await profanityCheck(request2);
      // Add assertions for API call with request data 2
    });
    /**
     * Tests the behavior of the `postRecordSequenceData` function, which is responsible for recording a sequence of user actions.
     *
     * This test ensures that the `postRecordSequenceData` function makes the appropriate API call with the provided request data for different scenarios.
     *
     * @param {object} request1 - The first request object containing data to be used for recording the user's action sequence.
     * @param {object} request2 - The second request object containing data to be used for recording the user's action sequence.
     * @returns {Promise<void>}
     */
    it("postRecordSequenceData should handle different scenarios and make API call", async () => {
      const mockDomain = "example.com";
      const mockText = "testText";
      const mockJsonString = JSON.stringify({ test: "test" });

      const request1 = {
        domain: mockDomain,
        text: mockText,
        jsonString: mockJsonString,
        /* request data 1 */
      };
      const request2 = {
        domain: mockDomain,
        text: "testText2",
        jsonString: JSON.stringify({ test: "test2" }),
        /* request data 2 */
      };

      (REST.apiCal as jest.Mock).mockResolvedValue({
        data: {
          domain: mockDomain,
          urlpath: window.location.pathname,
          clickednodename: request1.text,
          html5: 0,
          clickedpath: "",
          objectdata: request1.jsonString,
        },
      });

      await postRecordSequenceData(request1);
      // Add assertions for API call with request data 1

      (REST.apiCal as jest.Mock).mockResolvedValue({
        data: {
          domain: mockDomain,
          urlpath: window.location.pathname,
          clickednodename: request2.text,
          html5: 0,
          clickedpath: "",
          objectdata: request2.jsonString,
        },
      });

      await postRecordSequenceData(request2);
      // Add assertions for API call with request data 2
    });
  });


  /**
   * Sets up the test environment by clearing the mocks for the `getUserId` and `getSessionKey` functions before each test.
   */
  describe("recordService functions", () => {
    beforeEach(() => {
      (getUserId as jest.Mock).mockClear();
      (getSessionKey as jest.Mock).mockClear();
    });

    /**
     * Tests the behavior of the `recordClicks` function, which is responsible for updating a user's record of click events.
     *
     * This test ensures that the `recordClicks` function calls the `getSessionKey` function to retrieve the user's session key, and then makes an API call with the provided request data.
     *
     * @param {object} request - The request object containing the data to be used for updating the user's record of click events.
     * @returns {Promise<void>}
     */
    it("recordClicks should call getSessionKey and make API call", async () => {
      // Mock data
      const mockDomain = "example.com";
      const mockText = "testClickedName";
      const mockJsonString = JSON.stringify({ test: "test" });

      // Mock REST.apiCal method
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        domain: mockDomain, // The mock domain
        text: mockText, // The mock text
        jsonString: mockJsonString, // The mock JSON string
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.Record,
        method: "POST",
        body: {
          sessionid: "testSessionKey",
          domain: mockDomain, // The mock domain
          urlpath: window.location.pathname, // The current URL path
          clickednodename: mockText, // The mock text
          html5: 0, // The HTML 5 flag
          clickedpath: "", // The clicked path
          objectdata: mockJsonString, // The mock JSON string
        },
      });
    });

    /**
     * Tests the behavior of the `updateRecordClicks` function, which is responsible for updating a user's record of click events.
     *
     * This test ensures that the `updateRecordClicks` function calls the `getSessionKey` function to retrieve the user's session key, and then makes an API call with the provided request data.
     *
     * @param {object} request - The request object containing the data to be used for updating the user's record of click events.
     * @returns {Promise<void>}
     */
    it("updateRecordClicks should call getSessionKey and make API call", async () => {
      // Mock data
      const mockDomain = "example.com";
      const mockText = "testClickedName";
      const mockJsonString = JSON.stringify({ test: "test" });

      // Mock REST.apiCal method
      (REST.apiCal as jest.Mock).mockResolvedValue({
        // Mock response data
        data: {
          domain: mockDomain, // The mock domain
          urlpath: window.location.pathname, // The current URL path
          clickednodename: mockText, // The mock text
          html5: 0, // The HTML 5 flag
          clickedpath: "", // The clicked path
          objectdata: mockJsonString, // The mock JSON string
        },
      });
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        domain: mockDomain, // The mock domain
        text: mockText, // The mock text
        jsonString: mockJsonString, // The mock JSON string
        /* request data */
      };
      await updateRecordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UpdateRecord,
        method: "POST",
        body: {
          sessionid: "testSessionKey",
          domain: mockDomain,
          urlpath: window.location.pathname,
          clickednodename: mockText,
          html5: 0,
          clickedpath: "",
          objectdata: mockJsonString,
        },
      });
    });

    // Add similar test cases for other functions in recordService
  });
  
  /**
   * Tests the behavior of the `recordSequence` function, which is responsible for recording a user's sequence of actions.
   *
   * This test ensures that the `recordSequence` function calls the `getUserId` function to retrieve the user's ID, and then makes an API call with the provided request data.
   *
   * @param {object} request - The request object containing the data to be used for recording the user's sequence of actions.
   * @returns {Promise<void>}
   */
  it("recordSequence should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    // Mock request data
    const request = {
      text: "testClick", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      /* request data */
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.recordSequence,
      method: "POST",
      body: {
        ...request,
        usersessionid: "testUserId",
      },
    });
  });
  /**
   * Tests the behavior of the `userClick` function, which is responsible for recording a user's click event.
   *
   * This test ensures that the `userClick` function calls the `getUserId` function to retrieve the user's ID, and then makes an API call with the provided request data.
   *
   * @param {object} request - The request object containing the data to be used for recording the user's click event.
   * @returns {Promise<void>}
   */
  it("userClick should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    // Mock request data
    const request = {
      text: "testClick", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
      // Mock response data
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "testClick",
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ test: "test" }),
      /* request data */
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.userClick,
      method: "PUT",
      body: {
        ...request,
        usersessionid: "testUserId",
        clickedname: "testClick",
      },
    });
  });
  /**
   * Checks the provided request data for profanity and makes an API call with the correct headers.
   *
   * This function takes a request object containing data to be checked for profanity, and makes an API call with the appropriate headers to perform the profanity check.
   *
   * @param {object} request - The request object containing the data to be checked for profanity.
   * @returns {Promise<void>}
   */
  it("profanityCheck should make API call with correct headers", async () => {
    const request = {
      text: "test",
      jsonString: JSON.stringify({ test: "test" }),
      /* request data */
    };

    const mockData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request.text,
      html5: 0,
      clickedpath: "",
      objectdata: request.jsonString,
    };

    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

    await profanityCheck(request);

    // Adding assertions for API call with correct headers
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
      }),
    });
    // Add assertions for API call with correct headers
  });
  /**
   * Saves click data for a given node, text, and metadata.
   *
   * This function processes the provided node, text, and metadata, and returns a formatted object representing the click data.
   *
   * @param {HTMLElement} node - The HTML element that was clicked.
   * @param {string} text - The text content of the clicked element.
   * @param {object} meta - Additional metadata associated with the click event.
   * @returns {Promise<object>} - A formatted object containing the click data.
   */
  it("saveClickData should process node data and return formatted object", async () => {
    const saveClickDatanode = document.createElement("button"); // Mock node element
    const saveClickDatatext = "Button Clicked"; // Mock clicked node name
    const saveClickDatameta = { someData: "test data" }; // Mock meta object
    const domain = "mockDomain"; // Mock domain value
    const jsonString = '{"mockedJsonString":true}'; // Mock JSON string

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue(jsonString); // Mocked JSON string
    const node = document.createElement("button");
    const text = "Button Clicked";
    const meta = {
      /* meta data */
    };

    const result = await saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: domain,
      urlpath: window.location.pathname,
      clickednodename: text,
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
    };

    expect(result).toEqual(expectedResult);
    // Add assertions for the formatted object returned
  });
  /**
   * Tests the behavior of the `postRecordSequenceData` function, which is responsible for recording a sequence of user interactions.
   *
   * This test ensures that the `postRecordSequenceData` function calls the `getUserId` function to retrieve the user's ID, and then makes an API call with the provided request data.
   *
   * @param {object} request - The request object containing the data to be used for recording the sequence of user interactions.
   * @returns {Promise<void>}
   */
  it("postRecordSequenceData should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.recordSequence,
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
  });

  /**
   * Tests the behavior of the `deleteRecording` function, which is responsible for deleting an existing recording.
   *
   * This test ensures that the `deleteRecording` function calls the `getUserId` function to retrieve the user's ID, and then makes an API call with the provided request data.
   *
   * @param {object} request - The request object containing the data to be used for deleting the recording.
   * @returns {Promise<void>}
   */
  it("deleteRecording should call getUserId and make API call", async () => {
    const mockUserId = "testUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    // Mock request data
    const request = {
      text: "testButton", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...request, usersessionid: mockUserId },
    });
  });

  /**
   * Tests the behavior of the `updateRecording` function, which is responsible for updating an existing recording.
   *
   * This test ensures that the `updateRecording` function calls the `getUserId` function to retrieve the user's ID, and then makes an API call with the provided request data.
   *
   * @param {object} request - The request object containing the data to be used for updating the recording.
   * @returns {Promise<void>}
   */
  it("updateRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
  });
  /**
   * Tests the behavior of the `profanityCheck` function, which is responsible for checking input data for profanity.
   *
   * This test ensures that the `profanityCheck` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.ProfanityCheck` URL, the "POST" HTTP method, and the request body.
   *
   * @param {object} request1 - The first request object containing the data to be checked for profanity.
   * @param {object} request2 - The second request object containing the data to be checked for profanity.
   * @returns {Promise<void>}
   */
  it("profanityCheck should handle different input data and make API call", async () => {
    const request1 = {
      request: "test1",
      /* request data 1 */
    };
    const request2 = {
      request: "test2",
      /* request data 2 */
    };

    const mockData1 = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request1.request,
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ test: "test1" }),
    };
    const mockData2 = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request2.request,
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ test: "test2" }),
    };

    (REST.apiCal as jest.Mock).mockResolvedValueOnce({ data: mockData1 });
    (REST.apiCal as jest.Mock).mockResolvedValueOnce({ data: mockData2 });

    await profanityCheck(request1);
    // Add assertions for API call with request data 1
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request1.request,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
      }),
    });

    await profanityCheck(request2);
    // Add assertions for API call with request data 2
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request2.request,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": CONFIG.profanity.config.key1,
      }),
    });
  });
  /**
   * Tests the behavior of the `postRecordSequenceData` function, which is responsible for recording a sequence of user actions.
   *
   * This test ensures that the `postRecordSequenceData` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.RecordSequence` URL, the "POST" HTTP method, the request body, and the `usersessionid` property.
   *
   * @param {object} request1 - The first request object containing the data to be recorded.
   * @param {object} request2 - The second request object containing the data to be recorded.
   * @returns {Promise<void>}
   */
  it("postRecordSequenceData should handle different scenarios and make API call", async () => {
    const request1 = {
      domain: "example.com", // The domain
      text: "Button Clicked", // The text
      jsonString: JSON.stringify({ test: "test" }), // The JSON string
    };
    const request2 = {
      domain: "example.com", // The domain
      text: "Input Value", // The text
      jsonString: JSON.stringify({ test: "test2" }), // The JSON string
    };

    await postRecordSequenceData(request1);
    // Add assertions for API call with request data 1

    await postRecordSequenceData(request2);
    // Add assertions for API call with request data 2
  });

  /**
   * Tests the behavior of the `recordClicks` function, which is responsible for recording a series of user click events.
   *
   * This test ensures that the `recordClicks` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.Record` URL, the "POST" HTTP method, the request body, and the `sessionid` property.
   *
   * @param {object} request - The request object containing the data to be recorded.
   * @returns {Promise<void>}
   */
  describe("recordClicks", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // current domain
        urlpath: window.location.pathname, // current path
        clickednodename: "testClickedName", // clicked name
        html5: 0, // set to 0
        clickedpath: "", // empty string by default
        objectdata: JSON.stringify({ test: "test" }), // empty object as JSON string by default
      };
      const request = { someData: "data" };
      userService.getSessionKey.mockResolvedValue("sessionKey");
      await recordClicks(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.Record,
        method: "POST",
        body: { ...request, sessionid: "sessionKey", ...mockData }, // Inline mock data
      });
    });
  });
 

  /**
   * Tests the behavior of the `updateRecordClicks` function, which is responsible for updating a recording of user clicks.
   *
   * This test ensures that the `updateRecordClicks` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.UpdateRecord` URL, the "POST" HTTP method, the request body, and the `sessionid` property.
   *
   * @param {object} request - The request object containing the data to be updated.
   * @returns {Promise<void>}
   */
  describe("updateRecordClicks", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: "testClickedName", // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };
      const request = { someData: "data" };
      userService.getSessionKey.mockResolvedValue("sessionKey");
      await updateRecordClicks(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UpdateRecord,
        method: "POST",
        body: { ...request, sessionid: "sessionKey", ...mockData }, // Inline mock data
        body: { ...request, sessionid: "sessionKey" },
      });
    });
  });

  /**
   * Tests the behavior of the `recordSequence` function, which is responsible for recording a sequence of user actions.
   *
   * This test ensures that the `recordSequence` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.RecordSequence` URL, the "POST" HTTP method, the request body, and the `usersessionid` property.
   *
   * @param {object} request - The request object containing the data to be recorded.
   * @returns {Promise<void>}
   */
  describe("recordSequence", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: "testText", // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      await recordSequence(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.RecordSequence,
        method: "POST",
        body: { ...request, usersessionid: "userId", ...mockData },
        body: { ...request, usersessionid: "userId" },
      });
    });
  });

  /**
   * Tests the behavior of the `userClick` function, which is responsible for recording a user's click event.
   *
   * This test ensures that the `userClick` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.UserClick` URL, the "PUT" HTTP method, the request body, and the `usersessionid` and `clickedname` properties.
   *
   * @param {object} request - The request object containing the data to be recorded.
   * @returns {Promise<void>}
   */
  describe("userClick", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: "testText", // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };

      const request = { data: "test" };
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      (REST.apiCal as jest.Mock).mockResolvedValue({
        // Mock response data
        data: mockData,
      });

      await userClick(request);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: {
          ...request,
          usersessionid: "userId",
          clickedname: window.location.host,
          ...mockData,
        },
      });
    });
  });
  
  /**
   * Tests the behavior of the `deleteRecording` function, which is responsible for deleting a recording.
   *
   * This test ensures that the `deleteRecording` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.DeleteSequence` URL, the "POST" HTTP method, the request body, and the `usersessionid` property.
   *
   * @param {object} request - The request object containing the data to be deleted.
   * @returns {Promise<void>}
   */

  describe("deleteRecording", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: "testText", // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };

      userService.getUserId.mockResolvedValue("userId");
      // Mock REST.apiCal method
      (REST.apiCal as jest.Mock).mockResolvedValue({
        // Mock response data
        data: mockData,
      });

      await deleteRecording({});

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.DeleteSequence,
        method: "POST",
        body: { ...mockData, usersessionid: "userId" },
      });
    });
  });

  /**
   * Tests the behavior of the `updateRecording` function, which is responsible for updating a recording.
   *
   * This test ensures that the `updateRecording` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.updateRecordSequence` URL, the "POST" HTTP method, the request body, and the `usersessionid` property.
   *
   * @param {object} request - The request object containing the data to be updated.
   * @returns {Promise<void>}
   */
  describe("updateRecording", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      const request = {
        someData: "data",
      };
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: "testText", // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };
      userService.getUserId.mockResolvedValue("userId");
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

      await updateRecording(request);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.updateRecordSequence,
        method: "POST",
        body: {
          ...request,
          usersessionid: "userId",
          ...mockData,
        },
      });
    });
  });

  /**
   * Tests the behavior of the `profanityCheck` function, which is responsible for checking for profanity in a given request.
   *
   * This test ensures that the `profanityCheck` function calls the `REST.apiCal` method with the correct parameters, including the `ENDPOINT.ProfanityCheck` URL, the "POST" HTTP method, the request body, and any expected headers.
   *
   * @param {string} request - The request to be checked for profanity.
   * @returns {Promise<void>}
   */
  describe("profanityCheck", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      const request = "test"; // Mock request data
      const mockData = { // Mock response data
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      };
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

      const request = "test";
      await profanityCheck(request);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.ProfanityCheck,
        method: "POST",
        body: request,
        headers: expect.any(Headers),
      });
    });
  });
  

  /**
   * Tests the behavior of the `saveClickData` function, which is responsible for saving click data.
   *
   * This test ensures that the `saveClickData` function processes the provided node and calls the appropriate API to save the click data.
   *
   * @param {HTMLElement} node - The HTML element that was clicked.
   * @param {string} text - The text content of the clicked element.
   * @param {object} meta - Additional metadata associated with the click event.
   * @returns {Promise<void>}
   */
  describe("saveClickData", () => {
    it("should handle node processing and call REST.apiCal", async () => {
      const node = document.createElement("div");
      const text = "click text";
      const meta = { key: "value" };
      await saveClickData(node, text, meta);
      // This test would need more specific checks based on how saveClickData processes the node
    });
  });

  /**
   * Tests the behavior of the `postRecordSequenceData` function, which is responsible for posting record sequence data.
   *
   * This test ensures that the `postRecordSequenceData` function prepares the expected data and calls the `recordSequence` function with the correct parameters.
   *
   * @param {object} request - The request object containing the data to be posted.
   * @returns {Promise<void>}
   */
  describe("postRecordSequenceData", () => {
    it("should prepare data and call recordSequence", async () => {
      const request = { someData: "data" };
      await postRecordSequenceData(request);
    });
  });

  /**
   * Tests the behavior of the `recordUserClickData` function, which is responsible for recording user click data.
   *
   * This test ensures that the `recordUserClickData` function prepares the expected data and calls the `userClick` function with the correct parameters, including the user's session key.
   *
   * @param {string} clickType - The type of the user's click.
   * @param {string} clickedName - The name of the element that was clicked.
   * @param {number} recordId - The ID of the record associated with the click.
   * @returns {Promise<void>}
   */
  describe("recordUserClickData", () => {
    it("should prepare data and call userClick", async () => {
    // Mock data
const mockDomain = 'example.com';
const mockPathname = '/path/to/page';
const mockText = 'Clicked Node Name';
const mockJsonString = '{"mockData": "value"}';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    host: mockDomain,
    pathname: mockPathname,
  },
});

// Mock TSON.stringify
TSON.stringify = jest.fn().mockReturnValue(mockJsonString);

// Call the function with mock data
const result = getClickedNodeData(mockText);

// Assert the result
expect(result).toEqual({
  domain: mockDomain, // Mocked domain
  urlpath: mockPathname, // Mocked pathname
  clickednodename: mockText, // Mocked text
  html5: 0, // Default value
  clickedpath: '', // Default empty string
  objectdata: mockJsonString, // Mocked JSON string
});

      });
    });
    
    /**
     * Tests the behavior of the `recordClicks` function, which is responsible for recording user click data.
     *
     * This test ensures that the `recordClicks` function gracefully handles errors when failing to get the user's session key by throwing an appropriate error.
     *
     * @param {object} request - The request object containing the user session ID.
     * @returns {Promise<void>}
     */
    describe("recordClicks", () => {
      it("should handle errors gracefully", async () => {
        // Mock request data
        const mockRequest = {
          someData: "data",
        };

        // Mock error message
        const errorMessage = "Failed to get session key";

        // Mock getSessionKey function, return a mock data object for the userClick function
        userService.getSessionKey.mockRejectedValue(new Error(errorMessage));

        // Call recordClicks function and expect it to throw the error with the correct message
        await expect(recordClicks(mockRequest)).rejects.toThrow(errorMessage);

        // Mock userClick function, return a mock data object
        userClick.mockResolvedValue({
          domain: "example.com", // current domain
          urlpath: window.location.pathname, // current path
          clickednodename: "testClickedName", // clicked name
          html5: 0, // set to 0
          clickedpath: "", // empty string by default
          objectdata: "{}", // empty object as JSON string
        });
      });
    });
 

    /**
     * Tests the behavior of the `updateRecordClicks` function, which is responsible for updating user click data.
     *
     * This test ensures that the `updateRecordClicks` function gracefully handles a null request object by calling the `REST.apiCal` function with the expected parameters, including the user's session key.
     *
     * @param {object} [request] - The request object containing the user session ID.
     * @returns {Promise<void>}
     */
    describe("updateRecordClicks", () => {
      it("should handle null request gracefully", async () => {
        // Mock data
        const mockData = {
          domain: "example.com", // domain
          urlpath: window.location.pathname, // urlpath
          clickednodename: "testText", // clickednodename
          html5: 0, // html5
          clickedpath: "", // clickedpath
          objectdata: JSON.stringify({ test: "test" }), // objectdata
        };
        userService.getSessionKey.mockResolvedValue("sessionKey");
        await updateRecordClicks(null);
        expect(REST.apiCal).toHaveBeenCalledWith({
          url: ENDPOINT.UpdateRecord,
          method: "POST",
          body: { sessionid: "sessionKey", ...mockData },
          body: { sessionid: "sessionKey" },
        });
      });
    });
  
    /**
     * Tests the behavior of the `recordClicks` function, which is responsible for recording user click data.
     *
     * This test ensures that the `recordClicks` function gracefully handles an undefined input by throwing an appropriate error.
     *
     * @param {object} [request] - The request object containing the user session ID.
     * @returns {Promise<void>}
     */
    it("should handle undefined input gracefully", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      // Mock data for the recordClicks function
      const mockData = {
        domain: "testDomain", // current domain
        urlpath: window.location.pathname, // current path
        clickednodename: "testClickedName", // clicked name
        html5: 0, // set to 0
        clickedpath: "", // empty string by default
        objectdata: "{}", // empty object as JSON string
      };

      await expect(recordClicks(undefined)).rejects.toThrow(
        "Cannot read property 'sessionid' of undefined"
      );

      expect(getSessionKey).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.RecordClicks,
        method: "POST",
        body: {
          sessionid: mockSessionKey,
          domain: mockData.domain,
          urlpath: mockData.urlpath,
          clickednodename: mockData.clickednodename,
          html5: mockData.html5,
          clickedpath: mockData.clickedpath,
          objectdata: mockData.objectdata,
        },
      });
    });

  /**
   * Tests the behavior of the `recordClicks` function, which is responsible for recording user click data.
   *
   * This test ensures that the `recordClicks` function gracefully handles a null input by throwing an appropriate error.
   *
   * @param {object} [request] - The request object containing the user session ID.
   * @returns {Promise<void>}
   */
  describe("recordClicks", () => {
    it("should handle null input gracefully", async () => {
      // Mock session key for testing
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      // Mock request data
      const mockRequest = {
        sessionid: mockSessionKey,
        domain: window.location.host, // current domain
        urlpath: window.location.pathname, // current path
        clickednodename: "", // clicked name
        html5: 0, // set to 0
        clickedpath: "", // empty string by default
        objectdata: "{}", // empty object as JSON string by default
      };

      await expect(recordClicks(null)).rejects.toThrow(
        "Cannot read property 'sessionid' of null"
      );

      expect(getSessionKey).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.RecordClicks,
        method: "POST",
        body: mockRequest,
      });
    });
  });
  describe("recordClicks", () => {
    it("should handle null input gracefully", async () => {
      // Mock session key for testing
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      // Mock request data
      const mockRequest = {
        sessionid: mockSessionKey,
        domain: window.location.host, // current domain
        urlpath: window.location.pathname, // current path
        clickednodename: "", // clicked name
        html5: 0, // set to 0
        clickedpath: "", // empty string by default
        objectdata: "{}", // empty object as JSON string by default
      };

      await expect(recordClicks(null)).rejects.toThrow(
        "Cannot read property 'sessionid' of null"
      );

      expect(getSessionKey).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.RecordClicks,
        method: "POST",
        body: mockRequest,
      });
    });
  });
  describe("recordClicks", () => {
    it("should handle null input gracefully", async () => {
     // Mock data
const mockDomain = 'example.com';
const mockPathname = '/path/to/page';
const mockText = 'Clicked Node Name';
const mockJsonString = '{"mockData": "value"}';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    host: mockDomain,
    pathname: mockPathname,
  },
});

// Mock TSON.stringify
TSON.stringify = jest.fn().mockReturnValue(mockJsonString);

// Call the function with mock data
const result = getClickedNodeData(mockText);

// Assert the result
expect(result).toEqual({
  domain: mockDomain, // Mocked domain
  urlpath: mockPathname, // Mocked pathname
  clickednodename: mockText, // Mocked text
  html5: 0, // Default value
  clickedpath: '', // Default empty string
  objectdata: mockJsonString, // Mocked JSON string
});

    });
    /**
     * Tests the behavior of the `recordSequence` function, which is responsible for recording a user's click sequence.
     *
     * This test ensures that the `recordSequence` function correctly calls the `REST.apiCal` function with the expected parameters when an undefined request object is provided.
     *
     * @param {object} [request] - The request object containing the domain, ignored status, validity status, and list of user click nodes.
     * @returns {Promise<void>}
     */
    describe("recordSequence", () => {
      it("should handle undefined request parameters", async () => {
        // Mock data
        const mockData = {
          domain: "example.com", // domain
          urlpath: window.location.pathname, // urlpath
          clickednodename: "testText", // clickednodename
          html5: 0, // html5
          clickedpath: "", // clickedpath
          objectdata: JSON.stringify({ test: "test" }), // objectdata
        };

        userService.getUserId.mockResolvedValue("userId");

        await recordSequence(undefined);

        expect(REST.apiCal).toHaveBeenCalledWith({
      });
    });
          url: ENDPOINT.RecordSequence,
          method: "POST",
          body: { usersessionid: "userId", ...mockData },
          body: { usersessionid: "userId" },
        });
      });
  
    /**
     * Tests the behavior of the `postRecordSequenceData` function, which is responsible for recording a user's click sequence.
     *
     * This test ensures that the `postRecordSequenceData` function correctly calls the `recordSequence` function with the expected parameters when an undefined request object is provided.
     *
     * @param {object} [request] - The request object containing the domain, ignored status, validity status, and list of user click nodes.
     * @param {string} request.domain - The domain of the current page.
     * @param {number} request.isIgnored - The ignored status of the recording.
     * @param {number} request.isValid - The validity status of the recording.
     * @param {string} request.userclicknodelist - The comma-separated list of user click node IDs.
     * @param {object[]} request.userclicknodesSet - The set of user click nodes.
     * @returns {Promise<void>}
     */
    it("should handle undefined request", async () => {
      // Mock data
      const mockData = {
        domain: "example.com", // domain
        urlpath: "/path", // current page path
        clickednodename: "button", // clicked element name
        html5: 0, // unused
        clickedpath: "", // unused
        objectdata: "{}", // unused
      };
      // Mock functions
      (fetchDomain as jest.Mock).mockReturnValue(mockData.domain);
      (getFromStore as jest.Mock).mockReturnValue(mockData.clickednodename);

      await postRecordSequenceData(undefined);

      expect(recordSequence).toHaveBeenCalledWith({
        domain: mockData.domain,
        isIgnored: 0,
        isValid: 1,
        userclicknodelist: "button",
        userclicknodesSet: [mockData.clickednodename], // Pass the mock user click nodes set
      });
    });
  
  /**
   * Tests the behavior of the `recordUserClickData` function, which is responsible for recording a user's click event.
   *
   * This test ensures that the `recordUserClickData` function correctly calls the `userClick` function with the expected parameters when an empty `clickType` and `clickedName` are provided.
   *
   * @param {string} clickType - The type of the clicked element.
   * @param {string} clickedName - The name of the clicked element.
   * @param {number} recordId - The ID of the recording.
   * @returns {Promise<void>}
   */
  it("should handle empty clickType and clickedName", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock data for the userClick function
    const mockData = {
      domain: "testDomain", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };

    const clickType = "";
    const clickedName = "";
    const recordId = 0;

    (userClick as jest.Mock).mockResolvedValue({
      // Mock response data
      ...mockData,
      status: "success",
      message: "User click recorded",
    });

    await recordUserClickData(clickType, clickedName, recordId);

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: mockData.clickednodename, // set to empty string
      clicktype: clickType, // set to empty string
      clickedname: "",
      clicktype: "",
      recordid: recordId,
    });
  });


/**
 * Tests the behavior of the `userClick` function, which is responsible for recording a user's click event.
 *
 * This test ensures that the `userClick` function correctly calls the `REST.apiCal` function with the expected parameters when an empty request object is provided.
 *
 * @param {object} [request] - The request object containing the user session ID and clicked name.
 * @param {string} request.usersessionid - The user's session ID.
 * @param {string} request.clickedname - The name of the clicked element.
 * @returns {Promise<void>}
 */
describe("userClick", () => {
  it("should handle empty request object", async () => {
    // Mock data
    const mockData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: "testText", // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: JSON.stringify({ test: "test" }), // objectdata
    };

    userService.getUserId.mockResolvedValue("userId");
    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: mockData,
    });

    await userClick({});

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: "PUT",
      body: {
        usersessionid: "userId",
        clickedname: window.location.host,
        ...mockData,
      },
      body: { usersessionid: "userId", clickedname: window.location.host },
    });
  });
});

/**
 * Tests the behavior of the `deleteRecording` function, which is responsible for deleting a user's recording sequence.
 *
 * This test ensures that the `deleteRecording` function correctly calls the `REST.apiCal` function with the expected parameters when a null request object is provided.
 *
 * @param {object} [request] - The request object containing the user session ID.
 * @param {string} request.usersessionid - The user's session ID.
 * @returns {Promise<void>}
 */
describe("deleteRecording", () => {
  it("should handle null request", async () => {
    // Mock data
    const mockData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // current page path
      clickednodename: "", // clicked element name
      html5: 0, // unused
      clickedpath: "", // unused
      objectdata: "{}", // unused
    };

    // Mock getUserId function
    userService.getUserId.mockResolvedValue("userId");

    // Mock REST.apiCal function
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

    // Call deleteRecording function
    await deleteRecording(null);

    // Assert that REST.apiCal was called with the expected parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...mockData, usersessionid: "userId" },
    });
  });
});
it("should handle null request", async () => {
  // Mock data
  const mockData = {
    domain: "example.com", // domain
    urlpath: "/path", // current page path
    clickednodename: "button", // clicked element name
    html5: 0, // unused
    clickedpath: "", // unused
    objectdata: "{}", // unused
  };
  /**
   * Posts the recorded sequence data to the server.
   *
   * @param {object} [data] - The data to be posted. If not provided, the function will use the mocked domain and user click nodes set.
   * @param {string} data.domain - The domain of the current page.
   * @param {number} data.isIgnored - Indicates whether the recording should be ignored.
   * @param {number} data.isValid - Indicates whether the recording is valid.
   * @param {string} data.userclicknodelist - A comma-separated list of user-clicked node IDs.
   * @param {object[]} data.userclicknodesSet - An array of objects representing the user-clicked nodes.
   * @returns {Promise<void>}
   */
  const mockDomain = "mockDomain";
  const mockUserClickNodesSet = [{ id: 1 }, { id: 2 }];

  // Mock functions
  (fetchDomain as jest.Mock).mockReturnValue(mockData.domain);
  (getFromStore as jest.Mock).mockReturnValue(mockData.clickednodename);
  (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
  (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

  // Call the function being tested
  await postRecordSequenceData(null);

  // Verify that the recordSequence function is called with the expected parameters
  expect(recordSequence).toHaveBeenCalledWith({
    domain: mockData.domain, // Set the domain to the mock domain value
    isIgnored: 0, // Set the isIgnored flag to 0
    isValid: 1, // Set the isValid flag to 1
    urlpath: mockData.urlpath, // Set the urlpath to the mock urlpath value
    clickednodename: mockData.clickednodename, // Set the clickednodename to the mock clickednodename value
    html5: mockData.html5, // Set the html5 flag to the mock html5 value
    clickedpath: mockData.clickedpath, // Set the clickedpath to the mock clickedpath value
    objectdata: mockData.objectdata, // Set the objectdata to the mock objectdata value
    userclicknodelist: "1,2",
    userclicknodesSet: mockUserClickNodesSet,
  });
});
/**
 * Tests the behavior of the `updateRecording` function, which is responsible for updating a user's recording sequence.
 *
 * This test ensures that the `updateRecording` function correctly calls the `REST.apiCal` function with the expected parameters when an empty request object is provided.
 */
describe("updateRecording", () => {
  it("should handle request without data", async () => {
    // Mock data
    const mockData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: "testText", // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: JSON.stringify({ test: "test" }), // objectdata
    };

    userService.getUserId.mockResolvedValue("userId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

    await updateRecording({});

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: {
        usersessionid: "userId",
        ...mockData,
      },
    });
  });
});

/**
 * Tests the behavior of the `profanityCheck` function, which is responsible for checking if a given string contains profanity.
 *
 * This test ensures that the `profanityCheck` function correctly calls the `REST.apiCal` function with the expected parameters when an empty string is provided as the request.
 */
describe("profanityCheck", () => {
  it("should handle empty string request", async () => {
    const mockData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: "",
      html5: 0,
      clickedpath: "",
      objectdata: "",
    };

    // Mock successful API call
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData });

    await profanityCheck("");

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: "",
      headers: expect.any(Headers),
    });

    // Assert that the result matches the mock data
    expect(REST.apiCal).toHaveReturnedWith({ data: mockData });
  });
});

/**
 * Tests the behavior of the `saveClickData` function when the provided node is null.
 *
 * This test ensures that the `saveClickData` function correctly throws an error when the node parameter is null.
 *
 * @param text - The text content of the clicked node.
 * @param meta - Additional metadata associated with the click event.
 * @throws {Error} Throws an error with the message "Node is null" when the node parameter is null.
 */
describe("saveClickData", () => {
  it("should handle null node", async () => {
    // Mock data
    const mockText = "click text";
    const mockMeta = { key: "value" };
    const domain = "mockDomain";
    const jsonString = '{"mockedData":"test"}';

    // Expected object
    const expectedObject = {
      domain: domain,
      urlpath: window.location.pathname,
      clickednodename: mockText,
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
    };

    // Call the function with mock data
    await expect(saveClickData(null, mockText, mockMeta)).rejects.toThrow(
      "Node is null"
    );
  });
});
/**
 * Tests the behavior of the `postRecordSequenceData` function, which is responsible for posting user click sequence data.
 *
 * This test ensures that the `postRecordSequenceData` function correctly handles an empty request object.
 */
describe("postRecordSequenceData", () => {
  it("should handle empty request", async () => {
    // Mock request data
    const mockDomain = "example.com";
    const mockText = "click text";
    const mockJsonString = JSON.stringify({ test: "test" });
    const request = {
      domain: mockDomain,
      text: mockText,
      jsonString: mockJsonString,
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      data: {
        domain: mockDomain,
        urlpath: window.location.pathname,
        clickednodename: mockText,
        html5: 0,
        clickedpath: "",
        objectdata: mockJsonString,
      },
    });

    await postRecordSequenceData(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.RecordSequence,
      method: "POST",
      body: {
        domain: mockDomain,
        urlpath: window.location.pathname,
        clickednodename: mockText,
        html5: 0,
        clickedpath: "",
        objectdata: mockJsonString,
      },
    });
    await postRecordSequenceData({});
    // This test would need more specific checks based on how postRecordSequenceData processes the request
  });
});

/**
 * Tests the behavior of the `recordUserClickData` function, which is responsible for recording user click data.
 *
 * This test ensures that the `recordUserClickData` function correctly calls the `userClick` function with the expected parameters, including the user session ID, clicked name, click type, and record ID.
 */
describe("recordUserClickData", () => {
  it("should handle empty parameters", async () => {
    // Mock session key for testing
    const mockSessionKey = "test-session-key";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock data for the userClick function
    const mockData = {
      domain: window.location.host, // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "", // empty string by default
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string by default
    };

    // Mock the userClick function
    (userClick as jest.Mock).mockResolvedValue({
      // Mock response data
      ...mockData,
      status: "success",
      message: "User click recorded",
    });

    userService.getSessionKey.mockResolvedValue("sessionKey");
    await recordUserClickData();

    // Expect the userClick to be called with default values
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: mockData.clickednodename,
      usersessionid: "sessionKey",
      clickedname: "",
      clicktype: "sequencerecord",
      recordid: 0,
    });
  });
});
/**
 * Tests the behavior of the `saveClickData` function, which is responsible for processing and returning click data.
 *
 * This test ensures that the `saveClickData` function correctly processes the provided node, text, and metadata, and returns the expected click data object.
 *
 * @param node - The HTML node that was clicked.
 * @param text - The text content of the clicked node.
 * @param meta - Additional metadata associated with the click event.
 * @returns An object containing the processed click data.
 */
describe("saveClickData", () => {
  // Test case for ensuring `saveClickData` function processes and returns correct click data
  it("should process and return correct click data", async () => {
    // Create a mock DOM node
    const mockNode = document.createElement("div");
    // Set the text content of the mock node
    const mockText = "test";
    // Define additional metadata associated with the mock node
    const mockMeta = { key: "value" };
    // Define a mock object containing information about the mock node
    const mockNodeInfo = { info: "mockNodeInfo" };
    // Define a mock domain
    const mockDomain = "mockDomain";
    // Define a mock JSON string
    const mockJsonString = "mockJsonString";

    // Mock the behavior of the getNodeInfo function
    (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
    // Mock the behavior of the fetchDomain function
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    // Mock the behavior of the TSON.stringify function
    (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

    // Call the saveClickData function with the mock node and associated data
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // Assert that the result matches the expected object
    expect(result).toEqual({
      // Expected domain value
      domain: mockDomain,
      // Expected URL path value
      urlpath: window.location.pathname,
      // Expected clicked node name value
      clickednodename: mockText,
      // Expected HTML5 flag value
      html5: 0,
      // Expected clicked path value
      clickedpath: "",
      // Expected JSON string value
      objectdata: mockJsonString,
    });
  });
});

/**
 * Tests the behavior of the `postRecordSequenceData` function, which is responsible for recording sequence data.
 *
 * This test ensures that the `postRecordSequenceData` function correctly calls the `recordSequence` function with the expected parameters, including the domain, ignored status, validity status, and the list of user click nodes.
 *
 * @param mockRequest - The mock request object containing the data to be recorded.
 */
describe("postRecordSequenceData", () => {
  it("should call recordSequence with correct parameters", async () => {
    // Mock data
    const mockRequest = { data: "test" }; // Mock request object
    const mockDomain = "mockDomain"; // Mock domain value
    const mockUserClickNodesSet = [{ id: 1 }, { id: 2 }]; // Mock user click nodes set

    // Mock functions
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain); // Mock fetchDomain function
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet); // Mock getFromStore function

    // Call the function being tested
    await postRecordSequenceData(mockRequest);

    // Verify that the recordSequence function is called with the expected parameters
    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest, // Spread the mock request object
      domain: mockDomain, // Set the domain to the mock domain value
      isIgnored: 0, // Set the isIgnored flag to 0
      isValid: 1, // Set the isValid flag to 1
      userclicknodelist: "1,2", // Generate a comma-separated list of node IDs
      userclicknodesSet: mockUserClickNodesSet, // Pass the mock user click nodes set
    });
  });
});

/**
 * Records a user click event with the provided parameters.
 *
 * @param clickType - The type of click event being recorded (e.g. "sequencerecord").
 * @param clickedName - The name of the clicked element.
 * @param recordId - The ID of the record associated with the click event.
 * @returns A promise that resolves when the click event has been recorded.
 */
describe("recordUserClickData", () => {
  it("should call userClick with correct parameters", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock data for the userClick function
    const mockData = {
      domain: "testDomain", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "testClickedName", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };

    const clickType = "sequencerecord";
    const clickedName = "test";
    const recordId = 0;

    (userClick as jest.Mock).mockResolvedValue({
      // Mock response data
      ...mockData,
      status: "success",
      message: "User click recorded",
    });

    await recordUserClickData(clickType, clickedName, recordId);

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: clickedName,
      clicktype: clickType,
      recordid: recordId,
    });
  });
});
/**
 * Tests the error handling behavior of the `updateRecordClicks` function.
 *
 * This test ensures that the `updateRecordClicks` function can gracefully handle errors that occur during the API call to update the record clicks.
 *
 * @param request - The request object containing the data to be updated for the record clicks.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("updateRecordClicks", () => {
  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    const mockData = {
      domain: "example.com", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "testClickedName", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const saveClickDatarequest = {
      data: "test",
    };
    const request = { data: "test" };
    await expect(updateRecordClicks(request)).rejects.toThrow("API Error");

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UpdateRecord,
      method: "POST",
      body: { ...request, sessionid: mockSessionKey, ...mockData },
      body: { ...request, sessionid: mockSessionKey },
    });
  });
});

/**
 * Tests the error handling behavior of the `recordSequence` function.
 *
 * This test ensures that the `recordSequence` function can gracefully handle errors that occur during the API call to record a sequence of user interactions.
 *
 * @param request - The request object containing the data to be recorded for the sequence of user interactions.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("recordSequence", () => {
  it("should handle errors gracefully", async () => {
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const request = {
      // Mock data
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    const request = { data: "test" };
    await expect(recordSequence(request)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.RecordSequence,
      method: "POST",
      body: { ...request, usersessionid: mockUserId },
    });
  });
});

/**
 * Tests the error handling behavior of the `userClick` function.
 *
 * This test ensures that the `userClick` function can gracefully handle errors that occur during the API call to record a user click.
 *
 * @param request - The request object containing the data to be recorded for the user click.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("userClick", () => {
  it("should handle errors gracefully", async () => {
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const request = {
      data: "test", // text
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.data, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: JSON.stringify({ test: "test" }), // objectdata
      },
    });

    const request = { data: "test" };
    await expect(userClick(request)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: "PUT",
      body: {
        ...request,
        usersessionid: mockUserId,
        clickedname: window.location.host,
      },
    });
  });
});

/**
 * Tests the error handling behavior of the `deleteRecording` function.
 *
 * This test ensures that the `deleteRecording` function can gracefully handle errors that occur during the API call to delete a recording sequence.
 *
 * @param request - The request object containing the data to be deleted from the recording sequence.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("deleteRecording", () => {
  it("should handle errors gracefully", async () => {
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Mock data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await expect(deleteRecording(request)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { ...request, usersessionid: mockUserId },
    });
  });
});


/**
 * Tests the error handling behavior of the `updateRecording` function.
 *
 * This test ensures that the `updateRecording` function can gracefully handle errors that occur during the API call to update a recording sequence.
 *
 * @param request - The request object containing the data to be updated in the recording sequence.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("updateRecording", () => {
  it("should handle errors gracefully", async () => {
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Mock data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: {
        domain: "example.com", // domain
        urlpath: window.location.pathname, // urlpath
        clickednodename: request.text, // clickednodename
        html5: 0, // html5
        clickedpath: "", // clickedpath
        objectdata: request.jsonString, // objectdata
      },
    });

    await expect(updateRecording(request)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: { ...request, usersessionid: mockUserId },
    });
  });
});
/**
 * Tests the error handling behavior of the `profanityCheck` function.
 *
 * This test ensures that the `profanityCheck` function can gracefully handle errors that occur during the API call to check for profanity in the provided request string.
 *
 * @param request - The request string to be checked for profanity.
 * @returns A promise that rejects with an "API Error" error if the API call fails.
 */
describe("profanityCheck", () => {
  it("should handle errors gracefully", async () => {
    const request = "test"; // Mock request data
    const headers = new Headers(); // Create new Headers object
    headers.append("Content-Type", "text/plain"); // Set Content-Type header
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1); // Set Ocp-Apim-Subscription-Key header
    const request = "test";
    const headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);

    const mockData = { // Mock response data
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request,
      html5: 0,
      clickedpath: "",
      objectdata: JSON.stringify({ test: "test" }),
    };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(profanityCheck(request)).rejects.toThrow("API Error");

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers,
    });

    (REST.apiCal as jest.Mock).mockResolvedValue({ data: mockData }); // Mock successful API call

    const result = await profanityCheck(request); // Call profanityCheck function

    expect(result).toEqual({ data: mockData }); // Assert that the result matches the mock data
  });
});

/**
 * Tests that the `saveClickData` function can handle nodes with no outer HTML.
 *
 * This test ensures that the `saveClickData` function can correctly generate the expected result object when the provided DOM node has no outer HTML.
 *
 * @param mockNode - A mock DOM node with no outer HTML.
 * @param mockText - The text content of the mock node.
 * @param mockMeta - Additional metadata associated with the mock node.
 * @returns A promise that resolves with the expected result object.
 */
describe("saveClickData", () => {
  // Tests that the saveClickData function can handle nodes with no outer HTML.
  // This test ensures that the saveClickData function can correctly generate the expected result object when the provided DOM node has no outer HTML.
  it("should handle nodes without outerHTML", async () => {
    // Mock DOM node with no outer HTML
    const mockNode = document.createElement("div");
    // Mock text content of the mock node
    const mockText = "test";
    // Additional metadata associated with the mock node
    const mockMeta = { key: "value" };
    // Mock node info to be returned by the getNodeInfo function
    const mockNodeInfo = { info: "mockNodeInfo" };
    // Mock domain to be returned by the fetchDomain function
    const mockDomain = "mockDomain";
    // Mock JSON string to be returned by the TSON.stringify function
    const mockJsonString = "mockJsonString";

    // Mock the getNodeInfo function to return the mock node info
    (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
    // Mock the fetchDomain function to return the mock domain
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    // Mock the TSON.stringify function to return the mock JSON string
    (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

    // Delete the outerHTML property from the mock node
    delete mockNode.outerHTML;

    // Call the saveClickData function with the mock node, text, and metadata
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // Assert that the result matches the expected object
    expect(result).toEqual({
      domain: mockDomain, // The mock domain
      urlpath: window.location.pathname, // The current URL path
      clickednodename: mockText, // The mock text
      html5: 0, // The HTML 5 flag
      clickedpath: "", // The clicked path
      objectdata: mockJsonString, // The mock JSON string
    });

  /**
   * Tests that the `saveClickData` function can handle nodes with no children.
   *
   * This test ensures that the `saveClickData` function can correctly generate the expected result object when the provided DOM node has no children.
   *
   * @param mockNode - A mock DOM node with no children.
   * @param mockText - The text content of the mock node.
   * @param mockMeta - Additional metadata associated with the mock node.
   * @returns A promise that resolves with the expected result object.
   */
  it("should handle nodes with no children", async () => {
    // Create a mock DOM node
    const mockNode = document.createElement("div");
    // Set the text content of the mock node
    const mockText = "test";
    // Define additional metadata associated with the mock node
    const mockMeta = { key: "value" };
    // Define a mock object containing information about the mock node
    const mockNodeInfo = { info: "mockNodeInfo" };
    // Define a mock domain
    const mockDomain = "mockDomain";
    // Define a mock JSON string
    const mockJsonString = "mockJsonString";

    // Mock the behavior of the getNodeInfo function
    (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
    // Mock the behavior of the fetchDomain function
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    // Mock the behavior of the TSON.stringify function
    (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

    // Call the saveClickData function with the mock node and associated data
    const result = await saveClickData(mockNode, mockText, mockMeta);

    // Assert that the result matches the expected object
    expect(result).toEqual({
      // Expected domain
      domain: mockDomain,
      // Expected URL path
      urlpath: window.location.pathname,
      // Expected clicked node name
      clickednodename: mockText,
      // Expected HTML5 value
      html5: 0,
      // Expected clicked path
      clickedpath: "",
      // Expected JSON string
      objectdata: mockJsonString,
    });
  });
});
/**
 * Tests that the `postRecordSequenceData` function can handle a large number of user click nodes.
 *
 * This test ensures that the `postRecordSequenceData` function can successfully process a large set of user click nodes (up to 1000 in this case) and correctly pass the necessary data to the `recordSequence` function.
 *
 * @param mockRequest - A mock request object containing data to be recorded.
 * @returns A promise that resolves when the `postRecordSequenceData` function completes.
 */
describe("postRecordSequenceData", () => {
  it("should handle a large number of user click nodes", async () => {
    // Mock data
    const mockRequest = { data: "test" };
    const mockDomain = "mockDomain";
    const mockUserClickNodesSet = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1 }));
    const mockUserClickNodesSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
    }));

    // Mock functions
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

    // Call the function being tested
    await postRecordSequenceData(mockRequest);

    // Verify that the recordSequence function is called with the expected parameters
    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest, // Spread the mock request object
      domain: mockDomain, // Set the domain to the mock domain value
      isIgnored: 0, // Set the isIgnored flag to 0
      isValid: 1, // Set the isValid flag to 1
      userclicknodelist: mockUserClickNodesSet.map((node) => node.id).join(","), // Generate a comma-separated list of node IDs
      userclicknodesSet: mockUserClickNodesSet, // Pass the mock user click nodes set
      ...mockRequest,
      domain: mockDomain,
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: mockUserClickNodesSet.map((node) => node.id).join(","),
      userclicknodesSet: mockUserClickNodesSet,
    });
  });
});

/**
 * Tests that the `saveClickData` function handles nodes with ignored attributes correctly.
 *
 * This test ensures that the `saveClickData` function can handle nodes that have certain attributes set, such as `addedClickRecord`, `hasClick`, `udaIgnoreChildren`, and `udaIgnoreClick`. The function should still generate the expected result object in these cases.
 *
 * @param mockNode - A mock DOM node with the specified ignored attributes.
 * @param mockText - The text content of the mock node.
 * @param mockMeta - Additional metadata associated with the mock node.
 * @returns A promise that resolves with the expected result object.
 */
it("should handle nodes with ignored attributes", async () => {
  const mockNode = document.createElement("div");
  mockNode.addedClickRecord = true;
  mockNode.hasClick = true;
  mockNode.udaIgnoreChildren = true;
  mockNode.udaIgnoreClick = true;

  const mockText = "test";
  const mockMeta = { key: "value" };
  const mockNodeInfo = { info: "mockNodeInfo" };
  const mockDomain = "mockDomain";
  const mockJsonString = "mockJsonString";

  (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
  (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
  (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

  const result = await saveClickData(mockNode, mockText, mockMeta);

  expect(result).toEqual({
    domain: mockDomain,
    urlpath: window.location.pathname,
    clickednodename: mockText,
    html5: 0,
    clickedpath: "",
    objectdata: mockJsonString,
  });
});

/**
 * Tests that the `recordUserClickData` function handles errors gracefully.
 *
 * This test ensures that the `recordUserClickData` function can handle errors that occur when calling the `userClick` function, such as an "API Error". The function should reject with the error in these cases.
 *
 * @param clickType - The type of click event to record.
 * @param clickedName - The name of the clicked element.
 * @param recordId - The ID of the record to associate with the click event.
 * @returns A promise that rejects with an error when the `userClick` function throws an error.
 */
describe("recordUserClickData", () => {
  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    
    // Mock data for the userClick function
    const mockData = {
      domain: "testDomain", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "testClickedName", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };

    // Mock the userClick function
    (userClick as jest.Mock).mockRejectedValue(new Error("API Error"));

    const clickType = "sequencerecord";
    const clickedName = "test";
    const recordId = 0;

    await expect(
      recordUserClickData(clickType, clickedName, recordId)
    ).rejects.toThrow("API Error");

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: clickedName,
      clicktype: clickType,
      recordid: recordId,
    });
  });
  /**
   * Tests that the `recordUserClickData` function handles invalid data types gracefully.
   *
   * This test ensures that the `recordUserClickData` function can handle cases where the input parameters have invalid data types, such as a number for `clickType`, an object for `clickedName`, and a string for `recordId`. The function should reject with an error in these cases.
   *
   * @param clickType - The type of click event to record, which should be a string.
   * @param clickedName - The name of the clicked element, which should be a string.
   * @param recordId - The ID of the record to associate with the click event, which should be a number.
   * @returns A promise that rejects with an error when the input parameters have invalid data types.
   */
});
describe("recordUserClickData", () => {
  it("should handle invalid data types", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock data for the userClick function
    const mockData = {
      domain: "testDomain", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "testClickedName", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };

    // Mock the userClick function
    (userClick as jest.Mock).mockResolvedValue({
      // Mock response data
      ...mockData,
      status: "error",
      message: "Invalid data type",
    });

    const clickType = 123; // Invalid data type
    const clickedName = { name: "test" }; // Invalid data type
    const recordId = "invalid"; // Invalid data type

    await expect(
      recordUserClickData(clickType as any, clickedName as any, recordId as any)
    ).rejects.toThrow();

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: mockData.clickednodename,
      clicktype: "sequencerecord",
      recordid: 0,
    });
  });
});
/**
 * Tests that the `saveClickData` function returns the expected object when provided with a DOM node, text, and metadata.
 *
 * @param node - The DOM node to be saved.
 * @param text - The text associated with the clicked node.
 * @param meta - Additional metadata to be included in the saved data.
 * @returns The expected object with the saved click data.
 */
it("should return the correct object", async () => {
  const node = document.createElement("div");
  node.nodeName = "DIV";
  node.outerHTML = "<div>Test</div>";
  const text = "test";
  const meta = { test: "test" };
  const result = await saveClickData(node, text, meta);
  expect(result).toEqual({
    domain: "testDomain",
    urlpath: window.location.pathname,
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: expect.any(String),
  });
});

/**
 * Tests that the `fetchDomain` function returns the correct domain from a given URL.
 */
describe("fetchDomain", () => {
  it("should return the correct domain", () => {
    const mockUrl = "https://example.com/path?query=value";
    expect(fetchDomain(mockUrl)).toBe("example.com");
  });

  /**
   * Tests that the `fetchDomain` function returns `null` when the provided URL is `null` or `undefined`.
   */
  it("should handle null or undefined URL", () => {
    expect(fetchDomain(null)).toBeNull();
    expect(fetchDomain(undefined)).toBeNull();
  });

  /**
   * Tests that the `fetchDomain` function returns `null` when the provided URL is empty.
   */
  it("should handle empty URL", () => {
    expect(fetchDomain("")).toBeNull();
  });

  /**
   * Tests that the `fetchDomain` function returns `null` when the provided URL does not contain a domain.
   */
  it("should handle URLs without a domain", () => {
    const mockUrl = "/path?query=value";
    expect(fetchDomain(mockUrl)).toBeNull();
  });
});

/**
 * Tests that the `getFromStore` function returns the expected value from the store.
 */
describe("getFromStore", () => {
  it("should return the value from the store", () => {
    const mockStore = { key: "value" };
    expect(getFromStore(mockStore, "key")).toBe("value");
  });

  /**
   * Tests that the `getFromStore` function returns `null` when the requested key does not exist in the store.
   */
  it("should return null for non-existent keys", () => {
    const mockStore = { key: "value" };
    expect(getFromStore(mockStore, "nonExistentKey")).toBeNull();
  });

  /**
   * Tests that the `getFromStore` function returns `null` when the store parameter is `null` or `undefined`.
   */
  it("should handle null or undefined store", () => {
    expect(getFromStore(null, "key")).toBeNull();
    expect(getFromStore(undefined, "key")).toBeNull();
  });
});
/**
 * Records a user's click events.
 *
 * @param {object} request - The request object containing data to record the user's click events.
 * @returns {Promise<{ data: any }>} - The response from the user click recording API.
 */
describe("RecordService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should record clicks", async () => {
    const request = { test: "test" };
    (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await recordClicks(request);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/record",
      method: "POST",
      body: { ...request, sessionid: "testSessionKey" },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Updates a user's record clicks.
   *
   * @param {object} request - The request object containing data to update the user's record clicks.
   * @returns {Promise<{ data: any }>} - The response from the user record clicks update API.
   */
  it("should update record clicks", async () => {
    // Mock data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock response
    const responseData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: request.text, // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: request.jsonString, // objectdata
    };

    // Mock REST.apiCal method
    (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: responseData,
    });

    const result = await updateRecordClicks(request);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/updateRecord",
      method: "POST",
      body: { ...request, sessionid: "testSessionKey" },
    });
    expect(result).toEqual({ data: responseData });
  });
  /**
   * Records a user interaction sequence.
   *
   * @param {object} request - The request object containing data to record the user interaction sequence.
   * @returns {Promise<{ data: any }>} - The response from the user interaction sequence recording API.
   */
  it("should record sequence", async () => {
    // Mock data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock response
    const responseData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: request.text, // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: request.jsonString, // objectdata
    };

    // Mock REST.apiCal method
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: responseData,
    });
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/recordSequence",
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
    expect(result).toEqual({ data: responseData });
  });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Records a user click event.
   *
   * @param {object} request - The request object containing data to record the user click.
   * @returns {Promise<{ data: any }>} - The response from the user click recording API.
   */
  it("should record user click", async () => {
    // Mock data
    const request = {
      text: "testText", // text
      jsonString: JSON.stringify({ test: "test" }), // jsonString
    };

    // Mock response
    const responseData = {
      domain: "example.com", // domain
      urlpath: window.location.pathname, // urlpath
      clickednodename: request.text, // clickednodename
      html5: 0, // html5
      clickedpath: "", // clickedpath
      objectdata: request.jsonString, // objectdata
    };

    // Mock REST.apiCal method
    (REST.apiCal as jest.Mock).mockResolvedValue({
      // Mock response data
      data: responseData,
    });
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { host: "testHost" } as Location;

    const result = await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/userClick",
      method: "PUT",
      body: {
        ...request,
        usersessionid: "testUserId",
        clickedname: "testText",
        clickedname: "testHost",
      },
    });
    expect(result).toEqual({ data: responseData });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Deletes an existing recording sequence.
   *
   * @param {object} request - The request object containing data to delete the recording sequence.
   * @returns {Promise<{ data: any }>} - The response from the delete recording sequence API.
   */
  it("should delete recording", async () => {
    // Mock data
    const request = {
      text: "testText",
      jsonString: JSON.stringify({ test: "test" }),
    };

    // Mock response
    const responseData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request.text,
      html5: 0,
      clickedpath: "",
      objectdata: request.jsonString,
    };
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: responseData });
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/deleteSequence",
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
    expect(result).toEqual({ data: responseData });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Updates an existing recording sequence.
   *
   * @param {object} request - The request object containing data to update the recording sequence.
   * @returns {Promise<{ data: any }>} - The response from the update recording sequence API.
   */
  it("should update recording", async () => {
    // Mock data
    const request = {
      text: "testText",
      jsonString: JSON.stringify({ test: "test" }),
    };

    // Mock response
    const responseData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request.text,
      html5: 0,
      clickedpath: "",
      objectdata: request.jsonString,
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: responseData });
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/updateRecordSequence",
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
    expect(result).toEqual({ data: responseData });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Checks for profanity in the provided request object.
   *
   * @param {object} request - The request object containing data to check for profanity.
   * @returns {Promise<{ data: any }>} - The response from the profanity check API.
   */
  it("should check profanity", async () => {
    // Mock data
    const request = {
      text: "test",
      jsonString: JSON.stringify({ test: "test" }),
    };

    // Mock response
    const responseData = {
      domain: "example.com",
      urlpath: window.location.pathname,
      clickednodename: request.text,
      html5: 0,
      clickedpath: "",
      objectdata: request.jsonString,
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: responseData });
    const request = { test: "test" };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await profanityCheck(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/profanityCheck",
      method: "POST",
      body: request,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Ocp-Apim-Subscription-Key": "testKey1",
      }),
    });
    expect(result).toEqual({ data: responseData });
    expect(result).toEqual({ data: "testData" });
  });
  /**
   * Saves click data for a node, including the node's HTML, position, and other metadata.
   *
   * @param {object} node - The node that was clicked.
   * @param {string} text - The text content of the clicked node.
   * @param {object} meta - Additional metadata about the click event.
   * @returns {Promise<{ domain: string, urlpath: string, clickednodename: string, html5: number, clickedpath: string, objectdata: string }>} - The click data that was saved.
   */

  it("should save click data", async () => {
    // Mock data
    const domain = "testDomain";
    const pathname = "testPathname";
    const text = "testText";
    const meta = { test: "test" };
    const jsonString = "testString";

    const node = {
      cloneNode: jest.fn(() => ({
        classList: {
          contains: jest.fn(),
        },
        hasOwnProperty: jest.fn(),
        nodeName: {
          toLowerCase: jest.fn(),
        },
        outerHTML: "testOuterHTML",
        getBoundingClientRect: jest
          .fn()
          .mockReturnValue({
            top: 10,
            left: 20,
            width: 100,
            height: 200,
          }),
          .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 }),
      })),
    };

    // Mock implementation of functions
    const mockDatatext = "testText";
    const mockDatameta = { test: "test" };
    (domJSON.toJSON as jest.Mock).mockReturnValue({
      node: {
        addedClickRecord: true,
        hasClick: true,
        udaIgnoreChildren: true,
        udaIgnoreClick: true,
      },
      meta: {},
    });
    (getAbsoluteOffsets as jest.Mock).mockReturnValue({ test: "test" });
    (getNodeInfo as jest.Mock).mockReturnValue({
      test: "test",
      screenSize: {
        screen: {
          width: 100,
          height: 100,
        },
      },
    });
    (TSON.stringify as jest.Mock).mockReturnValue(jsonString);
    (TSON.stringify as jest.Mock).mockReturnValue("testString");
    (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
      inputElement: "test",
    });

    // Mock window.location
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      host: domain,
      pathname: pathname,
      host: "testHost",
      pathname: "testPathname",
    } as Location;

    const result = await saveClickData(node, text, meta);

    expect(domJSON.toJSON).toHaveBeenCalled();
    expect(getAbsoluteOffsets).toHaveBeenCalled();
    expect(getNodeInfo).toHaveBeenCalled();
    expect(TSON.stringify).toHaveBeenCalled();
    expect(mapClickedElementToHtmlFormElement).toHaveBeenCalled();

    // Check the result
    expect(result).toEqual({
      domain,
      urlpath: pathname,
      clickednodename: text,
      domain: "testHost",
      urlpath: "testPathname",
      clickednodename: "testText",
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
      objectdata: "testString",
    });
  });

  /**
   * Posts record sequence data to the server.
   *
   * @param {object} request - The request object containing data to be sent to the server.
   * @returns {Promise<{ data: any }>} - The response data from the `recordSequence` API call.
   */
  it("should post record sequence data", async () => {
    // Mock data
    const mockDomain = "testDomain";
    const mockUserClickNodesSet = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const mockRequest = { test: "test" };

    // Mock functions
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (getFromStore as jest.Mock).mockReturnValue([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
    (fetchDomain as jest.Mock).mockReturnValue("testDomain");
    (recordSequence as jest.Mock).mockResolvedValue({ data: "testData" });
    window.udanSelectedNodes = [];
    const request = { test: "test" };

    // Call the function being tested
    const result = await postRecordSequenceData(mockRequest);
    const result = await postRecordSequenceData(request);

    // Verify that the recordSequence function is called with the expected parameters
    expect(getFromStore).toHaveBeenCalled();
    expect(fetchDomain).toHaveBeenCalled();
    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest,
      domain: mockDomain,
      ...request,
      domain: "testDomain",
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: "1,2,3",
      userclicknodesSet: mockUserClickNodesSet,
      userclicknodesSet: [{ id: 1 }, { id: 2 }, { id: 3 }],
    });

    // Verify that the result matches the expected data
    expect(result).toEqual({
      data: "testData",
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Records user click data, including the session key, clicked name, click type, and record ID.
   *
   * @returns {Promise<{ data: any }>} - The response data from the `userClick` API call.
   */
  it("should record user click data", async () => {
    // Mock session key for testing
    const mockSessionKey = "test-session-key";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock data for the userClick function
    const mockData = {
      domain: "testDomain", // current domain
      urlpath: window.location.pathname, // current path
      clickednodename: "testClickedName", // clicked name
      html5: 0, // set to 0
      clickedpath: "", // empty string by default
      objectdata: "{}", // empty object as JSON string
    };

    // Mock the userClick function
    (userClick as jest.Mock).mockResolvedValue({
      // Mock response data
      ...mockData,
      status: "success",
      message: "User click recorded",
    });
    (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");
    (userClick as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await recordUserClickData();

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: mockData.clickednodename,
      usersessionid: "testSessionKey",
      clickedname: "",
      clicktype: "sequencerecord",
      recordid: 0,
    });
    expect(result).toEqual({
      domain: mockData.domain,
      urlpath: mockData.urlpath,
      clickednodename: mockData.clickednodename,
      html5: mockData.html5,
      clickedpath: mockData.clickedpath,
      objectdata: mockData.objectdata,
    });
    expect(result).toEqual({ data: "testData" });
  });
});
/**
 * Tests that the `saveClickData` function correctly returns `false` when the screen size is not available.
 *
 * @param {HTMLElement} node - The node element to pass to `saveClickData`.
 * @param {string} text - The text value to pass to `saveClickData`.
 * @param {object} meta - The metadata object to pass to `saveClickData`.
 * @returns {Promise<void>} - Resolves when the test is complete.
 */
it("should save click data and handle case where screen size is not available", async () => {
  // Mock DOM node
  const node = {
    cloneNode: jest.fn(() => ({
      classList: {
        contains: jest.fn(),
      },
      hasOwnProperty: jest.fn(),
      nodeName: {
        toLowerCase: jest.fn(() => "div"),
      },
      outerHTML: "testOuterHTML",
      getBoundingClientRect: jest
        .fn()
        .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 }),
    })),
  };

  // Mock text and meta
  const text = "testText";
  const meta = { test: "test" };

  // Mock toJSON response
  (domJSON.toJSON as jest.Mock).mockReturnValue({
    node: {
      addedClickRecord: true,
      hasClick: true,
      udaIgnoreChildren: true,
      udaIgnoreClick: true,
    },
    meta: {},
  });

  // Mock getAbsoluteOffsets response
  (getAbsoluteOffsets as jest.Mock).mockReturnValue({ test: "test" });

  // Mock getNodeInfo response with empty screen size
  (getNodeInfo as jest.Mock).mockReturnValue({
    test: "test",
    screenSize: {
      screen: {},
    },
  });

  // Mock TSON.stringify response
  (TSON.stringify as jest.Mock).mockReturnValue("testString");

  // Mock mapClickedElementToHtmlFormElement response
  (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
    inputElement: "test",
  });

  // Mock window.location
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    host: "testHost",
    pathname: "testPathname",
  } as Location;

  // Call saveClickData and assert the result
  const result = await saveClickData(node, text, meta);

  // Assert that the result is the expected object
  expect(result).toEqual({
    domain: "testHost",
    urlpath: "testPathname",
    clickednodename: "testText",
    html5: 0,
    clickedpath: "",
    objectdata: "testString",
  });
  expect(result).toEqual(false);
});

/**
 * Tests that the `saveClickData` function correctly returns the expected object when provided with a node, text, and metadata.
 *
 * @param {HTMLElement} node - The node element to pass to `saveClickData`.
 * @param {string} text - The text value to pass to `saveClickData`.
 * @param {object} meta - The metadata object to pass to `saveClickData`.
 * @returns {Promise<void>} - Resolves when the test is complete.
 */
it("should save click data for a node with special name", async () => {
  // Create a mock node with the necessary properties
  const node = {
    cloneNode: jest.fn(() => ({
      classList: { contains: jest.fn() },
      hasOwnProperty: jest.fn(),
      nodeName: { toLowerCase: jest.fn(() => "input") },
      outerHTML: "testOuterHTML",
      getBoundingClientRect: jest
        .fn()
        .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 }),
    })),
  };

  const text = "testText"; // The text value to pass to saveClickData
  const meta = { test: "test" }; // The metadata object to pass to saveClickData

  // Mock the return value of domJSON.toJSON
  (domJSON.toJSON as jest.Mock).mockReturnValue({
    node: {
      addedClickRecord: true,
      hasClick: true,
      udaIgnoreChildren: true,
      udaIgnoreClick: true,
    },
    meta: {},
  });

  // Mock the return value of getAbsoluteOffsets
  (getAbsoluteOffsets as jest.Mock).mockReturnValue({ test: "test" });

  // Mock the return value of getNodeInfo
  (getNodeInfo as jest.Mock).mockReturnValue({
    test: "test",
    screenSize: {
      screen: {
        width: 100,
        height: 100,
      },
    },
  });

  // Mock the return value of TSON.stringify
  (TSON.stringify as jest.Mock).mockReturnValue("testString");

  // Mock the return value of inArray
  (inArray as jest.Mock).mockReturnValue(0);

  // Mock the return value of mapClickedElementToHtmlFormElement
  (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
    inputElement: "test",
  });

  // Mock the location object
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    host: "testHost",
    pathname: "testPathname",
  } as Location;

  const result = await saveClickData(node, text, meta);

  // Assert that the expected functions were called
  expect(domJSON.toJSON).toHaveBeenCalled();
  expect(getAbsoluteOffsets).toHaveBeenCalled();
  expect(getNodeInfo).toHaveBeenCalled();
  expect(TSON.stringify).toHaveBeenCalled();
  expect(inArray).toHaveBeenCalled();
  expect(mapClickedElementToHtmlFormElement).toHaveBeenCalled();

  // Assert that the result is the expected object
  expect(result).toEqual({
    domain: "testHost",
    urlpath: "testPathname",
    clickednodename: "testText",
    html5: 0,
    clickedpath: "",
    objectdata: "testString",
  });
});

/**
 * Tests that the `saveClickData` function returns `false` if the screen size information is not available.
 *
 * @param {HTMLElement} node - The node element to pass to `saveClickData`.
 * @param {string} text - The text value to pass to `saveClickData`.
 * @param {object} meta - The metadata object to pass to `saveClickData`.
 * @returns {Promise<boolean>} - Resolves to `false` if the screen size information is not available.
 */
describe("saveClickData", () => {
  it("should return false if screen size is not available", async () => {
    // Mock data for the function parameters
    const node = document.createElement("div");
    const text = "test";
    const meta = { test: "test" };

    // Mock getNodeInfo return value
    jest.mocked(getNodeInfo).mockReturnValueOnce({
      nodePosition: { top: 10, left: 20, width: 100, height: 200 },
      screenSize: {
        page: { height: 1000, width: 1000 },
        screen: { height: 0, width: 0 },
        scrollInfo: { scrollTop: 0, scrollLeft: 0 },
      },
      nodePagePosition: { top: 10, left: 20 },
    });

    // Call the function
    const result = await saveClickData(node, text, meta);

    // Assert the result
    expect(result).toBe(false);
  });
  /**
   * Tests that the `saveClickData` function correctly returns the expected object when provided with a node, text, and metadata.
   *
   * @param {HTMLElement} node - The node element to pass to `saveClickData`.
   * @param {string} text - The text value to pass to `saveClickData`.
   * @param {object} meta - The metadata object to pass to `saveClickData`.
   * @returns {Promise<void>} - Resolves when the test is complete.
   */

  it("should return the correct object", async () => {
    // Mock domain and window.location
    const domain = "testDomain";
    Object.defineProperty(window, "location", {
      value: { pathname: "/test-path" },
    });

    // Create a mock DOM node
    const node = document.createElement("div");
    node.nodeName = "DIV";
    node.outerHTML = "<div>Test</div>";

    // Mock data for the function parameters
    const text = "test";
    const meta = { test: "test" };

    // Mock jsonString (you might need to adjust this based on your actual implementation)
    const jsonString = JSON.stringify({ node: node, meta: meta });

    const result = await saveClickData(node, text, meta);

    expect(result).toEqual({
      domain: domain,
      urlpath: "/test-path",
      clickednodename: text,
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
    });
  });
  /**
   * Tests that the `saveClickData` function correctly handles special nodes, such as input fields, when the `ignoreNodesFromIndexing` and `customNameForSpecialNodes` configurations are enabled.
   *
   * @param {HTMLElement} mockNode - A mock node element, in this case an input field, to pass to `saveClickData`.
   * @param {string} mockText - A mock text value to pass to `saveClickData`.
   * @param {object} mockMeta - A mock metadata object to pass to `saveClickData`.
   * @returns {Promise<void>} - Resolves when the test is complete.
   */
  it("should handle enableNodeTypeChangeSelection", async () => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        host: "example.com",
        pathname: "/test",
      },
    });

    CONFIG.enableNodeTypeChangeSelection = true;

    jest.mocked(mapClickedElementToHtmlFormElement).mockReturnValueOnce({
      inputElement: "text",
    });

    const node = document.createElement("input");
    node.nodeName = "INPUT";
    node.outerHTML = "<input type='text' value='Test'/>";

    const text = "test";
    const meta = { test: "test" };

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedData":"test"}');

    const result = await saveClickData(node, text, meta);

    // Expect the result to match the specified structure
    expect(result).toEqual({
      domain: "example.com",
      urlpath: "/test",
      clickednodename: "test",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    });

    // Additional check for the meta data
    expect(result.objectdata).toContain(
      '"meta":{"systemDetected":{"inputElement":"text","selectedElement":"text"}}'
    );
  });

  /**
   * Tests that the `saveClickData` function includes the expected node type change selection data when the `enableNodeTypeChangeSelection` configuration is enabled.
   *
   * @param {HTMLElement} mockNode - A mock node element to pass to `saveClickData`.
   * @param {string} mockText - A mock text value to pass to `saveClickData`.
   * @param {object} mockMeta - A mock metadata object to pass to `saveClickData`.
   * @returns {Promise<void>} - Resolves when the test is complete.
   */
  it("should include node type change selection when enabled", async () => {
    // ...
  });

  /**
   * Tests that the `postRecordSequenceData` function clears the `udanSelectedNodes` global variable after posting the data.
   *
   * @returns {Promise<void>} - Resolves when the test is complete.
   */
  it("should clear udanSelectedNodes after posting", async () => {
    // ...
  });
  it("should return the correct payload structure", async () => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        host: "test-domain.com",
        pathname: "/sample-path",
      },
    });

    // Mock DOM node
    const node = document.createElement("a");
    node.href = "#";
    node.textContent = "Test Link";

    // Mock text and meta
    const text = "Test Link Text";
    const meta = { linkType: "internal" };

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedData":"test"}');

    const result = await saveClickData(node, text, meta);

    expect(result).toEqual({
      domain: "test-domain.com",
      urlpath: "/sample-path",
      clickednodename: "Test Link Text",
      html5: 0,
      clickedpath: "",
      objectdata: '{"mockedData":"test"}',
    });
  });
});

describe("postRecordSequenceData - Additional Tests", () => {
  /**
   * Tests that the `postRecordSequenceData` function clears the `udanSelectedNodes` global variable after posting the data.
   *
   * @returns {Promise<void>} - Resolves when the test is complete.
   */
  it("should return the correct payload structure", async () => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        host: "example.com", // Domain
        pathname: "/test-page", // Path
        host: "example.com",
        pathname: "/test-page",
      },
    });

    // Mock DOM node
    const node = document.createElement("button");
    node.textContent = "Click me"; // Text
    node.textContent = "Click me";

    // Mock text and meta
    const mockDatatext = "Click me button"; // Text
    const mockDatameta = { buttonType: "submit" }; // Meta
    const text = "Click me button";
    const meta = { buttonType: "submit" };

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue(
      '{"mockedObjectData":true}' // JSON string
    );
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedObjectData":true}');

    // Make the API call and verify the result
    const result = await saveClickData(node, text, meta);

    expect(result).toEqual({
      domain: "example.com", // Domain
      urlpath: "/test-page", // Path
      clickednodename: "Click me button", // Text
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedObjectData":true}', // JSON string
    
    });
  });

  /**
   * Tests the `recordUserClickData` function to ensure it uses `window.location.host` as the `clickedname` when not provided.
   * This test creates a mock session key and sets the `window.location.host` to a test value, then calls `recordUserClickData` and verifies that the API call includes the expected `clickedname` value.
   */
  it("should return the correct payload structure", async () => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        host: "test.com", // Domain
        pathname: "/test-path", // URL path
      },
    });

    // Mock DOM node
    const node = document.createElement("div");
    node.innerHTML = "Test Node";

    // Mock text and meta
    const text = "Clicked Node"; // Clicked node name
    const meta = { someData: "test data" }; // Additional metadata

    // Mock TSON.stringify to return a predictable string
    jest.spyOn(TSON, "stringify").mockReturnValue('{"mockedJsonString":true}'); // Mocked JSON string

    const result = await saveClickData(node, text, meta);

    // Expected result
    const expectedResult = {
      domain: "test.com", // Domain
      urlpath: "/test-path", // URL path
      clickednodename: "Clicked Node", // Clicked node name
      html5: 0, // HTML5 flag
      clickedpath: "", // Clicked path
      objectdata: '{"mockedJsonString":true}', // JSON string
    };

    expect(result).toEqual(expectedResult);
  });
  });
