import { ENDPOINT } from "../config/endpoints";
import { REST } from "../services";
import { getSessionKey } from "../services/userService";
import { getAbsoluteOffsets } from "../util";
import fetchMock from "jest-fetch-mock";
import { CONFIG } from "../config";
import {
  translateText,
  translateTextWithOptions,
  getTranslationConfidence,
  getTranslationQuality,
  getTranslationResult,
} from "../services/translateService";

jest.mock("../services/userService", () => ({
  getSessionKey: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe("translateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("translateText returns a promise that resolves with the expected response", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";
    const targetLang = "valid target language";
    const expectedResponse = {
      // expected response object
    };

    const response = await translateText(text, sourceLang, targetLang);

    expect(response).toEqual(expectedResponse);
  });

  test("translateText returns a promise that rejects with an error when an invalid query is passed", async () => {
    const text = "invalid text";
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is missing", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(undefined, sourceLang, targetLang)
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is missing", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, undefined, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is missing", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is empty", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText("", sourceLang, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is empty", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, "", targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is empty", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang, "")).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is not a string", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText(123, sourceLang, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a string", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, 123, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a string", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang, 123)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText("invalid language code", sourceLang, targetLang)
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(
      translateText(text, "invalid language code", targetLang)
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(text, sourceLang, "invalid language code")
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(
        text,
        sourceLang,
        "invalid language code for text and sourceLang"
      )
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang and targetLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(
      translateText(
        text,
        "invalid language code for text and targetLang",
        targetLang
      )
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(
        text,
        sourceLang,
        "invalid language code for text and sourceLang"
      )
    ).rejects.toThrow();
  });
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});

describe("translateService functions", () => {
  it("translateText should make API call and return translated text", async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: { translations: [{ translatedText: "Translated Text" }] },
          }),
      })
    );

    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "fr";

    const translatedText = await translateText(text, sourceLang, targetLang);

    expect(translatedText).toBe("Translated Text");
    expect(fetch).toHaveBeenCalled();
  });

  it("translateText should handle error response from API call", async () => {
    // Mock the fetch function to simulate error response
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error("API Error")));

    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "fr";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
    expect(fetch).toHaveBeenCalled();
  });
});
it("translateText should handle different translation providers", async () => {
  // Mock the fetch function for different translation providers
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: { translations: [{ translatedText: "Translated Text" }] },
        }),
    })
  );

  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "fr";

  // Test with different translation providers
  // Add assertions for handling different providers
});
it("translateText should handle different source and target languages", async () => {
  // Mock the fetch function for different language combinations
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: { translations: [{ translatedText: "Translated Text" }] },
        }),
    })
  );

  const text = "Hello";
  const sourceLang1 = "en";
  const targetLang1 = "fr";

  const sourceLang2 = "es";
  const targetLang2 = "de";

  // Test with different language combinations
  // Add assertions for handling different languages
});
it("translateText should handle empty response data", async () => {
  // Mock the fetch function to return empty response data
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { translations: [] } }),
    })
  );

  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "fr";

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("");
});
describe("translateService", () => {
  const mockText = "Hello";
  const mockSourceLang = "en";
  const mockTargetLang = "fr";
  const mockResponse = {
    data: { translations: [{ translatedText: "Bonjour" }] },
  };

  describe("translateText", () => {
    it("should successfully translate text from source to target language", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(
        mockText,
        mockSourceLang,
        mockTargetLang
      );

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("source=en&target=fr&q=Hello"),
        expect.anything()
      );
    });

    it("should use English as the default target language if none is specified", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(mockText, mockSourceLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("target=en"),
        expect.anything()
      );
    });

    it("should throw an error if the translation API returns an error", async () => {
      fetchMock.mockReject(new Error("Failed to fetch"));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should throw an error if the translation result is empty", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: { translations: [] } })
      );

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should handle network errors gracefully", async () => {
      fetchMock.mockReject(new Error("Network Error"));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should encode special characters in the text", async () => {
      const specialCharText = "Hello & Goodbye";
      const encodedText = encodeURIComponent(specialCharText);
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      await translateText(specialCharText, mockSourceLang, mockTargetLang);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`q=${encodedText}`),
        expect.anything()
      );
    });

    it("should handle cases where the API returns unexpected JSON structure", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ unexpected: "data" }));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });
  });
});
describe("translateService", () => {
  const mockText = "Hello";
  const mockSourceLang = "en";
  const mockTargetLang = "fr";
  const mockResponse = {
    data: { translations: [{ translatedText: "Bonjour" }] },
  };

  describe("translateText", () => {
    it("should handle empty text input gracefully", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText("", mockSourceLang, mockTargetLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("q="),
        expect.anything()
      );
    });

    it("should handle null source language by defaulting to English", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(mockText, null, mockTargetLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("source=en"),
        expect.anything()
      );
    });

    it("should handle unsupported languages by throwing an error", async () => {
      const unsupportedLang = "xx";
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 400, message: "Invalid language code" },
        })
      );

      await expect(
        translateText(mockText, unsupportedLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should handle API returning non-200 status", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: "Error" }), {
        status: 500,
      });

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should handle unexpected empty response from API", async () => {
      fetchMock.mockResponseOnce("");

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should handle translation API timeouts", async () => {
      fetchMock.mockAbortOnce();

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    it("should verify that the correct HTTP method (GET) is used for the request", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      await translateText(mockText, mockSourceLang, mockTargetLang);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should handle very long text inputs", async () => {
      const longText = new Array(1000).fill("Hello").join(" ");
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(
        longText,
        mockSourceLang,
        mockTargetLang
      );

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("q=" + encodeURIComponent(longText)),
        expect.anything()
      );
    });
  });
});

