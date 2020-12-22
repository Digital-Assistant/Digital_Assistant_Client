let dsaClickObjects = [];
let dsaSessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const voicedebug = false; //this variable exists in background.js file also
const DSA_POST_INTERVAL = 1000; //in milliseconds, each minute
const DSA_API_URL = (voicedebug) ? "http://localhost:11080/voiceapi" : "https://voicetest.nistapp.com/voiceapi"; //this variable exists in background.js file also
const EXTENSION_VERSION = true;
let ignorepatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
let sitepatterns = [];
let udaauthdata={id:null,email: null};
let removedclickobjects=[];
let lastmutationtime = 0;
let lastindextime=0;
let logLevel = 0;

// adding the click object that is registered via javascript
EventTarget.prototype.addEventListener = function (addEventListener) {
    return function () {
        if (arguments[0] === "click") {
            dsaAddNewElement(this);
        }
        addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
    }
}(EventTarget.prototype.addEventListener);

// adding the clickobjects that were identified.
function dsaAddNewElement(node) {
    let clickObject = {element: node}

    //checking whether the element is window or not
    if (clickObject.element === window) {
        return;
    }

    let tag = clickObject.element.tagName;
    if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
        return;
    }

    if(clickObject.element.hasAttribute && clickObject.element.hasAttribute('nist-voice')){
        return;
    }

    for (var i = 0; i < dsaClickObjects.length; i++) {
        if (dsaClickObjects[i].element.isSameNode(clickObject.element)) {
            //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
            return;
        }
    }

    clickObject.id = dsaClickObjects.length;
    dsaClickObjects.push(clickObject);
}

// processing node from mutation and then send to clickbojects addition
function dsaProcessNode(node) {
    var processchildren = true;

    if (node.onclick != undefined) {
        dsaAddNewElement(node);
    }

    // switched to switch case condition from if condition
    if (node.tagName) {
        switch (node.tagName.toLowerCase()) {
            case 'a':
                if(node.href !== undefined){
                    dsaAddNewElement(node);
                }
                break;
            case 'input':
            case 'textarea':
            case 'option':
            case 'select':
                dsaAddNewElement(node);
                break;
            case 'button':
                if(node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                    dsaAddNewElement(node);
                } else if (node.hasAttribute('type') && node.getAttribute('type') === 'submit') {
                    dsaAddNewElement(node);
                } else if (node.classList && (node.classList.contains('expand-button') || node.classList.contains('btn-pill'))) {
                    dsaAddNewElement(node);
                } else {
                    if (logLevel > 0) {
                        console.log({node: node});
                    }
                }
                break;
            case 'span':
                if (node.classList && node.classList.contains('select2-selection')) {
                    dsaAddNewElement(node);
                }
                break;
            // fix for editor issue
            case 'ckeditor':
                dsaAddNewElement(node);
                break;
            case 'p':
                console.log(node);
                break;
        }
    }

    if(node.classList && node.classList.contains("dropdown-toggle")){
        dsaAddNewElement(node);
    }

    if (node.children && processchildren) {
        for (var i = 0; i < node.children.length; i++) {
            dsaProcessNode(node.children[i]);
        }
    }
}

// removal of clickbojects via mutation observer
function dsaProcessRemovedNode(node) {
    for (var j = 0; j < dsaClickObjects.length; j++) {
        if (node.isEqualNode(dsaClickObjects[j].element)){
            let addtoremovenodes=true;
            removedclickobjectcounter:
                for(var k=0;k<removedclickobjects.length;k++){
                    if(node.isEqualNode(removedclickobjects[k].element)){
                        addtoremovenodes=false;
                        break;
                    }
                }
            if(addtoremovenodes) {
                removedclickobjects.push(dsaClickObjects[j]);
            }
            dsaClickObjects.splice(j, 1);
            break;
        }
    }
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            dsaProcessRemovedNode(node.children[i]);
        }
    }
}

//mutation observer initialization and adding the logic to process the clickobjects
var dsa_observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length) {
            if(logLevel > 1) {
                console.log(dsaClickObjects);
            }
            [].some.call(mutation.removedNodes, dsaProcessRemovedNode);
            if(logLevel > 1) {
                console.log(removedclickobjects);
            }
        }
        if (!mutation.addedNodes.length) {
            return;
        }
        [].some.call(mutation.addedNodes, dsaProcessNode);
    });
    lastmutationtime=Date.now();
});

// starting the mutation observer
dsa_observer.observe(document, {
    childList: true,
    subtree: true
});
