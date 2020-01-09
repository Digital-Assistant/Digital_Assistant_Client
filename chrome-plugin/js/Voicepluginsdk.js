/* 
Voice plugin Javascript SDK Library
IMPORTANT NOTE: Copying this library and hosting it locally is strongly discouraged.
 */
// checking whether jquery available or not
if(typeof jQuery == "undefined"){
	console.log("jquery not available");
}
// creating the sdk variable
if (typeof Voicepluginsdk == 'undefined') {
	var badBrowser=false;
	if(navigator.appName.indexOf("Internet Explorer") !== -1){
		badBrowser=(navigator.appVersion.indexOf("MSIE 1") === -1);
	}
	var speechrecognitionavailable=false;
	var voiceRecognition;
	/*
	try{
		SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;	
		speechrecognitionavailable=true;
	} catch(e) {
		console.log(e);
		speechrecognitionavailable=false;
	}
	*/

	// initializing voice recognition library
	if(!window.hasOwnProperty("webkitSpeechRecognition")){
		// console.log("speechkit not available");
		speechrecognitionavailable=false;
	} else {
		// console.log("speechkit available");
		speechrecognitionavailable=true;
		voiceRecognition = window.webkitSpeechRecognition;
	}

	// listening for user session data from extension call
	document.addEventListener("UserSessionkey", function(data) {
		// Voicepluginsdk.createsession(data.detail.data);
	});

	document.addEventListener("Usersessiondata", function(data) {
		// console.log("received user session data");
		Voicepluginsdk.createsession(JSON.parse(data.detail.data));
	});

	document.addEventListener("AuthenticatedUsersessiondata", function(data) {
		// console.log("received authenticated user session data");
		Voicepluginsdk.createsession(JSON.parse(data.detail.data));
		Voicepluginsdk.openmodal();
	});

	// initializing the sdk variable need to change to a new variable in future.
	var Voicepluginsdk = {
		sdkUrl: "/",
		apihost: (voicedebug)?"http://localhost:11080/voiceapi":"https://voicetest.nistapp.com/voiceapi",
		totalScripts: 0,
		scriptsCompleted:0,
		totalotherScripts:0,
		totalotherScriptsCompleted:0,
		functionsToRunWhenReady: [],
		jqueryready: false,
		request:{},
		userdata:{},
		ignoreelements : ["script","h1","h2","h3","link","noscript","style"],
		availablenavtabs : [],
		htmlindex : [],
		textfromspeech : "",
		nodeid : 0,
		speechrecognitionavailable: false,
		SpeechRecognition : [],
        recognition : {},
		targetNode : [],
		updatesOccur : true,
		updatecounter : 0,
		lastupdatecounter : 0,
		//mutationobserver: new MutationObserver(mutationscallback), // not using now used when we have implemented for salesforce after dimitriys code we are not using.
		//mutationconfig:{ attributes: true, childList: true, subtree: true }, // mutation observer configuration.
		menuitems: [],
		extensionpath:document.currentScript.src.toString().replace("js/Voicepluginsdk.js",""),
		indexnewnodes:false,
		previousurl:"",
		currenturl:"",
		sessionID:"",
		sessiondata:{sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}},
		cookiename:"nist-voice-usersessionid",
		recordingcookiename:"nistsequence",
		recordedsequenceids:[],
		recordclicknodecookiename:"nistclickrecord",
		cookieexpires:365,
		addedtoslidingdiv:false,
		elastic:{apiurl:"http://localhost:9200",indexname:"nistapp",currentpage:0,querystring:""},
		navigationcookiename:"nistnavshow",
		autoplay:false,
		inarray:function(value,object){
			var check=jQuery.inArray(value,object);
			return check;
		},
		// constructor for the sdk class which will be initialized on loading of the variable.
		init: function() {
			// loading jquery if not available
			if(typeof jQuery === "undefined") {
				// loading jquery from installed extension path
				this.loadScript(this.extensionpath+"js/jquery-3.4.1.min.js");
			} else {
				// load other scripts if jquery available
				this.jqueryready=true;
				this.otherscripts();
			}
		},
		loadScript: function(url) {

			var script = document.createElement("script")
			script.type = "text/javascript";

			if (script.readyState){
				script.onreadystatechange = function(){
					if (script.readyState === "loaded" || script.readyState === "complete"){
						script.onreadystatechange = null;
						Voicepluginsdk.scriptsCompleted++;
						if (typeof jQuery !== 'undefined') {
							this.jqueryready=true;
							Voicepluginsdk.otherscripts();
						}
					}
				};
			} else {
				script.onload = function(){
					Voicepluginsdk.scriptsCompleted++;
					if (typeof jQuery !== 'undefined') {
						this.jqueryready=true;
						if(this.ready !== true){
							Voicepluginsdk.otherscripts();
						}
					}
				};
			}

			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
			/*
			if(badBrowser){
				var iexdomainscript=document.createElement("script");
				iexdomainscript.type = "text/javascript";
				iexdomainscript.src = this.sdkUrl+'js/jquery.xdomainrequest.min.js';
				//document.getElementsByTagName("head")[0].appendChild(iexdomainscript);
			}
			*/
		},
		loadOtherScript: function(url) {
			var script = document.createElement("script")
			script.type = "text/javascript";
			script.src = url;
			if (script.readyState){
				script.onreadystatechange = function(){
					if (script.readyState === "loaded" || script.readyState === "complete"){
						script.onreadystatechange = null;
						Voicepluginsdk.totalotherScriptsCompleted++;
						if (Voicepluginsdk.totalotherScriptsCompleted === Voicepluginsdk.totalotherScripts) {
							// console.log("loaded other script");
							Voicepluginsdk.allReady();
						}
					}
				};
			} else {
				script.onload = function(){
					Voicepluginsdk.totalotherScriptsCompleted++;
					if (Voicepluginsdk.totalotherScriptsCompleted === Voicepluginsdk.totalotherScripts) {
						// console.log("loaded other script");
						Voicepluginsdk.allReady();
						// setTimeout(Voicepluginsdk.allReady(), 250);
					}
				};
			}
			document.body.appendChild(script);
		},
		loadCssScript: function(url) {
			var script = document.createElement("link")
			script.rel="stylesheet";
			script.type = "text/css";
			script.href = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		otherscripts: function(){
			this.totalotherScripts=1;
			this.loadCssScript(this.extensionpath+"css/extension-v0.1.2.css");
			this.loadOtherScript(this.extensionpath+"js/domJSON.js");
		},
		allReady: function() {
			// execute the parsing method after everything is ready.
			this.onReady();
		},
		queueOrRun: function(fname, param1, param2) {
			if (!this.ready) {
				this.functionsToRunWhenReady.push({
					functionSelf: this[fname],
					param1: param1,
					param2: param2
				});
				return
			}
			this[fname](param1, param2)
		},
		onContent: function (data) {},
		onComplete: function () {},
		onReady: function () {

			// check user session exists and create if not available
			this.checkuserkeyexists();

			// adding the respective html to show up the icons and all the required html
			// this.addvoiceiconhtml();

			// adding speech recognition functionality based on the library availability
			if(speechrecognitionavailable){
				// console.log("speech recognition available");
				this.recognition = new voiceRecognition();
				this.speechrecognitionavailable = true;
				
				this.recognition.onstart = function() {
					textfromspeech = "";
					// console.log("speech started");
					// console.log('Voice recognition activated. Try speaking into the microphone.');
				}

				this.recognition.onspeechend = function() {
					// console.log("speech ended");
				}

				this.recognition.onerror = function(event) {
					if(event.error === 'no-speech') {
						// console.log('No speech was detected. Try again.');
					};
				}

				this.recognition.onresult = function(event) {
					// console.log(event);
					if (event.results.length > 0) {
						var current = event.resultIndex;
						// Get a transcript of what was said.
						var transcript = event.results[current][0].transcript;
						// console.log(transcript);
						$("#voicesearchinput").val(transcript);
						// Voicepluginsdk.searchnodes();
						Voicepluginsdk.searchinelastic();
					}
				}
			}
			
			//this.startlookingforchanges();
			this.ready = true;

			// listen for when to start the indexing of the dom based on the clicknodes availability
			document.addEventListener("Indexnodes", function(data) {
				//console.log(data);
				if(data.detail.data=="indexclicknodes") {
					Voicepluginsdk.indexclicknodes();
				} else if(data.detail.data=="indexnewclicknodes") {
					Voicepluginsdk.indexnewclicknodes();
				}
			});

			// We need to wait till all dom content is loaded. We initially used a standard wait time but shifted to
			//      use https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
			//      This still produces some discrepancy where some nodes are not being processed.
			//      This needs to be improved at some point.
			window.addEventListener('load', (event) => {
				console.log('page is fully loaded');
				// location.reload();
				Voicepluginsdk.modifybodyhtml();
				// Voicepluginsdk.indexclicknodes();
			});

			// Voicepluginsdk.indexclicknodes();

			// this.functionsToRunWhenReady = [];

		},
		getcookievalue:function(cookiename){
			// console.log(document.cookie);
			var cookievalue=null;
			// Split cookie string and get all individual name=value pairs in an array
			var cookieArr = document.cookie.split(";");

			// Loop through the array elements
			for(var i = 0; i < cookieArr.length; i++) {
				var cookiePair = cookieArr[i].split("=");

				/* Removing whitespace at the beginning of the cookie name
				and compare it with the given string */
				if(cookiename == cookiePair[0].trim()) {
					// Decode the cookie value and return
					cookievalue = decodeURIComponent(cookiePair[1]);
				}
			}

			// console.log(cookievalue);
			// Return null if not found
			return cookievalue;
		},
		checkuserkeyexists:function(){
			// var sessionid=this.getstoragedata(this.cookiename);
			var sessiondata=this.getstoragedata(this.cookiename);
			if(sessiondata){
				var parsedsessiondata=JSON.parse(sessiondata);
				this.sessiondata=parsedsessiondata;
				this.sessionID=parsedsessiondata.sessionkey;
				this.recorddocumentclick();
				// console.log(this.sessiondata);
			}else{
				var sessionevent = new CustomEvent("RequestSessiondata", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		createcookie:function(cookiename,cookievalue,expiringdays,path){
			var d = new Date();
			d.setTime(d.getTime() + (expiringdays*24*60*60*1000));
			var expires = "expires="+ d.toUTCString();
			document.cookie = cookiename + "=" + cookievalue + ";" + expires + ";path="+path;
		},
		createsession:function(data){
			// if($.cookie(this.cookiename)){
			// var sessionid=this.getcookievalue(this.cookiename);
			var sessiondata=this.getstoragedata(this.cookiename);
			// console.log(sessiondata);
			if(sessiondata){
				this.sessiondata=data;
				this.sessionID=data.sessionkey;
				this.createstoragedata(this.cookiename,JSON.stringify(data));
			}else{
				sessionID=data.sessionkey;
				this.sessiondata=data;
				this.sessionID=data.sessionkey;
				this.createstoragedata(this.cookiename,JSON.stringify(data));
			}
			// console.log(this.sessiondata);
			this.recorddocumentclick();
		},
		startlookingforchanges: function (){
			// Start observing the target node for configured mutations
			Voicepluginsdk.targetNode=document.body;
			Voicepluginsdk.mutationobserver = new MutationObserver(Voicepluginsdk.mutationscallback);
			Voicepluginsdk.mutationobserver.observe(Voicepluginsdk.targetNode, Voicepluginsdk.mutationconfig);
			//Voicepluginsdk.mutationsCompletedCallback();
		},
		mutationsCompletedCallback: function(){
			if (Voicepluginsdk.updatesOccur) {
				Voicepluginsdk.updatesOccur = false;
				// console.log('HTML updated');
				setTimeout(this.mutationsCompletedCallback, 250);
			} else {
				//this.mutationobserver.takeRecords();
				Voicepluginsdk.mutationobserver.disconnect();
				//console.log(updatecounter);
				//console.log(lastupdatecounter);
				Voicepluginsdk.lastupdatecounter=this.updatecounter;
				Voicepluginsdk.updatecounter++;
				//console.log(updatecounter);
				//console.log(lastupdatecounter);
				// observer.observe(targetNode, config);
				// console.log('NO MORE MUTATIONS!');
				if(Voicepluginsdk.updatecounter === 0){
					chrome.runtime.send ({
						action: "reindexpage"
					});
				}
				/*
			    if(updatecounter>lastupdatecounter){
			        chrome.runtime.sendMessage({
			            action: "reindexpage"
			        });
			    }
				*/
			}
		},
		mutationscallback: function(mutationsList, observer) {
			//for(var mutation of mutationsList) {
			mutationsList.forEach(function (mutation, mutationkey) {
				if (mutation.type === 'childList') {
					// console.log('A child node has been added or removed.');
					this.updatesOccur = true;
				}
				else if (mutation.type === 'attributes') {
					// console.log('The ' + mutation.attributeName + ' attribute was modified.');
					this.updatesOccur = true;
				}
			});

		},
		addvoiceiconhtml:function(){
			// console.log(this.extensionpath);

			// var html="<div id='original-content'><div id=\"nistBtn\" nist-voice=\"true\"></div></div><div id='steps-content'><div id=\"voicemodalhtml\" nist-voice=\"true\"></div></div>";

			// var html='<div id="nistBtn" nist-voice="true"></div><div id="original-content"></div><div id="steps-content" style="display: none;"><div id="voicemodalhtml" nist-voice="true"></div></div>';
			// var bodyhtml=document.body.innerHTML;
			// var bodyhtml=document.body.childNodes;

			// $(document.body).html('');
			// $(document.body).html(html);
			// $('#original-content').append(bodyhtml);
			// $(document.body).append(html);

			// $(document.body).prepend(html);

			// this.addbuttonhtml();
		},
		modifybodyhtml:function(){
			var html='<div id="nistBtn" nist-voice="true"></div><div id="original-content"></div><div id="steps-content" style="display: none;"><div id="voicemodalhtml" nist-voice="true"></div></div>';
			// $(document.body).html('');
			// $(document.body).html(html);
			// $('#original-content').append(bodyhtml);
			// $(document.body).append(html);

			$(document.body).prepend(html);

			var bodyhtml=document.body.innerHTML;
			$(document.body).html(bodyhtml).promise().done(function(){
				Voicepluginsdk.indexclicknodes();
				Voicepluginsdk.addbuttonhtml();
			});
			// window.location.reload();
			/*$(document.body).hide().show().promise().done(function(){
				Voicepluginsdk.indexclicknodes();
				Voicepluginsdk.addbuttonhtml();
			});*/
			// postmessage=true;
		},
		addvoicehtml:function(){
			// console.log(this.extensionpath);
			var html="<div id='original-content'></div><div id='steps-content'><div id=\"voicemodalhtml\" nist-voice=\"true\"></div></div>";
			var bodyhtml=document.body.innerHTML;
			// body.append(html);
			$(document.body).html('');
			$(document.body).html(html);
			$('#original-content').append(bodyhtml);
			this.addbuttonhtml()
		},
		addbuttonhtml:function(){
			$("#nistBtn").unbind("click").html("");
			var addnisticon=true;
			var checkrecording = this.getstoragedata(this.recordingcookiename);
			if(checkrecording){
				var checkrecordingdata=JSON.parse(checkrecording);
				if(checkrecordingdata.hasOwnProperty("recording") && checkrecordingdata.recording){
					addnisticon=false;
					this.openmodal();
				} else {
					var buttonhtml="<img src=\""+this.extensionpath+"assets/uda-logo.png\" width=\"50px\" height=\"50px\" nist-voice=\"true\">";
				}
			} else {
				var buttonhtml="<img src=\""+this.extensionpath+"assets/uda-logo.png\" width=\"50px\" height=\"50px\" nist-voice=\"true\">";
			}
			// if(document.body != null){ document.body.appendChild(html); };
			$("#nistBtn").append(buttonhtml);
			if(addnisticon){
				this.addvoicesearchmodal(addnisticon);
				var modal =$("#nistBtn");
				modal.click(function () {
					Voicepluginsdk.openmodal();
				});
				window.onclick = function(event) {
					if (event.target == modal) {
						Voicepluginsdk.closemodal();
					}
				}
			} else {
				/*var stopbtn =$("#nistBtn");
				stopbtn.click(function () {
					// Voicepluginsdk.stoprecordingsequence();
					Voicepluginsdk.gettimestamp("stop");
				});*/
				this.addvoicesearchmodal(addnisticon);
				this.showrecordedresults();
			}
			/*var navigationcookie=this.getstoragedata(this.navigationcookiename);
			if(navigationcookie){
				var navigationcookiedata = JSON.parse(navigationcookie);
				if(navigationcookiedata.shownav) {
					this.openmodal();
					this.renderelasticresultshtml();
					if(navigationcookiedata.autoplay){
						this.autoplay=true;
					}
					this.renderelasticresultrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
				}
			}*/
		},
		addvoicesearchmodal:function(addnisticon=true){
			/*var recbtn ='	  <a nist-voice="true" class="voice-advc-link">Advanced</a> '+
						'	   <button nist-voice="true" id="nistvoicerecbtn" class="voice-record-img"><img src="'+this.extensionpath+'assets/voice-record.png"> <span>Rec</span></button>';*/
			var recbtn ='	   <button nist-voice="true" id="nistvoicerecbtn" class="voice-record-img"><img nist-voice="true" style="vertical-align:middle" src="'+this.extensionpath+'assets/voice-record.png"> <span nist-voice="true">Rec</span></button>';

			if(!addnisticon){
				/*recbtn ='	  <a nist-voice="true" class="voice-advc-link">Advanced</a> '+
						'	   <button nist-voice="true" id="nistvoicerecstpbtn" class="voice-record-img"><img src="'+this.extensionpath+'assets/voice-stop.png"> <span>Stop</span></button>';*/
				recbtn ='	   <button nist-voice="true" id="nistvoicerecstpbtn" class="voice-record-img"><img nist-voice="true" style="vertical-align:middle" src="'+this.extensionpath+'assets/voice-stop.png"> <span nist-voice="true">Stop</span></button>';
			}
			var html =  '<div class="voice-redmine-rght">'+
						'<div class="">'+
						'	<div class="voice-hng-left"><h3>How Can I Help You Today?</h3></div>'+
						'	<div class="voice-hng-right"><img id="closenistmodal" style="vertical-align:middle;" src="'+this.extensionpath+'assets/voice-close.png"></div>'+
						'   <div class="nist-clear"></div>'+
						'</div>'+
						'	<div class="voice-red-hr-line"></div>'+
						// '	<button class="voice-suggesion-lbl">Create a new issue</button><button class="voice-suggesion-lbl">Assign an issue to Ajay</button><button class="voice-suggesion-lbl">Show list of issues assigned to me</button><br>'+
						'	<div class="voice-srch-bg">'+
						'		<span class="voice-srch"><img src="'+this.extensionpath+'assets/voice-search.png"></span><input type="search" class="voice-srch-fld"  id="voicesearchinput" placeholder="Search..." />' +
						'       <span id="nist-voice-icon-start" class="voice-voice-srch" nist-voice="true"><img nist-voice="true" src="'+this.extensionpath+'assets/voice-voice.png" /></span>'+
						'       <span style="display:none;" class="voice-voice-srch" id="nist-voice-icon-stop" nist-voice="true"><img src="'+this.extensionpath+'assets/stop.png" nist-voice="true" /></span>' +
						'	</div>'+
						// '	<div class="voice-dropdown" style="float:right; margin-right: 20px;">'+
								recbtn +
						// '	</div><br>'+
						'<div class="nist-clear"></div>'+
						'   <div id="nistvoicesearchresults"></div>'
						'</div>';
			$("#voicemodalhtml").html(html);
			$("#closenistmodal").click(function(){
				Voicepluginsdk.closemodal();
			});
			$("#voicesearch").click(function(){
				// Voicepluginsdk.searchnodes();
				Voicepluginsdk.searchinelastic();
			});
			$("#voicesearchinput").keydown(function (e) {
				if (e.keyCode == 13) {
					$("#nistvoicesearchresults").html("");
					// Voicepluginsdk.searchnodes();
					Voicepluginsdk.searchinelastic();
					return false;
				}
			});
			if(speechrecognitionavailable){
				$("#nist-voice-icon-start").click(function () {
					$("#nistvoicesearchresults").html("");
					// console.log("starting voice recognition");
					Voicepluginsdk.recognition.start();
					$("#nist-voice-icon-start").hide();
					$("#nist-voice-icon-stop").show();
				});
				$("#nist-voice-icon-stop").click(function () {
					// console.log("stopping voice recognition");
					Voicepluginsdk.recognition.stop();
					$("#nist-voice-icon-stop").hide();
					$("#nist-voice-icon-start").show();
				});
			} else {
				$("#nist-voice-icon-start").hide();
				$("#nist-voice-icon-stop").hide();
			}
			if(addnisticon) {
				$("#nistvoicerecbtn").click(function () {
					// Voicepluginsdk.startrecordingsequence();
					Voicepluginsdk.gettimestamp("start");
				});
			} else {
				$("#nistvoicerecstpbtn").click(function () {
					// Voicepluginsdk.startrecordingsequence();
					Voicepluginsdk.gettimestamp("stop");
				});
			}
		},
		addvoicesearchmodalold: function(){
			var html =  '<div id="nistModal" class="nistmodal" nist-voice="true">' +
						'<div class="nist-modal-content" nist-voice="true">' +
						' <span class="nist-close" id="closenistmodal" nist-voice="true">&times;</span>' +
						' <div class="nist-root" nist-voice="true">' +
						'  <div class="nistmodal-left" nist-voice="true">'+
						'   <img src="'+this.extensionpath+'assets/uda-logo.png" width="40px" height="40px" id="" nist-voice="true">'+
						'   <img id="nistvoicerecbtn" src="'+this.extensionpath+'assets/start-icon.png" width="50px" height="50px" nist-voice="true">'+
						'  </div>' +
						'  <div class="nistmodal-right" nist-voice="true">' +
						'   <div class="nist-search-container" nist-voice="true">' +
						'    <span class="nist-search-icon" id="voicesearch" nist-voice="true"><img src="'+this.extensionpath+'assets/search.png" nist-voice="true"></span>' +
						'    <input class="nist-search" id="voicesearchinput" type="text" placeholder="Search" name="srch" nist-voice="true" >' +
						'    <span class="nist-voice-icon" id="nist-voice-icon-start" nist-voice="true"><img src="'+this.extensionpath+'assets/microphone.png" nist-voice="true" ></span>' +
						'    <span style="display:none;" class="nist-voice-icon" id="nist-voice-icon-stop" nist-voice="true"><img src="'+this.extensionpath+'assets/stop.png" nist-voice="true" ></span>' +
						'   </div>'+
						'  </div>' +
						' </div>' +
						// ' <div id="nistvoicerecbtn" class="nist-root" nist-voice="true">' +
						// '   <img src="'+this.extensionpath+'assets/start-icon.png" width="50px" height="50px" nist-voice="true">"+
						// ' </div>' +
						// ' <div id="nistvoicestepsbtn" class="nist-root" nist-voice="true">' +
						// '   <img src="'+this.extensionpath+'assets/steps.png" width="50px" height="50px" nist-voice="true">"+
						// ' </div>' +
						' <div class="nist-table-div" id="nistvoicesearchresults" nist-voice="true">' +
						' </div>' +
						' <div class="nist-table-div" id="nistrecordresults" nist-voice="true">' +
						' </div>' +
						'</div>' +
						'</div>';
			$("#voicemodalhtml").html(html);
			$("#closenistmodal").click(function(){
				Voicepluginsdk.closemodal();
			});
			$("#voicesearch").click(function(){
				// Voicepluginsdk.searchnodes();
				Voicepluginsdk.searchinelastic();
			});
			$("#voicesearchinput").keydown(function (e) {
				if (e.keyCode == 13) {
					$("#nistvoicesearchresults").html("");
					// Voicepluginsdk.searchnodes();
					Voicepluginsdk.searchinelastic();
					return false;
				}
			});
			if(speechrecognitionavailable){
				$("#nist-voice-icon-start").click(function () {
					$("#nistvoicesearchresults").html("");
					// console.log("starting voice recognition");
					Voicepluginsdk.recognition.start();
					$("#nist-voice-icon-start").hide();
					$("#nist-voice-icon-stop").show();
				});
				$("#nist-voice-icon-stop").click(function () {
					// console.log("stopping voice recognition");
					Voicepluginsdk.recognition.stop();
					$("#nist-voice-icon-stop").hide();
					$("#nist-voice-icon-start").show();
				});
			} else {
				$("#nist-voice-icon-start").hide();
				$("#nist-voice-icon-stop").hide();
			}
			$("#nistvoicerecbtn").click(function(){
				// Voicepluginsdk.startrecordingsequence();
				Voicepluginsdk.gettimestamp("start");
			});
			/*
			$("#nistvoicestepsbtn").click(function(){
				$('#original-content').css("width","80%");
				$('#steps-content').css("width","20%");
			});
			*/
		},
		openmodal:function(focus=true){
			if(this.sessiondata.authenticated) {
				$("#nistBtn").hide();
				// $('#original-content').css("width","80%").css("float","left");
				// $('#steps-content').css("width", "20%").css("float", "right");
				$('#steps-content').show();
				$("#nistModal").css("display", "block");
				$("#voicesearchinput").val("");
				if (focus) {
					$("#voicesearchinput").focus();
				}
			} else {
				// console.log("authenticating")
				var sessionevent = new CustomEvent("RequestSessiondata", {detail: {data: "authtenicate"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		closemodal:function(){
			// $('#original-content').css("width","100%");
			// $('#steps-content').css("width","0%");
			$('#steps-content').hide();
			$("#nistModal").css("display","none");
			$("#nistvoicesearchresults").html("");
			$("#nistrecordresults").html("");
			this.recordedsequenceids=[];
			$("#nistBtn").show();
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			// this.createcookie(this.navigationcookiename,JSON.stringify(navcookiedata),this.cookieexpires,"/");
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.cancelrecordingsequence(false);
		},
		showhtml:function(){
			var checkrecording = this.getstoragedata(this.recordingcookiename);
			if(checkrecording) {
				var checkrecordingdata = JSON.parse(checkrecording);
				if (checkrecordingdata.hasOwnProperty("recording") && checkrecordingdata.recording) {
					return false;
				}
			}
			var navigationcookie=this.getstoragedata(this.navigationcookiename);
			if(navigationcookie){
				var navigationcookiedata = JSON.parse(navigationcookie);
				if(navigationcookiedata.shownav) {
					this.openmodal();
					// this.renderelasticresultshtml();
					if(navigationcookiedata.autoplay){
						this.autoplay=true;
					}
					this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
				}
			}
		},
		// indexing all nodes after all the clicknodes are available
		indexclicknodes: function(){
			console.log("Intial indexing started");
			// console.log("initial nodes");
			// startmutationslistner=true;
			var processcount=clickObjects.length;
			// console.log(clickObjects);
			console.log(processcount);
			this.previousurl=this.currenturl=window.location.href;
			postmessage=false;
			// indexing functionality called
			this.indexdom(document.body);
			postmessage=true;
			startmutationslistner=true;
			// console.log(this.htmlindex);
			var totalcount=clickObjects.length;
			console.log(totalcount);
			if(processcount<totalcount){
				console.log("new nodes added need to reprocess in the initial processing");
				// this.indexclicknodes();
			}
			// console.log(this.menuitems);
			this.sendtoserver();
			if(processcount==totalcount) {
				this.showhtml();
			}
		},
		// indexing new clicknodes after new html got loaded
		indexnewclicknodes:function(){
			console.log("indexing new nodes started");
			// console.log("new nodes");
			// console.log(newclickObjects);
			// this.htmlindex=[];
			var processcount=clickObjects.length;
			postmessage=false;
			this.removefromhtmlindex();
			console.log(processcount);
			this.indexnewnodes=true;
			this.currenturl=window.location.href;
			this.indexdom(document.body);
			postmessage=true;
			var totalcount=clickObjects.length;
			console.log(totalcount);
			if(processcount<totalcount){
				console.log("new nodes added need to reprocess");
				// this.indexnewclicknodes();
			}
			// console.log(this.htmlindex);
			/*
			// todo improvise the indexing based on selection url and so on
			this.currenturl=window.location.href;
			if(this.currenturl==this.previousurl) {
				this.indexnewnodes=true;
				this.indexdom(document.body);
			} else {
				//todo capture user clicks and check if the url is changed via html5 and then index based on the click
				//this.htmlindex=[];
				//todo need to decide whent to clear the old index
				this.indexdom(document.body);
				newclickObjects=[];
			}
			*/
			// send all the indexed nodes to server
			this.sendtoserver();
			// console.log(this.menuitems);
			if(processcount==totalcount) {
				postmessage=false;
				this.showhtml();
			}
		},
		removefromhtmlindex:function(){
			var newhtmlindex=[];
			if(this.htmlindex.length>0){
				for(var htmli=0;htmli<this.htmlindex.length;htmli++){
					var checknode=this.htmlindex[htmli];
					for (var i = 0; i < clickObjects.length; i++) {
						// console.log(clickObjects[i]);
						if(clickObjects[i].element==window){
							continue;
						}
						if (checknode['element-data'].isEqualNode(clickObjects[i].element)) {
							newhtmlindex.push(checknode);
						}
					}
				}
				this.htmlindex=[];
				this.htmlindex=newhtmlindex;
			}
		},
		// indexing functionality for the entire dom
		indexdom: function( node, ret=false, parentnode="", textlabel="", hasparentnodeclick=false ) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:

					if(!ret && parentnode!="") {
						node = this.indexnode(node, parentnode);
					}

					if(node.hasChildNodes()){
						// console.log("--Has Children--");
						var childnodes =  node.childNodes;
						var hasparentclick = false;
						if(node.hasOwnProperty("hasclick")){
							hasparentclick=true;
						}

						//childnodes.forEach(function (childnode, key) {
						if(childnodes.length>0){
							for (var i=0;i<childnodes.length;i++){
								var childnode=childnodes[i];
								this.nodeid++;
								if(node.hasOwnProperty("displaytype") && node.displaytype === "tab-content") {
									//console.log("tab-content assigned");
									childnode.displaytype = node.displaytype;
									childnode.tabid = node.tabid;
								}
								if(node.hasOwnProperty("navtype") && node.navtype === "navtab") {
									if(node.getAttribute("href")) {
										this.menuitems.push({
											'name': node.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim(),
											'refid': node.getAttribute("href").replace("#",""),
											'menunode': node
										});
									}
								}
								if(this.ignoreelements.indexOf(childnode.nodeName.toLowerCase())==-1) {
									if(ret){
										if(textlabel==""){
											textlabel = this.indexdom(childnode, ret, node, textlabel);
										}else {
											textlabel += " " + this.indexdom(childnode, ret, node, textlabel);
										}
									} else {
										node.childNodes[i] = this.indexdom(childnode, ret, node,"", hasparentclick);
									}
								}
							}
						}
					}
					break;
				case Node.TEXT_NODE:
					if(node.nodeValue!="") {
						textlabel = node.nodeValue;
					}
					break;
			}

			if(ret && textlabel!=""){
				return textlabel;
			} else if(!ret) {
				return node;
			}
		},
		// Check for each node and then match it with the available clicknodes which are identified by links.js
		indexnode: function(node, parentnode, hasparentnodeclick=false, fromdocumentclick=false){
			var elementdata = {"element-type": "", "element-labels" : [], "element-action" : "", "element-path" : "","element-url":"", "element-data":[],"menu-items":[]};
			//console.log("indexing " + node.nodeName);

			if(parentnode.classList && parentnode.classList.contains("tab-content")){
				node.displaytype = "tab-content";
				node.tabid = node.id;
			}

			var clickobjectexists=false;
			var clickobject={};

			if(this.htmlindex.length>0){
				for(var htmli=0;htmli<this.htmlindex.length;htmli++){
					if(node.isEqualNode(this.htmlindex[htmli]['element-data'])){
						return node;
					}
				}
			}

			//to do capture user clicks and check if the url is changed via html5 and then index based on the click
			if(this.indexnewnodes){
				for (var i = 0; i < newclickObjects.length; i++) {
					// console.log(clickObjects[i]);
					if(newclickObjects[i].hasOwnProperty("element") && newclickObjects[i].element==window){
						continue;
					}
					if (node.isEqualNode(newclickObjects[i].element)) {
						clickobjectexists = true;
						clickobject = newclickObjects[i];
					}
				}
			} else {
				for (var i = 0; i < clickObjects.length; i++) {
					// console.log(clickObjects[i]);
					if(clickObjects[i].element==window){
						continue;
					}
					if (node.isEqualNode(clickObjects[i].element)) {
						clickobjectexists = true;
						clickobject = clickObjects[i];
					}
				}
			}

			if(node.hasAttribute("nist-voice") && node.getAttribute("nist-voice")){
				return node;
			}

			if(node.hasAttribute("type") && node.getAttribute("type") == "hidden"){
				return node;
			}

			if(fromdocumentclick){
				clickobjectexists = true;
				clickobject = node;
			}

			if(clickobjectexists){
				node.hasclick=true;
				elementdata["element-type"] = node.nodeName.toLowerCase();
				elementdata["element-url"] =  window.location.href;
				/*
				if(node.nodeName.toLowerCase() === "input" || node.nodeName.toLowerCase() === "textarea"){

					if(node.getAttribute("placeholder") && node.getAttribute("placeholder")!="") {
						elementdata["element-labels"].push(node.getAttribute("placeholder").toString());
					}
					if(node.getAttribute("type") && node.getAttribute("type")=="submit") {
						if(node.getAttribute("value")){
							elementdata["element-labels"].push(node.getAttribute("value").toString());
						}
					}

					if(elementdata["element-labels"].length==0)
					{
						elementdata["element-labels"] = this.getInputLabels(node,[]);
					}

				}*/

				if(parentnode.classList && parentnode.classList.contains("tab-content")){
					node.displaytype = "tab-content";
				}

				if(elementdata["element-labels"].length==0){
					elementdata["element-labels"] = this.getInputLabels(node,[],1);
				}

				if(elementdata["element-labels"].length==0){
					return node;
				}

				if((node.hasOwnProperty("displaytype") && node.displaytype=="tab-content") || (node.hasOwnProperty("navtype") && node.navtype=="navtab")){
					for(var j=0;j<this.menuitems.length;j++){
						var menuitem=this.menuitems[j];
						if(menuitem.refid == node.tabid) {
							if(menuitem.menunode.hasOwnProperty("path")){
								node.path =  menuitem.menunode.path+">"+menuitem.name;
							}else {
								node.path = menuitem.name;
							}
							if(node.hasOwnProperty("menuitems")){
								node.menuitems.push(menuitem);
							} else {
								node.menuitems=[];
								node.menuitems.push(menuitem);
							}
						}
					}
				}

				if(elementdata["element-path"]=="") {
					if (node.hasOwnProperty("path")) {
						elementdata["element-path"] = node.path;
					}
				}


				/*if(node.hasOwnProperty("displaytype") && node.displaytype === "tab-content"){
					elementdata["element-path"] = node.tabid;
				}*/

				if(node.getAttribute("data-toggle") && node.getAttribute("data-toggle")=="tab"){
					node.navtype="navtab";
					elementdata["element-action"] = "navtab";
				}
				elementdata["element-data"] = node;
				elementdata["clickobject"] = clickobject;

				// console.log(elementdata);

				this.htmlindex.push(elementdata);
				//todo add the node click via mouse and normal click via function
				/*$(node).click(function () {
					// Voicepluginsdk.recorduserclick(elementdata);
					Voicepluginsdk.recorduserclick(node,false);
				});*/
				// add click to node to send what user has clicked.
				this.addClickToNode(node);
				/*if(hasparentnodeclick){
					$(parentnode).unbind("click",Voicepluginsdk.recorduserclick(parentnode,false));
				}*/
			}
			return node;
		},
		// getting the text for the clicknodes.
		getInputLabels: function(node, inputlabels, iterationno, iterate=true, getchildlabels=true, fromclick=false, iteratelimit=3, ignorenode=[]){

			// console.log(node);

			if(Array.isArray(ignorenode)){
				ignorenode=node;
			}

			if((node.nodeName.toLowerCase() === "select" || node.nodeName.toLowerCase() === "checkbox") && iterate && inputlabels.length==0){
				iterationno++;
				inputlabels = this.getInputLabels(node.parentNode, inputlabels, iterationno, iterate, true, fromclick, iteratelimit, ignorenode);
				if(fromclick) {
					// console.log("select iterate");
					// console.log(inputlabels);
				}
			}

			if(getchildlabels && node.childNodes.length>0){
				var childnodes = node.childNodes;
				childnodes.forEach(function (childnode, key) {
					if(childnode.nodeName.toLowerCase()!="script" || childnode.nodeName.toLowerCase()!="select") {
						var textcontent = childnode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
						if (textcontent != "" && ignorenode.isEqualNode(childnode) == false) {
							inputlabels.push({"text": textcontent, "match": false});
						}
					}
				});
			}

			if(inputlabels.length==0 && node.getAttribute("data-tooltip")){
				inputlabels.push({"text":node.getAttribute("data-tooltip").toString(),"match":false});
			}

			if(inputlabels.length==0 && node.getAttribute("aria-label")){
				inputlabels.push({"text":node.getAttribute("aria-label").toString(),"match":false});
			}

			//todo fix for image tags
			if(iterate && node.nodeName.toLowerCase() != "img" && inputlabels.length == 0 && iterationno<=iteratelimit){
				//console.log("--looping to fetch the input label--");
				iterationno++;
				// console.log(iterationno);
				inputlabels = this.getInputLabels(node.parentNode,[], iterationno, iterate, getchildlabels, fromclick, iteratelimit);
				// console.log(parentnode);
				// return inputlabels;
			}

			if(node.nodeName.toLowerCase() === "input" || node.nodeName.toLowerCase() === "textarea" || node.nodeName.toLowerCase() === "img"){

				if(node.getAttribute("placeholder") && node.getAttribute("placeholder")!="") {
					inputlabels.push({"text":node.getAttribute("placeholder").toString(),"match":false});
				}
				if(node.getAttribute("type") && (node.getAttribute("type")=="submit" || node.getAttribute("type")=="file")) {
					if(node.getAttribute("value")){
						inputlabels.push({"text":node.getAttribute("value").toString(),"match":false});
					}
					/*
					if(inputlabels.length == 0){
						inputlabels = this.getInputLabels(node,[]);
					}
					*/
				}
				if(node.getAttribute("alt")){
					inputlabels.push({"text":node.getAttribute("alt").toString(),"match":false});
				}
			}

			//console.log(inputlabels);

			return inputlabels;
		},
		getsingleinputlabel: function(parentnode, inputlabel){
			var childnodes = parentnode.childNodes;

			childnodes.forEach(function (childnode, key) {
				if(inputlabel === ""){
					inputlabel = childnode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
				}
			});

			if(inputlabel === ""){
				//console.log("--looping to fetch the input label--");
				inputlabel = this.getinputlabel(parentnode.parentNode,"");
				// console.log(parentnode);
			} else {
				//console.log(inputlabel);
			}

			return inputlabel;
		},
		addClickToNode:function(node){
			var nodename=node.nodeName.toLowerCase();
			// console.log("adding click to "+nodename);
			// console.log({addnode:node});
			switch (nodename) {
				case "select":
					$(node).on({"change":function () {
							Voicepluginsdk.recorduserclick(node, false, true);
						},"focus":function(){
							Voicepluginsdk.recorduserclick(node, false,false);
						}
					});
					break;
				case "input":
					if(!node.hasAttribute("type")){
						// console.log("type attribute not found");
						return;
					}
					var inputtype=node.getAttribute("type").toLowerCase();
					switch (inputtype) {
						case "email":
						case "text":
						case "button":
						case "checkbox":
						case "color":
						case "date":
						case "datetime-local":
						case "file":
						case "hidden":
						case "image":
						case "month":
						case "number":
						case "password":
						case "radio":
						case "range":
						case "reset":
						case "search":
						case "submit":
						case "tel":
						case "text":
						case "time":
						case "url":
						case "week":
							// console.log("adding input click action");
							$(node).click(function () {
								Voicepluginsdk.recorduserclick(node, false);
							});
							break;
						default:
							$(node).click(function () {
								Voicepluginsdk.recorduserclick(node, false);
							});
							break;
					}
					break;
				case "mat-select":
					$(node).click(function () {
						Voicepluginsdk.recorduserclick(node, false);
					});
					break;
				default:
					$(node).click(function () {
						Voicepluginsdk.recorduserclick(node, false);
					});
					break;
			}
		},
		searchnodes: function(){
			/*this.htmlindex=[];
			Voicepluginsdk.indexclicknodes();*/
			var searchtext = $("#voicesearchinput").val();
			// console.log(searchtext);
			var matchnodes = [];
			if(searchtext != "" && this.htmlindex.length>0){
				for(var i=0;i<this.htmlindex.length;i++){
					var searchnode = this.htmlindex[i];
					var searchlabelexists=false;
					for(var j=0;j<searchnode['element-labels'].length;j++){
						var label = searchnode['element-labels'][j].text.toString().toLowerCase();
						//if(label == searchtext.toString().toLowerCase()){
						if(label.indexOf(searchtext.toString().toLowerCase()) !==-1){
							searchlabelexists=true;
							searchnode['element-labels'][j].match=true;
						}
					}
					if(searchlabelexists){
						matchnodes.push(searchnode);
					}
				}
			}
			if(matchnodes.length>0){
				// console.log("match found rendering results");
				if(matchnodes.length==1){
					this.matchaction(matchnodes[0]);
					return;
				}
				// console.log(matchnodes);
				this.rendersearchresults();
				for(var k=0;k<matchnodes.length;k++){
					this.renderresultrow(matchnodes[k],k);
				}
			}
		},
		rendersearchresults:function(){
			var html =  '<table class="nist-voice-search-tb" nist-voice="true">' +
						'  <tbody id="nist-voiceresultrow" nist-voice="true">' +
						'  </tbody>' +
						'</table>';
			$("#nistvoicesearchresults").html(html);
		},
		renderresultrow:function(data,index){
			var matchindex=0;
			for(var i=0;i<data["element-labels"].length;i++){
				if(data["element-labels"][i].match){
					matchindex=i;
				}
			}
			var html =  '<tr nist-voice="true">' +
						'<td nist-voice="true">' +
						' <h5 nist-voice="true">'+data["element-labels"][matchindex].text.toString()+'</h5>' +
						' <ul class="nistbreadcrumb" id="nistbreadcrumb'+index+'" nist-voice="true">' +
						' </ul>' +
						'</td>' +
						'</tr>';
			var element=$(html);
			element.click(function(){
				Voicepluginsdk.matchaction(data);
			});
			$("#nist-voiceresultrow").append(element);
			if(data['element-path']!=""){
				var paths=data['element-path'].split(">");
				if(paths.length>0){
					for (var i=0;i<paths.length;i++){
						$("#nistbreadcrumb"+index).append(this.renderpathsearch(paths[i]));
					}
				}
			}
		},
		renderpathsearch:function(data){
			var template = $("<li nist-voice=\"true\"><a nist-voice=\"true\">"+data+"</a></li>");
			/*template.click(function () {

			});*/
			return template;
		},
		matchaction:function(data,close=true){
			if(close) {
				this.closemodal();
			}
			// console.log(data);
			var node=data["element-data"];
			var timetoinvoke=1000;
			// setTimeout(function () {
				switch (node.nodeName.toLowerCase()) {
					case "input":
						switch (node.getAttribute("type")) {
							case "text":
								node.focus();
								break;
							case "password":
								node.focus();
								break;
							case "text":
								node.focus();
								break;
							case "checkbox":
								node.click();
								break;
							default:
								// node.click();
								node.focus();
						}
						break;
					case "textarea":
						node.focus();
						break;
					case "select":
						/*if(node.childNodes.length>0){
							// node.setAttribute('size',node.childNodes.length);
							$(node).trigger("mousedown");
						} else {
							node.focus();
						}*/
						node.focus();
						break;
					case "option":
						node.parentNode.focus();
						break;
					case "checkbox":
						node.click();
						break;
					default:
						node.click();
				}
			// },timetoinvoke);
			this.invokenextitem(node,timetoinvoke);
		},
		invokenextitem:function(node,timetoinvoke){
			var link=false;
			timetoinvoke=timetoinvoke+4000;
			console.log(timetoinvoke);
			if(node.hasOwnProperty("href")){
				link=true;
			}
			if(!link) {
				setTimeout(function(){Voicepluginsdk.showhtml();}, timetoinvoke);
			}
		},
		eventFire:function(el, etype){
			if (el.fireEvent) {
				el.fireEvent('on' + etype);
			} else {
				var evObj = document.createEvent('Events');
				evObj.initEvent(etype, true, false);
				el.dispatchEvent(evObj);
			}
		},
		reindexnodes:function(){
			this.indexdom(document.body);
			this.sendtoserver();
		},
		// sending all the indexed nodes to server
		sendtoserver: function(){
			var indexednodes = this.htmlindex;
			// console.log(indexednodes);
			var items = [];
			if(indexednodes.length>0){
				for(var i=0;i<indexednodes.length;i++){
					var itemdata = {id:'', textlabels:[], path:'', objectdata:''};
					var indexednode = indexednodes[i];
					itemdata.id = indexednode.clickobject.id;
					// itemdata.textlabels = indexednode["element-labels"];
					if(indexednode["element-labels"].length>0){
						var textlabels=[];
						for(var j=0;j<indexednode["element-labels"].length;j++){
							textlabels.push(indexednode["element-labels"][j].text);
						}
						itemdata.textlabels = textlabels.toString();
					}
					itemdata.path = indexednode["element-path"];
					itemdata.objectdata=JSON.stringify(domJSON.toJSON(indexednode["element-data"]));
					items.push(itemdata);
				}
				var data = {sessionid:this.sessionID,domain:window.location.host,urlpath:window.location.pathname, clickednodename:"", data:JSON.stringify(items)};
				// var clickednodenamedata=this.getcookievalue(this.recordclicknodecookiename);
				var clickednodenamedata=this.getstoragedata(this.recordclicknodecookiename);
				if(clickednodenamedata){
					data.clickednodename=clickednodenamedata;
				}
				// console.log(data);
				var outputdata = JSON.stringify(data);
				// console.log(outputdata);
				var xhr = new XMLHttpRequest();
				xhr.open("POST", this.apihost+"/clickevents/", true);
				xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				xhr.onload = function(event){
					if(xhr.status == 200){
						// console.log(xhr.response);
						startmutationslistner=true;
					} else {
						console.log(xhr.status+" : "+xhr.statusText);
					}
					Voicepluginsdk.addclickedrecordcookie("");
				};
				xhr.send(outputdata);//todo  - error verification? or switch to websockets
			}
		},
		recorduserclick:function(node, fromdocument=false, selectchange=false){
			// console.log({clickednode:node});
			// console.log(domJSON.toJSON(node));
			if(fromdocument){
				// console.log("from document click functionality");
			}
			if(node.hasAttribute("nist-voice")){
				// console.log("nist-voice attribute found");
				return true;
			}
			var processclick=true;
			if(fromdocument && this.htmlindex.length>0){
				for(var i=0;i<this.htmlindex.length;i++){
					var processnode=this.htmlindex[i];
					if(node.isEqualNode(processnode['element-data'])){
						processclick=false;
					}
				}
			}
			if(processclick===false){
				// console.log("not processed");
				return true;
			}

			// var postdata={domain:window.location.host,urlpath:window.location.pathname,sessionid:this.sessionID,clickednodename:"",html5:0,clickedpath:"",objectdata:JSON.stringify(node)};
			// console.log(domJSON.toJSON(node, {stringify: true}));
			// var postdata={domain:window.location.host,urlpath:window.location.pathname,sessionid:this.sessionID,clickednodename:"",html5:0,clickedpath:"",objectdata:JSON.stringify(domJSON.toJSON(node))};

			if(node.nodeName.toLowerCase()=="input" && node.getAttribute("type")=="radio"){
				var postdata = {
					domain: window.location.host,
					urlpath: window.location.pathname,
					sessionid: this.sessionID,
					clickednodename: "",
					html5: 0,
					clickedpath: "",
					objectdata: ""
				};
				var cache = [];
				var domjson=domJSON.toJSON(node);
				var stringifiednode=JSON.stringify(domjson.node, function(key, value) {
					if (typeof value === 'object' && value !== null) {
						if (cache.indexOf(value) !== -1) {
							// Duplicate reference found, discard key
							return;
						}
						// Store value in our collection
						cache.push(value);
					}
					return value;
				});
				cache = null;
				domjson.node=JSON.parse(stringifiednode);
				postdata.objectdata=JSON.stringify(domjson);
			} else {
				var postdata = {
					domain: window.location.host,
					urlpath: window.location.pathname,
					sessionid: this.sessionID,
					clickednodename: "",
					html5: 0,
					clickedpath: "",
					objectdata: domJSON.toJSON(node, {stringify: true})
				};
			}
			postdata.clickednodename = this.getclickedinputlabels(node,fromdocument,selectchange);
			// console.log(postdata);
			this.addclickedrecordcookie(postdata.clickednodename);
			var outputdata = JSON.stringify(postdata);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost+"/user/clickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status == 200){
					// console.log(xhr.response);
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send(outputdata);
		},
		getclickedinputlabels:function(node, fromdocument=false, selectchange=false){
			var inputlabels="";
			var nodename=node.nodeName.toLowerCase();
			switch (nodename) {
				case "select":
					if(selectchange) {
						inputlabels = $(node).find(":selected").text();
					} else {
						var textlabels = this.getInputLabels(node, [], 1, true, false, true);
						if (textlabels.length > 0) {
							var labels = [];
							for (var j = 0; j < textlabels.length; j++) {
								labels.push(textlabels[j].text);
							}
							inputlabels = labels.toString();
						}
					}
					break;
				case "input":
					// console.log(node);
					switch (node.getAttribute("type").toLowerCase()) {
						default:
							var textlabels = this.getInputLabels(node, [], 1, true, true, true);
							if (textlabels.length > 0) {
								var labels = [];
								for (var j = 0; j < textlabels.length; j++) {
									labels.push(textlabels[j].text);
								}
								inputlabels = labels.toString();
							}
					}
					break;
				case "textarea":
					var textlabels = this.getInputLabels(node, [], 1, true, true, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
					break;
				default:
					var textlabels = this.getInputLabels(node, [], 1, false, true, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
			}
			// console.log(inputlabels);
			/*
			if(node.nodeName.toLowerCase()==="select"){
				if(selectchange) {
					inputlabels = $(node).find(":selected").text();
				} else {
					var textlabels = this.getInputLabels(node, [], 1, true, false, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
				}
			} else if(node.nodeName.toLowerCase()=="input" && node.getAttribute("type")=="checkbox"){
				console.log()
				var textlabels = this.getInputLabels(node, [], 1, true, false, true);
				if (textlabels.length > 0) {
					var labels = [];
					for (var j = 0; j < textlabels.length; j++) {
						labels.push(textlabels[j].text);
					}
					inputlabels = labels.toString();
				}
			} else {
				var textlabels = this.getInputLabels(node, [], 1, false, true, true);
				if (textlabels.length > 0) {
					var labels = [];
					for (var j = 0; j < textlabels.length; j++) {
						labels.push(textlabels[j].text);
					}
					inputlabels = labels.toString();
				}
			}
			*/
			return inputlabels;
		},
		recorddocumentclick:function(){
			$(document).ready(function(){
				document.body.addEventListener('click', function (event) {

					// console.log(event.currentTarget);
					// Voicepluginsdk.recorduserclick(event.target,true);

				}, false);
			});
		},
		gettimestamp:function(buttonclicked){
			if(buttonclicked != "") {
				var result = Date.now();
				if(buttonclicked=="start"){
					this.startrecordingsequence(result);
				} else if(buttonclicked=="stop"){
					this.stoprecordingsequence(result);
				}
			}
		},
		showrecordedresults:function(){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			var starttime=null;
			var endtime=Date.now();
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				starttime=recordingcookiedata.starttime;
			} else {
				console.log("recording start time not found");
				return false;
			}

			// this.addbuttonhtml();

			$("#nistvoicesearchresults").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+starttime+"&end="+endtime+"&sessionid="+Voicepluginsdk.sessionID+"&domain="+recordingcookiedata.domain, true);
			// xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status == 200){
					Voicepluginsdk.addrecordresultshtml(JSON.parse(xhr.response));
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send();
		},
		startrecordingsequence:function(currenttimestamp){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if (recordingcookie) {
				var recordingcookiedata = JSON.parse(recordingcookie);
				recordingcookiedata.starttime = currenttimestamp;
				recordingcookiedata.recording = true;
				recordingcookiedata.endtime = null;
			} else {
				var recordingcookiedata = {recording: true, starttime: currenttimestamp, endtime: null};
			}
			recordingcookiedata.domain = window.location.host;
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));
			// this.closemodal();
			this.addbuttonhtml();
		},
		stoprecordingsequence:function(currenttimestamp){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				recordingcookiedata.endtime=currenttimestamp;
				recordingcookiedata.recording=false;
			} else {
				// console.log("recording start time not found");
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));
			// console.log(recordingcookiedata);
			this.addbuttonhtml();
			this.addvoicesearchmodal(true);
			$("#nistvoicesearchresults").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+recordingcookiedata.starttime+"&end="+recordingcookiedata.endtime+"&sessionid="+Voicepluginsdk.sessionID+"&domain="+recordingcookiedata.domain, true);
			// xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status == 200){
					Voicepluginsdk.addrecordresultshtml(JSON.parse(xhr.response));
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send();
		},
		cancelrecordingsequence:function(render=true){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				recordingcookiedata.endtime=Date.now();
				recordingcookiedata.recording=false;
			} else {
				// console.log("recording start time not found");
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			if(render) {
				this.addbuttonhtml();
				this.addvoicesearchmodal(true);
			}

		},
		addrecordresultshtml:function(data){
			// console.log(data);
			if(data.length>0) {
				this.recordedsequenceids=data;
				var html =  '   <div class="voice-suggesion-card">'+
							'		<div class="voice-card-left">'+
							'			<h4>Recorded Sequence</h4>'+
							'			<ul id="nist-recordresultrow" class="voice-sugggesion-bullet">'+
							'			</ul>'+
							'			<div>'+
							'				<input id="nistsequencelabel" type="text" name="save-recrded" class="voice-save-recrded-inpt" placeholder="Enter label">'+
							'				<button class="voice-cancel-btn" onclick="Voicepluginsdk.cancelrecordingsequence();">Cancel</button> <button onclick="Voicepluginsdk.submitrecordedlabel();" class="voice-submit-btn">Submit</button>'+
							'			</div>'+
							'		</div>'+
							'	</div>';
				$("#nistvoicesearchresults").html(html);
				for(var i=0;i<data.length;i++){
					this.renderrecordresultrow(data[i],i);
				}
				this.openmodal(false);
			} else {
				this.showhtml();
			}
		},
		renderrecordresultrow:function(data,index){
			// console.log(data);
			index++;
			var html =  '<li nist-voice="true" class="active">' +
							data.clickednodename +
						'</li>';
			var element=$(html);
			$("#nist-recordresultrow").append(element);
		},
		submitrecordedlabel:function(){
			var sequencename=$("#nistsequencelabel").val();
			var sequenceids = [];
			for(var i=0;i<this.recordedsequenceids.length;i++){
				sequenceids.push(this.recordedsequenceids[i].id);
			}

			var sequencelistdata={name:sequencename,domain:window.location.host,usersessionid:this.sessionID,userclicknodelist:sequenceids.toString(),userclicknodesSet:this.recordedsequenceids};
			// console.log(sequencelistdata);

			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/recordsequencedata", true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function(event){
				if(xhr.status == 200){
					// console.log(xhr.response);
					Voicepluginsdk.closemodal();
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send(JSON.stringify(sequencelistdata));
		},
		addclickedrecordcookie:function(clickednodename){
			this.createstoragedata(this.recordclicknodecookiename,clickednodename);
		},
		searchinelastic:function(searchterm=''){
			if(searchterm) {
				var searchtext = searchterm;
			} else {
				var searchtext = $("#voicesearchinput").val();
			}
			// console.log(searchtext);
			this.cancelrecordingsequence(false);
			// console.log(searchtext);
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost + "/clickevents/sequence/search?query="+searchtext+"&domain="+encodeURI(window.location.host), true);
			// xhr.open("GET", "https://nistapp.com/nistapp/app/deals/elastic?countryId=102&searchString="+searchtext+"&size=10&start=0", true);
			// xhr.setRequestHeader('Nistapp_Version', '0.8.17');
			xhr.onload = function(event){
				if(xhr.status == 200){
					// console.log(xhr.response);
					Voicepluginsdk.renderelasticresults(JSON.parse(xhr.response));
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send();
		},
		renderelasticresults:function(data){
			var matchnodes = data;
			if(matchnodes.length>0){
				$("#nistvoicesearchresults").html('');
				// console.log(matchnodes);
				// this.renderelasticresultshtml();
				for(var k=0;k<matchnodes.length;k++){
					if(matchnodes[k].hasOwnProperty("deleted") && matchnodes[k].deleted===0) {
						this.renderelasticresultrow(matchnodes[k], k);
					} else if(!matchnodes[k].hasOwnProperty("deleted")) {
						this.renderelasticresultrow(matchnodes[k], k);
					}
				}
			}
		},
		renderelasticresultrow:function(data){
			var path='';
			for(var i=0;i<data.userclicknodesSet.length;i++){
				if(path!=''){
					path +=' > ';
				}
				path += data.userclicknodesSet[i].clickednodename;
			}
			var html=   '	<div class="voice-sugtns-list"><h4><a>'+data.name.toString()+'</a></h4>'+
						'		<p>'+path+'</p>'+
						'	</div>';
			var element=$(html);
			element.click(function () {
				Voicepluginsdk.elasticresultaction(data);
			});
			$("#nistvoicesearchresults").append(element);
		},
		elasticresultaction:function(data){
			var navcookiedata = {shownav: true, data: data, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			// console.log(navcookiedata);
			navcookiedata.searchterm=$("#voicesearchinput").val();
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.showselectedrow(data,data.id,true, navcookiedata);
		},
		showselectedrow:function(data,index,shownodelist=false, navcookiedata={}){
			if(shownodelist && navcookiedata.data.userclicknodesSet.length==navcookiedata.navigateddata.length){
				// console.log(navcookiedata);
				navcookiedata.navcompleted=true;
			}
			var playiconhtml =  '<div class="voice-autoplay-stop">';
								// '	<span><img nist-voice="true" id="nist-autoplay" src="' + this.extensionpath + 'assets/voice-pause.png"></span>'+

			if(shownodelist) {
				if (navcookiedata.navcompleted) {
					playiconhtml += '	<span><img nist-voice="true" id="nist-autoplay" src="' + this.extensionpath + 'assets/voice-play.png"></span>'+
									'   <span><img nist-voice="true" src="' + this.extensionpath + 'assets/voice-stop-disable.png"></span>';
				} else {
					if(navcookiedata.autoplay) {
						playiconhtml += '	<span><img nist-voice="true" src="' + this.extensionpath + 'assets/voice-play-disable.png"></span>'+
										'	<span><img nist-voice="true" id="nist-autoplay" src="' + this.extensionpath + 'assets/voice-stop.png"></span>';
					} else {
						playiconhtml += '	<span><img nist-voice="true" id="nist-autoplay" src="' + this.extensionpath + 'assets/voice-play.png"></span>'+
										'   <span><img nist-voice="true" src="' + this.extensionpath + 'assets/voice-stop-disable.png"></span>';
					}

				}
			}
			playiconhtml   +=   '</div>';
			/*var html='<tr nist-voice="true">' +
						' <td nist-voice="true" '+((!shownodelist)?'class="cursor"':'')+'>' +
						((shownodelist && this.sessionID==data.usersessionid)?'<div nist-voice="true" id="deletesequence"><img class="nist-icon nist-alignright" src="'+this.extensionpath+'assets/delete-icon.png" /></div><div class="nist-clear"></div>':'')+
						'  <head5 nist-voice="true">'+data.name.toString()+'</head5>' +
						'  <ul id="nistbreadcrumb'+index+'" nist-voice="true">' +
							((!shownodelist)?data.userclicknodesSet.length+' Steps':'') +
						'  </ul>' +
						'<div id="playicons">' + backtosearchresults
						playiconhtml +
						'</div><div class="nist-clear"></div>'+
						((shownodelist)?'<div id="voteicons"><img class="nist-icon nist-alignleft" id="nist-upvote" src="'+this.extensionpath+'assets/upvote-icon.png" /><img class="nist-icon nist-alignright" id="nist-downvote" src="'+this.extensionpath+'assets/downvote-icon.png" /></div><div class="nist-clear"></div>':'') +
						' </td>' +
					'</tr>';*/
			var html =  '<div class="voice-suggesion-card">'+
						'	<div class="voice-card-left">'+
						'		<div class="voice-back-btn"><img nist-voice="true" id="backtosearch" src="'+this.extensionpath+'assets/voice-back.png"></div>'+
						'       <div class="voice-feedback-btns">' +
						'		    <img nist-voice="true" id="nist-upvote" class="voice-like-violet" src="'+this.extensionpath+'assets/voice-like.png">'+
						'		    <img nist-voice="true" id="nist-downvote" class="voice-dislike-violet" src="'+this.extensionpath+'assets/voice-dislike.png">'+
						'		    <img nist-voice="true" id="deletesequence" class="voice-delete-violet" src="'+this.extensionpath+'assets/voice-delete.png">'+
						'       </div>'+
						'		<h4>'+data.name.toString()+'</h4>'+
						'		<ul class="voice-sugggesion-bullet" id="nistvoicesteps">'+
						'		</ul>'+
						'	</div>'+
						'   <div class="nist-clear"></div>'+
						'</div>'+
						playiconhtml;
			var element=$(html);
			/*if(shownodelist==false) {
				element.click(function () {
					Voicepluginsdk.elasticresultaction(data);
				});
				$("#nist-voiceresultrow").append(element);
			} else {*/
				$("#nistvoicesearchresults").html(element);
				var performactionnode=false;
				for(var i=0;i<data.userclicknodesSet.length;i++){
					var visited = -1;
					if(navcookiedata.navigateddata.length>0) {
						visited = this.inarray(data.userclicknodesSet[i].id, navcookiedata.navigateddata);
					}
					// console.log(visited);
					if(navcookiedata.autoplay && (!navcookiedata.pause || !navcookiedata.stop)){
						if(visited==-1 && !performactionnode){
							performactionnode=data.userclicknodesSet[i];
							// console.log(performactionnode);
						}
					}
					$("#nistvoicesteps").append(this.rendersteps(data.userclicknodesSet[i],visited,navcookiedata));
				}
				if(this.sessionID==data.usersessionid){
					$("#deletesequence").click(function () {
						Voicepluginsdk.deletesequencelist(data);
					});
				}

				$('#nist-upvote').click(function () {
					Voicepluginsdk.addvote("up",data);
				});
				$('#nist-downvote').click(function () {
					Voicepluginsdk.addvote("down",data);
				});

				$("#nist-autoplay").click(function () {
					Voicepluginsdk.toggleautoplay(navcookiedata);
				});

				// need to improve the autoplay functionality.
				if(typeof performactionnode=="object" && this.autoplay) {
					console.log("performing action");
					this.performclickaction(performactionnode,navcookiedata);
				} else if(this.autoplay){
					/*if(navcookiedata.userclicknodesSet.length==navcookiedata.navigateddata.length){
						navcookiedata.navcompleted=true;
					}*/
					this.toggleautoplay(navcookiedata);
				}
				$("#backtosearch").click(function () {
					// console.log(navcookiedata.searchterm);
					Voicepluginsdk.backtosearchresults(navcookiedata);
				});
			// }
		},
		rendersteps:function(data,visited=false, navcookiedata={}){
			if(visited>-1) {
				var template = $("<li nist-voice=\"true\" class='active'>" + data.clickednodename + "</li>");
			} else {
				var template = $("<li nist-voice=\"true\" class=''>" + data.clickednodename + "</li>");
			}
			if(visited==-1) {
				template.click(function () {
					Voicepluginsdk.performclickaction(data,navcookiedata);
				});
			}
			return template;
		},
		performclickaction:function(selectednode,navcookiedata){
			var matchnodes = [];
			// console.log(selectednode);
			if(selectednode.objectdata) {
				// var selectednodedata=domJSON.toDOM(JSON.parse(selectednode.objectdata));
				var originalnode=JSON.parse(selectednode.objectdata);
				// console.log(originalnode);
				// console.log(selectednodedata);
				// console.log({converteddom:domJSON.toDOM(originalnode)});
				if(selectednode && this.htmlindex.length>0){
					for(var i=0;i<this.htmlindex.length;i++){
						var searchnode = this.htmlindex[i];
						var searchlabelexists=false;
						var comparenode=domJSON.toJSON(searchnode["element-data"]);
						// console.log(comparenode.node);
						var match=this.comparenodes(comparenode.node,originalnode.node);
						/*
						if(searchnode["element-data"].nodeName.toLowerCase()=="select"){
							console.log("---------------------------");
							console.log(originalnode.node);
							console.log(comparenode.node);
							console.log(match);
							console.log("---------------------------");
						}
						*/
						// if((match.matched+8)>=match.count){
						if((match.matched+17)>=match.count){
							searchlabelexists=true;
						}
						// console.log(match);
						// console.log(searchnode);
						// searchlabelexists = true;
						/*for (var j = 0; j < searchnode['element-labels'].length; j++) {
							var label = searchnode['element-labels'][j].text.toString().toLowerCase();
							if (label == selectednode.clickednodename.toString().toLowerCase()) {
								searchnode['element-labels'][j].match = true;
							}
						}*/
						/*if(searchnode["element-data"].isEqualNode(selectednodedata)){
							searchlabelexists=true;
							for (var j = 0; j < searchnode['element-labels'].length; j++) {
								var label = searchnode['element-labels'][j].text.toString().toLowerCase();
								if (label == selectednode.clickednodename.toString().toLowerCase()) {
									searchnode['element-labels'][j].match = true;
									searchlabelexists=true;
								}
							}
						}*/
						if(searchlabelexists){
							var matchnodeexists=false;
							if(matchnodes.length>0){
								for(var j=0;j<matchnodes.length;j++){
									if(matchnodes[j]["element-data"].isEqualNode(searchnode["element-data"])){
										matchnodeexists=true;
									}
								}
							}
							if(matchnodeexists===false) {
								matchnodes.push(searchnode);
							}
						}
					}
				}
			}
			// console.log(matchnodes);
			if(matchnodes.length == 1){
				this.updatenavcookiedata(navcookiedata,selectednode.id);
				this.matchaction(matchnodes[0],false);
				return;
			} else if(matchnodes.length>1) {
				//todo need to perform some user intervention
				// console.log("more than two clicknodes found");
				// console.log(selectednode.clickednodename);
				var finalmatchnode={};
				// for(var k=0;j<matchnodes.length;k++){
				// 	var matchnode=matchnodes[k];
				matchnodes.forEach(function (matchnode, matchnodeindex) {
					if(matchnode.hasOwnProperty("element-data")) {
						var inputlabels = Voicepluginsdk.getclickedinputlabels(matchnode["element-data"]);
						if (inputlabels == selectednode.clickednodename) {
							finalmatchnode = matchnode;
						}
					}
				});
				if(finalmatchnode.hasOwnProperty("element-data")) {
					// console.log(finalmatchnode);
					this.updatenavcookiedata(navcookiedata,selectednode.id);
					this.matchaction(finalmatchnode, false);
				}
				return;
			} else {
				console.log("no clicknodes found");
			}
		},
		comparenodes:function(comparenode,originalnode,match={count:0,matched:0}){
			// console.log(originalnode);
			for(var key in originalnode){
				// console.log(key);
				match.count++;
				if(comparenode.hasOwnProperty(key) && (typeof originalnode[key] === 'object') && (typeof comparenode[key] === 'object')){
					match.matched++
					match=this.comparenodes(comparenode[key], originalnode[key],match);
				} else if(comparenode.hasOwnProperty(key) && Array.isArray(originalnode[key]) && originalnode[key].length>0 && Array.isArray(comparenode[key]) && comparenode[key].length>0){
					match.matched++;
					if(comparenode[key].length==originalnode[key].length) {
					// 	match.matched++
						for (var i = 0; i < originalnode[key].length; i++) {
							match=this.comparenodes(comparenode[key][i], originalnode[key][i],match);
						}
					}
				} else if(comparenode.hasOwnProperty(key) && comparenode[key]==originalnode[key]){
					match.matched++;
				}
			}
			return match;
		},
		createstoragedata:function(key,value){
			window.localStorage.setItem(key, value);
		},
		getstoragedata:function(key){
			var result=window.localStorage.getItem(key);
			return result;
		},
		deletesequencelist:function(data){
			// console.log(data);
			var confirmdialog=confirm("Are you sure want to delete "+data.name);
			if(confirmdialog === true){
				Voicepluginsdk.confirmdelete(data);
			}
		},
		confirmdelete:function (data) {
			var senddata=JSON.stringify({usersessionid:this.sessionID,id:data.id});
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/sequence/delete", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status == 200){
					// console.log(xhr.response);
					Voicepluginsdk.closemodal();
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send(senddata);
		},
		addvote:function(votetype,data){
			var senddata={"usersessionid": this.sessionID, "sequenceid" : data.id, "upvote":0, "downvote":0};
			if(votetype=="up"){
				senddata.upvote=1;
			} else if(votetype=="down"){
				senddata.downvote=1;
			}
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/sequence/addvote", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status == 200){
					// console.log(xhr.response);
				} else {
					console.log(xhr.status+" : "+xhr.statusText);
				}
			};
			xhr.send(JSON.stringify(senddata));
		},
		startautoplay:function(){

		},
		stopautoplay:function () {

		},
		pauseautoplay:function () {

		},
		toggleautoplay:function(navcookiedata){
			if(navcookiedata.autoplay){
				navcookiedata.autoplay=false;
				this.autoplay=false;
			} else {
				navcookiedata.autoplay=true;
				this.autoplay=true;
			}
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.showselectedrow(navcookiedata.data,navcookiedata.data.id,true, navcookiedata);
		},
		updatenavcookiedata:function(navcookiedata,selectednodeid){
			navcookiedata.navigateddata.push(selectednodeid);
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
		},
		backtosearchresults:function (navcookiedata) {
			if(navcookiedata.searchterm!=''){
				var navcookiedata1 = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:navcookiedata.searchterm};
				this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata1));
				this.autoplay=false;
				$("#voicesearchinput").val(navcookiedata.searchterm);
				this.searchinelastic(navcookiedata.searchterm);
			}
		}
	};
	Voicepluginsdk.init();
} else {
	// this script has already been loaded
	// probably have it 2x on the same page
}

/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
	if (!window.console) {
		window.console = {};
	}
	// union of Chrome, FF, IE, and Safari console methods
	var m = [
		"log", "info", "warn", "error", "debug", "trace", "dir", "group",
		"groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
		"dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
		];
	// define undefined methods as noops to prevent errors
	for (var i = 0; i < m.length; i++) {
		if (!window.console[m[i]]) {
			window.console[m[i]] = function() {};
		}    
	} 
})();