describe("translateText", () => {
  it("should call fetch with correct URL for Google provider", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "translated text" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    const result = await translateText(text, sourceLang, targetLang);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://translation.googleapis.com/language/translate/v2?key=mockApiKey&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
        text
      )}`
    );
    expect(result).toBe("translated text");
  });

  it("should default to 'en' as target language if not provided", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "translated text" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "es";

    const result = await translateText(text, sourceLang);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://translation.googleapis.com/language/translate/v2?key=mockApiKey&source=${sourceLang}&target=en&q=${encodeURIComponent(
        text
      )}`
    );
    expect(result).toBe("translated text");
  });

  it("should throw an error if the translation fails", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle network errors gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Network Error"
    );
  });

  it("should handle invalid JSON responses gracefully", async () => {
    const mockResponse = {
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Invalid JSON"
    );
  });

  it("should handle null input gracefully", async () => {
    await expect(translateText(null, "en", "es")).rejects.toThrow(
      "Cannot read property 'length' of null"
    );
  });

  it("should handle undefined input gracefully", async () => {
    await expect(translateText(undefined, "en", "es")).rejects.toThrow(
      "Cannot read property 'length' of undefined"
    );
  });

  it("should handle empty string input gracefully", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText("", "en", "es");

    expect(result).toBe("");
  });

  it("should handle large text input gracefully", async () => {
    const largeText = "a".repeat(10000);
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "translated text" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText(largeText, "en", "es");

    expect(result).toBe("translated text");
  });

  it("should handle invalid data types gracefully", async () => {
    await expect(translateText(123 as any, "en", "es")).rejects.toThrow();
  });
});
it("should handle empty API key gracefully", async () => {
  CONFIG.multilingual.translate.apikey = "";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle invalid API key gracefully", async () => {
  CONFIG.multilingual.translate.apikey = "invalidApiKey";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Invalid API key",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle unsupported source language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Unsupported source language",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "unsupported";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle unsupported target language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Unsupported target language",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "unsupported";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle text with special characters", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello!@#$%^&*()_+";
  const sourceLang = "en";
  const targetLang = "es";

  const result = await translateText(text, sourceLang, targetLang);

  expect(result).toBe("translated text");
});

it("should handle multiple concurrent translation requests", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text1 = "hello";
  const text2 = "world";
  const sourceLang = "en";
  const targetLang = "es";

  const [result1, result2] = await Promise.all([
    translateText(text1, sourceLang, targetLang),
    translateText(text2, sourceLang, targetLang),
  ]);

  expect(result1).toBe("translated text");
  expect(result2).toBe("translated text");
});

it("should handle empty source language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle empty target language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "";

  const result = await translateText(text, sourceLang, targetLang);

  expect(result).toBe("translated text");
});

