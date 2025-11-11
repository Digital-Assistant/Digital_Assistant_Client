/* eslint-disable @typescript-eslint/no-explicit-any */
import { jaroWinkler } from 'jaro-winkler-typescript';

// Maintain compatibility with globals used by original implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const udaSpecialNodes: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const UDAGlobalConfig: any;

// Minimal CONFIG fields required by compare logic
const CONFIG = {
  JARO_WEIGHT_PERSONAL: 0.9,
  innerTextWeight: 5,
  // map of substrings to ignore in attribute names (e.g., _ng)
  ignoreDynamicAttributeText: {
    _ng: true,
  } as Record<string, boolean>,
};

/**
 * Parity implementation of UI compareNodes used during playback search.
 * Logic mirrored with added guards; logs removed.
 */
export const compareNodes = (
  compareNode: any,
  recordedNode: any,
  isPersonalNode = false,
  match = {
    count: 0,
    matched: 0,
    unmatched: [] as Array<{ key: string; compareNodeValues: any; recordedNodeValues: any }>,
    innerTextFlag: false,
    innerChildNodes: 0,
  }
) => {
  // sum the childnodes
  if (compareNode && Object.prototype.hasOwnProperty.call(compareNode, 'childNodes')) {
    match.innerChildNodes = match.innerChildNodes + (compareNode.childNodes?.length || 0);
  }

  for (const rawKey in recordedNode) {
    const key = rawKey as string;

    // Ignore dynamically generated attributes like Angular _ng*
    let ignoreAttribute = false;
    try {
      for (const ignoreText in CONFIG.ignoreDynamicAttributeText) {
        if (key.indexOf(ignoreText) !== -1) {
          ignoreAttribute = true;
          break;
        }
      }
    } catch {
      /* noop */
    }
    if (ignoreAttribute) continue;

    // skip ignored attributes
    const ignoredList = (udaSpecialNodes && udaSpecialNodes.ignoreDuringCompare && udaSpecialNodes.ignoreDuringCompare.attributes) || [];
    if (ignoredList.indexOf(key) !== -1) {
      continue;
    } else if (key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1) {
      continue;
    } else {
      match.count++;
    }

    if (Object.prototype.hasOwnProperty.call(compareNode, key) && typeof recordedNode[key] === 'object' && typeof compareNode[key] === 'object') {
      match.matched++;
      match = compareNodes(compareNode[key], recordedNode[key], isPersonalNode, match);
    } else if (
      Object.prototype.hasOwnProperty.call(compareNode, key) &&
      Array.isArray(recordedNode[key]) && recordedNode[key].length > 0 &&
      Array.isArray(compareNode[key]) && compareNode[key].length > 0
    ) {
      match.matched++;
      if (compareNode.nodeName === 'select' && key === 'childNodes') {
        continue;
      } else if (compareNode[key].length === recordedNode[key].length) {
        match.matched++;
        for (let i = 0; i < recordedNode[key].length; i++) {
          match = compareNodes(compareNode[key][i], recordedNode[key][i], isPersonalNode, match);
        }
      }
    } else if ((key === 'class' || key === 'className') && Object.prototype.hasOwnProperty.call(recordedNode, key) && Object.prototype.hasOwnProperty.call(compareNode, key)) {
      const clean = (v: any) => String(v || '')
        .replace(' ng-star-inserted', '')
        .replace('disabled', '')
        .replace('writeInput', '')
        .replace('undefined', '')
        .trim();
      const c = clean(compareNode[key]);
      const r = clean(recordedNode[key]);
      if (c === r) {
        match.matched++;
      } else {
        const weight = jaroWinkler(r, c);
        if (weight > CONFIG.JARO_WEIGHT_PERSONAL) {
          match.matched++;
        } else {
          match.unmatched.push({ key, compareNodeValues: c, recordedNodeValues: r });
        }
      }
    } else if (
      key === 'innerText' &&
      Object.prototype.hasOwnProperty.call(recordedNode, key) &&
      Object.prototype.hasOwnProperty.call(compareNode, key) &&
      String(compareNode[key]).trim().toLowerCase() === String(recordedNode[key]).trim().toLowerCase()
    ) {
      match.innerTextFlag = true;
      match.matched = match.matched + CONFIG.innerTextWeight;
    } else if (Object.prototype.hasOwnProperty.call(compareNode, key) && compareNode[key] === recordedNode[key]) {
      match.matched++;
    } else if (
      Object.prototype.hasOwnProperty.call(compareNode, key) &&
      compareNode[key] !== recordedNode[key] &&
      key === 'href' &&
      String(recordedNode[key] || '').indexOf(String(compareNode[key] || '')) !== -1
    ) {
      match.matched++;
    } else if (
      Object.prototype.hasOwnProperty.call(compareNode, key) &&
      (key === 'id' || key === 'name') &&
      compareNode[key] !== recordedNode[key]
    ) {
      const weight = jaroWinkler(String(recordedNode[key] || ''), String(compareNode[key] || ''));
      if (weight > 0.9) {
        match.matched++;
      }
    } else if ((key === 'innerText' || key === 'outerText') && typeof (compareNode as any)[key] === 'undefined') {
      const trimmedRecordedNode = String(recordedNode[key] || '').trim();
      if (trimmedRecordedNode === '' || trimmedRecordedNode === 'null') {
        match.matched++;
      } else if (isPersonalNode && (trimmedRecordedNode === '' || trimmedRecordedNode === 'null' || (compareNode as any)[key] === undefined)) {
        match.matched++;
      } else {
        match.unmatched.push({ key, compareNodeValues: (compareNode as any)[key], recordedNodeValues: recordedNode[key] });
      }
    } else if (isPersonalNode && ['innerText'].indexOf(key) !== -1) {
      // mark innerText matched for personal nodes
      if (key === 'innerText') {
        match.innerTextFlag = true;
        match.matched = match.matched + CONFIG.innerTextWeight;
      } else {
        match.matched++;
      }
    } else if (
      (UDAGlobalConfig && UDAGlobalConfig.enableForAllDomains) &&
      (key === 'origin' || key === 'href' || key === 'host' || key === 'hostname' || key === 'search')
    ) {
      match.matched++;
    } else {
      match.unmatched.push({ key, compareNodeValues: (compareNode as any)[key], recordedNodeValues: recordedNode[key] });
    }
  }
  return match;
};
