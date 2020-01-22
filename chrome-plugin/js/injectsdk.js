var s = document.createElement('script');
var scriptpath = chrome.extension.getURL("js/Voicepluginsdk.js");
s.src = scriptpath;
s.onload = function() {
};
(document.body || document.documentElement).appendChild(s);

document.addEventListener("RequestSessiondata", function(data) {
	chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action==="Usersessiondata"){
		var sessionevent = new CustomEvent("Usersessiondata", {detail: {data: request.data}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(request.action==="AuthenticatedUsersessiondata"){
		var sessionevent = new CustomEvent("AuthenticatedUsersessiondata", {detail: {data: request.data}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(request.action==="Alertmessagedata"){
		var sessionevent = new CustomEvent("Alertmessagedata", {detail: {data: request.data}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	}
});