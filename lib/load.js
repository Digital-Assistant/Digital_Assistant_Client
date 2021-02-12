'use strict';

var UDAUpdateData=false;
var UDAApihost=DSA_API_URL;
var UDACookiename="nist-voice-usersessionid";
var UDASessionData={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
const isUDASdk=true;

//sending the authenticated data from the javascript sdk included in a webpage where id is passed.
function UDASendAuthData(){
	if(typeof UDAUserAuthData!='undefined' && UDAUserAuthData.id!=null){
		UDASessionData.authenticated=true;
		UDASessionData.authenticationsource=window.location.hostname;
		UDASessionData.authdata.id=UDAUserAuthData.id;
		if(UDAUserAuthData.email!=null) {
			UDASessionData.authdata.email=UDAUserAuthData.email;
		}
		UDABindAuthenticatedAccount();
	}
}

// sending the request back to the webpage for further processing.
function UDASendSessionData(sendaction="UDAUserSessionData", message=''){
	var sessionevent = {};
	switch (sendaction) {
		case "UDAUserSessionData":
			sessionevent = new CustomEvent("UDAUserSessionData", {detail: {data: JSON.stringify(UDASessionData)}, bubbles: false, cancelable: false});
			break;
		case "UDAAuthenticatedUserSessionData":
			sessionevent = new CustomEvent("UDAAuthenticatedUserSessionData", {detail: {data: JSON.stringify(UDASessionData)}, bubbles: false, cancelable: false});
			break;
		case "UDAAlertMessageData":
			sessionevent = new CustomEvent("UDAAlertMessageData", {detail: {data: JSON.stringify(message)}, bubbles: false, cancelable: false});
			break;
	}
	document.dispatchEvent(sessionevent);
}

function UDACheckStoredSessionData(storedsessiondata){
	storedsessiondata=JSON.parse(storedsessiondata);
	if(storedsessiondata.hasOwnProperty("sessionkey")){
		if(typeof UDAUserAuthData!='undefined' && UDAUserAuthData.id!=null && (storedsessiondata.id === UDAUserAuthData.id)){
			UDASessionData=storedsessiondata;
			UDASendSessionData();
		} else {
			window.localStorage.removeItem(UDACookiename);
			UDAGetSessionKey();
		}
	} else {
		UDAGetSessionKey();
	}
}

// listening to the requests that is sent by the sdk.
document.addEventListener("RequestUDASessionData", function(data) {
	var action=data.detail.data;
	var receiveddata=data.detail.data;
	if(action === "getusersessiondata")
	{
		var storedsessiondata = window.localStorage.getItem(UDACookiename);
		if(storedsessiondata==null){
			UDAGetSessionKey();
		} else {
		//	check for change in id
			UDACheckStoredSessionData(storedsessiondata);
		}
	} else if(action === "authtenicate") {
		if(typeof UDAUserAuthData!='undefined' && UDAUserAuthData.id!=null){
			UDASendAuthData();
		} else {
			//todo add different login options
			alert("UDA: UserID not set. Digital assistant will not work.");
		}
	}
});

//storing the data to local storage
function UDAStoreSessionData(){
	var storagedata=JSON.stringify(UDASessionData);
	window.localStorage.setItem(UDACookiename, storagedata);
}

//getting session key from backend server
function UDAGetSessionKey(){
	var xhr = new XMLHttpRequest();
	xhr.open("Get", UDAApihost+"/user/getsessionkey", false);
	xhr.onload = function(event){
		if(xhr.status === 200){
			UDASessionData.sessionkey=xhr.response;
			UDAStoreSessionData();
			UDASendSessionData();
		}
	};
	xhr.send();
}

//binding session key to the authenticated account
function UDABindAuthenticatedAccount(){
	var xhr = new XMLHttpRequest();
	var authdata={authid:UDASessionData.authdata.id,emailid:UDASessionData.authdata.email,authsource:UDASessionData.authenticationsource};
	xhr.open("POST", UDAApihost+"/user/checkauthid", false);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			UDABindAccount(JSON.parse(xhr.response));
		}
	};
	xhr.send(JSON.stringify(authdata));
}

//adding the sessionkey to the authid
function UDABindAccount(userauthdata){
	var xhr = new XMLHttpRequest();
	var usersessiondata={userauthid:userauthdata.id,usersessionid:UDASessionData.sessionkey};
	xhr.open("POST", UDAApihost+"/user/checkusersession", false);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			UDAStoreSessionData();
			UDASendSessionData("UDAAuthenticatedUserSessionData");
		}
	};
	xhr.send(JSON.stringify(usersessiondata));
}
