var _a;
import { checkBrowser } from "./util/checkBrowser";
import { checkScreenSize } from "./util/checkScreenSize";
let { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();
const { enablePluginForScreen, showScreenAlert } = checkScreenSize();
if (enableUDAPlugin === false) {
    console.log('Plugin disabled for browser: ' + udaIdentifiedBrowser.name);
}
else if (enablePluginForScreen === false) {
    console.log('Plugin disabled due to lower resolution');
}
else {
    console.log('Browser Enabled');
    let s1 = document.createElement('script');
    let scriptPath = (_a = udaBrowserVar === null || udaBrowserVar === void 0 ? void 0 : udaBrowserVar.runtime) === null || _a === void 0 ? void 0 : _a.getURL("assets/UDASdk.js");
    s1.src = scriptPath;
    s1.onload = function () {
    };
    (document.body || document.documentElement).appendChild(s1);
    document.addEventListener("RequestUDASessionData", function (data) {
        udaBrowserVar.runtime.sendMessage({ action: data.detail.data, data: data.detail.data });
    });
    document.addEventListener("UDADebugSetEvent", function (data) {
        udaBrowserVar.runtime.sendMessage({ action: data.detail.data.action, data: data.detail.data.value });
    });
    document.addEventListener("UDAGetNewToken", function (data) {
        udaBrowserVar.runtime.sendMessage({ action: data.detail.data, data: data.detail.data });
    });
    /**
     * create keycloak storage to browserVar
     */
    document.addEventListener("CreateUDASessionData", function (data) {
        udaBrowserVar.runtime.sendMessage({ action: data.detail.action, data: data.detail.data });
    });
    udaBrowserVar.runtime.onMessage.addListener(function (request) {
        if (request.action === "UDAUserSessionData") {
            document.dispatchEvent(new CustomEvent("UDAUserSessionData", { detail: { data: request.data }, bubbles: false, cancelable: false }));
        }
        else if (request.action === "UDAAuthenticatedUserSessionData") {
            document.dispatchEvent(new CustomEvent("UDAAuthenticatedUserSessionData", { detail: { data: request.data }, bubbles: false, cancelable: false }));
        }
        else if (request.action === "UDAAlertMessageData") {
            document.dispatchEvent(new CustomEvent("UDAAlertMessageData", { detail: { data: request.data }, bubbles: false, cancelable: false }));
        }
    });
}
//# sourceMappingURL=ExtensionSDK.js.map