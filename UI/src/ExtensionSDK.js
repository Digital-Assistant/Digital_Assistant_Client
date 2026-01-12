let s1 = document.createElement('script');
let scriptPath = chrome?.runtime?.getURL("assets/UDASdk.js");
s1.src = scriptPath;
s1.onload = function() {
};
(document.body || document.documentElement).appendChild(s1);