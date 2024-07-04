import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import { getUserId } from "../services/userService";
import { recordUserClickData } from "../services/recordService";
import { specialNodes } from "../util/specialNodes";
import { getSessionKey } from "../services/userService";
import {
  fetchSearchResults,
  fetchRecord,
  fetchSpecialNodes,
} from "../services/searchService";

jest.mock("../services/userService", () => ({
  getUserId: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
    processArgs: jest.fn(),
  },
}));

jest.mock("../services/recordService", () => ({
  recordUserClickData: jest.fn(),
}));

jest.mock("../util/specialNodes", () => ({
  specialNodes: { mock: "specialNodes" },
}));
describe("searchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchSearchResults", () => {
    it("should call REST.apiCal with correct parameters when additionalParams is not null", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = {
        keyword: "test",
        page: 1,
        additionalParams: { param: "value" },
      };
      await fetchSearchResults(request);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request.keyword
      );
      expect(getUserId).toHaveBeenCalled();
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions,
        { ...request, userSessionId: mockUserId }
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.SearchWithPermissions, {
          ...request,
          userSessionId: mockUserId,
        }),
        method: "GET",
      });
    });
  });

  describe("fetchRecord", () => {
    it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = { id: "1", domain: "test.com", additionalParams: null };
      await fetchRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchRecord}/${request.id}?domain=${request.domain}`,
        method: "GET",
      });
    });

    it("should handle errors gracefully", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const request = { id: "1", domain: "test.com", additionalParams: null };
      await expect(fetchRecord(request)).rejects.toThrow("API Error");

      expect(getUserId).toHaveBeenCalled();
    });
  });

  describe("fetchSpecialNodes", () => {
    it("should return specialNodes", async () => {
      const request = { param: "value" };
      const result = await fetchSpecialNodes(request);

      expect(result).toEqual({ mock: "specialNodes" });
    });

    it("should call REST.apiCal with correct parameters", async () => {
      const request = { param: "value" };
      await fetchSpecialNodes(request);

      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SpecialNodes,
        request
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.SpecialNodes, request),
        method: "GET",
      });
    });

    it("should handle errors gracefully", async () => {
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const request = { param: "value" };
      await expect(fetchSpecialNodes(request)).rejects.toThrow("API Error");
    });
  });
});
describe("searchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchSearchResults", () => {
    it("should handle null input gracefully", async () => {
      await expect(fetchSearchResults(null)).rejects.toThrow(
        "Cannot read property 'keyword' of null"
      );
    });

    it("should handle empty object input gracefully", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request = {};
      await fetchSearchResults();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
        ...request,
        userSessionId: mockUserId,
      });
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: REST.processArgs(ENDPOINT.Search, {
          ...request,
          userSessionId: mockUserId,
        }),
        method: "GET",
      });
    });
    it("should handle invalid data types gracefully", async () => {
      const request = "invalid";
      await expect(fetchSearchResults(request as any)).rejects.toThrow();
    });

    it("should handle network failures gracefully", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const request = { keyword: "test", page: 1, additionalParams: null };
      await expect(fetchSearchResults(request)).rejects.toThrow(
        "Network Error"
      );

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request.keyword
      );
      expect(getUserId).toHaveBeenCalled();
    });

    it("should handle concurrent requests gracefully", async () => {
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      const request1 = { keyword: "test1", page: 1, additionalParams: null };
      const request2 = { keyword: "test2", page: 2, additionalParams: null };

      await Promise.all([
        fetchSearchResults(request1),
        fetchSearchResults(request2),
      ]);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request1.keyword
      );
      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        request2.keyword
      );
      expect(getUserId).toHaveBeenCalledTimes(2);
    });
  });

  describe("fetchRecord", () => {
    it("should handle null input gracefully", async () => {
      await expect(fetchRecord(null)).rejects.toThrow(
        "Cannot read property 'id' of null"
      );
    });

    describe("fetchSpecialNodes", () => {
      it("should handle null input gracefully", async () => {
        await expect(fetchSpecialNodes(null)).resolves.toEqual({
          mock: "specialNodes",
        });
      });

      it("should handle undefined input gracefully", async () => {
        await expect(fetchSpecialNodes(undefined)).resolves.toEqual({
          mock: "specialNodes",
        });
      });

      describe("searchService", () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        describe("fetchSearchResults", () => {
          it("should handle boundary conditions for page number", async () => {
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const request = {
              keyword: "test",
              page: Number.MAX_SAFE_INTEGER,
              additionalParams: null,
            };
            await fetchSearchResults(request);

            expect(recordUserClickData).toHaveBeenCalledWith(
              "search",
              request.keyword
            );
            expect(getUserId).toHaveBeenCalled();
            expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
              ...request,
              userSessionId: mockUserId,
            });
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: REST.processArgs(ENDPOINT.Search, {
                ...request,
                userSessionId: mockUserId,
              }),
              method: "GET",
            });
          });

          it("should handle security-related inputs gracefully", async () => {
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const request = {
              keyword: "<script>alert('xss')</script>",
              page: 1,
              additionalParams: null,
            };
            await fetchSearchResults(request);

            expect(recordUserClickData).toHaveBeenCalledWith(
              "search",
              request.keyword
            );
            expect(getUserId).toHaveBeenCalled();
            expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
              ...request,
              userSessionId: mockUserId,
            });
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: REST.processArgs(ENDPOINT.Search, {
                ...request,
                userSessionId: mockUserId,
              }),
              method: "GET",
            });
          });
        });

        describe("fetchRecord", () => {
          it("should handle boundary conditions for id", async () => {
            const mockUserId = "mockUserId";
            (getUserId as jest.Mock).mockResolvedValue(mockUserId);

            const largeId = "1".repeat(Number.MAX_SAFE_INTEGER);
            const request = {
              id: largeId,
              domain: "test.com",
              additionalParams: null,
            };
            await fetchRecord(request);

            expect(getUserId).toHaveBeenCalled();
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: `${ENDPOINT.fetchRecord}/${largeId}?domain=${request.domain}`,
              method: "GET",
            });
          });

          describe("fetchSpecialNodes", () => {
            it("should handle boundary conditions for param", async () => {
              const largeParam = "a".repeat(Number.MAX_SAFE_INTEGER);
              const request = { param: largeParam };
              const result = await fetchSpecialNodes(request);

              expect(result).toEqual({ mock: "specialNodes" });
            });

            describe("searchService", () => {
              beforeEach(() => {
                jest.clearAllMocks();
              });

              describe("fetchSearchResults", () => {
                it("should handle boundary conditions for page number", async () => {
                  const mockUserId = "mockUserId";
                  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

                  const request = {
                    keyword: "test",
                    page: Number.MAX_SAFE_INTEGER,
                    additionalParams: null,
                  };
                  await fetchSearchResults(request);

                  expect(recordUserClickData).toHaveBeenCalledWith(
                    "search",
                    request.keyword
                  );
                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.processArgs).toHaveBeenCalledWith(
                    ENDPOINT.Search,
                    {
                      ...request,
                      userSessionId: mockUserId,
                    }
                  );
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: REST.processArgs(ENDPOINT.Search, {
                      ...request,
                      userSessionId: mockUserId,
                    }),
                    method: "GET",
                  });
                });
              });

              describe("searchService functions", () => {
                beforeEach(() => {
                  (getUserId as jest.Mock).mockClear();
                });

                it("fetchSearchResults should call getUserId and make API call", async () => {
                  (getUserId as jest.Mock).mockResolvedValue("testUserId");

                  const request = {
                    /* request data */
                  };
                  await fetchSearchResults();

                  expect(getUserId).toHaveBeenCalled();
                  // Add assertions for API call
                });

                it("fetchRecord should call getUserId and make API call", async () => {
                  (getUserId as jest.Mock).mockResolvedValue("testUserId");

                  const request = {
                    /* request data */
                  };
                  await fetchRecord(request);

                  expect(getUserId).toHaveBeenCalled();
                  // Add assertions for API call
                });

                it("fetchSpecialNodes should make API call and return special nodes", async () => {
                  const request = {
                    /* request data */
                  };
                  const specialNodes = await fetchSpecialNodes(request);

                  // Add assertions for special nodes data
                });

                // Add more test cases for other functions in searchService
              });
              it("fetchSearchResults should handle different scenarios and make API call", async () => {
                const request1 = { keyword: "search term 1", page: 1 };
                const request2 = { keyword: "search term 2", page: 2 };

                await fetchSearchResults(request1);
                // Add assertions for API call with request data 1

                await fetchSearchResults(request2);
                // Add assertions for API call with request data 2
              });
              it("fetchRecord should handle different input data and make API call", async () => {
                const request1 = { id: "recordId1", domain: "domain1" };
                const request2 = { id: "recordId2", domain: "domain2" };

                await fetchRecord(request1);
                // Add assertions for API call with request data 1

                await fetchRecord(request2);
                // Add assertions for API call with request data 2
              });
              it("fetchSpecialNodes should handle different scenarios and return special nodes", async () => {
                const request1 = {
                  /* request data 1 */
                };
                const request2 = {
                  /* request data 2 */
                };

                const specialNodes1 = await fetchSpecialNodes(request1);
                // Add assertions for special nodes data with request data 1

                const specialNodes2 = await fetchSpecialNodes(request2);
                // Add assertions for special nodes data with request data 2
              });
              it("fetchSearchResults should handle error response from API call", async () => {
                (getUserId as jest.Mock).mockResolvedValue("testUserId");

                const request = {
                  /* request data */
                };
                // Simulate error response from API call
                // Add assertions for error handling
              });
              it("should call REST.apiCal with correct parameters for search results", async () => {
                const request = {
                  keyword: "test",
                  page: 1,
                  domain: "example.com",
                  additionalParams: { param1: "value1" },
                  userSessionId: "12345",
                };
                REST.apiCal.mockResolvedValue({ success: true });

                await fetchSearchResults(request);

                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(
                    ENDPOINT.SearchWithPermissions,
                    request
                  ),
                  method: "GET",
                });
              });

              it("should handle no additionalParams gracefully", async () => {
                const request = {
                  keyword: "test",
                  page: 1,
                  domain: "example.com",
                  userSessionId: "12345",
                };
                REST.apiCal.mockResolvedValue({ success: true });

                await fetchSearchResults(request);

                expect(REST.apiCal).toHaveBeenCalledWith({
                  url: REST.processArgs(ENDPOINT.Search, request),
                  method: "GET",
                });
              });

              it("should handle errors from REST.apiCal", async () => {
                const request = { keyword: "test", page: 1 };
                REST.apiCal.mockRejectedValue(new Error("Network error"));

                await expect(fetchSearchResults(request)).rejects.toThrow(
                  "Network error"
                );
              });

              describe("fetchRecord", () => {
                it("should call REST.apiCal with correct parameters for fetching a record", async () => {
                  const request = {
                    id: "123",
                    domain: "example.com",
                    additionalParams: { param1: "value1" },
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  await fetchRecord(request);

                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/withPermissions/123?domain=example.com&additionalParams=${request.additionalParams}&userSessionId=${request.userSessionId}`,
                    method: "GET",
                  });
                });

                it("should handle null additionalParams correctly", async () => {
                  const request = {
                    id: "123",
                    domain: "example.com",
                    userSessionId: "12345",
                  };
                  REST.apiCal.mockResolvedValue({ success: true });

                  await fetchRecord(request);

                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: `${ENDPOINT.fetchRecord}/123?domain=example.com`,
                    method: "GET",
                  });
                });

                describe("fetchSpecialNodes", () => {
                  it("should call REST.apiCal with correct parameters for fetching special nodes", async () => {
                    const request = {};
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, request),
                      method: "GET",
                    });
                  });
                });
                describe("fetchSearchResults", () => {
                  it("should handle empty keyword gracefully", async () => {
                    const request = {
                      keyword: "",
                      page: 1,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, request),
                      method: "GET",
                    });
                  });

                  it("should handle negative page numbers", async () => {
                    const request = {
                      keyword: "test",
                      page: -1,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, request),
                      method: "GET",
                    });
                  });

                  it("should handle large page numbers", async () => {
                    const request = {
                      keyword: "test",
                      page: 10000,
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSearchResults(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.Search, request),
                      method: "GET",
                    });
                  });
                });

                describe("fetchRecord", () => {
                  it("should handle undefined ID", async () => {
                    const request = {
                      domain: "example.com",
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchRecord(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/undefined?domain=example.com`,
                      method: "GET",
                    });
                  });

                  it("should handle special characters in ID", async () => {
                    const request = {
                      id: "123/special?&",
                      domain: "example.com",
                    };
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchRecord(request);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: `${ENDPOINT.fetchRecord}/123%2Fspecial%3F%26?domain=example.com`,
                      method: "GET",
                    });
                  });
                });

                describe("fetchSpecialNodes", () => {
                  it("should handle empty request object", async () => {
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes({});

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, {}),
                      method: "GET",
                    });
                  });

                  it("should handle null request", async () => {
                    REST.apiCal.mockResolvedValue({ success: true });

                    await fetchSpecialNodes(null);

                    expect(REST.apiCal).toHaveBeenCalledWith({
                      url: REST.processArgs(ENDPOINT.SpecialNodes, null),
                      method: "GET",
                    });
                  });
                });

                describe("Error Handling", () => {
                  it("should handle REST.apiCal throwing non-standard errors", async () => {
                    const request = { keyword: "test", page: 1 };
                    REST.apiCal.mockImplementation(() => {
                      throw {
                        message: "An unexpected error occurred",
                        code: 500,
                      };
                    });

                    await expect(fetchSearchResults(request)).rejects.toEqual({
                      message: "An unexpected error occurred",
                      code: 500,
                    });
                  });
                });

                it("should handle large payloads gracefully", async () => {
                  const mockUserId = "mockUserId";
                  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

                  const largeKeyword = "a".repeat(10000);
                  const request = {
                    keyword: largeKeyword,
                    page: 1,
                    additionalParams: null,
                  };
                  await fetchSearchResults(request);

                  expect(recordUserClickData).toHaveBeenCalledWith(
                    "search",
                    request.keyword
                  );
                  expect(getUserId).toHaveBeenCalled();
                  expect(REST.processArgs).toHaveBeenCalledWith(
                    ENDPOINT.Search,
                    {
                      ...request,
                      userSessionId: mockUserId,
                    }
                  );
                  expect(REST.apiCal).toHaveBeenCalledWith({
                    url: REST.processArgs(ENDPOINT.Search, {
                      ...request,
                      userSessionId: mockUserId,
                    }),
                    method: "GET",
                  });
                });

                expect(recordUserClickData).toHaveBeenCalledWith(
                  "search",
                  request1.keyword
                );
                expect(recordUserClickData).toHaveBeenCalledWith(
                  "search",
                  request2.keyword
                );
                expect(getUserId).toHaveBeenCalledTimes(2);
              });
            });
          });
        });
      });
    });
  });

  describe("fetchSearchResults", () => {
    it("should call recordUserClickData and REST.apiCal with correct parameters", async () => {
      const mockRequest = {
        keyword: "test",
        page: 1,
        domain: "example.com",
        additionalParams: { param: "value" },
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchSearchResults(mockRequest);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockRequest.keyword
      );
      expect(REST.processArgs).toHaveBeenCalledWith(
        ENDPOINT.SearchWithPermissions,
        { ...mockRequest, userSessionId: mockUserId }
      );
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String),
        method: "GET",
      });
    });

    it("should handle null additionalParams", async () => {
      const mockRequest = {
        keyword: "test",
        page: 1,
        domain: "example.com",
        additionalParams: null,
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchSearchResults(mockRequest);

      expect(recordUserClickData).toHaveBeenCalledWith(
        "search",
        mockRequest.keyword
      );
      expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
        ...mockRequest,
        userSessionId: mockUserId,
      });
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.any(String),
        method: "GET",
      });
    });
  });

  describe("fetchRecord", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      const mockRequest = {
        id: "123",
        domain: "example.com",
        additionalParams: { param: "value" },
      };
      const mockUserId = "mockUserId";
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);

      await fetchRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: expect.stringContaining(
          `/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`
        ),
        method: "GET",
      });
    });
  });
  it("should handle empty keyword", async () => {
    const mockRequest = {
      keyword: "",
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(mockRequest);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      { ...mockRequest, userSessionId: mockUserId }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });

  it("should handle undefined keyword", async () => {
    const mockRequest = {
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(mockRequest);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      { ...mockRequest, userSessionId: mockUserId }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });

  it("should handle error thrown by recordUserClickData", async () => {
    const mockRequest = {
      keyword: "test",
      page: 1,
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (recordUserClickData as jest.Mock).mockRejectedValue(new Error("Error"));

    await expect(fetchSearchResults(mockRequest)).rejects.toThrow("Error");
  });
});

describe("fetchRecord", () => {
  // ... (previous test cases)

  it("should handle error thrown by getUserId", async () => {
    const mockRequest = {
      id: "123",
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    (getUserId as jest.Mock).mockRejectedValue(new Error("Error"));

    await expect(fetchRecord(mockRequest)).rejects.toThrow("Error");
  });

  it("should handle error thrown by REST.apiCal", async () => {
    const mockRequest = {
      id: "123",
      domain: "example.com",
      additionalParams: { param: "value" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("Error"));

    await expect(fetchRecord(mockRequest)).rejects.toThrow("Error");
  });
});
describe("fetchSearchResults", () => {
  it("should call recordUserClickData with correct parameters when keyword is provided", async () => {
    const request = { keyword: "test", page: 1 };
    await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
  });

  it("should not call recordUserClickData when keyword is not provided", async () => {
    const request = { page: 1 };
    await fetchSearchResults(request);

    expect(recordUserClickData).not.toHaveBeenCalled();
  });

  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    const request = { page: 1, additionalParams: null };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });

  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const request = { page: 1, additionalParams: "test" };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SearchWithPermissions,
      {
        ...request,
        userSessionId: mockUserId,
      }
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });
});

it("should return specialNodes object", async () => {
  const result = await fetchSpecialNodes();

  expect(result).toEqual(specialNodes);
});

describe("fetchSearchResults", () => {
  it("should handle errors gracefully", async () => {
    const request = { keyword: "test", page: 1 };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchSearchResults(request)).rejects.toThrow("API Error");
    expect(recordUserClickData).toHaveBeenCalledWith("search", request.keyword);
  });
});

describe("fetchRecord", () => {
  it("should handle errors gracefully", async () => {
    const request = { id: "1", domain: "test.com", additionalParams: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchRecord(request)).rejects.toThrow("API Error");
  });
});

describe("fetchSpecialNodes", () => {
  it("should handle errors gracefully", async () => {
    const request = { data: "test" };
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchSpecialNodes(request)).rejects.toThrow("API Error");
  });
});
describe("fetchSearchResults", () => {
  // ... (previous test cases)

  it("should handle undefined request", async () => {
    await expect(fetchSearchResults(undefined)).rejects.toThrow(
      "Cannot read property 'keyword' of undefined"
    );
  });

  it("should handle invalid page number", async () => {
    const request = { keyword: "test", page: "invalid" };
    await expect(fetchSearchResults(request)).rejects.toThrow(
      "Invalid page number"
    );
  });

  it("should handle negative page number", async () => {
    const request = { keyword: "test", page: -1 };
    await expect(fetchSearchResults(request)).rejects.toThrow(
      "Invalid page number"
    );
  });

  it("should handle empty keyword", async () => {
    const request = { keyword: "", page: 1 };
    await fetchSearchResults(request);
    expect(recordUserClickData).not.toHaveBeenCalled();
  });

  it("should handle null additionalParams", async () => {
    const request = { page: 1, additionalParams: null };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });

  it("should handle undefined additionalParams", async () => {
    const request = { page: 1, additionalParams: undefined };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchSearchResults(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
      ...request,
      userSessionId: mockUserId,
    });
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });
});

describe("fetchRecord", () => {
  it("should handle null id", async () => {
    const request = { id: null, domain: "test.com", additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of null"
    );
  });

  it("should handle undefined id", async () => {
    const request = {
      id: undefined,
      domain: "test.com",
      additionalParams: "test",
    };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of undefined"
    );
  });

  it("should handle null domain", async () => {
    const request = { id: "1", domain: null, additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of null"
    );
  });

  it("should handle undefined domain", async () => {
    const request = { id: "1", domain: undefined, additionalParams: "test" };
    await expect(fetchRecord(request)).rejects.toThrow(
      "Cannot read property 'toString' of undefined"
    );
  });

  it("should handle null additionalParams", async () => {
    const request = { id: "1", domain: "test.com", additionalParams: null };

    await fetchRecord(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/1?domain=test.com`,
      method: "GET",
    });
  });

  it("should handle undefined additionalParams", async () => {
    const request = {
      id: "1",
      domain: "test.com",
      additionalParams: undefined,
    };

    await fetchRecord(request);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/1?domain=test.com`,
      method: "GET",
    });
  });
});

describe("fetchSpecialNodes", () => {
  // ... (previous test cases)

  it("should handle undefined request", async () => {
    await fetchSpecialNodes(undefined);
    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      undefined
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: REST.processArgs.mock.results[0].value,
      method: "GET",
    });
  });
});
it("should call REST.apiCal with correct parameters without additionalParams", async () => {
  const mockRequest = {
    keyword: "test",
    page: 1,
    domain: "example.com",
  };
  const mockUserId = "mockUserId";
  (getUserId as jest.Mock).mockResolvedValue(mockUserId);

  await fetchSearchResults(mockRequest);

  expect(getUserId).toHaveBeenCalled();
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  });
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String),
    method: "GET",
  });
});

it("should handle errors gracefully", async () => {
  const mockRequest = {
    keyword: "test",
    page: 1,
    domain: "example.com",
  };
  const mockUserId = "mockUserId";
  (getUserId as jest.Mock).mockResolvedValue(mockUserId);
  (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

  await expect(fetchSearchResults(mockRequest)).rejects.toThrow("API Error");

  expect(getUserId).toHaveBeenCalled();
  expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  expect(REST.processArgs).toHaveBeenCalledWith(ENDPOINT.Search, {
    ...mockRequest,
    userSessionId: mockUserId,
  });
  expect(REST.apiCal).toHaveBeenCalledWith({
    url: expect.any(String),
    method: "GET",
  });
});

describe("fetchRecord", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockRequest = {
      id: "record123",
      domain: "example.com",
      additionalParams: { param1: "value1" },
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/withPermissions/${mockRequest.id}?domain=${mockRequest.domain}&additionalParams=${mockRequest.additionalParams}&userSessionId=${mockUserId}`,
      method: "GET",
    });
  });

  it("should call REST.apiCal with correct parameters without additionalParams", async () => {
    const mockRequest = {
      id: "record123",
      domain: "example.com",
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    await fetchRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
      method: "GET",
    });
  });

  it("should handle errors gracefully", async () => {
    const mockRequest = {
      id: "record123",
      domain: "example.com",
    };
    const mockUserId = "mockUserId";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchRecord(mockRequest)).rejects.toThrow("API Error");

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchRecord}/${mockRequest.id}?domain=${mockRequest.domain}`,
      method: "GET",
    });
  });
});

describe("fetchSpecialNodes", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockRequest = { param1: "value1" };

    await fetchSpecialNodes(mockRequest);

    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      mockRequest
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });

  it("should return the specialNodes object", async () => {
    const mockSpecialNodes = { exclude: { tags: ["tag1", "tag2"] } };
    jest.mock("../util/specialNodes", () => ({
      specialNodes: mockSpecialNodes,
    }));

    const result = await fetchSpecialNodes();
    expect(result).toEqual(mockSpecialNodes);
  });

  it("should handle errors gracefully", async () => {
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(fetchSpecialNodes()).rejects.toThrow("API Error");

    expect(REST.processArgs).toHaveBeenCalledWith(
      ENDPOINT.SpecialNodes,
      undefined
    );
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.any(String),
      method: "GET",
    });
  });
});
describe("searchService", () => {
  // ... previous test cases

  describe("recordUserClickData", () => {
    it("should call REST.apiCal with correct parameters", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

      const clickType = "search";
      const clickedName = "test";
      const recordId = 123;

      await recordUserClickData(clickType, clickedName, recordId);

      expect(getSessionKey).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: {
          usersessionid: mockSessionKey,
          clickedname: clickedName,
          clicktype: clickType,
          recordid: recordId,
        },
      });
    });

    it("should handle errors gracefully", async () => {
      const mockSessionKey = "mockSessionKey";
      (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

      const clickType = "search";
      const clickedName = "test";
      const recordId = 123;

      await expect(
        recordUserClickData(clickType, clickedName, recordId)
      ).rejects.toThrow("API Error");

      expect(getSessionKey).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: {
          usersessionid: mockSessionKey,
          clickedname: clickedName,
          clicktype: clickType,
          recordid: recordId,
        },
      });
    });
  });

  describe("REST.processArgs", () => {
    it("should correctly process the arguments", () => {
      const endpoint = ENDPOINT.Search;
      const request = {
        keyword: "test",
        page: 2,
        domain: "example.com",
        additionalParams: { param1: "value1" },
      };

      const processedUrl = REST.processArgs(endpoint, request);

      expect(processedUrl).toContain("keyword=test");
      expect(processedUrl).toContain("page=2");
      expect(processedUrl).toContain("domain=example.com");
      expect(processedUrl).toContain("param1=value1");
    });

    it("should handle null or undefined request", () => {
      const endpoint = ENDPOINT.Search;

      const processedUrl = REST.processArgs(endpoint, null);
      expect(processedUrl).toBe(endpoint);

      const processedUrl2 = REST.processArgs(endpoint, undefined);
      expect(processedUrl2).toBe(endpoint);
    });

    it("should handle empty request", () => {
      const endpoint = ENDPOINT.Search;
      const request = {};

      const processedUrl = REST.processArgs(endpoint, request);
      expect(processedUrl).toBe(endpoint);
    });
  });

  describe("REST.apiCal", () => {
    it("should call the API with the correct parameters", async () => {
      const parameters = {
        url: "https://example.com/api",
        method: "GET",
        body: { data: "test" },
        headers: { "Content-Type": "application/json" },
      };

      await REST.apiCal(parameters);

      expect(fetch).toHaveBeenCalledWith("https://example.com/api", {
        method: "GET",
        body: JSON.stringify({ data: "test" }),
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should handle errors gracefully", async () => {
      const parameters = {
        url: "https://example.com/api",
        method: "GET",
      };

      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(REST.apiCal(parameters)).rejects.toThrow("API Error");

      expect(fetch).toHaveBeenCalledWith("https://example.com/api", {
        method: "GET",
      });
    });
  });
});
describe("SearchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch search results with keyword", async () => {
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch search results without keyword", async () => {
    const request = {
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).not.toHaveBeenCalled();
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch search results with additional parameters", async () => {
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/searchWithPermissions?keyword=testKeyword&page=1&domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch record with additional parameters", async () => {
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch record without additional parameters", async () => {
    const request = {
      id: "123",
      domain: "testDomain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch special nodes", async () => {
    const result = await fetchSpecialNodes();

    expect(REST.apiCal).not.toHaveBeenCalled();
    expect(result).toEqual(specialNodes);
  });
});
describe("fetchSearchResults", () => {
  it("should fetch search results with keyword", async () => {
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should handle case when getUserId returns null", async () => {
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue(null);
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/searchWithPermissions?keyword=testKeyword&page=1&domain=testDomain&additionalParams=testParams&userSessionId=null",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should handle case when additionalParams is null", async () => {
    const request = {
      keyword: "testKeyword",
      page: 1,
      domain: "testDomain",
      additionalParams: null,
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchSearchResults(request);

    expect(recordUserClickData).toHaveBeenCalledWith("search", "testKeyword");
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/search?keyword=testKeyword&page=1&domain=testDomain&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });
});
describe("fetchRecord", () => {
  it("should fetch record with additional parameters", async () => {
    const request = {
      id: "123",
      domain: "testDomain",
      additionalParams: "testParams",
    };
    (getUserId as jest.Mock).mockResolvedValue("testUserId");
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/withPermissions/123?domain=testDomain&additionalParams=testParams&userSessionId=testUserId",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });

  it("should fetch record without additional parameters", async () => {
    const request = {
      id: "123",
      domain: "testDomain",
    };
    (REST.apiCal as jest.Mock).mockResolvedValue({ data: "testData" });

    const result = await fetchRecord(request);

    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: "https://example.com/api/fetchRecord/123?domain=testDomain",
      method: "GET",
    });
    expect(result).toEqual({ data: "testData" });
  });
});

it("should fetch special nodes", async () => {
  const result = await fetchSpecialNodes();

  expect(REST.apiCal).not.toHaveBeenCalled();
  expect(result).toEqual(specialNodes);
});
describe("fetchSearchResults", () => {
  it("should call recordUserClickData when keyword is provided", async () => {
    const mockRequest = { keyword: "test", page: 1 };
    await fetchSearchResults(mockRequest);
    expect(recordUserClickData).toHaveBeenCalledWith("search", "test");
  });

  it("should not call recordUserClickData when keyword is not provided", async () => {
    const mockRequest = { page: 1 };
    await fetchSearchResults(mockRequest);
    expect(recordUserClickData).not.toHaveBeenCalled();
  });

  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = { keyword: "test", page: 1, additionalParams: null };
    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("Search"),
      method: "GET",
    });
  });

  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = {
      keyword: "test",
      page: 1,
      additionalParams: { key: "value" },
    };
    await fetchSearchResults(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("SearchWithPermissions"),
      method: "GET",
    });
  });
});

describe("fetchRecord", () => {
  it("should call REST.apiCal with correct parameters when additionalParams is null", async () => {
    const mockRequest = {
      id: "123",
      domain: "test.com",
      additionalParams: null,
    };
    await fetchRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining("fetchRecord/123?domain=test.com"),
      method: "GET",
    });
  });

  it("should call REST.apiCal with correct parameters when additionalParams is provided", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);

    const mockRequest = {
      id: "123",
      domain: "test.com",
      additionalParams: { key: "value" },
    };
    await fetchRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: expect.stringContaining(
        "fetchRecord/withPermissions/123?domain=test.com&additionalParams=[object Object]&userSessionId=test-user-id"
      ),
      method: "GET",
    });
  });
});

describe("fetchSpecialNodes", () => {
  it("should return specialNodes", async () => {
    const mockSpecialNodes = { node1: {}, node2: {} };
    (specialNodes as jest.Mock).mockReturnValue(mockSpecialNodes);

    const result = await fetchSpecialNodes();

    expect(result).toEqual(mockSpecialNodes);
  });

  it("should not call REST.apiCal", async () => {
    await fetchSpecialNodes();

    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});
describe("fetchSpecialNodes - Additional Tests", () => {
  it("should handle empty specialNodes object", async () => {
    (specialNodes as jest.Mock).mockReturnValue({});
    const result = await fetchSpecialNodes();
    expect(result).toEqual({});
  });

  it("should handle large specialNodes object", async () => {
    const largeSpecialNodes = Array(1000)
      .fill(0)
      .reduce((acc, _, index) => {
        acc[`node${index}`] = { key: "value" };
        return acc;
      }, {});
    (specialNodes as jest.Mock).mockReturnValue(largeSpecialNodes);
    const result = await fetchSpecialNodes();
    expect(Object.keys(result).length).toBe(1000);
  });
});

describe("Error Handling", () => {
  it("should handle API errors in fetchSearchResults", async () => {
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));
    await expect(fetchSearchResults({ page: 1 })).rejects.toThrow("API Error");
  });

  it("should handle API errors in fetchRecord", async () => {
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));
    await expect(
      fetchRecord({ id: "123", domain: "test.com" })
    ).rejects.toThrow("API Error");
  });

  it("should handle errors when getUserId fails", async () => {
    (getUserId as jest.Mock).mockRejectedValue(new Error("User ID Error"));
    await expect(fetchSearchResults({ page: 1 })).rejects.toThrow(
      "User ID Error"
    );
  });
});

describe("URL Construction", () => {
  it("should construct correct URL for fetchSearchResults with all parameters", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (ENDPOINT.SearchWithPermissions as any) = "/search/withPermissions";

    await fetchSearchResults({
      keyword: "test",
      page: 2,
      domain: "example.com",
      additionalParams: { sort: "date" },
      userSessionId: mockUserId,
    });

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          "/search/withPermissions?keyword=test&page=2&domain=example.com&additionalParams=[object Object]&userSessionId=test-user-id"
        ),
        method: "GET",
      })
    );
  });

  it("should construct correct URL for fetchRecord with all parameters", async () => {
    const mockUserId = "test-user-id";
    (getUserId as jest.Mock).mockResolvedValue(mockUserId);
    (ENDPOINT.fetchRecord as any) = "/record";

    await fetchRecord({
      id: "123",
      domain: "example.com",
      additionalParams: { include: "details" },
      userSessionId: mockUserId,
    });

    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/record/withPermissions/123?domain=example.com&additionalParams=[object Object]&userSessionId=test-user-id",
        method: "GET",
      })
    );
  });
});
describe("fetchSearchResults - Edge Cases", () => {
  it("should handle empty request object", async () => {
    await fetchSearchResults({});
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("Search"),
        method: "GET",
      })
    );
  });

  it("should handle request with only page number", async () => {
    await fetchSearchResults({ page: 5 });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("page=5"),
        method: "GET",
      })
    );
  });

  it("should handle request with very long keyword", async () => {
    const longKeyword = "a".repeat(1000);
    await fetchSearchResults({ keyword: longKeyword, page: 1 });
    expect(recordUserClickData).toHaveBeenCalledWith("search", longKeyword);
  });

  it("should handle request with special characters in keyword", async () => {
    const specialKeyword = '!@#$%^&*()_+{}|:"<>?`~';
    await fetchSearchResults({ keyword: specialKeyword, page: 1 });
    expect(recordUserClickData).toHaveBeenCalledWith("search", specialKeyword);
  });
});

describe("fetchRecord - Edge Cases", () => {
  it("should handle request with empty id", async () => {
    await expect(fetchRecord({ id: "", domain: "test.com" })).rejects.toThrow();
  });

  it("should handle request with empty domain", async () => {
    await expect(fetchRecord({ id: "123", domain: "" })).rejects.toThrow();
  });

  it("should handle request with very long id", async () => {
    const longId = "a".repeat(1000);
    await fetchRecord({ id: longId, domain: "test.com" });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(longId),
        method: "GET",
      })
    );
  });

  it("should handle request with special characters in domain", async () => {
    const specialDomain = "test!@#.com";
    await fetchRecord({ id: "123", domain: specialDomain });
    expect(REST.apiCal).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(encodeURIComponent(specialDomain)),
        method: "GET",
      })
    );
  });
});
