'use strict';

var updatedata=false;
var UDADebug=false; //this variable exists in links.js file also
var apihost=(UDADebug)?"http://localhost:11080/voiceapi":"https://udan.nistapp.ai/voiceapi"; //this variable exists in links.js file also
var cookiename="uda-sessiondata";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}, csp: {enabled: false, allowedUDAN: false}};
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
function loginwithgoogle(){
	sessiondata.authenticationsource="google";
	chrome.identity.getProfileUserInfo(function (data) {
		console.log(data);
		if(data.id!=='' && data.email!=="") {
			sessiondata.authenticated = true;
			sessiondata.authdata = data;
			UDAdigestMessage(sessiondata.authdata.id, "SHA-512").then(encryptedid=>{
				sessiondata.authdata.id = encryptedid;
				UDAdigestMessage(sessiondata.authdata.email, "SHA-512").then(encryptedemail=>{
					sessiondata.authdata.email = encryptedemail;
					bindauthenticatedaccount();
				});
			});
		} else {
			sendsessiondata("UDAAlertMessageData","UDA: UserID not set. Digital assistant will not work.")
		}
	});
}

//send the sessiondata to the webpage functionality
function sendsessiondata(sendaction="UDAUserSessionData",message=''){
	if(sendaction==="UDAAlertMessageData"){
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(message)});
		});
	} else {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			if(tabs.length>0) {
				chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(sessiondata)});
			} else {
				console.log('failed to send session data');
			}
		});
	}
}

// listen for the requests made from webpage for accessing userdata
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.action === "getusersessiondata")
	{
		chrome.storage.local.get([cookiename],function (storedsessiondata) {
			if(chrome.runtime.lastError){
				console.log('failed to read stored session data');
			} else {
				// console.log(storedsessiondata[cookiename]);
				// looks like chrome storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if(storedsessiondata.hasOwnProperty("sessionkey") && storedsessiondata["sessionkey"]){
					sessiondata=storedsessiondata;
					sendsessiondata();
				} else if(storedsessiondata.hasOwnProperty(cookiename) && storedsessiondata[cookiename].hasOwnProperty("sessionkey") && storedsessiondata[cookiename]["sessionkey"]){
					sessiondata=storedsessiondata[cookiename];
					sendsessiondata();
				} else {
					getsessionkey();
				}
			}
		});

	} else if(request.action === "authtenicate") {
		loginwithgoogle();
	} else if(request.action === "Debugvalueset"){
		UDADebug=request.data;
	}
});

//storing the data to the chrome storage
function storesessiondata(){
	var storagedata={};
	storagedata[cookiename]=sessiondata;
	chrome.storage.local.set(storagedata, function() {
	});
}

//getting the sessionkey from backend server
function getsessionkey(){
	var xhr = new XMLHttpRequest();
	xhr.open("Get", apihost+"/user/getsessionkey", true);
	xhr.onload = function(event){
		if(xhr.status === 200){
			sessiondata.sessionkey=xhr.response;
			storesessiondata();
			sendsessiondata();
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send();
}

//binding the sessionkey and chrome identity id
function bindauthenticatedaccount(){
	var xhr = new XMLHttpRequest();
	var authdata={authid:sessiondata.authdata.id,emailid:sessiondata.authdata.email,authsource:sessiondata.authenticationsource};
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
			storesessiondata();
			sendsessiondata("UDAAuthenticatedUserSessionData");
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(usersessiondata));
}

function ProcessCSPValues(value=''){
	if(value){
		let allowedSrcs = value.split(";");
		if(allowedSrcs.length>0){
			for(var i=0;i<allowedSrcs.length;i++) {
				let allowedSrc = allowedSrcs[i];
				let allowedDomains = allowedSrc.split(' ');
				if(allowedDomains.length>1 && allowedDomains[0].toLowerCase() === 'default-src'){
					sessiondata.csp.enabled=true;
					for(let index=0; index < allowedDomains.length; index++) {
						let allowedDomain = allowedDomains[index];
						if(allowedDomain === 'default-src'){
							continue;
						}
						switch (allowedDomain.toLowerCase()){
							case '*':
							case 'https:':
								sessiondata.csp.allowedUDAN=true;
								break;
						}
					}
				} else if(allowedDomains.length>0 && allowedDomains[0].toLowerCase() === 'default-src'){
					sessiondata.csp.enabled = true;
					sessiondata.csp.allowedUDAN = true;
				}
			}
		}
	} else {
		sessiondata.csp.allowedUDAN=true;
		sessiondata.csp.enabled=true;
	}
}

let onHeadersReceived = function (details) {
	console.log(sessiondata);
	console.log('Finding headers received');
	console.log(details.responseHeaders);

	for (var i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
			// details.responseHeaders[i].value = '';
			console.log('Found CSP');
			ProcessCSPValues(details.responseHeaders[i].value);
		}
	}
};

let onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] };

chrome.webRequest.onHeadersReceived.addListener(
	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);


