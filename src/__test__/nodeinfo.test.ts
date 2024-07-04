global.dmoJSON = {};
global.udaSpecialNodes = {};
global.UDAClickObjects = [];
import {
  getNodeInfo,
  getScreenSize,
  getNodeCoordinates,
} from "../util/nodeInfo";

describe("getNodeInfo", () => {
  it("should return the correct node information", () => {
    const node = document.createElement("div");
    node.getBoundingClientRect = (): DOMRect => ({
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      top: 10,
      right: 100,
      bottom: 200,
      left: 0,
      toJSON: () => ({}),
    });

    const screenSize = { scrollInfo: { scrollTop: 5, scrollLeft: 15 } };

    const nodeInfo = {
      nodePosition: {
        top: 10,
        left: 20,
        width: 100,
        height: 200,
      },
      screenSize,
      nodePagePosition: {
        top: 10 + screenSize.scrollInfo.scrollTop,
        left: 20 + screenSize.scrollInfo.scrollLeft,
      },
    };

    expect(nodeInfo.nodePosition).toEqual({
      top: 10,
      left: 20,
      width: 100,
      height: 200,
    });
    expect(nodeInfo.screenSize).toEqual(screenSize);
    expect(nodeInfo.nodePagePosition.top).toEqual(
      10 + screenSize.scrollInfo.scrollTop
    );
    expect(nodeInfo.nodePagePosition.left).toEqual(
      20 + screenSize.scrollInfo.scrollLeft
    );
  });
});

describe("getScreenSize", () => {
  test("returns correct screen size object", () => {
    const screenSize = getScreenSize();

    expect(screenSize).toEqual(
      expect.objectContaining({
        page: expect.objectContaining({
          height: expect.any(Number),
          width: expect.any(Number),
        }),
        screen: expect.any(Object),
        scrollInfo: expect.objectContaining({
          scrollTop: expect.any(Number),
          scrollLeft: expect.any(Number),
        }),
      })
    );
  });
});

describe("getNodeCoordinates", () => {
  it("should return the correct node coordinates", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = jest
      .fn()
      .mockReturnValue({ top: 10, left: 20, width: 100, height: 200 });

    const windowSize = getScreenSize();
    const nodeCoordinates = getNodeCoordinates(element, windowSize);

    expect(nodeCoordinates).toEqual({
      top: 10 + windowSize.scrollInfo.scrollTop,
      width: 100,
      height: 200,
      left: 20 + windowSize.scrollInfo.scrollLeft,
      actualPos: { top: 10, left: 20, width: 100, height: 200 },
    });
  });
});
