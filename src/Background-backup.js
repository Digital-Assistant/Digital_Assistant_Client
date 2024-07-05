'use strict';

import {UDADigestMessage} from "./util/UDADigestMessage";
import {invokeApi} from "./util/invokeApi";

const { detect } = require('detect-browser');
const browser = detect();

let enablePlugin = false;

let browserVar;

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
const keycloak = {
	realm: "UDAN",
	clientId: "backend-service",
	clientSecret: "1y5AAogxfCsB4WB6XTB8YOL6KnTplZhn",
	accessToken: ""
};
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

/**
 * Asynchronously log the user in using a browser.
 *
 * @return {boolean} Whether the login was successful.
 */
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
	// await sendSessionData("UDAAlertMessageData", "login");
	return true;
}

/**
 * Sends session data to the server.
 *
 * @param {string} sendaction - The action to be performed during the sending of the session data. Defaults to "UDAUserSessionData".
 * @param {string} message - The message to be included in the session data. Defaults to an empty string.
 * @return {boolean} Returns true if the session data was successfully sent.
 */
async function sendSessionData(sendaction = "UDAUserSessionData", message = '') {
	let tab = await getTab();
	if (sendaction === "UDAAlertMessageData") {
		await browserVar.tabs.sendMessage(tab.id, {action: sendaction, data: message});
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
		// Logic to add the authtoken to the session data
		if(!sessionData.authdata.hasOwnProperty('token')){
			await bindAuthenticatedAccount();
		} else {
			await browserVar.tabs.sendMessage(tab.id, {action: sendaction, data: JSON.stringify(sessionData)});
		}
		return true;
	}
}

/**
 * Retrieves the active tab from the browser.
 *
 * @return {Promise<Object>} The active tab object.
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
	if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
		browserVar.storage.local.get([cookieName], async function (storedSessionData) {
			if (browserVar.runtime.lastError) {
				console.log('failed to read stored session data');
			} else {
				// looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if (storedSessionData.hasOwnProperty("sessionkey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
					sessionData = storedSessionData;
					if(request.action === "UDAGetNewToken"){
						await generateNewToken();
					} else if(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
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

/**
 * Stores session data in local storage.
 *
 * @return {boolean} true if the session data was successfully stored, false otherwise.
 */
async function storeSessionData() {
	let storageData = {};
	storageData[cookieName] = sessionData;
	await browserVar.storage.local.set(storageData);
	return true;
}

/**
 * Asynchronously retrieves the session key.
 *
 * @param {boolean} sendData - Determines whether to send session data.
 * @return {Promise<void>} - A promise that resolves with the retrieved session key.
 */
async function getSessionKey(sendData = true) {
	let response = await invokeApi(apiHost + "/user/getsessionkey", "GET", null, false);
	console.log(response);
	if(!response){
		return response;
	}
	sessionData.sessionkey = response;
	await storeSessionData();
	if(sendData){
		await sendSessionData();
	}

}

/**
 * Binds the authenticated account.
 *
 * @return {boolean} Returns true if the account is successfully bound, otherwise returns the response.
 */
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

/**
 * Binds the user's account.
 *
 * @param {object} userAuthData - The user's authentication data.
 * @return {boolean} Returns true if the account was successfully bound.
 */
async function bindAccount(userAuthData) {
	try{
		// payload
		const payLoad = {uid: sessionData.authdata.id, email: sessionData.authdata.email, realm: keycloak.realm, clientId: keycloak.clientId, clientSecret: keycloak.clientSecret};
		const authToken = await invokeApi(process.env.tokenUrl+"user/token","POST", payLoad);
		console.log(authToken);
		if(authToken && authToken?.token) {
			sessionData.authdata.tokenUrl = authToken.token;
			console.log(sessionData);
			const userSessionData = {userauthid: userAuthData.id, usersessionid: sessionData.sessionkey};
			let response = await invokeApi("/user/checkusersession", "POST", userSessionData);
			await storeSessionData();
			await sendSessionData("UDAAuthenticatedUserSessionData");
		}
		return true;
	}catch (e) {
		console.log(e);
		return false;
	}
}

/**
 * Checks the CSP storage for a specific domain and updates the record if it exists,
 * otherwise adds a new record for the domain.
 *
 * @param {boolean} cspenabled - Indicates if CSP is enabled.
 * @param {boolean} udanallowed - Indicates if UDAN is allowed.
 * @param {string} domain - The domain to check or add the record for.
 */
function CheckCSPStorage(cspenabled = false, udanallowed = false, domain) {
	const cspRecord = {cspenabled, udanallowed, domain};
	let cspData = getStorageData(CSPStorageName);
	if (cspData) {
		let cspRecords = cspData;
		if (cspRecords.length > 0) {
			let recordExists = false;
			for (let i = 0; i < cspRecords.length; i++) {
				let record = cspRecords[i];
				if (record.domain === domain) {
					recordExists = true;
					cspRecords[i] = cspRecord;
					createStorageData(CSPStorageName, cspRecords);
				}
			}
			if (!recordExists) {
				cspRecords.push(cspRecord);
				createStorageData(CSPStorageName, cspRecords);
			}
		} else {
			cspRecords.push(cspRecord);
			createStorageData(CSPStorageName, cspRecords);
		}
	} else {
		var cspRecords = [];
		cspRecords.push(cspRecord);
		createStorageData(CSPStorageName, cspRecords);
	}
}

/**
 * Creates storage data by storing the provided key-value pair in the local storage.
 *
 * @param {string} key - The key to use for storing the data in local storage.
 * @param {any} value - The value to be stored in local storage.
 * @return {boolean} Returns true if the data was successfully stored, false otherwise.
 */
function createStorageData(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Retrieves data from localStorage using the specified key.
 *
 * @param {string} key - The key used to retrieve the data.
 * @return {any} The parsed data retrieved from localStorage, or false if an error occurred.
 */
function getStorageData(key) {
	try {
		const result = localStorage.getItem(key);
		return JSON.parse(result);
	} catch (e) {
		return false;
	}
}

function ProcessCSPValues(value = '', domain) {
	let udanAllowed = false;
	let cspEnabled = true;
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
								udanAllowed = true;
								cspEnabled = true;
								break;
						}
					}
				} else if (allowedDomains.length > 0 && allowedDomains[0].toLowerCase() === 'default-src') {
					udanAllowed = true;
					cspEnabled = true;
				}
			}
		}
	} else {
		udanAllowed = true;
		cspEnabled = true;
	}
	CheckCSPStorage(cspEnabled, udanAllowed, domain);
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

async function generateNewToken() {
	console.log(sessionData);
	await bindAuthenticatedAccount();
}

