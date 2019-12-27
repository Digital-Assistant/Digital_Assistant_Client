var s = document.createElement('script');
var scriptpath = chrome.extension.getURL("js/Voicepluginsdk.js");
// console.log(scriptpath);
s.src = scriptpath;
s.onload = function() {
	// this.remove();
};
(document.body || document.documentElement).appendChild(s);
/*
document.dispatchEvent(new CustomEvent('extensionpath', {
	'detail': {
		'extensionpath': scriptpath
	}
}));
*/
/*
window.addEventListener('message', function receiveDuck(event) {
	console.log(event.data);
}, false);
*/
document.addEventListener("RequestSessiondata", function(data) {
	chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(request);
	if(request.action=="Usersessiondata"){
		//Voicepluginsdk.createsession(request.data);
		var sessionevent = new CustomEvent("Usersessiondata", {detail: {data: request.data}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(request.action=="AuthenticatedUsersessiondata"){
		//Voicepluginsdk.createsession(request.data);
		var sessionevent = new CustomEvent("AuthenticatedUsersessiondata", {detail: {data: request.data}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	}
});