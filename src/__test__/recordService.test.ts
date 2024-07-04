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
} from "../services/recordService";

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
test("recordClicks returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
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

test("recordSequence returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
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
test("userClick returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(userClick(request)).rejects.toThrow();
});
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
test("profanityCheck returns a promise that rejects with an error when an invalid request is passed", async () => {
  const request = {
    // invalid request object
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
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
test("recordClicks returns a promise that rejects with an error when the request object is missing the sessionid property", async () => {
  const request = {
    // valid request object without sessionid property
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
test("recordClicks returns a promise that rejects with an error when the request object has an invalid sessionid property", async () => {
  const request = {
    // valid request object with invalid sessionid property
  };

  await expect(recordClicks(request)).rejects.toThrow();
});
test("updateRecordClicks returns a promise that rejects with an error when the request object is missing the sessionid property", async () => {
  const request = {
    // valid request object without sessionid property
  };

  await expect(updateRecordClicks(request)).rejects.toThrow();
});
test("updateRecordClicks returns a promise that rejects with an error when the request object has an invalid sessionid property", async () => {
  const request = {
    // valid request object with invalid sessionid property
  };

  await expect(updateRecordClicks(request)).rejects.toThrow();
});
test("recordSequence returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // valid request object without usersessionid property
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
test("recordSequence returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
  };

  await expect(recordSequence(request)).rejects.toThrow();
});
test("userClick returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // valid request object without usersessionid property
  };

  await expect(userClick(request)).rejects.toThrow();
});
test("userClick returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
  };

  await expect(userClick(request)).rejects.toThrow();
});
test("deleteRecording returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // valid request object without usersessionid property
  };

  await expect(deleteRecording(request)).rejects.toThrow();
});
test("deleteRecording returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
  };

  await expect(deleteRecording(request)).rejects.toThrow();
});
test("updateRecording returns a promise that rejects with an error when the request object is missing the usersessionid property", async () => {
  const request = {
    // valid request object without usersessionid property
  };

  await expect(updateRecording(request)).rejects.toThrow();
});
test("updateRecording returns a promise that rejects with an error when the request object has an invalid usersessionid property", async () => {
  const request = {
    // valid request object with invalid usersessionid property
  };

  await expect(updateRecording(request)).rejects.toThrow();
});
test("profanityCheck returns a promise that rejects with an error when the request object is missing the Ocp-Apim-Subscription-Key header", async () => {
  const request = {
    // valid request object without Ocp-Apim-Subscription-Key header
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
test("profanityCheck returns a promise that rejects with an error when the request object has an invalid Ocp-Apim-Subscription-Key header", async () => {
  const request = {
    // valid request object with invalid Ocp-Apim-Subscription-Key header
  };

  await expect(profanityCheck(request)).rejects.toThrow();
});
describe("saveClickData", () => {
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
  describe("recordService functions", () => {
    beforeEach(() => {
      (getUserId as jest.Mock).mockClear();
      (getSessionKey as jest.Mock).mockClear();
    });

    it("recordClicks should call getSessionKey and make API call", async () => {
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
    });

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
  it("recordSequence should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("userClick should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("profanityCheck should make API call with correct headers", async () => {
    const request = {
      /* request data */
    };
    await profanityCheck(request);

    // Add assertions for API call with correct headers
  });
  it("saveClickData should process node data and return formatted object", async () => {
    const node = document.createElement("button");
    const text = "Button Clicked";
    const meta = {
      /* meta data */
    };

    const result = await saveClickData(node, text, meta);

    // Add assertions for the formatted object returned
  });
  it("postRecordSequenceData should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("deleteRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("updateRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
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

  describe("recordService functions", () => {
    beforeEach(() => {
      (getUserId as jest.Mock).mockClear();
      (getSessionKey as jest.Mock).mockClear();
    });

    it("recordClicks should call getSessionKey and make API call", async () => {
      (getSessionKey as jest.Mock).mockResolvedValue("testSessionKey");

      const request = {
        /* request data */
      };
      await recordClicks(request);

      expect(getSessionKey).toHaveBeenCalled();
      // Add assertions for API call
    });

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
  it("recordSequence should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await recordSequence(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("userClick should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await userClick(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("profanityCheck should make API call with correct headers", async () => {
    const request = {
      /* request data */
    };
    await profanityCheck(request);

    // Add assertions for API call with correct headers
  });
  it("saveClickData should process node data and return formatted object", async () => {
    const node = document.createElement("button");
    const text = "Button Clicked";
    const meta = {
      /* meta data */
    };

    const result = await saveClickData(node, text, meta);

    // Add assertions for the formatted object returned
  });
  it("postRecordSequenceData should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await postRecordSequenceData(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("deleteRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await deleteRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
  it("updateRecording should call getUserId and make API call", async () => {
    (getUserId as jest.Mock).mockResolvedValue("testUserId");

    const request = {
      /* request data */
    };
    await updateRecording(request);

    expect(getUserId).toHaveBeenCalled();
    // Add assertions for API call
  });
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

  describe("saveClickData", () => {
    it("should handle node processing and call REST.apiCal", async () => {
      const node = document.createElement("div");
      const text = "click text";
      const meta = { key: "value" };
      await saveClickData(node, text, meta);
      // This test would need more specific checks based on how saveClickData processes the node
    });
  });

  describe("postRecordSequenceData", () => {
    it("should prepare data and call recordSequence", async () => {
      const request = { someData: "data" };
      await postRecordSequenceData(request);
      // This test would need more specific checks based on how postRecordSequenceData processes the request
    });
  });

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
    it("should handle undefined input gracefully", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      await expect(recordClicks(undefined)).rejects.toThrow(
        "Cannot read property 'sessionid' of undefined"
      );

      expect(getSessionKey).toHaveBeenCalled();
    });
  });
  describe("recordClicks", () => {
    it("should handle null input gracefully", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      await expect(recordClicks(null)).rejects.toThrow(
        "Cannot read property 'sessionid' of null"
      );

      expect(getSessionKey).toHaveBeenCalled();
    });
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

describe("saveClickData", () => {
  it("should handle null node", async () => {
    const text = "click text";
    const meta = { key: "value" };
    await expect(saveClickData(null, text, meta)).rejects.toThrow(
      "Node is null"
    );
  });
});

describe("postRecordSequenceData", () => {
  it("should handle empty request", async () => {
    await postRecordSequenceData({});
    // This test would need more specific checks based on how postRecordSequenceData processes the request
  });
});

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

describe("fetchDomain", () => {
  it("should return the correct domain", () => {
    const mockUrl = "https://example.com/path?query=value";
    expect(fetchDomain(mockUrl)).toBe("example.com");
  });

  it("should handle null or undefined URL", () => {
    expect(fetchDomain(null)).toBeNull();
    expect(fetchDomain(undefined)).toBeNull();
  });

  it("should handle empty URL", () => {
    expect(fetchDomain("")).toBeNull();
  });

  it("should handle URLs without a domain", () => {
    const mockUrl = "/path?query=value";
    expect(fetchDomain(mockUrl)).toBeNull();
  });
});

describe("getFromStore", () => {
  it("should return the value from the store", () => {
    const mockStore = { key: "value" };
    expect(getFromStore(mockStore, "key")).toBe("value");
  });

  it("should return null for non-existent keys", () => {
    const mockStore = { key: "value" };
    expect(getFromStore(mockStore, "nonExistentKey")).toBeNull();
  });

  it("should handle null or undefined store", () => {
    expect(getFromStore(null, "key")).toBeNull();
    expect(getFromStore(undefined, "key")).toBeNull();
  });
});
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
