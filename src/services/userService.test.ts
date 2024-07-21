import { getFromStore } from "../util";
import { CONFIG } from "../config";
import { getUserId, getSessionKey } from "./userService";

jest.mock("../util", () => ({
  getFromStore: jest.fn(),
}));

jest.mock("../config", () => ({
  CONFIG: {
    USER_AUTH_DATA_KEY: "userAuthData",
  },
}));

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserId", () => {
    it("should return user ID if authData is present", async () => {
      const mockUserSessionData = {
        authData: {
          id: "mockUserId",
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBe("mockUserId");
    });

    it("should return null if authData is not present", async () => {
      const mockUserSessionData = {
        authData: null,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should return null if userSessionData is not present", async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error("Storage Error"));

      await expect(getUserId()).rejects.toThrow("Storage Error");
      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
    });
  });

  describe("getSessionKey", () => {
    it("should return session key if present", async () => {
      const mockUserSessionData = {
        sessionKey: "mockSessionKey",
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBe("mockSessionKey");
    });

    it("should return null if session key is not present", async () => {
      const mockUserSessionData = {
        sessionKey: null,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should return null if userSessionData is not present", async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error("Storage Error"));

      await expect(getSessionKey()).rejects.toThrow("Storage Error");
      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
    });
  });
});
describe("userService", () => {
  // ... (previous test cases)

  describe("getUserId", () => {
    // ... (previous test cases)

    it("should return null if authData does not contain an ID", async () => {
      const mockUserSessionData = {
        authData: {
          name: "John Doe",
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should return null if authData contains an empty ID", async () => {
      const mockUserSessionData = {
        authData: {
          id: "",
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should handle undefined userSessionData gracefully", async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const result = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });
  });

  describe("getSessionKey", () => {
    // ... (previous test cases)

    it("should return null if sessionKey is an empty string", async () => {
      const mockUserSessionData = {
        sessionKey: "",
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should handle undefined userSessionData gracefully", async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBeNull();
    });

    it("should handle invalid sessionKey type gracefully", async () => {
      const mockUserSessionData = {
        sessionKey: 123, // Invalid type (number instead of string)
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const result = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(
        CONFIG.USER_AUTH_DATA_KEY,
        false
      );
      expect(result).toBe(123); // Expecting the invalid value to be returned as is
    });
  });

  describe("Error handling", () => {
    it("should handle errors thrown by getFromStore", async () => {
      const errorMessage = "Storage error";
      (getFromStore as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getUserId()).rejects.toThrow(errorMessage);
      await expect(getSessionKey()).rejects.toThrow(errorMessage);
    });

    it("should handle errors thrown by async operations", async () => {
      const errorMessage = "Async error";
      (getFromStore as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(getUserId()).rejects.toThrow(errorMessage);
      await expect(getSessionKey()).rejects.toThrow(errorMessage);
    });
  });
});
