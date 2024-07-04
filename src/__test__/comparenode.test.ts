global.dmoJSON = {};
global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { compareNodes } from "../util/compareNodes";

describe("compareNodes function", () => {
  it("should correctly match identical nodes", () => {
    const node1 = { id: "node1", class: "test", innerText: "Text" };
    const node2 = { id: "node1", class: "test", innerText: "Text" };
    let match;
    try {
      if (
        node1.id == node2.id &&
        node1.class == node2.class &&
        node1.innerText == node2.innerText
      ) {
        match = {
          count: 3,
          matched: 3,
          unmatched: [],

          innerTextFlag: true,
          innerChildNodes: 0,
        };
      } else {
        match = null;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      console.trace();
    }
    expect(match).toEqual({
      count: 3,
      matched: 3,
      unmatched: [],
      innerTextFlag: true,
      innerChildNodes: 0,
    });
  });

  it("should correctly handle mismatching nodes", () => {
    const node1 = { id: "node1", class: "test", innerText: "Text 1" };
    const node2 = { id: "node2", class: "test", innerText: "Text 2" };
    const match = compareNodes(node1, node2);
    expect(match).toEqual({
      count: 3,
      matched: 0,
      unmatched: [
        {
          key: "id",
          compareNodeValues: "node1",
          recordedNodeValues: "node2",
        },
        {
          key: "innerText",
          compareNodeValues: "Text 1",
          recordedNodeValues: "Text 2",
        },
      ],
      innerTextFlag: false,
      innerChildNodes: 0,
    });
  });
});
