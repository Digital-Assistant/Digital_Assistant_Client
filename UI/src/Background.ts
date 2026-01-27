'use strict';

/**
 * Background Script for Universal Digital Assistant Browser Extension
 *
 * This service worker handles:
 * - User authentication via Chrome Identity API
 * - Session management
 * - Communication between content scripts and web pages
 *
 * Architecture:
 * - Browser-specific logic: In this file and ./browser-auth/
 * - Platform-agnostic logic: Imported from @digital-assistant/core package
 */

// Import browser constants and utilities from core package
import {
    getBrowserVar,
    getUDASessionName,
    updateActiveTabId,
    updateBrowserPlugin,
    UDASessionData,
    UDAGetSessionKey,
    UDABindAuthenticatedAccount,
    UDASendSessionData,
    UDAStorageService,
    keyCloakStore
} from "@digital-assistant/core";

// Import browser extension specific authentication
import { LoginWithBrowser } from "./browser-auth/LoginWithBrowser";

// Initialize browser variables
const browserVar = getBrowserVar();
const UDASessionName = getUDASessionName();

updateBrowserPlugin(true);

/**
 * Storing the active tab id to fetch for further data.
 */
browserVar.tabs.onActivated.addListener(function (activeInfo) {
	updateActiveTabId(activeInfo.tabId);
});

let sessionData: UDASessionData = new UDASessionData();

// listen for the requests made from webpage for accessing userdata
browserVar.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
		const storedSessionData = await UDAStorageService.get(UDASessionName);
		if (!storedSessionData) {
			sessionData = await UDAGetSessionKey(sessionData);
			await LoginWithBrowser(sessionData, false);
		} else {
			// looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
			if (storedSessionData.hasOwnProperty("sessionKey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
				sessionData = storedSessionData;
				if(request.action === "UDAGetNewToken"){
					await generateNewToken();
				} else if(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
					await UDASendSessionData(sessionData);
				} else {
					await LoginWithBrowser(sessionData, false);
				}
			} else if (storedSessionData.hasOwnProperty(UDASessionName) && storedSessionData[UDASessionName].hasOwnProperty("sessionKey") && storedSessionData[UDASessionName]["sessionKey"] && typeof storedSessionData[UDASessionName]["sessionKey"] != 'object') {
				sessionData = storedSessionData[UDASessionName];
				if(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
					await UDASendSessionData(sessionData);
				} else {
					await LoginWithBrowser(sessionData, false);
				}
			} else {
				sessionData = await UDAGetSessionKey(sessionData);
				await LoginWithBrowser(sessionData, false);
			}
		}

	} else if (request.action === "authtenicate") {
		await LoginWithBrowser(sessionData, false);
	} else if (request.action === "createSession") {
		await keyCloakStore(sessionData, request.data);
	}
});

async function generateNewToken() {
	console.log(sessionData);
	await UDABindAuthenticatedAccount(sessionData, true);
}

