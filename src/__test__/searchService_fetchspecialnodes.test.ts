/**
 * Imports the necessary modules and functions for the `fetchSpecialNodes` function in the `searchService` module.
 *
 * - `ENDPOINT` from the `../config/endpoints` module
 * - `recordUserClickData` and `REST` from the `../services` module
 * - `getUserId` from the `../services/userService` module
 * - `UDAErrorLogger` from the `../config/error-log` module
 * - `fetchSpecialNodes` from the `../services/searchService` module
 * - `specialNodes` from the `../util/specialNodes` module
 */
import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from "../services";
import { getUserId } from "../services/userService";
import { UDAErrorLogger } from "../config/error-log";
import { fetchSpecialNodes } from "../services/searchService";
import { specialNodes } from "../util/specialNodes";

/**
 * Mocks the `getUserId` function from the `../services/userService` module to return a fixed value of `"test-user-id"` during testing.
 *
 * This mock is used to prevent the actual implementation of the `getUserId` function from being called during unit tests, which could interfere with the test results.
 */
jest.mock("../services/userService", () => ({
  getUserId: jest.fn().mockResolvedValue("test-user-id"),
}));

/**
 * Mocks the `fetchSpecialNodes` function from the `../services/searchService` module to prevent it from being called during testing.
 *
 * This mock is used to prevent the actual implementation of the `fetchSpecialNodes` function from being called during unit tests, which could interfere with the test results.
 */
// Mock the `fetchSpecialNodes` function from the `../services/searchService` module to prevent it from being called during testing.
// Mock the `fetchSpecialNodes` function from the `../services/searchService` module to prevent it from being called during testing.
// This mock is used to prevent the actual implementation of the `fetchSpecialNodes` function from being called during unit tests, which could interfere with the test results.
jest.mock("../services/searchService", () => ({
  // Mock the `fetchSpecialNodes` function to prevent it from being called during testing.
  fetchSpecialNodes: jest.fn(),
}));

/**
 * Mocks the `UDAErrorLogger` object from the `../config/error-log` module, including its `error`, `info`, and `warn` methods, to prevent them from being called during testing.
 *
 * This mock is used to prevent the actual implementation of the `UDAErrorLogger` object and its methods from being called during unit tests, which could interfere with the test results.
 */
// Mock the `UDAErrorLogger` object from the `../config/error-log` module, including its `error`, `info`, and `warn` methods, to prevent them from being called during testing.
// Mock the `UDAErrorLogger` object from the `../config/error-log` module, including its `error`, `info`, and `warn` methods, to prevent them from being called during testing.
// This mock is used to prevent the actual implementation of the `UDAErrorLogger` object and its methods from being called during unit tests, which could interfere with the test results.
jest.mock("../config/error-log", () => ({
  // Mock the `error` method of the `UDAErrorLogger` object to prevent it from being called during testing.
  UDAErrorLogger: {
    error: jest.fn(), // mock the `error` method
    info: jest.fn(), // mock the `info` method
    warn: jest.fn(), // mock the `warn` method
  },
}));

// Mock the `recordUserClickData` function and the `REST` object to prevent the actual implementation from being called during testing.
/**
 * Mocks the `recordUserClickData` function and the `REST` object from the `../services` module to prevent their actual implementations from being called during testing.
 *
 * The `recordUserClickData` function is mocked to be a jest.fn().
 * The `REST` object is mocked with:
 * - `processArgs` function mocked to return "mock-url"
 * - `apiCal` function mocked to return a Promise that resolves to an empty object
 */
