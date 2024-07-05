import { getUserId, getSessionKey } from "../services/userService";
import { getFromStore } from "../util";
import { CONFIG } from "../config";

jest.mock("../util", () => ({
  getFromStore: jest.fn(),
}));

describe("userService - Extended Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserId - Additional Tests", () => {
    it("should handle empty string id", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        authData: { id: "" },
      });

      const result = await getUserId();
      expect(result).toBe("");
    });

    it("should handle non-string id", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        authData: { id: 12345 },
      });

      const result = await getUserId();
      expect(result).toBe(12345);
    });

    it("should handle undefined authData", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        authData: undefined,
      });

      const result = await getUserId();
      expect(result).toBeNull();
    });

    it("should handle null authData", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        authData: null,
      });

      const result = await getUserId();
      expect(result).toBeNull();
    });
  });

  describe("getSessionKey - Additional Tests", () => {
    it("should handle empty string sessionKey", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionKey: "",
      });

      const result = await getSessionKey();
      expect(result).toBe("");
    });

    it("should handle non-string sessionKey", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionKey: 12345,
      });

      const result = await getSessionKey();
      expect(result).toBe(12345);
    });

    it("should handle undefined sessionKey", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionKey: undefined,
      });

      const result = await getSessionKey();
      expect(result).toBeNull();
    });

    it("should handle null sessionKey", async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionKey: null,
      });

      const result = await getSessionKey();
      expect(result).toBeNull();
    });
  });

  describe("Error Handling - Additional Tests", () => {
    it("should handle network errors", async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(getUserId()).rejects.toThrow("Network error");
      await expect(getSessionKey()).rejects.toThrow("Network error");
    });

    it("should handle timeout errors", async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error("Timeout"));

      await expect(getUserId()).rejects.toThrow("Timeout");
      await expect(getSessionKey()).rejects.toThrow("Timeout");
    });
  });

  describe("Performance - Additional Tests", () => {
    it("should handle large data objects", async () => {
      const largeObject = {
        authData: { id: "large-id" },
        sessionKey: "large-key",
      };
      for (let i = 0; i < 10000; i++) {
        largeObject[`key${i}`] = `value${i}`;
      }
      (getFromStore as jest.Mock).mockResolvedValue(largeObject);

      const userId = await getUserId();
      const sessionKey = await getSessionKey();

      expect(userId).toBe("large-id");
      expect(sessionKey).toBe("large-key");
    });
  });

  describe("Security - Additional Tests", () => {
    it("should not expose sensitive data in error messages", async () => {
      (getFromStore as jest.Mock).mockRejectedValue(
        new Error("Error with sensitive data: ABC123")
      );

      await expect(getUserId()).rejects.toThrow(/Error/);
      await expect(getUserId()).rejects.not.toThrow(/ABC123/);
    });
  });

  describe("Compatibility - Additional Tests", () => {
    it("should handle different versions of stored data format", async () => {
      // Old format
      (getFromStore as jest.Mock).mockResolvedValueOnce({
        user: { id: "old-id" },
        session: "old-key",
      });

      let userId = await getUserId();
      let sessionKey = await getSessionKey();

      expect(userId).toBeNull();
      expect(sessionKey).toBeNull();

      // New format
      (getFromStore as jest.Mock).mockResolvedValueOnce({
        authData: { id: "new-id" },
        sessionKey: "new-key",
      });

      userId = await getUserId();
      sessionKey = await getSessionKey();

      expect(userId).toBe("new-id");
      expect(sessionKey).toBe("new-key");
    });
  });
});
