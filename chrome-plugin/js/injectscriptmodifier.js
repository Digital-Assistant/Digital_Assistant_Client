console.log('in injectscriptmodifier ');

var s = document.createElement('script');
var scriptpath = chrome.runtime.getURL("js/injectscriptmodifier2.js");
s.src = scriptpath;
s.onload = function() {
};

(document.head || document.documentElement).appendChild(s);



console.log(s);

console.log('exiting injectscriptmodifier ');
