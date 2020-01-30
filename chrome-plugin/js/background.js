'use strict';

var updatedata=false;
var voicedebug=false;
var apihost=(voicedebug)?"http://localhost:11080/voiceapi":"https://voicetest.nistapp.com/voiceapi";
var cookiename="nist-voice-usersessionid";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
var apikey = 'AIzaSyBeCZ1su0BYG5uGTHqqdg1bczlsubDuDrU';

//login with chrome identity functionality
function loginwithgoogle(){
	sessiondata.authenticationsource="google";
	chrome.identity.getProfileUserInfo(function (data) {
		if(data.id!=='' && data.emailid!=="") {
			sessiondata.authenticated = true;
			sessiondata.authdata = data;
			bindauthenticatedaccount();
		} else {
			sendsessiondata("Alertmessagedata","UDA: UserID not set. Digital assistant will not work.")
		}
	});
}

//send the sessiondata to the webpage functionality
function sendsessiondata(sendaction="Usersessiondata",message=''){
	if(sendaction==="Alertmessagedata"){
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(message)});
		});
	} else {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: sendaction, data: JSON.stringify(sessiondata)});
		});
	}
}

// listen for the requests made from webpage for accessing userdata
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.action === "getusersessiondata")
	{
		chrome.storage.local.get([cookiename],function (storedsessiondata) {
			if(chrome.runtime.lastError){

			} else {
				if(storedsessiondata.hasOwnProperty("sessionkey")){
					sessiondata=storedsessiondata;
					sendsessiondata();
				} else {
					getsessionkey();
				}
			}
		});

	} else if(request.action === "authtenicate") {
		loginwithgoogle();
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
	xhr.open("Get", apihost+"/user/getsessionkey", false);
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
	xhr.open("POST", apihost+"/user/checkauthid", false);
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
	xhr.open("POST", apihost+"/user/checkusersession", false);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			storesessiondata();
			sendsessiondata("AuthenticatedUsersessiondata");
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send(JSON.stringify(usersessiondata));
}