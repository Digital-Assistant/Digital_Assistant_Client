// processing node from mutation and then send to clickbojects addition
import {AddToClickObjects} from "./addToClickObject";

export const UDAProcessNode= (node) => {
    let processChildren = true;

    if (node.onclick !== undefined) {
        AddToClickObjects(node);
    }

    // switched to switch case condition from if condition
    if (node.tagName) {
        switch (node.tagName.toLowerCase()) {
            case 'a':
                if (node.href !== undefined) {
                    AddToClickObjects(node);
                }
                break;
            case 'input':
            case 'textarea':
            case 'option':
            case 'select':
                AddToClickObjects(node);
                break;
            case 'button':
                if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                    AddToClickObjects(node);
                } else if (node.hasAttribute('type') && node.getAttribute('type') === 'submit') {
                    AddToClickObjects(node);
                } else if (node.classList && (node.classList.contains('expand-button') || node.classList.contains('btn-pill'))) {
                    AddToClickObjects(node);
                } else {
                    // UDAConsoleLogger.info({node: node});
                }
                break;
            case 'span':
                if (node.classList && node.classList.contains('select2-selection')) {
                    AddToClickObjects(node);
                } else if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')){
                    AddToClickObjects(node);
                }
                break;
            // fix for editor issue
            case 'ckeditor':
                AddToClickObjects(node);
                break;
            case 'div':
                if(node.hasAttribute('ng-click') || node.hasAttribute('onclick')){
                    AddToClickObjects(node);
                }
                break;
        }
    }

    if (node.classList && node.classList.contains("dropdown-toggle")) {
        AddToClickObjects(node);
    }

    if (node.children && processChildren) {
        for (let i = 0; i < node.children.length; i++) {
            UDAProcessNode(node.children[i]);
        }
    }
}

// removal of clickObjects via mutation observer
export const UDAProcessRemovedNode = (node) => {
    for (let j = 0; j < UDAClickObjects.length; j++) {
        if (node.isEqualNode(UDAClickObjects[j].element)) {
            let addToRemoveNodes = true;
            for (let k = 0; k < UDARemovedClickObjects.length; k++) {
                if (node.isEqualNode(UDARemovedClickObjects[k].element)) {
                    addToRemoveNodes = false;
                    break;
                }
            }
            if (addToRemoveNodes) {
                UDARemovedClickObjects.push(UDAClickObjects[j]);
            }
            UDAClickObjects.splice(j, 1);
            break;
        }
    }
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            UDAProcessRemovedNode(node.children[i]);
        }
    }
}
