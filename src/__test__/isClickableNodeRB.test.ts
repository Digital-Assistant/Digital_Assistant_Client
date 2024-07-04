global.dmoJSON = {};
global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { isClickableNode } from "../util/isClickableNode";

test("isClickableNode - radio - button", () => {
  const radio = document.createElement("input");
  radio.setAttribute("type", "radio");
  radio.id = "RadioTest";
  // radio.onclick = () => { };

  document.body.appendChild(radio);

  const radioElement = document.getElementById("RadioTest");
  global.UDAClickObjects.push({ element: radioElement, id: 1 });

  expect(isClickableNode(radioElement)).toBe(true);
});
