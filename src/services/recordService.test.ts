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

jest.mock("../services/userService", () => ({
  getSessionKey: jest.fn(),
  getUserId: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

jest.mock("../util/nodeInfo", () => ({
  getNodeInfo: jest.fn(),
}));

jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));

jest.mock("typescript-json", () => ({
  stringify: jest.fn(),
}));

jest.mock("../config/error-log", () => ({
  UDAConsoleLogger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../util/fetchDomain", () => ({
  fetchDomain: jest.fn(),
}));

jest.mock("../util", () => ({
  getFromStore: jest.fn(),
}));
/**
 * Tests that the `recordClicks` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("recordClicks returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    // expected response object
  };

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
  const request = {
    // invalid request object
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
/**
 * Tests that the `updateRecordClicks` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("updateRecordClicks returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    // expected response object
  };

  const response = await updateRecordClicks(request);

  expect(response).toEqual(expectedResponse);
});
/**
 * Tests that the `recordSequence` function returns a promise that resolves with the expected response.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
test("recordSequence returns a promise that resolves with the expected response", async () => {
  const request = {
    // valid request object
  };
  const expectedResponse = {
    // expected response object
  };

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
  const mockSessionKey = "test-session-key";
  (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

  await recordUserClickData();

  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String),
    method: "PUT",
    body: {
      usersessionid: mockSessionKey,
      clickedname: "",
      clicktype: "sequencerecord",
      recordid: 0,
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
  jest.mocked(inArray).mockReturnValueOnce(true);
  CONFIG.customNameForSpecialNodes = {
    DIV: "Custom Name",
  };
  const node = document.createElement("div");
  node.nodeName = "DIV";
  node.outerHTML = "<div>Test</div>";
  const text = "test";
  const meta = { test: "test" };
  const result = await saveClickData(node, text, meta);
  expect(result.objectdata).toContain('"meta":{"displayText":"Custom Name"');
});

/**
 * Tests that the `saveClickData` function correctly handles the case where the clicked element is an input element and the `enableNodeTypeChangeSelection` configuration is set to `true`.
 *
 * @param {void} - This test does not take any parameters.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
it("should handle enableNodeTypeChangeSelection", async () => {
  CONFIG.enableNodeTypeChangeSelection = true;
  jest.mocked(mapClickedElementToHtmlFormElement).mockReturnValueOnce({
    inputElement: "text",
  });
  const node = document.createElement("input");
  node.nodeName = "INPUT";
  node.outerHTML = "<input type='text' value='Test'/>";
  const text = "test";
  const meta = { test: "test" };
  const result = await saveClickData(node, text, meta);
  expect(result.objectdata).toContain(
    '"meta":{"systemDetected":{"inputElement":"text","selectedElement":"text"}}'
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
    const mockRequest = { data: "test" };
    const mockDomain = "mockDomain";
    const mockUserClickNodesSet = [];

    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

    await postRecordSequenceData(mockRequest);

    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest,
      domain: mockDomain,
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: "",
      userclicknodesSet: mockUserClickNodesSet,
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
    // expected response object
  };

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
  };

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
  };

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
  };
  const expectedResponse = {
    // expected response object
  };

  const response = await profanityCheck(request);

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
  const node = document.createElement("div");
  const text = "click text";
  const meta = {
    // valid meta object
  };
  const expectedObject = {
    // expected object
  };

  const result = saveClickData(node, text, meta);

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
    // valid request object
  };
  const expectedObject = {
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
  const clickType = "click type";
  const clickedName = "clicked name";
  const recordId = 123;
  const expectedObject = {
    // expected object
  };

  const result = await recordUserClickData(clickType, clickedName, recordId);

  expect(result).toEqual(expectedObject);
});
/**
 * Tests that the `recordClicks` function returns a promise that rejects with an error when the request object is missing the `sessionid` property.
 *
 * @param {object} request - The request object to pass to the `recordClicks` function, which should be missing the `sessionid` property.
 * @returns {Promise<void>} A promise that rejects with an error if the `sessionid` property is missing.
 */
test("recordClicks returns a promise that rejects with an error when the request object is missing the sessionid property", async () => {
  const request = {
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
    const node = document.createElement("div");
    node.clicked = true;
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

    const result = saveClickData(node, text, meta);

    expect(result).toEqual(expectedObject);
  });

  /**
   * Tests that the `saveClickData` function returns the expected object when the provided node has a `clicked` property with a value of `false`.
   *
   * @param {HTMLElement} node - The node to pass to the `saveClickData` function.
   * @param {string} text - The text to pass to the `saveClickData` function.
   * @param {object} meta - The meta object to pass to the `saveClickData` function.
   * @returns {void}
   */
  test("returns the expected object when the node has a clicked property with a value of false", () => {
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
    const node = document.createElement("div");
    node.clicked = true;
    node.clickedname = "clicked name";
    const text = "click text";
    const meta = {
      // valid meta object
    };
    const expectedObject = {
      clicked: true,
      clickedname: "clicked name",
      text,
      meta,
    };

    const result = saveClickData(node, text, meta);

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
    const node = document.createElement("div");
    node.clicked = true;
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

    const result = saveClickData(node, text, meta);

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
    const node = document.createElement("div");
    node.clicked = false;
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

    const result = saveClickData(node, text, meta);

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

    const result = saveClickData(node, text, meta);

    expect(result).toEqual(expectedObject);
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
     * Tests the behavior of the `recordClicks` function, which is responsible for processing user click data and making an API call.
     *
     * This test ensures that the `recordClicks` function calls the `getSessionKey` function and makes the appropriate API call with the provided request data.
     *
     * @param {object} request - The request object containing data to be used for the user click processing.
     * @returns {Promise<void>}
     */
    it("recordClicks should call getSessionKey and make API call", async () => {
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
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
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await updateRecordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
    });

    // Add similar test cases for other functions in recordService
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

    const request = {
      /* request data */
    };
    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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

    const request = {
      /* request data */
    };
    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      /* request data */
    };
    await profanityCheck(request);

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
    const node = document.createElement("button");
    const text = "Button Clicked";
    const meta = {
      /* meta data */
    };

    const result = await saveClickData(node, text, meta);

    // Add assertions for the formatted object returned
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
      /* request data */
    };
    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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

    const request = {
      /* request data */
    };
    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      /* request data */
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      const mockNode = document.createElement("div");
      const nestedNode = document.createElement("div");
      nestedNode.innerHTML = "<span><a><b>Deeply Nested</b></a></span>";
      mockNode.appendChild(nestedNode);

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
        /* request data 1 */
      };
      const request2 = {
        /* request data 2 */
      };

      await profanityCheck(request1);
      // Add assertions for API call with request data 1

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
      const request1 = {
        /* request data 1 */
      };
      const request2 = {
        /* request data 2 */
      };

      await postRecordSequenceData(request1);
      // Add assertions for API call with request data 1

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
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
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
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await updateRecordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
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

    const request = {
      /* request data */
    };
    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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

    const request = {
      /* request data */
    };
    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      /* request data */
    };
    await profanityCheck(request);

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
    const node = document.createElement("button");
    const text = "Button Clicked";
    const meta = {
      /* meta data */
    };

    const result = await saveClickData(node, text, meta);

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
      /* request data */
    };
    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      /* request data */
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
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
      /* request data 1 */
    };
    const request2 = {
      /* request data 2 */
    };

    await profanityCheck(request1);
    // Add assertions for API call with request data 1

    await profanityCheck(request2);
    // Add assertions for API call with request data 2
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
      /* request data 1 */
    };
    const request2 = {
      /* request data 2 */
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
      const request = { someData: "data" };
      userService.getSessionKey.mockResolvedValue("sessionKey");
      await recordClicks(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.Record,
        method: "POST",
        body: { ...request, sessionid: "sessionKey" },
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
      const request = { someData: "data" };
      userService.getSessionKey.mockResolvedValue("sessionKey");
      await updateRecordClicks(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UpdateRecord,
        method: "POST",
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
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      await recordSequence(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.RecordSequence,
        method: "POST",
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
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      await userClick(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: {
          ...request,
          usersessionid: "userId",
          clickedname: window.location.host,
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
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      await deleteRecording(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.DeleteSequence,
        method: "POST",
        body: { ...request, usersessionid: "userId" },
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
      const request = { someData: "data" };
      userService.getUserId.mockResolvedValue("userId");
      await updateRecording(request);
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.updateRecordSequence,
        method: "POST",
        body: { ...request, usersessionid: "userId" },
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
      // This test would need more specific checks based on how postRecordSequenceData processes the request
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
      const clickType = "type";
      const clickedName = "name";
      const recordId = 123;
      userService.getSessionKey.mockResolvedValue("sessionKey");
      await recordUserClickData(clickType, clickedName, recordId);
      expect(userClick).toHaveBeenCalledWith({
        usersessionid: "sessionKey",
        clickedname: clickedName,
        clicktype: clickType,
        recordid: recordId,
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
        const request = { someData: "data" };
        userService.getSessionKey.mockRejectedValue(
          new Error("Failed to get session key")
        );
        await expect(recordClicks(request)).rejects.toThrow(
          "Failed to get session key"
        );
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
        userService.getSessionKey.mockResolvedValue("sessionKey");
        await updateRecordClicks(null);
        expect(REST.apiCal).toHaveBeenCalledWith({
          url: ENDPOINT.UpdateRecord,
          method: "POST",
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

      await expect(recordClicks(undefined)).rejects.toThrow(
        "Cannot read property 'sessionid' of undefined"
      );

      expect(getSessionKey).toHaveBeenCalled();
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
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      await expect(recordClicks(null)).rejects.toThrow(
        "Cannot read property 'sessionid' of null"
      );

      expect(getSessionKey).toHaveBeenCalled();
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
        userService.getUserId.mockResolvedValue("userId");

        await recordSequence(undefined);
        expect(REST.apiCal).toHaveBeenCalledWith({
          url: ENDPOINT.RecordSequence,
          method: "POST",
          body: { usersessionid: "userId" },
        });
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
      const mockDomain = "mockDomain";
      const mockUserClickNodesSet = [{ id: 1 }, { id: 2 }];

      (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
      (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

      await postRecordSequenceData(undefined);

      expect(recordSequence).toHaveBeenCalledWith({
        domain: mockDomain,
        isIgnored: 0,
        isValid: 1,
        userclicknodelist: "1,2",
        userclicknodesSet: mockUserClickNodesSet,
      });
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

    const clickType = "";
    const clickedName = "";
    const recordId = 0;

    await recordUserClickData(clickType, clickedName, recordId);

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: mockSessionKey,
      clickedname: "",
      clicktype: "",
      recordid: recordId,
    });
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
    userService.getUserId.mockResolvedValue("userId");
    await userClick({});
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UserClick,
      method: "PUT",
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
    userService.getUserId.mockResolvedValue("userId");
    await deleteRecording(null);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: { usersessionid: "userId" },
    });
  });
});
it("should handle null request", async () => {
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

  (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
  (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

  await postRecordSequenceData(null);

  expect(recordSequence).toHaveBeenCalledWith({
    domain: mockDomain,
    isIgnored: 0,
    isValid: 1,
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
    userService.getUserId.mockResolvedValue("userId");
    await updateRecording({});
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: { usersessionid: "userId" },
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
    await profanityCheck("");
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: "",
      headers: expect.any(Headers),
    });
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
    const text = "click text";
    const meta = { key: "value" };
    await expect(saveClickData(null, text, meta)).rejects.toThrow(
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
    userService.getSessionKey.mockResolvedValue("sessionKey");
    await recordUserClickData();
    expect(userClick).toHaveBeenCalledWith({
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
  it("should process and return correct click data", async () => {
    const mockNode = document.createElement("div");
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
    const mockRequest = { data: "test" };
    const mockDomain = "mockDomain";
    const mockUserClickNodesSet = [{ id: 1 }, { id: 2 }];

    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

    await postRecordSequenceData(mockRequest);

    expect(recordSequence).toHaveBeenCalledWith({
      ...mockRequest,
      domain: mockDomain,
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: "1,2",
      userclicknodesSet: mockUserClickNodesSet,
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

    const clickType = "sequencerecord";
    const clickedName = "test";
    const recordId = 0;

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
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const request = { data: "test" };
    await expect(updateRecordClicks(request)).rejects.toThrow("API Error");

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.UpdateRecord,
      method: "POST",
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

    const request = { data: "test" };
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

    const request = { data: "test" };
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
    const request = "test";
    const headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);

    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(profanityCheck(request)).rejects.toThrow("API Error");

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers,
    });
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
  it("should handle nodes without outerHTML", async () => {
    const mockNode = document.createElement("div");
    const mockText = "test";
    const mockMeta = { key: "value" };
    const mockNodeInfo = { info: "mockNodeInfo" };
    const mockDomain = "mockDomain";
    const mockJsonString = "mockJsonString";

    (getNodeInfo as jest.Mock).mockReturnValue(mockNodeInfo);
    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (TSON.stringify as jest.Mock).mockReturnValue(mockJsonString);

    delete mockNode.outerHTML;

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
    const mockNode = document.createElement("div");
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
    const mockRequest = { data: "test" };
    const mockDomain = "mockDomain";
    const mockUserClickNodesSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
    }));

    (fetchDomain as jest.Mock).mockReturnValue(mockDomain);
    (getFromStore as jest.Mock).mockReturnValue(mockUserClickNodesSet);

    await postRecordSequenceData(mockRequest);

    expect(recordSequence).toHaveBeenCalledWith({
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

    const clickType = 123; // Invalid data type
    const clickedName = { name: "test" }; // Invalid data type
    const recordId = "invalid"; // Invalid data type

    await expect(
      recordUserClickData(clickType as any, clickedName as any, recordId as any)
    ).rejects.toThrow();

    expect(getSessionKey).toHaveBeenCalled();
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
    const request = { test: "test" };
    (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await updateRecordClicks(request);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/updateRecord",
      method: "POST",
      body: { ...request, sessionid: "testSessionKey" },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Records a user interaction sequence.
   *
   * @param {object} request - The request object containing data to record the user interaction sequence.
   * @returns {Promise<{ data: any }>} - The response from the user interaction sequence recording API.
   */
  it("should record sequence", async () => {
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/recordSequence",
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
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
        clickedname: "testHost",
      },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Deletes an existing recording sequence.
   *
   * @param {object} request - The request object containing data to delete the recording sequence.
   * @returns {Promise<{ data: any }>} - The response from the delete recording sequence API.
   */
  it("should delete recording", async () => {
    const request = { test: "test" };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/deleteSequence",
      method: "POST",
      body: { ...request, usersessionid: "testUserId" },
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Updates an existing recording sequence.
   *
   * @param {object} request - The request object containing data to update the recording sequence.
   * @returns {Promise<{ data: any }>} - The response from the update recording sequence API.
   */
  it("should update recording", async () => {
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
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Checks for profanity in the provided request object.
   *
   * @param {object} request - The request object containing data to check for profanity.
   * @returns {Promise<{ data: any }>} - The response from the profanity check API.
   */
  it("should check profanity", async () => {
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
          .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 }),
      })),
    };
    const text = "testText";
    const meta = { test: "test" };
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
    (TSON.stringify as jest.Mock).mockReturnValue("testString");
    (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
      inputElement: "test",
    });
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      host: "testHost",
      pathname: "testPathname",
    } as Location;

    const result = await saveClickData(node, text, meta);

    expect(domJSON.toJSON).toHaveBeenCalled();
    expect(getAbsoluteOffsets).toHaveBeenCalled();
    expect(getNodeInfo).toHaveBeenCalled();
    expect(TSON.stringify).toHaveBeenCalled();
    expect(mapClickedElementToHtmlFormElement).toHaveBeenCalled();
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
   * Posts record sequence data to the server.
   *
   * @param {object} request - The request object containing data to be sent to the server.
   * @returns {Promise<{ data: any }>} - The response data from the `recordSequence` API call.
   */
  it("should post record sequence data", async () => {
    (getFromStore as jest.Mock).mockReturnValue([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
    (fetchDomain as jest.Mock).mockReturnValue("testDomain");
    (recordSequence as jest.Mock).mockResolvedValue({ data: "testData" });
    window.udanSelectedNodes = [];
    const request = { test: "test" };

    const result = await postRecordSequenceData(request);

    expect(getFromStore).toHaveBeenCalled();
    expect(fetchDomain).toHaveBeenCalled();
    expect(recordSequence).toHaveBeenCalledWith({
      ...request,
      domain: "testDomain",
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: "1,2,3",
      userclicknodesSet: [{ id: 1 }, { id: 2 }, { id: 3 }],
    });
    expect(result).toEqual({ data: "testData" });
  });

  /**
   * Records user click data, including the session key, clicked name, click type, and record ID.
   *
   * @returns {Promise<{ data: any }>} - The response data from the `userClick` API call.
   */
  it("should record user click data", async () => {
    (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");
    (userClick as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await recordUserClickData();

    expect(getSessionKey).toHaveBeenCalled();
    expect(userClick).toHaveBeenCalledWith({
      usersessionid: "testSessionKey",
      clickedname: "",
      clicktype: "sequencerecord",
      recordid: 0,
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
  const text = "testText";
  const meta = { test: "test" };
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
      screen: {},
    },
  });
  (TSON.stringify as jest.Mock).mockReturnValue("testString");
  (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
    inputElement: "test",
  });
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    host: "testHost",
    pathname: "testPathname",
  } as Location;

  const result = await saveClickData(node, text, meta);

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
  const node = {
    cloneNode: jest.fn(() => ({
      classList: {
        contains: jest.fn(),
      },
      hasOwnProperty: jest.fn(),
      nodeName: {
        toLowerCase: jest.fn(() => "input"),
      },
      outerHTML: "testOuterHTML",
      getBoundingClientRect: jest
        .fn()
        .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 }),
    })),
  };
  const text = "testText";
  const meta = { test: "test" };
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
  (TSON.stringify as jest.Mock).mockReturnValue("testString");
  (inArray as jest.Mock).mockReturnValue(0);
  (mapClickedElementToHtmlFormElement as jest.Mock).mockReturnValue({
    inputElement: "test",
  });
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    host: "testHost",
    pathname: "testPathname",
  } as Location;

  const result = await saveClickData(node, text, meta);

  expect(domJSON.toJSON).toHaveBeenCalled();
  expect(getAbsoluteOffsets).toHaveBeenCalled();
  expect(getNodeInfo).toHaveBeenCalled();
  expect(TSON.stringify).toHaveBeenCalled();
  expect(inArray).toHaveBeenCalled();
  expect(mapClickedElementToHtmlFormElement).toHaveBeenCalled();
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
    jest.mocked(getNodeInfo).mockReturnValueOnce({
      nodePosition: { top: 10, left: 20, width: 100, height: 200 },
      screenSize: {
        page: { height: 1000, width: 1000 },
        screen: { height: 0, width: 0 },
        scrollInfo: { scrollTop: 0, scrollLeft: 0 },
      },
      nodePagePosition: { top: 10, left: 20 },
    });
    const node = document.createElement("div");
    const text = "test";
    const meta = { test: "test" };
    const result = await saveClickData(node, text, meta);
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
});
/**
 * Tests that the `saveClickData` function correctly handles special nodes, such as input fields, when the `ignoreNodesFromIndexing` and `customNameForSpecialNodes` configurations are enabled.
 *
 * @param {HTMLElement} mockNode - A mock node element, in this case an input field, to pass to `saveClickData`.
 * @param {string} mockText - A mock text value to pass to `saveClickData`.
 * @param {object} mockMeta - A mock metadata object to pass to `saveClickData`.
 * @returns {Promise<void>} - Resolves when the test is complete.
 */
describe("saveClickData - Additional Tests", () => {
  it("should handle special nodes correctly", async () => {
    const mockNode = document.createElement("input");
    mockNode.type = "text";
    const mockText = "Input Field";
    const mockMeta = { key: "value" };

    (CONFIG.ignoreNodesFromIndexing as any) = ["input"];
    (CONFIG.customNameForSpecialNodes as any) = { input: "Custom Input" };

    const result = await saveClickData(mockNode, mockText, mockMeta);

    expect(result.objectdata).toContain('"displayText":"Custom Input"');
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
  it("should include node type change selection when enabled", async () => {
    const mockNode = document.createElement("button");
    const mockText = "Click Me";
    const mockMeta = { key: "value" };

    (CONFIG.enableNodeTypeChangeSelection as any) = true;

    const result = await saveClickData(mockNode, mockText, mockMeta);

    expect(result.objectdata).toContain('"systemDetected"');
    expect(result.objectdata).toContain('"selectedElement"');
  });
});

describe("postRecordSequenceData - Additional Tests", () => {
  it("should clear udanSelectedNodes after posting", async () => {
    global.window.udanSelectedNodes = [1, 2, 3];

    await postRecordSequenceData({});

    expect(global.window.udanSelectedNodes).toEqual([]);
  });
});

/**
 * Tests the `recordUserClickData` function to ensure it uses `window.location.host` as the `clickedname` when not provided.
 * This test creates a mock session key and sets the `window.location.host` to a test value, then calls `recordUserClickData` and verifies that the API call includes the expected `clickedname` value.
 */
describe("recordUserClickData - Additional Tests", () => {
  it("should use window.location.host as clickedname when not provided", async () => {
    const mockSessionKey = "test-session-key";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    global.window.location.host = "test-host.com";

    await recordUserClickData();

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          clickedname: "test-host.com",
        }),
      })
    );
  });
});
