var loggerscript = document.createElement('script');
var loggerscriptpath = chrome.extension.getURL('js/log4js/js/log4js.min.js');
loggerscript.src = loggerscriptpath;
loggerscript.async = false;
loggerscript.onload = function() {
};
(document.head || document.documentElement).appendChild(loggerscript);

var s = document.createElement('script');
var scriptpath = chrome.extension.getURL('js/links.js');
s.src = scriptpath;
s.async = false;
s.onload = function() {
};
(document.head || document.documentElement).appendChild(s);
