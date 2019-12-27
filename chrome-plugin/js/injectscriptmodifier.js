var s = document.createElement('script');
var scriptpath = chrome.extension.getURL('js/links.js');
s.src = scriptpath;
s.onload = function() {
	//this.remove();
};
(document.head || document.documentElement).appendChild(s);
/*
document.addEventListener("LinksEvent", function(data) {
	var url = window.location.href;
	chrome.runtime.sendMessage({action:"PostLinks",data:data.detail.data, url:url});
});*/
