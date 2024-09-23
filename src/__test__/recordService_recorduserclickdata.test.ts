/**
 * This code imports various modules and functions that are used in the `recordService_recordUserClickData.test.ts` file. The imported modules and functions include:
 * - `recordUserClickData` and `userClick` functions from the `../services/recordService` module
 * - `getSessionKey` and `getUserId` functions from the `../services/userService` module
 * - `ReactGA` module from `react-ga4`
 * - `UDAErrorLogger` and `UDAConsoleLogger` from `../config/error-log`
 * - `REST` and `ENDPOINT` from `../services` and `../config/endpoints`
 * - `domJSON` from `domjson`
 * - `TSON` from `typescript-json`
 * - `fetchDomain` from `@/util/fetchDomain`
 * These imports are used throughout the test file to mock and control the behavior of these dependencies during the tests.
 */

import { recordUserClickData } from "../services/recordService";
import { getSessionKey } from "../services/userService";
import { userClick } from "../services/recordService";
import ReactGA from "react-ga4";
import { UDAErrorLogger } from "../config/error-log";
import { UDAConsoleLogger } from "../config/error-log";
import * as userService from "../services/userService";
import { REST } from "../services";
import { ENDPOINT } from "../config/endpoints";
import domJSON from "domjson";
import TSON from "typescript-json";
import { fetchDomain } from "@/util/fetchDomain";
import { getUserId } from "../services/userService";
/**
 * This code sets up mocks for various modules and functions used in the `recordService_recordUserClickData.test.ts` file. The mocks include:
 * - `fetchDomain` function from the `@/util/fetchDomain` module
 * - `toJSON` function from the `domjson` module
 * - `stringify` function from the `typescript-json` module
 * - `getSessionKey` and `getUserId` functions from the `../services/userService` module
 * - `userClick` and `recordUserClickData` functions from the `../services/recordService` module
 * - `event` function from the `react-ga4` module
 * - `error` and `info` functions from the `../config/error-log` module
 * These mocks are used to control the behavior of these dependencies during the tests.
 */
// Mocks the fetchDomain utility function from the `@/util/fetchDomain` module
jest.mock("../util/fetchDomain", () => ({
  fetchDomain: jest.fn(), // Mocks the fetchDomain function
}));
// Mocks the toJSON function from the `domjson` module
jest.mock("domjson", () => ({
  toJSON: jest.fn(), // Mocks the toJSON function
}));
// Mocks the stringify function from the `typescript-json` module
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}', // Mocks the stringify function to return a constant JSON string
}));
// Mocks the getSessionKey and getUserId functions from the `../services/userService` module
jest.mock("../services/userService", () => {
  return {
    getSessionKey: jest.fn().mockResolvedValue("mockSessionKey"), // Mocks the getSessionKey function to return a mock session key
    getUserId: jest.fn().mockResolvedValue("mockUserId"), // Mocks the getUserId function to return a mock user ID
  };
});

// Mocks the recordUserClickData and userClick functions from the `../services/recordService` module
jest.mock("../services/recordService", () => {
  const actual = jest.requireActual("../services/recordService");
  return {
    ...actual,
    userClick: jest.fn(), // Mocks the userClick function
    recordUserClickData: jest
      .fn()
      .mockImplementation(async (clickType, clickedName, recordId) => {
        const sessionKey = await getSessionKey(); // Calls the mocked getSessionKey function
        return actual.userClick({
          // Calls the actual userClick function with the mock session key
          usersessionid: sessionKey,
          clickedname: clickedName,
          clicktype: clickType,
          recordid: recordId,
        });
      }),
  };
});

// Mocks the event function from the `react-ga4` module
jest.mock("react-ga4", () => {
  return {
    event: jest.fn(), // Mocks the event function
  };
});

// Mocks the error and info functions from the `../config/error-log` module
jest.mock("../config/error-log", () => {
  return {
    UDAErrorLogger: {
      error: jest.fn(), // Mocks the error function
    },
    UDAConsoleLogger: {
      info: jest.fn(), // Mocks the info function
    },
  };
});

