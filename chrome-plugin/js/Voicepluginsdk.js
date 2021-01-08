/*
Voice plugin Javascript SDK Library
IMPORTANT NOTE: Copying this library and hosting it locally is strongly discouraged.
 */
// creating the sdk variable
if (typeof Voicepluginsdk === 'undefined') {
	var badBrowser=false;
	if(navigator.appName.indexOf("Internet Explorer") !== -1){
		badBrowser=(navigator.appVersion.indexOf("MSIE 1") === -1);
	}
	var speechrecognitionavailable=false;
	var voiceRecognition;

	// initializing voice recognition library
	if(!window.hasOwnProperty("webkitSpeechRecognition")){
		speechrecognitionavailable=false;
	} else {
		speechrecognitionavailable=true;
		voiceRecognition = window.webkitSpeechRecognition;
	}

	// listening for user session data from extension call
	document.addEventListener("Usersessiondata", function(data) {
		Voicepluginsdk.createsession(JSON.parse(data.detail.data));
	});

	document.addEventListener("AuthenticatedUsersessiondata", function(data) {
		Voicepluginsdk.createsession(JSON.parse(data.detail.data));
		Voicepluginsdk.openmodal(true);
	});

	document.addEventListener("Alertmessagedata", function(data) {
		alert(JSON.parse(data.detail.data));
	});

	var debugsetevent = new CustomEvent("Debugsetevent", {detail: {data: {action:'Debugvalueset',value:voicedebug}}, bubbles: false, cancelable: false});
	document.dispatchEvent(debugsetevent);

	// initializing the sdk variable need to change to a new variable in future.
	var Voicepluginsdk = {
		sdkUrl: "/",
		apihost: DSA_API_URL,
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
		processcount:0,
		totalcount:0,
		rerenderhtml:true,
		processingnodes:false,
		processedclickobjectscount:0,
		recording:false,
		addcustomcssdomains:["app.vantagecircle.co.in","app.vantagecircle.com","dashboard.vantagecircle.com","dashboard.vantagecircle.co.in"],
		containersections:[],
		introjs:[],
		introjstotalsteps:0,
		introjscurrentstepnumber:0,
		introjsaddedstepnodes:[],
		lastclickednode:'',
		lastclickedtime:'',
		maxstringlength:40,
		confirmednode:false,
		ignoreattributes: [
			'translate','draggable','spellcheck','tabindex','clientHeight','clientLeft','clientTop','clientWidth',
			'offsetHeight','offsetLeft','offsetTop','offsetWidth','scrollHeight','scrollLeft','scrollTop','scrollWidth',
			'baseURI','isConnected','ariaPressed', 'aria-pressed', 'nodePosition', 'outerHTML', 'innerHTML', 'style',
			'aria-controls', 'aria-activedescendant', 'ariaExpanded', 'autocomplete', 'aria-expanded', 'aria-owns', 'formAction',
			'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y'
		],
		innerTextWeight: 5,
		logLevel: 0,
		playNextAction: true,
		forceReindex: false,
		searchText: null,
		searchInProgress: false,
		ignoreNodes: ['ng-dropdown-panel','ckeditor','fusioncharts','ngb-datepicker','ngx-daterangepicker-material'],
		cancelRecordingDuringRecordingNodes: ['ngb-datepicker'],
		tooltipDisplayedNodes: [],
		//replayvariables
		autoplayCompleted: false,
		autoplayPaused: false,
		// manual click variables
		invokedActionManually: false,
		// personal node ignore attributes
		personalNodeIgnoreAttributes: [
			'innerText', 'innerHTML', 'outerText', 'outerHTML', 'nodeValue', 'src', 'naturalWidth', 'naturalHeight', 'currentSrc'
		],
		inarray:function(value,object){
			return jQuery.inArray(value, object);
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

		//adding required script functionality to the head of the page.
		loadScript: function(url) {

			var script = document.createElement("script");
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
		},
		loadOtherScript: function(url) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			if (script.readyState){
				script.onreadystatechange = function(){
					if (script.readyState === "loaded" || script.readyState === "complete"){
						script.onreadystatechange = null;
						Voicepluginsdk.totalotherScriptsCompleted++;
						if (Voicepluginsdk.totalotherScriptsCompleted === Voicepluginsdk.totalotherScripts) {
							Voicepluginsdk.allReady();
						}
					}
				};
			} else {
				script.onload = function(){
					Voicepluginsdk.totalotherScriptsCompleted++;
					if (Voicepluginsdk.totalotherScriptsCompleted === Voicepluginsdk.totalotherScripts) {
						Voicepluginsdk.allReady();
					}
				};
			}
			document.body.appendChild(script);
		},
		loadCssScript: function(url) {
			var script = document.createElement("link");
			script.rel="stylesheet";
			script.type = "text/css";
			script.href = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		otherscripts: function(){
			this.totalotherScripts=1;
			this.loadCssScript(this.extensionpath+"css/extension.css");
			this.loadOtherScript(this.extensionpath+"js/domJSON.js");
			if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1){
				this.loadCssScript(this.extensionpath+"css/"+window.location.host+".css");
			}
			if(typeof introJs === 'undefined'){
				this.totalotherScripts++;
				this.loadOtherScript(this.extensionpath+"js/intro.min.js");
				this.loadCssScript(this.extensionpath+"css/introjs.min.css");
			}
		},
		allReady: function() {
			// execute the parsing method after everything is ready.
			this.onReady();
		},
		configureintrojs: function(label = 'Continue') {
			// Intro js configuration has been added
			this.introjs=introJs().setOptions({
				showStepNumbers:false,
				showBullets:false,
				showProgress:false,
				exitOnOverlayClick:false,
				exitOnEsc:false,
				keyboardNavigation:false,
				doneLabel: label,
				skipLabel: 'Exit',
				tooltipPosition: 'right'
			})
				.onexit(function (){
					Voicepluginsdk.resetIntrojs();
				});
			if (this.introjsaddedstepnodes.length>0) {
				this.introjstotalsteps = 0;
				this.introjscurrentstepnumber = 0;
				this.introjsaddedstepnodes = [];
			}
		},
		onReady: function () {

			// check user session exists and create if not available
			this.checkuserkeyexists();

			this.configureintrojs();

			// adding speech recognition functionality based on the library availability
			if(speechrecognitionavailable){
				this.recognition = new voiceRecognition();
				this.speechrecognitionavailable = true;
				
				this.recognition.onstart = function() {
					textfromspeech = "";
				};

				this.recognition.onspeechend = function() {

				};

				this.recognition.onerror = function(event) {
					if(event.error === 'no-speech') {
						alert('No speech was detected. Try again.');
					}
				};

				this.recognition.onresult = function(event) {
					if (event.results.length > 0) {
						var current = event.resultIndex;
						// Get a transcript of what was said.
						var transcript = event.results[current][0].transcript;
						jQuery("#voicesearchinput").val(transcript);
						Voicepluginsdk.searchinelastic();
					}
				};
			}

			this.ready = true;

			// listen for when to start the indexing of the dom based on the clicknodes availability
			document.addEventListener("Indexnodes", function(data) {
				if(data.detail.data==="indexclicknodes") {
					Voicepluginsdk.indexclicknodes();
				} else if(data.detail.data==="indexnewclicknodes") {
					Voicepluginsdk.indexnewclicknodes();
				}
			});

			// We need to wait till all dom content is loaded. We initially used a standard wait time but shifted to
			//      use https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
			//      This still produces some discrepancy where it hangs up the web page.
			//      This needs to be improved at some point.
			window.addEventListener('load', (event) => {
				Voicepluginsdk.modifybodyhtml();
			});
		},
		checkuserkeyexists:function(){
			var sessiondata=this.getstoragedata(this.cookiename);
			if(sessiondata){
				var parsedsessiondata=JSON.parse(sessiondata);
				this.sessiondata=parsedsessiondata;
				this.sessionID=parsedsessiondata.sessionkey;
				this.recorddocumentclick();
			}else{
				var sessionevent = new CustomEvent("RequestSessiondata", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		createsession:function(data){
			var sessiondata=this.getstoragedata(this.cookiename);
			if(sessiondata){
				this.sessiondata=data;
				this.sessionID=data.sessionkey;
				this.createstoragedata(this.cookiename,JSON.stringify(data));
			}else{
				dsaSessionID=data.sessionkey;
				this.sessiondata=data;
				this.sessionID=data.sessionkey;
				this.createstoragedata(this.cookiename,JSON.stringify(data));
			}
			this.recorddocumentclick();
		},
		modifybodyhtml:function(){
			var html='<div id="nistBtn" nist-voice="true"></div><div id="nist-steps-content" style="display: none;"><div id="voicemodalhtml" nist-voice="true"></div></div>';

			jQuery(document.body).prepend(html);

			if(typeof isvoicesdk === 'undefined') {
				jQuery(window).trigger('resize').promise().done(function () {
					Voicepluginsdk.indexclicknodes();
					Voicepluginsdk.addbuttonhtml();
				});
			} else {
				Voicepluginsdk.indexclicknodes();
				Voicepluginsdk.addbuttonhtml();
			}
			setInterval(function () {
				if(lastindextime!==0 && lastindextime<lastmutationtime) {
					Voicepluginsdk.indexnewclicknodes();
				}
			},DSA_POST_INTERVAL);
		},
		addbuttonhtml:function(){
			jQuery("#nistBtn").unbind("click").html("");
			var buttonhtml='<img src="'+this.extensionpath+'assets/uda-logo.png" width="50px" height="50px" nist-voice="true">';
			var modal =jQuery("#nistBtn");
			modal.append(buttonhtml);
			modal.click(function () {
				Voicepluginsdk.openmodal(true);
			});
			if(this.rerenderhtml) {
				this.showhtml();
			}
		},
		addvoicesearchmodal:function(addnisticon=true){
			var recbtn ='	   <button nist-voice="true" id="nistvoiceadvbtn" class="voice-record-img"><span nist-voice="true">Advanced</span></button>';

			if(!addnisticon){
				recbtn ='	   <button nist-voice="true" id="nistvoicerecstpbtn" class="voice-record-img"><img nist-voice="true" style="vertical-align:middle" src="'+this.extensionpath+'assets/voice-stop.png"> <span nist-voice="true">Stop</span></button>';
			}
			var html =  '<div class="voice-redmine-rght">'+
						'   <div class="">'+
						'	    <div class="voice-hng-left"><h3>How Can I Help You Today?</h3></div>'+
						'	    <div class="voice-hng-right"><img id="closenistmodal" style="vertical-align:middle;" src="'+this.extensionpath+'assets/voice-close.png"></div>'+
						'       <div class="nist-clear"></div>'+
						'   </div>'+
						'	<div class="voice-red-hr-line"></div>'+
						'	<div class="voice-srch-bg">'+
						'		<span class="voice-srch"><img src="'+this.extensionpath+'assets/voice-search.png"></span><input type="search" class="voice-srch-fld" nist-voice="true" id="voicesearchinput" placeholder="Search..." />' +
						'       <span id="nist-voice-icon-start" class="voice-voice-srch" nist-voice="true"><img nist-voice="true" src="'+this.extensionpath+'assets/voice-voice.png" /></span>'+
						'       <span style="display:none;" class="voice-voice-srch" id="nist-voice-icon-stop" nist-voice="true"><img src="'+this.extensionpath+'assets/stop.png" nist-voice="true" /></span>' +
						'	</div>'+
						'   <div>'+
								recbtn +
						'   </div>'+
						'   <div class="nist-clear"></div>'+
						'   <div id="nistvoicesearchresults"></div>'+
						'	<br/><br/><br/>'+
						'</div>';
			jQuery("#voicemodalhtml").html(html);
			jQuery("#closenistmodal").click(function(){
				Voicepluginsdk.closemodal();
			});
			jQuery("#voicesearch").click(function(){
				Voicepluginsdk.searchinelastic();
			});
			jQuery("#voicesearchinput").keydown(function (e) {
				if (e.keyCode === 13) {
					jQuery("#nistvoicesearchresults").html("");
					Voicepluginsdk.searchinelastic();
					return false;
				}
			});
			if(speechrecognitionavailable){
				jQuery("#nist-voice-icon-start").click(function () {
					jQuery("#nistvoicesearchresults").html("");
					Voicepluginsdk.recognition.start();
					jQuery("#nist-voice-icon-start").hide();
					jQuery("#nist-voice-icon-stop").show();
				});
				jQuery("#nist-voice-icon-stop").click(function () {
					Voicepluginsdk.recognition.stop();
					jQuery("#nist-voice-icon-stop").hide();
					jQuery("#nist-voice-icon-start").show();
				});
			} else {
				jQuery("#nist-voice-icon-start").hide();
				jQuery("#nist-voice-icon-stop").hide();
			}
			if(addnisticon) {
				jQuery("#nistvoiceadvbtn").click(function () {
					Voicepluginsdk.showadvancedhtml();
				});
			} else {
				jQuery("#nistvoicerecstpbtn").click(function () {
					Voicepluginsdk.gettimestamp("stop");
				});
			}
		},
		//opening the UDA screen
		openmodal:function(focus=false){
			if(this.sessiondata.authenticated) {
				jQuery("#nistBtn").hide();
				jQuery('#nist-steps-content').show();
				jQuery("#nistModal").css("display", "block");
				var searchinput=jQuery("#voicesearchinput");
				searchinput.val("");
				if (focus) {
					searchinput.focus();
				}
				if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1) {
					let bodychildren = document.body.childNodes;
					if (bodychildren.length > 0) {
						bodychildren.forEach(function (childnode, childnodeindex) {
							if (childnode.classList && childnode.classList.contains("container")) {
								Voicepluginsdk.containersections.push(childnodeindex);
								childnode.classList.remove("container");
							}
							if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'nistBtn' && childnode.id !== 'nist-steps-content') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
								if (childnode.classList && !childnode.classList.contains("nist-original-content")) {
									childnode.classList.add("nist-original-content");
								}
							}
						});
					}
				}
			} else {
				var sessionevent = new CustomEvent("RequestSessiondata", {detail: {data: "authtenicate"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		//closing the UDA screen
		closemodal:function(){
			jQuery("#nistvoiceadvbtn").show();
			jQuery('#nist-steps-content').hide();
			jQuery("#nistModal").css("display","none");
			jQuery("#nistvoicesearchresults").html("");
			jQuery("#nistrecordresults").html("");
			this.recordedsequenceids=[];
			jQuery("#nistBtn").show();
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.cancelrecordingsequence(false);
			if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1) {
				let bodychildren = document.body.childNodes;
				if (bodychildren.length > 0) {
					bodychildren.forEach(function (childnode, childnodeindex) {
						if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'nistBtn' && childnode.id !== 'nist-steps-content') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
							if (childnode.classList && childnode.classList.contains("nist-original-content")) {
								childnode.classList.remove("nist-original-content");
							}
						}
						if (Voicepluginsdk.containersections.length > 0 && Voicepluginsdk.inarray(childnodeindex, Voicepluginsdk.containersections) !== -1) {
							childnode.classList.add("container");
						}
					});
				}
			}
		},
		//Resetting introjs and continue to next playable action
		resetIntrojs: function () {
			this.configureintrojs();
			this.playNextAction = true;
			this.showhtml();
		},
		//render the required html for showing up the proper html
		showhtml:function(){
			if(!this.playNextAction) {
				return;
			}
			this.rerenderhtml=false;
			var addnisticon=true;
			var checkrecording = this.getstoragedata(this.recordingcookiename);
			if(checkrecording){
				var checkrecordingdata=JSON.parse(checkrecording);
				if(checkrecordingdata.hasOwnProperty("recording") && checkrecordingdata.recording){
					addnisticon=false;
					this.recording=true;
					this.openmodal(false);
				} else {
					this.recording = false;
				}
			}
			if(addnisticon){
				this.addvoicesearchmodal(addnisticon);
				var navigationcookie=this.getstoragedata(this.navigationcookiename);
				if(navigationcookie){
					var navigationcookiedata = JSON.parse(navigationcookie);
					if(navigationcookiedata.shownav) {
						this.openmodal();
						if(navigationcookiedata.autoplay){
							this.autoplay=true;
						}
						this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
					}
				}
			} else {
				this.addvoicesearchmodal(addnisticon);
				this.showrecordedresults();
			}
		},
		// indexing all nodes after all the clicknodes are available
		indexclicknodes: function(){
			this.processcount=dsaClickObjects.length;
			this.previousurl=this.currenturl=window.location.href;
			this.processingnodes=true;
			// indexing nodes has been called for adding click detection
			this.indexdom(document.body);
			this.processedclickobjectscount=this.processcount;
			this.totalcount=dsaClickObjects.length;
			this.processingnodes=false;
			if(this.processcount<this.totalcount){
				//	todo refine the processing nodes.
				this.indexnewclicknodes();
				return;
			}
			lastindextime=Date.now();
		},
		// indexing new clicknodes after new html got loaded
		indexnewclicknodes: async function(){
			if(this.processingnodes){
				return;
			}
			this.processcount=dsaClickObjects.length;
			if(lastindextime!==0 && lastindextime>lastmutationtime){
				return;
			}
			lastindextime=Date.now();
			this.processingnodes=true;
			if(await this.removefromhtmlindex()) {
				this.indexnewnodes = true;
				this.currenturl = window.location.href;
				this.indexdom(document.body);
				this.processedclickobjectscount = this.processcount;
				this.processingnodes = false;
				this.totalcount = dsaClickObjects.length;
			}
			if(this.processcount<this.totalcount){
				//todo new nodes added need to reprocess
				console.log('Need to do the processing');

			}
		},
		removefromhtmlindex:async function(){
			if (this.forceReindex) {
				this.htmlindex = [];
				this.forceReindex = false;
				return Promise.resolve(1);
			}
			if(this.htmlindex.length>0){
				let newhtmlindex=[];
				let htmlindexlength=this.htmlindex.length;
				for(var htmli=0;htmli<htmlindexlength;htmli++) {
					let checknode=this.htmlindex[htmli];
					let removedclickobjectslength=removedclickobjects.length;
					let foundremovedindexednode=-1;
					for (var k = 0; k < removedclickobjectslength; k++) {
						if(removedclickobjects[k].element === window){
							continue;
						}
						let removedclickobject=removedclickobjects[k].element;

						if (checknode['element-data'].isSameNode(removedclickobject)) {
							foundremovedindexednode=k;
							break;
						}
					}
					if(foundremovedindexednode===-1){
						newhtmlindex.push(checknode);
					} else {
						removedclickobjects.splice(foundremovedindexednode,1);
					}
				}
				this.htmlindex=newhtmlindex;
				return Promise.resolve(1);
			}
		},
		// indexing functionality for the entire dom
		indexdom: function( node, ret=false, parentnode="", textlabel="", hasparentnodeclick=false, parentclicknode= null ) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:

					if(!ret && parentnode!=="") {
						node = this.indexnode(node, parentnode, hasparentnodeclick, false, parentclicknode);
					}

					node.haschildclick=false;

					// Checking for ignore nodes during indexing
					if (this.inarray(node.nodeName.toLowerCase(), this.ignoreNodes) !== -1) {
						if(node.nodeName.toLowerCase() === 'ckeditor' && node.childNodes.length>2 && this.recording){
							// console.log({editoriframe:node.childNodes[2].childNodes[1].childNodes[1].childNodes[1]});
							/*jQuery(node.childNodes[2].childNodes[1].childNodes[1].childNodes[1]).bind("mousedown, mouseup, click",function(){
								jQuery(this).contents().on("mousedown, mouseup, click", function(){

								});
								alert("Click detected inside iframe.");
								console.log('record user click');
								// Voicepluginsdk.recorduserclick(node, false, false, event, confirmdialog);
							});*/
							let addToolTip = true;
							for(let checknode of this.tooltipDisplayedNodes){
								if(node.isSameNode(checknode)) {
									addToolTip = false;
								}
							}
							if(addToolTip) {
								this.tooltipDisplayedNodes.push(node);
								$(node).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">We have detected a rich text editor. To record this in your sequence, Please click on the editor menu. We are unable to record clicks on the text area.</div></div>');
							}
						} else if(this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
							this.addClickToNode(node);
						} else {
							/*$(node).click(function (){
								alert('currently we do not support this action to be recorded');
							});*/
						}
					} else if(node.classList && node.classList.contains('select2-container--open') && !node.classList.contains('select2-container--focus')){
					//	do nothing as we are not going to deal with special classes
						if(this.logLevel>0){
							console.log('select2 dropdown issue fix');
						}
					} else if(node.nodeName.toLowerCase() === "div" && node.hasAttribute("uib-datepicker-popup-wrap")){
						if(this.logLevel>0){
							console.log('date picker in javascript');
						}
					} else if(node.hasChildNodes()){
						var childnodes =  node.childNodes;
						var hasparentclick = false;
						if(node.hasOwnProperty("hasclick") || hasparentnodeclick){
							hasparentclick=true;
							if(parentclicknode===""){
								parentclicknode=node;
							}
						}

						if(childnodes.length>0){
							for (var i=0;i<childnodes.length;i++){
								var childnode=childnodes[i];
								this.nodeid++;
								if(this.ignoreelements.indexOf(childnode.nodeName.toLowerCase())===-1) {
									if(ret){
										if(textlabel===""){
											textlabel = this.indexdom(childnode, ret, node, textlabel);
										}else {
											textlabel += " " + this.indexdom(childnode, ret, node, textlabel);
										}
									} else {
										node.childNodes[i] = this.indexdom(childnode, ret, node,"", hasparentclick, parentclicknode);
										if(node.childNodes[i].hasOwnProperty("hasclick") && node.childNodes[i].hasclick){
											node.haschildclick=true;
										}
										if(hasparentclick && node.childNodes[i].hasOwnProperty("haschildclick") && node.childNodes[i].haschildclick){
											node.haschildclick=true;
										}
									}
								}
							}
						}
					}

					// add click to node to send what user has clicked.
					// known scenario that node has parent click
					if(node.hasOwnProperty("hasclick") && node.hasclick && (node.nodeName.toLowerCase()==="select" || !node.haschildclick)){
						node=this.addClickToNode(node);
					} else if(node.hasOwnProperty("hasclick") && node.hasclick && node.haschildclick){
						node=this.addClickToNode(node,true);
					}

					break;
				case Node.TEXT_NODE:
					if(node.nodeValue!=="") {
						textlabel = node.nodeValue;
					}
					break;
			}

			if(ret && textlabel!==""){
				return textlabel;
			} else if(!ret) {
				return node;
			}
		},
		// Check for each node and then match it with the available clicknodes which are identified by links.js
		indexnode: function(node, parentnode, hasparentnodeclick=false, fromdocumentclick=false, parentclicknode=""){
			var elementdata = {"element-type": "", "element-labels" : [], "element-action" : "", "element-path" : "","element-url":"", "element-data":[],"menu-items":[]};

			if(parentnode.classList && parentnode.classList.contains("tab-content")){
				node.displaytype = "tab-content";
				node.tabid = node.id;
			}

			var clickobjectexists=false;
			var clickobject={};

			if(node.hasAttribute("nist-voice") && node.getAttribute("nist-voice")){
				return node;
			}


			// Multiple clicks are recorded for select2-selection class. select2-selection--multiple
			// This will create a problem during playback. We should record only one click to avoid this problem
			if(node.classList && (node.classList.contains("select2-search__field") || node.classList.contains('cdk-overlay-backdrop'))) {
				return node;
			}

			if(this.htmlindex.length>0){
				for(var htmli=0;htmli<this.htmlindex.length;htmli++){
					if(node.isSameNode(this.htmlindex[htmli]['element-data'])){
						node.hasclick=true;
						return node;
					}
				}
			}

			for (var i = 0; i < dsaClickObjects.length; i++) {
				if(dsaClickObjects[i].element===window){
					continue;
				}
				if (node.isSameNode(dsaClickObjects[i].element)) {
					clickobjectexists = true;
					clickobject = dsaClickObjects[i];
				}
			}

			if(this.logLevel>2) {
				if(this.inarray(node.nodeName.toLowerCase(), this.ignoreNodes) !== -1) {
					console.log({indexingnode: node});
				}
			}

			if(node.hasAttribute("type") && node.getAttribute("type") === "hidden"){
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

				if(parentnode.classList && parentnode.classList.contains("tab-content")){
					node.displaytype = "tab-content";
				}

				if(elementdata["element-labels"].length===0){
					elementdata["element-labels"] = this.getInputLabels(node,[],1);
				}

				if(elementdata["element-labels"].length===0){
					return node;
				}

				if((node.hasOwnProperty("displaytype") && node.displaytype==="tab-content") || (node.hasOwnProperty("navtype") && node.navtype==="navtab")){
					for(var j=0;j<this.menuitems.length;j++){
						var menuitem=this.menuitems[j];
						if(menuitem.refid === node.tabid) {
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

				if(elementdata["element-path"]==="") {
					if (node.hasOwnProperty("path")) {
						elementdata["element-path"] = node.path;
					}
				}

				if(node.getAttribute("data-toggle") && node.getAttribute("data-toggle")==="tab"){
					node.navtype="navtab";
					elementdata["element-action"] = "navtab";
				}

				let uda_custom = {hasparentclick: false, parentnode: {}, domJson: domJSON.toJSON(node)};
				if(hasparentnodeclick) {
					uda_custom.hasparentclick = true;
					uda_custom.parentnode = parentnode;
				}
				node.uda_custom = uda_custom;

				elementdata["element-data"] = node;
				elementdata["clickobject"] = clickobject;

				this.htmlindex.push(elementdata);
			}

			return node;
		},
		// getting the text for the clicknodes.
		getInputLabels: function(node, inputlabels, iterationno, iterate=true, getchildlabels=true, fromclick=false, iteratelimit=3, ignorenode=[]){

			if(Array.isArray(ignorenode)){
				ignorenode=node;
			}

			if((node.nodeName.toLowerCase() === "select" || node.nodeName.toLowerCase() === "checkbox") && iterate && inputlabels.length===0){
				iterationno++;
				inputlabels = this.getInputLabels(node.parentNode, inputlabels, iterationno, iterate, true, fromclick, iteratelimit, ignorenode);
				if(fromclick) {
					//todo need to rework
				}
			}

			if(node.nodeName.toLowerCase() === "input" || node.nodeName.toLowerCase() === "textarea" || node.nodeName.toLowerCase() === "img"){

				if(node.getAttribute("placeholder") && node.getAttribute("placeholder")!=="") {
					inputlabels.push({"text":node.getAttribute("placeholder").toString(),"match":false});
				}
				if(node.getAttribute("type") && (node.getAttribute("type").toLowerCase()==="submit" || node.getAttribute("type").toLowerCase()==="file")) {
					if(node.getAttribute("value")){
						inputlabels.push({"text":node.getAttribute("value").toString(),"match":false});
						iterate=false;
					}
				}
				if(node.getAttribute("alt")){
					inputlabels.push({"text":node.getAttribute("alt").toString(),"match":false});
				}
			}

			/*if(node.nodeName.toLowerCase() === "button" && node.textContent && node.textContent !== '') {
				console.log(node.textContent);
				inputlabels.push({"text":node.textContent,"match":false});
				console.log(inputlabels);
			}*/

			if(getchildlabels && node.childNodes.length>0){
				var childnodes = node.childNodes;
				childnodes.forEach(function (childnode, key) {
					if(childnode.nodeName.toLowerCase()!=="script" || childnode.nodeName.toLowerCase()!=="select") {
						var textcontent = childnode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
						if (textcontent !== "" && ignorenode.isSameNode(childnode) === false) {
							inputlabels.push({"text": textcontent, "match": false});
						}
					}
				});
			}

			if(inputlabels.length===0 && node.getAttribute("data-tooltip")){
				inputlabels.push({"text":node.getAttribute("data-tooltip").toString(),"match":false});
			}

			if(inputlabels.length===0 && node.getAttribute("aria-label")){
				inputlabels.push({"text":node.getAttribute("aria-label").toString(),"match":false});
			}

			//todo fix for image tags
			if(iterate && node.nodeName.toLowerCase() !== "img" && inputlabels.length === 0 && iterationno<=iteratelimit){
				iterationno++;
				inputlabels = this.getInputLabels(node.parentNode,[], iterationno, iterate, getchildlabels, fromclick, iteratelimit);
			}

			if(inputlabels.length===0 && node.id!==""){
				inputlabels.push({"text":(node.nodeName.toLowerCase()+"-"+node.id),"match":false});
			}else if(inputlabels.length===0 && node.hasAttribute("class") && node.className && node.className!==""){
				var classname=node.className.toString();
				inputlabels.push({"text":(node.nodeName.toLowerCase()+"-"+classname.replace(" ","-")),"match":false});
			} else if(inputlabels.length===0){
				inputlabels.push({"text":(node.nodeName.toLowerCase()),"match":false});
			}

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
				inputlabel = this.getinputlabel(parentnode.parentNode,"");
			}

			return inputlabel;
		},
		addClickToNode:function(node, confirmdialog=false){
			if(node.hasOwnProperty("addedclickrecord") && node.addedclickrecord===true){
				return;
			}

			var nodename=node.nodeName.toLowerCase();
			switch (nodename) {
				case "select":
					jQuery(node).on({"focus":function(event){
							Voicepluginsdk.recorduserclick(node, false,false, event, confirmdialog);
						}
					});
					break;
				case "input":
					if(!node.hasAttribute("type")){
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
							jQuery(node).click(function (event) {
								Voicepluginsdk.recorduserclick(node, false, false, event, confirmdialog);
							});
							break;
						default:
							jQuery(node).click(function (event) {
								Voicepluginsdk.recorduserclick(node, false, false, event, confirmdialog);
							});
							break;
					}
					break;
				case "mat-select":
					jQuery(node).click(function (event) {
						Voicepluginsdk.recorduserclick(node, false, false, event, confirmdialog);
					});
					break;
				default:
					jQuery(node).click(function (event) {
						Voicepluginsdk.recorduserclick(node, false, false, event, confirmdialog);
					});
					break;
			}
			node.addedclickrecord=true;
			return node;
		},
		//matching the action of the node and invoking whether to click or focus
		matchaction:function(data,close=true,selectednode){
			if(close) {
				this.closemodal();
			}
			var node=data["element-data"];
			var timetoinvoke=1000;

			if(!this.playNextAction) {
				return;
			}

			if(this.logLevel>2) {
				console.log({invokingnode: node});
			}

			// remove added tooltips before invoking
			let tooltipnodes = $('.tooltip-dsa');
			if (tooltipnodes.length > 0) {
				$('.tooltip-dsa').each(function() {
					$(this).removeClass('tooltip-dsa');
					$(this).find('.tooltip-dsa-right').remove();
				});
			}

			this.simulateHover(node);
			switch (node.nodeName.toLowerCase()) {
				case "input":
					this.playNextAction = false;
					// functionality for detecting multi select box and highlighting the recorded node
					if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))){
						var navigationcookie=this.getstoragedata(this.navigationcookiename);
						if(navigationcookie){
							var navigationcookiedata = JSON.parse(navigationcookie);
							if(navigationcookiedata && navigationcookiedata.autoplay) {
								this.autoplay = false;
								this.autoplayPaused = true;
								this.toggleautoplay(navigationcookiedata);
							} else {
								this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
							}
						}
						/*this.introjs.addStep({
							element: node,
							intro: "Please select the value and then click on play",
							position: 'right',
						}).start();*/
						$('html, body').animate({
							scrollTop: ($(node).offset().top - 200)
						}, 2000, function(){
							$(node.parentNode.parentNode.parentNode.parentNode.parentNode).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">Please select the value and then click on play</div></div>');
							node.focus();
						});
					} else if(node.hasAttribute('type') && (node.getAttribute('type')==='checkbox' || node.getAttribute('type')==='radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
						this.introjs.addStep({
							element: node.parentNode.parentNode,
							intro: "Please input in the field and then continue.",
							position: 'right',
						}).start();
					} else {
						this.introjs.addStep({
							element: node,
							intro: "Please input in the field and then continue.",
							position: 'right',
						}).start();
					}
					break;
				case "textarea":
					this.playNextAction = false;
					this.introjs.addStep({
						element: node,
						intro: "Please select the value and then continue.",
						position: 'right'
					}).start();
					break;
				case "select":
					this.playNextAction = false;
					this.introjs.addStep({
						element: node,
						intro: "Please select the value and then continue.",
						position: 'right',
					}).start();
					break;
				case "option":
					node.parentNode.focus();
					break;
				case "checkbox":
					node.click();
					this.invokenextitem(node,timetoinvoke);
					break;
				// Additional processing for calendar selection
				case "button":
					if(node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
						// node.click();
						/*this.introjs.addStep({
							element: node,
							intro: "Please select the value and then continue.",
							position: 'right',
						}).start();*/
						let showalert = false;
						this.configureintrojs('Continue to select');
						var navigationcookie=this.getstoragedata(this.navigationcookiename);
						var navigationcookiedata = null;
						if(navigationcookie){
							navigationcookiedata = JSON.parse(navigationcookie);
							if(navigationcookiedata) {
								for (var i = 0; i < navigationcookiedata.data.userclicknodesSet.length; i++) {
									if (navigationcookiedata.data.userclicknodesSet[i].id !== selectednode.id && navigationcookiedata.data.userclicknodesSet[i].clickednodename === selectednode.clickednodename) {
										showalert = true;
									}
								}
							}
						}
						$('html, body').animate({
							scrollTop: ($(node).offset().top - 200)
						}, 2000, function() {
							$(node.parentNode).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">Please select the date in the calendar. After you are done, please click on "play" in the "Assistant" pane to the right.</div></div>');
							node.click();
						});
						if(navigationcookiedata && navigationcookiedata.autoplay) {
							this.autoplay = false;
							this.autoplayPaused = true;
							this.toggleautoplay(navigationcookiedata);
						} else {
							this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
						}
					} else if(node.classList && node.classList.contains('btn-pill')) {
						// fix for navigation issue
						// this.forceReindex = true;
						node.click();
						this.invokenextitem(node,timetoinvoke);
					} else {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					}
					break;
				case 'span':
					if (node.classList && node.classList.contains('select2-selection')) {
						this.playNextAction = false;
						var navigationcookie=this.getstoragedata(this.navigationcookiename);
						if(navigationcookie){
							var navigationcookiedata = JSON.parse(navigationcookie);
							if(navigationcookiedata && navigationcookiedata.autoplay) {
								this.autoplay = false;
								this.autoplayPaused = true;
								this.toggleautoplay(navigationcookiedata);
							} else {
								this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
							}
						}
						$('html, body').animate({
							scrollTop: ($(node).offset().top - 200)
						}, 2000, function(){
							$(node.parentNode.parentNode).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">Please select the value and then click on play</div></div>');
							node.click();
						});
					}
					break;
				case 'div':
					if(node.classList && (node.classList.contains('mat-form-field-flex') || node.classList.contains('mat-select-trigger'))) {
						this.playNextAction = false;
						var navigationcookie=this.getstoragedata(this.navigationcookiename);
						if(navigationcookie){
							var navigationcookiedata = JSON.parse(navigationcookie);
							if(navigationcookiedata && navigationcookiedata.autoplay) {
								this.autoplay = false;
								this.autoplayPaused = true;
								this.toggleautoplay(navigationcookiedata);
							} else {
								this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
							}
						}
						$('html, body').animate({
							scrollTop: ($(node).offset().top - 200)
						}, 2000, function(){
							$(node.parentNode.parentNode).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">Please select the value and then click on play</div></div>');
							node.click();
						});
					} else {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					}
					break;
				//	fix for text editor during playback
				case 'ckeditor':
					this.playNextAction = false;
					var navigationcookie=this.getstoragedata(this.navigationcookiename);
					if(navigationcookie){
						var navigationcookiedata = JSON.parse(navigationcookie);
						if(navigationcookiedata && navigationcookiedata.autoplay) {
							this.autoplay = false;
							this.autoplayPaused = true;
							this.toggleautoplay(navigationcookiedata);
						} else {
							this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
						}
					}
					$('html, body').animate({
						scrollTop: ($(node).offset().top - 200)
					}, 2000, function(){
						$(node).addClass('tooltip-dsa').append('<div class="tooltip-dsa-right"><div class="tooltip-dsa-text-content">Please input into text editor and click on play</div></div>');
						node.click();
					});
					break;
				default:
					node.click();
					this.invokenextitem(node,timetoinvoke);
					break;
			}
		},
		//invoke the click of next item
		invokenextitem:function(node,timetoinvoke){
			var link=false;
			timetoinvoke=timetoinvoke+4000;
			if(node.hasOwnProperty("href")){
				link=true;
			}
			if(!link) {
				setTimeout(function(){Voicepluginsdk.showhtml();}, timetoinvoke);
			}
		},
		//simulate hover functionality
		simulateHover: function(node){
			var event = new MouseEvent('mouseover', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
			var canceled = !node.dispatchEvent(event);
			if(this.logLevel>0) {
				if (canceled) {
					// A handler called preventDefault.
					console.log('hover cancelled');
				} else {
					// None of the handlers called preventDefault.
					console.log('hover not cancelled');
				}
			}
		},
		//firing an event if event available for the node. Currently not implemented
		eventFire:function(el, etype){
			if (el.fireEvent) {
				el.fireEvent('on' + etype);
			} else {
				var evObj = document.createEvent('Events');
				evObj.initEvent(etype, true, false);
				el.dispatchEvent(evObj);
			}
		},
		//adding user click to the processing node.
		recorduserclick:function(node, fromdocument=false, selectchange=false, event, confirmdialog=false, hasparentclick = false){

			if(fromdocument){
				// todo from document click functionality;
			}

			if(this.autoplay){
				this.forceReindex = true;
				Voicepluginsdk.indexnewclicknodes();
				return true;
			}

			if(node.hasAttribute("nist-voice")){
				return true;
			}

			if(this.lastclickednode!=='' && node.isSameNode(this.lastclickednode)){
				return ;
			}

			if(this.lastclickedtime===Date.now()){
				return ;
			}

			// stopping recording as date range picker is clicked as we do not support it.
			if(this.recording && node.hasAttribute('ngxdaterangepickermd')) {
				alert('Sorry currently we do not support daterange selector. Please re-record the sequence without selecting daterange selector');
				this.recording=false;
				this.cancelrecordingsequence();
				this.showadvancedhtml();
				return ;
			}

			if(this.recording && this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
				alert('Sorry currently we do not support this '+node.nodeName+' selector. Please re-record the sequence without selecting '+node.nodeName+' selector');
				this.recording=false;
				this.cancelrecordingsequence();
				this.showadvancedhtml();
				return ;
			}

			var processclick=true;
			if(fromdocument && this.htmlindex.length>0){
				for(var i=0;i<this.htmlindex.length;i++){
					var processnode=this.htmlindex[i];
					if(node.isSameNode(processnode['element-data'])){
						processclick=false;
					}
				}
			}

			if(processclick===false){
				return true;
			}

			// var domjson = domJSON.toJSON(node);
			if (node.hasOwnProperty('uda_custom') && node.uda_custom.domJson) {
				var domjson = node.uda_custom.domJson;
				domjson.meta = {};
				//fix for position issue #89
				if(domjson.node.nodePosition.x === 0 && domjson.node.nodePosition.y === 0) {
					var domjson1 = domJSON.toJSON(node);
					domjson.node.nodePosition = domjson1.node.nodePosition;
				}
			} else {
				return ;
			}

			if(node.nodeName.toLowerCase()==="input" && node.getAttribute("type")==="radio"){
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
					objectdata: JSON.stringify(domjson)
				};
			}
			postdata.clickednodename = this.getclickedinputlabels(node,fromdocument,selectchange);

			// for known scenarios prompt user for input
			if(confirmdialog && this.recording && !this.confirmednode && !this.autoplay){
				this.confirmparentclick(node, fromdocument, selectchange, event, postdata);
				return true;
			} else if(confirmdialog && !this.recording) {
				return true;
			}

			this.rerenderhtml=true;
			this.addclickedrecordcookie(postdata.clickednodename);
			this.lastclickednode=node;
			this.lastclickedtime=Date.now();
			var outputdata = JSON.stringify(postdata);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost+"/user/clickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.confirmednode = false;
				}
			};
			xhr.send(outputdata);

			// reindexing whole document again for collapsable nodes
			if(this.recording) {
				if(this.logLevel>0) {
					console.log('-------------------------------------------------------------');
					// console.log(this.lastclickedtime);
					// console.log({clickednode: node});
					console.log({indexedpos: node.uda_custom.domJson.node.nodePosition});
					console.log({domjson: domjson.node.nodePosition});
					console.log('-------------------------------------------------------------');
				}
				if (node.hasAttribute('mattreenodetoggle')) {
					this.forceReindex = true;
					Voicepluginsdk.indexnewclicknodes();
				} else {
					//processing new clicknodes if available after the click action.
					setTimeout(function () {
						this.forceReindex = true;
						Voicepluginsdk.indexnewclicknodes();
					}, DSA_POST_INTERVAL);
					// Voicepluginsdk.indexnewclicknodes();
				}
			}

			// rerender html if recording is enabled.
			if(this.recording) {
				setTimeout(function () {
					Voicepluginsdk.showhtml();
				}, DSA_POST_INTERVAL);
			}
		},
		confirmparentclick:function(node, fromdocument, selectchange, event, postdata) {
			var prevclicktext = this.getclickedinputlabels(this.lastclickednode, fromdocument, selectchange);
			if(node.hasChildNodes()) {
				var childtextexists = this.processparentchildnodes(node, prevclicktext);
				if(!childtextexists) {
					var confirmdialog = confirm("Did you clicked: " + postdata.clickednodename);
					if (confirmdialog === true) {
						Voicepluginsdk.confirmednode = true;
						Voicepluginsdk.recorduserclick(node, fromdocument, selectchange, event, false);
					}
					return false;
				} else {
					return false;
				}
			}
		},
		processparentchildnodes:function(node, prevtext) {
			var childtextexists = false;
			for(const childnode of node.childNodes) {
				if (childnode.nodeType === Node.ELEMENT_NODE) {
					if (childnode.isSameNode(this.lastclickednode)) {
						childtextexists = true;
						break;
					}
					let childtext = this.getclickedinputlabels(childnode);
					if(prevtext === childtext) {
						childtextexists = true;
						break;
					} else if(childnode.hasChildNodes()){
						childtextexists = this.processparentchildnodes(childnode, prevtext);
						if(childtextexists) {
							break;
						}
					}
				}
			}
			return childtextexists
		},
		//getting input label for the clicked node
		getclickedinputlabels:function(node, fromdocument=false, selectchange=false){
			if(this.logLevel > 4) {
				console.log({node: node});
			}
			if (!node) {
				return null;
			}
			var inputlabels="";
			var nodename=node.nodeName.toLowerCase();
			switch (nodename) {
				case "select":
					if(selectchange) {
						inputlabels = jQuery(node).find(":selected").text();
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
					if(!node.hasAttribute("type")){
						var textlabels = this.getInputLabels(node, [], 1, true, true, true);
						if (textlabels.length > 0) {
							var labels = [];
							for (var j = 0; j < textlabels.length; j++) {
								labels.push(textlabels[j].text);
							}
							inputlabels = labels.toString();
						}
					} else {
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
					}
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
				case "img":
					var textlabels = this.getInputLabels(node, [], 1, true, false, true);
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
			return inputlabels;
		},
		//record page click todo functionality
		recorddocumentclick:function(){
			jQuery(document).ready(function(){
				document.body.addEventListener('click', function (event) { }, false);
			});
		},
		//adding current timestamp to the required actions under recording functionality
		gettimestamp:function(buttonclicked){
			if(buttonclicked !== "") {
				var result = Date.now();
				if(buttonclicked==="start"){
					this.startrecordingsequence(result);
				} else if(buttonclicked==="stop"){
					this.stoprecordingsequence(result);
				}
			}
		},
		//show recorded results in UDA screen
		showrecordedresults:function(){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			var starttime=null;
			var endtime=Date.now();
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				starttime=recordingcookiedata.starttime;
			} else {
				return false;
			}

			jQuery("#nistvoicesearchresults").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+starttime+"&end="+endtime+"&sessionid="+Voicepluginsdk.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.addrecordresultshtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		//start recording the user click to form a sequence
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
			this.showhtml();

			//add analtytics
			this.recordclick('recordingstart',recordingcookiedata.domain);
		},
		//stop recording sequence that has been started and show recorded results
		stoprecordingsequence:function(currenttimestamp){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				recordingcookiedata.endtime=currenttimestamp;
				recordingcookiedata.recording=false;
			} else {
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));

			//add analtytics
			this.recordclick('recordingstop',recordingcookiedata.domain);

			this.showhtml();
			jQuery("#nistvoicesearchresults").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+recordingcookiedata.starttime+"&end="+recordingcookiedata.endtime+"&sessionid="+Voicepluginsdk.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.addrecordresultshtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		//cancel the recording sequence
		cancelrecordingsequence:function(render=true){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				recordingcookiedata.endtime=Date.now();
				recordingcookiedata.recording=false;
			} else {
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));

			//add analtytics
			this.recordclick('recordingcancel',recordingcookiedata.domain);

			if(render) {
				this.showhtml();
			}
		},
		//show sequence list html
		addrecordresultshtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids=data;
				var html =  '   <div class="voice-suggesion-card">'+
							'		<div class="voice-card-left">'+
							'			<h4>Recorded Sequence</h4>'+
							'			<ul id="nist-recordresultrow" class="voice-sugggesion-bullet">'+
							'			</ul>'+
							'			<div>'+
							'				<input id="nistsequencelabel" type="text" name="save-recrded" class="voice-save-recrded-inpt" placeholder="Enter label" nist-voice="true">'+
							'				<button class="voice-cancel-btn" onclick="Voicepluginsdk.cancelrecordingsequence();">Cancel and exit</button> <button onclick="Voicepluginsdk.submitrecordedlabel();" class="voice-submit-btn">Submit</button>'+
							'			</div>'+
							'		</div>'+
							'	</div>';
				jQuery("#nistvoicesearchresults").html(html);
				for(var i=0;i<data.length;i++){
					// modification for personal button addition
					if(i===(data.length-1)){
						this.renderrecordresultrow(data[i],i,true);
					} else {
						this.renderrecordresultrow(data[i],i,false);
					}
				}
				this.openmodal(false);
			}
		},
		//render record row html of the sequence
		renderrecordresultrow:function(data,index, showPersonalButton=false){
			index++;
			let clickedname=((data.clickednodename.length>this.maxstringlength)?data.clickednodename.substr(0,this.maxstringlength)+'...':data.clickednodename);
			// let clickedname=data.clickednodename;
			// personal button appearance
			let nodeData = JSON.parse(data.objectdata);
			if(showPersonalButton){
				clickedname=((data.clickednodename.length>(this.maxstringlength-24))?data.clickednodename.substr(0,(this.maxstringlength-24))+'...':data.clickednodename);
				if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
					// var personalHtml = '&nbsp; &nbsp; (personal)';
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" nist-voice="true" id="isPersonal" checked /> is personal';
				} else {
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" nist-voice="true" id="isPersonal" /> is personal';
				}
				// var personalHtml = '&nbsp; &nbsp;<input type="checkbox" nist-voice="true" id="isPersonal" /> is personal';
				/*var personalElement = jQuery(personalHtml);
				personalElement.click(function (){
					Voicepluginsdk.personalNode(data);
				});*/
				var html = '<li nist-voice="true" class="active">' +
					clickedname + personalHtml +
					'</li>';
				var element = jQuery(html);
				jQuery("#nist-recordresultrow").append(element);
				jQuery("#isPersonal").click(function (){
					Voicepluginsdk.personalNode(data);
				});
			} else {
				clickedname += (nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal)?'&nbsp; &nbsp;(personal)':'';
				var html = '<li nist-voice="true" class="active">' +
					clickedname +
					'</li>';
				var element = jQuery(html);
				jQuery("#nist-recordresultrow").append(element);
			}
		},
		//personal modification button clicked
		personalNode:function(data){
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta.hasOwnProperty("isPersonal")){
				if(nodeData.meta.isPersonal) {
					nodeData.meta.isPersonal = false;
				} else {
					nodeData.meta.isPersonal = true;
				}
			} else {
				nodeData.meta.isPersonal = true;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				Voicepluginsdk.showhtml();
			};
			xhr.send(outputdata);
		},
		// submit functionality of the recorded sequence.
		submitrecordedlabel:function(submittype="recording"){
			var sequencename=jQuery("#nistsequencelabel").val();
			var sequencelistdata={name:"",domain:window.location.host,usersessionid:this.sessiondata.authdata.id.toString(),userclicknodelist:[].toString(),userclicknodesSet:this.recordedsequenceids,isValid:1,isIgnored:0};
			if(submittype==='recording') {
				if (sequencename === '') {
					alert('Please enter proper label');
					jQuery("#nistsequencelabel").focus();
					return false;
				}
			} else if(submittype === 'invalid'){
				if(sequencename===''){
					sequencename="Declared as not valid sequence by user";
				}
				sequencelistdata.isValid=0;
			} else if(submittype === 'ignore'){
				if(sequencename===''){
					sequencename="Ignored by user";
				}
				sequencelistdata.isValid=0;
				sequencelistdata.isIgnored=1;
			}
			var sequenceids = [];
			for(var i=0;i<this.recordedsequenceids.length;i++){
				sequenceids.push(this.recordedsequenceids[i].id);
			}
			sequencelistdata.name=sequencename;
			sequencelistdata.userclicknodelist=sequenceids.toString();
			this.cancelrecordingsequence(true);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/recordsequencedata", true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.backtomodal();
				}
			};
			xhr.send(JSON.stringify(sequencelistdata));
		},
		// adding the last clicked record to the storage
		addclickedrecordcookie:function(clickednodename){
			this.createstoragedata(this.recordclicknodecookiename,clickednodename);
		},
		// search from elastic functionality
		searchinelastic:function(searchterm=''){
			if(searchterm) {
				var searchtext = searchterm;
			} else {
				var searchtext = jQuery("#voicesearchinput").val();
			}
			this.cancelrecordingsequence(false);


			if (this.searchInProgress === true) {
				alert('Previous search in progress');
				return false;
			}

			if (this.autoplay) {
				this.searchInProgress = false;
				return false;
			}

			if(this.logLevel>0) {
				console.log(searchtext);
			}

			this.searchText = searchtext;
			this.searchInProgress = true;

			//add analtytics
			this.recordclick('search',searchtext);

			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost + "/clickevents/sequence/search?query="+searchtext+"&domain="+encodeURI(window.location.host), true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.searchInProgress=false;
					Voicepluginsdk.renderelasticresults(JSON.parse(xhr.response));
				} else {
					Voicepluginsdk.searchInProgress=false;
				}
				console.log(Voicepluginsdk.searchInProgress);
			};
			xhr.send();
		},
		//rendering search results screen
		renderelasticresults:function(data){
			var matchnodes = data;
			if(matchnodes.length>0){
				jQuery("#nistvoicesearchresults").html('');
				for(var k=0;k<matchnodes.length;k++){
					if(matchnodes[k].hasOwnProperty("deleted") && matchnodes[k].deleted===0) {
						this.renderelasticresultrow(matchnodes[k], k);
					} else if(!matchnodes[k].hasOwnProperty("deleted")) {
						this.renderelasticresultrow(matchnodes[k], k);
					}
				}
			}
		},
		//rendering each row html of the search result
		renderelasticresultrow:function(data){
			var path='';
			for(var i=0;i<data.userclicknodesSet.length;i++){
				if(path!==''){
					path +=' > ';
				}
				path += data.userclicknodesSet[i].clickednodename;
			}
			var html=   '	<div nist-voice="true" class="voice-sugtns-list"><h4><a>'+data.name.toString()+'</a></h4>'+
						'		<p>'+path+'</p>'+
						'	</div>';
			var element=jQuery(html);
			element.click(function () {
				Voicepluginsdk.elasticresultaction(data);
			});
			jQuery("#nistvoicesearchresults").append(element);
		},
		//selected search result functionality
		elasticresultaction:function(data){
			var navcookiedata = {shownav: true, data: data, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			navcookiedata.searchterm=jQuery("#voicesearchinput").val();
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.autoplay = false;
			this.showselectedrow(data,data.id,true, navcookiedata);
			this.invokedActionManually=false;
			//add analtytics
			this.recordclick('sequencerecord',data.name.toString(),data.id);
		},
		//showing the selected search result screen functionality
		showselectedrow:function(data,index,shownodelist=false, navcookiedata={}){
			if(shownodelist && navcookiedata.data.userclicknodesSet.length===navcookiedata.navigateddata.length){
				navcookiedata.navcompleted=true;
			}
			var playiconhtml =  '<div class="voice-autoplay-stop">';

			if(shownodelist) {
				if (navcookiedata.navcompleted) {
					this.autoplayCompleted = true;
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
			var element=jQuery(html);
			jQuery("#nistvoicesearchresults").html(element);
			var performactionnode=false;
			for(var i=0;i<data.userclicknodesSet.length;i++){
				var visited = -1;
				if(navcookiedata.navigateddata.length>0) {
					visited = this.inarray(data.userclicknodesSet[i].id, navcookiedata.navigateddata);
				}
				if(navcookiedata.autoplay && (!navcookiedata.pause || !navcookiedata.stop)){
					if(visited===-1 && !performactionnode){
						performactionnode=data.userclicknodesSet[i];
					}
				}
				jQuery("#nistvoicesteps").append(this.rendersteps(data.userclicknodesSet[i], visited, navcookiedata));
			}

			if(this.sessionID===data.usersessionid || this.sessiondata.authdata.id===data.usersessionid){
				jQuery("#deletesequence").click(function () {
					Voicepluginsdk.deletesequencelist(data);
				});
			} else {
				jQuery("#deletesequence").hide();
			}

			jQuery('#nist-upvote').click(function () {
				Voicepluginsdk.addvote("up",data);
			});
			jQuery('#nist-downvote').click(function () {
				Voicepluginsdk.addvote("down",data);
			});

			jQuery("#nist-autoplay").click(function () {
				Voicepluginsdk.toggleautoplay(navcookiedata);
			});

			// need to improve the autoplay functionality.
			if(typeof performactionnode=="object" && this.autoplay) {
				// console.trace();
				if(this.playNextAction) {
					this.performclickaction(performactionnode, navcookiedata);
				}
			} else if(this.autoplay){
				this.autoplayPaused = false;
				this.toggleautoplay(navcookiedata);
			}
			jQuery("#backtosearch").click(function () {
				// Voicepluginsdk.toggleautoplay(navcookiedata);
				Voicepluginsdk.autoplay = false;
				Voicepluginsdk.searchInProgress=false;
				Voicepluginsdk.configureintrojs();
				Voicepluginsdk.introjs.refresh();
				Voicepluginsdk.backtosearchresults(navcookiedata);
			});
		},
		//showing the sequence steps html
		rendersteps:function(data,visited=false, navcookiedata={}){
			// adding elipses if textlength is greater than specified characters
			// display personal tag for the personal nodes
			let nodeData = JSON.parse(data.objectdata);
			let clickedname = ((data.clickednodename.length > this.maxstringlength) ? data.clickednodename.substr(0, this.maxstringlength) + '...' : data.clickednodename);
			if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
				clickedname=((data.clickednodename.length>(this.maxstringlength-26))?data.clickednodename.substr(0,(this.maxstringlength-26))+'... (personal)':data.clickednodename);
			}
			if(visited>-1) {
				var template = jQuery("<li nist-voice=\"true\" class='active'>" + clickedname + "</li>");
			} else {
				var template = jQuery("<li nist-voice=\"true\" class='inactive'>" + clickedname + "</li>");
			}
			if(visited === -1) {
				template.click(function () {
					Voicepluginsdk.invokedActionManually = true;
					Voicepluginsdk.performclickaction(data,navcookiedata);
				});
			}
			return template;
		},
		//perform click action of the sequence steps
		performclickaction:function(selectednode,navcookiedata){
			const matchNodes = [];
			let originalNode = {};
			if(selectednode.objectdata) {
				originalNode = JSON.parse(selectednode.objectdata);
				if(this.logLevel > 0) {
					console.log({recordedNode: originalNode.node});
				}
				if(selectednode && this.htmlindex.length>0){
					// personal tag check
					let isPersonalNode = false;
					if(originalNode.meta.hasOwnProperty('isPersonal') && originalNode.meta.isPersonal){
						isPersonalNode = true;
					}
					for(let searchNode of this.htmlindex){
						let searchLabelExists = false;
						let compareNode = domJSON.toJSON(searchNode["element-data"]);
						// compare recorded node with personal node tag or not
						let match = this.comparenodes(compareNode.node,originalNode.node, isPersonalNode);

						if ((this.logLevel > 1) && (match.matched+5) >= match.count) {
							console.log('----------------------------------------------------------');
							console.log(match);
							console.log(Math.abs((match.matched) - match.count));
							console.log(match.innerChildNodes * this.innerTextWeight);
							console.log('Matched ' + match.matched + ' out of ' + match.count);
        					console.log({node: compareNode.node, htmlNode: searchNode["element-data"]});
							console.log('----------------------------------------------------------');
						}

						// we are incrementing 'matched' by 'innerTextWeight' for 'this' node and every child node and we are matching innerchildcounts that were returned from comparenodes
						if(match.innerTextFlag && Math.abs((match.matched) - match.count) <= (match.innerChildNodes * this.innerTextWeight)){
							searchLabelExists=true;
						} else if (match.matched === match.count) {
							searchLabelExists=true;
						} else if(originalNode.node.nodeName === 'CKEDITOR' && (match.matched+1) >= match.count) {
							// fix for editor playback
							searchLabelExists=true;
						}

						if(searchLabelExists){
							let matchNodeExists = false;
							if(matchNodes.length>0){
								for(let j=0; j<matchNodes.length; j++){
									if(matchNodes[j].originalNode["element-data"].isSameNode(searchNode["element-data"])){
										matchNodeExists=true;
									}
								}
							}

							if(matchNodeExists===false) {
								matchNodes.push({originalNode: searchNode, domJson: compareNode.node});
							}
						}
					}
				}
			}

			if(matchNodes.length === 1){
				if(this.updatenavcookiedata(navcookiedata,selectednode.id)){
					this.matchaction(matchNodes[0].originalNode,false,selectednode);
				}

			} else if(matchNodes.length>1) {
				//todo need to perform some user intervention
				// for multiple matching nodes compare labels of the clickable nodes to get exact node match
				let finalMatchNode = null;
				let finalMatchNodes = [];

				if(this.logLevel>0){
					console.log('----------------------------------------------------------');
					console.log('matched nodes');
					console.log(matchNodes);
					console.log('----------------------------------------------------------');
				}

				if(this.logLevel>0 && matchNodes.length>1){
					console.log('----------------------------------------------------------');
					console.log('recordednode label:'+selectednode.clickednodename);
					console.log('----------------------------------------------------------');
				}

				matchNodes.forEach(function (matchNode, matchnodeindex) {
					if(matchNode.originalNode.hasOwnProperty("element-data")) {
						const inputLabels = Voicepluginsdk.getclickedinputlabels(matchNode.originalNode["element-data"]);
						if(Voicepluginsdk.logLevel>0){
							console.log('----------------------------------------------------------');
							console.log(inputLabels);
							console.log('----------------------------------------------------------');
						}
						if (inputLabels === selectednode.clickednodename) {
							finalMatchNodes.push(matchNode);
						} else if(matchNode.originalNode["element-data"].classList && matchNode.originalNode["element-data"].classList.contains('expand-button')){
							// collapsable buttons are treated as matched nodes to check distance for further processing
							finalMatchNodes.push(matchNode);
						}
					}
				});

				if(finalMatchNodes.length===0 && matchNodes.length>=1){
					finalMatchNodes = matchNodes;
				}

				// process matching nodes after comparing labels
				if (finalMatchNodes.length === 1) {
					finalMatchNode = finalMatchNodes[0].originalNode;
				} else if(finalMatchNodes.length > 1) {
					// compare element positions as there are multiple matching nodes with same labels
					if(this.logLevel > 0 && finalMatchNodes.length>1) {
						console.log('----------------------------------------------------------');
						console.log('Multiple nodes found comparing nearnode');
						console.log({recordedNode: originalNode.node});
						console.log(finalMatchNodes);
						console.log('----------------------------------------------------------');
						// return ;
					}
					finalMatchNode = this.processDistanceOfNodes(finalMatchNodes, originalNode.node);
				}

				if(finalMatchNode && finalMatchNode.hasOwnProperty("element-data")) {
					if(this.logLevel > 0 && finalMatchNodes.length>1) {
						console.log('----------------------------------------------------------');
						console.log('Final matched node');
						console.log({domnode: finalMatchNode['element-data']});
						console.log(domJSON.toJSON(finalMatchNode['element-data']));
						console.log({finalMatchNode: finalMatchNode});
						console.log('----------------------------------------------------------');
						// return ;
					}
					if(this.updatenavcookiedata(navcookiedata,selectednode.id)) {
						this.matchaction(finalMatchNode, false, selectednode);
					}
				} else {
					if(this.logLevel>2) {
						console.log('----------------------------------------------------------');
						console.log('Unable to find final matchnode with distance calculation');
						console.log('----------------------------------------------------------');
					}
					alert("Unable to find the action");
				}

			} else {
				alert("Unable to find the action");
			}
		},
		//comparing nodes of indexed and the sequence step selected
		comparenodes:function(comparenode, originalnode, isPersonalNode=false, match={count:0, matched:0, unmatched:[], innerTextFlag: false, innerChildNodes: 0}){
			// sum the childnodes
			if(comparenode.hasOwnProperty('childNodes')) {
				match.innerChildNodes = match.innerChildNodes + comparenode.childNodes.length;
			}
			for(let key in originalnode){
				if(this.ignoreattributes.indexOf(key)!==-1){
					continue;
				} else if(key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1){
					continue;
				} else {
					match.count++;
				}
				if(comparenode.hasOwnProperty(key) && (typeof originalnode[key] === 'object') && (typeof comparenode[key] === 'object')){
					match.matched++;
					match=this.comparenodes(comparenode[key], originalnode[key], isPersonalNode, match);
				} else if(comparenode.hasOwnProperty(key) && Array.isArray(originalnode[key]) && originalnode[key].length>0 && Array.isArray(comparenode[key]) && comparenode[key].length>0){
					match.matched++;
					if(comparenode[key].length===originalnode[key].length) {
						match.matched++;
						for (var i = 0; i < originalnode[key].length; i++) {
							match=this.comparenodes(comparenode[key][i], originalnode[key][i], isPersonalNode, match);
						}
					}
				} else if((key === 'class' || key === 'className') && originalnode.hasOwnProperty(key) && comparenode.hasOwnProperty(key)) {
					// fix for calendar issue
					comparenode[key] = comparenode[key].replace(' ng-star-inserted','');
					originalnode[key] = originalnode[key].replace(' ng-star-inserted','');
					if (comparenode[key]===originalnode[key]) {
						match.matched++;
					} else {
						// jaro wrinker comparision for classname
						let weight = this.JaroWrinker(originalnode[key], comparenode[key]);
						if(weight > 0.90) {
							match.matched++;
						} else {
							match.unmatched.push({
								key: key,
								compareNodeValues: comparenode[key],
								recordedNodeValues: originalnode[key]
							});
						}
					}
				} else if(key === 'innerText' && originalnode.hasOwnProperty(key) && comparenode.hasOwnProperty(key) && (comparenode[key].trim() === originalnode[key].trim())) {
					// matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
					// since this will match for every child node, we need to accommodate this logic whenever 'comparenodes' is called
					match.innerTextFlag = true;
					match.matched = match.matched + this.innerTextWeight;
					// match.matched++;
				} else if(comparenode.hasOwnProperty(key) && comparenode[key]===originalnode[key]){
					match.matched++;
				} else if(comparenode.hasOwnProperty(key) && comparenode[key]!==originalnode[key] && key==='href' && originalnode[key].indexOf(comparenode[key])!==-1){
					match.matched++;
				} else if(comparenode.hasOwnProperty(key) && (key === 'id' || key === 'name') && comparenode[key]!==originalnode[key]){
					let weight = this.JaroWrinker(originalnode[key], comparenode[key]);
					if(weight>0.90) {
						match.matched++;
					}
				}
				// matching personal node key value pairs for personal tag true
				else if (isPersonalNode && this.personalNodeIgnoreAttributes.indexOf(key)!==-1) {
					// make inner text flag to true if personal tag is true
					if(key==='innerText'){
						match.innerTextFlag = true;
						match.matched = match.matched + this.innerTextWeight;
					} else {
						match.matched++;
					}
				} else {
					match.unmatched.push({key: key, compareNodeValues: comparenode[key], recordedNodeValues: originalnode[key]});
				}
			}
			return match;
		},
		JaroWrinker: function (s1, s2) {
			var m = 0;

			// Exit early if either are empty.
			if ( s1.length === 0 || s2.length === 0 ) {
				return 0;
			}

			// Exit early if they're an exact match.
			if ( s1 === s2 ) {
				return 1;
			}

			var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
				s1Matches = new Array(s1.length),
				s2Matches = new Array(s2.length);

			for ( i = 0; i < s1.length; i++ ) {
				var low  = (i >= range) ? i - range : 0,
					high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

				for ( j = low; j <= high; j++ ) {
					if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
						++m;
						s1Matches[i] = s2Matches[j] = true;
						break;
					}
				}
			}

			// Exit early if no matches were found.
			if ( m === 0 ) {
				return 0;
			}

			// Count the transpositions.
			var k = n_trans = 0;

			for ( i = 0; i < s1.length; i++ ) {
				if ( s1Matches[i] === true ) {
					for ( j = k; j < s2.length; j++ ) {
						if ( s2Matches[j] === true ) {
							k = j + 1;
							break;
						}
					}

					if ( s1[i] !== s2[j] ) {
						++n_trans;
					}
				}
			}

			var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
				l      = 0,
				p      = 0.1;

			if ( weight > 0.7 ) {
				while ( s1[l] === s2[l] && l < 4 ) {
					++l;
				}

				weight = weight + l * p * (1 - weight);
			}

			return weight;
		},
		// getting distance between recorded node and matching nodes of same labels
		processDistanceOfNodes: function(matchingnodes, selectedNode) {
			if (selectedNode.hasOwnProperty('nodePosition') && matchingnodes.length>1) {
				let leastDistanceNode = null;
				let leastDistance = -1;
				matchingnodes.forEach((node) => {
					if (node.originalNode['element-data'].hasAttribute('aria-label')
						&& node.originalNode['element-data'].getAttribute('aria-label').toLowerCase() === 'open calendar') {
						// let dist = this.getDistance(selectedNode.nodePosition, node.originalNode['element-data'].uda_custom.domJson.node.nodePosition);
						let domJsonData = domJSON.toJSON(node.originalNode['element-data']);
						let dist = this.getDistance(selectedNode.nodePosition, domJsonData.node.nodePosition);
						if (this.logLevel > 1) {
							console.log(selectedNode.nodePosition);
							console.log(node.originalNode['element-data'].uda_custom.domJson.node.nodePosition);
							console.log(domJsonData.node.nodePosition);
							console.log(dist);
						}
						// default adding first element as least distance and then comparing with last distance calculated
						if(leastDistance === -1) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						} else if (dist < leastDistance) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						}
					} else if (node.domJson.hasOwnProperty('nodePosition')) {
						let dist = this.getDistance(selectedNode.nodePosition, node.domJson.nodePosition);
						// default adding first element as least distance and then comparing with last distance calculated
						if(leastDistance === -1) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						} else if (dist < leastDistance) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						}
					}
				});
				return leastDistanceNode;
			} else {
				return false;
			}
		},
		// calculate distance between selected node and matching node
		getDistance: function (node1, node2) {
			const x = node1.x - node2.x;
			const y = node1.y - node2.y;
			const dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
			return dist;
		},
		//adding data to the storage
		createstoragedata:function(key,value){
			try {
				window.localStorage.setItem(key, value);
				return true;
			} catch (e) {
				return false;
			}
		},
		//getting the data from the storage
		getstoragedata:function(key){
			try {
				var result=window.localStorage.getItem(key);
				return result;
			} catch (e) {
				return false;
			}
		},
		//delete sequence list functionality for the owner
		deletesequencelist:function(data){
			var confirmdialog=confirm("Are you sure want to delete "+data.name);
			if(confirmdialog === true){
				Voicepluginsdk.confirmdelete(data);
			}
		},
		//confirmation for the deletion of the sequence list
		confirmdelete:function (data) {
			// var senddata=JSON.stringify({usersessionid:this.dsaSessionID,id:data.id});
			var senddata=JSON.stringify({usersessionid:this.sessiondata.authdata.id,id:data.id});
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/sequence/delete", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.closemodal();
				}
			};
			xhr.send(senddata);
		},
		//adding vote functionality
		addvote:function(votetype,data){
			var senddata={"usersessionid": this.sessionID, "sequenceid" : data.id, "upvote":0, "downvote":0};
			if(votetype==="up"){
				senddata.upvote=1;
			} else if(votetype==="down"){
				senddata.downvote=1;
			}
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/sequence/addvote", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.send(JSON.stringify(senddata));
		},
		//autoplay functionality to stop and play
		toggleautoplay:function(navcookiedata){
			if(navcookiedata.autoplay){
				navcookiedata.autoplay=false;
				this.autoplay=false;
				this.configureintrojs();
				this.introjs.refresh();
				//add analtytics
				this.recordclick('stop',navcookiedata.data.name.toString(),navcookiedata.data.id);
			} else {
				navcookiedata.autoplay=true;
				this.autoplay=true;
				this.playNextAction = true;
				//add analtytics
				this.recordclick('play',navcookiedata.data.name.toString(),navcookiedata.data.id);
				// issue fix for replay
				if(!this.autoplayPaused && (this.autoplayCompleted || this.invokedActionManually)) {
					navcookiedata.navigateddata = [];
					navcookiedata.navcompleted = false;
					this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
				}
			}

			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.showselectedrow(navcookiedata.data,navcookiedata.data.id,true, navcookiedata);
		},
		//updating the navigated data
		updatenavcookiedata:function(navcookiedata,selectednodeid){
			navcookiedata.navigateddata.push(selectednodeid);
			return this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
		},
		//back to search results functionality
		backtosearchresults:function (navcookiedata) {
			if(navcookiedata.searchterm!==''){
				var navcookiedata1 = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:navcookiedata.searchterm};
			} else {
				var navcookiedata1 = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:""};
			}
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata1));
			this.autoplay=false;
			jQuery("#voicesearchinput").val(navcookiedata.searchterm);

			//add analtytics
			this.recordclick('back',navcookiedata.data.name.toString(),navcookiedata.data.id);

			this.searchinelastic(navcookiedata.searchterm);
		},
		recordclick:function (clicktype='sequencerecord',clickedname='',recordid=0) {
			var senddata={usersessionid:this.sessionID,clicktype:clicktype,clickedname:clickedname,recordid:recordid};
			var xhr = new XMLHttpRequest();
			xhr.open("PUT", this.apihost + "/clickevents/userclick", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.send(JSON.stringify(senddata));
		},
		showadvancedhtml:function(){
			jQuery("#nistvoiceadvbtn").hide();
			jQuery("#nistvoicesearchresults").html('');
			var html=   '<div class="voice-modalback-btn"><img nist-voice="true" id="nistvoiceback" src="'+this.extensionpath+'assets/voice-back.png"></div><br />'+
						'<div class="nist-clear"></div>'+
						'   <div class="voice-suggesion-card">' +
						'		<div class="voice-card-left">' +
						'			<h4 class="voice-card-noborder">Create your own action <button nist-voice="true" id="nistvoicerecbtn" class="voice-modal-btn"><img nist-voice="true" style="vertical-align:middle" src="'+this.extensionpath+'assets/voice-record.png"> <span nist-voice="true">Rec</span></button></h4>' +
						'       </div>'+
						'   </div>';
						// '<div class="name-heading"><h2 nist-voice="true">Create your own action <button nist-voice="true" id="nistvoicerecbtn" class="voice-record-img"><img nist-voice="true" style="vertical-align:middle" src="'+this.extensionpath+'assets/voice-record.png"> <span nist-voice="true">Rec</span></button></h2><br /></div>';
			jQuery("#nistvoicesearchresults").append(html);
			jQuery("#nistvoicerecbtn").click(function () {
				Voicepluginsdk.gettimestamp("start");
			});
			jQuery("#nistvoiceback").click(function () {
				Voicepluginsdk.backtomodal();
			});
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost + "/clickevents/suggested?domain="+encodeURI(window.location.host), true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					Voicepluginsdk.showsuggestedhtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		showsuggestedhtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids = data;
				var html = '   <div class="voice-suggesion-card">' +
					'		<div class="voice-card-left">' +
					'			<h4>Our AI detected this sequence. <br /> Do you want to name it? <br /><span style="color:#ff4800;font-weight:bold;">(Alpha version: Not reliable)</span></h4>' +
					'			<ul id="nist-recordresultrow" class="voice-sugggesion-bullet">' +
					'			</ul>' +
					'			<div>' +
					'				<input id="nistsequencelabel" type="text" name="save-recrded" class="voice-save-recrded-inpt" placeholder="Enter label" nist-voice="true">' +
					'				<button onclick="Voicepluginsdk.submitrecordedlabel(\'recording\');" class="voice-submit-btn">Submit</button><button class="voice-cancel-btn" onclick="Voicepluginsdk.submitrecordedlabel(\'invalid\');">Invalid Sequence</button><button class="voice-cancel-btn" onclick="Voicepluginsdk.submitrecordedlabel(\'ignore\');">Ignore</button>' +
					'			</div>' +
					'		</div>' +
					'	</div>';

				jQuery("#nistvoicesearchresults").append(html);
				for (var i = 0; i < data.length; i++) {
					this.renderrecordresultrow(data[i], i);
				}
			}
		},
		backtomodal:function(){
			jQuery("#nistvoiceadvbtn").show();
			jQuery("#nistvoicesearchresults").html('');
		}
	};
	Voicepluginsdk.init();
}
