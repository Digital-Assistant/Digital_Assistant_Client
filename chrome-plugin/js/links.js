let clickObjects = [];
let sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const voicedebug = true; //this variable exists in background.js file also
const POST_INTERVAL = 1000; //in milliseconds, each minute
const API_URL = (voicedebug) ? "http://localhost:11080/voiceapi" : "https://voicetest.nistapp.com/voiceapi"; //this variable exists in background.js file also
const EXTENSION_VERSION = true;
let ignorepatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
let sitepatterns = [];
let udaauthdata={id:null,email: null};
let removedclickobjects=[];
let lastmutationtime = 0;
let lastindextime=0;

// adding the click object that is registered via javascript
EventTarget.prototype.addEventListener = function (addEventListener) {
    return function () {
        if (arguments[0] === "click") {
            let newClickObject = {element: this};
            addNewElement(newClickObject);
        }
        addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
    }
}(EventTarget.prototype.addEventListener);

// Duplicating original eventlistner prototype
HTMLElement.prototype.realAddEventListener = HTMLAnchorElement.prototype.addEventListener;

// Modifying the original event listner function
HTMLElement.prototype.addEventListener = function (a, b, c) {
    this.realAddEventListener(a, b, c);
    if (a === "click") {
        let newClickObject = {element: this};
        addNewElement(newClickObject);
    }
};

// adding the clickobjects that were identified.
function addNewElement(clickObject) {
    //checking whether the element is window or not
    if (clickObject.element === window) {
        return;
    }

    let tag = clickObject.element.tagName;
    if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
        return;
    }

    for (var i = 0; i < clickObjects.length; i++) {
        if (clickObjects[i].element === clickObject.element) {
            //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
            return;
        }
    }

    clickObject.id = clickObjects.length;
    clickObjects.push(clickObject);
}

// processing node from mutation and then send to clickbojects addition
function processNode(node) {
    var processchildren = true;
    if (node.onclick != undefined) {
        let newClickObject = {element: node};
        addNewElement(newClickObject);
    }

    // switched to switch case condition from if condition
    if (node.tagName) {
        let newClickObject = {element: node};
        switch (node.tagName.toLowerCase()) {
            case 'a':
                if(node.href !== undefined){
                    addNewElement(newClickObject);
                }
                break;
            case 'input':
            case 'textarea':
            case 'option':
            case 'select':
                addNewElement(newClickObject);
                break;
        }
    }

    if(node.classList && node.classList.contains("dropdown-toggle")){
        let newClickObject = {element: node};
        addNewElement(newClickObject);
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
        if (node.isEqualNode(clickObjects[j].element)){
            let addtoremovenodes=true;
            removedclickobjectcounter:
            for(var k=0;k<removedclickobjects.length;k++){
                if(node.isEqualNode(removedclickobjects[k].element)){
                    addtoremovenodes=false;
                    break removedclickobjectcounter;
                }
            }
            if(addtoremovenodes) {
                removedclickobjects.push({element: clickObjects[j].element});
            }
            clickObjects.splice(j, 1);
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
    mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length) {
            [].some.call(mutation.removedNodes, processRemovedNode);
        }
        if (!mutation.addedNodes.length) {
            return;
        }
        [].some.call(mutation.addedNodes, processNode);
    });
    lastmutationtime=Date.now();
});

// starting the mutation observer
observer.observe(document, {
    childList: true,
    subtree: true
});
