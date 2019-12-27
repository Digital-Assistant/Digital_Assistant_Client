'use strict';

var updatedata=false;
var voicedebug=false;
var apihost=(voicedebug)?"http://localhost:11080/voiceapi":"https://voicetest.nistapp.com/voiceapi";
var cookiename="nist-voice-usersessionid";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
var apikey = 'AIzaSyBeCZ1su0BYG5uGTHqqdg1bczlsubDuDrU';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if(changeInfo.status=="complete") {
		// console.log("executing script invoked");
	}
});

function loginwithgoogle(){
	sessiondata.authenticationsource="google";
	chrome.identity.getProfileUserInfo(function (data) {
		// console.log(data);
		sessiondata.authenticated=true;
		sessiondata.authdata=data;
		console.log(sessiondata);
		bindauthenticatedaccount()
	});
	/*
	chrome.identity.onSignInChanged.addListener(function(accountdata, signedIn){
		console.log(accountdata);
		console.log(signedIn);
		sessiondata.authenticated=true;
		sessiondata.authdata=accountdata;
		console.log(sessiondata);
	});
	chrome.identity.getAuthToken({interactive: true}, function(token) {

	});
	*/
}

function sendsessiondata(sendaction="Usersessiondata"){
	console.log(sessiondata);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(sessiondata)});
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	console.log(sender);
	if(request.action == "getusersessiondata")
	{
		console.log("invoking session api");
		chrome.storage.local.get([cookiename],function (storedsessiondata) {
			if(chrome.runtime.lastError){

			} else {
				console.log(storedsessiondata);
				if(storedsessiondata.hasOwnProperty("sessionkey")){
					// console.log(sessiondata[cookiename]);
					sessiondata=storedsessiondata;
					sendsessiondata();
				} else {
					// loginwithgoogle();
					getsessionkey();
				}
				// console.log(sessionkey);
			}
		});

	} else if(request.action == "authtenicate") {
		console.log("recieved message to authenticate");
		loginwithgoogle();
	}
});

function storesessiondata(){
	var storagedata={};
	storagedata[cookiename]=sessiondata;
	console.log(storagedata);
	chrome.storage.local.set(storagedata, function() {
		console.log('Session data has been stored');
	});
}

function getsessionkey(){
	var xhr = new XMLHttpRequest();
	xhr.open("Get", apihost+"/user/getsessionkey", false);
	// xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status == 200){
			console.log(xhr.response);
			sessiondata.sessionkey=xhr.response;
			storesessiondata();
			sendsessiondata();
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send();
}

function bindauthenticatedaccount(){
	var xhr = new XMLHttpRequest();
	var authdata={authid:sessiondata.authdata.id,emailid:sessiondata.authdata.email,authsource:sessiondata.authenticationsource};
	xhr.open("POST", apihost+"/user/checkauthid", false);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status == 200){
			console.log(xhr.response);
			bindaccount(JSON.parse(xhr.response));
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(authdata));
}

function bindaccount(userauthdata){
	var xhr = new XMLHttpRequest();
	console.log(sessiondata);
	var usersessiondata={userauthid:userauthdata.id,usersessionid:sessiondata.sessionkey};
	xhr.open("POST", apihost+"/user/checkusersession", false);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status == 200){
			console.log(xhr.response);
			storesessiondata();
			sendsessiondata("AuthenticatedUsersessiondata");
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(usersessiondata));
}