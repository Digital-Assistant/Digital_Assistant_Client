var s = document.createElement('script');
s.async = false;
s.onload = function() {
};
s.text = `
/***
 * Logger codebase
 */
/*! log4js-2.0.0  18-10-2018 */

var Log4js={version:"2.0.0",applicationStartDate:new Date,loggers:{},getLogger:function(e){return"string"!=typeof e&&(e="[default]"),Log4js.loggers[e]||(Log4js.loggers[e]=new Log4js.Logger(e)),Log4js.loggers[e]},getDefaultLogger:function(){return Log4js.getLogger("[default]")},attachEvent:function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},extend:function(e,t){for(var n in t)e[n]=t[n];return e},bind:function(e,t){return function(){return e.apply(t,arguments)}}};Array.prototype.push||(Array.prototype.push=function(){for(var e=this.length,t=0;t<arguments.length;t++)this[e+t]=arguments[t];return this.length}),Log4js.Level=function(e,t){this.level=e,this.levelStr=t},Log4js.Level.prototype={toLevel:function(e,t){if(null===e)return t;if("string"==typeof e){switch(e.toUpperCase()){case"ALL":return Log4js.Level.ALL;case"DEBUG":return Log4js.Level.DEBUG;case"INFO":return Log4js.Level.INFO;case"WARN":return Log4js.Level.WARN;case"ERROR":return Log4js.Level.ERROR;case"FATAL":return Log4js.Level.FATAL;case"OFF":return Log4js.Level.OFF;case"TRACE":return Log4js.Level.TRACE;default:return t}}else{if("number"!=typeof e)return t;switch(e){case ALL_INT:return Log4js.Level.ALL;case DEBUG_INT:return Log4js.Level.DEBUG;case INFO_INT:return Log4js.Level.INFO;case WARN_INT:return Log4js.Level.WARN;case ERROR_INT:return Log4js.Level.ERROR;case FATAL_INT:return Log4js.Level.FATAL;case OFF_INT:return Log4js.Level.OFF;case TRACE_INT:return Log4js.Level.TRACE;default:return t}}},toString:function(){return this.levelStr},valueOf:function(){return this.level}},Log4js.Level.OFF_INT=Number.MAX_VALUE,Log4js.Level.FATAL_INT=5e4,Log4js.Level.ERROR_INT=4e4,Log4js.Level.WARN_INT=3e4,Log4js.Level.INFO_INT=2e4,Log4js.Level.DEBUG_INT=1e4,Log4js.Level.TRACE_INT=5e3,Log4js.Level.ALL_INT=Number.MIN_VALUE,Log4js.Level.OFF=new Log4js.Level(Log4js.Level.OFF_INT,"OFF"),Log4js.Level.FATAL=new Log4js.Level(Log4js.Level.FATAL_INT,"FATAL"),Log4js.Level.ERROR=new Log4js.Level(Log4js.Level.ERROR_INT,"ERROR"),Log4js.Level.WARN=new Log4js.Level(Log4js.Level.WARN_INT,"WARN"),Log4js.Level.INFO=new Log4js.Level(Log4js.Level.INFO_INT,"INFO"),Log4js.Level.DEBUG=new Log4js.Level(Log4js.Level.DEBUG_INT,"DEBUG"),Log4js.Level.TRACE=new Log4js.Level(Log4js.Level.TRACE_INT,"TRACE"),Log4js.Level.ALL=new Log4js.Level(Log4js.Level.ALL_INT,"ALL"),Log4js.Logger=function(e){this.loggingEvents=[],this.appenders=[],this.category=e||"",this.level=Log4js.Level.FATAL,this.dateformat=Log4js.DateFormatter.DEFAULT_DATE_FORMAT,this.dateformatter=new Log4js.DateFormatter,this.onlog=new Log4js.CustomEvent,this.onclear=new Log4js.CustomEvent,this.appenders.push(new Log4js.Appender(this));try{window.onerror=this.windowError.bind(this)}catch(e){}},Log4js.Logger.prototype={addAppender:function(e){if(!(e instanceof Log4js.Appender))throw"Not instance of an Appender: "+e;e.setLogger(this),this.appenders.push(e)},setAppenders:function(e){for(var t=0;t<this.appenders.length;t++)this.appenders[t].doClear();this.appenders=e;for(var n=0;n<this.appenders.length;n++)this.appenders[n].setLogger(this)},setLevel:function(e){this.level=e},log:function(e,t,n){var o=new Log4js.LoggingEvent(this.category,e,t,n,this);this.loggingEvents.push(o),this.onlog.dispatch(o)},clear:function(){try{this.loggingEvents=[],this.onclear.dispatch()}catch(e){}},isTraceEnabled:function(){return this.level.valueOf()<=Log4js.Level.TRACE.valueOf()},trace:function(e){this.isTraceEnabled()&&this.log(Log4js.Level.TRACE,e,null)},isDebugEnabled:function(){return this.level.valueOf()<=Log4js.Level.DEBUG.valueOf()},debug:function(e,t){this.isDebugEnabled()&&this.log(Log4js.Level.DEBUG,e,t)},isInfoEnabled:function(){return this.level.valueOf()<=Log4js.Level.INFO.valueOf()},info:function(e,t){this.isInfoEnabled()&&this.log(Log4js.Level.INFO,e,t)},isWarnEnabled:function(){return this.level.valueOf()<=Log4js.Level.WARN.valueOf()},warn:function(e,t){this.isWarnEnabled()&&this.log(Log4js.Level.WARN,e,t)},isErrorEnabled:function(){return this.level.valueOf()<=Log4js.Level.ERROR.valueOf()},error:function(e,t){this.isErrorEnabled()&&this.log(Log4js.Level.ERROR,e,t)},isFatalEnabled:function(){return this.level.valueOf()<=Log4js.Level.FATAL.valueOf()},fatal:function(e,t){this.isFatalEnabled()&&this.log(Log4js.Level.FATAL,e,t)},windowError:function(e,t,n){var o="Error in ("+(t||window.location)+") on line "+n+" with message ("+e+")";this.log(Log4js.Level.FATAL,o,null)},setDateFormat:function(e){this.dateformat=e},getFormattedTimestamp:function(e){return this.dateformatter.formatDate(e,this.dateformat)}},Log4js.CustomEvent=function(){this.listeners=[]},Log4js.CustomEvent.prototype={addListener:function(e){this.listeners.push(e)},removeListener:function(e){for(var t=this.findListenerIndexes(e),n=0;n<t.length;n++)this.listeners.splice(t[n],1)},dispatch:function(e){for(var t=0;t<this.listeners.length;t++)try{this.listeners[t](e)}catch(e){log4jsLogger&&log4jsLogger.warn("Could not run the listener "+this.listeners[t]+". \\n"+e)}},findListenerIndexes:function(e){for(var t=[],n=0;n<this.listeners.length;n++)this.listeners[n]===e&&t.push(n);return t}},Log4js.LoggingEvent=function(e,t,n,o,s){this.startTime=new Date,this.categoryName=e,this.message=n,this.exception=o,this.level=t,this.logger=s},Log4js.LoggingEvent.prototype={getFormattedTimestamp:function(){return this.logger?this.logger.getFormattedTimestamp(this.startTime):this.startTime.toGMTString()}},Log4js.DateFormatter=function(){},Log4js.DateFormatter.DEFAULT_DATE_FORMAT="yyyy-MM-ddThh:mm:ssO",Log4js.DateFormatter.prototype={formatDate:function(e,t){var n=this.addZero(e.getDate()),o=this.addZero(e.getMonth()+1),s=this.addZero(e.getFullYear()),r=this.addZero(e.getFullYear().toString().substring(3,4)),i=-1<t.indexOf("yyyy")?s:r,l=this.addZero(e.getHours()),a=this.addZero(e.getMinutes()),g=this.addZero(e.getSeconds()),h=this.O(e),u=t.replace(/dd/g,n).replace(/MM/g,o).replace(/y{1,4}/g,i);return u=(u=u.replace(/hh/g,l).replace(/mm/g,a).replace(/ss/g,g)).replace(/O/g,h)},formatUTCDate:function(e,t){var n=this.addZero(e.getUTCDate()),o=this.addZero(e.getUTCMonth()+1),s=this.addZero(e.getUTCFullYear()),r=this.addZero(e.getUTCFullYear().toString().substring(3,4)),i=-1<t.indexOf("yyyy")?s:r,l=this.addZero(e.getUTCHours()),a=this.addZero(e.getUTCMinutes()),g=this.addZero(e.getUTCSeconds()),h=t.replace(/dd/g,n).replace(/MM/g,o).replace(/y{1,4}/g,i);return h=h.replace(/hh/g,l).replace(/mm/g,a).replace(/ss/g,g)},addZero:function(e){return(e<10?"0":"")+e},O:function(e){var t=Math.abs(e.getTimezoneOffset()),n=String(Math.floor(t/60)),o=String(t%60);return 1==n.length&&(n="0"+n),1==o.length&&(o="0"+o),e.getTimezoneOffset()<0?"+"+n+o:"-"+n+o}},Log4js.FifoBuffer=function(){this.array=[]},Log4js.FifoBuffer.prototype={push:function(e){return this.array[this.array.length]=e,this.array.length},pull:function(){if(0<this.array.length){for(var e=this.array[0],t=0;t<this.array.length-1;t++)this.array[t]=this.array[t+1];return this.array.length=this.array.length-1,e}return null},length:function(){return this.array.length}},Log4js.Appender=function(){this.logger=null},Log4js.Appender.prototype={doAppend:function(e){},doClear:function(){},setLayout:function(e){this.layout=e},setLogger:function(e){e.onlog.addListener(Log4js.bind(this.doAppend,this)),e.onclear.addListener(Log4js.bind(this.doClear,this)),this.logger=e}},Log4js.AjaxAppender=function(e){this.isInProgress=!1,this.loggingUrl=e||"logging.log4js",this.threshold=1,this.timeout=2e3,this.loggingEventMap=new Log4js.FifoBuffer,this.layout=new Log4js.XMLLayout,this.httpRequest=null},Log4js.AjaxAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.append"),(this.loggingEventMap.length()<=this.threshold||!0===this.isInProgress)&&this.loggingEventMap.push(e),this.loggingEventMap.length()>=this.threshold&&!1===this.isInProgress&&this.send(),log4jsLogger&&log4jsLogger.trace("< AjaxAppender.append")},doClear:function(){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.doClear"),0<this.loggingEventMap.length()&&this.send(),log4jsLogger&&log4jsLogger.trace("< AjaxAppender.doClear")},setThreshold:function(e){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.setThreshold: "+e),this.threshold=e,log4jsLogger&&log4jsLogger.trace("< AjaxAppender.setThreshold")},setTimeout:function(e){this.timeout=e},send:function(){if(0<this.loggingEventMap.length()){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.send"),this.isInProgress=!0;for(var e=[],t=0;t<this.loggingEventMap.length()&&t<this.threshold;t++)e.push(this.layout.format(this.loggingEventMap.pull()));var n=this.layout.getHeader();n+=e.join(this.layout.getSeparator()),n+=this.layout.getFooter();var o=this;null===this.httpRequest&&(this.httpRequest=this.getXmlHttpRequest()),this.httpRequest.onreadystatechange=function(){o.onReadyStateChanged.call(o)},this.httpRequest.open("POST",this.loggingUrl,!0),this.httpRequest.setRequestHeader("Content-type",this.layout.getContentType()),this.httpRequest.setRequestHeader("REFERER",location.href),this.httpRequest.setRequestHeader("Content-length",n.length),this.httpRequest.setRequestHeader("Connection","close"),this.httpRequest.send(n),o=this;try{window.setTimeout(function(){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.timeout"),o.httpRequest.onreadystatechange=function(){},o.httpRequest.abort(),o.isInProgress=!1,0<o.loggingEventMap.length()&&o.send(),log4jsLogger&&log4jsLogger.trace("< AjaxAppender.timeout")},this.timeout)}catch(e){log4jsLogger&&log4jsLogger.fatal(e)}log4jsLogger&&log4jsLogger.trace("> AjaxAppender.send")}},onReadyStateChanged:function(){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.onReadyStateChanged");var e=this.httpRequest;if(4===this.httpRequest.readyState){if(void 0===e.status||0===e.status||200<=e.status&&e.status<300)log4jsLogger&&log4jsLogger.trace("  AjaxAppender.onReadyStateChanged: success"),this.isInProgress=!1;else{var t="  AjaxAppender.onReadyStateChanged: XMLHttpRequest request to URL "+this.loggingUrl+" returned status code "+this.httpRequest.status;log4jsLogger&&log4jsLogger.error(t)}log4jsLogger&&log4jsLogger.trace("< AjaxAppender.onReadyStateChanged: readyState == 4")}else log4jsLogger&&log4jsLogger.trace("< AjaxAppender.onReadyStateChanged: readyState "+e.readyState+" != 4")},getXmlHttpRequest:function(){log4jsLogger&&log4jsLogger.trace("> AjaxAppender.getXmlHttpRequest");var t=!1;try{if(window.XMLHttpRequest)(t=new XMLHttpRequest).overrideMimeType&&t.overrideMimeType(this.layout.getContentType());else if(window.ActiveXObject)try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){t=new ActiveXObject("Microsoft.XMLHTTP")}}catch(e){t=!1}return t||log4jsLogger&&log4jsLogger.fatal("Unfortunately, your browser does not support AjaxAppender for log4js!"),log4jsLogger&&log4jsLogger.trace("< AjaxAppender.getXmlHttpRequest"),t},toString:function(){return"Log4js.AjaxAppender[loggingUrl="+this.loggingUrl+", threshold="+this.threshold+"]"}}),Log4js.MozillaJSConsoleAppender=function(){this.layout=new Log4js.SimpleLayout;try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"),this.jsConsole=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService),this.scriptError=Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError)}catch(e){log4jsLogger&&log4jsLogger.error(e)}},Log4js.MozillaJSConsoleAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"),this.scriptError.init(this.layout.format(e),null,null,null,null,this.getFlag(e),e.categoryName),this.jsConsole.logMessage(this.scriptError)}catch(e){log4jsLogger&&log4jsLogger.error(e)}},toString:function(){return"Log4js.MozillaJSConsoleAppender"},getFlag:function(e){var t;switch(e.level){case Log4js.Level.FATAL:t=2;break;case Log4js.Level.ERROR:t=0;break;case Log4js.Level.WARN:default:t=1}return t}}),Log4js.OperaJSConsoleAppender=function(){this.layout=new Log4js.SimpleLayout},Log4js.OperaJSConsoleAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){opera.postError(this.layout.format(e))},toString:function(){return"Log4js.OperaJSConsoleAppender"}}),Log4js.SafariJSConsoleAppender=function(){this.layout=new Log4js.SimpleLayout},Log4js.SafariJSConsoleAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){window.console.log(this.layout.format(e))},toString:function(){return"Log4js.SafariJSConsoleAppender"}}),Log4js.BrowserConsoleAppender=function(){this.consoleDelegate=null,window.console?this.consoleDelegate=new Log4js.SafariJSConsoleAppender:window.opera?this.consoleDelegate=new Log4js.OperaJSConsoleAppender:netscape?this.consoleDelegate=new Log4js.MozillaJSConsoleAppender:log4jsLogger&&log4jsLogger.error("Unsupported Browser")},Log4js.BrowserConsoleAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){this.consoleDelegate.doAppend(e)},doClear:function(){this.consoleDelegate.doClear()},setLayout:function(e){this.consoleDelegate.setLayout(e)},toString:function(){return"Log4js.BrowserConsoleAppender: "+this.consoleDelegate.toString()}}),Log4js.ConsoleAppender=function(e){this.layout=new Log4js.PatternLayout(Log4js.PatternLayout.TTCC_CONVERSION_PATTERN),this.inline=e,this.accesskey="d",this.tagPattern=null,this.commandHistory=[],this.commandIndex=0,this.popupBlocker=!1,this.outputElement=null,this.docReference=null,this.winReference=null,this.inline&&Log4js.attachEvent(window,"load",Log4js.bind(this.initialize,this))},Log4js.ConsoleAppender.prototype=Log4js.extend(new Log4js.Appender,{setAccessKey:function(e){this.accesskey=e},initialize:function(){if(this.inline)this.docReference=document,this.winReference=window;else{var e=this.makeWinName(this.logger.category);window.top.consoleWindow=window.open("",e,"left=0,top=0,width=700,height=700,scrollbars=no,status=no,resizable=yes;toolbar=no"),window.top.consoleWindow.opener=self;var t=window.top.consoleWindow;if(t){var n=t.document;n.open(),n.write("<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN "),n.write("  http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>\\n\\n"),n.write("<html><head><title>Log4js - "+this.logger.category+"</title>\\n"),n.write('</head><body style="background-color:darkgray"></body>\\n'),t.blur(),t.focus(),this.docReference=n,this.winReference=t}else this.popupBlocker=!0,alert("Popup window manager blocking the Log4js popup window to bedisplayed.\\n\\nPlease disabled this to properly see logged events.")}if(this.outputCount=0,this.tagPattern=".*",this.logElement=this.docReference.createElement("div"),this.docReference.body.appendChild(this.logElement),this.logElement.style.display="none",this.logElement.style.position="absolute",this.logElement.style.left="0px",this.logElement.style.width="100%",this.logElement.style.textAlign="left",this.logElement.style.fontFamily="lucida console",this.logElement.style.fontSize="100%",this.logElement.style.backgroundColor="darkgray",this.logElement.style.opacity=.9,this.logElement.style.zIndex=2e3,this.toolbarElement=this.docReference.createElement("div"),this.logElement.appendChild(this.toolbarElement),this.toolbarElement.style.padding="0 0 0 2px",this.buttonsContainerElement=this.docReference.createElement("span"),this.toolbarElement.appendChild(this.buttonsContainerElement),this.inline){var o=this.docReference.createElement("button");o.style.cssFloat="right",o.style.styleFloat="right",o.style.color="black",o.innerHTML="close",o.onclick=Log4js.bind(this.toggle,this),this.buttonsContainerElement.appendChild(o)}var s=this.docReference.createElement("button");if(s.style.cssFloat="right",s.style.styleFloat="right",s.style.color="black",s.innerHTML="clear",s.onclick=Log4js.bind(this.logger.clear,this.logger),this.buttonsContainerElement.appendChild(s),this.tagFilterContainerElement=this.docReference.createElement("span"),this.toolbarElement.appendChild(this.tagFilterContainerElement),this.tagFilterContainerElement.style.cssFloat="left",this.tagFilterContainerElement.appendChild(this.docReference.createTextNode("Log4js - "+this.logger.category)),this.tagFilterContainerElement.appendChild(this.docReference.createTextNode(" | Level Filter: ")),this.tagFilterElement=this.docReference.createElement("input"),this.tagFilterContainerElement.appendChild(this.tagFilterElement),this.tagFilterElement.style.width="200px",this.tagFilterElement.value=this.tagPattern,this.tagFilterElement.setAttribute("autocomplete","off"),Log4js.attachEvent(this.tagFilterElement,"keyup",Log4js.bind(this.updateTags,this)),Log4js.attachEvent(this.tagFilterElement,"click",Log4js.bind(function(){this.tagFilterElement.select()},this)),this.outputElement=this.docReference.createElement("div"),this.logElement.appendChild(this.outputElement),this.outputElement.style.overflow="auto",this.outputElement.style.clear="both",this.outputElement.style.height=this.inline?"200px":"650px",this.outputElement.style.width="100%",this.outputElement.style.backgroundColor="black",this.inputContainerElement=this.docReference.createElement("div"),this.inputContainerElement.style.width="100%",this.logElement.appendChild(this.inputContainerElement),this.inputElement=this.docReference.createElement("input"),this.inputContainerElement.appendChild(this.inputElement),this.inputElement.style.width="100%",this.inputElement.style.borderWidth="0px",this.inputElement.style.margin="0px",this.inputElement.style.padding="0px",this.inputElement.value="Type command here",this.inputElement.setAttribute("autocomplete","off"),Log4js.attachEvent(this.inputElement,"keyup",Log4js.bind(this.handleInput,this)),Log4js.attachEvent(this.inputElement,"click",Log4js.bind(function(){this.inputElement.select()},this)),this.inline){window.setInterval(Log4js.bind(this.repositionWindow,this),500),this.repositionWindow();var r=this.docReference.createElement("button");r.style.position="absolute",r.style.top="-100px",r.accessKey=this.accesskey,r.onclick=Log4js.bind(this.toggle,this),this.docReference.body.appendChild(r)}else this.show()},toggle:function(){return"none"===this.logElement.style.display?(this.show(),!0):(this.hide(),!1)},show:function(){this.logElement.style.display="",this.outputElement.scrollTop=this.outputElement.scrollHeight,this.inputElement.select()},hide:function(){this.logElement.style.display="none"},output:function(e,t){var n=this.outputElement.scrollTop+2*this.outputElement.clientHeight>=this.outputElement.scrollHeight;this.outputCount++,t=t?t+=";":"",t+="padding:1px;margin:0 0 5px 0",this.outputCount%2==0&&(t+=";background-color:#101010"),e=(e=e||"undefined").toString(),this.outputElement.innerHTML+="<pre style='"+t+"'>"+e+"</pre>",n&&(this.outputElement.scrollTop=this.outputElement.scrollHeight)},updateTags:function(){var e=this.tagFilterElement.value;if(this.tagPattern!==e){try{new RegExp(e)}catch(e){return}this.tagPattern=e,this.outputElement.innerHTML="";for(var t=this.outputCount=0;t<this.logger.loggingEvents.length;t++)this.doAppend(this.logger.loggingEvents[t])}},repositionWindow:function(){var e=window.pageYOffset||this.docReference.documentElement.scrollTop||this.docReference.body.scrollTop,t=self.innerHeight||this.docReference.documentElement.clientHeight||this.docReference.body.clientHeight;this.logElement.style.top=e+t-this.logElement.offsetHeight+"px"},doAppend:function(e){if(!this.popupBlocker&&(this.inline||this.winReference&&!this.winReference.closed||this.initialize(),null===this.tagPattern||-1!==e.level.toString().search(new RegExp(this.tagPattern,"igm")))){var t="";-1!==e.level.toString().search(/ERROR/)?t+="color:red":-1!==e.level.toString().search(/FATAL/)?t+="color:red":-1!==e.level.toString().search(/WARN/)?t+="color:orange":-1!==e.level.toString().search(/DEBUG/)?t+="color:green":-1!==e.level.toString().search(/INFO/)?t+="color:white":t+="color:yellow",this.output(this.layout.format(e),t)}},doClear:function(){this.outputElement.innerHTML=""},handleInput:function(e){if(13===e.keyCode){var command=this.inputElement.value;switch(command){case"clear":this.logger.clear();break;default:var consoleOutput="";try{consoleOutput=eval(this.inputElement.value)}catch(e){this.logger.error("Problem parsing input <"+command+">"+e.message);break}this.logger.trace(consoleOutput)}""!==this.inputElement.value&&this.inputElement.value!==this.commandHistory[0]&&this.commandHistory.unshift(this.inputElement.value),this.commandIndex=0,this.inputElement.value=""}else 38===e.keyCode&&0<this.commandHistory.length?(this.inputElement.value=this.commandHistory[this.commandIndex],this.commandIndex<this.commandHistory.length-1&&(this.commandIndex+=1)):40===e.keyCode&&0<this.commandHistory.length?(0<this.commandIndex&&(this.commandIndex-=1),this.inputElement.value=this.commandHistory[this.commandIndex]):this.commandIndex=0},makeWinName:function(e){return e.replace(/[^\\d\\w]/g,"_")},toString:function(){return"Log4js.ConsoleAppender[inline="+this.inline+"]"}}),Log4js.JSAlertAppender=function(){this.layout=new Log4js.SimpleLayout},Log4js.JSAlertAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){alert(this.layout.getHeader()+this.layout.format(e)+this.layout.getFooter())},toString:function(){return"Log4js.JSAlertAppender"}}),Log4js.MetatagAppender=function(){this.currentLine=0},Log4js.MetatagAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){new Date;for(var t=e.message.split("\\n"),n=document.getElementsByTagName("head")[0],o=1;o<=t.length;o++){var s=t[o-1];s=1===o?e.level.toString()+": "+s:"> "+s;var r=document.createElement("meta");r.setAttribute("name","X-log4js:"+this.currentLine),r.setAttribute("content",s),n.appendChild(r),this.currentLine+=1}},toString:function(){return"Log4js.MetatagAppender"}}),Log4js.WindowsEventAppender=function(){this.layout=new Log4js.SimpleLayout;try{this.shell=new ActiveXObject("WScript.Shell")}catch(e){log4jsLogger&&log4jsLogger.error(e)}},Log4js.WindowsEventAppender.prototype=Log4js.extend(new Log4js.Appender,{doAppend:function(e){var t=4;switch(e.level){case Log4js.Level.FATAL:case Log4js.Level.ERROR:t=1;break;case Log4js.Level.WARN:t=2;break;default:t=4}try{this.shell.LogEvent(t,this.level.format(e))}catch(e){log4jsLogger&&log4jsLogger.error(e)}},toString:function(){return"Log4js.WindowsEventAppender"}}),Log4js.Layout=function(){},Log4js.Layout.prototype={format:function(e){return""},getContentType:function(){return"text/plain"},getHeader:function(){return null},getFooter:function(){return null},getSeparator:function(){return""}},Log4js.BasicLayout=function(){this.LINE_SEP="\\n"},Log4js.BasicLayout.prototype=Log4js.extend(new Log4js.Layout,{format:function(e){return e.categoryName+"~"+e.startTime.toLocaleString()+" ["+e.level.toString()+"] "+e.message+this.LINE_SEP},getContentType:function(){return"text/plain"},getHeader:function(){return""},getFooter:function(){return""}}),Log4js.HtmlLayout=function(){},Log4js.HtmlLayout.prototype=Log4js.extend(new Log4js.Layout,{format:function(e){return'<div style="'+this.getStyle(e)+'">'+e.getFormattedTimestamp()+" - "+e.level.toString()+" - "+e.message+"</div>\\n"},getContentType:function(){return"text/html"},getHeader:function(){return"<html><head><title>log4js</head><body>"},getFooter:function(){return"</body></html>"},getStyle:function(e){return-1!=e.level.toString().search(/ERROR/)?"color:red":-1!=e.level.toString().search(/FATAL/)?"color:red":-1!=e.level.toString().search(/WARN/)?"color:orange":-1!=e.level.toString().search(/DEBUG/)?"color:green":-1!=e.level.toString().search(/INFO/)?"color:white":"color:yellow"}}),Log4js.JSONLayout=function(){this.df=new Log4js.DateFormatter},Log4js.JSONLayout.prototype=Log4js.extend(new Log4js.Layout,{format:function(e){var t="unknown";try{t=navigator.userAgent}catch(e){t="unknown"}var n="unknown";try{n=location.href}catch(e){n="unknown"}var o='{\\n "LoggingEvent": {\\n';return o+='\\t"logger": "'+e.categoryName+'",\\n',o+='\\t"level": "'+e.level.toString()+'",\\n',o+=this.formatMessage(e.message),o+='\\t"referer": "'+n+'",\\n',o+='\\t"useragent": "'+t+'",\\n',o+='\\t"timestamp": "'+this.df.formatUTCDate(e.startTime,"yyyy-MM-ddThh:mm:ssZ")+'",\\n',o+='\\t"exception": "'+e.exception+'"\\n',o+="}}"},formatMessage:function(e){var t="";if("string"==typeof e)t+='\\t"message": "'+e+'",\\n';else if("object"==typeof e){for(var n in"message"in e&&(t+='\\t"message": "'+e.message+'",\\n'),e)if("message"!=n){var o=e[n];if(o instanceof Date)t+='\\t"'+n+'_dt": "'+this.df.formatUTCDate(o,"yyyy-MM-ddThh:mm:ssZ")+'",\\n';else switch(typeof o){case"string":t+='\\t"'+n+'_s": "'+o+'",\\n';break;case"number":t+='\\t"'+n+'_l": '+o+",\\n";break;default:t+='\\t"'+n+'_s": "'+o.toString()+'",\\n'}}}else t+='\\t"message": "'+e.toString()+'",\\n';return t},getContentType:function(){return"application/json"},getHeader:function(){return'{"Log4js": [\\n'},getFooter:function(){return"\\n]}"},getSeparator:function(){return",\\n"}}),Log4js.PatternLayout=function(e){this.pattern=e||Log4js.PatternLayout.DEFAULT_CONVERSION_PATTERN},Log4js.PatternLayout.TTCC_CONVERSION_PATTERN="%r %p %c - %m%n",Log4js.PatternLayout.DEFAULT_CONVERSION_PATTERN="%m%n",Log4js.PatternLayout.ISO8601_DATEFORMAT="yyyy-MM-dd HH:mm:ss,SSS",Log4js.PatternLayout.DATETIME_DATEFORMAT="dd MMM YYYY HH:mm:ss,SSS",Log4js.PatternLayout.ABSOLUTETIME_DATEFORMAT="HH:mm:ss,SSS",Log4js.PatternLayout.prototype=Log4js.extend(new Log4js.Layout,{getContentType:function(){return"text/plain"},getHeader:function(){return null},getFooter:function(){return null},format:function(e){for(var t,n=/%(-?[0-9]+)?(\\.?[0-9]+)?([cdmnpr%])(\\{([^\\}]+)\\})?|([^%]+)/,o="",s=this.pattern;t=n.exec(s);){var r=t[0],i=t[1],l=t[2],a=t[3],g=t[5],h=t[6];if(h)o+=""+h;else{var u,c="";switch(a){case"c":var p=e.categoryName;if(g){var d=parseInt(g,10),L=e.categoryName.split(".");c=d>=L.length?p:L.slice(L.length-d).join(".")}else c=p;break;case"d":var f=Log4js.PatternLayout.ISO8601_DATEFORMAT;g&&("ISO8601"==(f=g)?f=Log4js.PatternLayout.ISO8601_DATEFORMAT:"ABSOLUTE"==f?f=Log4js.PatternLayout.ABSOLUTETIME_DATEFORMAT:"DATE"==f&&(f=Log4js.PatternLayout.DATETIME_DATEFORMAT)),c=new Log4js.SimpleDateFormat(f).format(e.startTime);break;case"m":c=e.message;break;case"n":c="\\n";break;case"p":c=e.level.toString();break;case"r":c=""+e.startTime.toLocaleTimeString();break;case"%":c="%";break;default:c=r}if(l&&(u=parseInt(l.substr(1),10),c=c.substring(0,u)),i)if("-"==i.charAt(0))for(u=parseInt(i.substr(1),10);c.length<u;)c+=" ";else for(u=parseInt(i,10);c.length<u;)c=" "+c;o+=c}s=s.substr(t.index+t[0].length)}return o}}),Log4js.SimpleLayout=function(){this.LINE_SEP="\\n",this.LINE_SEP_LEN=1},Log4js.SimpleLayout.prototype=Log4js.extend(new Log4js.Layout,{format:function(e){return e.level.toString()+" - "+e.message+this.LINE_SEP},getContentType:function(){return"text/plain"},getHeader:function(){return""},getFooter:function(){return""}}),Log4js.XMLLayout=function(){},Log4js.XMLLayout.prototype=Log4js.extend(new Log4js.Layout,{format:function(e){var t="unknown";try{t=navigator.userAgent}catch(e){t="unknown"}var n="unknown";try{n=location.href}catch(e){n="unknown"}var o='<log4js:event logger="';return o+=e.categoryName+'" level="',o+=e.level.toString()+'" useragent="',o+=t+'" referer="',o+=n.replace(/&/g,"&amp;")+'" timestamp="',o+=e.getFormattedTimestamp()+'">\\n',o+="\\t<log4js:message><![CDATA["+this.escapeCdata(e.message)+"]]></log4js:message>\\n",e.exception&&(o+=this.formatException(e.exception)),o+="</log4js:event>\\n"},getContentType:function(){return"text/xml"},getHeader:function(){return'<log4js:eventSet version="'+Log4js.version+'" xmlns:log4js="http://stritti.github.io/log4js//2007/log4js/">\\n'},getFooter:function(){return"</log4js:eventSet>\\n"},getSeparator:function(){return"\\n"},formatException:function(e){if(e){return e.message&&"\\t\\t<log4js:message><![CDATA["+this.escapeCdata(e.message)+"]]></log4js:message>\\n",e.description&&"\\t\\t<log4js:description><![CDATA["+this.escapeCdata(e.description)+"]]></log4js:description>\\n","\\t\\t<log4js:stacktrace>",'\\t\\t\\t<log4js:location fileName="'+e.fileName+'" lineNumber="'+e.lineNumber+'" />',"\\t\\t</log4js:stacktrace>","\\t</log4js:throwable>"}return null},escapeCdata:function(e){return e.replace(/\\]\\]>/,"]]>]]&gt;<![CDATA[")}});var log4jsLogger=Log4js.getLogger("Log4js");log4jsLogger.addAppender(new Log4js.BrowserConsoleAppender),log4jsLogger.setLevel(Log4js.Level.ALL);

var UDALinkScriptloaded = UDALinkScriptloaded || false;
// if(!UDALinkScriptloaded) {
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
    let UDAUserAuthData = {id: null, email: null, restrict_add_delete: false, role: 'default', permissions: null};
    var udaauthdata = {
        set id(val){
            UDAdigestMessage(val, "SHA-512").then(encrypted=>{
                UDAUserAuthData.id = encrypted;
                var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
                document.dispatchEvent(sessionevent);
            });
        },
        get id() {
            return UDAUserAuthData.id;
        },
        set email(val) {
            UDAdigestMessage(val, "SHA-512").then(encrypted=>{
                UDAUserAuthData.email = encrypted;
                var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
                document.dispatchEvent(sessionevent);
            });
        },
        get email() {
            return UDAUserAuthData.email;
        },
        set userRole(val) {
            UDAUserAuthData.role = val;
            var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get userRole() {
            return UDAUserAuthData.role;
        },
        set restrict_add_delete(val) {
            UDAUserAuthData.restrict_add_delete = val;
            var sessionevent = new CustomEvent("UDADisableButton", {detail: {data: "UDADisableButton"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get restrict_add_delete() {
            return UDAUserAuthData.restrict_add_delete;
        },
        set permissions(val) {
            UDAUserAuthData.permissions = val;
        },
        get permissions() {
            return UDAUserAuthData.permissions;
        }
    };
    let UDACustomCss = {
        src:'',
        loaded: false,
        set url(val) {
            this.src = val;
            var cssevent = new CustomEvent("UDALoadCustomCSS", {detail: {data: "UDALoadCustomCSS"}, bubbles: false, cancelable: false});
            document.dispatchEvent(cssevent);
            this.loaded = true;
        },
        get url(){
            return this.src;
        }
    };

    let UDAClickObjects = [];
    let UDASessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const UDADebug = false; //this variable exists in background.js file also
    const UDA_POST_INTERVAL = 1000; //in milliseconds, each minute
    let UDA_DOMAIN = "https://udantest.nistapp.ai";
    let UDA_API_URL = (UDADebug) ? "http://localhost:11080/voiceapi" : UDA_DOMAIN+"/voiceapi"; //this variable exists in background.js file also
    const UDA_Environment = {
        current:'TEST',
        set Environment(value) {
            this.current = value.toString().toUpperCase();
            if(this.current==='PROD'){
                UDA_DOMAIN = "https://udan.nistapp.ai";
            } else {
                UDA_DOMAIN = "https://udantest.nistapp.ai";
            }
            UDA_API_URL = UDA_DOMAIN+"/voiceapi";
        },
        get Environment() {
            return this.current;
        }
    };
    const EXTENSION_VERSION = true;
    let UDAIgnorePatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
    let UDASitePatterns = [];
    let UDARemovedClickObjects = [];
    let UDALastMutationTime = 0;
    let UDALastIndexTime = 0;
    let UDALogLevel = 0;

    /****
     * Initializing logger script
     */
    /*let UDAConsoleLogger = new Log4js.getLogger("consolelogger");
    UDAConsoleLogger.setLevel(Log4js.Level.INFO);
    let UDAConsoleAppender = new Log4js.ConsoleAppender(true);
    UDAConsoleLogger.addAppender(UDAConsoleAppender);*/
    // UDAConsoleLogger.addAppender(new Log4js.ConsoleAppender(true));

    let UDALog4jsLogger = new Log4js.getLogger("errorlogger");
    UDALog4jsLogger.setLevel(Log4js.Level.OFF); // do not change this loglevel for performance reasons
    let UDAAjaxAppender = new Log4js.AjaxAppender(UDA_DOMAIN+'/logging/error');
    UDAAjaxAppender.setLayout(new Log4js.JSONLayout());
    UDALog4jsLogger.addAppender(UDAAjaxAppender);

    let UDAConsoleLogger = {
        info: function(mes, level = 1) {
            if(UDALogLevel === level){
                console.log(mes);
            }
        }
    };

    let UDAErrorLogger = {
        error: function (message, exception){
            message = 'UserID: '+ UDAUserAuthData.id+' Error: '+message;
            UDALog4jsLogger.error(message, exception);
        }
    };


    /*****
     *
     * Browser detect code starts
     * Extracted the code from https://github.com/pure-js/browser-detection/blob/master/src/browser-detection.js
     *
     */

    var UDABrowserCheck = {
        /**
         * Detects Chrome browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isChrome: function (userAgent) {
            return userAgent.includes('Chrome') &&
                !userAgent.includes('Chromium') &&
                !userAgent.includes('OPR') &&
                !userAgent.includes('Edge') &&
                !userAgent.includes('Edg') &&
                !userAgent.includes('SamsungBrowser');
        },

        /**
         * Detects Safari browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isSafari: function (userAgent) {
            return userAgent.includes('Safari') &&
                !userAgent.includes('Chrome') &&
                !userAgent.includes('Chromium') &&
                !userAgent.includes('Edg') &&
                !userAgent.includes('Android');
        },

        /**
         * Detects UC browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isUCBrowser: function (userAgent) {
            return userAgent.includes('UCBrowser');
        },

        /**
         * Detects Firefox browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isFirefox: function (userAgent) {
            return userAgent.includes('Firefox') && !userAgent.includes('Seamonkey');
        },

        /**
         * Detects IE browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isIE: function (userAgent) {
            return (/trident/i.test(userAgent));
        },

        /**
         * Detects Opera browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isOpera: function (userAgent) {
            return userAgent.includes('OPR');
        },

        /**
         * Detects Samsung browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isSamsungInternet: function (userAgent) {
            return userAgent.includes('SamsungBrowser');
        },

        /**
         * Detects Android browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isAndroidBrowser: function (userAgent) {
            return userAgent.includes('Android') &&
                !userAgent.includes('Chrome') &&
                userAgent.includes('AppleWebKit');
        },

        /**
         * Detects Edge browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isEdge: function (userAgent) {
            return userAgent.match(/\\b(Edge|Edgios|Edga|Edg)\\/(\\d+)/);
            // return ((userAgent.includes('Edge') || userAgent.includes('Edgeios') || userAgent.includes('Edga') || userAgent.includes('Edg')) && userAgent.includes('Chrome'));
        },

        /**
         * Detects browser name
         * @param {string} userAgent - window.navigator
         * @return {string} browser name
         */
        detectBrowserName: function (userAgent) {
            if (this.isChrome(userAgent)) return 'Chrome';
            if (this.isSafari(userAgent)) return 'Safari';
            if (this.isUCBrowser(userAgent)) return 'UC Browser';
            if (this.isFirefox(userAgent)) return 'Firefox';
            if (this.isIE(userAgent)) return 'IE';
            if (this.isOpera(userAgent)) return 'Opera';
            if (this.isSamsungInternet(userAgent)) return 'Samsung Internet';
            if (this.isAndroidBrowser(userAgent)) return 'Android Browser';
            if (this.isEdge(userAgent)) return 'Edge';
        },

        /**
         * Retrieve browser version
         * @param {string} name
         * @param {string} str
         * @return {number} browser version
         */
        retrieveVersion: function (name, str) {
            name = name + '/';
            const start = str.indexOf(name);
            let preNum = str.substring(start + name.length);
            const index = preNum.indexOf(' ');
            if (index > 0) preNum = preNum.substring(0, index);
            let end;

            if (preNum.indexOf('.', 2) > 0) {
                end = preNum.indexOf('.', 2);
            } else {
                end = preNum.indexOf('.', 1);
            }

            const num = preNum.substring(0, end);
            return Number(num);
        },

        /**
         * Returns Association
         * @param {string} name
         * @return {string} browser name
         */
        getBeautifulName: function (name) {
            let browserName;
            switch (name) {
                case 'Opera':
                    browserName = 'OPR';
                    break;

                case 'UC Browser':
                    browserName = 'UCBrowser';
                    break;

                case 'Samsung Internet':
                    browserName = 'SamsungBrowser';
                    break;
            }
            return browserName;
        },

        /**
         * Detects browser version
         * @param {object} nav
         * @param {string} name
         * @return {number} browser version
         */
        detectBrowserVersion: function (nav, name) {
            const {userAgent} = nav;

            switch (name) {
                case 'IE': {
                    const temp = /\\brv[ :]+(\\d+)/g.exec(userAgent) || [];
                    return Number(temp[1]) || null;
                }

                case 'Edge': {
                    const temp = userAgent.match(/\\b(Edge|Edgios|Edga|Edg)\\/(\\d+)/);
                    return Number(temp[2]);
                }
            }

            const browserName = this.getBeautifulName(name);

            if (browserName) return this.retrieveVersion(browserName, userAgent);

            let found = userAgent.match(
                /(opera|chrome|safari|firefox|msie|trident(?=\\/))\\/?\\s*(\\d+)/i
            ) || [];

            found = found[2] ? [found[1],
                found[2]] : [nav.appName, nav.appVersion, '-?'];

            let temp;
            if ((temp = userAgent.match(/version\\/(\\d+)/i))
                !== null) found.splice(1, 1, temp[1]);

            return Number(found[1]);
        },

        /**
         * Detects browser name & version
         * @param {object} nav
         * @return {object} browser name & version
         */
        detectBrowserNameAndVersion: function (nav) {
            const name = this.detectBrowserName(nav.userAgent);

            return {
                name: name,
                version: this.detectBrowserVersion(nav, name),
            };
        }
    }
    /****
     *
     * Broswer detect code ends
     *
     */

    let UDABrowserName = UDABrowserCheck.detectBrowserNameAndVersion(navigator);
    let UDAAllowedBrowsers = ['chrome','edge'];
    let isUDAAllowed = UDAAllowedBrowsers.indexOf(UDABrowserName.name.toLowerCase());

    if (isUDAAllowed < 0) {
        UDAConsoleLogger.info('UDA links script not loaded');
    } else {

        // adding the click object that is registered via javascript
        EventTarget.prototype.addEventListener = function (addEventListener) {
            return function () {
                if (arguments[0] === "click") {
                    UDAAddNewElement(this);
                }
                addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
            }
        }(EventTarget.prototype.addEventListener);

        // adding the clickobjects that were identified.
        function UDAAddNewElement(node) {
            try {
                let clickObject = {element: node}

                //checking whether the element is window or not
                if (clickObject.element === window) {
                    return;
                }

                let tag = clickObject.element.tagName;
                if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
                    return;
                }

                if (clickObject.element.hasAttribute && clickObject.element.hasAttribute('nist-voice')) {
                    return;
                }

                for (var i = 0; i < UDAClickObjects.length; i++) {
                    if (UDAClickObjects[i].element.isSameNode(clickObject.element)) {
                        //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
                        return;
                    }
                }

                clickObject.id = UDAClickObjects.length;
                UDAClickObjects.push(clickObject);
            } catch (e) {
                let htmlelement = node.element.innerHTML;
                UDAErrorLogger.error('Unable to process clickable object - '+htmlelement, e);
            }
        }

        // processing node from mutation and then send to clickbojects addition
        function UDAProcessNode(node) {
            var processchildren = true;

            if (node.onclick != undefined) {
                UDAAddNewElement(node);
            }

            // switched to switch case condition from if condition
            if (node.tagName) {
                switch (node.tagName.toLowerCase()) {
                    case 'a':
                        if (node.href !== undefined) {
                            UDAAddNewElement(node);
                        }
                        break;
                    case 'input':
                    case 'textarea':
                    case 'option':
                    case 'select':
                        UDAAddNewElement(node);
                        break;
                    case 'button':
                        if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                            UDAAddNewElement(node);
                        } else if (node.hasAttribute('type') && node.getAttribute('type') === 'submit') {
                            UDAAddNewElement(node);
                        } else if (node.classList && (node.classList.contains('expand-button') || node.classList.contains('btn-pill'))) {
                            UDAAddNewElement(node);
                        } else {
                            UDAConsoleLogger.info({node: node});
                        }
                        break;
                    case 'span':
                        if (node.classList && node.classList.contains('select2-selection')) {
                            UDAAddNewElement(node);
                        } else if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')){
                            UDAAddNewElement(node);
                        }
                        break;
                    // fix for editor issue
                    case 'ckeditor':
                        UDAAddNewElement(node);
                        break;
                    case 'div':
                        if(node.hasAttribute('ng-click') || node.hasAttribute('onclick')){
                            UDAAddNewElement(node);
                        }
                        break;
                }
            }

            if (node.classList && node.classList.contains("dropdown-toggle")) {
                UDAAddNewElement(node);
            }

            if (node.children && processchildren) {
                for (var i = 0; i < node.children.length; i++) {
                    UDAProcessNode(node.children[i]);
                }
            }
        }

        // removal of clickbojects via mutation observer
        function UDAProcessRemovedNode(node) {
            for (var j = 0; j < UDAClickObjects.length; j++) {
                if (node.isEqualNode(UDAClickObjects[j].element)) {
                    let addtoremovenodes = true;
                    removedclickobjectcounter:
                        for (var k = 0; k < UDARemovedClickObjects.length; k++) {
                            if (node.isEqualNode(UDARemovedClickObjects[k].element)) {
                                addtoremovenodes = false;
                                break;
                            }
                        }
                    if (addtoremovenodes) {
                        UDARemovedClickObjects.push(UDAClickObjects[j]);
                    }
                    UDAClickObjects.splice(j, 1);
                    break;
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    UDAProcessRemovedNode(node.children[i]);
                }
            }
        }

        //mutation observer initialization and adding the logic to process the clickobjects
        var dsa_observer = new MutationObserver(function (mutations) {
            // UDAConsoleLogger.info('------------ detected clicked objects-------------');
            // UDAConsoleLogger.info(UDAClickObjects);
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) {
                    [].some.call(mutation.removedNodes, UDAProcessRemovedNode);
                }
                if (!mutation.addedNodes.length) {
                    return;
                }
                [].some.call(mutation.addedNodes, UDAProcessNode);
            });
            // UDAConsoleLogger.info('------------ removed clicked objects-------------');
            // UDAConsoleLogger.info(UDAClickObjects);
            UDALastMutationTime = Date.now();
        });

        // starting the mutation observer
        dsa_observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
// }
`;

(document.head || document.documentElement).appendChild(s);
