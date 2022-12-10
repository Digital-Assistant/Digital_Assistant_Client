let s = document.createElement('script');
let scriptpath = chrome?.runtime?.getURL("assets/UdanHeaders.js");
s.src = scriptpath;
s.onload = function() {
};
(document.head || document.documentElement).appendChild(s);
