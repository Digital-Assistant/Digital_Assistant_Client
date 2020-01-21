'use strict';

var updatedata=false;
var apihost=API_URL;
var cookiename="nist-voice-usersessionid";
var activetabs=[];
var sessionkey="";
var sessiondata={sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
var apikey = 'AIzaSyBeCZ1su0BYG5uGTHqqdg1bczlsubDuDrU';
const issdk=true;

function loginwithgoogle(){
	sessiondata.authenticationsource="google";
	sessiondata={"sessionkey":"dv1AFb0kpsVDrxJlUVuz","authenticated":true,"authenticationsource":"google","authdata":{"email":"yureshwar@gmail.com","id":"117677195046275986225"}};
	bindauthenticatedaccount();
}

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

function sendsessiondata(sendaction="Usersessiondata"){
	// console.log(sessiondata);
	if(sendaction=="Usersessiondata"){
		var sessionevent = new CustomEvent("Usersessiondata", {detail: {data: JSON.stringify(sessiondata)}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	} else if(sendaction=="AuthenticatedUsersessiondata"){
		var sessionevent = new CustomEvent("AuthenticatedUsersessiondata", {detail: {data: JSON.stringify(sessiondata)}, bubbles: false, cancelable: false});
		document.dispatchEvent(sessionevent);
	}
}


document.addEventListener("RequestSessiondata", function(data) {
	// chrome.runtime.sendMessage({action:data.detail.data,data:data.detail.data});
	var action=data.detail.data;
	var receiveddata=data.detail.data;
	if(action == "getusersessiondata")
	{
		console.log("invoking session api");
		var storedsessiondata = window.localStorage.getItem(cookiename);
		if(storedsessiondata==null){

		} else {
			console.log(storedsessiondata);
			storedsessiondata=JSON.parse(storedsessiondata);
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
	} else if(action == "authtenicate") {
		console.log("recieved message to authenticate");
		if(typeof udaauthdata!='undefined' && udaauthdata.id!=null){
			sendudaauthdata();
		} else {
			//todo add different login options
			// loginwithgoogle();
			alert("UDA: UserID not set. Digital assistant will not work.");
		}
	}
});

function storesessiondata(){
	var storagedata=JSON.stringify(sessiondata);
	window.localStorage.setItem(cookiename, storagedata);
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