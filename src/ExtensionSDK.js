// Migrated to use @udan/digital-assistant-sdk package
import { checkBrowser, checkScreenSize, getBrowserVar } from "@udan/digital-assistant-sdk";

let {enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser} = checkBrowser();

const {enablePluginForScreen, showScreenAlert} = checkScreenSize();

if(enableUDAPlugin === false){
    console.log('Plugin disabled for browser: '+udaIdentifiedBrowser.name);
} else if(enablePluginForScreen === false){
    console.log('Plugin disabled due to lower resolution');
} else {
    console.log('Browser Enabled');
    // lets the page-side code tell the extension from a host-page (CDN) load
    document.documentElement.setAttribute('data-udan-extension', '1');
    let s1 = document.createElement('script');
    let scriptPath = udaBrowserVar?.runtime?.getURL("assets/UDASdk.js");
    s1.src = scriptPath;
    s1.onload = function() {
    };
    (document.body || document.documentElement).appendChild(s1);

    // Environment of the page (set by the page through UDAPluginSDK({environment})), if any.
    // It is sent with every message so the background uses it for that page's requests.
    let pageEnvironment;
    const sendToBackground = function(message) {
        return udaBrowserVar.runtime.sendMessage(pageEnvironment ? Object.assign({}, message, {pageEnvironment: pageEnvironment}) : message);
    };
    const sendEnvironmentToPage = function(data) {
        document.dispatchEvent(new CustomEvent("UDAEnvironmentData", {detail: {data: data}, bubbles: false, cancelable: false}));
    };
    const sendAccessTokenToPage = function(data) {
        document.dispatchEvent(new CustomEvent("UDAAccessTokenData", {detail: {data: data}, bubbles: false, cancelable: false}));
    };

    document.addEventListener("RequestUDASessionData", function(data) {
        sendToBackground({action:data.detail.data,data:data.detail.data});
    });

    document.addEventListener("UDADebugSetEvent", function(data) {
        sendToBackground({action:data.detail.data.action,data:data.detail.data.value});
    });

    document.addEventListener("UDAGetNewToken", function(data) {
        sendToBackground({action:data.detail.data,data:data.detail.data});
    });

    /**
     * environment (TEST or PROD): the page asks, the background answers with
     * {environment, source}; the page is told again when the options override changes.
     */
    document.addEventListener("UDAGetEnvironment", function() {
        Promise.resolve(udaBrowserVar.runtime.sendMessage({action:"UDAGetEnvironment"}))
            .then(sendEnvironmentToPage)
            .catch(function() { sendEnvironmentToPage(null); });
    });

    /**
     * Keycloak sign-in: the panel asks for a fresh access token before its own expires. The worker
     * answers with {token, expiresAt} or null; the refresh token never leaves the worker.
     */
    document.addEventListener("UDARequestAccessToken", function() {
        Promise.resolve(sendToBackground({action:"UDARenewAccessToken"}))
            .then(function(response) { sendAccessTokenToPage(response && response.accessToken ? response.accessToken : null); })
            .catch(function() { sendAccessTokenToPage(null); });
    });

    document.addEventListener("UDAPageEnvironment", function(data) {
        pageEnvironment = data.detail && data.detail.data ? data.detail.data : undefined;
    });

    /**
     * create keycloak storage to browserVar
     */
    document.addEventListener("CreateUDASessionData", function(data) {
        sendToBackground({action:data.detail.action,data:data.detail.data});
    });

    udaBrowserVar.runtime.onMessage.addListener(function(request) {
        if(request.action==="UDAUserSessionData"){
            document.dispatchEvent(new CustomEvent("UDAUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
        } else if(request.action==="UDAAuthenticatedUserSessionData"){
            document.dispatchEvent(new CustomEvent("UDAAuthenticatedUserSessionData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
        } else if(request.action==="UDAEnvironmentChanged"){
            sendEnvironmentToPage(request.data);
        } else if(request.action==="UDAAlertMessageData"){
            document.dispatchEvent(new CustomEvent("UDAAlertMessageData", {detail: {data: request.data}, bubbles: false, cancelable: false}));
        }
    });
}