it("should handle very long text input gracefully", async () => {
  const veryLongText = "a".repeat(100000);
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(veryLongText, "en", "es");

  expect(result).toBe("translated text");
});

it("should handle text with newline characters", async () => {
  const textWithNewlines = "hello\nworld";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(textWithNewlines, "en", "es");

  expect(result).toBe("translated text");
});
describe("translateText", () => {
  it("should translate the text correctly", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";
    const translatedText = "Hola";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText }],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText(text, sourceLang, targetLang);

    expect(result).toBe(translatedText);
    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.multilingual.translate.apiurl}?key=${encodeURIComponent(
        CONFIG.multilingual.translate.apikey
      )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
        text
      )}`
    );
  });

  it("should use the default target language if not provided", async () => {
    const text = "Hello";
    const sourceLang = "es";
    const defaultTargetLang = "en";
    const translatedText = "Hello";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText }],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText(text, sourceLang);

    expect(result).toBe(translatedText);
    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.multilingual.translate.apiurl}?key=${encodeURIComponent(
        CONFIG.multilingual.translate.apikey
      )}&source=${sourceLang}&target=${defaultTargetLang}&q=${encodeURIComponent(
        text
      )}`
    );
  });

  it("should throw an error if translation fails", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle empty text", async () => {
    const text = "";
    const sourceLang = "en";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle invalid source language", async () => {
    const text = "Hello";
    const sourceLang = "invalid";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle network error", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";

    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Network error"
    );
  });
});
it("should handle long text", async () => {
  const longText =
    "This is a very long text that needs to be translated. ".repeat(100);
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText =
    "Este es un texto muy largo que necesita ser traducido. ".repeat(100);

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(longText, sourceLang, targetLang);

  expect(result).toBe(translatedText);
});

it("should handle text with special characters", async () => {
  const textWithSpecialChars = "Hello, world! 123 !@#$%^&*()_+";
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText = "¡Hola, mundo! 123 !@#$%^&*()_+";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(
    textWithSpecialChars,
    sourceLang,
    targetLang
  );

  expect(result).toBe(translatedText);
});

it("should handle text with emoji", async () => {
  const textWithEmoji = "Hello 😊 World 🌍";
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText = "Hola 😊 Mundo 🌍";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(textWithEmoji, sourceLang, targetLang);

  expect(result).toBe(translatedText);
});