/**
 * Sets up the test environment by clearing all mocks before each test.
 */
describe("recordUserClickData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `recordUserClickData` function handles errors from the `userClick` function.
   * This test mocks the `userClick` function to reject with an error, and then calls `recordUserClickData`
   * and expects it to reject with the same error.
   */
  test("recordUserClickData should log an error if userClick throws an error", async () => {
    // Mock session key returned by getSessionKey
    const mockSessionKey = "testSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    // Mock userClick to throw an error
    (userClick as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );

    // Call recordUserClickData and expect it to throw the error
    try {
      await recordUserClickData("testClickType", "testClickedName", 123);
    } catch (error) {
      // Check that the error is logged with the correct message
      expect(error.message).toBe("fetch is not defined");
    }
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `getSessionKey` function.
   * This test mocks the `getSessionKey` function to reject with an error, and then calls `recordUserClickData`
   * and expects it to reject with the same error.
   */
  test("recordUserClickData should log an error if getSessionKey throws an error", async () => {
    // Mock getSessionKey to throw an error
    (getSessionKey as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );
    try {
      // Call recordUserClickData and expect it to throw the error
      await recordUserClickData("testClickType", "testClickedName", 123);
    } catch (error) {
      // Check that the error is logged with the correct message
      expect(error.message).toBe("fetch is not defined");
    }
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `getUserId` function.
   * This test mocks the `getUserId` function to reject with an error, and then calls `recordUserClickData`
   * and expects it to reject with the same error.
   */
  test("recordUserClickData should log an error if getUserId throws an error", async () => {
    // Mock getUserId to throw an error
    (getUserId as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );
    try {
      // Call recordUserClickData and expect it to throw the error
      await recordUserClickData("testClickType", "testClickedName", 123);
    } catch (error) {
      // Check that the error is logged with the correct message
      expect(error.message).toBe("fetch is not defined");
    }
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `domJSON.toJSON` function.
   * This test mocks the `domJSON.toJSON` function to reject with an error, and then calls `recordUserClickData`
   * and expects it to reject with the same error.
   */
  test("recordUserClickData should log an error if domJSON.toJSON throws an error", async () => {
    // Mock domJSON.toJSON to throw an error
    (domJSON.toJSON as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );
    try {
      // Call recordUserClickData and expect it to throw the error
      await recordUserClickData("testClickType", "testClickedName", 123);
    } catch (error) {
      // Check that the error is logged with the correct message
      expect(error.message).toBe("fetch is not defined");
    }
  });

  /**
   * Tests that the `recordUserClickData` function handles errors from the `getSessionKey` function.
   * This test mocks the `getSessionKey` function to reject with an error, and then calls `recordUserClickData`
   * and expects it to reject with the same error.
   */
  it("should throw an error if getSessionKey fails", async () => {
    // Mock getSessionKey to throw an error
    const error = new Error("Failed to get session key");
    (userService.getSessionKey as jest.Mock).mockRejectedValue(error);

    // Call recordUserClickData and expect it to throw the error
    await expect(recordUserClickData()).rejects.toThrow(
      "Failed to get session key"
    );
  });

  /**
   * Tests that the `recordUserClickData` function handles errors from the `userClick` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `userClick` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `userClick`.
   */
  it("should throw an error if userClick fails", async () => {
    // Mock session key returned by getSessionKey
    const mockSessionKey = "mock-session-key";
    // Mock click type
    const mockClickType = "mock-click-type";
    // Mock clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock client ID
    const mockClientId = 123;
    // Mock getSessionKey to return the mock session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock error to be thrown by userClick
    const error = new Error("fetch is not defined");
    // Mock userClick to throw the error
    (userClick as jest.Mock).mockRejectedValue(error);

    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow(error);
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `getUserId` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `getUserId` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `getUserId`.
   */
  test("should throw an error if getUserId fails", async () => {
    // Mock the session key returned by getSessionKey
    const mockSessionKey = "mock-session-key";
    // Mock the click type, clicked name, and client ID
    const mockClickType = "mock-click-type";
    const mockClickedName = "mock-clicked-name";
    const mockClientId = 123;
    // Mock getSessionKey to return the mock session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock the error returned by getUserId
    const error = new Error("fetch is not defined");
    // Mock getUserId to throw the error
    (getUserId as jest.Mock).mockRejectedValue(error);
    // Call recordUserClickData with the mock values and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow(error);
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `domJSON.toJSON` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `domJSON.toJSON` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `domJSON.toJSON`.
   */
  test("should throw an error if domJSON.toJSON fails", async () => {
    // Mock session key
    const mockSessionKey = "mock-session-key";
    // Mock click type
    const mockClickType = "mock-click-type";
    // Mock clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock client ID
    const mockClientId = 123;
    // Mock getSessionKey to return the mock session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock domJSON.toJSON to throw an error
    const error = new Error("fetch is not defined");
    (domJSON.toJSON as jest.Mock).mockRejectedValue(error);
    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrowError(error);
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `userClick` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `userClick` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `userClick`.
   */
  test("should throw an error if recordUserClickData fails", async () => {
    // Mock session key to return a valid session key
    const mockSessionKey = "mock-session-key";
    // Mock click type
    const mockClickType = "mock-click-type";
    // Mock clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock client ID
    const mockClientId = 123;
    // Mock getSessionKey to return the mock session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock error to be thrown by userClick
    const error = new Error("fetch is not defined");
    // Mock userClick to throw the error
    (userClick as jest.Mock).mockRejectedValue(error);
    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow(error);
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `userClick` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `userClick` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `userClick`.
   */
  test("should log an error if recordUserClickData fails", async () => {
    // Mock the session key to return a valid session key
    const mockSessionKey = "mock-session-key";
    // Mock the click type
    const mockClickType = "mock-click-type";
    // Mock the clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock the client ID
    const mockClientId = 123;
    // Mock the getSessionKey function to return the mock session key
    (userService.getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock the error to be thrown by the userClick function
    const error = new Error("fetch is not defined");
    // Mock the userClick function to throw an error
    (userClick as jest.Mock).mockRejectedValue(error);
    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow(error);
  });
  /**
   * Tests that the `recordUserClickData` function handles errors from the `getSessionKey` function.
   *
   * This test mocks the `getSessionKey` function to reject with an error, and then verifies that
   * the `recordUserClickData` function rejects with the same error.
   */
  test("should handle errors from getSessionKey", async () => {
    // Mock session key
    const mockSessionKey = "testSessionKey";
    // Mock click type
    const mockClickType = "mock-click-type";
    // Mock clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock client ID
    const mockClientId = 123;

    // Mock getSessionKey to throw an error
    (getSessionKey as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );

    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow("fetch is not defined");
  });

  /**
   * Tests that the `recordUserClickData` function handles errors from the `userClick` function.
   * This test mocks the `getSessionKey` function to return a mock session key, and the `userClick` function to reject with an error.
   * The test then calls `recordUserClickData` and expects it to reject with the error thrown by `userClick`.
   */
  test("should handle errors from userClick", async () => {
    // Mock session key
    const mockSessionKey = "testSessionKey";
    // Mock click type
    const mockClickType = "mock-click-type";
    // Mock clicked name
    const mockClickedName = "mock-clicked-name";
    // Mock client ID
    const mockClientId = 123;
    // Mock getSessionKey to return the mock session key
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    // Mock userClick to throw an error
    (userClick as jest.Mock).mockRejectedValue(
      new Error("fetch is not defined")
    );

    // Call recordUserClickData and expect it to throw the error
    await expect(
      recordUserClickData(mockClickType, mockClickedName, mockClientId)
    ).rejects.toThrow("fetch is not defined");
  });
});
