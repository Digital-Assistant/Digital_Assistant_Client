let clickObjects = [];
let sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let lastPostTime = 0;
let lastPostCount = 0;
var voicedebug = false;
const POST_INTERVAL = 1000; //in milliseconds, each minute
const API_URL = (voicedebug) ? "http://localhost:11080/voiceapi" : "https://voicetest.nistapp.com/voiceapi";
const EXTENSION_VERSION = true;
let newclickObjects = [];
let addedbymutations = false;
let startmutationslistner = false;
let ignorepatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
let sitepatterns = [];
let totalclickobjects=0;
let processingtime=Date.now();
let starttime=Date.now();
let processcount=0;
let postmessage=false;
let udaauthdata={id:null,email: null};
// console.log(window.location.host);
/*var xhr = new XMLHttpRequest();
var domain=window.location.host;
xhr.open("GET", API_URL+"/domain/patterns?domain="+domain);
// xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.onload = function(event){
  if(xhr.status == 200){
    console.log(xhr.response);
    sitepatterns=xhr.response;
  } else {
    console.log(xhr.status+" : "+xhr.statusText);
  }
};
xhr.send`();*/
/*
if(window.location.host=="mail.google.com") {
  sitepatterns = [
    {"patterntype": "role", "patternvalue": "tab"},
    {"patterntype": "role", "patternvalue": "button"},
    {"patterntype": "role", "patternvalue": "menuitem"},
    {"patterntype": "role", "patternvalue": "link"},
    {"patterntype": "act", "patternvalue": "any"},
    {"patterntype": "jsaction", "patternvalue": "any"}
  ];
} else if (window.location.host=="www.linkedin.com"){
  sitepatterns = [
    {"patterntype": "data-control-name", "patternvalue": "any"}
  ];
}
*/

// adding the click object that is registered via javascript
EventTarget.prototype.addEventListener = function (addEventListener) {
    return function () {
        if (arguments[0] === "click") {
            let newClickObject = {element: this, action: arguments[1]};
            addNewElement(newClickObject);
            // processNode(newClickObject);
        }
        addEventListener.call(this, arguments[0], arguments[1], arguments[2]);

    }
}(EventTarget.prototype.addEventListener);


// Duplicating original eventlistner prototype
/*HTMLElement.prototype.realAddEventListener = HTMLAnchorElement.prototype.addEventListener;

// Modifying the original event listner function
HTMLElement.prototype.addEventListener = function (a, b, c) {
    this.realAddEventListener(a, b, c);
    if (a === "click") {
        let newClickObject = {element: this, action: b};
        addNewElement(newClickObject);
    }
};*/

// adding the clickobjects that were identified.
function addNewElement(clickObject) {
    /*
    if(clickObject.element){
      var node=clickObject.element;
      if(node.hasAttribute("nist-voice") && node.getAttribute("nist-voice")=="true"){
        return;
      }
    }
    */
    if (clickObject.element === window) {
        return;
    }

    let tag = clickObject.element.tagName;
    if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
        return;
    }

    for (var i = 0; i < clickObjects.length; i++) {
        if (clickObjects[i].element === clickObject.element) {//todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
            return;
        }
    }
    clickObject.text = clickObject.element.innerText;
    if (clickObject.text === undefined || clickObject.text.length === 0) {
        //return;
    }
    clickObject.id = clickObjects.length;
    clickObjects.push(clickObject);
    if (startmutationslistner) {
        newclickObjects.push(clickObject);
    }
    processingtime=Date.now();
    processcount++;
}

// processing node from mutation and then send to clickbojects addition
function processNode(node) {
    var processchildren = true;
    if (node.onclick != undefined) {
        let newClickObject = {element: node, action: node.onclick};
        addNewElement(newClickObject);
        //return;
    }
    if (node.tagName && node.tagName.toLowerCase() === "a" && node.href !== undefined) {
        let newClickObject = {element: node, action: null};
        addNewElement(newClickObject);
        //return;
    }
    if (node.tagName && node.tagName.toLowerCase() === "input") {
        let newClickObject = {element: node, action: null};
        // console.log(node);
        addNewElement(newClickObject);
    }
    if (node.tagName && node.tagName.toLowerCase() === "textarea") {
        let newClickObject = {element: node, action: null};
        addNewElement(newClickObject);
        //return;
    }
    if (node.tagName && node.tagName.toLowerCase() === "option") {
        let newClickObject = {element: node, action: null};
        addNewElement(newClickObject);
        //return;
    }
    if (node.tagName && node.tagName.toLowerCase() === "select") {
        let newClickObject = {element: node, action: null};
        addNewElement(newClickObject);
        //return;
    }

    if(node.classList && node.classList.contains("dropdown-toggle")){
        let newClickObject = {element: node, action: null};
        addNewElement(newClickObject);
    }

    /*
    if(node.hasAttribute("data-toggle") && node.getAttribute("data-toggle")=="dropdown"){
        let newClickObject = {element:node,action:null};
        addNewElement(newClickObject);
    }
    */
    // console.log({processingnode:node});
    if (node.nodeType === Node.ELEMENT_NODE) {
        var addtoclick = false;
        if (sitepatterns.length > 0 && node.attributes.length > 0) {
            for (var attributeindex = 0; attributeindex < node.attributes.length; attributeindex++) {
                var attributemap = node.attributes[attributeindex];

                /*if (node.hasOwnProperty(sitepattern.patterntype) && node.getAttribute(sitepattern.patterntype) == sitepattern.patternvalue) {
                  let newClickObject = {element: node, action: null};
                  addNewElement(newClickObject);
                }*/

                for (var sitepatternindex = 0; sitepatternindex < sitepatterns.length; sitepatternindex++) {
                    var sitepattern = sitepatterns[sitepatternindex];
                    if (attributemap.nodeName === sitepattern.patterntype && (attributemap.nodeValue === sitepattern.patternvalue || sitepattern.patternvalue === "any")) {
                        addtoclick = true;
                    }
                }

                for (var ignorenodeindex = 0; ignorenodeindex < ignorepatterns.length; ignorenodeindex++) {
                    var ignorenodemap = ignorepatterns[ignorenodeindex];
                    if (attributemap.nodeName.toString().toLowerCase() === ignorenodemap.patterntype.toLowerCase() && (attributemap.nodeValue.toString().toLowerCase() === ignorenodemap.patternvalue.toString().toLowerCase() || ignorenodemap.patternvalue.toString().toLowerCase() === "any")) {
                        // console.log(attributemap.nodeName);
                        // console.log(ignorenodemap.patterntype);
                        // console.log("ignore pattern found not adding to click object");
                        processRemovedNode(node);
                        processchildren = false;
                        addtoclick = false;
                    }
                }
            }
            if (addtoclick) {
                // console.log("found pattern object");
                let newClickObject = {element: node, action: null};
                addNewElement(newClickObject);
            }
        }
    } else {
        // console.log({processingnode:node});
    }

    if (node.children && processchildren) {
        for (var i = 0; i < node.children.length; i++) {
            processNode(node.children[i]);
        }
    }
}

