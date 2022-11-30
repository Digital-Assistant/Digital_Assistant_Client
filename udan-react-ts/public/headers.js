var s = document.createElement('script');
var scriptpath = chrome?.runtime?.getURL("assets/UdanHeaders.js");
s.src = scriptpath;
s.onload = function() {
};
(document.head || document.documentElement).appendChild(s);
