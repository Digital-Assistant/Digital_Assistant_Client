let s = document.createElement("script"),
    scriptpath = chrome?.runtime?.getURL("assets/UDAHeaders.js");
(s.src = scriptpath),
    (s.onload = function () {}),
    (document.head || document.documentElement).appendChild(s);
