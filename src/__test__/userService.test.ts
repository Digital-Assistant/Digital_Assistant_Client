import { getUserId, getSessionKey } from "../services/userService";
import { getFromStore } from "../util";
import { CONFIG } from "../config";

jest.mock("../util", () => ({
  getFromStore: jest.fn(),
}));

describe("userService functions", () => {
  beforeEach(() => {
    (getFromStore as jest.Mock).mockClear();
  });

  it("getUserId should return user id from storage data", async () => {
    const mockUserSessionData = { authdata: { id: "testUserId" } };
    (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBe("testUserId");
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });

  it("getSessionKey should return session key from storage data", async () => {
    const mockUserSessionData = { sessionkey: "testSessionKey" };
    (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBe("testSessionKey");
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });

  it("getUserId should return null if user id is not found in storage data", async () => {
    (getFromStore as jest.Mock).mockResolvedValue(null);

    const userId = await getUserId();

    expect(userId).toBeNull();
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });

  it("getSessionKey should return null if session key is not found in storage data", async () => {
    (getFromStore as jest.Mock).mockResolvedValue({});

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });
});
it("getUserId should return null if user id is missing in storage data", async () => {
  (getFromStore as jest.Mock).mockResolvedValue({});

  const userId = await getUserId();

  expect(userId).toBeNull();
  expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
});

it("getSessionKey should return null if session key is missing in storage data", async () => {
  (getFromStore as jest.Mock).mockResolvedValue({
    authdata: { id: "testUserId" },
  });

  const sessionKey = await getSessionKey();

  expect(sessionKey).toBeNull();
  expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
});
it("getUserId should handle error in retrieving data from storage", async () => {
  (getFromStore as jest.Mock).mockRejectedValue(new Error("Storage Error"));

  await expect(getUserId()).rejects.toThrow("Storage Error");
});

it("getSessionKey should handle error in retrieving data from storage", async () => {
  (getFromStore as jest.Mock).mockRejectedValue(new Error("Storage Error"));

  await expect(getSessionKey()).rejects.toThrow("Storage Error");
});
it("getUserId should handle different storage data structures", async () => {
  (getFromStore as jest.Mock).mockResolvedValue({
    authdata: { id: "testUserId" },
  });

  const userId = await getUserId();

  expect(userId).toBe("testUserId");
});

it("getSessionKey should handle different storage data structures", async () => {
  (getFromStore as jest.Mock).mockResolvedValue({
    sessionkey: "testSessionKey",
  });

  const sessionKey = await getSessionKey();

  expect(sessionKey).toBe("testSessionKey");
});
