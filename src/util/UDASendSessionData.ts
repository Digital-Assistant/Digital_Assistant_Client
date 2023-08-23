// sending the request back to the webpage for further processing.
export const UDASendSessionData = (udaSessionData: any, sendAction = "UDAUserSessionData", message = '') => {
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
