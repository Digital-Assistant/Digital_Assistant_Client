// sending the request back to the webpage for further processing.
import {UDASessionData} from "../../models/UDASessionData";

import {getBrowserVar, getUDABrowserPlugin} from "../browser/browserConstants";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";
import {getTab} from "../screen";

export const UDASendSessionData = async (udaSessionData: UDASessionData, sendAction = "UDAUserSessionData", message = '') => {
  if(getUDABrowserPlugin()===true){
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
    if(!tab){
      console.log('No active tab identified.');
      return false;
    }
    if (sendAction === "UDAAlertMessageData") {
      await getBrowserVar().tabs.sendMessage(tab.id, {action: sendAction, data: message});
      return true;
    } else {
      // Logic to add the authtoken to the session data
      if(!udaSessionData.authData.hasOwnProperty('token')){
        await UDABindAuthenticatedAccount(udaSessionData, false);
      } else {
        await getBrowserVar().tabs.sendMessage(tab.id, {action: sendAction, data: JSON.stringify(udaSessionData)});
      }
      return true;
    }
}
