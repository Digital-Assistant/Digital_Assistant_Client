'use strict';

import {browserVar, UDASessionName, updateBrowserPlugin} from "./BrowserConstants";

updateBrowserPlugin(true);

import {LoginWithBrowser} from "./util/LoginWithBrowser";
import {UDASendSessionData} from "./util/UDASendSessionData";
import {UDASessionData} from "./models/UDASessionData";
import {UDAGetSessionKey} from "./util/UDAGetSessionKey";
import {UDABindAuthenticatedAccount} from "./util/UDABindAuthenticatedAccount";
import {UDAStorageService} from "./services/UDAStorageService";
import {keyCloakStore} from "./util/KeycloakStore";
let sessionData: UDASessionData = new UDASessionData();

// listen for the requests made from webpage for accessing userdata
browserVar.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
		const storedSessionData = await UDAStorageService.get(UDASessionName);
		console.log(storedSessionData);
		if (!storedSessionData) {
			console.log('failed to read stored session data');
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

