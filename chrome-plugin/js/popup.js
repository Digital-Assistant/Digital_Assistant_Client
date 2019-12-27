// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var indexeddata=[];

var currenttab=[];


document.addEventListener('DOMContentLoaded', function() {
	var link = document.getElementById('submitaction');
	// onClick's logic below:
	link.addEventListener('click', function() {
		submitaction();
	});
	/*
	var micbtn = document.getElementById('submitaction');
	micbtn.addEventListener('click',function(){
		recognition.start();
	});
	*/
});


$(document).ready(function(){
	navigator.mediaDevices.getUserMedia({audio: true});
	$('#micstopbutton').hide();
	$('#micbutton').on('click', function(e) {
	  // recognition.start();
		chrome.tabs.sendMessage(currenttab.id, {action: "startrecording"}, function (response) {
			//console.log(response);
		});
	  	$('#micstopbutton').show();
	  	$('#micbutton').hide();
	});
	$('#micstopbutton').on('click', function(e) {
	  // recognition.stop();
	  	chrome.tabs.sendMessage(currenttab.id, {action: "stoprecording"}, function (response) {
			//console.log(response);
			/*
			if(response == "completed"){
				chrome.tabs.sendMessage(currenttab.id, {action: "convertedtext"}, function (response) {
					console.log(response);
				});	
			}
			*/
		});
	  	$('#micstopbutton').hide();
	  	$('#micbutton').show();
	});
});
/*
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "parseddata") {
		this.indexeddata = request.indexeddata;
		//console.log(this.indexeddata);
	}
});
*/
chrome.runtime.onMessage.addListener(function(request) {
	console.log(request);
	if(request.action == "trascriptedtext"){
		submitaction(request.result);
	}
});

function onWindowLoad() {

	var message = "";
	var hostdata = [];
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		currenttab = tabs[0];
		chrome.tabs.sendMessage(tabs[0].id, {action: "fetchdomain"}, function (responsehost) {
			checkhostexistsinstorage(responsehost, tabs);
		});
	});

}

function checkurldata(check = false, hostdata, hostname, tabs){
	chrome.tabs.sendMessage(tabs[0].id, {action: "fetchurl"},function(responseurl) {
		if(check) {
			var urlexists = false;
			hostdata.forEach(function (url, urlindex) {
				if (url.url==responseurl) {
					urlexists = true;
					indexeddata = url.indexeddata;
				}
			});
		}
	});
}

function checkhostexistsinstorage(hostname, tabs){
	console.log(hostname);
	if(hostname == "undefined"){
		console.log("Unable to fetch domain name");
		return false;
	}
	chrome.storage.local.get([hostname],function (result) {
		if(chrome.runtime.lastError){
			console.log(chrome.runtime.lastError);
			return false;
		} else {
			if(result.hasOwnProperty(hostname)){
				checkurldata(true, result[hostname], hostname, tabs);
			} else {
				console.log("data not found indexing failed");
			}
		}
	});
}

window.onload = onWindowLoad;

function submitaction(action = null){
	if(action == null){
		action=document.getElementById("actionname").value;
		//console.log(action);
	}

	if(action!=null){
		console.log(indexeddata);
		if(indexeddata.length==0){
			console.log("index not available");
			return false;
		}
		var matchcount=0;
		var matcheddata = [];
		indexeddata.forEach(function (data, index) {
			if(action.toLowerCase()==data["element-label"].toLowerCase()){
				matchcount++;
				matcheddata.push(data);
			}
		});
		if(matchcount>1){
			console.log(matcheddata);
			$('#inputaction').addClass("hide");
			$('#multipleinputaction').removeClass("hide");
			$("#multipleinputaction").html('');
			matcheddata.forEach(function (value, index) {

				addmultiplehtmldisplay(value, index);
			});
		} else {
			// console.log(indexeddata);
			indexeddata.forEach(function (data, key) {
				if (action.toLowerCase() == data["element-label"].toLowerCase()) {
					//console.log(data);
					matchaction(data);
				}
			});
		}
	}
}

function matchaction(data){
	switch (data["element-type"].toLowerCase()) {
		case "button":
		case "submit":
		case "submitform":
			if(data["element-path"]!=""){
				//if(data.element-path.type!="url"){
					executefunction(encodeURI("\'$(\"a[href=\\\"#" + data["element-path"].toString() + "\\\"]\").tab(\"show\");\'"));
					//setTimeout(executefunction(encodeURI("\'" + data["element-action"].replace(";", "").toString() + ";\'")), 6000);
				//}
			} else {
				executefunction(encodeURI("\'" + data["element-action"].replace(";", "").toString() + ";\'"));
			}	
			break;
		case "a":
			executefunction(encodeURI("\'window.location.href=\"" + data["element-action"].toString() + "\";\'"));
			break;
		case "navtab":
			executefunction(encodeURI("\'$(\"a[href=\\\"" + data["element-action"].toString() + "\\\"]\").tab(\"show\");\'"));
			break;
		case "input":
		case "textarea":
			if(data["element-path"]!=""){
				//if(data.element-path.type!="url"){
					executefunction(encodeURI("\'$(\"a[href=\\\"#" + data["element-path"].toString() + "\\\"]\").tab(\"show\");setTimeout(function(){$(\"" + data["element-action"].toString() + "\").focus();},1000);\'"));
					/*
					setTimeout(
						executefunction(encodeURI("\'$(\"" + data["element-action"].toString() + "\").focus();\'")),
					3000);
					*/
				//}
			} else {
				if(data.hasOwnProperty("actiontype") && data["actiontype"]=="click"){
					executefunction(encodeURI("\'$(\"" + data["element-action"].toString() + "\").click();\'"));	
				} else if(data.hasOwnProperty("actiontype") && data["actiontype"]=="javascriptclick"){
					executefunction(encodeURI("\'$(\"" + data["element-action"].toString() + "\").click();\'"));	
				} else {
					executefunction(encodeURI("\'$(\"" + data["element-action"].toString() + "\").focus();\'"));	
				}
			}
			
			break;
	}
}

function addmultiplehtmldisplay(data,index){
	var html = '<button type="button" class="btn btn-primary">'
				+((data["element-path"]!="")?data["element-path"]:data["element-action"].toString())
				+'</button>';
	var duplicatehtml = $(html);
	duplicatehtml.click(function(){
		matchaction(data);
	});
	$("#multipleinputaction").append(duplicatehtml);
}

function executefunction(scripttext = "alert(\"Not found\");" ){
	console.log(scripttext);
	chrome.tabs.executeScript(null, {
		code: 'var script = document.createElement(\'script\');' +
			'script.type="text/javascript";' +
			'var scripttext = decodeURI('+ scripttext.toString() +');' +
			'try {' +
			'   script.appendChild(document.createTextNode(scripttext));' +
			'} catch (e) {' +
			'   script.text = scripttext;' +
			'}' +
			'document.body.appendChild(script);' +
			'script.parentNode.removeChild(script);'
	},function () {
		window.close();
	});
}