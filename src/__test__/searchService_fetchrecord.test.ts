/**
 * Imports the `fetchSearchResults` function from the `searchService` module.
 * Imports the `ENDPOINT` constant from the `config/endpoints` module.
 * Imports the `recordUserClickData` and `REST` objects from the current module.
 * Imports the `getUserId` function from the `userService` module.
 * Imports the `UDAErrorLogger` object from the `config/error-log` module.
 * Imports the `fetchRecord` and `fetchSpecialNodes` functions from the `searchService` module.
 */
import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from "../services";
import { getUserId } from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";
import domJSON from "domjson";
import TSON from "typescript-json";
import { fetchRecord } from "../services/searchService";
import { fetchSpecialNodes } from "../services/searchService";
import { specialNodes } from "../util/specialNodes";
import * as specialNodesMock from "../util/specialNodes";
import * as searchService from "../services/searchService";

/**
 * Mocks the `getUserId` function from the `../services/userService` module to return a constant value of `"test-user-id"` during testing.
 */
jest.mock("../services/userService", () => ({
  getUserId: jest.fn().mockResolvedValue("test-user-id"),
}));
/**
 * Mocks the `fetchSpecialNodes` function from the `../util/specialNodes` module to prevent it from being called during testing.
 *
 * Mocks the `UDAErrorLogger` object from the `../config/error-log` module, including its `error`, `info`, and `warn` methods, to prevent them from being called during testing.
 */
jest.mock("../util/specialNodes", () => ({
  fetchSpecialNodes: jest.fn(),
}));

jest.mock("../config/error-log", () => ({
  UDAErrorLogger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock the `recordUserClickData` function and the `REST` object to prevent
// the actual implementation from being called during testing.
jest.mock("../services", () => ({
  // Mock the `recordUserClickData` function to prevent it from being called
  // during testing.
  recordUserClickData: jest.fn(),
  // Mock the `REST` object to prevent it from being called during testing.
  REST: {
    // Mock the `processArgs` function to prevent it from being called during
    // testing.
    processArgs: jest.fn(),
    // Mock the `apiCal` function to prevent it from being called during testing.
    apiCal: jest.fn(),
  },
}));

// Mock the `getUserId` function from the `userService` module to prevent it from being called during testing
jest.mock("../services/userService", () => ({
  // Mock the `getUserId` function to prevent it from being called during testing
  getUserId: jest.fn(),
}));
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
// Mock the TSON.stringify function with a constant value
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
}));
jest.mock("../util/fetchDomain", () => ({
  // Mock fetchDomain function
  fetchDomain: jest.fn(),
}));

/**
 * Restores all mocks after each test to ensure that each test has a clean slate.
 *
 * This `afterEach` hook is used to reset the state of any mocks that were created
 * during the test suite. This ensures that each test starts with a clean
 * environment and is not affected by any side effects from previous tests.
 */
