'use strict';

var updatedata=false;
var apihost=API_URL;
var cookiename="nist-voice-usersessionid";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
var apikey = 'AIzaSyBeCZ1su0BYG5uGTHqqdg1bczlsubDuDrU';
const issdk=true;

//sending the authenticated data from the javascript sdk included in a webpage where id is passed.
function sendudaauthdata(){
	if(typeof udaauthdata!='undefined' && udaauthdata.id!=null){
		sessiondata.authenticated=true;
		sessiondata.authenticationsource=window.location.hostname;
		sessiondata.authdata.id=udaauthdata.id;
		if(udaauthdata.email!=null) {
			sessiondata.authdata.email=udaauthdata.email;
		}
		bindauthenticatedaccount();
	}
}

// sending the request back to the webpage for further processing.
function sendsessiondata(sendaction="Usersessiondata",message=''){
	if(sendaction==="Usersessiondata"){
		var sessionevent = new CustomEvent("Usersessiondata", {detail: {data: JSON.stringify(sessiondata)}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(sendaction==="AuthenticatedUsersessiondata"){
		var sessionevent = new CustomEvent("AuthenticatedUsersessiondata", {detail: {data: JSON.stringify(sessiondata)}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(sendaction==="Alertmessagedata"){
		var sessionevent = new CustomEvent("Alertmessagedata", {detail: {data: JSON.stringify(message)}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	}
}

// listening to the requests that is sent by the sdk.
document.addEventListener("RequestSessiondata", function(data) {
	var action=data.detail.data;
	var receiveddata=data.detail.data;
	if(action === "getusersessiondata")
	{
		var storedsessiondata = window.localStorage.getItem(cookiename);
		if(storedsessiondata==null){
			getsessionkey();
		} else {
			storedsessiondata=JSON.parse(storedsessiondata);
			if(storedsessiondata.hasOwnProperty("sessionkey")){
				sessiondata=storedsessiondata;
				sendsessiondata();
			} else {
				getsessionkey();
			}
		}
	} else if(action === "authtenicate") {
		if(typeof udaauthdata!='undefined' && udaauthdata.id!=null){
			sendudaauthdata();
		} else {
			//todo add different login options
			alert("UDA: UserID not set. Digital assistant will not work.");
		}
	}
});

//storing the data to local storage
function storesessiondata(){
	var storagedata=JSON.stringify(sessiondata);
	window.localStorage.setItem(cookiename, storagedata);
}

//getting session key from backend server
function getsessionkey(){
	var xhr = new XMLHttpRequest();
	xhr.open("Get", apihost+"/user/getsessionkey", false);
	// xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onload = function(event){
		if(xhr.status === 200){
			// console.log(xhr.response);
			sessiondata.sessionkey=xhr.response;
			storesessiondata();
			sendsessiondata();
		} else {
			console.log(xhr.status+" : "+xhr.statusText);
		}
	};
	xhr.send();
}

//binding session key to the authenticated account
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

//adding the sessionkey to the authid
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