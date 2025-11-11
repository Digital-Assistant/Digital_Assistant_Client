import { apiClient } from './apiClient';
import { CONFIG } from '../config';
import { parseDomain, fromUrl } from 'parse-domain';
import { checkNodeObjectKeyValue } from '../util/checkNodeObjectKeyValue';
import { store } from '../store';
import { setRecSequenceData } from '../store/slices';

declare const UDAClickObjects: any;
declare const global: any;
declare const UDAGlobalConfig: any;

class DomService {
  private observer: MutationObserver;
  private specialNodes: any;

  constructor() {
    this.observer = new MutationObserver(this.handleDomChanges.bind(this));
  }

  public start() {
    this.observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  public stop() {
    this.observer.disconnect();
  }

  private handleDomChanges() {
    try {
      const state: any = (store as any).getState?.() || {};
      if (state?.recording?.isRecording) {
        this.addBodyEvents();
      }
    } catch (e) {
      // ignore
    }
  }

  public async addBodyEvents() {
    const els = document.body.querySelectorAll('*');
    for (let i = 0; i < els.length; i++) {
      const element = els[i] as HTMLElement;
      try {
        // Delegate clickable decision to original util logic
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { isClickableNode } = require('../util/recording/isClickableNode');
        if (element && isClickableNode(element)) {
          this.addClickToNode(element);
        }
      } catch (e) {
        // Ignore errors
        // console.error(e);
      }
    }
  }

  // @ts-ignore
    private getNodeInfo(element: HTMLElement) {
    if (!element) return null;
    const tagName = element.tagName.toLowerCase();
    const classNames = element.className.toString().split(' ').filter(c => c && c.trim() !== 'uda_highlighted');
    const parent: any = element.parentElement ? this.getNodeInfo(element.parentElement) : null;

    return {
      tagName,
      id: element.id,
      classNames,
      innerText: element.innerText,
      attributes: {
        name: element.getAttribute('name'),
        type: element.getAttribute('type'),
        placeholder: element.getAttribute('placeholder'),
        value: (element as HTMLInputElement).value,
        href: element.getAttribute('href'),
        title: element.getAttribute('title'),
      },
      parent,
    };
  }


  private addEvent(node: HTMLElement, eventName: string) {
    console.log(`Custom event ${eventName} was triggered on node ${node.tagName}`);
  }

  public addClickToNode(element: HTMLElement) {
    try {
      // Respect ignore class like original util
      if ((element as any)?.classList && (element as any).classList.contains('uda_exclude')) {
        return;
      }
      // Use property flag as in original implementation
      if ((element as any).hasOwnProperty('addedClickRecord') && (element as any).addedClickRecord === true) {
        return;
      }

      const nodeName = element.nodeName.toLowerCase();
      const attach = () => {
        element.addEventListener(
          'click',
          () => {
            try {
              const nodeInfo = this.getNodeInfo(element);
              const state: any = (store as any).getState();
              const recSequenceData = state?.recording?.recSequenceData || [];
              const updatedSequence = [...recSequenceData, nodeInfo];
              (store as any).dispatch(setRecSequenceData(updatedSequence));
            } catch {
              // ignore
            }
          },
          { once: false }
        );
      };

      switch (nodeName) {
        case 'a':
        case 'select':
          attach();
          break;
        case 'input': {
          if (!element.hasAttribute('type')) {
            attach();
            (element as any).addedClickRecord = true;
            return element;
          }
          const inputType = element.getAttribute('type')?.toLowerCase();
          switch (inputType) {
            case 'email':
            case 'text':
            case 'button':
            case 'color':
            case 'date':
            case 'datetime-local':
            case 'file':
            case 'hidden':
            case 'image':
            case 'month':
            case 'number':
            case 'password':
            case 'range':
            case 'reset':
            case 'search':
            case 'submit':
            case 'tel':
            case 'time':
            case 'url':
            case 'textarea':
            case 'week':
            case 'checkbox':
            case 'radio':
              attach();
              break;
            default:
              attach();
              break;
          }
          break;
        }
        case 'mat-select':
        case 'textarea':
        case 'button':
        case 'tr':
        default:
          attach();
          break;
      }
      (element as any).addedClickRecord = true;
      return element;
    } catch {
      // ignore errors
    }
  }

  private checkNodeValues(element: HTMLElement, type: string): boolean {
    let exists = false;
    if (this.specialNodes && this.specialNodes[type] && element) {
      checkNodeLoop:
      for (const key in this.specialNodes[type]) {
        if (checkNodeObjectKeyValue(element, key, this.specialNodes[type][key], type)) {
          exists = true;
          break checkNodeLoop;
        }
      }
    }
    return exists;
  }

  public isClickableNode(element: HTMLElement) {
    if (!element) return false;

    /*if(element.hasAttribute("udaIgnoreChildren")) {
      element.removeAttribute("udaIgnoreChildren");
    }

    if(element.hasAttribute("udaIgnoreNode")) {
      element.removeAttribute("udaIgnoreNode");
    }*/

    const isUdaPanel: any = element.closest('#udan-react-root');
    if (isUdaPanel) {
      return false;
    }

    //add the record click for parent element and ignore the children
    const closestParent: any = element.closest('[udaIgnoreChildren]');
    if (closestParent) {
      return false;
    }

    let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";

    // checking the node exists in the included list for further processing.
    if (this.checkNodeValues(element, 'include')) {
      isAllowedElement = true;
    }

    //Check the clickable element exists in clickable objects
    if (!isAllowedElement) {
      clickObjectLoop:
      for (let i = 0; i < UDAClickObjects?.length; i++) {
        if (element.isSameNode(UDAClickObjects[i].element)) {
          isAllowedElement = true;
          break clickObjectLoop;
        }
      }
    }

    // checking the node exists in the children ignore list for further processing.
    if (this.checkNodeValues(element, 'ignoreChildren')) {
      if (!element.hasAttribute('udaIgnoreChildren')) {
        element.setAttribute('udaIgnoreChildren', String(true));
        isAllowedElement = true;
      }
    }

    if (this.checkNodeValues(element, 'ignoreClicksOnNodes')) {
      if (!element.hasAttribute('udaIgnoreClick')) {
        element.setAttribute('udaIgnoreClick', String(true));
        isAllowedElement = false;
      }
    }

    // checking the node exists in the excluded list for further processing.
    if (isAllowedElement && this.checkNodeValues(element, 'exclude')) {
      isAllowedElement = false;
    }

    return isAllowedElement;
  }


  public async initSpecialNodes() {
    this.specialNodes = await apiClient.fetchSpecialNodes();

    // Expose specialNodes globally to preserve original utility behavior
    try {
      (window as any).udaSpecialNodes = this.specialNodes;
    } catch {
      /* noop for non-browser env */
    }

    const children = this.getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
    );

    if (!children || !this.specialNodes) {
      return;
    }

    for (let i = 0; i < children.length; i++) {
      try {
        const child = children[i] as HTMLElement;
        if (
          child &&
          !this.specialNodes?.exclude?.tags?.includes(
            child?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          child.className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) === -1
        ) {
          child.className += ' ' + CONFIG.UDA_CLICK_IGNORE_CLASS;
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }

  public getAllChildren(htmlElement: any): Element[] {
    let allChildElements: Element[] = [];
    try {
      if (htmlElement?.children?.length === 0) return [htmlElement];

      for (let i = 0; i < htmlElement?.children?.length; i++) {
        let children: any = this.getAllChildren(htmlElement.children[i]);
        if (children) allChildElements.push(...children);
      }
      allChildElements.push(htmlElement);
    } catch (e) {
      // Ignore errors
    }
    return allChildElements;
  }

  public async squeezeBody(hide: boolean) {
    if (!global.UDAGlobalConfig.enableOverlay) {
      let documentBody = document.body;
      if (!hide) {
        documentBody.style.maxWidth = '77%';
        documentBody.style.minWidth = '77%';
        documentBody.style.float = 'left';
      } else {
        documentBody.style.maxWidth = '100%';
        documentBody.style.minWidth = '100%';
        documentBody.style.float = 'none';
      }
    }
  }

  public getAbsoluteOffsets(element: HTMLElement): { x: number; y: number } {
    let cords = { x: 0, y: 0 };
    try {
      let currentElement: any = element;

      while (currentElement !== null) {
        cords.x += currentElement.offsetLeft;
        cords.x -= currentElement.scrollLeft;
        cords.y += currentElement.offsetTop;
        cords.y -= currentElement.scrollTop;
        currentElement = currentElement.offsetParent;
      }
    } catch (e) {
      console.log(e);
    }

    return cords;
  }

  public fetchDomain(): string {
    let domain = window.location.hostname;
    try {
      const parseResult: any = parseDomain(fromUrl(window.location.href));
      if (parseResult.type === "listed") {
        const { domain: parsedDomain, topLevelDomains } = parseResult;
        if (parsedDomain && topLevelDomains) {
          domain = `${parsedDomain}.${topLevelDomains.join('.')}`;
        }
      }
    } catch (e) {
      // ignore any error
      console.log(e);
    }
    return domain;
  }

}

export const domService = new DomService();
