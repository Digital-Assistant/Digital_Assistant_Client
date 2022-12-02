import {CONFIG} from "../config";
import {UDAErrorLogger} from "../config/error-log";
import {addEvent, recordUserClick} from "./index";
import {isAllowedMiscElement} from "./isAllowedMiscElement";

export const addClickToNode = (node: any) => {
  try {

    if (node.classList && node.classList.contains('uda_exclude')) {
      return;
    }

    if (
        node.hasOwnProperty("addedclickrecord") &&
        node.addedclickrecord === true
    ) {
      return;
    }

    const nodeName = node.nodeName.toLowerCase();

    switch (nodeName) {
      case "a":
        addEvent(node, "click", function (event: any) {
          recordUserClick(event.target, false, false, event);
        });
        break;
      case "select":
        addEvent(node, "focus", function (event: any) {
          recordUserClick(event.target, false, false, event);
        });
        break;
      case "input":
        if (!node.hasAttribute("type")) {
          addEvent(node, "click", function (event: any) {
            recordUserClick(event.target, false, false, event);
          });
          return;
        }
        const inputType = node.getAttribute("type").toLowerCase();
        switch (inputType) {
          case "email":
          case "text":
          case "button":
          case "checkbox":
          case "color":
          case "date":
          case "datetime-local":
          case "file":
          case "hidden":
          case "image":
          case "month":
          case "number":
          case "password":
          case "radio":
          case "range":
          case "reset":
          case "search":
          case "submit":
          case "tel":
          case "text":
          case "time":
          case "url":
          case "textarea":
          case "week":
            addEvent(node, "click", function (event: any) {
              recordUserClick(node, false, false, event);
            });
            break;
          default:
            addEvent(node, "click", function (event: any) {
              recordUserClick(node, false, false, event);
            });
            break;
        }
        break;
      case "mat-select":
      case "textarea":
      case "button":
      case "tr":
        addEvent(node, "click", function (event: any) {
          recordUserClick(event.target, false, false, event);
        });
        break;
      default:
        addEvent(node, "click", function (event: any) {
          if (isAllowedMiscElement(event.target)) {
            recordUserClick(event.target, false, false, event);
          }
        });
        break;
    }
    node.addedclickrecord = true;
    CONFIG.clickObjects.push({nodeName: node.nodeName, node});
    return node;
  } catch (e) {
    UDAErrorLogger.error(
        "Unable to add click to node " + node.outerHTML + " " + e
    );
  }
};
