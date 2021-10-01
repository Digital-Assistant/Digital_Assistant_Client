var s = document.createElement('script');
var logscript = document.createElement('script');
var logscriptpath = chrome.extension.getURL('js/log4js-2.0.0/js/log4js.min.js');
logscript.src = logscriptpath;
logscript.async = false;
(document.head || document.documentElement).appendChild(logscript);
var scriptpath = chrome.extension.getURL('js/links.js');
s.src = scriptpath;
s.onload = function() {
};
// (document.head || document.documentElement).appendChild(s);
