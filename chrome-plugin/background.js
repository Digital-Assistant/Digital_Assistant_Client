'use strict';

console.log('entering background js');
var updatedata = false;
var UDADebug = false; //this variable exists in links.js file also
var apihost = (UDADebug) ? "http://localhost:11080/voiceapi" : "https://udan.nistapp.ai/voiceapi"; //this variable exists in links.js file also
var cookiename = "uda-sessiondata14";
var CSPStorageName = "uda-csp-storage";
var activetabs = [];
var sessionkey = "";
// var sessiondata = { sessionkey: "", authenticated: false, authenticationsource: "", authdata: {}, csp: { cspenabled: false, udanallowed: true, domain: '' } };
var apikey = 'AIzaSyBeCZ1su0BYG5uGTHqqdg1bczlsubDuDrU';

/**
 *
 * @param textmessage
 * @param algorithm
 * @returns {Promise<ArrayBuffer>}
 * @constructor
 *
 * This is used for encrypting text messages as specified in the docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *
 */
 async function UDAdigestMessage(textmessage, algorithm) {
	const encoder = new TextEncoder();
	const data = encoder.encode(textmessage);
	const hash = await crypto.subtle.digest(algorithm, data);
	const hashArray = Array.from(new Uint8Array(hash));                     // convert buffer to byte array
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
}

//login with chrome identity functionality
function loginwithgoogle() {
	console.log('login with google function');
	let sessiondata = { sessionkey: "", authenticated: false, authenticationsource: "", authdata: {}, csp: { cspenabled: false, udanallowed: true, domain: '' } };
	sessiondata.authenticationsource = "google";
	chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (data) {
		if (data.id !== '' && data.email !== "") {
			sessiondata.authenticated = true;
			sessiondata.authdata = data;
			UDAdigestMessage(sessiondata.authdata.id, "SHA-512").then(encryptedid => {
				sessiondata.authdata.id = encryptedid;
				UDAdigestMessage(sessiondata.authdata.email, "SHA-512").then(encryptedemail => {
					sessiondata.authdata.email = encryptedemail;

					getsessionkey().then(skey=>{
						console.log('session key3333883: ',skey);
						sessiondata.sessionkey=skey;
					});

					let sessionDataWithCookie = {};
                    sessionDataWithCookie[cookiename] = sessiondata;
                    console.log('session data set with cookie in loginwithgoogle:', JSON.stringify(sessionDataWithCookie));
                    chrome.storage.local.set(sessionDataWithCookie, function () {
                    });
					bindauthenticatedaccount(sessiondata);
				});
			});
		} else {
			sendsessiondata({},"UDAAlertMessageData", "UDA: Please login into chrome browser.")
		}
	});
}

//send the sessiondata to the webpage functionality
function sendsessiondata(sessiondata, sendaction = "UDAUserSessionData", message = '') {
	console.log('function sendsessiondata(sessiondata, sendaction = "UDAUserSessionData", message = ) {');
	console.log(sessiondata);

	if (sendaction === "UDAAlertMessageData") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: sendaction, data: JSON.stringify(message) });
		});
	} else {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			console.log('tabs: ',tabs);
			if (tabs.length > 0) {
				var tab = tabs[0];
				// var url = new URL(tab.url);
				// var domain = url.protocol + '//' + url.hostname;
				// let csprecord = { cspenabled: false, udanallowed: true, domain: '' };
				// let cspdata = getstoragedata(CSPStorageName);
				// let recordexists = false;
				// if (cspdata) {
				// 	let csprecords = cspdata;
				// 	if (csprecords.length > 0) {
				// 		for (var i = 0; i < csprecords.length; i++) {
				// 			if (csprecords[i].domain === domain) {
				// 				recordexists = true;
				// 				csprecord = csprecords[i];
				// 				break;
				// 			}
				// 		}
				// 		if (recordexists) {
				// 			sessiondata.csp = csprecord;
				// 		}
				// 	}
				// }
				// sessiondata.csp = csprecord;
				chrome.tabs.sendMessage(tab.id, { action: sendaction, data: JSON.stringify(sessiondata) });
			} else {
				console.log('failed to send session data');
			}
		});
	}
}

