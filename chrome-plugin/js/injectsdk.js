var s = document.createElement('script');
var scriptpath = chrome.runtime.getURL("js/Voicepluginsdk.js");
s.src = scriptpath;
s.onload = function() {
};
(document.body || document.documentElement).appendChild(s);

document.addEventListener("RequestUDASessionData", function(data) {
	chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
});

document.addEventListener("UDADebugSetEvent", function(data) {
	chrome.runtime.sendMessage({action:data.detail.data.action,data:data.detail.data.value});
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
