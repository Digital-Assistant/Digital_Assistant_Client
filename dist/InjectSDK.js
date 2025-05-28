let s1 = document.createElement('script');
let scriptPath = chrome?.runtime?.getURL("assets/UDASdk.js");
s1.src = scriptPath;
s1.onload = function() {
};
(document.body || document.documentElement).appendChild(s1);

document.addEventListener("RequestUDASessionData", function(data) {
    chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
});

document.addEventListener("UDADebugSetEvent", function(data) {
    chrome.runtime.sendMessage({action:data.detail.data.action,data:data.detail.data.value});
});

/**
 * create keycloak storage to chrome
 */
document.addEventListener("CreateUDASessionData", function(data) {
    chrome.runtime.sendMessage({action:data.detail.action,data:data.detail.data});
});

/**
 * listener for removed additional data that was added by the frameworks
 */
document.addEventListener("UDANodeData", function(data) {
    console.log('nodedata listener');
    console.log({node: data.relatedTarget});
    // document.dispatchEvent(new MouseEvent("UDASaveNodeData", {relatedTarget: data.relatedTarget}));
    document.dispatchEvent(new CustomEvent("UDASaveNodeData",{detail: {data: {jsonData: domJSON.toJSON(data.relatedTarget)}}}));
});

chrome.runtime.onMessage.addListener(function(request) {
    if(request.action==="UDAUserSessionData"){
        document.dispatchEvent(new CustomEvent("UDAUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
    } else if(request.action==="UDAAuthenticatedUserSessionData"){
        document.dispatchEvent(new CustomEvent("UDAAuthenticatedUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
    } else if(request.action==="UDAAlertMessageData"){
        document.dispatchEvent(new CustomEvent("UDAAlertMessageData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
    }
});