// listen for the requests made from webpage for accessing userdata
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('in chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {');
	if (request.action === "getusersessiondata") {
		console.log('if (request.action === "getusersessiondata") {');
		let storedsessiondataTemp = {};
		console.log('cookiename: ',cookiename);
		chrome.storage.local.get([cookiename], function (storedsessiondata) {
			console.log('storedsessiondata: ',storedsessiondata);
			if (chrome.runtime.lastError) {
				console.log('failed to read stored session data');
			} else {
				storedsessiondataTemp = storedsessiondata;
				console.log('cookie name prop exists: ',storedsessiondataTemp.hasOwnProperty(cookiename));
				// console.log('cookie has session key: ',storedsessiondataTemp[cookiename].hasOwnProperty("sessionkey"));
				// console.log('session key value is: ',storedsessiondata[cookiename]["sessionkey"]);
				console.log('sessionkey prop exists: ', storedsessiondataTemp.hasOwnProperty("sessionkey"));
				// console.log('session key is: ',storedsessiondataTemp["sessionkey"]);
				

				// looks like chrome storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if (storedsessiondataTemp.hasOwnProperty("sessionkey") && 
					storedsessiondataTemp["sessionkey"]) {
						console.log('storedsessiondataTemp["sessionkey"]): ',storedsessiondataTemp["sessionkey"]);
					sendsessiondata(storedsessiondataTemp);
				} else if (storedsessiondataTemp.hasOwnProperty(cookiename) && 
				storedsessiondataTemp[cookiename].hasOwnProperty("sessionkey") && 
				storedsessiondata[cookiename]["sessionkey"]) {
					console.log('storedsessiondata[cookiename]["sessionkey"]: ',storedsessiondata[cookiename]["sessionkey"])
					sendsessiondata(storedsessiondataTemp[cookiename]);
				} else {
					getsessionkey().then(skey=>{
						console.log('session key33333333: ',skey);
						
						let sessiondataTemp = { sessionkey: '', authenticated: false, authenticationsource: '', authdata: {}, csp: { cspenabled: false, udanallowed: true, domain: '' } };
						sessiondataTemp.sessionkey = skey;
						// sessiondataTemp.authenticated=true;
						let sessionDataWithCookie={};
						sessionDataWithCookie[cookiename]=sessiondataTemp;
						console.log('session data set with cookie:', JSON.stringify(sessionDataWithCookie));
						chrome.storage.local.set(sessionDataWithCookie, function () {
							sendsessiondata(sessiondataTemp);
						});	
					});
				}
			}
		});
	} else if (request.action === "authtenicate") {
		console.log('before loginwith google, } else if (request.action === "authtenicate") {')
		loginwithgoogle();
	} else if (request.action === "Debugvalueset") {
		console.log('} else if (request.action === "Debugvalueset") {')
		UDADebug = request.data;
	}
});

//storing the data to the chrome storage
function storesessiondata() {
	var storagedata = {};
	storagedata[cookiename] = sessiondata;
	chrome.storage.synch.set(storagedata, function () {
	});
}

function getsessionkey() {
	return getsessionkeyIn();
}

