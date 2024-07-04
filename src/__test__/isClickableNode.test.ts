global.dmoJSON = {};
global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { isClickableNode } from "../util/isClickableNode";
import { checkNodeValues } from "../util/checkNodeValues";

test("isClickableNode - div", () => {
  const node = document.createElement("div");
  expect(isClickableNode(node)).toBe(false);
});

test("isClickableNode - anchor", () => {
  const node = document.createElement("a");
  expect(isClickableNode(node)).toBe(false);
});

test("isClickableNode - button", () => {
  let html = `<button>test me</button>`;
  let htmlElement = document.createElement("div");
  htmlElement.innerHTML = html;
  expect(isClickableNode(htmlElement)).toBe(false);
});

test("isClickableNode - input", () => {
  const node = document.createElement("input");
  expect(isClickableNode(node)).toBe(false);
});

test("checkNodeValues", () => {
  const node = document.createElement("input");
  expect(checkNodeValues(node, "include")).toBe(false);
  expect(checkNodeValues(node, "exclude")).toBe(false);
  expect(checkNodeValues(node, "unknown")).toBe(false);
});

test("isClickableNode - button", () => {
  const button = document.createElement("button");
  button.id = "Test";
  button.setAttribute("onClick", "displaymessage();");
  document.body.appendChild(button);
  const buttonelement = document.getElementById("Test");
  global.UDAClickObjects = [];
  global.UDAClickObjects.push({ element: buttonelement, id: 1 });
  expect(isClickableNode(button)).toBe(true);
});
