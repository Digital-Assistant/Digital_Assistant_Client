import { addNotification } from "../util/addNotification";
import { notification } from "antd";

jest.mock("antd", () => ({
  notification: {
    info: jest.fn(),
  },
}));

describe("addNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call notification.info with the correct arguments", () => {
    const mockTitle = "Test Title";
    const mockDescription = "Test Description";
    const mockPlacement = "top";

    addNotification(mockTitle, mockDescription, "info", mockPlacement);

    expect(notification.info).toHaveBeenCalledWith({
      message: mockTitle,
      description: mockDescription,
      placement: mockPlacement,
      getContainer: expect.any(Function),
    });
  });

  it("should call notification.info with default values if arguments are not provided", () => {
    addNotification();

    expect(notification.info).toHaveBeenCalledWith({
      message: "",
      description: "",
      placement: "top",
      getContainer: expect.any(Function),
    });
  });

  it("should call notification.info with the provided placement", () => {
    addNotification("Test Title", "Test Description", "info", "bottom");

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        placement: "bottom",
      })
    );
  });
  it("should call notification.info with the correct getContainer function", () => {
    const mockGetContainer = jest.fn();

    addNotification("Test Title", "Test Description", "info", "top");

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        getContainer: expect.any(Function),
      })
    );
  });
});
