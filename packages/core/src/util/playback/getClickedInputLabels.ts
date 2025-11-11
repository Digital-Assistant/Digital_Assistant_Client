/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNodeLabels, getLabelsForInputElement, getSelectedTextFromSelectBox } from './labels';

/**
 * Parity copy of UI getClickedInputLabels with minimal guards.
 */
export const getClickedInputLabels = (node: HTMLElement, fromDocument = false, selectchange = false): string | null => {
  if (!node) return null;
  let inputLabels: any = '';
  const nodeName = node.nodeName.toLowerCase();
  let textLabels: any[] = [];

  try {
    inputLabels = getLabelsForInputElement(node);
    if (inputLabels) return inputLabels as string;
  } catch {
    // ignore
  }

  switch (nodeName) {
    case 'select':
      if (selectchange) {
        inputLabels = getSelectedTextFromSelectBox(node);
      } else {
        textLabels = getNodeLabels(node, [], 1, true, false, true);
        if (textLabels.length > 0) {
          const labels: string[] = [];
          for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
          inputLabels = labels.toString();
        }
      }
      break;
    case 'input':
      if (!node.hasAttribute('type')) {
        textLabels = getNodeLabels(node, [], 1, true, true, true);
        if (textLabels.length > 0) {
          const labels: string[] = [];
          for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
          inputLabels = labels.toString();
        }
      } else {
        switch (node?.getAttribute('type')?.toLowerCase()) {
          default: {
            textLabels = getNodeLabels(node, [], 1, true, true, true);
            if (textLabels.length > 0) {
              const labels: string[] = [];
              for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
              inputLabels = labels.toString();
            }
          }
        }
        break;
      }
      break;
    case 'textarea':
      textLabels = getNodeLabels(node, [], 1, true, true, true);
      if (textLabels.length > 0) {
        const labels: string[] = [];
        for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
        inputLabels = labels.toString();
      }
      break;
    case 'img':
      textLabels = getNodeLabels(node, [], 1, true, false, true);
      if (textLabels.length > 0) {
        const labels: string[] = [];
        for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
        inputLabels = labels.toString();
      }
      break;
    default:
      if (!node?.children?.length && node?.innerText?.trim()?.length > 0) {
        return node?.innerText;
      }
      textLabels = getNodeLabels(node, [], 1, false, true, true);
      if (textLabels.length > 0) {
        const labels: string[] = [];
        for (let j = 0; j < textLabels.length; j++) labels.push(textLabels[j].text);
        inputLabels = labels.toString();
      }
  }
  return inputLabels as string;
};
