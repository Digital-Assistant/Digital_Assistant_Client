let s1 = document.createElement("script"),
    scriptPath = chrome?.runtime?.getURL("assets/UdanSDK.js");
(s1.src = scriptPath),
    (s1.onload = function () {}),
    (document.body || document.documentElement).appendChild(s1),
    document.addEventListener("RequestUDASessionData", function (e) {
        chrome.runtime.sendMessage({
            action: e.detail.data,
            data: e.detail.data,
        });
    }),
    document.addEventListener("UDADebugSetEvent", function (e) {
        chrome.runtime.sendMessage({
            action: e.detail.data.action,
            data: e.detail.data.value,
        });
    }),
    document.addEventListener("CreateUDASessionData", function (e) {
        chrome.runtime.sendMessage({
            action: e.detail.action,
            data: e.detail.data,
        });
    }),
    chrome.runtime.onMessage.addListener(function (e) {
        "UDAUserSessionData" === e.action
            ? document.dispatchEvent(
                  new CustomEvent("UDAUserSessionData", {
                      detail: { data: e.data },
                      bubbles: !1,
                      cancelable: !1,
                  })
              )
            : "UDAAuthenticatedUserSessionData" === e.action
            ? document.dispatchEvent(
                  new CustomEvent("UDAAuthenticatedUserSessionData", {
                      detail: { data: e.data },
                      bubbles: !1,
                      cancelable: !1,
                  })
              )
            : "UDAAlertMessageData" === e.action &&
              document.dispatchEvent(
                  new CustomEvent("UDAAlertMessageData", {
                      detail: { data: e.data },
                      bubbles: !1,
                      cancelable: !1,
                  })
              );
    });
