chrome.runtime.sendMessage({ action: "login" }, function (response) {
    console.log(response);
});

 setTimeout(() => {
    chrome.storage.local.get().then((data) => {
    if (data) {
        if (!localStorage.getItem('udaUserData') || localStorage.getItem('udaUserData') === "undefined") {
            localStorage.setItem("udaUserData", data.udaUserData);
            const authData = JSON.parse(data.udaUserData);
            localStorage.setItem("udaSessionId", authData?.authdata?.id);
        }
    }
    });
 }, 5000);

var s = document.createElement('script');
var scriptpath = chrome?.runtime?.getURL("assets/bundle.js");
s.src = scriptpath;
s.onload = function() {
};
(document.body || document.documentElement).appendChild(s);