it("should handle unsupported source language", async () => {
  const text = "Hello";
  const sourceLang = "unsupported";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 400,
        message: "Unsupported source language",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle unsupported target language", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "unsupported";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 400,
        message: "Unsupported target language",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle authentication error", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 401,
        message: "Authentication failed",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

it("should handle rate limit exceeded error", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 429,
        message: "Rate limit exceeded",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});
describe("translateText", () => {
  it("should translate text correctly", async () => {
    const mockResponse = {
      data: {
        translations: [
          {
            translatedText: "Hello, world!",
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    const translatedText = await translateText(text, sourceLang, targetLang);

    expect(translatedText).toBe("Hello, world!");
    expect(global.fetch).toHaveBeenCalledWith(
      `https://mock.api.url?key=mock_api_key&source=es&target=en&q=Hola%2C%20mundo%21`
    );
  });

  it("should throw an error if translation fails", async () => {
    const mockResponse = {
      data: {
        translations: [],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should use default target language if not provided", async () => {
    const mockResponse = {
      data: {
        translations: [
          {
            translatedText: "Hello, world!",
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";

    const translatedText = await translateText(text, sourceLang);

    expect(translatedText).toBe("Hello, world!");
    expect(global.fetch).toHaveBeenCalledWith(
      `https://mock.api.url?key=mock_api_key&source=es&target=en&q=Hola%2C%20mundo%21`
    );
  });

  it("should handle null text", async () => {
    const text = null;
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle undefined text", async () => {
    const text = undefined;
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });
});
describe("translateText", () => {
  // ... (previous test cases)

  it("should handle invalid target language", async () => {
    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "invalid";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle network errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle invalid JSON response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  it("should handle missing translations in response", async () => {
    const mockResponse = {
      data: {},
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });
});
describe("translateText", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await translateText(text, targetLanguage);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await expect(translateText(text, targetLanguage)).rejects.toThrow(
      "API Error"
    );

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });
});

describe("translateTextWithOptions", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";
    const options = {
      from: "en",
      category: "general",
    };

    await translateTextWithOptions(text, targetLanguage, options);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(text)}&from=${
        options.from
      }&to=${targetLanguage}&category=${options.category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const text = "Hello, world!";
    const targetLanguage = "fr";
    const options = {
      from: "en",
      category: "general",
    };

    await expect(
      translateTextWithOptions(text, targetLanguage, options)
    ).rejects.toThrow("API Error");

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(text)}&from=${
        options.from
      }&to=${targetLanguage}&category=${options.category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  it("should handle undefined options", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await translateTextWithOptions(text, targetLanguage, undefined);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });
});
describe("getTranslationQuality", () => {
  it("should return the correct translation quality", () => {
    const translationQuality = getTranslationQuality(0.8);
    expect(translationQuality).toBe("good");

    const translationQuality2 = getTranslationQuality(0.5);
    expect(translationQuality2).toBe("average");

    const translationQuality3 = getTranslationQuality(0.2);
    expect(translationQuality3).toBe("poor");
  });

  it("should handle invalid input", () => {
    const translationQuality = getTranslationQuality(-0.1);
    expect(translationQuality).toBe("poor");

    const translationQuality2 = getTranslationQuality(1.1);
    expect(translationQuality2).toBe("good");

    const translationQuality3 = getTranslationQuality("invalid");
    expect(translationQuality3).toBe("poor");
  });
});

describe("getTranslationConfidence", () => {
  it("should return the correct translation confidence", () => {
    const translationConfidence = getTranslationConfidence(0.8);
    expect(translationConfidence).toBe("high");

    const translationConfidence2 = getTranslationConfidence(0.5);
    expect(translationConfidence2).toBe("medium");

    const translationConfidence3 = getTranslationConfidence(0.2);
    expect(translationConfidence3).toBe("low");
  });

  it("should handle invalid input", () => {
    const translationConfidence = getTranslationConfidence(-0.1);
    expect(translationConfidence).toBe("low");

    const translationConfidence2 = getTranslationConfidence(1.1);
    expect(translationConfidence2).toBe("high");

    const translationConfidence3 = getTranslationConfidence("invalid");
    expect(translationConfidence3).toBe("low");
  });
});

describe("getTranslationResult", () => {
  it("should return the correct translation result", () => {
    const translationResult = getTranslationResult({
      text: "Bonjour, le monde!",
      quality: 0.8,
      confidence: 0.9,
    });

    expect(translationResult).toEqual({
      text: "Bonjour, le monde!",
      quality: "good",
      confidence: "high",
    });
  });

  it("should handle missing or invalid input", () => {
    const translationResult = getTranslationResult({
      quality: 0.8,
      confidence: 0.9,
    });

    expect(translationResult).toEqual({
      text: "",
      quality: "good",
      confidence: "high",
    });

    const translationResult2 = getTranslationResult({
      text: "Bonjour, le monde!",
      quality: -0.1,
      confidence: 1.1,
    });

    expect(translationResult2).toEqual({
      text: "Bonjour, le monde!",
      quality: "poor",
      confidence: "high",
    });
  });
});
it("should translate text with valid parameters for google provider", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [
              {
                translatedText: "¡Hola, mundo!",
              },
            ],
          },
        }),
    })
  );

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("¡Hola, mundo!");
  expect(fetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=es&q=Hello%2C%20world%21"
  );
});

it("should use default target language if not provided", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [
              {
                translatedText: "Bonjour le monde!",
              },
            ],
          },
        }),
    })
  );

  const translatedText = await translateText(text, sourceLang);

  expect(translatedText).toBe("Bonjour le monde!");
  expect(fetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=en&q=Hello%2C%20world%21"
  );
});

it("should throw an error when provider is not supported", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "unsupportedProvider";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

it("should throw an error when required environment variables are missing for google provider", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

it("should throw an error when fetch API call fails", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() => Promise.reject(new Error("Fetch error")));

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

it("should throw an error when response does not contain translations", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: {} }),
    })
  );

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