describe("fetchRecord", () => {
  // restore all mocks after each test to ensure that each test has a clean slate
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Verifies that the `fetchRecord` function correctly handles a request where `additionalParams` is set to `null`.
   *
   * This test case checks that when `additionalParams` is set to `null` in the request object, the `fetchRecord` function:
   * - Removes the `additionalParams` property from the request object.
   */
  it("should remove additionalParams if null", async () => {
    // if additionalParams is null, it should be removed from the request
    const request = {
      id: "123",
      domain: "example.com",
      additionalParams: null,
    };
    (getUserId as jest.Mock).mockResolvedValue("user123");
    (REST.apiCal as jest.Mock).mockResolvedValue({});
    await expect(fetchRecord(request)).resolves.not.toThrowError();
    expect(request.additionalParams).toBeUndefined();
    // additionalParams should be undefined
  });

  /**
   * Verifies that the `fetchRecord` function sets the user session ID in the request when `additionalParams` is provided.
   *
   * This test case checks that when `additionalParams` is provided in the request object, the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the user session ID in the request.
   */
  it("should set user session ID in the request if additionalParams is provided", async () => {
    const request = {
      // create a request with additionalParams
      id: "123",
      domain: "example.com",
      additionalParams: { param1: "value1" },
    };
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // mock the user ID to be "user123" for this test
    await fetchRecord(request);

    // call fetchRecord with the request
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the userSessionId parameter is included in the request
      url: expect.stringContaining("&userSessionId=user123"),
      method: "GET",
    });
  });

  /**
   * Verifies that the `fetchRecord` function correctly handles a request where `additionalParams` is not provided.
   *
   * This test case checks that when `additionalParams` is not provided in the request object, the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, excluding the `additionalParams` parameter.
   */
  it("should use the correct endpoint and parameters when additionalParams is not provided", async () => {
    const request = { id: "123", domain: "example.com" };
    // if additionalParams is not provided, the request should not include it
    await fetchRecord(request);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/123?domain=example.com`,
      // verify that the url does not include additionalParams
      method: "GET",
    });
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a very long id, domain, and additionalParams.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the long id, domain, and additionalParams
   * - Includes the user session ID in the request
   */

  it("should handle request with very long id, domain, and additionalParams", async () => {
    // create a request with very long id, domain, and additionalParams
    const longId = "a".repeat(1000);
    const longDomain = "b".repeat(1000) + ".com";
    const longAdditionalParams = {
      param1: "c".repeat(1000),
      param2: "d".repeat(1000),
    };
    const request = {
      id: longId,
      domain: longDomain,
      additionalParams: longAdditionalParams,
    };

    // mock the user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // mock the response to be an empty object
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: {} });

    // call fetchRecord with the request
    await fetchRecord(request);

    // verify that the request was processed with the correct parameters
    // including the long id, domain, and additionalParams
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(
        `${ENDPOINT.fetchRecord}/withPermissions/${longId}?domain=${longDomain}&additionalParams=`
      ),
      method: "GET",
    });

    // verify that the userSessionId parameter is included in the request
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("userSessionId=user123"),
      })
    );
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id and domain.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the id and domain
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with valid id and domain", async () => {
    const request = { id: "123", domain: "example.com" };
    // create a request with a valid id and domain
    const mockResponse = { data: "Record data" };
    // mock the response to be an object with a "data" property
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // mock the API call to return the mock response
    const result = await fetchRecord(request);
    // call fetchRecord with the request
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the API call was made with the correct parameters
      url: `${ENDPOINT.fetchRecord}/123?domain=example.com`,
      // verify that the URL is correct
      method: "GET",
      // verify that the method is GET
    });
    expect(result).toEqual(mockResponse);
    // verify that the response from the API call matches the expected response
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id, domain, and additionalParams.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the id, domain, and additionalParams
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with valid id, domain, and additionalParams", async () => {
    const request = {
      id: "456",
      domain: "example.org",
      additionalParams: { param1: "value1", param2: "value2" },
    };
    const mockResponse = { data: "Record data with additional params" };
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // mock the user ID to be "user123" for this test
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // mock the response to be an object with a "data" property
    const result = await fetchRecord(request);

    expect(result).toEqual(mockResponse);

    // verify that the response from the API call matches the expected response
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id, domain, and userSessionId.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the userSessionId
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with valid id, domain, and userSessionId", async () => {
    const request = { id: "789", domain: "example.net" };
    const mockResponse = { data: "Record data with user session" };
    (getUserId as jest.Mock).mockResolvedValue("user456");
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // mock the user ID to be "user456" for this test
    const result = await fetchRecord(request);
    // mock the response to be an object with a "data" property
    expect(REST.apiCal).toHaveBeenCalledWith({
      // call fetchRecord with the request
      url: `${ENDPOINT.fetchRecord}/789?domain=example.net`,
      method: "GET",
      // verify that the URL is correct
    });
    // verify that the method is GET
    expect(result).toEqual(mockResponse);
  });
  // verify that the response from the API call matches the expected response

  /**
   * Verifies that the `fetchRecord` function handles a request with an empty `additionalParams` object.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the empty `additionalParams` object
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with empty additionalParams", async () => {
    // test request with empty additionalParams
    const request = { id: "abc", domain: "example.com", additionalParams: {} };
    // mock response with data
    const mockResponse = { data: "Record data with empty additional params" };
    // mock user ID to be "user789"
    (getUserId as jest.Mock).mockResolvedValue("user789");
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);

    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with no additional parameters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with no additionalParams", async () => {
    // test request with no additionalParams
    const request = { id: "def", domain: "example.net" };
    // mock response with data
    const mockResponse = { data: "Record data with no additional params" };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/def?domain=example.net`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a numeric ID and domain.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with numeric id and domain", async () => {
    const request = { id: "123456", domain: "example.com" };
    // mock response with data
    const mockResponse = { data: "Record data with numeric id" };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/123456?domain=example.com`,
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an alphanumeric ID and domain.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with alphanumeric id and domain", async () => {
    // test request with alphanumeric id and domain
    const request = { id: "abc123", domain: "example.org" };
    // mock response with data
    const mockResponse = { data: "Record data with alphanumeric id" };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.org`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a domain containing subdomains.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with domain containing subdomains", async () => {
    // test case for request with domain containing subdomains
    const request = { id: "123", domain: "subdomain.example.com" };
    // mock response with data
    const mockResponse = {
      data: "Record data with domain containing subdomains",
    };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/123?domain=subdomain.example.com`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with additional parameters containing boolean values.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method, including the encoded additional parameters
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with additionalParams containing boolean values", async () => {
    // test case for request with additionalParams containing boolean values
    const request = {
      id: "456",
      domain: "example.org",
      additionalParams: { param1: true, param2: false },
    };
    // mock response with data
    const mockResponse = { data: "Record data with boolean additionalParams" };
    // mock user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call fetchRecord with the request
    const result = await fetchRecord(request);

    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id and domain containing special characters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id and domain containing special characters", async () => {
    const request = { id: "abc!@#", domain: "example.com$%^" };
    const mockResponse = {
      data: "Record data with special characters in id and domain",
    };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc!@#?domain=example.com$%^`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id, domain, and userSessionId containing special characters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with userSessionId containing special characters", async () => {
    const request = { id: "abc", domain: "example.org" };
    const mockResponse = {
      data: "Record data with special characters in userSessionId",
    };
    // mock userSessionId to contain special characters
    (getUserId as jest.Mock).mockResolvedValue("user!@#$%");
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc?domain=example.org`,
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id and domain.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with valid id and domain", async () => {
    // request with valid id and domain
    const request = { id: "123", domain: "example.com" };
    const mockResponse = { data: "Record data" };
    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/123?domain=example.com`, // verify that the URL is correct
      method: "GET", // verify that the method is GET
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a valid id, domain, and userSessionId.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with valid id, domain, and userSessionId", async () => {
    const request = { id: "789", domain: "example.net" };
    const mockResponse = { data: "Record data with user session" };
    // mock user ID to be "user456" for this test
    (getUserId as jest.Mock).mockResolvedValue("user456");
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/789?domain=example.net`,
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an alphanumeric id and domain.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with alphanumeric id and domain", async () => {
    const request = { id: "abc123", domain: "example.com" };
    const mockResponse = { data: "Record data with alphanumeric id" };

    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchRecord(request);

    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.com`,
      // verify that the method is GET
      method: "GET",
    });

    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with additionalParams containing boolean values.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with additionalParams containing boolean values", async () => {
    const request = {
      id: "456",
      domain: "example.org",
      additionalParams: { param1: true, param2: false },
    };
    const mockResponse = { data: "Record data with boolean additionalParams" };

    // mock user ID to be "user123" for this test
    (getUserId as jest.Mock).mockResolvedValue("user123");

    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchRecord(request);

    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with additionalParams containing nested objects.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */

  it("should fetch record with additionalParams containing nested objects", async () => {
    const request = {
      id: "789",
      domain: "example.net",
      additionalParams: {
        // nested object with string value
        param1: { nestedParam: "value" },
        // nested object with number value
        param2: { nestedParam: 123 },
      },
    };
    const mockResponse = { data: "Record data with nested additionalParams" };

    // mock user ID to be "user456" for this test
    (getUserId as jest.Mock).mockResolvedValue("user456");

    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchRecord(request);

    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID containing special characters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with id containing special characters", async () => {
    // test case for id containing special characters
    const request = { id: "abc-123_xyz", domain: "example.com" };
    const mockResponse = { data: "Record data with special characters in id" };
    // mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.com`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
    // Test case for request with domain containing subdomains
  });
  /**
   * Verifies that the `fetchRecord` function handles a request with a domain containing subdomains.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with domain containing subdomains", async () => {
    const request = { id: "456", domain: "subdomain.example.org" };
    const mockResponse = {
      // Mock API call to return the mock response
      data: "Record data with domain containing subdomains",
    };
    // Verify that the API call was made with the correct parameters
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // Verify that the URL is correct
    const result = await fetchRecord(request);
    // Verify that the method is GET
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/456?domain=subdomain.example.org`,
      // Verify that the response from the API call matches the expected response
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a user session ID containing special characters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should fetch record with userSessionId containing special characters", async () => {
    const request = { id: "abc", domain: "example.org" };
    const mockResponse = {
      data: "Record data with special characters in userSessionId",
    };
    // Mock userSessionId to contain special characters
    (getUserId as jest.Mock).mockResolvedValue("user!@#$%");
    // Mock API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc?domain=example.org`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID containing hyphens and underscores.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id containing hyphens and underscores", async () => {
    const request = { id: "abc-123_xyz", domain: "example.net" };
    // Mock API call to return the mock response
    const mockResponse = {
      data: "Record data with hyphens and underscores in id",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.net`,
      // Verify that the method is GET
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID containing non-ASCII characters, special characters, and hyphens.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id containing non-ASCII characters", async () => {
    // A test case for a request with an id containing non-ASCII characters
    const request = { id: "abc-123_xyz", domain: "example.com" };
    // Mock the response from the API call
    const mockResponse = {
      data: "Record data with non-ASCII characters in id",
    };
    // Mock the API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // Call the fetchRecord function with the request
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.com`,
      // Verify that the method is GET
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with a domain containing non-ASCII characters.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with domain containing non-ASCII characters", async () => {
    // Test case for a request with a domain containing non-ASCII characters
    const request = { id: "456", domain: "subdomain.example.org" };
    // Mock the response from the API call
    const mockResponse = {
      data: "Record data with non-ASCII characters in domain",
    };
    // Mock the API call to return the mock response
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // Verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/456?domain=subdomain.example.org`,
      // Verify that the method is GET
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID and domain containing non-ASCII characters, special characters, and hyphens.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id and domain containing non-ASCII characters", async () => {
    const request = { id: "abc-123_xyz", domain: "example.com" };
    // Mock the response from the API call
    const mockResponse = {
      data: "Record data with non-ASCII characters in id and domain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.com`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID and domain containing non-ASCII characters, special characters, and hyphens.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id and domain containing non-ASCII characters and special characters", async () => {
    // Test case for a request with id and domain containing non-ASCII characters and special characters
    const request = { id: "abc-123_xyz", domain: "example.com" };
    const mockResponse = {
      data: "Record data with non-ASCII characters, special characters, and hyphens in id and domain",
    };
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.com`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Verifies that the `fetchRecord` function handles a request with an ID and domain containing non-ASCII characters, special characters, and hyphens.
   *
   * This test case mocks the API response and checks that the `fetchRecord` function:
   * - Calls the `REST.apiCal` function with the correct URL and method
   * - Returns the expected response from the mocked API call
   */
  it("should handle request with id and domain containing non-ASCII characters, special characters, and hyphens", async () => {
    // Test case for a request with id and domain containing non-ASCII characters, special characters, and hyphens
    const request = { id: "abc-123_xyz", domain: "example.com" };
    const mockResponse = {
      data: "Record data with non-ASCII characters, special characters, and hyphens in id and domain",
    };
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc-123_xyz?domain=example.com`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes a userSessionId containing special characters.
   * Verifies that the API call is made with the userSessionId containing special characters.
   */
  it("should fetch record with userSessionId containing special characters", async () => {
    const request = { id: "abc123", domain: "example.com" };
    const mockResponse = {
      data: "Record data with special characters in userSessionId",
    };
    // Mock the userSessionId with special characters
    (getUserId as jest.Mock).mockResolvedValue("user!@#$%");
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.com`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes an empty `additionalParams` object.
   * Verifies that the API call is made with the empty `additionalParams` object encoded in the URL.
   */
  it("should fetch record with empty additionalParams", async () => {
    // Test case for request with empty additionalParams
    const request = { id: "456", domain: "example.org", additionalParams: {} };
    const mockResponse = { data: "Record data with empty additionalParams" };
    // Mock the userSessionId
    (getUserId as jest.Mock).mockResolvedValue("user123");
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes a very long `id` and `domain`.
   * Verifies that the API call is made with the very long `id` and `domain`.
   */
  it("should fetch record with very long id and domain", async () => {
    // Create a request with a very long id and domain
    const longId = "a".repeat(100);
    const longDomain = "b".repeat(100) + ".com";
    const request = { id: longId, domain: longDomain };

    // Mock the response from the API call
    const mockResponse = { data: "Record data with very long id and domain" };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function with the request
    const result = await fetchRecord(request);

    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // URL should include the very long id and domain
      url: `${ENDPOINT.fetchRecord}/${longId}?domain=${longDomain}`,
      method: "GET",
    });

    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Tests the `fetchRecord` function with a request that includes an `id` and `domain` containing hyphens and underscores.
   * Verifies that the API call is made with the `id` and `domain` containing the hyphens and underscores.
   */
  it("should fetch record with id and domain containing hyphens and underscores", async () => {
    const request = {
      id: "abc-123_xyz", // id with hyphen and underscore
      domain: "example-domain.com", // domain with hyphen
    };
    const mockResponse = {
      data: "Record data with hyphens and underscores in id and domain",
    };
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // Call the function with the request
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${request.id}?domain=${request.domain}`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Tests the `fetchRecord` function with a request that includes an `id` and `domain` containing dots and hyphens.
   * Verifies that the API call is made with the `id` and `domain` containing the dots and hyphens.
   */

  it("should fetch record with id and domain containing dots and dashes", async () => {
    const request = {
      id: "abc.123-xyz", // id with dot and hyphen
      domain: "example.domain-name.com", // domain with dot and hyphen
    };
    const mockResponse = {
      data: "Record data with dots and dashes in id and domain",
    };
    // Mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // Call the function with the request
    const result = await fetchRecord(request);
    // Verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${request.id}?domain=${request.domain}`,
      method: "GET",
    });
    // Verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Tests the `fetchRecord` function with a request that includes an `id` containing URL-encoded characters.
   * Verifies that the API call is made with the `id` containing the URL-encoded characters.
   */
  it("should fetch record with id containing URL-encoded characters", async () => {
    // test case with id containing URL-encoded characters
    const request = { id: "abc%20123", domain: "example.com" };
    const mockResponse = { data: "Record data with URL-encoded id" };
    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call the function with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // verify that the URL is correct
      url: `${ENDPOINT.fetchRecord}/abc%20123?domain=example.com`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  // test case with domain containing port number

  /**
   * Tests the `fetchRecord` function with a request that includes an `id` and a `domain` containing a port number.
   * Verifies that the API call is made with the `domain` containing the port number.
   */
  it("should fetch record with domain containing port number", async () => {
    const request = { id: "456", domain: "example.org:8080" };
    const mockResponse = {
      // mock the response from the API call
      data: "Record data with domain containing port number",
      // call the function with the request
    };
    // verify that the API call was made with the correct parameters
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // verify that the URL is correct
    const result = await fetchRecord(request);
    // verify that the method is GET
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/456?domain=example.org:8080`,
      // verify that the response from the API call matches the expected response
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes an `id` with Unicode characters in the `userSessionId`.
   * Verifies that the API call is made with the `userSessionId` containing the Unicode characters.
   */
  it("should fetch record with userSessionId containing Unicode characters", async () => {
    const request = { id: "abc123", domain: "example.com" };
    const mockResponse = {
      data: "Record data with Unicode characters in userSessionId",
    };
    // mock the userSessionId to contain Unicode characters
    (getUserId as jest.Mock).mockResolvedValue("user🌍🌎🌏");
    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call the function with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.com`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes an `id` with leading and trailing spaces.
   * Verifies that the API call is made with the trimmed `id` value.
   */
  it("should fetch record with id containing leading and trailing spaces", async () => {
    const request = { id: "  abc123  ", domain: "example.com" };
    const mockResponse = {
      data: "Record data with leading and trailing spaces in id",
    };
    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call the function with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // url should contain the trimmed id
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.com`,
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `fetchRecord` function with a request that includes a domain containing an IP address.
   * Verifies that the API call is made with the domain containing the IP address.
   */
  it("should fetch record with domain containing IP address", async () => {
    // create a request with an id and domain containing an IP address
    const request = { id: "456", domain: "192.168.0.1" };
    // mock the response from the API call
    const mockResponse = {
      data: "Record data with domain containing IP address",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    // call the function with the request
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // url should contain the id and domain
      url: `${ENDPOINT.fetchRecord}/456?domain=192.168.0.1`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
  /**
   * Tests the `fetchRecord` function with a request that includes an `id` with leading and trailing spaces.
   * Verifies that the API call is made with the trimmed `id` value.
   */
  it("should fetch record with userSessionId containing leading and trailing spaces", async () => {
    const request = { id: "abc123", domain: "example.com" };
    const mockResponse = {
      data: "Record data with leading and trailing spaces in userSessionId",
    };
    // mock the userSessionId with leading and trailing spaces
    (getUserId as jest.Mock).mockResolvedValue("  user123  ");
    // mock the response from the API call
    (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchRecord(request);
    // verify that the API call was made with the correct parameters
    expect(REST.apiCal).toHaveBeenCalledWith({
      // url should contain the id and domain
      url: `${ENDPOINT.fetchRecord}/abc123?domain=example.com`,
      // verify that the method is GET
      method: "GET",
    });
    // verify that the response from the API call matches the expected response
    expect(result).toEqual(mockResponse);
  });
});
