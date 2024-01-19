// sending the request back to the webpage for further processing.
import {UDASessionData} from "../models/UDASessionData";
import {getTab} from "./getTab";
import {browserVar, UDABrowserPlugin} from "../BrowserConstants";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";

export const UDASendSessionData = async (udaSessionData: UDASessionData, sendAction = "UDAUserSessionData", message = '') => {
  if(UDABrowserPlugin===true){
    await UDASendSessionDataToBackground(udaSessionData, sendAction, message);
  } else {
    let sessionEvent: any = {};
    switch (sendAction) {
      case "UDAUserSessionData":
        sessionEvent = new CustomEvent("UDAUserSessionData", {
          detail: {data: JSON.stringify(udaSessionData)},
          bubbles: false,
          cancelable: false
        });
        break;
      case "UDAAuthenticatedUserSessionData":
        sessionEvent = new CustomEvent("UDAAuthenticatedUserSessionData", {
          detail: {data: JSON.stringify(udaSessionData)},
          bubbles: false,
          cancelable: false
        });
        break;
      case "UDAAlertMessageData":
        sessionEvent = new CustomEvent("UDAAlertMessageData", {
          detail: {data: message},
          bubbles: false,
          cancelable: false
        });
        break;
    }
    document.dispatchEvent(sessionEvent);
  }
}

export const UDASendSessionDataToBackground = async (udaSessionData: UDASessionData, sendAction = "UDAUserSessionData", message = '') => {
    let tab = await getTab();
    if (sendAction === "UDAAlertMessageData") {
      await browserVar.tabs.sendMessage(tab.id, {action: sendAction, data: message});
      return true;
    } else {
      // Logic to add the authtoken to the session data
      if(!udaSessionData.authData.hasOwnProperty('token')){
        await UDABindAuthenticatedAccount(udaSessionData, false);
      } else {
        await browserVar.tabs.sendMessage(tab.id, {action: sendAction, data: JSON.stringify(udaSessionData)});
      }
      return true;
    }
}
