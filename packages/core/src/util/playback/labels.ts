/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Label helpers migrated from UI util/index.ts to support playback fallbacks.
 * Logic preserved; only guards added.
 */

export const getDirectInnerText = (element: any): string => {
  const x: any[] = [];
  let child = element?.firstChild || null;
  while (child) {
    if (child.nodeType == 3) {
      x.push(child.nodeValue);
    } else if (child.nodeType == 1) {
      const ii: any = getDirectInnerText(child);
      if (ii && ii.length > 0) x.push(ii);
    }
    child = child.nextSibling;
  }
  return x.join(' ');
};

export const getSelectedTextFromSelectBox = (node: any) => {
  try {
    return node?.options?.[node?.selectedIndex]?.text || '';
  } catch {
    return '';
  }
};

export const getLabelsForInputElement = (element: any) => {
  let labels: any = [];
  const id = element?.id;
  const name = element?.name;
  let el: any = null;

  if (id) el = document.querySelector("label[for='" + id + "']");
  if (name && !el) el = document.querySelector("label[for='" + name + "']");

  if (el) {
    labels = getDirectInnerText(el);
    if (labels) return String(labels).trim();
  }

  while ((element = element?.parentNode)) {
    if (element?.tagName?.toLowerCase() == 'label') {
      labels.push(element?.innerText());
    }
  }
  return String(labels).trim();
};

/**
 * Copy of getNodeLabels from UI (simplified with guards).
 */
export const getNodeLabels = (
  node: any,
  inputlabels: any,
  iterationno: any,
  iterate = true,
  getchildlabels = true,
  fromclick = false,
  iteratelimit = 3,
  ignorenode: any = []
) => {
  if (!node) return inputlabels;

  try {
    if (Array.isArray(ignorenode)) {
      ignorenode = node;
    }

    if (
      (node.nodeName?.toLowerCase() === 'select' || node.nodeName?.toLowerCase() === 'checkbox') &&
      iterate &&
      inputlabels.length === 0
    ) {
      iterationno++;
      inputlabels = getNodeLabels(
        node?.parentNode,
        inputlabels,
        iterationno,
        iterate,
        true,
        fromclick,
        iteratelimit,
        ignorenode
      );
    }

    if (
      node.nodeName?.toLowerCase() === 'input' ||
      node.nodeName?.toLowerCase() === 'textarea' ||
      node.nodeName?.toLowerCase() === 'img'
    ) {
      const ph = node.getAttribute?.('placeholder');
      if (ph && ph !== '') {
        inputlabels.push({ text: String(ph), match: false });
      }
      const type = node.getAttribute?.('type');
      if (type && (String(type).toLowerCase() === 'submit' || String(type).toLowerCase() === 'file')) {
        const val = node.getAttribute?.('value');
        if (val) {
          inputlabels.push({ text: String(val), match: false });
          iterate = false;
        }
      }
      const alt = node.getAttribute?.('alt');
      if (alt) {
        inputlabels.push({ text: String(alt), match: false });
      }
    }

    if (getchildlabels && node.childNodes?.length > 0) {
      const childNodes = node.childNodes;
      childNodes?.forEach?.((childNode: any) => {
        const name = childNode?.nodeName?.toLowerCase?.() || '';
        if (name !== 'script' && name !== 'select' && name !== '#comment') {
          const textcontent = String(childNode?.textContent || '')
            .replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim();
          if (
            textcontent !== '' &&
            typeof ignorenode?.isSameNode === 'function' &&
            ignorenode?.isSameNode(childNode) === false
          ) {
            inputlabels.push({ text: textcontent, match: false });
          }
        }
      });
    }

    const dt = node.getAttribute?.('data-tooltip');
    if (inputlabels.length === 0 && dt) {
      inputlabels.push({ text: String(dt), match: false });
    }

    const al = node.getAttribute?.('aria-label');
    if (inputlabels.length === 0 && al) {
      inputlabels.push({ text: String(al), match: false });
    }

    // fix for image tags
    if (iterate && node.nodeName?.toLowerCase() !== 'img' && inputlabels.length === 0 && iterationno <= iteratelimit) {
      iterationno++;
      inputlabels = getNodeLabels(
        node.parentNode,
        [],
        iterationno,
        iterate,
        getchildlabels,
        fromclick,
        iteratelimit,
        null
      );
    }

    if (inputlabels.length === 0 && node.id) {
      inputlabels.push({ text: `${String(node.nodeName).toLowerCase()}-${node.id}`, match: false });
    } else if (inputlabels.length === 0 && node.className) {
      const classname = String(node.className);
      inputlabels.push({ text: `${String(node.nodeName).toLowerCase()}-${classname.replace(' ', '-')}`, match: false });
    } else if (inputlabels.length === 0) {
      inputlabels.push({ text: String(node.nodeName).toLowerCase(), match: false });
    }
  } catch {
    // ignore
  }
  return inputlabels;
};