//getting the sessionkey from backend server
async function getsessionkeyIn() {
	console.log('function getsessionkey(){');

	// var xhr = new XMLHttpRequest();
	// xhr.open("Get", apihost+"/user/getsessionkey", true);
	// xhr.onload = function(event){
	// 	if(xhr.status === 200){
	// 		sessiondata.sessionkey=xhr.response;
	// 		console.log('sessiondata.sessionkey=',sessiondata.sessionkey);
	// 		storesessiondata();
	// 		console.log('b4 calling sendsessiondata()');
	// 		sendsessiondata();
	// 		console.log('after calling sendsessiondata()');
	// 	} else {
	// 		console.log(xhr.status+" : "+xhr.statusText);
	// 	}
	// };
	// xhr.send();


	console.log('url1232444:  ', apihost + "/user/getsessionkey")
	let response = await fetch(apihost + "/user/getsessionkey");
	let data = await response.text();
	console.log('response:   ', data);


	// // sessiondata.sessionkey=data
	// console.log('sessiondata.sessionkey=', sessiondata.sessionkey);
	// storesessiondata();
	// console.log('b4 calling sendsessiondata()');
	// sendsessiondata(sessiondata);
	// console.log('after calling sendsessiondata()');
	console.log('after getting session key using fetch api');
	return data;
}


//binding the sessionkey and chrome identity id
async function bindauthenticatedaccount(sessiondata) {

	console.log('function bindauthenticatedaccount(){');
	
	var authdata={authid:sessiondata.authdata.id,emailid:sessiondata.authdata.email,authsource:sessiondata.authenticationsource};
	console.log('authdata: ', authdata);
	const url = apihost + "/user/checkauthid";
	try {
		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(authdata)
		}
		console.log('req config: ', config);
		const response = await fetch(url, config)
		console.log('response: ', response);
		const json = await response.json()
		console.log('json: ', json);
		if (response.ok) {
			console.log('if (response.ok) {');
			console.log('response for bind authenticated account: ',json);
			bindaccount(json.id, sessiondata);

			// bindaccount(sessiondata);
			// return json
			// return response
		} else {
			console.log('response status is not OK');
		}
	} catch (error) {
		console.log('error: ', error);
	}
	
	console.log('exiting function bindauthenticatedaccount(){');
}


//binding the session to the authid
async function bindaccount(userauthid, sessiondata) {
	console.log('function bindaccount(sessiondata){');

	const url = apihost + "/user/checkusersession";
	console.log('session data : ',sessiondata);
	var usersessiondata = { "userauthid": userauthid, "usersessionid": sessiondata.sessionkey };
	console.log(usersessiondata);
	// usersessiondata:  {userauthid: 61, usersessionid: 'njbe0LqcrKKMeTg0zCJr'}

	// const options = {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json;charset=UTF-8",
	// 	},
	// 	body: JSON.stringify(userauthdata),
	// };
	// fetch(url, options)
	// 	.then((response) => response.json())
	// 	.then((data) => {
	// 		console.log('bindChromeIdToSessionKey, resp: ',data);
	// 	});


	try {
		const config = {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(usersessiondata),
		};
		const response = await fetch(url, config)
		console.log('response: ', response);
		// const json = await response.json()
		// console.log('json :', json);
		if (response.ok) {
			console.log('if (response.ok) {');
			sendsessiondata(sessiondata, "UDAAuthenticatedUserSessionData");
			// return json
			// return response
		} else {
			console.log('response status is not OK');
		}
	} catch (error) {
		console.log('error: ', error);
	}

	console.log('exiting bindaccount(userauthdata)');
}


function CheckCSPStorage(cspenabled = false, udanallowed = false, domain) {
	var csprecord = { cspenabled, udanallowed, domain };
	let cspdata = getstoragedata(CSPStorageName);
	if (cspdata) {
		let csprecords = cspdata;
		if (csprecords.length > 0) {
			let recordexists = false;
			for (var i = 0; i < csprecords.length; i++) {
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
		var result = localStorage.getItem(key);
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
			for (var i = 0; i < allowedSrcs.length; i++) {
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
	var domain = url.protocol + '//' + url.hostname;
	for (var i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
			ProcessCSPValues(details.responseHeaders[i].value, domain);
		}
	}
};

let onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame'] };

// chrome.webRequest.onHeadersReceived.addListener(
// 	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
// );


