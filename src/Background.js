'use strict';

import {UDADigestMessage} from "./util/UDADigestMessage";
import {invokeApi} from "./util/invokeApi";

let UDADebug = false; //this variable exists in links.js file also
const apiHost = process.env.baseURL;
const cookieName = "uda-sessiondata";
const CSPStorageName = "uda-csp-storage";
const activeTabs = [];
const sessionKey = "";
let sessionData = {
    sessionkey: "",
    authenticated: false,
    authenticationsource: "",
    authdata: {},
    csp: {cspenabled: false, udanallowed: true, domain: ''}
};
let removeCSP = false;

let currentTab = [];

let activeTabId;

/**
 * Storing the active tab id to fetch for further data.
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
    activeTabId = activeInfo.tabId;
});

//login with chrome identity functionality
async function loginWithChrome() {
    sessionData.authenticationsource = "google";
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, async function (data) {
        if (data.id !== '' && data.email !== "") {
            sessionData.authenticated = true;
            sessionData.authdata = data;
            UDADigestMessage(sessionData.authdata.id, "SHA-512").then(async (encryptedid) => {
                sessionData.authdata.id = encryptedid;
                UDADigestMessage(sessionData.authdata.email, "SHA-512").then(async (encryptedemail) => {
                    sessionData.authdata.email = encryptedemail;
                    await bindAuthenticatedAccount();
                });
            });
        } else {
            await sendSessionData("UDAAlertMessageData", "login")
        }
    });
    return true;
}

//send the sessiondata to the webpage functionality
async function sendSessionData(sendaction = "UDAUserSessionData", message = '') {
    let tab = await getTab();
    if (sendaction === "UDAAlertMessageData") {
        await chrome.tabs.sendMessage(tab.id, {action: sendaction, data: message});
        return true;
    } else {
        let url = new URL(tab.url);
        let domain = url.protocol + '//' + url.hostname;
        let cspRecord = {cspenabled: false, udanallowed: true, domain: ''};
        let cspData = getStorageData(CSPStorageName);
        let recordExists = false;
        if (cspData) {
            let cspRecords = cspData;
            if (cspRecords.length > 0) {
                for (let i = 0; i < cspRecords.length; i++) {
                    if (cspRecords[i].domain === domain) {
                        recordExists = true;
                        cspRecord = cspRecords[i];
                        break;
                    }
                }
                if (recordExists) {
                    sessionData.csp = cspRecord;
                }
            }
        }
        sessionData.csp = cspRecord;
        console.log(sessionData);
        await chrome.tabs.sendMessage(tab.id, {action: sendaction, data: JSON.stringify(sessionData)});
        return true;
    }
}

/**
 *
 * @returns {currentTab}
 */
async function getTab() {
    let queryOptions = {active: true, currentWindow: true};
    let tab = (await chrome.tabs.query(queryOptions))[0];
    // let tab = await chrome.tabs.getCurrent();
    if (tab) {
        return tab;
    } else {
        tab = await chrome.tabs.get(activeTabId);
        if (tab) {
            return tab;
        } else {
            console.log('No active tab identified.');
        }
    }
    return tab;
}

// listen for the requests made from webpage for accessing userdata
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log(request);
    if (request.action === "getusersessiondata") {
        chrome.storage.local.get([cookieName], async function (storedsessiondata) {
            if (chrome.runtime.lastError) {
                console.log('failed to read stored session data');
            } else {
                // looks like chrome storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
                if (storedsessiondata.hasOwnProperty("sessionkey") && storedsessiondata["sessionKey"] && typeof storedsessiondata["sessionKey"] != 'object') {
                    sessionData = storedsessiondata;
                    if (storedsessiondata.hasOwnProperty('authenticated') && storedsessiondata.authenticated) {
                        await sendSessionData();
                    } else {
                        await loginWithChrome();
                    }
                } else if (storedsessiondata.hasOwnProperty(cookieName) && storedsessiondata[cookieName].hasOwnProperty("sessionkey") && storedsessiondata[cookieName]["sessionKey"] && typeof storedsessiondata[cookieName]["sessionKey"] != 'object') {
                    sessionData = storedsessiondata[cookieName];
                    // await sendSessionData();
                    if (storedsessiondata.hasOwnProperty('authenticated') && storedsessiondata.authenticated) {
                        await sendSessionData();
                    } else {
                        await loginWithChrome();
                    }
                } else {
                    await getSessionKey(false);
                    await loginWithChrome();
                }
            }
        });

    } else if (request.action === "authtenicate") {
        await loginWithChrome();
    } else if (request.action === "Debugvalueset") {
        UDADebug = request.data;
    } else if (request.action === "createSession") {
        await keycloakStore(request.data);
    } else if (request.action === "UDARemoveCSP") {
        console.log('here at remove csp');
        await createStorageData(CSPStorageName, request.data);
        removeCSP = request.data;
        if(request.data) {
            updateDynamicRules();
        }
        await cspInfo();
        chrome.tabs.reload(activeTabId);
    } else if (request.action === "UDACSPInfo") {
        await cspInfo();
    }
});

