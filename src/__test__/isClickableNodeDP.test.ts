global.dmoJSON = {};

global.udaSpecialNodes = {};
global.UDAClickObjects = [];

import { isClickableNode } from "../util/isClickableNode";

test("isClickableNode - date picker", () => {
  const datePicker = document.createElement("input");
  datePicker.setAttribute("type", "date");
  datePicker.id = "DatePickerTest";
  document.body.appendChild(datePicker);
  const datePickerElement = document.getElementById("DatePickerTest");
  global.UDAClickObjects = [];
  global.UDAClickObjects.push({ element: datePickerElement, id: 1 });
  expect(datePickerElement).toBeTruthy();
});
test("isClickableNode - date picker", () => {
  const datePicker = '<input type="date" id="DatePickerTest"/>';
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(datePicker, "text/html");
  const datePickerElement = htmlDoc.getElementById("DatePickerTest");
  document.body.appendChild(datePickerElement);
});
