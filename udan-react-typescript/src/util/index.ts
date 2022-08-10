// import {UDAConsoleLogger, UDAErrorLogger} from '../config/error-log';

const UDAClickObjects: any = [];
const UDARemovedClickObjects: any = [];

// adding the clickobjects that were identified.
export function UDAAddNewElement(node: HTMLElement) {
  try {
    const clickObject: any = {element: node};

    // checking whether the element is window or not
    if (clickObject.element === window) {
      return;
    }

    const tag = clickObject.element.tagName;
    if (
      tag &&
			(tag.toLowerCase() === 'body' ||
				tag.toLowerCase() === 'document' ||
				tag.toLowerCase() === 'window' ||
				tag.toLowerCase() === 'html')
    ) {
      return;
    }

    if (
      clickObject.element.hasAttribute &&
			clickObject.element.hasAttribute('nist-voice')
    ) {
      return;
    }
   
    for (const i of UDAClickObjects) {
      if (i.element.isSameNode(clickObject.element)) {
        // todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
        return;
      }
    }

    clickObject.id = UDAClickObjects.length;
    UDAClickObjects.push(clickObject);
  } catch (e) {
    const htmlelement = node.innerHTML;
    console.log(e)
    if(htmlelement) {
      UDAErrorLogger.error(
        'Unable to process clickable object - ' + htmlelement,
        e,
      );
    }
  }
}

// processing node from mutation and then send to clickbojects addition
export function UDAProcessNode(node: HTMLElement) {
  const processchildren = true;

  if (node.onclick != undefined) {
    UDAAddNewElement(node);
  }

  // switched to switch case condition from if condition
  if (node.tagName) {
    switch (node.tagName.toLowerCase()) {
      case 'a':
        if (node instanceof HTMLAnchorElement && node?.href !== undefined) {
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
        } else if (
          node.hasAttribute('type') &&
					node.getAttribute('type') === 'submit'
        ) {
          UDAAddNewElement(node);
        } else if (
          node.classList &&
					(node.classList.contains('expand-button') ||
						node.classList.contains('btn-pill'))
        ) {
          UDAAddNewElement(node);
        } else {
          //UDAConsoleLogger.info({node});
        }
        break;
      case 'span':
        if (node.classList && node.classList.contains('select2-selection')) {
          UDAAddNewElement(node);
        } else if (
          node.hasAttribute('ng-click') ||
					node.hasAttribute('onclick')
        ) {
          UDAAddNewElement(node);
        }
        break;
        // fix for editor issue
      case 'ckeditor':
        UDAAddNewElement(node);
        break;
      case 'div':
        if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
          UDAAddNewElement(node);
        }
        break;
    }
  }

  if (node.classList && node.classList.contains('dropdown-toggle')) {
    UDAAddNewElement(node);
  }

  if (node.children && node?.children?.length && processchildren) {
    for (const i of Array.from(node?.children)) {
      UDAProcessNode(i as HTMLElement);
    }
  }
}

// removal of clickbojects via mutation observer
export function UDAProcessRemovedNode(node: any) {
  let _index = 0;
  for (const j of UDAClickObjects) {
    if (node.isEqualNode(j.element)) {
      let addtoremovenodes = true;
      // removedclickobjectcounter:
      for (const k of UDARemovedClickObjects) {
        if (node.isEqualNode(k.element)) {
          addtoremovenodes = false;
          break;
        }
      }
      if (addtoremovenodes) {
        UDARemovedClickObjects.push(j);
      }
      UDAClickObjects.splice(_index, 1);
      _index++;
      break;
    }
  }
  if (node.children) {
    for (const i of node.children) {
      UDAProcessRemovedNode(i);
    }
  }
}

export async function UDAdigestMessage(textmessage: string, algorithm: any) {
  const encoder = new TextEncoder();
  const data = encoder.encode(textmessage);
  const hash = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
  const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''); // convert bytes to hex string
  return hashHex;
}

let UDALastMutationTime = 0;
// mutation observer initialization and adding the logic to process the clickobjects
export const DSA_OBSERVER = new MutationObserver(function(mutations) {
  // UDAConsoleLogger.info('------------ detected clicked objects-------------');
  // UDAConsoleLogger.info(UDAClickObjects);
  mutations.forEach(function(mutation) {
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
