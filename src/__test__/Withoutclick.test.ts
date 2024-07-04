global.dmoJSON = {};

global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { initSpecialNodes } from "../util/initSpecialNodes";
import { isClickableNode } from "../util/isClickableNode";

describe("Clickable Node Tests", () => {
  beforeAll(() => {
    global.UDAClickObjects = [];
  });

  test("isClickableNode - button", async () => {
    await initSpecialNodes();
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.id = "Test";
    document.body.appendChild(button);
    const buttonElement = document.getElementById("Test");
    // window.getComputedStyle = jest.fn().mockReturnValue({ cursor: 'pointer' });
    expect(isClickableNode(button)).toBe(true);
  });
});