// removal of clickbojects via mutation observer
function processRemovedNode(node) {
    for (var j = 0; j < clickObjects.length; j++) {
        if (node === clickObjects[j].element) {
            clickObjects.splice(j, 1);
            processcount--;
            break;
        }
    }
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            processRemovedNode(node.children[i]);
        }
    }
}

//mutation observer initialization and adding the logic to process the clickobjects
var observer = new MutationObserver(function (mutations) {
    // console.log(mutations);

    mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length) {
            [].some.call(mutation.removedNodes, processRemovedNode);
            //console.log(clickObjects);
        }
        if (!mutation.addedNodes.length) {
            return;
        }
        if (startmutationslistner) {
            addedbymutations = true;
        }
        // console.log(mutation.addedNodes);
        // processNode(mutation.target) || [].some.call(mutation.addedNodes, processNode);
        [].some.call(mutation.addedNodes, processNode);
    });
});

// starting the mutation observer
observer.observe(document, {
    childList: true,
    subtree: true
});

function init() {
    let nodes = document.querySelector("*");
    [].some.call(nodes, processNodes);
}

// invoking the clickobject click call currently not using
function invokeById(id) {
    if (clickObjects[id] !== undefined && clickObjects[id] != null) {
        if (clickObjects[id].action) {
            clickObjects[id].action.call(clickObjects[id].element);
        } else {
            if (clickObjects[id].element.href) {
                window.location.href = clickObjects[id].element.href;
            }
            clickObjects[id].element.focus();
            //clickObjects[id].element.click();
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true);
            clickObjects[id].element.dispatchEvent(event);
        }
    }
}

// trying to get the text label of the processing node.
function getNodeLabel(node) {
    // return "";
    var text = node.innerText;
    if (node.offsetWidth === 0 || node.offsetHeight === 0) {
        return "";
    }
    if (node.style && node.visibility === "hidden") {
        return "";
    }
    if (text === undefined || text.length === 0) {
        text = node.getAttribute('placeholder');
    }
    if (text === undefined || text.length === 0) {
        text = node.getAttribute('alt');
    }
    if (text === undefined || text.length === 0) {
        if (node.parentNode) {
            return getNodeLabel(node.parentNode);
        } else {
            return "";
        }
    }
    return text;
}

// sending the available click objects to the sdk
function doPost() {
    // console.log("---checking count-------");
    // console.log(processcount);
    // console.log(lastPostCount);
    // console.log(clickObjects.length);
    var reindexevent;
    var indexevent;
    if (postmessage && Date.now() - lastPostTime >= POST_INTERVAL && (lastPostCount != clickObjects.length || processcount != lastPostCount)) {
    // if(postmessage && (lastPostCount != clickObjects.length)){

        console.log("start time: " + processingtime);
        console.log("Stop time: " + processingtime);
        console.log("Total time: " + (processingtime - starttime) / 1000);

        if (startmutationslistner !== true) {
            console.log("sending nodes index message");
            indexevent = new CustomEvent("Indexnodes", {
                detail: {data: "indexclicknodes"},
                bubbles: false,
                cancelable: false
            });
            document.dispatchEvent(indexevent);
            lastPostTime = Date.now();
            lastPostCount = clickObjects.length;
        } else if (startmutationslistner && newclickObjects.length > 0) {
            console.log("sending new nodes index message");
            reindexevent = new CustomEvent("Indexnodes", {
                detail: {data: "indexnewclicknodes"},
                bubbles: false,
                cancelable: false
            });
            document.dispatchEvent(reindexevent);
            lastPostTime = Date.now();
            lastPostCount = newclickObjects.length;
            // lastPostCount = clickObjects.length;
        }
        // console.log(clickObjects);
    }
}

// commenting the below functionality as it is going to infinite loop.
// sending the data to the sdk for every interval time that is mentioned in the Post interval variable
setInterval(function () {
    doPost();
}, POST_INTERVAL);

function test() {
    invokeById(2);
}

//setTimeout(function(){test();},3000);
/*
document.addEventListener("beforescriptexecute", modifybodyhtml, true);
function modifybodyhtml(){
    console.log("check");
    var bodyhtml=document.body.innerHTML;
    var html='<div id="nistBtn" nist-voice="true"></div><div id="original-content">'+bodyhtml+'</div><div id="steps-content" style="display: none;"><div id="voicemodalhtml" nist-voice="true"></div></div>';
    document.body.innerHTML=html;
}*/