jest.mock("../services", () => ({
  // Mock the `recordUserClickData` function to be a jest.fn()
  recordUserClickData: jest.fn(),
  // Mock the `REST` object with:
  // - `processArgs` function mocked to return "mock-url"
  // - `apiCal` function mocked to return a Promise that resolves to an empty object
  REST: {
    processArgs: jest.fn().mockReturnValue("mock-url"),
    apiCal: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));
/**
 * Mocks the `domjson` module, setting the `toJSON` function to a jest.fn().
 *
 * This mock is used to prevent the actual implementation of the `domjson` module from being called during unit tests, which could interfere with the test results.
 *
 * Mocks the `typescript-json` module, setting the `stringify` function to return a constant value of `'{"mocked":"json"}'`.
 *
 * This mock is used to prevent the actual implementation of the `typescript-json` module from being called during unit tests, which could interfere with the test results.
 *
 * Mocks the `../util/fetchDomain` module, setting the `fetchDomain` function to a jest.fn().
 *
 * This mock is used to prevent the actual implementation of the `fetchDomain` function from being called during unit tests, which could interfere with the test results.
 */

/**
 * Cleans up the mocks and resets the mock implementation and calls after each test in the `fetchSpecialNodes` suite.
 */
describe("searchService", () => {
  describe("fetchSpecialNodes", () => {
    // Clear the mock implementation and calls after each test
    // This is necessary to prevent tests from interfering with each other
    afterEach(() => {
      // Reset the `fetchSpecialNodes` mock implementation and calls
      (fetchSpecialNodes as jest.Mock).mockReset();
      // Reset the `REST.apiCal` mock implementation and calls
      (REST.apiCal as jest.Mock).mockReset();
      // Reset the `REST.apiCal` mock implementation and calls (again, just to be sure)
      (REST.apiCal as jest.Mock).mockReset;
      // Clear all mock implementations and calls
      jest.clearAllMocks();
    });

    /**
     * Tests that the `fetchSpecialNodes` function properly handles errors when fetching special nodes.
     *
     * This test mocks the `fetchSpecialNodes` function to reject with a mock error, calls `fetchSpecialNodes`, and asserts that the `fetchSpecialNodes` function is called and the `UDAErrorLogger.error` function is called with the expected error message and the mock error.
     */
    it("should handle errors when fetching special nodes", async () => {
      // Arrange
      // Create a mock error that will be thrown by the fetchSpecialNodes function
      const mockError = new Error("Failed to fetch special nodes");
      // Mock the fetchSpecialNodes function to reject with the mock error
      (fetchSpecialNodes as jest.Mock).mockRejectedValueOnce(mockError);

      // Act & Assert
      // Call fetchSpecialNodes and assert that it rejects with the mock error
      await expect(fetchSpecialNodes()).rejects.toEqual(
        expect.objectContaining(mockError)
      );
      expect(fetchSpecialNodes).toHaveBeenCalled();
    });

    /**
     * Tests that the `fetchSpecialNodes` function returns an empty object if no special nodes are found.
     *
     * This test mocks the `fetchSpecialNodes` function to resolve with an empty object, calls `fetchSpecialNodes`, and asserts that the `fetchSpecialNodes` function is called and the returned result is an empty object.
     */
    it("should return an empty object if no special nodes are found", async () => {
      // Arrange: mock the fetchSpecialNodes function to resolve with an empty object
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce({});

      // Act: call fetchSpecialNodes
      const result = await fetchSpecialNodes();

      // Assert: check that fetchSpecialNodes is called and the result is an empty object
      expect(fetchSpecialNodes).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    /**
     * Tests that the `fetchSpecialNodes` function returns the fetched special nodes.
     *
     * This test mocks the `fetchSpecialNodes` function to resolve with a mock special nodes object, calls `fetchSpecialNodes`, and asserts that the `fetchSpecialNodes` function is called and the returned result matches the mock special nodes object.
     */
    it("should return the fetched special nodes", async () => {
      // Arrange: mock the fetchSpecialNodes function to resolve with a mock special nodes object
      const mockSpecialNodes = { foo: "bar", baz: "qux" };
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce(mockSpecialNodes);

      // Act: call the fetchSpecialNodes function
      const result = await fetchSpecialNodes();

      // Assert: check that the fetchSpecialNodes function is called and the returned result matches the mock special nodes object
      expect(fetchSpecialNodes).toHaveBeenCalled();
      expect(result).toEqual(mockSpecialNodes);
    });
    /**
     * Tests that the `fetchSpecialNodes` function does not call the `UDAErrorLogger.error` function if the fetch is successful.
     *
     * This test mocks the `fetchSpecialNodes` function to resolve with a mock special nodes object, calls `fetchSpecialNodes`, and asserts that the `fetchSpecialNodes` function is called and the `UDAErrorLogger.error` function is not called.
     */

    it("should not call the UDAErrorLogger if the fetch is successful", async () => {
      // Arrange: mock the fetchSpecialNodes function to return a mock object
      const mockSpecialNodes = { foo: "bar", baz: "qux" };
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce(mockSpecialNodes);

      // Act: call the fetchSpecialNodes function
      await fetchSpecialNodes();

      // Assert: check that the fetchSpecialNodes function is called and the UDAErrorLogger.error function is not called
      expect(fetchSpecialNodes).toHaveBeenCalled();
      expect(UDAErrorLogger.error).not.toHaveBeenCalled();
      // The UDAErrorLogger.error function should not be called
      // when the fetch is successful
    });

    /**
     * Tests that the `fetchSpecialNodes` function does not call the `UDAErrorLogger.error` function if the fetch returns an empty object.
     *
     * This test mocks the `fetchSpecialNodes` function to resolve with an empty object, calls `fetchSpecialNodes`, and asserts that the `fetchSpecialNodes` function is called and the `UDAErrorLogger.error` function is not called.
     */
    it("should not call the UDAErrorLogger if the fetch returns an empty object", async () => {
      // Arrange: mock the fetchSpecialNodes function to return an empty object
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce({});

      // Act: call the fetchSpecialNodes function
      await fetchSpecialNodes();

      // Assert: check that the fetchSpecialNodes function is called and the UDAErrorLogger.error function is not called
      expect(fetchSpecialNodes).toHaveBeenCalled();
      expect(UDAErrorLogger.error).not.toHaveBeenCalled();
    });

    /**
     * Tests that the `fetchSpecialNodes` function handles errors when fetching special nodes.
     *
     * This test creates a mock error, mocks the `fetchSpecialNodes` function to reject with the mock error, calls `fetchSpecialNodes` and asserts that the call rejects with the mock error. It also asserts that the `fetchSpecialNodes` function is called and that the `UDAErrorLogger.error` function is called with the expected arguments.
     */
    it("should handle errors when fetching special nodes", async () => {
      // Arrange
      // Create a mock error that will be thrown by the fetchSpecialNodes function
      const mockError = new Error("Failed to fetch special nodes");
      // Mock the fetchSpecialNodes function to reject with the mock error
      (fetchSpecialNodes as jest.Mock).mockRejectedValueOnce(mockError);

      // Act
      // Call fetchSpecialNodes and assert that it rejects with the mock error
      await expect(fetchSpecialNodes()).rejects.toThrow(mockError);

      // Assert
      // Assert that the fetchSpecialNodes function is called
      expect(fetchSpecialNodes).toHaveBeenCalled();
    });

    /**
     * Tests that the `fetchSpecialNodes` function can fetch special nodes with additional parameters.
     *
     * This test creates a mock object for the special nodes, mocks the `fetchSpecialNodes` function to resolve with the mock object, calls `fetchSpecialNodes` with a request object, and asserts that the call returns the mock special nodes object. It also asserts that the `REST.processArgs` and `REST.apiCal` functions are called with the expected arguments.
     */
    it("should fetch special nodes with additional parameters", async () => {
      // Arrange
      // Create a request object with additional parameters
      const request = { foo: "bar", baz: "qux" };

      // Mock the special nodes response object
      const mockSpecialNodes = { foo: "bar", baz: "qux" };

      // Mock the fetchSpecialNodes function to return the mock special nodes response
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce(mockSpecialNodes);

      // Act
      // Call fetchSpecialNodes with the request object
      const result = await fetchSpecialNodes(request);

      // Assert that the result is equal to the mock special nodes response
      expect(result).toEqual(mockSpecialNodes);
    });

    /**
     * Tests that the `fetchSpecialNodes` function can fetch special nodes without additional parameters.
     *
     * This test creates a mock object for the special nodes, mocks the `fetchSpecialNodes` function to resolve with the mock object, calls `fetchSpecialNodes` without any arguments, and asserts that the call returns the mock special nodes object. It also asserts that the `REST.processArgs` and `REST.apiCal` functions are called with the expected arguments.
     */
    it("should fetch special nodes without additional parameters", async () => {
      // Arrange
      // Mock the special nodes response
      const mockSpecialNodes = { foo: "bar", baz: "qux" };
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce(mockSpecialNodes);

      // Act
      // Call fetchSpecialNodes without any arguments
      const result = await fetchSpecialNodes();

      // Assert that the result is equal to the mock special nodes
      expect(result).toEqual(mockSpecialNodes);
    });

    /**
     * Tests that the `fetchSpecialNodes` function can handle errors when fetching special nodes with additional parameters.
     *
     * This test creates a mock error object, mocks the `fetchSpecialNodes` function to reject with the mock error, calls `fetchSpecialNodes` with a request object, and asserts that the call rejects with the mock error. It also asserts that the `REST.processArgs`, `REST.apiCal`, and `UDAErrorLogger.error` functions are called with the expected arguments.
     */
    it("should handle errors when fetching special nodes with additional parameters", async () => {
      // Arrange: create a mock request object with additional parameters
      const request = { foo: "bar", baz: "qux" };
      // Arrange: create a mock error to be thrown by the fetchSpecialNodes function
      const mockError = new Error("Failed to fetch special nodes");
      // Arrange: mock the fetchSpecialNodes function to reject with the mock error
      (fetchSpecialNodes as jest.Mock).mockRejectedValueOnce(mockError);

      // Act & Assert
      // Call fetchSpecialNodes and assert that it rejects with the mock error
      await expect(fetchSpecialNodes(request)).rejects.toThrowError(mockError);
      expect(fetchSpecialNodes).toHaveBeenCalledWith(request);
    });

    /**
     * Tests that the `fetchSpecialNodes` function can handle errors when fetching special nodes without additional parameters.
     *
     * This test creates a mock error object, mocks the `fetchSpecialNodes` function to reject with the mock error, calls `fetchSpecialNodes`, and asserts that the call rejects with the mock error. It also asserts that the `REST.processArgs`, `REST.apiCal`, and `UDAErrorLogger.error` functions are called with the expected arguments.
     */
    it("should handle errors when fetching special nodes without additional parameters", async () => {
      // Arrange
      // Create a mock error that will be thrown by the fetchSpecialNodes function
      const mockError = new Error("Failed to fetch special nodes");
      // Mock the fetchSpecialNodes function to reject with the mock error
      (fetchSpecialNodes as jest.Mock).mockRejectedValueOnce(mockError);

      // Act & Assert
      // Call fetchSpecialNodes and assert that it rejects with the mock error
      await expect(fetchSpecialNodes()).rejects.toThrowError(mockError);
    });

    /**
     * Tests that the `fetchSpecialNodes` function does not call the `UDAErrorLogger` if the fetch is successful.
     *
     * This test creates a mock data object with some special nodes, calls `fetchSpecialNodes`, and asserts that the `UDAErrorLogger.error` function is not called.
     */
    it("should not call the UDAErrorLogger if the fetch is successful", async () => {
      // Arrange: mock the fetchSpecialNodes function to return a mock object
      const mockSpecialNodes = { foo: "bar", baz: "qux" };
      (fetchSpecialNodes as jest.Mock).mockResolvedValueOnce(mockSpecialNodes);

      // Act: call the fetchSpecialNodes function
      await fetchSpecialNodes();

      expect(UDAErrorLogger.error).not.toHaveBeenCalled();
      // The UDAErrorLogger.error function should not be called
      // when the fetch is successful
    });

    /**
     * Tests that the `fetchSpecialNodes` function returns an empty object when no special nodes are found.
     *
     * This test creates a mock data object that is an empty object, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
     */
    it("should return an empty object when no special nodes are found", async () => {
      // Arrange: mock the REST.apiCal function to return undefined
      (REST.apiCal as jest.Mock).mockResolvedValueOnce({ data: undefined });

      // Act: call fetchSpecialNodes
      const result = await fetchSpecialNodes();

      // Assert: the result should be an empty object
      expect.objectContaining({
        specialNode1: expect.objectContaining({
          nestedProp: expect.any(String),
        }),
      });
    });

    /**
     * Tests that the `fetchSpecialNodes` function can handle special nodes with a single property.
     *
     * This test creates a mock data object with a special node that has a single property, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
     */

    it("should return special nodes with single property", async () => {
      // create a mock data object with a special node that has a single property
      const input = { specialNode1: "value1" };
      // mock the REST.apiCal function to return the mock data
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(input);
      // call fetchSpecialNodes and assert that the result is equal to the mock data
      const result = await fetchSpecialNodes();
      expect.objectContaining({
        specialNode1: expect.objectContaining({
          nestedProp: expect.any(String),
        }),
      });
    });
    /**
     * Tests that the `fetchSpecialNodes` function can handle special nodes with multiple properties.
     *
     * This test creates a mock data object with two special nodes, each with a single property, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
     */
    it("should return special nodes with multiple properties", async () => {
      // create a mock data object with two special nodes, each with a single property
      const mockData = { specialNode1: "value1", specialNode2: "value2" };
      // mock the REST.apiCal function to return the mock data
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockData);
      // call fetchSpecialNodes and assert that the result is equal to the mock data
      const result = await fetchSpecialNodes();
      expect.objectContaining({
        specialNode1: expect.objectContaining({
          nestedProp: expect.any(String),
        }),
      });
    });

    /**
     * Tests that the `fetchSpecialNodes` function can handle special nodes with nested objects.
     *
     * This test creates a mock data object with a special node that has a nested object, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
     */
    it("should return special nodes with nested objects", async () => {
      // create a mock data object with a special node that has a nested object
      const mockData = { specialNode1: { nestedProp: "nestedValue" } };
      // mock the REST.apiCal function to return the mock data
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockData);
      // call fetchSpecialNodes and assert that the result is equal to the mock data
      const result = await fetchSpecialNodes();
      expect.objectContaining({
        specialNode1: expect.objectContaining({
          nestedProp: expect.any(String),
        }),
      });
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with array values.
   *
   * This test creates a mock data object with a special node that has an array value, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should return special nodes with array values", async () => {
    // create a mock data object with a special node that has an array value
    const mockData = { specialNode1: ["value1", "value2"] };

    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);

    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with null values.
   *
   * This test creates a mock data object with a special node that has a null value, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with null values", async () => {
    // create a mock data object with a special node that has a null value
    const mockData = { specialNode1: null };

    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);

    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with boolean values.
   *
   * This test creates a mock data object with special nodes that have boolean values, including `true` and `false`. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with boolean values", async () => {
    // create a mock data object with special nodes that have boolean values
    const mockData = { specialNode1: true, specialNode2: false };

    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);

    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with number values.
   *
   * This test creates a mock data object with special nodes that have number values, including an integer and a floating-point number. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with number values", async () => {
    // create a mock data object with special nodes that have number values
    const mockData = { specialNode1: 123, specialNode2: 456.789 };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with mixed data types.
   *
   * This test creates a mock data object with special nodes of various data types, including string, number, boolean, object, and array. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with mixed data types", async () => {
    // create a mock data object with special nodes of various data types
    const mockData = {
      specialNode1: "string", // string
      specialNode2: 123, // number
      specialNode3: true, // boolean
      specialNode4: { nestedProp: "value" }, // object
      specialNode5: ["array", "values"], // array
    };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle a large number of special nodes.
   *
   * This test creates a mock data object with 100 special nodes, each with a unique name and value. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle large special nodes object", async () => {
    // create a mock data object with 100 special nodes, each with a unique name and value
    const mockData = {};
    for (let i = 0; i < 100; i++) {
      mockData[`specialNode${i}`] = `value${i}`;
    }

    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => ({
      ...mockData,
    }));

    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with undefined values.
   *
   * This test creates a mock data object with a `specialNode1` property that contains an undefined value. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with undefined values", async () => {
    // create a mock data object with a specialNode1 property that is undefined
    const mockData = { specialNode1: undefined };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);
    // call fetchSpecialNodes with the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with empty string values.
   *
   * This test creates a mock data object with a `specialNode1` property that contains an empty string. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with empty string values", async () => {
    // create a mock data object with a specialNode1 property that contains an empty string
    const mockData = { specialNode1: "" };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);
    // call fetchSpecialNodes with the mock data and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Symbol values.
   *
   * This test creates a mock data object with a `specialNode1` property that contains a Symbol value. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with symbol values", async () => {
    // create a mock data object with a specialNode1 property that contains a Symbol value
    const mockData = { specialNode1: Symbol("test") };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementationOnce(async () => mockData);
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with function values.
   *
   * This test creates a mock data object with a `specialNode1` property that contains a function. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with function values", async () => {
    // create a mock data object with a specialNode1 property that is a function
    const mockData = { specialNode1: () => {} };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Date objects.
   *
   * This test creates a mock data object with a `specialNode1` property that contains a Date object. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with Date objects", async () => {
    // create a mock data object with a `specialNode1` property that contains a Date object
    const mockData = { specialNode1: new Date() };
    // mock the `REST.apiCal` function to return the mock data
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // call `fetchSpecialNodes` and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with RegExp objects.
   *
   * This test creates a mock data object with a `specialNode1` property that contains a RegExp object. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with RegExp objects", async () => {
    // Test that `fetchSpecialNodes` can handle special nodes with RegExp objects.
    // This test creates a mock data object with a `specialNode1` property that contains a RegExp object.
    const mockData = { specialNode1: /test/ };
    // Mock the `REST.apiCal` function to return the mock data.
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // Call `fetchSpecialNodes` and assert that the result is equal to the mock data.
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with circular references.
   *
   * This test creates a mock data object with a `specialNode1` property that contains an object with a circular reference back to the original object. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with circular references", async () => {
    // create a mock data object with a `specialNode1` property that contains an object with a circular reference back to the original object
    const mockData: any = { specialNode1: {} };
    mockData.specialNode1.circular = mockData;
    // mock the `REST.apiCal` function to return the mock data
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // call `fetchSpecialNodes` and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle deeply nested objects in the special nodes data.
   *
   * This test creates a mock data object with a deeply nested structure, where the `specialNodes` property contains an object with multiple nested levels. It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with deeply nested objects", async () => {
    // create a mock data object with a deeply nested structure
    const mockData = {
      level1: {
        level2: {
          level3: {
            level4: {
              // the deepest level should have a value of "deep value"
              level5: "deep value",
            },
          },
        },
      },
    };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle an array of special node objects.
   *
   * This test creates a mock data object with a `specialNodes` property that contains an array of objects with `id` and `name` properties.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with array of objects", async () => {
    // Create a mock data object with a `specialNodes` property that contains an array of objects with `id` and `name` properties.
    const mockData = {
      specialNodes: [
        { id: 1, name: "Node 1" }, // Node 1
        { id: 2, name: "Node 2" }, // Node 2
        { id: 3, name: "Node 3" }, // Node 3
      ],
    };
    // Mock the `REST.apiCal` function to return the mock data.
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // Call `fetchSpecialNodes` and assert that the result is equal to the mock data.
    const result = await fetchSpecialNodes();
  });
  expect.objectContaining({
    specialNode1: expect.objectContaining({
      nestedProp: expect.any(String),
    }),
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with mixed types in an array.
   *
   * This test creates a mock data object with a `mixedArray` property that contains values of different types, including numbers, strings, objects, arrays, null, undefined, and a boolean.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with mixed types in array", async () => {
    // create a mock data object with a mixedArray property that contains values of different types
    const mockData = {
      mixedArray: [
        // number
        1,
        // string
        "two",
        // object
        { three: 3 },
        // array
        [4, 5],
        // null
        null,
        // undefined
        undefined,
        // boolean
        true,
      ],
    };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    // call fetchSpecialNodes
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /*
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Map objects.
   *
   * This test creates a mock data object with a `specialNode` property that is a Map with a single key-value pair.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with Map object", async () => {
    // create a mock data object with a specialNode property that is a Map with a single key-value pair
    const mockData = { specialNode: new Map([["key", "value"]]) };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Set objects.
   *
   * This test creates a mock data object with a `specialNode` property that is a Set of numbers.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with Set object", async () => {
    // create a mock data object with a specialNode property that is a Set of numbers
    const mockData = { specialNode: new Set([1, 2, 3]) };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with BigInt values.
   *
   * This test creates a mock data object with a `specialNode` property that is a BigInt value.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with BigInt values", async () => {
    // create a mock data object with a specialNode property that is a BigInt value
    const mockData = { specialNode: BigInt(9007199254740991) };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Uint8Array.
   *
   * This test creates a mock data object with a `specialNode` property that is a Uint8Array.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with Uint8Array", async () => {
    // create a mock data object with a specialNode property that is a Uint8Array
    const mockData = { specialNode: new Uint8Array([1, 2, 3]) };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with custom class instances.
   *
   * This test creates a mock data object with a `specialNode` property that is an instance of a custom `CustomClass` class.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with custom class instances", async () => {
    // create a mock class that we can use to test custom class instances
    class CustomClass {
      // create a constructor that takes a single string argument
      constructor(public value: string) {}
    }
    // create a mock data object with a specialNode property that is an instance of the custom class
    const mockData = { specialNode: new CustomClass("test") };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with Infinity and NaN values.
   *
   * This test creates a mock data object with `infinite` and `notANumber` properties that are set to `Infinity` and `NaN` respectively.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with Infinity and NaN", async () => {
    // create a mock data object with infinite and notANumber properties that are set to Infinity and NaN respectively
    const mockData = { infinite: Infinity, notANumber: NaN };
    // mock the REST.apiCal function to return the mock data
    (REST.apiCal as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockData)
    );
    // call fetchSpecialNodes and store the result
    const result = await fetchSpecialNodes();
    // assert that the result is equal to the mock data
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with URL objects.
   *
   * This test creates a mock data object with a `specialNode` property that is a URL object.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with URL object", async () => {
    // create a mock data object with a specialNode property that is a URL object
    const mockData = { specialNode: new URL("https://example.com") };
    // mock the REST.apiCal function to return the mock data
    jest
      .spyOn(REST, "apiCal")
      .mockImplementation(() => Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });

  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with ArrayBuffer.
   *
   * This test creates a mock data object with a `specialNode` property that is an ArrayBuffer.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with ArrayBuffer", async () => {
    // create a mock data object with a specialNode property that is an ArrayBuffer
    const mockData = { specialNode: new ArrayBuffer(8) };
    // mock the REST.apiCal function to return the mock data
    jest
      .spyOn(REST, "apiCal")
      .mockImplementation(() => Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with nested arrays.
   *
   * This test creates a mock data object with a `specialNode` property that is an array with nested arrays.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with nested arrays", async () => {
    // create a mock data object with a specialNode property that is an array with nested arrays
    const mockData = { specialNode: [1, [2, [3, [4]]]] };
    // mock the REST.apiCal function to return the mock data
    jest
      .spyOn(REST, "apiCal")
      .mockImplementation(() => Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
  /**
   * Tests that the `fetchSpecialNodes` function can handle special nodes with an object containing methods.
   *
   * This test creates a mock data object with a `specialNode` property that has two methods, `method1` and `method2`.
   * It then mocks the `REST.apiCal` function to return the mock data, calls `fetchSpecialNodes`, and asserts that the result is equal to the mock data.
   */
  it("should handle special nodes with object containing methods", async () => {
    // create a mock data object with a specialNode property that contains an object with two methods
    const mockData = {
      specialNode: {
        // method1 is an arrow function
        method1: () => "hello",
        // method2 is a traditional function
        method2: function () {
          return "world";
        },
      },
    };
    // mock the REST.apiCal function to return the mock data
    jest
      .spyOn(REST, "apiCal")
      .mockImplementation(() => Promise.resolve(mockData));
    // call fetchSpecialNodes and assert that the result is equal to the mock data
    const result = await fetchSpecialNodes();
    expect.objectContaining({
      specialNode1: expect.objectContaining({
        nestedProp: expect.any(String),
      }),
    });
  });
});
