'use strict';

var updatedata=false;
var UDADebug=false; //this variable exists in links.js file also
var apihost=(UDADebug)?"http://localhost:11080/voiceapi":"https://udan.nistapp.ai/voiceapi"; //this variable exists in links.js file also
var cookiename="uda-sessiondata";
var CSPStorageName="uda-csp-storage";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}, csp: {cspenabled: false, udanallowed: true, domain: ''}};
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
function loginWithGoogle(){
    sessiondata.authenticationsource = "google";
    return new Promise(function (resolve, reject) {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (data) {
            if (data.id !== '' && data.email !== "") {
                sessiondata.authenticated = true;
                sessiondata.authdata = data;
                UDAdigestMessage(sessiondata.authdata.id, "SHA-512").then(encryptedid => {
                    sessiondata.authdata.id = encryptedid;
                    UDAdigestMessage(sessiondata.authdata.email, "SHA-512").then(encryptedemail => {
                        sessiondata.authdata.email = encryptedemail;
                        //bindAuthenticatedAccount();
                        resolve(sessiondata);
                    });
                });
            } else {
                //sendSessionData("UDAAlertMessageData","UDA: Please login into chrome browser.")
            }
        });
    });
}

//send the sessiondata to the webpage functionality
function sendSessionData(sendaction="UDAUserSessionData",message=''){
	if(sendaction==="UDAAlertMessageData"){
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(message)});
		});
	} else {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			if(tabs.length>0) {
				var tab = tabs[0];
				var url = new URL(tab.url);
				var domain = url.protocol+'//'+url.hostname;
				let csprecord={cspenabled: false, udanallowed: true, domain: ''};
				let cspdata = getStorageData(CSPStorageName);
				let recordexists = false;
				if(cspdata) {
					let csprecords = cspdata;
					if (csprecords.length > 0) {
						for (var i = 0; i < csprecords.length; i++) {
							if (csprecords[i].domain === domain) {
								recordexists = true;
								csprecord=csprecords[i];
								break;
							}
						}
						if(recordexists){
							sessiondata.csp=csprecord;
						}
					}
				}
				sessiondata.csp=csprecord;
				chrome.tabs.sendMessage(tab.id, {action: sendaction, data: JSON.stringify(sessiondata)});
			} else {
				console.log('failed to send session data');
			}
		});
	}
}

// listen for the requests made from webpage for accessing userdata
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // sendResponse(request)
	if(request.action === "getusersessiondata")
	{
		chrome.storage.local.get([cookiename],function (storedsessiondata) {
			if(chrome.runtime.lastError){
				console.log('failed to read stored session data');
			} else {
				// looks like chrome storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if(storedsessiondata.hasOwnProperty("sessionkey") && storedsessiondata["sessionkey"]){
					sessiondata=storedsessiondata;
					sendSessionData();
				} else if(storedsessiondata.hasOwnProperty(cookiename) && storedsessiondata[cookiename].hasOwnProperty("sessionkey") && storedsessiondata[cookiename]["sessionkey"]){
					sessiondata=storedsessiondata[cookiename];
					sendSessionData();
				} else {
					getsessionKey();
				}
			}
		});

    } else if (request.action === "login") {
		loginWithGoogle().then((data) => {
			if (data) {
				chrome.storage.local.set({ "udaUserData": JSON.stringify(data) });
				chrome.storage.local.get().then((data) => {
					console.log(data);
				 });
			}
            sendResponse(data)
        })
	} else if(request.action === "Debugvalueset"){
		UDADebug=request.data;
	}
});

//storing the data to the chrome storage
function storeSessionData(){
	var storagedata={};
	storagedata[cookiename]=sessiondata;
	chrome.storage.local.set(storagedata, function() {
	});
}

//getting the sessionkey from backend server
function getsessionKey(){
	var xhr = new XMLHttpRequest();
	xhr.open("Get", apihost+"/user/getsessionKey", true);
	xhr.onload = function(event){
		if(xhr.status === 200){
			sessiondata.sessionkey=xhr.response;
			storeSessionData();
			sendSessionData();
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send();
}

//binding the sessionkey and chrome identity id
function bindAuthenticatedAccount(){
	var xhr = new window.XMLHttpRequest();
    var authdata = { authid: sessiondata.authdata.id, emailid: sessiondata.authdata.email, authsource: sessiondata.authenticationsource };
    window.localStorage.setItem('udaAuthData', JSON.stringify(authdata));
	xhr.open("POST", apihost+"/user/checkauthid", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			bindaccount(JSON.parse(xhr.response));
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(authdata));
}

//binding the session to the authid
function bindaccount(userauthdata){
	var xhr = new XMLHttpRequest();
	var usersessiondata={userauthid:userauthdata.id,usersessionid:sessiondata.sessionkey};
	xhr.open("POST", apihost+"/user/checkusersession", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			storeSessionData();
			sendSessionData("UDAAuthenticatedUserSessionData");
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(usersessiondata));
}

function CheckCSPStorage(cspenabled=false, udanallowed=false, domain){
	var csprecord = {cspenabled, udanallowed, domain};
	let cspdata = getStorageData(CSPStorageName);
	if(cspdata) {
		let csprecords = cspdata;
		if(csprecords.length>0){
			let recordexists=false;
			for(var i=0; i< csprecords.length; i++){
				let record=csprecords[i];
				if(record.domain === domain){
					recordexists=true;
					csprecords[i]=csprecord;
					createStorageData(CSPStorageName, csprecords);
				}
			}
			if(!recordexists){
				csprecords.push(csprecord);
				createStorageData(CSPStorageName, csprecords);
			}
		} else {
			csprecords.push(csprecord);
			createStorageData(CSPStorageName, csprecords);
		}
	} else {
		var csprecords = [];
		csprecords.push(csprecord);
		createStorageData(CSPStorageName, csprecords);
	}
}

function createStorageData(key,value){
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		return false;
	}
}

function getStorageData(key){
	try {
		var result=localStorage.getItem(key);
		return JSON.parse(result);
	} catch (e) {
		return false;
	}
}

function ProcessCSPValues(value='', domain){
	let udanallowed=false;
	let cspenabled=true;
	if(value){
		let allowedSrcs = value.split(";");
		if(allowedSrcs.length>0){
			for(var i=0;i<allowedSrcs.length;i++) {
				let allowedSrc = allowedSrcs[i];
				let allowedDomains = allowedSrc.split(' ');
				if(allowedDomains.length>1 && allowedDomains[0].toLowerCase() === 'default-src'){
					for(let index=0; index < allowedDomains.length; index++) {
						let allowedDomain = allowedDomains[index];
						if(allowedDomain === 'default-src'){
							continue;
						}
						switch (allowedDomain.toLowerCase()){
							case '*':
							case 'https:':
								udanallowed = true;
								cspenabled=true;
								break;
						}
					}
				} else if(allowedDomains.length>0 && allowedDomains[0].toLowerCase() === 'default-src'){
					udanallowed = true;
					cspenabled=true;
				}
			}
		}
	} else {
		udanallowed = true;
		cspenabled=true;
	}
	CheckCSPStorage(cspenabled, udanallowed, domain);
}

// let onHeadersReceived = function (details) {
// 	let url = new URL(details.url);
// 	var domain = url.protocol+'//'+url.hostname;
// 	for (var i = 0; i < details.responseHeaders.length; i++) {
// 		if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
// 			ProcessCSPValues(details.responseHeaders[i].value, domain);
// 		}
// 	}
// };

// let onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame'] };

// chrome.webRequest.onHeadersReceived.addListener(
// 	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
// );


