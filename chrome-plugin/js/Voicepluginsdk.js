/*
Voice plugin Javascript SDK Library
IMPORTANT NOTE: Copying this library and hosting it locally is strongly discouraged.
 */
// creating the sdk variable
if (typeof UDAPluginSDK === 'undefined') {
	var UDABadBrowser=false;
	if(navigator.appName.indexOf("Internet Explorer") !== -1){
		UDABadBrowser=(navigator.appVersion.indexOf("MSIE 1") === -1);
	}
	var UDASpeechRecognitionAvailable=false;
	var UDAVoiceRecognition;

	// initializing voice recognition library
	if(!window.hasOwnProperty("webkitSpeechRecognition")){
		UDASpeechRecognitionAvailable=false;
	} else {
		UDASpeechRecognitionAvailable=true;
		UDAVoiceRecognition = window.webkitSpeechRecognition;
	}

	// listening for user session data from extension call
	document.addEventListener("UDAUserSessionData", function(data) {
		UDAPluginSDK.createsession(JSON.parse(data.detail.data));
	});

	// Clearing user session in case if the id gets changed
	document.addEventListener("UDAClearSessionData", function(data) {
		UDAPluginSDK.clearSession();
	});

	/**
	 * Disabling record button when the attribute is set to true.
	 */
	document.addEventListener("UDADisableButton", function(data) {
		UDAPluginSDK.disableRecordButton();
	});

	document.addEventListener("UDAAuthenticatedUserSessionData", function(data) {
		UDAPluginSDK.createsession(JSON.parse(data.detail.data));
		UDAPluginSDK.openmodal(true);
	});

	document.addEventListener("UDAAlertMessageData", function(data) {
		alert(JSON.parse(data.detail.data));
	});

	/**
	 * Load custom theme to plugin
	 */
	document.addEventListener("UDALoadCustomCSS", function(data) {
		UDAPluginSDK.loadCssScript(UDACustomCss.src);
	});

	let UDADebugSetEvent = new CustomEvent("UDADebugSetEvent", {detail: {data: {action:'Debugvalueset',value:UDADebug}}, bubbles: false, cancelable: false});
	document.dispatchEvent(UDADebugSetEvent);

	// initializing the sdk variable need to change to a new variable in future.
	var UDAPluginSDK = {
		sdkUrl: "/",
		apihost: UDA_API_URL,
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
			'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y', 'selectionStart', 'selectionEnd', 'required', 'validationMessage', 'selectionDirection',
			'naturalWidth', 'naturalHeight', 'complete'
		],
		innerTextWeight: 5,
		logLevel: UDALogLevel,
		playNextAction: true,
		forceReindex: false,
		searchText: null,
		searchInProgress: false,
		ignoreNodesFromIndexing: ['ng-dropdown-panel','ckeditor','fusioncharts','ngb-datepicker','ngx-daterangepicker-material','uda-panel','mat-datepicker-content','ng-select'],
		ignoreNodesContainingClassNames:['cke_dialog_container','cke_notifications_area'],
		// cancelRecordingDuringRecordingNodes: ['ngb-datepicker'],
		cancelRecordingDuringRecordingNodes: [],
		addClickToSpecialNodes: ['ng-select', 'ngb-datepicker'],
		ignoreClicksOnSpecialNodes: ['ngx-daterangepicker-material'],
		customNameForSpecialNodes: {'ngb-datepicker': 'Date selector','mat-datepicker-content': 'Date selector', 'ngx-daterangepicker-material': 'Date Range Selector'},
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
		clickeOn: '',
		invokingnode: null,
		currentPage:'search',
		inarray:function(value,object){
			return jQuery.inArray(value, object);
		},

		// constructor for the sdk class which will be initialized on loading of the variable.
		init: function() {

			if(!this.checkBrowser()){
				console.log('UDA panel not added');
				return;
			}

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

		// check browser and allow only for chrome
		checkBrowser: function(){
			if(isUDAAllowed < 0){
				return false;
			} else {
				return true;
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
						UDAPluginSDK.scriptsCompleted++;
						if (typeof jQuery !== 'undefined') {
							this.jqueryready=true;
							UDAPluginSDK.otherscripts();
						}
					}
				};
			} else {
				script.onload = function(){
					UDAPluginSDK.scriptsCompleted++;
					if (typeof jQuery !== 'undefined') {
						this.jqueryready=true;
						if(this.ready !== true){
							UDAPluginSDK.otherscripts();
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
						UDAPluginSDK.totalotherScriptsCompleted++;
						if (UDAPluginSDK.totalotherScriptsCompleted === UDAPluginSDK.totalotherScripts) {
							UDAPluginSDK.allReady();
						}
					}
				};
			} else {
				script.onload = function(){
					UDAPluginSDK.totalotherScriptsCompleted++;
					if (UDAPluginSDK.totalotherScriptsCompleted === UDAPluginSDK.totalotherScripts) {
						UDAPluginSDK.allReady();
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
			// this.loadCssScript(this.extensionpath+"css/extension.css");
			this.loadCssScript(this.extensionpath+"css/uda-v1.css");
			this.loadOtherScript(this.extensionpath+"js/domJSON.js");
			// todo make css loading dynamic based on css file availability
			if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1){
				this.loadCssScript(this.extensionpath+"css/"+window.location.host+".css");
			}
			if(window.location.host === 'localhost:4200' && window.location.path && window.location.path.includes('portal')){
				this.loadCssScript(this.extensionpath+"css/dashboard.vantagecircle.com.css");
			}
			if(window.location.host.includes('vantagecircle')){
				if(window.location.path && window.location.path.includes('portal')) {
					this.loadCssScript(this.extensionpath + "css/dashboard.vantagecircle.com.css");
				} else {
					this.loadCssScript(this.extensionpath + "css/app.vantagecircle.com.css");
				}
			}
			if(typeof introJs === 'undefined'){
				this.totalotherScripts++;
				this.loadOtherScript(this.extensionpath+"js/intro.min.js");
				this.loadCssScript(this.extensionpath+"css/introjs.min.css");
				this.loadCssScript(this.extensionpath+"css/introjs-nistapp.css");
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
					UDAPluginSDK.resetIntrojs();
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
			if(UDASpeechRecognitionAvailable){
				this.recognition = new UDAVoiceRecognition();
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
						jQuery("#uda-search-input").val(transcript);
						UDAPluginSDK.searchinelastic();
						UDAPluginSDK.recognition.stop();
						jQuery("#uda-voice-icon-stop").hide();
						jQuery("#uda-voice-icon-start").show();
					}
				};
			}

			this.ready = true;

			// listen for when to start the indexing of the dom based on the clicknodes availability
			document.addEventListener("Indexnodes", function(data) {
				if(data.detail.data==="indexclicknodes") {
					UDAPluginSDK.indexclicknodes();
				} else if(data.detail.data==="indexnewclicknodes") {
					UDAPluginSDK.indexnewclicknodes();
				}
			});

			// We need to wait till all dom content is loaded. We initially used a standard wait time but shifted to
			//      use https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
			//      This still produces some discrepancy where it hangs up the web page.
			//      This needs to be improved at some point.
			window.addEventListener('load', (event) => {
				UDAPluginSDK.modifybodyhtml();
			});
		},
		checkuserkeyexists:function(){
			var sessionevent = new CustomEvent("RequestUDASessionData", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
			document.dispatchEvent(sessionevent);
		},
		createsession:function(data){
			UDASessionID=data.sessionkey;
			this.sessiondata=data;
			this.sessionID=data.sessionkey;
			
			this.recorddocumentclick();
		},
		clearSession: function(){
			this.sessionID = "";
			this.sessiondata = {sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
			this.closemodal();
		},
		modifybodyhtml:function(){
			var html='<div id="uda-btn" nist-voice="true"></div><div id="uda-html-container" style="display: none;"><div id="uda-html-content" nist-voice="true"></div></div>';

			jQuery(document.body).prepend(html);

			if(typeof isUDASdk === 'undefined') {
				jQuery(window).trigger('resize').promise().done(function () {
					UDAPluginSDK.indexclicknodes();
					UDAPluginSDK.addbuttonhtml();
				});
			} else {
				UDAPluginSDK.indexclicknodes();
				UDAPluginSDK.addbuttonhtml();
			}
			setInterval(function () {
				if(UDALastIndexTime!==0 && UDALastIndexTime<UDALastMutationTime) {
					UDAPluginSDK.indexnewclicknodes();
				}
			},UDA_POST_INTERVAL);
		},
		addbuttonhtml:function(){
			jQuery("#uda-btn").unbind("click").html("");
			// var buttonhtml='<img src="'+this.extensionpath+'assets/uda-logo.png" width="50px" height="50px" nist-voice="true">';
			var buttonhtml	=	'<div class="uda-nistapp-logo">'
								+'	<div class="uda-icon" style="text-align: center;">'
								+'		<img src="'+this.extensionpath+'images/icons/nist-logo.png">'
								// +'		<p style="padding:0; margin:0px;">Assist</p>'
								+'		<p style="padding:0; margin:0px;color: #303f9f; font-weight: bold; font-size: 11px;">UDAN(Beta)</p>'
								+'		<span>'
								+'			<img src="'+this.extensionpath+'images/icons/backarrow-orange.png">'
								+'		</span>'
								+'	</div>'
								+'</div>';
			var modal =jQuery("#uda-btn");
			modal.append(buttonhtml);
			modal.click(function () {
				UDAPluginSDK.openmodal(true);
			});
			if(this.rerenderhtml) {
				this.showhtml();
			}
		},
		rightPanelHtml: function(){
			var html = 	'<uda-panel>'
						+'<div class="uda-page-right-bar">'
						+'<div>'
							+'<div class="uda-ribbon-arrow" id="uda-close-panel"><img src="'+this.extensionpath+'images/icons/right-arrow.png"></div>'
							+'<div class="uda-icon-txt">'
								+'<img src="'+this.extensionpath+'images/icons/nist-logo.png"><span class="uda-help-bg-tooltip">Need Help?</span>'
							+'</div>'
							+'<div class="uda-icon-txt">'
							+'	<span class="" style="color: #303f9f; font-weight: bold;">UDAN(Beta)</span>'
							+'</div>'
							+'<div class="uda-container" style="text-align: center; margin-top: 10px;">'
								+'<div class="uda-search-div">'
									+'<button class="uda-mic-btn" style="border-radius: 5px 0px 0px 5px;" id="uda-voice-icon-start">'
									/*+'	<img src="'+this.extensionpath+'images/icons/mic-icon.png">'*/
									+'</button>'
									+'<button class="uda-stop-btn-bg" style="border-radius: 5px 0px 0px 5px; display:none;" id="uda-voice-icon-stop">'
									/*+'	<img src="'+this.extensionpath+'images/icons/color-stop-btn.png">'*/
									+'</button>'
									+'<input type="text" name="uda-search-input" class="uda-input-cntrl" placeholder="search..." id="uda-search-input" />'
									+'<button class="uda-search-btn" id="uda-search-btn" style="border-radius: 0px 5px 5px 0px;"></button>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<hr style="border:1px solid #969696; width:100%;">'
						+'<div class="uda-container uda-clear uda-cards-scroller" id="uda-content-container">'
						+'</div>'
						+'<div>'
							+'<div class="uda-footer-bar">'
								+'<div class="uda-container">'
									+'<div class="uda-dropdown" id="uda-advanced-btn">'
										+'<button class="uda-advanced-btn">'
											/*+'<img src="'+this.extensionpath+'images/icons/advanced-icon.png">*/
										+'<span>Advanced</span>'
										+'</button>'
										+'<div class="uda-advanced-btn-content">'
											+'<a id="uda-advance-section">New Sequence </a>'
											// +'<a><img src="'+this.extensionpath+'images/icons/new-record.png" width="23px" height="23px"><span> New Record</span></a>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<br>'
								+'<div class="uda-container" style="border-top:1px solid #969696; margin-top: 30px;">'
									+'<div class="uda-footer-left">Copyrights Reserved 2021.</div>'
									+'<div class="uda-footer-right" style="padding-top:5px; text-align:right;">'
										+'<a href="#">Know More </a>'
										+'<img src="'+this.extensionpath+'images/icons/nist-logo.png" width="15px" height="15px;">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'</uda-panel>';

			return html;
		},
		addvoicesearchmodal:function(addnisticon=true){
			jQuery("#uda-html-content").html(this.rightPanelHtml());
			jQuery("#uda-close-panel").click(function(){
				UDAPluginSDK.closemodal();
			});
			jQuery("#voicesearch").click(function(){
				UDAPluginSDK.searchinelastic();
			});
			jQuery("#uda-search-input").keydown(function (e) {
				if (e.keyCode === 13) {
					jQuery("#uda-content-container").html("");
					UDAPluginSDK.searchinelastic();
					return false;
				}
			});
			jQuery("#uda-search-btn").click(function(){
				UDAPluginSDK.searchinelastic();
			});
			if(UDASpeechRecognitionAvailable){
				jQuery("#uda-voice-icon-start").click(function () {
					jQuery("#uda-content-container").html("");
					UDAPluginSDK.recognition.start();
					jQuery("#uda-voice-icon-start").hide();
					jQuery("#uda-voice-icon-stop").show();
				});
				jQuery("#uda-voice-icon-stop").click(function () {
					UDAPluginSDK.recognition.stop();
					jQuery("#uda-voice-icon-stop").hide();
					jQuery("#uda-voice-icon-start").show();
				});
			} else {
				jQuery("#uda-voice-icon-start").hide();
				jQuery("#uda-voice-icon-stop").hide();
			}
			if(addnisticon) {
				if(!UDAUserAuthData.restrict_add_delete) {
					jQuery('#uda-advanced-btn').show();
					jQuery("#uda-advance-section").click(function () {
						UDAPluginSDK.showadvancedhtml();
					});
				}
			} else {
				/*jQuery("#nistvoicerecstpbtn").click(function () {
					UDAPluginSDK.gettimestamp("stop");
				});*/
				jQuery('#uda-advanced-btn').hide();
			}
		},
		//opening the UDA screen
		openmodal:function(focus=false){
			if(this.sessiondata.authenticated) {
				jQuery("#uda-btn").hide();
				jQuery('#uda-html-container').show();
				// jQuery("#nistModal").css("display", "block");
				var searchinput=jQuery("#uda-search-input");
				searchinput.val("");
				if (focus) {
					searchinput.focus();
				}
				// if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1) {
					let bodychildren = document.body.childNodes;
					if (bodychildren.length > 0) {
						bodychildren.forEach(function (childnode, childnodeindex) {
							if (childnode.classList && childnode.classList.contains("container")) {
								UDAPluginSDK.containersections.push(childnodeindex);
								childnode.classList.remove("container");
							}
							if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'uda-btn' && childnode.id !== 'uda-html-container') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
								if (childnode.classList && !childnode.classList.contains("uda-original-content")) {
									childnode.classList.add("uda-original-content");
								}
							}
						});
					}
				// }
			} else {
				var sessionevent = new CustomEvent("RequestUDASessionData", {detail: {data: "authtenicate"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		//closing the UDA screen
		closemodal:function(){
			jQuery("#uda-advance-section").show();
			jQuery('#uda-html-container').hide();
			// jQuery("#nistModal").css("display","none");
			// jQuery("#uda-content-container").html("");
			// jQuery("#nistrecordresults").html("");
			this.recordedsequenceids=[];
			jQuery("#uda-btn").show();
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.cancelrecordingsequence(false);
			// if(this.inarray(window.location.host,this.addcustomcssdomains) !== -1) {
				let bodychildren = document.body.childNodes;
				if (bodychildren.length > 0) {
					bodychildren.forEach(function (childnode, childnodeindex) {
						if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'uda-btn' && childnode.id !== 'uda-html-container') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
							if (childnode.classList && childnode.classList.contains("uda-original-content")) {
								childnode.classList.remove("uda-original-content");
							}
						}
						if (UDAPluginSDK.containersections.length > 0 && UDAPluginSDK.inarray(childnodeindex, UDAPluginSDK.containersections) !== -1) {
							childnode.classList.add("container");
						}
					});
				}
			// }
		},
		//Resetting introjs and continue to next playable action
		resetIntrojs: function () {
			this.configureintrojs();
			this.playNextAction = true;
			this.autoplayPaused = false;
			this.showhtml();
		},
		//render the required html for showing up the proper html
		showhtml:function(){
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
							if(!this.playNextAction) {
								return;
							}
						}
						this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
					} else {
						this.searchinelastic('');
					}
				} else {
					console.log('here');
					this.searchinelastic('');
				}
			} else {
				this.addvoicesearchmodal(addnisticon);
				this.showrecordedresults();
			}
			this.disableRecordButton();
		},
		// indexing all nodes after all the clicknodes are available
		indexclicknodes: function(){
			this.processcount=UDAClickObjects.length;
			this.previousurl=this.currenturl=window.location.href;
			this.processingnodes=true;
			// indexing nodes has been called for adding click detection
			this.indexdom(document.body);
			this.processedclickobjectscount=this.processcount;
			this.totalcount=UDAClickObjects.length;
			this.processingnodes=false;
			if(this.processcount<this.totalcount){
				//	todo refine the processing nodes.
				this.indexnewclicknodes();
				return;
			}
			UDALastIndexTime=Date.now();
		},
		// indexing new clicknodes after new html got loaded
		indexnewclicknodes: async function(){
			if(this.processingnodes){
				return;
			}
			this.processcount=UDAClickObjects.length;
			if(UDALastIndexTime!==0 && UDALastIndexTime>UDALastMutationTime){
				return;
			}
			UDALastIndexTime=Date.now();
			this.processingnodes=true;
			if(await this.removefromhtmlindex()) {
				this.indexnewnodes = true;
				this.currenturl = window.location.href;
				this.indexdom(document.body);
				this.processedclickobjectscount = this.processcount;
				this.processingnodes = false;
				this.totalcount = UDAClickObjects.length;
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
					let removedclickobjectslength=UDARemovedClickObjects.length;
					let foundremovedindexednode=-1;
					for (var k = 0; k < removedclickobjectslength; k++) {
						if(UDARemovedClickObjects[k].element === window){
							continue;
						}
						let removedclickobject=UDARemovedClickObjects[k].element;

						if (checknode['element-data'].isSameNode(removedclickobject)) {
							foundremovedindexednode=k;
							break;
						}
					}
					if(foundremovedindexednode===-1){
						newhtmlindex.push(checknode);
					} else {
						UDARemovedClickObjects.splice(foundremovedindexednode,1);
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
					if (this.inarray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
						if(node.nodeName.toLowerCase() === 'ckeditor' && node.childNodes.length>2 && this.recording){
							let addToolTip = true;
							for(let checknode of this.tooltipDisplayedNodes){
								if(node.isSameNode(checknode)) {
									addToolTip = false;
								}
							}
							if(addToolTip) {
								this.tooltipDisplayedNodes.push(node);
								$(node).addClass('uda-tooltip').append('<div class="uda-tooltip-right"><div class="uda-tooltip-text-content">We have detected a rich text editor. To record this in your sequence, Please click on the editor menu. We are unable to record clicks on the text area.</div></div>');
							}
						} else if(!node.hasclick && this.inarray(node.nodeName.toLowerCase(), this.addClickToSpecialNodes) !== -1 && this.inarray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) === -1){
							if(this.logLevel>0) {
								console.log('Child nodes ignored for node and added click to: ' + node.nodeName);
							}
							this.addClickToNode(node);
						} else if(this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
							// this.addClickToNode(node);
						} else {
							if(this.logLevel>0) {
								console.log('Child nodes ignored for node: ' + node.nodeName);
							}
						}
					} else if(node.classList && ((node.classList.contains('select2-container--open') && !node.classList.contains('select2-container--focus')))){
					//	do nothing as we are not going to deal with special classes
						if(this.logLevel>0){
							console.log('unwanted indexing prevention');
						}
					} else if(node.nodeName.toLowerCase() === "div" && (node.hasAttribute("uib-datepicker-popup-wrap") || (node.id && node.id==='recognize_modal'))){
						// fix for not indexing datepicker popup and nominate popup
						if(this.logLevel>0){
							console.log('date picker in javascript');
						}
					} else if(this.checkCssClassNames(node)){
						if(this.logLevel>0){
							console.log({cssIgnoredNode:node});
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
		//check css classnames for ignoring
		checkCssClassNames:function(node){
			let cssClassExist=false;
			if(this.ignoreNodesContainingClassNames.length>0){
				for(const classname of this.ignoreNodesContainingClassNames) {
					if(node.classList.contains(classname)){
						cssClassExist=true;
					}
				}
			}
			return cssClassExist;
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

			if(node.hasAttribute("uda-added") && node.getAttribute("uda-added")){
				return node;
			}

			if(node.nodeName.toLowerCase() === 'mat-checkbox'){
				return node;
			}

			if(this.inarray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) !== -1){
				return node;
			}

			// Multiple clicks are recorded for select2-selection class. select2-selection--multiple
			// This will create a problem during playback. We should record only one click to avoid this problem
			if(node.classList && (node.classList.contains("select2-search__field") || node.classList.contains('cdk-overlay-backdrop') || node.classList.contains('cdk-overlay-pane'))) {
				if(this.logLevel>0) {
					console.log(node.classList);
				}
				return node;
			}

			if(node.hasAttribute('disabled')){
				return node;
			}

			if(node.hasAttribute('readOnly')){
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

			for (var i = 0; i < UDAClickObjects.length; i++) {
				if(UDAClickObjects[i].element===window){
					continue;
				}
				if (node.isSameNode(UDAClickObjects[i].element)) {
					clickobjectexists = true;
					clickobject = UDAClickObjects[i];
				}
			}

			if(this.logLevel>2) {
				if(this.inarray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
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

			if(getchildlabels && node.childNodes.length>0){
				var childnodes = node.childNodes;
				childnodes.forEach(function (childnode, key) {
					if(childnode.nodeName.toLowerCase() !=="script" && childnode.nodeName.toLowerCase() !== "select" && childnode.nodeName.toLowerCase() !== '#comment') {
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
							UDAPluginSDK.recorduserclick(node, false,false, event, confirmdialog);
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
								UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
							});
							break;
						default:
							jQuery(node).click(function (event) {
								UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
							});
							break;
					}
					break;
				case "mat-select":
					jQuery(node).click(function (event) {
						UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
					});
					break;
				default:
					jQuery(node).click(function (event) {
						UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
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
			let tooltipnodes = $('.uda-tooltip');
			if (tooltipnodes.length > 0) {
				$('.uda-tooltip').each(function() {
					$(this).removeClass('uda-tooltip');
					$(this).find('.uda-tooltip-right').remove();
				});
			}

			this.simulateHover(node);

			var navigationcookie=this.getstoragedata(this.navigationcookiename);
			var navigationcookiedata = null;
			if(navigationcookie) {
				navigationcookiedata = JSON.parse(navigationcookie);
			}

			if(this.inarray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
				this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, false);
				return;
			}

			switch (node.nodeName.toLowerCase()) {
				case "input":
					// this.playNextAction = false;
					// functionality for detecting multi select box and highlighting the recorded node
					if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))){
						this.addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, navigationcookiedata, false, true);
					} else if(node.hasAttribute('role') && (node.getAttribute('role')==='combobox')) {
						this.addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, navigationcookiedata, false, false, true);
					} else if(node.hasAttribute('type') && (node.getAttribute('type')==='checkbox' || node.getAttribute('type')==='radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
						this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, false, false, true);
					} else if(node.hasAttribute('type')){
						switch (node.getAttribute('type').toLowerCase()) {
							case 'checkbox':
								if(node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_checkbox')) {
									this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
								} else {
									this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, false, false, true);
								}
								break;
							case 'radio':
								if(node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_label')) {
									this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
								} else {
									this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, false, false, true);
								}
								break;
							case 'submit':
								node.click();
								this.invokenextitem(node,timetoinvoke);
								this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
                            	break;
							case 'text':
								if(node.attributes && node.attributes.length>0 && (node.hasAttribute('ngxdaterangepickermd'))) {
									this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, false);
								} else if(node.attributes && node.attributes.length>0 && (node.hasAttribute('uib-datepicker-popup'))) {
									this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, true, false);
								} else {
									this.addToolTip(node, node.parentNode, navigationcookiedata, false, true, true);
								}
								break;
							default:
								this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
								break;
						}
					} else {
						this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
					}
					break;
				case "textarea":
					this.playNextAction = false;
					this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
					break;
				case "select":
					// this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
					this.addToolTip(node, node, navigationcookiedata, false, false, true);
					break;
				case "option":
					this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
					break;
				case "checkbox":
					// this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, false, false);
					this.addToolTip(node, node, navigationcookiedata, false, false, true);
					break;
				// Additional processing for calendar selection
				case "button":
					if(node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
						this.addToolTip(node, node.parentNode, navigationcookiedata, true, false);
					} else if(node.classList && node.classList.contains('btn-pill')) {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					} else {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					}
					break;
				case 'span':
					if (node.classList && node.classList.contains('select2-selection')) {
						this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, true, false);
					} else {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					}
					break;
				case 'div':
					if(node.classList && (node.classList.contains('mat-form-field-flex') || node.classList.contains('mat-select-trigger'))) {
						this.addToolTip(node, node.parentNode.parentNode, navigationcookiedata, true, false);
					} else {
						node.click();
						this.invokenextitem(node,timetoinvoke);
					}
					break;
				//	fix for text editor during playback
				case 'ckeditor':
					this.addToolTip(node, node, navigationcookiedata, true, false);
					break;
				case 'ng-select':
					this.addToolTip(node, node, navigationcookiedata, false, false);
					break;
				default:
					node.click();
					this.invokenextitem(node,timetoinvoke);
					break;
			}
		},
		//add tooltip display
		addToolTip:function(invokingnode, tooltipnode, navigationcookiedata, enableClick=false, enableFocus=false, enableIntroJs=false, message= 'Please input the value and then click on') {

			if(this.logLevel>2){
				console.log(this.invokingnode);
			}

			/*if(this.invokingnode && this.invokingnode.isEqualNode(invokingnode)){
				return;
			} else {
				this.invokingnode = invokingnode;
			}*/

			this.invokingnode = invokingnode;

			this.playNextAction = false;

			if(enableIntroJs) {
				this.introjs.addStep({
					element: tooltipnode,
					intro: message,
					position: 'right',
				}).start();
				if(enableFocus){
					invokingnode.focus();
				}
				if(enableClick){
					invokingnode.click();
				}
				return;
			}

			if(navigationcookiedata && navigationcookiedata.autoplay) {
				this.autoplay = false;
				this.autoplayPaused = true;
				this.toggleautoplay(navigationcookiedata);
			} else {
				this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id, true, navigationcookiedata);
			}

			var html = 	'<div class="uda-tooltip-right">'
						+'	<div class="uda-tooltip-text-content">'
						+message
						+'	</div>'
						+'	<button class="uda-tutorial-btn" style="margin-bottom:10px;" type="button" uda-added="true" onclick="UDAPluginSDK.resumePlay();">Continue</button>'
						+'</div>';

			$('html, body').animate({
				scrollTop: ($(invokingnode).offset().top - 200)
			}, 2000, function(){
				$(tooltipnode).addClass('uda-tooltip')
				$(tooltipnode).append(html);
				if(enableFocus){
					invokingnode.focus();
				}
				if(enableClick){
					invokingnode.click();
				}
			});
		},
		//Continue functionality invoke
		resumePlay: function(){
			let tooltipnodes = $('.uda-tooltip');
			if (tooltipnodes.length > 0) {
				$('.uda-tooltip').each(function() {
					$(this).removeClass('uda-tooltip');
					$(this).find('.uda-tooltip-right').remove();
				});
			}
			this.playNextAction = true;
			// this.showhtml();
			var navigationcookie=this.getstoragedata(this.navigationcookiename);
			var navigationcookiedata = null;
			if(navigationcookie) {
				navigationcookiedata = JSON.parse(navigationcookie);
			}
			this.toggleautoplay(navigationcookiedata);
		},
		//invoke the click of next item
		invokenextitem:function(node,timetoinvoke){
			var link=false;
			timetoinvoke=timetoinvoke+4000;
			if(node.hasOwnProperty("href")){
				link=true;
			}
			if(!link) {
				setTimeout(function(){UDAPluginSDK.showhtml();}, timetoinvoke);
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
				UDAPluginSDK.indexnewclicknodes();
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

			// fix for file upload click
			if(node.style && node.style.display && node.style.display === 'none'){
				return ;
			}

			if(this.logLevel>0) {
				console.log('-------------------------------------------------------------');
				// console.log(this.lastclickedtime);
				console.log({clickednode: node});
				// console.log({indexedpos: node.uda_custom.domJson.node.nodePosition});
				console.log('-------------------------------------------------------------');
			}

			// stopping recording as date range picker is clicked as we do not support it.
			/*if(this.recording && node.hasAttribute('ngxdaterangepickermd')) {
				alert('Sorry currently we do not support daterange selector. Please re-record the sequence without selecting daterange selector');
				this.recording=false;
				this.cancelrecordingsequence();
				this.showadvancedhtml();
				return ;
			}*/

			if(this.recording && this.inarray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) !== -1){
				return ;
			} else if(this.recording && this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
				alert('Sorry currently we do not support this '+node.nodeName+' selector. Please re-record the sequence without selecting '+node.nodeName+' selector');
				this.recording=false;
				this.cancelrecordingsequence();
				this.showadvancedhtml();
				return ;
			} else if(this.recording && (node.parentNode && node.parentNode.hasAttribute("ng-controller") && node.parentNode.getAttribute("ng-controller")==='recognize_modal')) {
				// fix for nominate recording functionality.
				alert('Sorry currently we do not support this Nominate feature. Please re-record the sequence without selecting Nominate feature');
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

			if(this.inarray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1 && this.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())){
				domjson.meta.displayText = this.customNameForSpecialNodes[node.nodeName.toLowerCase()];
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
			postdata.clickednodename = this.getclickedinputlabels(node, fromdocument, selectchange);

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
					UDAPluginSDK.confirmednode = false;
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
					UDAPluginSDK.indexnewclicknodes();
				} else {
					//processing new clicknodes if available after the click action.
					setTimeout(function () {
						this.forceReindex = true;
						UDAPluginSDK.indexnewclicknodes();
					}, UDA_POST_INTERVAL);
					// UDAPluginSDK.indexnewclicknodes();
				}
			}

			// rerender html if recording is enabled.
			if(this.recording) {
				setTimeout(function () {
					UDAPluginSDK.showhtml();
				}, UDA_POST_INTERVAL);
			}
		},
		confirmparentclick:function(node, fromdocument, selectchange, event, postdata) {
			var prevclicktext = this.getclickedinputlabels(this.lastclickednode, fromdocument, selectchange);
			if(node.hasChildNodes()) {
				var childtextexists = this.processparentchildnodes(node, prevclicktext);
				if(!childtextexists) {
					var confirmdialog = confirm("Did you clicked: " + postdata.clickednodename);
					if (confirmdialog === true) {
						UDAPluginSDK.confirmednode = true;
						UDAPluginSDK.recorduserclick(node, fromdocument, selectchange, event, false);
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
			if(this.logLevel>2){
				console.log(inputlabels);
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

			jQuery("#uda-content-container").html("");

			if(this.clickeOn && this.clickeOn === 'record-btn'){
				UDAPluginSDK.addrecordresultshtml([]);
				this.clickeOn = '';
				return ;
			}

			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+starttime+"&end="+endtime+"&sessionid="+UDAPluginSDK.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.addrecordresultshtml(JSON.parse(xhr.response));
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

			this.clickeOn = 'record-btn';

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
			jQuery("#uda-content-container").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost+"/clickevents/fetchrecorddata?start="+recordingcookiedata.starttime+"&end="+recordingcookiedata.endtime+"&sessionid="+UDAPluginSDK.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.addrecordresultshtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		//cancel the recording sequence
		cancelrecordingsequence:function(render=true){
			// jQuery('#uda-advanced-btn').hide();
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				if(!recordingcookiedata.recording){
					return false;
				}
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
			this.currentPage='cancelrecording';
			if(render) {
				this.showhtml();
			}
		},
		//show sequence list html
		addrecordresultshtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids=data;
				jQuery("#uda-content-container").html(this.renderRecordedSequenceHtml());
				for(var i=0;i<data.length;i++){
					// modification for personal button addition
					if(i===(data.length-1)){
						this.renderrecordresultrow(data[i],i,true);
					} else {
						this.renderrecordresultrow(data[i],i,false);
					}
				}
			} else {
				jQuery("#uda-content-container").html(this.renderEmptyRecordedSequenceHtml());
			}

			this.openmodal(false);
		},
		renderRecordedSequenceHtml: function(){
			var html =	'<div class="uda-card-details">'
						+'	<h5>Recorded Sequence</h5>'
						+'	<hr>'
						+'	<ul class="uda-recording" id="uda-recorded-results">'
						+'	</ul>'
						+'	<div class="uda-recording" style="text-align: center;">'
						+'		<input type="text" id="uda-recorded-name" name="uda-save-recorded" class="uda-form-input" placeholder="Enter Label">'
						+'		<button class="uda-record-btn" onclick="UDAPluginSDK.cancelrecordingsequence();"><span>Cancel and Exit</span></button>'
						+'		<button class="uda-tutorial-btn" onclick="UDAPluginSDK.submitrecordedlabel();">Submit</button>'
						+'	</div>'
						+'</div>';
			return html;
		},
		renderEmptyRecordedSequenceHtml: function(){
			var html =	'<div class="uda-card-details">'
						// +'<span class="uda-close-icon">×</span>'
						+'	<h5>Recorded Sequence</h5>'
						+'	<hr>'
						+'	<h5>Please navigate in the page to record.</h5>'
						+'	<br />'
						+'	<div class="uda-recording" style="text-align: center;">'
						// +'		<input type="text" id="uda-recorded-name" name="uda-save-recorded" class="uda-form-input" placeholder="Enter Label">'
						+'		<button class="uda-record-btn" onclick="UDAPluginSDK.cancelrecordingsequence();"><span>Cancel and Exit</span></button>'
						// +'		<button class="uda-tutorial-btn" onclick="UDAPluginSDK.submitrecordedlabel();">Submit</button>'
						+'	</div>'
						+'</div>';
			return html;
		},
		//render record row html of the sequence
		renderrecordresultrow:function(data,index, showPersonalButton=false){
			index++;
			// let clickedname=((data.clickednodename.length>this.maxstringlength)?data.clickednodename.substr(0,this.maxstringlength)+'...':data.clickednodename);
			let nodeData = JSON.parse(data.objectdata);
			var originalName = '';
			if(nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== ''){
				var clickedname = ((nodeData.meta.displayText.length > this.maxstringlength) ? nodeData.meta.displayText.substr(0, this.maxstringlength) + '...' : nodeData.meta.displayText);
				originalName = nodeData.meta.displayText;
			} else {
				var clickedname = ((data.clickednodename.length > this.maxstringlength) ? data.clickednodename.substr(0, this.maxstringlength) + '...' : data.clickednodename);
				originalName = data.clickednodename;
			}
			// let clickedname=data.clickednodename;
			// personal button appearance
			if(showPersonalButton){
				// clickedname=((data.clickednodename.length>(this.maxstringlength-24))?data.clickednodename.substr(0,(this.maxstringlength-24))+'...':data.clickednodename);
				var editBtn = 	'			<span>'
								+'				<button class="uda-tutorial-btn" style="padding:0px;" type="button" id="uda-edit-clickedname"><img src="'+this.extensionpath+'images/icons/edit.png"></button>'
								+'			</span>'
								+'			<input type="text" id="uda-edited-name" name="uda-edited-name" class="uda-form-input" placeholder="Enter Name" value="'+originalName+'" style="display: none;">';
				if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
					// var personalHtml = '&nbsp; &nbsp; (personal)';
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" id="isPersonal" checked /> <label style="font-size:14px;">Is personal</label>';
				} else {
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" id="isPersonal" /> <label style="font-size:14px;">Is personal</label>';
				}
				personalHtml += '			<span style="position: relative; top: 0px;"><img src="'+this.extensionpath+'images/icons/info.png" title="help"></span>';
				var html =	'<li><i>'
								+clickedname
								// +editBtn
								+'<br />'
								+'</i>'
								+personalHtml
								+'<br />'
							+'</li>';
				var element = jQuery(html);
				jQuery("#uda-recorded-results").append(element);
				jQuery("#isPersonal").click(function (){
					UDAPluginSDK.personalNode(data);
				});
				var beforeEditText = originalName;
				jQuery("#uda-edit-clickedname").click(function (){
					// $(".voice-card-left ul li:last").css("border", "1px solid");
					// $(".voice-card-left ul li:last").attr("contenteditable","true");
					jQuery("#uda-edited-name").show();
				});
				jQuery('#uda-edited-name').blur(function() {
					let editedName = $("#uda-edited-name").val();
					if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
						UDAPluginSDK.editAndSave(data, editedName);
					}
				});
				jQuery("#uda-edited-name").keydown(function (e) {
					if (e.keyCode === 13) {
						let editedName = $("#uda-edited-name").val();
						if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
							UDAPluginSDK.editAndSave(data, editedName);
						}
					}
				});
			} else {
				clickedname += (nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal)?'&nbsp; &nbsp;(personal)':'';
				var html = '<li><i>' +
					clickedname +
					'</i></li>';
				var element = jQuery(html);
				jQuery("#uda-recorded-results").append(element);
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
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		//edit modification button clicked
		editAndSave:function(data, value){
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta && nodeData.meta.hasOwnProperty("displayText")){
				nodeData.meta.displayText = value;
			} else {
				nodeData.meta = {};
				nodeData.meta.displayText = value;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		// submit functionality of the recorded sequence.
		submitrecordedlabel:function(submittype="recording"){
			var sequencename=jQuery("#uda-recorded-name").val();
			var sequencelistdata={name:"",domain:window.location.host,usersessionid:this.sessiondata.authdata.id.toString(),userclicknodelist:[].toString(),userclicknodesSet:this.recordedsequenceids,isValid:1,isIgnored:0};
			if(submittype==='recording') {
				if (sequencename === '') {
					alert('Please enter proper label');
					jQuery("#uda-recorded-name").focus();
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
			this.cancelrecordingsequence(false);
			this.currentPage='SequenceSubmitted';
			this.showhtml();
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/recordsequencedata", true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function(event){
				if(xhr.status === 200){
					// UDAPluginSDK.backtomodal();
					UDAPluginSDK.showSelectedSequence(JSON.parse(xhr.response))
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

			if(this.currentPage==='cancelrecording'){
				jQuery('#uda-advanced-btn').hide();
			} else if(this.currentPage==='SequenceSubmitted'){
				return ;
			} else if(!UDAUserAuthData.restrict_add_delete) {
				jQuery('#uda-advanced-btn').show();
				jQuery("#uda-advance-section").show();
			}

			this.currentPage='advanced';

			if(searchterm) {
				var searchtext = searchterm;
			} else {
				var searchtext = jQuery("#uda-search-input").val();
			}

			this.cancelrecordingsequence(true);

			this.renderMessage('Loading Please Wait...');


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
					UDAPluginSDK.searchInProgress=false;
					UDAPluginSDK.renderSearchResults(JSON.parse(xhr.response));
				} else {
					UDAPluginSDK.renderMessage();
				}
			};
			// xhr.addEventListener("error", UDAPluginSDK.renderMessage());
			xhr.onerror = function(){
				UDAPluginSDK.renderMessage();
			};
			xhr.send();
		},
		//rendering search results screen
		renderSearchResults:function(data){

			if(!UDAUserAuthData.restrict_add_delete) {
				jQuery('#uda-advanced-btn').show();
				jQuery("#uda-advance-section").show();
			}

			var matchnodes = data;
			if(matchnodes.length>0){
				jQuery("#uda-content-container").html('');
				for(var k=0;k<matchnodes.length;k++){
					if(matchnodes[k].hasOwnProperty("deleted") && matchnodes[k].deleted===0) {
						this.renderSequenceRow(matchnodes[k], k);
					} else if(!matchnodes[k].hasOwnProperty("deleted")) {
						this.renderSequenceRow(matchnodes[k], k);
					}
				}
			} else {
				this.renderEmptySearchResults();
			}
		},
		// rendering empty results html
		renderEmptySearchResults: function(){
			this.searchInProgress=false;
			jQuery("#uda-content-container").html(this.getEmptyResultsHtml());
		},
		getEmptyResultsHtml: function() {
			let html =	'<div class="uda-no-results">'
						+'	<svg class="uda-no-src" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m317 90c-57.891 0-105 47.109-105 105s47.109 105 105 105 105-47.109 105-105-47.109-105-105-105zm51.211 135-21.211 21.211-30-30-30 30-21.211-21.211 30-30-30-30 21.211-21.211 30 30 30-30 21.211 21.211-30 30z"/><path d="m317 0c-107.52 0-195 87.48-195 195 0 48.371 17.809 92.591 47.08 126.709l-23.086 23.086-21.211-21.211-111.631 111.629c-17.534 17.534-17.534 46.069-.015 63.633l.015.015c17.549 17.52 46.124 17.523 63.633-.015l111.631-111.629-21.211-21.211 23.086-23.086c34.118 29.271 78.338 47.08 126.709 47.08 107.52 0 195-87.48 195-195s-87.48-195-195-195zm0 330c-74.443 0-135-60.557-135-135s60.557-135 135-135 135 60.557 135 135-60.557 135-135 135z"/></g></svg>'
						+'	<p>No results found</p>'
						+'</div>';
			return html;
		},
		renderMessage: function(message='Something went wrong please try again later.'){
			this.searchInProgress=false;
			jQuery("#uda-content-container").html(this.getMessageHtml(message));
		},
		getMessageHtml: function(message) {
			let html =	'<div class="uda-no-results">'
				+'	<svg class="uda-no-src" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m317 90c-57.891 0-105 47.109-105 105s47.109 105 105 105 105-47.109 105-105-47.109-105-105-105zm51.211 135-21.211 21.211-30-30-30 30-21.211-21.211 30-30-30-30 21.211-21.211 30 30 30-30 21.211 21.211-30 30z"/><path d="m317 0c-107.52 0-195 87.48-195 195 0 48.371 17.809 92.591 47.08 126.709l-23.086 23.086-21.211-21.211-111.631 111.629c-17.534 17.534-17.534 46.069-.015 63.633l.015.015c17.549 17.52 46.124 17.523 63.633-.015l111.631-111.629-21.211-21.211 23.086-23.086c34.118 29.271 78.338 47.08 126.709 47.08 107.52 0 195-87.48 195-195s-87.48-195-195-195zm0 330c-74.443 0-135-60.557-135-135s60.557-135 135-135 135 60.557 135 135-60.557 135-135 135z"/></g></svg>'
				+'	<p>'+message+'</p>'
				+'</div>';
			return html;
		},
		//rendering each row html of the search result
		renderSequenceRow:function(data){
			var element=jQuery(this.getRowHtml(data));
			element.click(function () {
				UDAPluginSDK.showSelectedSequence(data);
			});
			jQuery("#uda-content-container").append(element);
		},
		//Sequence row html
		getRowHtml: function(data){
			var path='';
			for(var i=0;i<data.userclicknodesSet.length;i++){
				if(path!==''){
					path +=' >> ';
				}
				path += data.userclicknodesSet[i].clickednodename;
			}
			var html =	'<div class="uda-card">'
						+'	<h5>'+data.name.toString()+'</h5>'
						+'	<i>'+path+'</i>'
						+'</div>';
			return html;
		},
		//selected search result functionality
		showSelectedSequence:function(data){
			var navcookiedata = {shownav: true, data: data, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			navcookiedata.searchterm=jQuery("#uda-search-input").val();
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.autoplay = false;
			this.showselectedrow(data,data.id,true, navcookiedata);
			this.invokedActionManually=false;
			//add analtytics
			this.recordclick('sequencerecord',data.name.toString(),data.id);
		},
		// renderSelectedSequenceHtml: fu
		renderSelectedSequenceHtml: function (data, isPlaying){
			var html =	'<div class="uda-card-details" style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">'
						+'    <div class="uda-card-btns">'
						+'        <button class="uda-play-btn" '+((isPlaying)?'disabled="disabled"':'id="nist-autoplay"')+'><img src="'+this.extensionpath+'images/icons/play-icon.png"></button>'
						+'        <button class="uda-stop-btn" '+((!isPlaying)?'disabled="disabled"':'id="nist-autoplay"')+'><img src="'+this.extensionpath+'images/icons/stop-icon.png"></button>'
						+'    </div>'
						+'    <div class="uda-card-right-dbl-arrow" id="uda-backto-search"><img src="'+this.extensionpath+'images/icons/right-duble-arrow.png"></div>'
						+'    <h5>'+data.name.toString()+'</h5>'
						+'    <hr>'
						+'    <ul class="uda-suggestion-list" id="uda-sequence-steps">'
						+'    </ul>'
						+'</div>'
						+'<div class="uda-details-footer">'
						+'    <div class="uda-details-footer-left uda-trash-img" id="uda-delete-sequence">'
						+'    </div>'
						+'    <div class="uda-details-footer-right">'
						// +'    	<div class="like-img-bg uda-like-img" style="border-left: 1px solid #dce0f7;" id="uda-upvote">'
						// +'   	</div>'
						// +'    	<div class="dislike-img-bg uda-dislike-img" id="uda-downvote">'
						// +'   	</div>'
						+'    </div>'
						+'</div>';
			return html;
		},
		//showing the selected search result screen functionality
		showselectedrow:function(data,index,shownodelist=false, navcookiedata={}){
			if(shownodelist && navcookiedata.data.userclicknodesSet.length===navcookiedata.navigateddata.length){
				navcookiedata.navcompleted=true;
			}
			var isPlaying =  false;

			this.currentPage='SelectedSequence';

			if(shownodelist) {
				if (navcookiedata.navcompleted) {
					this.autoplayCompleted = true;
				} else {
					if(navcookiedata.autoplay) {
						isPlaying = true;
					}
				}
			}

			var element=jQuery(this.renderSelectedSequenceHtml(data, isPlaying));
			jQuery("#uda-content-container").html(element);
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
				jQuery("#uda-sequence-steps").append(this.rendersteps(data.userclicknodesSet[i], visited, navcookiedata));
			}

			if(this.sessionID && data.usersessionid && (this.sessionID.toString()===data.usersessionid.toString() || (this.sessiondata.authdata.hasOwnProperty('id') && this.sessiondata.authdata.id.toString()===data.usersessionid.toString()))){
				jQuery("#uda-delete-sequence").click(function () {
					UDAPluginSDK.deleteSequence(data);
				});
			} else {
				jQuery("#uda-delete-sequence").hide();
			}

			jQuery('#uda-upvote').click(function () {
				UDAPluginSDK.addvote("up",data);
			});
			jQuery('#uda-downvote').click(function () {
				UDAPluginSDK.addvote("down",data);
			});

			jQuery("#nist-autoplay").click(function () {
				UDAPluginSDK.toggleautoplay(navcookiedata);
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
			jQuery("#uda-backto-search").click(function () {
				// UDAPluginSDK.toggleautoplay(navcookiedata);
				UDAPluginSDK.autoplay = false;
				UDAPluginSDK.searchInProgress=false;
				UDAPluginSDK.autoplayPaused=false;
				UDAPluginSDK.playNextAction=true;
				UDAPluginSDK.configureintrojs();
				UDAPluginSDK.introjs.refresh();
				UDAPluginSDK.backtosearchresults(navcookiedata);
			});
		},
		//showing the sequence steps html
		rendersteps:function(data,visited=false, navcookiedata={}){
			// adding elipses if textlength is greater than specified characters
			// display personal tag for the personal nodes
			let clickedname = '';
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== ''){
				clickedname = ((nodeData.meta.displayText.length > this.maxstringlength) ? nodeData.meta.displayText.substr(0, this.maxstringlength) + '...' : nodeData.meta.displayText);
			} else {
				clickedname = ((data.clickednodename.length > this.maxstringlength) ? data.clickednodename.substr(0, this.maxstringlength) + '...' : data.clickednodename);
			}
			if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
				clickedname=((data.clickednodename.length>(this.maxstringlength-26))?data.clickednodename.substr(0,(this.maxstringlength-26))+'... (personal)':data.clickednodename);
			}
			// var clickedtext = '<pre>'+clickedname+'</pre>';
			var clickedtext = clickedname;
			if(visited>-1) {
				var template = jQuery("<li class='completed'><i>" + clickedtext + "</i></li>");
			} else {
				var template = jQuery("<li class='inactive'><i>" + clickedtext + "</i></li>");
			}
			if(visited === -1) {
				template.click(function () {
					UDAPluginSDK.invokedActionManually = true;
					UDAPluginSDK.performclickaction(data,navcookiedata);
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
						const inputLabels = UDAPluginSDK.getclickedinputlabels(matchNode.originalNode["element-data"]);
						if(UDAPluginSDK.logLevel>0){
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
					if(navcookiedata && navcookiedata.autoplay) {
						this.autoplay = false;
						this.autoplayPaused = true;
						this.toggleautoplay(navcookiedata);
					}
				}

			} else {
				alert("Unable to find the action");
				if(navcookiedata && navcookiedata.autoplay) {
					this.autoplay = false;
					this.autoplayPaused = true;
					this.toggleautoplay(navcookiedata);
				}
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
		deleteSequence:function(data){
			var confirmdialog=confirm("Are you sure want to delete "+data.name);
			if(confirmdialog === true){
				UDAPluginSDK.confirmdelete(data);
			}
		},
		//confirmation for the deletion of the sequence list
		confirmdelete:function (data) {
			// var senddata=JSON.stringify({usersessionid:this.UDASessionID,id:data.id});
			var senddata=JSON.stringify({usersessionid:this.sessiondata.authdata.id,id:data.id});
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.apihost + "/clickevents/sequence/delete", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status === 200){
					// UDAPluginSDK.closemodal();
					UDAPluginSDK.searchinelastic();
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
			jQuery("#uda-search-input").val(navcookiedata.searchterm);

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
			this.currentPage='advanced';
			jQuery("#uda-advance-section").hide();
			jQuery("#uda-content-container").html('');
			jQuery("#uda-content-container").append(this.getAdvancedHtml());
			jQuery("#uda-enable-record").click(function () {
				UDAPluginSDK.gettimestamp("start");
			});
			jQuery("#nistvoiceback").click(function () {
				UDAPluginSDK.backtomodal();
			});
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.apihost + "/clickevents/suggested?domain="+encodeURI(window.location.host), true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.showsuggestedhtml(JSON.parse(xhr.response));
				}
			};
			// xhr.send();
		},
		// advanced html
		getAdvancedHtml: function (){
			var html =	'<div class="uda-card-details">'
							// +'<div><button class="uda-tutorial-btn" type="button">Tutorial</button></div>'
							// +'<hr>'
							+'<span class="uda-close-icon" onclick="UDAPluginSDK.searchinelastic();">×</span>'
							+'<h5>Create your own action</h5>'
							+'<div><button class="uda-record-btn" id="uda-enable-record"><span>Rec</span></button></div>'
						+'</div>';
			return html;
		},
		showsuggestedhtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids = data;
				var html = '   <div class="voice-suggesion-card">' +
					'		<div class="voice-card-left">' +
					'			<h4>Our AI detected this sequence. <br /> Do you want to name it? <br /><span style="color:#ff4800;font-weight:bold;">(Alpha version: Not reliable)</span></h4>' +
					'			<ul id="uda-recorded-results" class="voice-sugggesion-bullet">' +
					'			</ul>' +
					'			<div>' +
					'				<input id="uda-recorded-name" type="text" name="uda-recorded-name" class="voice-save-recrded-inpt" placeholder="Enter label" nist-voice="true">' +
					'				<button onclick="UDAPluginSDK.submitrecordedlabel(\'recording\');" class="voice-submit-btn">Submit</button><button class="voice-cancel-btn" onclick="UDAPluginSDK.submitrecordedlabel(\'invalid\');">Invalid Sequence</button><button class="voice-cancel-btn" onclick="UDAPluginSDK.submitrecordedlabel(\'ignore\');">Ignore</button>' +
					'			</div>' +
					'		</div>' +
					'	</div>';

				jQuery("#uda-content-container").append(html);
				for (var i = 0; i < data.length; i++) {
					this.renderrecordresultrow(data[i], i);
				}
			}
		},
		backtomodal:function(){
			jQuery("#uda-advance-section").show();
			jQuery("#uda-content-container").html('');
		},
		/**
		 * disabling functionality to show the button or not.
		 */
		disableRecordButton: function(){
			if(UDAUserAuthData.restrict_add_delete) {
				jQuery("#uda-advanced-btn").hide();
			} else {
				jQuery("#uda-advanced-btn").show();
			}
		}
	};
	UDAPluginSDK.init();
}
