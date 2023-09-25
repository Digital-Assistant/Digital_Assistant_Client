'use strict';

import {UDADigestMessage} from "./util/UDADigestMessage";
import {invokeApi} from "./util/invokeApi";

const { detect } = require('detect-browser');
const browser = detect();

let enablePlugin = false;

let browserVar;

console.log(browser.name);

switch (browser && browser.name) {
	case 'edge-chromium':
	case 'edge':
	case 'edge-ios':
	case 'chrome':
		enablePlugin = true;
		browserVar = chrome;
		break;
	default:
		browserVar = browser;
		break;
}


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

let currentTab = [];


let activeTabId;

/**
 * Storing the active tab id to fetch for further data.
 */
browserVar.tabs.onActivated.addListener(function (activeInfo) {
	activeTabId = activeInfo.tabId;
});

//login with browser identity functionality
async function loginWithBrowser() {
	sessionData.authenticationsource = "google";
	browserVar.identity.getProfileUserInfo({accountStatus: 'ANY'}, async function (data) {
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
		await browserVar.tabs.sendMessage(tab.id, {action: sendaction, data: message});
		return true;
	} else {
		let url = new URL(tab.url);
		let domain = url.protocol + '//' + url.hostname;
		let cspRecord = {cspenabled: false, udanallowed: true, domain: ''};
		let cspData = getstoragedata(CSPStorageName);
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
		await browserVar.tabs.sendMessage(tab.id, {action: sendaction, data: JSON.stringify(sessionData)});
		return true;
	}
}

/**
 *
 * @returns {currentTab}
 */
async function getTab() {
	let queryOptions = {active: true, currentWindow: true};
	let tab = (await browserVar.tabs.query(queryOptions))[0];
	// let tab = await browserVar.tabs.getCurrent();
	if (tab) {
		return tab;
	} else {
		tab = await browserVar.tabs.get(activeTabId);
		if (tab) {
			return tab;
		} else {
			console.log('No active tab identified.');
		}
	}
	return tab;
}

// listen for the requests made from webpage for accessing userdata
browserVar.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	console.log(request);
	if (request.action === "getusersessiondata") {
		browserVar.storage.local.get([cookieName], async function (storedSessionData) {
			if (browserVar.runtime.lastError) {
				console.log('failed to read stored session data');
			} else {
				// looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if (storedSessionData.hasOwnProperty("sessionkey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
					sessionData = storedSessionData;
					if(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
						await sendSessionData();
					} else {
						await loginWithBrowser();
					}
				} else if (storedSessionData.hasOwnProperty(cookieName) && storedSessionData[cookieName].hasOwnProperty("sessionkey") && storedSessionData[cookieName]["sessionKey"] && typeof storedSessionData[cookieName]["sessionKey"] != 'object') {
					sessionData = storedSessionData[cookieName];
					// await sendSessionData();
					if(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
						await sendSessionData();
					} else {
						await loginWithBrowser();
					}
				} else {
					await getSessionKey(false);
					await loginWithBrowser();
				}
			}
		});

	} else if (request.action === "authtenicate") {
		await loginWithBrowser();
	} else if (request.action === "Debugvalueset") {
		UDADebug = request.data;
	} else if (request.action === "createSession") {
		await keycloakStore(request.data);
	}
});

//storing the data to the browser storage
async function storeSessionData() {
	let storageData = {};
	storageData[cookieName] = sessionData;
	await browserVar.storage.local.set(storageData);
	return true;
}

//getting the sessionkey from backend server
async function getSessionKey(senddata = true) {
	let response = await invokeApi(apiHost + "/user/getsessionkey", "GET", null, false);
	console.log(response);
	if(!response){
		return response;
	}
	sessionData.sessionkey = response;
	await storeSessionData();
	if(senddata){
		await sendSessionData();
	}

}

//binding the sessionkey and browser identity id
async function bindAuthenticatedAccount() {
	let authdata = {
		authid: sessionData.authdata.id,
		emailid: (sessionData.authdata.email)?sessionData.authdata.email:'',
		authsource: sessionData.authenticationsource
	};
	let response = await invokeApi(apiHost + "/user/checkauthid", "POST", authdata);
	if(response) {
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

function CheckCSPStorage(cspenabled = false, udanallowed = false, domain) {
	const csprecord = {cspenabled, udanallowed, domain};
	let cspdata = getstoragedata(CSPStorageName);
	if (cspdata) {
		let csprecords = cspdata;
		if (csprecords.length > 0) {
			let recordexists = false;
			for (let i = 0; i < csprecords.length; i++) {
				let record = csprecords[i];
				if (record.domain === domain) {
					recordexists = true;
					csprecords[i] = csprecord;
					createstoragedata(CSPStorageName, csprecords);
				}
			}
			if (!recordexists) {
				csprecords.push(csprecord);
				createstoragedata(CSPStorageName, csprecords);
			}
		} else {
			csprecords.push(csprecord);
			createstoragedata(CSPStorageName, csprecords);
		}
	} else {
		var csprecords = [];
		csprecords.push(csprecord);
		createstoragedata(CSPStorageName, csprecords);
	}
}

function createstoragedata(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		return false;
	}
}

function getstoragedata(key) {
	try {
		const result = localStorage.getItem(key);
		return JSON.parse(result);
	} catch (e) {
		return false;
	}
}

function ProcessCSPValues(value = '', domain) {
	let udanallowed = false;
	let cspenabled = true;
	if (value) {
		let allowedSrcs = value.split(";");
		if (allowedSrcs.length > 0) {
			for (let i = 0; i < allowedSrcs.length; i++) {
				let allowedSrc = allowedSrcs[i];
				let allowedDomains = allowedSrc.split(' ');
				if (allowedDomains.length > 1 && allowedDomains[0].toLowerCase() === 'default-src') {
					for (let index = 0; index < allowedDomains.length; index++) {
						let allowedDomain = allowedDomains[index];
						if (allowedDomain === 'default-src') {
							continue;
						}
						switch (allowedDomain.toLowerCase()) {
							case '*':
							case 'https:':
								udanallowed = true;
								cspenabled = true;
								break;
						}
					}
				} else if (allowedDomains.length > 0 && allowedDomains[0].toLowerCase() === 'default-src') {
					udanallowed = true;
					cspenabled = true;
				}
			}
		}
	} else {
		udanallowed = true;
		cspenabled = true;
	}
	CheckCSPStorage(cspenabled, udanallowed, domain);
}

let onHeadersReceived = function (details) {
	let url = new URL(details.url);
	const domain = url.protocol + '//' + url.hostname;
	for (let i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
			ProcessCSPValues(details.responseHeaders[i].value, domain);
		}
	}
};

let onHeaderFilter = {urls: ['*://*/*'], types: ['main_frame']};

// commented the CSP checking code functionality
/*browserVar.declarativeNetRequest.onHeadersReceived.addListener(
	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);*/

/**
 * Store keycloak data in browser extension storage for retrival for other sites
 */
async function keycloakStore(data){
	console.log('creating session at extension');
	sessionData.authenticationsource = 'keycloak';
	sessionData.authenticated = true;
	sessionData.authdata = data;
	await getSessionKey(false);
	await bindAuthenticatedAccount();
}

