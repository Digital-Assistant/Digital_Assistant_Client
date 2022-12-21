import {UDAErrorLogger} from "../config/error-log";
import {recordUserClick} from "./recordUserClick";
import {addEvent} from "./addEvent";

export const addClickToNode = (node: any) => {
  try {

    if (node.classList && node.classList.contains('uda_exclude')) {
      return;
    }

    if (node.hasOwnProperty("addedClickRecord") && node.addedClickRecord === true) {
      return;
    }

    let clickableNode = node;
    let recordNode = node;

    const nodeName = clickableNode.nodeName.toLowerCase();

    // fix for select2 library
    if(node.classList && node.classList.contains('select2-selection')){
      addEvent(node, 'focus', function(event: any){
        recordUserClick(recordNode, false, false, event);
      });
      node.addedClickRecord = true;
      return ;
    }

    switch (nodeName) {
      case "a":
        addEvent(clickableNode, "click", function (event: any) {
          recordUserClick(recordNode, false, false, event);
        });
        break;
      case "select":
        addEvent(clickableNode, "focus", function (event: any) {
          recordUserClick(recordNode, false, false, event);
        });
        break;
      case "input":
        if (!clickableNode.hasAttribute("type")) {
          addEvent(clickableNode, "click", function (event: any) {
            recordUserClick(recordNode, false, false, event);
          });
          return node;
        }
        const inputType = clickableNode.getAttribute("type").toLowerCase();
        switch (inputType) {
          case "email":
          case "text":
          case "button":
          case "color":
          case "date":
          case "datetime-local":
          case "file":
          case "hidden":
          case "image":
          case "month":
          case "number":
          case "password":
          case "range":
          case "reset":
          case "search":
          case "submit":
          case "tel":
          case "time":
          case "url":
          case "textarea":
          case "week":
            addEvent(clickableNode, "click", function (event: any) {
              recordUserClick(recordNode, false, false, event);
            });
            break;
          case "checkbox":
          case "radio":
            addEvent(clickableNode, "change", function (event: any) {
              recordUserClick(recordNode, false, false, event);
            });
            break;
          default:
            addEvent(clickableNode, "click", function (event: any) {
              recordUserClick(recordNode, false, false, event);
            });
            break;
        }
        break;
      case "mat-select":
      case "textarea":
      case "button":
      case "tr":
        addEvent(clickableNode, "click", function (event: any) {
          recordUserClick(recordNode, false, false, event);
        });
        break;
      default:
        addEvent(clickableNode, "click", function (event: any) {
          recordUserClick(recordNode, false, false, event);
        });
        break;
    }
    clickableNode.addedClickRecord = true;
    return node;
  } catch (e) {
    UDAErrorLogger.error(
        "Unable to add click to node " + node.outerHTML + " " + e
    );
  }
};
