var s = document.createElement('script');
var scriptpath = chrome.extension.getURL("js/logtest.js");
s.src = scriptpath;
s.onload = function() {
};
(document.body || document.documentElement).appendChild(s);
