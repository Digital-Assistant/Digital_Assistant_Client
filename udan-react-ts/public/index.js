/*chrome.runtime.sendMessage({ action: "login" }, function (response) {
    console.log(response);
    const event = new CustomEvent(eventName, { detail: response });
    document.dispatchEvent(event);
});*/

 /*setTimeout(() => {
    chrome.storage.local.get().then((data) => {
    if (data) {
        if (!localStorage.getItem('udaUserData') || localStorage.getItem('udaUserData') === "undefined") {
            localStorage.setItem("udaUserData", data.udaUserData);
            const authData = JSON.parse(data.udaUserData);
            localStorage.setItem("udaSessionId", authData?.authdata?.id);
        }
    }
    });
 }, 5000);*/

var s = document.createElement('script');
var scriptpath = chrome?.runtime?.getURL("assets/bundle.js");
s.src = scriptpath;
s.onload = function() {
};
(document.body || document.documentElement).appendChild(s);

document.addEventListener("RequestUDASessionData", function(data) {
    console.log('Requesting data');
    chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
});

document.addEventListener("UDADebugSetEvent", function(data) {
    chrome.runtime.sendMessage({action:data.detail.data.action,data:data.detail.data.value});
});

/**
 * create keycloak storage to chrome
 */
document.addEventListener("CreateUDASessionData", function(data) {
    console.log('Create session data');
    chrome.runtime.sendMessage({action:data.detail.action,data:data.detail.data});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action==="UDAUserSessionData"){
        var sessionevent = new CustomEvent("UDAUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false});
        document.dispatchEvent(sessionevent);
    } else if(request.action==="UDAAuthenticatedUserSessionData"){
        var sessionevent = new CustomEvent("UDAAuthenticatedUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false});
        document.dispatchEvent(sessionevent);
    } else if(request.action==="UDAAlertMessageData"){
        var sessionevent = new CustomEvent("UDAAlertMessageData", {detail: {data: request.data}, bubbles: false, cancelable: false});
        document.dispatchEvent(sessionevent);
    }
});