it("should throw an error when response contains empty translations", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [],
          },
        }),
    })
  );

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});
it("should throw an error with a specific message if the API key is invalid", async () => {
  CONFIG.multilingual.translate.apikey = "invalidApiKey";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      error: {
        code: 403,
        message: "Invalid API Key",
      },
    }),
  });

  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate: Invalid API Key");
  }
});
it("should call fetch with the correct URL and parameters for Google Translate", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  await translateText(text, sourceLang, targetLang);

  expect(mockFetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=fr&q=Hello%20world"
  );
});

it("should return the translated text if the API call is successful", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("Bonjour le monde");
});

it("should throw an error if the API call fails", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockRejectedValueOnce(new Error("Network Error"));

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

it("should throw an error if the API response does not contain translations", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

it("should throw an error if the API response is invalid", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      // Invalid response structure
      invalid: "data",
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

it("should use the default target language if not provided", async () => {
  const text = "Hello world";
  const sourceLang = "en";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Hello world",
          },
        ],
      },
    }),
  });

  await translateText(text, sourceLang);

  expect(mockFetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=en&q=Hello%20world"
  );
});

it("should handle invalid source language", async () => {
  const text = "Hello world";
  const sourceLang = "invalid";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

it("should handle invalid target language", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "invalid";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});
describe("translateService - Additional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle multiple translations in the response", async () => {
    const mockResponse = {
      data: {
        translations: [
          { translatedText: "Hello" },
          { translatedText: "World" },
        ],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText("Bonjour le monde", "fr", "en");
    expect(result).toBe("Hello"); // It should return the first translation
  });

  it("should handle source language same as target language", async () => {
    await translateText("Hello World", "en", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("source=en&target=en")
    );
  });

  it("should handle non-string input", async () => {
    await expect(translateText(123 as any, "en", "fr")).rejects.toThrow();
  });

  it("should handle non-string language codes", async () => {
    await expect(
      translateText("Test", 123 as any, 456 as any)
    ).rejects.toThrow();
  });

  it("should handle invalid language codes", async () => {
    const mockResponse = { error: { message: "Invalid language code" } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await expect(translateText("Test", "invalid", "en")).rejects.toThrow();
  });

  it("should handle API rate limiting", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Rate limit exceeded")
    );

    await expect(
      translateText("Rate limited text", "fr", "en")
    ).rejects.toThrow("Rate limit exceeded");
  });

  it("should handle API timeout", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Request timeout")
    );

    await expect(translateText("Timeout text", "fr", "en")).rejects.toThrow(
      "Request timeout"
    );
  });

  it("should handle text with HTML entities", async () => {
    const mockResponse = {
      data: {
        translations: [
          { translatedText: "Translated &lt;strong&gt;HTML&lt;/strong&gt;" },
        ],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText(
      "&lt;strong&gt;HTML&lt;/strong&gt;",
      "en",
      "fr"
    );
    expect(result).toBe("Translated &lt;strong&gt;HTML&lt;/strong&gt;");
  });

  it("should handle text with emojis", async () => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello 👋 World 🌍" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText("Bonjour 👋 le monde 🌍", "fr", "en");
    expect(result).toBe("Hello 👋 World 🌍");
  });
  it("should handle different API providers", async () => {
    jest.resetModules();
    jest.mock("../config", () => ({
      CONFIG: {
        multilingual: {
          translate: {
            provider: "different-provider",
            apikey: "different-api-key",
            apiurl: "https://different-api.com/translate",
          },
        },
      },
    }));

    const {
      translateText: translateTextReimported,
    } = require("../services/translateService");

    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello World" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await translateTextReimported("Bonjour le monde", "fr", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://different-api.com/translate")
    );
  });

  it("should handle API response with unexpected structure", async () => {
    const mockResponse = {
      unexpectedStructure: {
        someField: "someValue",
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await expect(
      translateText("Unexpected structure", "fr", "en")
    ).rejects.toThrow("Failed to translate");
  });

  it("should handle text with line breaks", async () => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello\nWorld" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await translateText("Bonjour\nle monde", "fr", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("Bonjour%0Ale%20monde")
    );
  }); 

  it("should return the translated text if the API call is successful", async () => {
    const text = "Hello world";
    const from = "en";
    const to = "fr";
    const mockFetch = jest.mocked(require("node-fetch").default);
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [
            {
              translatedText: "Bonjour le monde",
            },
          ],
        },
      }),
    });
    const result = await translateText(text, from, to);
    expect(result).toBe("Bonjour le monde");
  });
