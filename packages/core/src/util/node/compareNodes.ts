// This module provides a function for recursively comparing two DOM nodes represented as JSON objects.
// It is used to match a recorded node with a node from the current DOM during playback.

import {nodeConfig} from "./nodeConfig";
import {jaroWinkler} from "jaro-winkler-typescript";
import {UDAConsoleLogger} from "../error";

/**
 * Recursively compares two nodes (a candidate node and a recorded node) to determine if they match.
 * The comparison is based on a scoring system that checks properties, attributes, and structure.
 *
 * @param compareNode The candidate node from the current DOM, as a JSON object.
 * @param recordedNode The node from the recording, as a JSON object.
 * @param isPersonalNode A boolean indicating if the comparison should use rules for "personal" nodes.
 * @param match An object that accumulates the matching score and other metadata during the comparison.
 * @returns An object containing the results of the comparison, including the total properties checked (`count`),
 *          the number of matched properties (`matched`), a list of unmatched properties (`unmatched`),
 *          and flags for special conditions like `innerTextFlag`.
 */
export const compareNodes = (compareNode: any, recordedNode: any, isPersonalNode = false, match: any = {
  count: 0,
  matched: 0,
  unmatched: [],
  innerTextFlag: false,
  innerChildNodes: 0
}) => {
  // Sum the number of child nodes to adjust the matching score later.
  if (compareNode.hasOwnProperty('childNodes')) {
    match.innerChildNodes = match.innerChildNodes + compareNode.childNodes.length;
  }

  // Iterate over the properties of the recorded node to compare them with the candidate node.
  for (let key in recordedNode) {

    /**
     * Angular's View Encapsulation can generate dynamic HTML attributes prefixed with "_ng".
     * These attributes need to be ignored during pattern matching for playback to be reliable.
     * This logic can be extended for other frameworks like Vue.
     */
    let ignoreAttribute: boolean = false;
    try {
      for (const ignoreText of (nodeConfig.ignoreDynamicAttributeText || [])) {
        if (typeof ignoreText !== 'string' || ignoreText.length === 0) continue; // Skip empty or invalid entries.
        if (key.indexOf(ignoreText) !== -1) {
          ignoreAttribute = true;
          break;
        }
      }
    } catch (_) { /* Ignore errors during this check. */ }

    if(ignoreAttribute === true){
      continue;
    }

    // Ignore attributes that are configured to be skipped.
    if ((window as any)?.udaSpecialNodes?.ignoreDuringCompare?.attributes?.indexOf?.(key) !== -1) {
      continue;
    } else if (key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1) {
      continue;
    } else {
      match.count++;
    }

    // Recursively compare nested objects.
    if (compareNode.hasOwnProperty(key) && (typeof recordedNode[key] === 'object') && (typeof compareNode[key] === 'object')) {
      match.matched++;
      match = compareNodes(compareNode[key], recordedNode[key], isPersonalNode, match);
    }
    // Recursively compare arrays of child nodes.
    else if (compareNode.hasOwnProperty(key) && Array.isArray(recordedNode[key]) && recordedNode[key].length > 0 && Array.isArray(compareNode[key]) && compareNode[key].length > 0) {
      match.matched++;
      if (compareNode.nodeName === 'select' && key === 'childNodes') {
        continue; // Don't compare options of a select box in detail.
      } else if (compareNode[key].length === recordedNode[key].length) {
        match.matched++;
        for (let i = 0; i < recordedNode[key].length; i++) {
          match = compareNodes(compareNode[key][i], recordedNode[key][i], isPersonalNode, match);
        }
      }
    }
    // Special handling for class names to allow for minor differences.
    else if ((key === 'class' || key === 'className') && recordedNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key)) {
      // Clean up class names by removing dynamic or irrelevant classes.
      compareNode[key] = compareNode[key].replace(' ng-star-inserted', '').replace('disabled', '').replace('writeInput', '').replace('undefined','').trim();
      recordedNode[key] = recordedNode[key].replace(' ng-star-inserted', '').replace('disabled', '').replace('writeInput', '').replace('undefined','').trim();
      if (compareNode[key] === recordedNode[key]) {
        match.matched++;
      } else {
        // Use Jaro-Winkler distance for fuzzy matching of class names.
        let weight = jaroWinkler(recordedNode[key], compareNode[key]);
        if (weight > nodeConfig.JARO_WEIGHT_PERSONAL) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: recordedNode[key]
          });
        }
      }
    }
    // Give more weight to matching innerText.
    else if (key === 'innerText' && recordedNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key) && (String(compareNode[key]).trim().toLowerCase() === String(recordedNode[key]).trim().toLowerCase())) {
      UDAConsoleLogger.info(compareNode[key].trim());
      UDAConsoleLogger.info(recordedNode[key].trim());
      match.innerTextFlag = true;
      // Add the base match score plus a configured weight.
      match.matched = match.matched + 1 + nodeConfig.innerTextWeight;
    }
    // Exact match for other properties.
    else if (compareNode.hasOwnProperty(key) && compareNode[key] === recordedNode[key]) {
      match.matched++;
    }
    // Special case for 'href' attribute to allow for partial matches.
    else if (compareNode.hasOwnProperty(key) && compareNode[key] !== recordedNode[key] && key === 'href' && recordedNode[key].indexOf(compareNode[key]) !== -1) {
      match.matched++;
    }
    // Fuzzy matching for 'id' and 'name' attributes.
    else if (compareNode.hasOwnProperty(key) && (key === 'id' || key === 'name') && compareNode[key] !== recordedNode[key]) {
      let weight = jaroWinkler(recordedNode[key], compareNode[key]);
      if (weight > 0.90) {
        match.matched++;
      }
    }
    // Handle cases where innerText or outerText might be empty or undefined.
    else if ((key === 'innerText' || key === 'outerText') && typeof compareNode[key] === 'undefined') {
      let trimmedRecordedNode = recordedNode[key].trim();
      if(trimmedRecordedNode === null || trimmedRecordedNode === '' || trimmedRecordedNode === 'null') {
        match.matched++;
      } else if(isPersonalNode && (trimmedRecordedNode === null || trimmedRecordedNode === '' || trimmedRecordedNode === 'null' || compareNode[key] === undefined)) {
        match.matched++;
      } else {
        match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: recordedNode[key]});
      }
    }
    // Special handling for "personal" nodes, ignoring certain attributes.
    else if (isPersonalNode && nodeConfig.personalNodeIgnoreAttributes.indexOf(key) !== -1) {
      if (key === 'innerText') {
        match.innerTextFlag = true;
        match.matched = match.matched + 1 + nodeConfig.innerTextWeight;
      } else {
        match.matched++;
      }
    }
    // Ignore URL-related properties if the "enableForAllDomains" flag is set.
    else if(window.UDAGlobalConfig.enableForAllDomains && (key === 'origin' || key === 'href' || key === 'host' || key === 'hostname' || key === 'search')) {
      match.matched++;
    } else {
      match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: recordedNode[key]});
    }
  }
  return match;
}