async function cspInfo() {
    let storedData = await getStorageData(CSPStorageName);
    if (activeTabId)
        await chrome.tabs.sendMessage(activeTabId, {action: 'UDACSPInfo', data: JSON.stringify(removeCSP)});
}

//storing the data to the chrome storage
async function storeSessionData() {
    let storageData = {};
    storageData[cookieName] = sessionData;
    await chrome.storage.local.set(storageData);
    return true;
}

//getting the sessionkey from backend server
async function getSessionKey(senddata = true) {
    let response = await invokeApi(apiHost + "/user/getsessionkey", "GET", null, false);
    console.log(response);
    if (!response) {
        return response;
    }
    sessionData.sessionkey = response;
    await storeSessionData();
    if (senddata) {
        await sendSessionData();
    }

}

//binding the sessionkey and chrome identity id
async function bindAuthenticatedAccount() {
    let authdata = {
        authid: sessionData.authdata.id,
        emailid: (sessionData.authdata.email) ? sessionData.authdata.email : '',
        authsource: sessionData.authenticationsource
    };
    let response = await invokeApi(apiHost + "/user/checkauthid", "POST", authdata);
    if (response) {
        await bindAccount(response);
        return true;
    } else {
        return response;
    }
}

//binding the session to the authid
async function bindAccount(userauthdata) {
    const usersessiondata = {userauthid: userauthdata.id, usersessionid: sessionData.sessionkey};
    let response = await invokeApi(apiHost + "/user/checkusersession", "POST", usersessiondata);
    await storeSessionData();
    await sendSessionData("UDAAuthenticatedUserSessionData");
    return true;
}

async function createStorageData(key, value) {
    try {
        let data = {};
        data[key] = JSON.stringify(value);
        console.log(data);
        await chrome.storage.local.set(data);
        return true;
    } catch (e) {
        return false;
    }
}

async function getStorageData(key) {
    try {
        const result = await chrome.storage.local.get([key]);
        if(result && result[key]) {
            return JSON.parse(result[key]);
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

let onHeaderFilter = {urls: ['*://*/*'], types: ['main_frame']};

// commented the CSP checking code functionality
/*chrome.declarativeNetRequest.onHeadersReceived.addListener(
	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);*/

/**
 * Store keycloak data in chrome extension storage for retrival for other sites
 */
async function keycloakStore(data) {
    console.log('creating session at extension');
    sessionData.authenticationsource = 'keycloak';
    sessionData.authenticated = true;
    sessionData.authdata = data;
    await getSessionKey(false);
    await bindAuthenticatedAccount();
}

/**
 * CSP detection using manifest v3 of declarativenetrequest api
 */

checkCSP();

async function checkCSP() {
    let udanAllowed = await getStorageData(CSPStorageName);
    console.log(removeCSP);
    console.log(udanAllowed);
    if (udanAllowed) {
        removeCSP = udanAllowed;
        updateDynamicRules();
        await cspInfo();
    }
}


function updateDynamicRules() {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1,2,3,100],
        addRules: [
            {
                id: 100,
                priority: 1,
                action: {
                    type: 'modifyHeaders',
                    responseHeaders: [
                        {
                            "header": "content-security-policy",
                            "operation": "remove"
                        },
                    ],
                },
                condition: {
                    regexFilter: '|http*',
                    resourceTypes: [
                        "csp_report",
                        "font",
                        "image",
                        "main_frame",
                        "media",
                        "object",
                        "other",
                        "ping",
                        "script",
                        "stylesheet",
                        "sub_frame",
                        "webbundle",
                        "websocket",
                        "webtransport",
                        "xmlhttprequest"
                    ]
                },
            },
        ]
    }, async (rules) => {
        await console.log('created', rules);
    });
}
